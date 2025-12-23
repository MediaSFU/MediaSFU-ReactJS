/**
 * Border utilities for the modern MediaSFU UI.
 *
 * Provides:
 * - Border radius constants
 * - Border style helpers
 * - Focus ring utilities
 * - Gradient border effects
 */

import React from 'react';
import { MediasfuColors } from './MediasfuColors';

export class MediasfuBorders {
  private constructor() {}

  // ═══════════════════════════════════════════════════════════════════════════
  // BORDER RADIUS CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** No radius - 0px */
  static readonly none = 0;

  /** Extra small - 4px */
  static readonly xs = 4;

  /** Small - 8px */
  static readonly sm = 8;

  /** Medium - 12px */
  static readonly md = 12;

  /** Large - 16px */
  static readonly lg = 16;

  /** Extra large - 20px */
  static readonly xl = 20;

  /** 2XL - 24px */
  static readonly xxl = 24;

  /** 3XL - 32px */
  static readonly xxxl = 32;

  /** Full/Pill - 9999px */
  static readonly full = 9999;

  // ═══════════════════════════════════════════════════════════════════════════
  // BORDER RADIUS HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Circular radius for all corners */
  static circular(radius: number): React.CSSProperties {
    return { borderRadius: `${radius}px` };
  }

  /** Radius for top corners only */
  static top(radius: number): React.CSSProperties {
    return {
      borderTopLeftRadius: `${radius}px`,
      borderTopRightRadius: `${radius}px`,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    };
  }

  /** Radius for bottom corners only */
  static bottom(radius: number): React.CSSProperties {
    return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: `${radius}px`,
      borderBottomRightRadius: `${radius}px`,
    };
  }

  /** Radius for left corners only */
  static left(radius: number): React.CSSProperties {
    return {
      borderTopLeftRadius: `${radius}px`,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: `${radius}px`,
      borderBottomRightRadius: 0,
    };
  }

  /** Radius for right corners only */
  static right(radius: number): React.CSSProperties {
    return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: `${radius}px`,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: `${radius}px`,
    };
  }

  /** Custom radius for each corner */
  static custom(
    topLeft: number,
    topRight: number,
    bottomRight: number,
    bottomLeft: number
  ): React.CSSProperties {
    return {
      borderRadius: `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BORDER STYLE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Subtle border for cards and containers */
  static subtle(darkMode = false): React.CSSProperties {
    return {
      border: darkMode
        ? '1px solid rgba(255, 255, 255, 0.08)'
        : '1px solid rgba(0, 0, 0, 0.06)',
    };
  }

  /** Standard border for inputs and interactive elements */
  static standard(darkMode = false): React.CSSProperties {
    return {
      border: `1px solid ${darkMode ? MediasfuColors.dividerDark : MediasfuColors.divider}`,
    };
  }

  /** Emphasized border for focused elements */
  static emphasized(darkMode = false, color?: string): React.CSSProperties {
    const borderColor = color ?? (darkMode ? MediasfuColors.primaryDark : MediasfuColors.primary);
    return {
      border: `2px solid ${borderColor}`,
    };
  }

  /** Focus ring styles */
  static focusRing(
    darkMode = false,
    color?: string,
    borderRadius = MediasfuBorders.lg
  ): React.CSSProperties {
    const ringColor = color ?? MediasfuColors.focusRing(darkMode);
    return {
      borderRadius: `${borderRadius}px`,
      border: `2px solid ${ringColor}`,
      boxShadow: `0 0 8px 2px ${MediasfuColors.hexToRgba(
        color ?? (darkMode ? MediasfuColors.primaryDark : MediasfuColors.primary),
        0.3
      )}`,
    };
  }

  /** Error state border */
  static error(darkMode = false): React.CSSProperties {
    return {
      border: `2px solid ${darkMode ? MediasfuColors.dangerLight : MediasfuColors.danger}`,
    };
  }

  /** Success state border */
  static success(darkMode = false): React.CSSProperties {
    return {
      border: `2px solid ${darkMode ? MediasfuColors.successLight : MediasfuColors.success}`,
    };
  }

  /** Warning state border */
  static warning(darkMode = false): React.CSSProperties {
    return {
      border: `2px solid ${darkMode ? MediasfuColors.warningLight : MediasfuColors.warning}`,
    };
  }

  /** Info state border */
  static info(darkMode = false): React.CSSProperties {
    return {
      border: `2px solid ${darkMode ? MediasfuColors.infoLight : MediasfuColors.info}`,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GRADIENT BORDER UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Create a gradient border effect using pseudo-element approach.
   * Note: This returns styles for a container that should have position: relative
   * and the gradient will be rendered as a background on a pseudo-element.
   */
  static gradientBorder(
    gradient: string,
    borderWidth = 2,
    borderRadius = MediasfuBorders.lg
  ): React.CSSProperties {
    return {
      position: 'relative',
      borderRadius: `${borderRadius}px`,
      padding: `${borderWidth}px`,
      background: gradient,
    };
  }

  /**
   * Inner content styles for gradient border container.
   * Apply these to the inner content wrapper.
   */
  static gradientBorderInner(
    darkMode = false,
    borderRadius = MediasfuBorders.lg
  ): React.CSSProperties {
    return {
      borderRadius: `${borderRadius - 1}px`,
      backgroundColor: darkMode ? MediasfuColors.surfaceDark : MediasfuColors.surface,
      width: '100%',
      height: '100%',
    };
  }

  /** Brand gradient border */
  static brandGradientBorder(
    darkMode = false,
    borderWidth = 2,
    borderRadius = MediasfuBorders.lg
  ): React.CSSProperties {
    return this.gradientBorder(
      MediasfuColors.brandGradient(darkMode),
      borderWidth,
      borderRadius
    );
  }

  /** Accent gradient border */
  static accentGradientBorder(
    darkMode = false,
    borderWidth = 2,
    borderRadius = MediasfuBorders.lg
  ): React.CSSProperties {
    return this.gradientBorder(
      MediasfuColors.accentGradient(darkMode),
      borderWidth,
      borderRadius
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTLINE UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Focus outline (for accessibility) */
  static focusOutline(darkMode = false, color?: string): React.CSSProperties {
    const outlineColor = color ?? (darkMode ? MediasfuColors.primaryDark : MediasfuColors.primary);
    return {
      outline: `2px solid ${outlineColor}`,
      outlineOffset: '2px',
    };
  }

  /** Remove default outline */
  static noOutline(): React.CSSProperties {
    return {
      outline: 'none',
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DIVIDER UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Horizontal divider */
  static horizontalDivider(darkMode = false): React.CSSProperties {
    return {
      width: '100%',
      height: '1px',
      backgroundColor: darkMode ? MediasfuColors.dividerDark : MediasfuColors.divider,
    };
  }

  /** Vertical divider */
  static verticalDivider(darkMode = false): React.CSSProperties {
    return {
      width: '1px',
      height: '100%',
      backgroundColor: darkMode ? MediasfuColors.dividerDark : MediasfuColors.divider,
    };
  }

  /** Gradient horizontal divider */
  static gradientDivider(darkMode = false): React.CSSProperties {
    return {
      width: '100%',
      height: '1px',
      background: MediasfuColors.brandGradient(darkMode),
    };
  }
}

export default MediasfuBorders;
