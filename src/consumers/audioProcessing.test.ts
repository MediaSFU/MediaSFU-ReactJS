import { audioProcessingConstraints, applyAudioProcessing } from './audioProcessing';

test('explicit false is preserved and missing preferences stay omitted', () => {
  expect(audioProcessingConstraints({ noiseSuppression: false })).toEqual({ noiseSuppression: false });
  expect(audioProcessingConstraints()).toEqual({});
  expect(() => audioProcessingConstraints({ noiseSuppression: 'true' } as any)).toThrow();
  expect(() => audioProcessingConstraints({ deviceId: 'other' } as any)).toThrow();
});

test('changing processing on an existing track preserves its other constraints', async () => {
  const applyConstraints = jest.fn().mockResolvedValue(undefined);
  const track = { getConstraints: () => ({ deviceId: { exact: 'mic' }, noiseSuppression: false }), applyConstraints };
  await applyAudioProcessing(track as any, { noiseSuppression: true, autoGainControl: false });
  expect(applyConstraints).toHaveBeenCalledWith({
    deviceId: { exact: 'mic' }, noiseSuppression: true, autoGainControl: false,
  });
});

test('unspecified processing does not touch a running track', async () => {
  const applyConstraints = jest.fn();
  await applyAudioProcessing({ applyConstraints } as any);
  expect(applyConstraints).not.toHaveBeenCalled();
});

