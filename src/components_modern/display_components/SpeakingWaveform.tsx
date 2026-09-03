/**
 * SpeakingWaveform - level bars shown while a participant is talking.
 *
 * Replaces the per-card `requestAnimationFrame` + `setState` loop that used to
 * drive these bars. That loop re-rendered the entire video card 60 times a
 * second for every speaking participant, and each bar transitioned `height`,
 * which forces layout on every frame. Here the motion is a CSS keyframe on
 * `transform` alone: no React state, no re-renders, no layout, and it reads as
 * a steady meter rather than the random jitter it replaced.
 *
 * @example
 * ```tsx
 * <SpeakingWaveform active={showWaveform} barColor="#00BCD4" />
 * ```
 */

import React, { useEffect } from 'react';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { injectModernAnimations } from '../utils/injectAnimations';

export interface SpeakingWaveformOptions {
  /** Whether the participant is currently speaking. */
  active: boolean;
  /** Bar colour. Defaults to the caller's accent. */
  barColor?: string;
  /** Number of bars to draw. */
  barCount?: number;
  /** Height of the tallest bar, in pixels. */
  height?: number;
  /** Applied to each bar, for API compatibility with the original card. */
  barStyle?: React.CSSProperties;
  /** Applied to each bar, for API compatibility with the original card. */
  barClassName?: string;
  /** Applied to the row wrapping the bars. */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * Per-bar timing. Prime-ish offsets keep neighbouring bars from falling into
 * step with each other, which is what makes the row read as a level meter
 * instead of a wave.
 */
const BAR_TIMINGS: ReadonlyArray<{ duration: number; delay: number }> = [
  { duration: 620, delay: 0 },
  { duration: 500, delay: 110 },
  { duration: 700, delay: 60 },
  { duration: 540, delay: 170 },
  { duration: 660, delay: 30 },
];

const SpeakingWaveformComponent: React.FC<SpeakingWaveformOptions> = ({
  active,
  barColor = '#FFFFFF',
  barCount = 5,
  height = 16,
  barStyle,
  barClassName,
  containerProps,
}) => {
  // The shared keyframe sheet is injected by whichever modern widget mounts
  // first, and a stage can render with none of those present. Without this the
  // bars would sit motionless because `@keyframes speakingBar` was never added.
  useEffect(() => {
    injectModernAnimations();
  }, []);

  const { className: containerClassName, style: containerStyleOverrides, ...restContainerProps } =
    containerProps ?? {};

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    height: `${height}px`,
    opacity: active ? 1 : 0,
    // Only opacity animates here; the bars themselves are driven by keyframes.
    transition: `opacity ${MediasfuAnimations.fast}ms ${MediasfuAnimations.easeOut}`,
    pointerEvents: 'none',
    ...containerStyleOverrides,
  };

  const bars: React.JSX.Element[] = [];
  for (let index = 0; index < barCount; index += 1) {
    const timing = BAR_TIMINGS[index % BAR_TIMINGS.length];
    bars.push(
      <div
        key={index}
        className={
          barClassName
            ? `mediasfu-speaking-bar ${barClassName}`
            : 'mediasfu-speaking-bar'
        }
        style={{
          width: 3,
          height: `${height}px`,
          backgroundColor: barColor,
          borderRadius: 2,
          // Paused rather than unset so the bars hold their shape when the
          // participant stops talking, instead of snapping to full height.
          animation: `speakingBar ${timing.duration}ms ease-in-out ${timing.delay}ms infinite`,
          animationPlayState: active ? 'running' : 'paused',
          transform: active ? undefined : 'scaleY(0.28)',
          ...barStyle,
        }}
      />
    );
  }

  return (
    <div
      className={containerClassName}
      style={containerStyle}
      aria-hidden="true"
      {...restContainerProps}
    >
      {bars}
    </div>
  );
};

/**
 * Memoised on its own so a re-render of the surrounding card never touches the
 * bars, and vice versa.
 */
export const SpeakingWaveform = React.memo(SpeakingWaveformComponent);

SpeakingWaveform.displayName = 'SpeakingWaveform';

export default SpeakingWaveform;
