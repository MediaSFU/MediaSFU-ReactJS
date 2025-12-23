/**
 * A comprehensive animation system for the modern MediaSFU UI.
 *
 * Provides:
 * - Duration constants for consistent timing
 * - Easing/Curve presets for various motion types
 * - Spring physics configurations
 * - Stagger utilities for list animations
 * - Keyframe generators for common transitions
 * - CSS animation helpers
 */

import React from 'react';

// ═════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═════════════════════════════════════════════════════════════════════════════

/** Animation configuration for complex multi-property animations */
export interface AnimationConfig {
  duration: number; // in milliseconds
  easing: string;
  fadeFrom?: number;
  fadeTo?: number;
  scaleFrom?: number;
  scaleTo?: number;
  slideFromX?: number;
  slideFromY?: number;
  slideToX?: number;
  slideToY?: number;
}

/** Spring physics configuration */
export interface SpringConfig {
  mass: number;
  stiffness: number;
  damping: number;
}

/** Keyframe definition */
export interface Keyframe {
  [property: string]: string | number;
}

export class MediasfuAnimations {
  private constructor() {}

  // ═══════════════════════════════════════════════════════════════════════════
  // DURATION CONSTANTS (in milliseconds)
  // ═══════════════════════════════════════════════════════════════════════════

  /** Instant - For immediate feedback (hover states) - 50ms */
  static readonly instant = 50;

  /** Fast - For micro-interactions (ripples, toggles) - 150ms */
  static readonly fast = 150;

  /** Normal - Standard transitions (page changes, modal opens) - 300ms */
  static readonly normal = 300;

  /** Slow - For emphasis or complex animations - 500ms */
  static readonly slow = 500;

  /** Slower - For dramatic reveals - 700ms */
  static readonly slower = 700;

  /** Cinematic - For hero animations and page transitions - 1000ms */
  static readonly cinematic = 1000;

  // ═══════════════════════════════════════════════════════════════════════════
  // EASING/CURVE PRESETS (CSS cubic-bezier)
  // ═══════════════════════════════════════════════════════════════════════════

  /** Smooth ease for general purpose animations (easeInOutCubic) */
  static readonly smooth = 'cubic-bezier(0.65, 0, 0.35, 1)';

  /** Snappy ease for responsive interactions (easeOutCubic) */
  static readonly snappy = 'cubic-bezier(0.33, 1, 0.68, 1)';

  /** Bounce effect for playful elements (elasticOut approximation) */
  static readonly bounce = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';

  /** Overshoot for attention-grabbing animations (easeOutBack) */
  static readonly overshoot = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

  /** Decelerate for incoming elements */
  static readonly decelerate = 'cubic-bezier(0, 0, 0.2, 1)';

  /** Accelerate for outgoing elements */
  static readonly accelerate = 'cubic-bezier(0.4, 0, 1, 1)';

  /** Anticipate - slight pullback before forward motion (easeInBack) */
  static readonly anticipate = 'cubic-bezier(0.36, 0, 0.66, -0.56)';

  /** Linear for constant-speed animations (loading spinners) */
  static readonly linear = 'linear';

  /** Material Design emphasized curve for enter (easeOutExpo) */
  static readonly emphasizedEnter = 'cubic-bezier(0.16, 1, 0.3, 1)';

  /** Material Design emphasized curve for exit (easeInExpo) */
  static readonly emphasizedExit = 'cubic-bezier(0.7, 0, 0.84, 0)';

  /** Standard ease-in-out */
  static readonly easeInOut = 'ease-in-out';

  /** Standard ease-out */
  static readonly easeOut = 'ease-out';

  /** Standard ease-in */
  static readonly easeIn = 'ease-in';

  // ═══════════════════════════════════════════════════════════════════════════
  // SPRING PHYSICS CONFIGURATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Default spring - balanced responsiveness */
  static readonly defaultSpring: SpringConfig = {
    mass: 1.0,
    stiffness: 300.0,
    damping: 25.0,
  };

  /** Bouncy spring - for playful, elastic effects */
  static readonly bouncySpring: SpringConfig = {
    mass: 1.0,
    stiffness: 350.0,
    damping: 15.0,
  };

  /** Stiff spring - quick and controlled */
  static readonly stiffSpring: SpringConfig = {
    mass: 1.0,
    stiffness: 500.0,
    damping: 35.0,
  };

  /** Gentle spring - slow and smooth */
  static readonly gentleSpring: SpringConfig = {
    mass: 1.5,
    stiffness: 200.0,
    damping: 25.0,
  };

  /** Snappy spring - fast with slight overshoot */
  static readonly snappySpring: SpringConfig = {
    mass: 0.8,
    stiffness: 400.0,
    damping: 20.0,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSITION BUILDERS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Build CSS transition string */
  static transition(
    properties: string | string[],
    duration = this.normal,
    easing = this.smooth,
    delay = 0
  ): string {
    const props = Array.isArray(properties) ? properties : [properties];
    return props
      .map((prop) => `${prop} ${duration}ms ${easing}${delay ? ` ${delay}ms` : ''}`)
      .join(', ');
  }

  /** Build all-property transition */
  static transitionAll(duration = this.normal, easing = this.smooth): string {
    return `all ${duration}ms ${easing}`;
  }

  /** Common transition combinations */
  static get transitionOpacity(): string {
    return this.transition('opacity', this.fast, this.smooth);
  }

  static get transitionTransform(): string {
    return this.transition('transform', this.normal, this.snappy);
  }

  static get transitionColors(): string {
    return this.transition(
      ['background-color', 'border-color', 'color'],
      this.fast,
      this.smooth
    );
  }

  static get transitionShadow(): string {
    return this.transition('box-shadow', this.normal, this.smooth);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STAGGER UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculates stagger delay for list item animations.
   * @param index - The item's position in the list
   * @param baseDelay - The delay between each item (default 50ms)
   * @param maxDelay - Maximum total delay cap (default 500ms)
   */
  static staggerDelay(index: number, baseDelay = 50, maxDelay = 500): number {
    const calculated = baseDelay * index;
    return Math.min(calculated, maxDelay);
  }

  /**
   * Get animation delay style for staggered items
   * @param index - Item index
   * @param baseDelay - Base delay between items
   */
  static staggerStyle(index: number, baseDelay = 50): React.CSSProperties {
    return {
      animationDelay: `${this.staggerDelay(index, baseDelay)}ms`,
    };
  }

  /**
   * Calculate stagger interval for overlap animations
   * @param index - Item position
   * @param totalItems - Total number of items
   * @param overlapRatio - How much animations overlap (0.0-1.0)
   */
  static staggerInterval(
    index: number,
    totalItems: number,
    overlapRatio = 0.5
  ): { start: number; end: number } {
    if (totalItems <= 1) return { start: 0, end: 1 };

    const segmentLength = 1.0 / totalItems;
    const overlap = segmentLength * overlapRatio;

    const start = Math.min(1, index * segmentLength * (1 - overlapRatio));
    const end = Math.min(1, start + segmentLength + overlap);

    return { start, end };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // KEYFRAME DEFINITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Fade in animation keyframes */
  static readonly fadeInKeyframes = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;

  /** Fade out animation keyframes */
  static readonly fadeOutKeyframes = `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;

  /** Scale up animation keyframes */
  static readonly scaleUpKeyframes = `
    @keyframes scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `;

  /** Scale down animation keyframes */
  static readonly scaleDownKeyframes = `
    @keyframes scaleDown {
      from { transform: scale(1); opacity: 1; }
      to { transform: scale(0.95); opacity: 0; }
    }
  `;

  /** Slide from bottom animation keyframes */
  static readonly slideFromBottomKeyframes = `
    @keyframes slideFromBottom {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  /** Slide from top animation keyframes */
  static readonly slideFromTopKeyframes = `
    @keyframes slideFromTop {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  /** Slide from left animation keyframes */
  static readonly slideFromLeftKeyframes = `
    @keyframes slideFromLeft {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;

  /** Slide from right animation keyframes */
  static readonly slideFromRightKeyframes = `
    @keyframes slideFromRight {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;

  /** Pulse animation keyframes */
  static readonly pulseKeyframes = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;

  /** Heartbeat animation keyframes */
  static readonly heartbeatKeyframes = `
    @keyframes heartbeat {
      0% { transform: scale(1); }
      14% { transform: scale(1.15); }
      28% { transform: scale(1); }
      42% { transform: scale(1.1); }
      70%, 100% { transform: scale(1); }
    }
  `;

  /** Spin animation keyframes */
  static readonly spinKeyframes = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  /** Shimmer animation keyframes */
  static readonly shimmerKeyframes = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;

  /** Bounce animation keyframes */
  static readonly bounceKeyframes = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;

  /** Shake animation keyframes */
  static readonly shakeKeyframes = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;

  /** Modal enter keyframes */
  static readonly modalEnterKeyframes = `
    @keyframes modalEnter {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `;

  /** Modal exit keyframes */
  static readonly modalExitKeyframes = `
    @keyframes modalExit {
      from {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      to {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
      }
    }
  `;

  /** Backdrop enter keyframes */
  static readonly backdropEnterKeyframes = `
    @keyframes backdropEnter {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATION STYLE GENERATORS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Fade in animation style */
  static fadeIn(duration = this.normal, delay = 0): React.CSSProperties {
    return {
      animation: `fadeIn ${duration}ms ${this.smooth} ${delay}ms forwards`,
    };
  }

  /** Fade out animation style */
  static fadeOut(duration = this.fast, delay = 0): React.CSSProperties {
    return {
      animation: `fadeOut ${duration}ms ${this.accelerate} ${delay}ms forwards`,
    };
  }

  /** Scale up animation style */
  static scaleUp(duration = this.normal, delay = 0): React.CSSProperties {
    return {
      animation: `scaleUp ${duration}ms ${this.overshoot} ${delay}ms forwards`,
    };
  }

  /** Slide from bottom animation style */
  static slideFromBottom(duration = this.normal, delay = 0): React.CSSProperties {
    return {
      animation: `slideFromBottom ${duration}ms ${this.smooth} ${delay}ms forwards`,
    };
  }

  /** Slide from top animation style */
  static slideFromTop(duration = this.normal, delay = 0): React.CSSProperties {
    return {
      animation: `slideFromTop ${duration}ms ${this.smooth} ${delay}ms forwards`,
    };
  }

  /** Slide from left animation style */
  static slideFromLeft(duration = this.normal, delay = 0): React.CSSProperties {
    return {
      animation: `slideFromLeft ${duration}ms ${this.smooth} ${delay}ms forwards`,
    };
  }

  /** Slide from right animation style */
  static slideFromRight(duration = this.normal, delay = 0): React.CSSProperties {
    return {
      animation: `slideFromRight ${duration}ms ${this.smooth} ${delay}ms forwards`,
    };
  }

  /** Pulse animation style (infinite) */
  static pulse(duration = this.slow): React.CSSProperties {
    return {
      animation: `pulse ${duration}ms ${this.easeInOut} infinite`,
    };
  }

  /** Heartbeat animation style (infinite) */
  static heartbeat(duration = this.cinematic): React.CSSProperties {
    return {
      animation: `heartbeat ${duration}ms ${this.easeInOut} infinite`,
    };
  }

  /** Spin animation style (infinite) */
  static spin(duration = this.cinematic): React.CSSProperties {
    return {
      animation: `spin ${duration}ms ${this.linear} infinite`,
    };
  }

  /** Shimmer animation style (infinite) */
  static shimmer(duration = 1500): React.CSSProperties {
    return {
      animation: `shimmer ${duration}ms ${this.linear} infinite`,
      backgroundSize: '200% 100%',
    };
  }

  /** Bounce animation style (infinite) */
  static bounceAnimation(duration = this.slow): React.CSSProperties {
    return {
      animation: `bounce ${duration}ms ${this.easeInOut} infinite`,
    };
  }

  /** Shake animation style */
  static shake(duration = 500): React.CSSProperties {
    return {
      animation: `shake ${duration}ms ${this.easeInOut}`,
    };
  }

  /** Modal enter animation style */
  static modalEnter(duration = this.normal): React.CSSProperties {
    return {
      animation: `modalEnter ${duration}ms ${this.snappy} forwards`,
    };
  }

  /** Modal exit animation style */
  static modalExit(duration = this.fast): React.CSSProperties {
    return {
      animation: `modalExit ${duration}ms ${this.accelerate} forwards`,
    };
  }

  /** Backdrop enter animation style */
  static backdropEnter(duration = this.normal): React.CSSProperties {
    return {
      animation: `backdropEnter ${duration}ms ${this.smooth} forwards`,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSITION PRESETS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Modal enter transition configuration */
  static readonly modalEnterConfig: AnimationConfig = {
    duration: MediasfuAnimations.normal,
    easing: MediasfuAnimations.snappy,
    fadeFrom: 0.0,
    fadeTo: 1.0,
    scaleFrom: 0.95,
    scaleTo: 1.0,
    slideFromY: 10,
    slideToY: 0,
  };

  /** Modal exit transition configuration */
  static readonly modalExitConfig: AnimationConfig = {
    duration: MediasfuAnimations.fast,
    easing: MediasfuAnimations.accelerate,
    fadeFrom: 1.0,
    fadeTo: 0.0,
    scaleFrom: 1.0,
    scaleTo: 0.95,
    slideFromY: 0,
    slideToY: 10,
  };

  /** Toast notification enter configuration */
  static readonly toastEnterConfig: AnimationConfig = {
    duration: MediasfuAnimations.fast,
    easing: MediasfuAnimations.overshoot,
    fadeFrom: 0.0,
    fadeTo: 1.0,
    scaleFrom: 0.8,
    scaleTo: 1.0,
    slideFromY: -20,
    slideToY: 0,
  };

  /** Button press feedback configuration */
  static readonly buttonPressConfig: AnimationConfig = {
    duration: MediasfuAnimations.instant,
    easing: MediasfuAnimations.easeOut,
    scaleFrom: 1.0,
    scaleTo: 0.95,
  };

  /** Hover scale configuration */
  static readonly hoverScaleConfig: AnimationConfig = {
    duration: MediasfuAnimations.fast,
    easing: MediasfuAnimations.easeOut,
    scaleFrom: 1.0,
    scaleTo: 1.02,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ALL KEYFRAMES COMBINED
  // ═══════════════════════════════════════════════════════════════════════════

  /** Get all keyframe definitions combined */
  static getAllKeyframes(): string {
    return `
      ${this.fadeInKeyframes}
      ${this.fadeOutKeyframes}
      ${this.scaleUpKeyframes}
      ${this.scaleDownKeyframes}
      ${this.slideFromBottomKeyframes}
      ${this.slideFromTopKeyframes}
      ${this.slideFromLeftKeyframes}
      ${this.slideFromRightKeyframes}
      ${this.pulseKeyframes}
      ${this.heartbeatKeyframes}
      ${this.spinKeyframes}
      ${this.shimmerKeyframes}
      ${this.bounceKeyframes}
      ${this.shakeKeyframes}
      ${this.modalEnterKeyframes}
      ${this.modalExitKeyframes}
      ${this.backdropEnterKeyframes}
    `;
  }
}

export default MediasfuAnimations;
