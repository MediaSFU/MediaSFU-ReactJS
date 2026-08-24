import { act, renderHook } from '@testing-library/react';
import { useMediasfuHeadless } from './useMediasfuHeadless';

describe('useMediasfuHeadless publication bridge', () => {
  it('keeps the SDK seed stable and adopts every explicit media publication', () => {
    const { result, rerender } = renderHook(() => useMediasfuHeadless());
    const seed = result.current.sourceParameters;

    rerender();
    expect(result.current.sourceParameters).toBe(seed);

    const first = { roomName: 'room-1', audioAlreadyOn: false };
    act(() => result.current.updateSourceParameters(first));
    expect(result.current.parameters).toBe(first);
    expect(result.current.sourceChanged).toBe(1);

    const second = { roomName: 'room-1', audioAlreadyOn: true };
    act(() =>
      result.current.onMediaChanged({
        reasons: ['local-audio'],
        parameters: second,
      })
    );
    expect(result.current.parameters).toBe(second);
    expect(result.current.micOn).toBe(true);
    expect(result.current.sourceChanged).toBe(2);
  });
});
