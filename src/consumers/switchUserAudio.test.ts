import { switchUserAudio } from './switchUserAudio';

describe('microphone switch processing policy', () => {
  it.each([
    [{ echoCancellation: true, noiseSuppression: true, autoGainControl: true }, {}],
    [{ echoCancellation: false, noiseSuppression: false }, { noiseSuppression: true }],
    [{ noiseSuppression: { ideal: true } }, {}],
    [{}, { echoCancellation: true }],
    [{}, {}],
  ])('preserves constraints and uses settings only as fallback', async (constraints, settings) => {
    const stream = {};
    const getUserMedia = jest.fn().mockResolvedValue(stream);
    const success = jest.fn().mockResolvedValue(undefined);
    await switchUserAudio({
      audioPreference: 'new-mic',
      parameters: {
        hasAudioPermission: true,
        mediaDevices: { getUserMedia },
        localStreamAudio: { getAudioTracks: () => [{
          getConstraints: () => ({ ...constraints, deviceId: { exact: 'old-mic' } }),
          getSettings: () => settings,
        }] },
        streamSuccessAudioSwitch: success,
      } as any,
    });
    expect(getUserMedia).toHaveBeenCalledWith({
      audio: { ...settings, ...constraints, deviceId: { exact: 'new-mic' } },
      video: false,
    });
    expect(success).toHaveBeenCalledWith(expect.objectContaining({ stream }));
  });
});

