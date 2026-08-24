#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, relative, resolve, sep } from 'node:path';

const args = process.argv.slice(2);

const readArg = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const sourceRoot = resolve(readArg('--source') ?? process.cwd());
const targetValue = readArg('--target') ?? process.env.MEDIASFU_PUBLIC_REACT_ROOT;
const jsonOutput = args.includes('--json');

if (!targetValue) {
  console.error(
    'Usage: node scripts/check-public-sync.mjs --target <public-repository> [--source <private-repository>] [--json]',
  );
  process.exit(2);
}

const targetRoot = resolve(targetValue);

for (const [label, root] of [
  ['source', sourceRoot],
  ['target', targetRoot],
]) {
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    console.error(`${label} repository does not exist: ${root}`);
    process.exit(2);
  }
}

const excludedDirectories = new Set([
  '.git',
  '.local-validation',
  '.codex-notes',
  'build',
  'coverage',
  'dist',
  'docs',
  'node_modules',
  'storybook-static',
]);

const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.scss',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
]);

const isPrivateOnly = (relativePath) =>
  relativePath.split('/').includes('components_limited');

const intentionalPublicOnlyPaths = new Set([
  // Retained by the GitHub demo application; it is excluded from the npm package.
  'public/favicon.svg',
]);

const isTransientFile = (relativePath) => {
  const name = basename(relativePath).toLowerCase();
  return (
    name.endsWith('.bak') ||
    name.includes('.backup') ||
    name.endsWith('.log') ||
    name.endsWith('.tgz') ||
    name === 'npm-debug.log' ||
    name === 'yarn-error.log'
  );
};

const normalizedHash = (absolutePath) => {
  let content = readFileSync(absolutePath);
  if (textExtensions.has(extname(absolutePath).toLowerCase())) {
    const normalizedText = content
      .toString('utf8')
      .replace(/^\uFEFF/, '')
      .replace(/\r\n/g, '\n')
      .replace(/\n+$/, '');
    content = Buffer.from(`${normalizedText}\n`);
  }
  return createHash('sha256').update(content).digest('hex');
};

const collect = (root) => {
  const files = new Map();
  const ignored = [];

  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = resolve(directory, entry.name);
      const relativePath = relative(root, absolutePath).split(sep).join('/');

      if (entry.isDirectory()) {
        if (excludedDirectories.has(entry.name)) {
          ignored.push(`${relativePath}/`);
          continue;
        }
        visit(absolutePath);
        continue;
      }

      if (!entry.isFile() || isTransientFile(relativePath)) {
        ignored.push(relativePath);
        continue;
      }

      const stats = statSync(absolutePath);
      files.set(relativePath, {
        hash: normalizedHash(absolutePath),
        modifiedAt: stats.mtime.toISOString(),
        privateOnly: isPrivateOnly(relativePath),
      });
    }
  };

  visit(root);
  return { files, ignored };
};

const source = collect(sourceRoot);
const target = collect(targetRoot);
const result = {
  sourceRoot,
  targetRoot,
  summary: {
    equal: 0,
    changed: 0,
    sourceOnly: 0,
    targetOnly: 0,
    intentionalPrivateOnly: 0,
    intentionalPublicOnly: 0,
    privateLeaks: 0,
    ignoredSourceEntries: source.ignored.length,
    ignoredTargetEntries: target.ignored.length,
  },
  changed: [],
  sourceOnly: [],
  targetOnly: [],
  intentionalPrivateOnly: [],
  intentionalPublicOnly: [],
  privateLeaks: [],
};

const allPaths = [...new Set([...source.files.keys(), ...target.files.keys()])].sort();

for (const relativePath of allPaths) {
  const sourceFile = source.files.get(relativePath);
  const targetFile = target.files.get(relativePath);

  if (sourceFile?.privateOnly) {
    if (targetFile) {
      result.privateLeaks.push(relativePath);
      result.summary.privateLeaks += 1;
    } else {
      result.intentionalPrivateOnly.push(relativePath);
      result.summary.intentionalPrivateOnly += 1;
    }
    continue;
  }

  if (!sourceFile) {
    if (intentionalPublicOnlyPaths.has(relativePath)) {
      result.intentionalPublicOnly.push(relativePath);
      result.summary.intentionalPublicOnly += 1;
    } else {
      result.targetOnly.push(relativePath);
      result.summary.targetOnly += 1;
    }
  } else if (!targetFile) {
    result.sourceOnly.push(relativePath);
    result.summary.sourceOnly += 1;
  } else if (sourceFile.hash !== targetFile.hash) {
    result.changed.push({
      path: relativePath,
      sourceModifiedAt: sourceFile.modifiedAt,
      targetModifiedAt: targetFile.modifiedAt,
    });
    result.summary.changed += 1;
  } else {
    result.summary.equal += 1;
  }
}

const hasDrift =
  result.summary.changed > 0 ||
  result.summary.sourceOnly > 0 ||
  result.summary.targetOnly > 0 ||
  result.summary.privateLeaks > 0;

if (jsonOutput) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`MediaSFU React private/public parity`);
  console.log(`source: ${sourceRoot}`);
  console.log(`target: ${targetRoot}`);
  console.log(JSON.stringify(result.summary, null, 2));

  const printList = (label, values) => {
    if (values.length === 0) return;
    console.log(`\n${label} (${values.length})`);
    for (const value of values) {
      console.log(`- ${typeof value === 'string' ? value : `${value.path} [source ${value.sourceModifiedAt}; target ${value.targetModifiedAt}]`}`);
    }
  };

  printList('Changed', result.changed);
  printList('Source only', result.sourceOnly);
  printList('Target only', result.targetOnly);
  printList('Private-only files present in target', result.privateLeaks);
  printList('Intentional private-only files', result.intentionalPrivateOnly);
  printList('Intentional public-only files', result.intentionalPublicOnly);
}

process.exitCode = hasDrift ? 1 : 0;
