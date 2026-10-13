import { startVirtualBackgroundFrameLoop } from './virtualBackgroundFrameLoop';

describe('virtual-background frame loop', () => {
  const originalHidden = Object.getOwnPropertyDescriptor(document, 'hidden');
  let hidden = true;

  beforeEach(() => {
    jest.useFakeTimers();
    hidden = true;
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
  });

  afterEach(() => {
    if (originalHidden) Object.defineProperty(document, 'hidden', originalHidden);
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('processes hidden-tab frames by default without overlapping requests', async () => {
    let finishFrame: (() => void) | undefined;
    const processFrame = jest.fn(() => new Promise<void>((resolve) => { finishFrame = resolve; }));
    const stop = startVirtualBackgroundFrameLoop({ owner: {}, processFrame, shouldContinue: () => true });

    expect(processFrame).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(3000);
    expect(processFrame).toHaveBeenCalledTimes(1);
    finishFrame?.();
    await Promise.resolve();
    jest.advanceTimersByTime(199);
    expect(processFrame).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1);
    expect(processFrame).toHaveBeenCalledTimes(2);
    stop();
    finishFrame?.();
    await Promise.resolve();
    jest.advanceTimersByTime(3000);
    expect(processFrame).toHaveBeenCalledTimes(2);
  });

  it('allows an explicit hidden-tab opt-out and replaces the previous owner loop', async () => {
    const owner = {};
    const first = jest.fn(async () => undefined);
    const stopFirst = startVirtualBackgroundFrameLoop({
      owner, processFrame: first, shouldContinue: () => true, keepProcessingWhenHidden: false,
    });
    await Promise.resolve();
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    const second = jest.fn(async () => undefined);
    const stopSecond = startVirtualBackgroundFrameLoop({ owner, processFrame: second, shouldContinue: () => true });
    await Promise.resolve();
    expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(200);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(2);
    stopFirst();
    stopSecond();
  });

  it('waits for an in-flight frame before replacing a loop for the same model', async () => {
    const owner = {};
    let finishFirst: (() => void) | undefined;
    const first = jest.fn(() => new Promise<void>((resolve) => { finishFirst = resolve; }));
    const second = jest.fn(async () => undefined);
    startVirtualBackgroundFrameLoop({ owner, processFrame: first, shouldContinue: () => true });
    const stopSecond = startVirtualBackgroundFrameLoop({ owner, processFrame: second, shouldContinue: () => true });
    expect(second).not.toHaveBeenCalled();
    finishFirst?.();
    await Promise.resolve();
    await Promise.resolve();
    expect(second).toHaveBeenCalledTimes(1);
    stopSecond();
  });
});
