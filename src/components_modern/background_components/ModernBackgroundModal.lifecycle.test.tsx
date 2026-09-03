import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ModernBackgroundModal from './ModernBackgroundModal';

// Exercise the real modal's lifecycle, not image segmentation or a live room.
// Only browser media APIs and transport operations are substitutes.
let room: any;
let track: any;
let originalMediaStream: typeof MediaStream;

beforeEach(() => {
  track = { id: 'camera', label: 'Synthetic camera', kind: 'video', readyState: 'live',
    getSettings: () => ({ width: 640, height: 360 }), stop: jest.fn(), clone: () => ({ ...track }) };
  class TestStream {
    tracks: any[];
    constructor(tracks = [track]) { this.tracks = tracks; }
    getTracks() { return this.tracks; }
    getVideoTracks() { return this.tracks; }
  }
  originalMediaStream = global.MediaStream;
  global.MediaStream = TestStream as any;
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    clearRect() {}, fillRect() {}, drawImage() {}, fillText() {},
  } as any);
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  room = {
    selectedImage: '', customImage: '', keepBackground: false, appliedBackground: false,
    videoAlreadyOn: false, autoClickBackground: false, frameRate: 5, vidCons: {},
    selfieSegmentation: { onResults: jest.fn() },
    mediaDevices: { getUserMedia: jest.fn(async () => new TestStream()) },
    localStreamVideo: new TestStream(), transportCreated: true,
    showAlert: jest.fn(), getUpdatedAllParams: jest.fn(() => { throw new Error('Publishing during a read'); }),
    connectSendTransportVideo: jest.fn(async ({ videoParams }) => { room.videoProducer = { track: videoParams.track }; }),
    disconnectSendTransportVideo: jest.fn(), onScreenChanges: jest.fn(), sleep: jest.fn(),
  };
  room.getCurrentParams = () => room;
  for (const field of ['customImage', 'selectedImage', 'segmentVideo', 'selfieSegmentation',
    'pauseSegmentation', 'processedStream', 'keepBackground', 'backgroundHasChanged',
    'virtualStream', 'mainCanvas', 'prevKeepBackground', 'appliedBackground', 'videoParams',
    'autoClickBackground']) {
    room[`update${field[0].toUpperCase()}${field.slice(1)}`] = jest.fn((value) => { room[field] = value; });
  }
});

afterEach(() => {
  global.MediaStream = originalMediaStream;
  jest.restoreAllMocks();
});

test('camera-off preview/save retains the SDK manual-close contract and closes through the supplied callback', async () => {
  const onClose = jest.fn();
  const { rerender } = render(<ModernBackgroundModal isVisible parameters={room} onClose={onClose} renderMode="inline" closeButtonProps={{ 'aria-label': 'Close background' }} />);
  expect(room.mediaDevices.getUserMedia).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: /^Preview Background$/ }));
  await waitFor(() => expect(screen.getByRole('button', { name: /^Save Background$/ })).toBeEnabled());
  expect(room.mediaDevices.getUserMedia).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: /^Save Background$/ }));
  await waitFor(() => expect(screen.getByRole('button', { name: /^Save Background$/ })).toBeDisabled());
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: /close/i }));
  expect(onClose).toHaveBeenCalledTimes(1);
  rerender(<ModernBackgroundModal isVisible={false} parameters={room} onClose={onClose} renderMode="inline" />);
  expect(track.stop).toHaveBeenCalled();
  expect(room.getUpdatedAllParams).not.toHaveBeenCalled();
});

test.each([false, true])('automatic restore calls SDK onClose once (request arrives while visible=%s)', async (lateRequest) => {
  room.videoAlreadyOn = true;
  room.autoClickBackground = !lateRequest;
  const onClose = jest.fn();
  const { rerender } = render(<ModernBackgroundModal isVisible parameters={room} onClose={onClose} renderMode="inline" />);
  if (lateRequest) {
    expect(onClose).not.toHaveBeenCalled();
    room.autoClickBackground = true;
    rerender(<ModernBackgroundModal isVisible parameters={{ ...room }} onClose={onClose} renderMode="inline" />);
  }
  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  expect(room.updateAutoClickBackground).toHaveBeenCalledWith(false);
  expect(room.connectSendTransportVideo).toHaveBeenCalledTimes(1);
  await act(async () => { rerender(<ModernBackgroundModal isVisible={false} parameters={room} onClose={onClose} renderMode="inline" />); });
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(room.getUpdatedAllParams).not.toHaveBeenCalled();
});
