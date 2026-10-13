/* eslint-env node, browser, es2021 */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

// Exercise the shipped artifact, not a source transform using the SDK's React.
// Run once per format/runtime; --react-root selects an installed consumer app.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const arg = name => process.argv.find(value => value.startsWith(name + '='))?.slice(name.length + 1);
const consumer = createRequire(path.join(path.resolve(arg('--react-root') || root), 'package.json'));
const format = arg('--format') || 'cjs';
const peer = name => /^react(?:-dom)?(?:\/|$)/.test(name) ? consumer(name) : require(name);
const delay = () => new Promise(resolve => setTimeout(resolve, 0));

async function loadPackage() {
  const file = path.join(root, 'dist', format === 'esm' ? 'main.mjs' : 'main.js');
  const code = fs.readFileSync(file, 'utf8');
  const map = JSON.parse(fs.readFileSync(file + '.map', 'utf8'));
  assert.equal(map.sources.some(source => /node_modules\/react-dom\//.test(source)), false,
    'The SDK must not embed a renderer or the React 18 client shim');
  if (format === 'cjs') {
    assert.ok(code.includes('require("react-dom/client")'), 'CJS must use the consumer client renderer');
    const module = { exports: {} };
    vm.runInThisContext('(function(require,module,exports){' + code + '\n})', { filename: file })(peer, module, module.exports);
    return module.exports;
  }
  assert.equal(format, 'esm');
  assert.equal(typeof vm.SourceTextModule, 'function', 'ESM tests need --experimental-vm-modules');
  const context = vm.createContext({
    window, document, navigator, HTMLElement, Element, Node, MutationObserver,
    console, process, Buffer, setTimeout, clearTimeout, setInterval, clearInterval,
    requestAnimationFrame, cancelAnimationFrame, URL, URLSearchParams,
  });
  const module = new vm.SourceTextModule(code, { context, identifier: file });
  const imports = new Map();
  await module.link(name => {
    if (!imports.has(name)) {
      const value = peer(name);
      const names = [...new Set([...Object.keys(value), 'default'])];
      imports.set(name, new vm.SyntheticModule(names, function () {
        for (const key of names) this.setExport(key, key === 'default' ? value.default ?? value : value[key]);
      }, { context, identifier: name }));
    }
    return imports.get(name);
  });
  assert.ok(imports.has('react-dom/client'), 'ESM must import the consumer client renderer');
  await module.evaluate();
  return module.namespace;
}

async function main() {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'https://test.invalid/' });
  for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver']) {
    Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
  }
  globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
  globalThis.cancelAnimationFrame = clearTimeout;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const React = consumer('react');
  const act = React.act || consumer('react-dom/test-utils').act;
  const sdk = await loadPackage();
  const version = consumer('react/package.json').version;
  assert.equal(typeof sdk.startShareScreen, 'function');
  assert.equal(typeof sdk.promptScreenAudioChoice, 'function');

  async function share(choice, overrides = {}, expectPrompt = true, captureFails = false) {
    assert.equal(document.querySelector('[data-screen-audio-prompt-root]'), null);
    const captures = [], successes = [], updates = [], alerts = [];
    const stream = { id: 'screen-fixture' };
    const parameters = {
      shared: false, onWeb: true, supportsScreenAudio: true, screenAudioEnabled: true,
      displayAudioCapable: true, screenAudioMode: 'ask',
      mediaDevices: { getDisplayMedia: async options => {
        captures.push(options);
        if (captureFails) throw new Error('Picker cancelled');
        return stream;
      } },
      streamSuccessScreen: async event => successes.push(event.stream),
      updateShared: value => updates.push(value), showAlert: alert => alerts.push(alert),
      ...overrides,
    };
    let pending;
    await act(async () => { pending = sdk.startShareScreen({ parameters }); await delay(); });
    const dialog = document.querySelector('[role="dialog"]');
    assert.equal(Boolean(dialog), expectPrompt, 'The default prompt must render without crashing');
    if (expectPrompt) {
      assert.equal(captures.length, 0, 'Do not open capture before the user chooses');
      await act(async () => {
        if (choice === 'escape') document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        else dialog.querySelector('[data-choice="' + choice + '"]').click();
        await pending;
        await delay();
      });
    } else await act(async () => { await pending; await delay(); });
    assert.equal(document.querySelector('[data-screen-audio-prompt-root]'), null, 'Prompt roots must be unmounted and removed');
    const cancelled = choice === 'cancel' || choice === 'escape';
    assert.equal(captures.length, cancelled ? 0 : 1, 'Only one screen-capture request');
    assert.equal(successes.length, cancelled || captureFails ? 0 : 1);
    if (successes.length) assert.equal(successes[0], stream);
    assert.equal(updates.at(-1), !cancelled && !captureFails);
    if (!cancelled) assert.equal(Boolean(captures[0].audio), choice === 'audio');
    assert.equal(alerts.length, captureFails ? 1 : 0);
  }

  try {
    await share('audio');
    await share('video');
    await share('cancel');
    await share('escape');
    await share('audio', {}, true, true);
    await share('audio'); // A subsequent share must not reuse a disposed root.
    await share('audio', { screenAudioMode: 'always' }, false);
    await share('video', { screenAudioMode: 'never' }, false);
    await share('video', { screenAudioEnabled: false }, false);
    await share('video', { supportsScreenAudio: false }, false);
    await share('video', { displayAudioCapable: false }, false);
    await share('audio', { screenAudioPrompt: async () => 'audio' }, false);
    console.log('PASS: ' + format.toUpperCase() + ', React ' + version + ': 12 screen-share/prompt/cleanup cases');
  } finally {
    dom.window.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
