import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

// Compile the actual Markdown examples against source exports, without
// generating files or depending on an older installed SDK build.
const root = resolve(import.meta.dirname, '..');
const virtual = new Map();
const normalize = path => resolve(path).replaceAll('\\', '/').toLowerCase();
for (const name of ['README.md', 'HEADLESS_GUIDE.md']) {
  const markdown = readFileSync(resolve(root, name), 'utf8');
  const examples = markdown.matchAll(/<!-- checked-example: ([\w-]+) -->\s*```tsx?\r?\n([\s\S]*?)\r?\n```/g);
  for (const [, id, code] of examples) {
    const filename = resolve(root, `__docs_${id}.tsx`);
    assert(!virtual.has(normalize(filename)), `Duplicate example: ${id}`);
    virtual.set(normalize(filename), { filename, code });
  }
}
assert.equal(virtual.size, 4, 'The custom meeting, background, and two breakout examples must be checked.');
const config = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile);
assert(!config.error, 'TypeScript configuration must be readable.');
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
Object.assign(options, {
  noEmit: true, incremental: false, declaration: false, declarationMap: false,
  declarationDir: undefined,
  paths: { ...options.paths, 'mediasfu-reactjs': [resolve(root, 'src/main.tsx')] },
});
const host = ts.createCompilerHost(options);
const originalRead = host.readFile.bind(host);
const originalExists = host.fileExists.bind(host);
const originalSource = host.getSourceFile.bind(host);
host.readFile = file => virtual.get(normalize(file))?.code ?? originalRead(file);
host.fileExists = file => virtual.has(normalize(file)) || originalExists(file);
host.getSourceFile = (file, language, onError, shouldCreate) => {
  const example = virtual.get(normalize(file));
  return example
    ? ts.createSourceFile(file, example.code, language, true, ts.ScriptKind.TSX)
    : originalSource(file, language, onError, shouldCreate);
};
const program = ts.createProgram([...virtual.values()].map(item => item.filename), options, host);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: file => file,
    getCurrentDirectory: () => root,
    getNewLine: () => '\n',
  }));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${virtual.size} README/headless examples compile against current public SDK exports.`);
}
