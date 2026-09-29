import { freshRoomVideoParams } from './updateRoomParametersClient';
import { vParams } from '../../methods/utils/producer/vParams';

test('room quality presets do not compound across updates or mutate defaults', () => {
  const initialMax = vParams.encodings[0].maxBitrate!;
  const first = freshRoomVideoParams({} as typeof vParams, vParams);
  first.encodings[0].maxBitrate = initialMax * 4;
  const second = freshRoomVideoParams(first, vParams);
  expect(second.encodings[0].maxBitrate).toBe(initialMax);
  expect(vParams.encodings[0].maxBitrate).toBe(initialMax);
  expect(second.encodings[0]).not.toBe(first.encodings[0]);
});
