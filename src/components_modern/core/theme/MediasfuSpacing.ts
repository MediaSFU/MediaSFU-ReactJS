/**
 * Defines the canonical spacing scale for the modern MediaSFU UI.
 *
 * Provides consistent spacing tokens that match the Flutter implementation
 * for padding, margins, and gaps.
 */

import React from 'react';

export class MediasfuSpacing {
  private constructor() {}

  // ═══════════════════════════════════════════════════════════════════════════
  // SPACING SCALE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Extra small spacing - 4px */
  static readonly xs = 4;

  /** Small spacing - 8px */
  static readonly sm = 8;

  /** Medium spacing - 16px */
  static readonly md = 16;

  /** Large spacing - 24px */
  static readonly lg = 24;

  /** Extra large spacing - 32px */
  static readonly xl = 32;

  /** 2X Extra large spacing - 48px */
  static readonly xxl = 48;

  // ═══════════════════════════════════════════════════════════════════════════
  // PADDING UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Padding on all sides */
  static insetAll(value: number): React.CSSProperties {
    return { padding: `${value}px` };
  }

  /** Symmetric padding (horizontal and/or vertical) */
  static insetSymmetric(horizontal = 0, vertical = 0): React.CSSProperties {
    return { padding: `${vertical}px ${horizontal}px` };
  }

  /** Horizontal padding only */
  static insetHorizontal(value: number): React.CSSProperties {
    return { paddingLeft: `${value}px`, paddingRight: `${value}px` };
  }

  /** Vertical padding only */
  static insetVertical(value: number): React.CSSProperties {
    return { paddingTop: `${value}px`, paddingBottom: `${value}px` };
  }

  /** Custom padding for each side */
  static inset(
    top: number,
    right: number,
    bottom: number,
    left: number
  ): React.CSSProperties {
    return { padding: `${top}px ${right}px ${bottom}px ${left}px` };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MARGIN UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Margin on all sides */
  static marginAll(value: number): React.CSSProperties {
    return { margin: `${value}px` };
  }

  /** Symmetric margin (horizontal and/or vertical) */
  static marginSymmetric(horizontal = 0, vertical = 0): React.CSSProperties {
    return { margin: `${vertical}px ${horizontal}px` };
  }

  /** Horizontal margin only */
  static marginHorizontal(value: number): React.CSSProperties {
    return { marginLeft: `${value}px`, marginRight: `${value}px` };
  }

  /** Vertical margin only */
  static marginVertical(value: number): React.CSSProperties {
    return { marginTop: `${value}px`, marginBottom: `${value}px` };
  }

  /** Custom margin for each side */
  static margin(
    top: number,
    right: number,
    bottom: number,
    left: number
  ): React.CSSProperties {
    return { margin: `${top}px ${right}px ${bottom}px ${left}px` };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GAP UTILITIES (for Flexbox and Grid)
  // ═══════════════════════════════════════════════════════════════════════════

  /** Gap for flex/grid containers */
  static gap(value: number): React.CSSProperties {
    return { gap: `${value}px` };
  }

  /** Row gap for grid containers */
  static rowGap(value: number): React.CSSProperties {
    return { rowGap: `${value}px` };
  }

  /** Column gap for grid containers */
  static columnGap(value: number): React.CSSProperties {
    return { columnGap: `${value}px` };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SPACING HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Returns spacing value as pixels string */
  static px(value: number): string {
    return `${value}px`;
  }

  /** Returns spacing value as rem (assuming 16px base) */
  static rem(value: number): string {
    return `${value / 16}rem`;
  }

  /** Multiply a base spacing value */
  static multiply(base: number, factor: number): number {
    return base * factor;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRESET COMBINATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Card padding preset */
  static get cardPadding(): React.CSSProperties {
    return this.insetAll(this.md);
  }

  /** Modal padding preset */
  static get modalPadding(): React.CSSProperties {
    return this.insetAll(this.lg);
  }

  /** Button padding preset */
  static get buttonPadding(): React.CSSProperties {
    return this.insetSymmetric(this.md, this.sm);
  }

  /** Input padding preset */
  static get inputPadding(): React.CSSProperties {
    return this.insetSymmetric(this.md, this.sm);
  }

  /** List item padding preset */
  static get listItemPadding(): React.CSSProperties {
    return this.insetSymmetric(this.md, this.sm);
  }

  /** Section spacing preset */
  static get sectionSpacing(): React.CSSProperties {
    return this.marginVertical(this.xl);
  }
}

export default MediasfuSpacing;
