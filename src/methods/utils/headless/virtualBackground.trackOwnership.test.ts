import { applyVirtualBackground, clearVirtualBackground } from './virtualBackground';

jest.mock('@mediapipe/selfie_segmentation', () => ({
  SelfieSegmentation: class {
    setOptions() {}
    async initialize() {}
    onResults() {}
    async send() {}
    close() {}
  },
}));
jest.mock('./getCurrentParams', () => ({ getCurrentParams: ({ parameters }: any) => parameters }));
jest.mock('./getMediaStreams', () => ({ getLocalVideoStream: ({ parameters }: any) => parameters.localStreamVideo }));

class FakeTrack {
  kind = 'video';
  readyState: MediaStreamTrackState = 'live';
  enabled = true;
  private count = 0;
  constructor(public id: string) {}
  clone() { return new FakeTrack(`${this.id}-clone-${++this.count}`); }
  stop() { this.readyState = 'ended'; }
  getSettings() { return { width: 640, height: 360 }; }
  addEventListener() {}
  removeEventListener() {}
}

class FakeStream {
  constructor(private tracks: FakeTrack[]) {}
  getTracks() { return this.tracks; }
  getVideoTracks() { return this.tracks; }
  removeTrack(track: FakeTrack) { this.tracks = this.tracks.filter((entry) => entry !== track); }
  addTrack(track: FakeTrack) { this.tracks.push(track); }
}

beforeAll(() => {
  (global as any).MediaStream = FakeStream;
  Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: () => 1 });
  Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: () => {} });
  const canvas = () => ({
    width: 0, height: 0,
    getContext: () => ({
      save() {}, restore() {}, clearRect() {}, drawImage() {}, createPattern() { return null; }, fillRect() {},
    }),
    captureStream: () => new FakeStream([new FakeTrack('processed')]),
  });
  const video = () => ({ autoplay: false, muted: false, playsInline: false, readyState: 4, srcObject: null, play: () => Promise.resolve() });
  Object.defineProperty(global, 'document', { configurable: true, value: { createElement: (tag: string) => tag === 'video' ? video() : canvas() } });
});

afterAll(() => jest.restoreAllMocks());

test('keeps a live segmentation input and raw restoration track when producer replacement stops the old track', async () => {
  const raw = new FakeTrack('raw');
  const camera = new FakeStream([raw]);
  let current = raw;
  const producer = {
    replaceTrack: jest.fn(async ({ track }: { track: FakeTrack }) => {
      current.stop();
      current = track;
    }),
  };
  const parameters: any = {
    localStreamVideo: camera,
    videoProducer: producer,
    updateVirtualStream: (value: any) => { parameters.virtualStream = value; },
    updateProcessedStream: (value: any) => { parameters.processedStream = value; },
    updateKeepBackground: (value: boolean) => { parameters.keepBackground = value; },
  };

  const applied = await applyVirtualBackground({ parameters, image: null });
  expect(applied.ok).toBe(true);
  expect(raw.readyState).toBe('ended');
  expect(camera.getVideoTracks()[0].readyState).toBe('live');
  expect(camera.getVideoTracks()[0]).not.toBe(raw);
  expect(current).toBe(applied.stream?.getVideoTracks()[0]);
  expect(parameters.keepBackground).toBe(true);

  const restored = await clearVirtualBackground({ parameters });
  expect(restored.ok).toBe(true);
  expect(producer.replaceTrack).toHaveBeenLastCalledWith({ track: camera.getVideoTracks()[0] });
  expect(current).toBe(camera.getVideoTracks()[0]);
  expect(current.readyState).toBe('live');
  expect(parameters.keepBackground).toBe(false);
});
