export interface VirtualBackgroundFrameLoopOptions {
  /** The segmentation instance; a newer loop for this instance replaces the old one. */
  owner: object;
  processFrame: () => Promise<unknown> | unknown;
  shouldContinue: () => boolean;
  /** Best-effort processing in a hidden tab, targeting up to five frames per second. */
  keepProcessingWhenHidden?: boolean;
}

const activeLoops = new WeakMap<object, () => void>();
const activeFrames = new WeakMap<object, Promise<unknown>>();

/** Keep one segmentation request in flight and follow page visibility. */
export function startVirtualBackgroundFrameLoop({
  owner,
  processFrame,
  shouldContinue,
  keepProcessingWhenHidden = true,
}: VirtualBackgroundFrameLoopOptions): () => void {
  activeLoops.get(owner)?.();

  let stopped = false;
  let inFlight = false;
  let animationFrameId: number | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const cancelScheduledFrame = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const stop = () => {
    if (stopped) return;
    stopped = true;
    cancelScheduledFrame();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    if (activeLoops.get(owner) === stop) activeLoops.delete(owner);
  };

  const schedule = () => {
    if (stopped || inFlight) return;
    if (!shouldContinue()) {
      stop();
      return;
    }
    if (document.hidden && keepProcessingWhenHidden) {
      timeoutId = setTimeout(() => { void runFrame(); }, 200);
    } else {
      animationFrameId = requestAnimationFrame(() => { void runFrame(); });
    }
  };

  const runFrame = async () => {
    animationFrameId = null;
    timeoutId = null;
    if (stopped || inFlight) return;
    if (!shouldContinue()) {
      stop();
      return;
    }
    inFlight = true;
    try {
      const previousFrame = activeFrames.get(owner);
      if (previousFrame) await previousFrame.catch(() => undefined);
      if (stopped || !shouldContinue()) {
        stop();
        return;
      }
      const currentFrame = Promise.resolve(processFrame());
      activeFrames.set(owner, currentFrame);
      try {
        await currentFrame;
      } finally {
        if (activeFrames.get(owner) === currentFrame) activeFrames.delete(owner);
      }
    } catch {
      // A failed camera frame must not end the background session.
    } finally {
      inFlight = false;
      schedule();
    }
  };

  const onVisibilityChange = () => {
    cancelScheduledFrame();
    schedule();
  };

  activeLoops.set(owner, stop);
  document.addEventListener('visibilitychange', onVisibilityChange);
  void runFrame();
  return stop;
}
