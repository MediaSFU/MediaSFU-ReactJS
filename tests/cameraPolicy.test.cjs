const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(relative) {
  const file = path.resolve(root, relative);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const source = fs.readFileSync(file, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(compiled, {
    exports, console,
    require: (name) => name.startsWith('.')
      ? load(path.relative(root, path.resolve(path.dirname(file), name + '.ts')))
      : require(name),
  }, { filename: file });
  return exports;
}

const dir = 'src/ProducerClient/producerClientEmits/';
const { cameraSimulcastOff, applyCameraEncodingPolicy } = load(dir + 'roomVideoPolicy.ts');
assert.equal(cameraSimulcastOff('conference', 2), true);
assert.equal(cameraSimulcastOff('chat', undefined), true);
assert.equal(cameraSimulcastOff('conference', 6), false);
assert.equal(cameraSimulcastOff('conference', 6, { simulcastOff: true }), true);
assert.equal(cameraSimulcastOff('conference', undefined, { roomCapacity: 2 }), true);
assert.equal(cameraSimulcastOff('conference', 6, { roomCapacity: 2 }), false);

const preset = {
  encodings: [
    { rid: 'low', maxBitrate: 200000, scaleResolutionDownBy: 4 },
    { rid: 'mid', maxBitrate: 400000, scaleResolutionDownBy: 2 },
    { rid: 'high', maxBitrate: 800000, minBitrate: 160000, maxFramerate: 24, active: false, scalabilityMode: 'L3T3' },
  ],
  codecOptions: { videoGoogleStartBitrate: 320 },
};
const original = JSON.stringify(preset);
const custom = { encodings: [preset.encodings[2], preset.encodings[0]], codecOptions: preset.codecOptions };
const result = applyCameraEncodingPolicy({ ...custom, encodings: custom.encodings.map(e => ({ ...e })) }, true);
assert.equal(result.encodings[0].maxBitrate, 800000);
assert.equal(result.encodings[0].minBitrate, 160000);
assert.equal(result.encodings[0].maxFramerate, 24);
assert.equal(result.encodings[0].active, false);
assert.equal(result.encodings[0].rid, undefined);
assert.equal(result.encodings[0].scaleResolutionDownBy, 1);
assert.equal(result.encodings[0].scalabilityMode, 'L1T3');

const updater = load(dir + 'updateRoomParametersClient.ts').updateRoomParametersClient;
function update({ capacity, eventType = 'conference', resolution = 'sd', recording = false, previous, ...options } = {}) {
  const output = {};
  const errors = [];
  const target = {
    data: {
      rtpCapabilities: {}, capacity, roomRecvIPs: [], secureCode: '',
      meetingRoomParams: { type: eventType, itemPageLimit: 6, mediaType: 'video', targetResolution: resolution, targetResolutionHost: resolution, targetOrientation: 'landscape', targetOrientationHost: 'landscape' },
      recordingParams: { recordingVideoSupport: recording },
    },
    hParams: previous?.updateHParams ?? preset,
    vParams: previous?.updateVParams ?? preset,
    islevel: '2', frameRate: 30, screenPageLimit: 4,
    showAlert: (alert) => errors.push(alert),
  };
  const parameters = new Proxy(target, {
    get: (object, key) => key in object ? object[key] :
      String(key).startsWith('update') ? value => { output[key] = value; } : undefined,
  });
  updater({ parameters, ...options });
  assert.equal(errors.length, 0, JSON.stringify(errors));
  assert.ok(output.updateHParams && output.updateVParams, 'The actual room updater must apply camera presets');
  return output;
}
for (const resolution of ['sd', 'hd', 'fhd', 'qhd', 'QnHD']) {
  const normal = update({ capacity: 6, resolution });
  const recorded = update({ capacity: 6, resolution, recording: true });
  assert.equal(JSON.stringify(normal.updateHParams), JSON.stringify(recorded.updateHParams), 'Recording must not increase camera bitrate');
  assert.equal(JSON.stringify(normal.updateVParams), JSON.stringify(recorded.updateVParams));
  assert.equal(normal.updateScreenParams, recorded.updateScreenParams);
  assert.equal(normal.updateAParams, recorded.updateAParams);
  const single = update({ capacity: 2, resolution });
  assert.equal(single.updateVParams.encodings.length, 1);
  assert.equal(single.updateVParams.encodings[0].maxBitrate, normal.updateVParams.encodings[2].maxBitrate);
  assert.equal(single.updateVParams.encodings[0].rid, undefined);
  const restored = update({ capacity: 6, resolution, previous: single });
  assert.equal(restored.updateVParams.encodings.length, 3, 'A later larger room must restore the original simulcast preset');
  assert.equal(JSON.stringify(restored.updateVParams), JSON.stringify(normal.updateVParams));
}
assert.equal(update({ eventType: 'chat' }).updateVParams.encodings.length, 1);
assert.equal(update({ roomCapacity: 2 }).updateVParams.encodings.length, 1);
assert.equal(update({ capacity: 6, roomCapacity: 2 }).updateVParams.encodings.length, 3);
assert.equal(update({ capacity: 6, simulcastOff: true }).updateVParams.encodings.length, 1);
assert.equal(update({ capacity: 2, simulcastOff: false }).updateVParams.encodings.length, 1);
assert.equal(JSON.stringify(preset), original, 'Never mutate caller-owned presets');
console.log('Camera policy and recording bitrate regression tests passed.');
