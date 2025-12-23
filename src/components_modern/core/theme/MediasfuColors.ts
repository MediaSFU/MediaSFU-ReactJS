/**
 * Design tokens representing the modern MediaSFU colour palette.
 *
 * This class provides a comprehensive color system with:
 * - Light and dark palettes with extended color spectrums
 * - Premium gradient systems (brand, metallic, iridescent, aurora)
 * - Glow and shadow utilities for depth effects
 * - Glass morphism decorations
 * - Neumorphic shadow pairs for 3D effects
 * - Interactive state utilities
 */

import React from 'react';

// Type definitions
export interface BoxShadow {
  color: string;
  blurRadius: number;
  spreadRadius?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface GradientConfig {
  colors: string[];
  stops?: number[];
  direction?: string; // CSS gradient direction
}

export class MediasfuColors {
  private constructor() {}

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY PALETTE - LIGHT MODE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Primary brand color - Indigo 500 */
  static readonly primary = '#6366F1';

  /** Primary variant for emphasis - Indigo 600 */
  static readonly primaryVariant = '#4F46E5';

  /** Primary light variant - Indigo 400 */
  static readonly primaryLight = '#818CF8';

  /** Secondary brand color - Blue 500 */
  static readonly secondary = '#3B82F6';

  /** Secondary light variant - Blue 400 */
  static readonly secondaryLight = '#60A5FA';

  /** Secondary dark variant - Blue 600 */
  static readonly secondaryDark = '#2563EB';

  /** Accent color - Cyan 500 */
  static readonly accent = '#06B6D4';

  /** Accent light variant - Cyan 400 */
  static readonly accentLight = '#22D3EE';

  /** Accent dark variant - Cyan 600 */
  static readonly accentDarkVariant = '#0891B2';

  // Surface colors - Light mode
  static readonly surface = '#FFFFFF';
  static readonly surfaceElevated = '#F1F5F9';
  static readonly background = '#F8FAFC';
  static readonly card = '#FFFFFF';
  static readonly cardHover = '#F1F5F9';
  static readonly divider = '#E2E8F0';

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY PALETTE - DARK MODE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Primary brand color for dark mode - Indigo 400 */
  static readonly primaryDark = '#818CF8';

  /** Primary dark variant - Indigo 500 */
  static readonly primaryDarkVariant = '#6366F1';

  /** Primary light dark mode - Indigo 300 */
  static readonly primaryLightDark = '#A5B4FC';

  /** Secondary for dark mode - Blue 400 */
  static readonly secondaryDarkMode = '#60A5FA';

  /** Secondary light dark mode - Blue 300 */
  static readonly secondaryLightDark = '#93C5FD';

  /** Accent for dark mode - Cyan 400 */
  static readonly accentDark = '#22D3EE';

  /** Accent light dark mode - Cyan 300 */
  static readonly accentLightDark = '#67E8F9';

  // Surface colors - Dark mode
  static readonly surfaceDark = '#1E293B';
  static readonly surfaceElevatedDark = '#334155';
  static readonly backgroundDark = '#0F172A';
  static readonly cardDark = '#1E293B';
  static readonly cardHoverDark = '#334155';
  static readonly dividerDark = '#334155';

  // ═══════════════════════════════════════════════════════════════════════════
  // SEMANTIC COLORS
  // ═══════════════════════════════════════════════════════════════════════════

  // Success spectrum - Emerald
  static readonly success = '#34D399';
  static readonly successLight = '#6EE7B7';
  static readonly successDark = '#10B981';
  static readonly successBackground = '#ECFDF5';
  static readonly successBackgroundDark = '#064E3B';

  // Warning spectrum - Amber
  static readonly warning = '#FBBF24';
  static readonly warningLight = '#FDE68A';
  static readonly warningDark = '#F59E0B';
  static readonly warningBackground = '#FFFBEB';
  static readonly warningBackgroundDark = '#78350F';

  // Danger/Error spectrum - Rose
  static readonly danger = '#FB7185';
  static readonly dangerLight = '#FDA4AF';
  static readonly dangerDark = '#F43F5E';
  static readonly dangerBackground = '#FFF1F2';
  static readonly dangerBackgroundDark = '#881337';

  // Info spectrum - Sky
  static readonly info = '#38BDF8';
  static readonly infoLight = '#7DD3FC';
  static readonly infoDark = '#0EA5E9';
  static readonly infoBackground = '#F0F9FF';
  static readonly infoBackgroundDark = '#0C4A6E';

  // ═══════════════════════════════════════════════════════════════════════════
  // TEXT COLORS
  // ═══════════════════════════════════════════════════════════════════════════

  static readonly textPrimary = '#0F172A';
  static readonly textSecondary = '#475569';
  static readonly textMuted = '#94A3B8';
  static readonly textDisabled = '#CBD5E1';

  static readonly textPrimaryDark = '#F8FAFC';
  static readonly textSecondaryDark = '#CBD5E1';
  static readonly textMutedDark = '#94A3B8';
  static readonly textDisabledDark = '#64748B';

  // ═══════════════════════════════════════════════════════════════════════════
  // GRADIENT SYSTEMS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Brand gradient - Primary to secondary to accent blend. */
  static brandGradient(darkMode = false): string {
    const colors = darkMode
      ? ['#818CF8', '#60A5FA', '#22D3EE']
      : ['#6366F1', '#3B82F6', '#06B6D4'];
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
  }

  /** Simple brand gradient - Primary to secondary only. */
  static simpleBrandGradient(darkMode = false): string {
    const colors = darkMode
      ? ['#818CF8', '#60A5FA']
      : ['#6366F1', '#3B82F6'];
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
  }

  /** Premium accent gradient - Cyan to indigo sweep. */
  static accentGradient(darkMode = false): string {
    const colors = darkMode
      ? ['#22D3EE', '#818CF8']
      : ['#06B6D4', '#6366F1'];
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
  }

  /** Metallic gradient - Sophisticated silver/chrome effect. */
  static metallicGradient(darkMode = false): string {
    const colors = darkMode
      ? ['#64748B', '#94A3B8', '#CBD5E1', '#94A3B8', '#64748B']
      : ['#E2E8F0', '#F1F5F9', '#FFFFFF', '#F1F5F9', '#E2E8F0'];
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 75%, ${colors[4]} 100%)`;
  }

  /** Iridescent gradient - Multi-color holographic effect. */
  static iridescentGradient(darkMode = false): string {
    const colors = darkMode
      ? ['#818CF8', '#60A5FA', '#22D3EE', '#2DD4BF', '#34D399']
      : ['#6366F1', '#3B82F6', '#06B6D4', '#14B8A6', '#10B981'];
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 75%, ${colors[4]} 100%)`;
  }

  /** Aurora gradient - Northern lights effect. */
  static auroraGradient(darkMode = false): string {
    const colors = darkMode
      ? ['#10B981', '#22D3EE', '#60A5FA', '#818CF8']
      : ['#059669', '#06B6D4', '#3B82F6', '#6366F1'];
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 33%, ${colors[2]} 66%, ${colors[3]} 100%)`;
  }

  /** Sunset gradient - Warm amber to orange to coral blend. */
  static sunsetGradient(darkMode = false): string {
    const colors = darkMode
      ? ['#FBBF24', '#FB923C', '#F87171']
      : ['#F59E0B', '#F97316', '#EF4444'];
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
  }

  /** Ocean gradient - Deep blue to teal. */
  static oceanGradient(darkMode = false): string {
    const colors = darkMode
      ? ['#3B82F6', '#22D3EE', '#10B981']
      : ['#2563EB', '#06B6D4', '#059669'];
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
  }

  /** Radial brand gradient - For circular elements. */
  static radialBrandGradient(darkMode = false): string {
    const colors = darkMode
      ? ['#818CF8', '#60A5FA', '#0F172A']
      : ['#6366F1', '#3B82F6', '#F8FAFC'];
    return `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
  }

  /** Sweep/Conic gradient - For spinner/loading elements. */
  static sweepGradient(darkMode = false): string {
    const colors = darkMode
      ? ['#818CF8', '#22D3EE', '#60A5FA', '#818CF8']
      : ['#6366F1', '#06B6D4', '#3B82F6', '#6366F1'];
    return `conic-gradient(from 0deg, ${colors[0]} 0%, ${colors[1]} 33%, ${colors[2]} 66%, ${colors[3]} 100%)`;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ELEVATION SHADOW SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════

  /** Utility for elevation shadow levels (1-5). Returns CSS box-shadow string. */
  static elevation(level = 2, darkMode = false): string {
    const baseAlpha = darkMode ? 0.35 : 0.15;

    switch (level) {
      case 1:
        return `0 1px 4px rgba(0, 0, 0, ${darkMode ? 0.25 : 0.05}), 0 1px 2px rgba(0, 0, 0, ${darkMode ? 0.15 : 0.03})`;
      case 2:
        return `0 2px 8px rgba(0, 0, 0, ${darkMode ? 0.3 : 0.07}), 0 1px 3px rgba(0, 0, 0, ${darkMode ? 0.15 : 0.04})`;
      case 3:
        return `0 4px 16px rgba(0, 0, 0, ${darkMode ? 0.35 : 0.1}), 0 2px 6px rgba(0, 0, 0, ${darkMode ? 0.2 : 0.06})`;
      case 4:
        return `0 8px 24px rgba(0, 0, 0, ${darkMode ? 0.4 : 0.12}), 0 4px 10px rgba(0, 0, 0, ${darkMode ? 0.25 : 0.08})`;
      case 5:
        return `0 12px 32px rgba(0, 0, 0, ${darkMode ? 0.45 : 0.15}), 0 6px 14px rgba(0, 0, 0, ${darkMode ? 0.3 : 0.1})`;
      default:
        return `0 12px 18px rgba(0, 0, 0, ${baseAlpha})`;
    }
  }

  /** Colored elevation shadows - Matches the element's color. */
  static coloredElevation(color: string, level = 2): string {
    switch (level) {
      case 1:
        return `0 2px 8px ${this.hexToRgba(color, 0.2)}`;
      case 2:
        return `0 4px 16px ${this.hexToRgba(color, 0.25)}, 0 2px 6px ${this.hexToRgba(color, 0.15)}`;
      case 3:
      default:
        return `0 8px 24px ${this.hexToRgba(color, 0.3)}, 0 4px 10px ${this.hexToRgba(color, 0.2)}`;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GLOW EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Pre-computed primary glow - Convenience property for common use. */
  static get glowPrimary(): string {
    return this.glowShadow(this.primary, 0.6);
  }

  /** Pre-computed secondary glow - Convenience property for common use. */
  static get glowSecondary(): string {
    return this.glowShadow(this.secondary, 0.5);
  }

  /** Pre-computed accent glow - Convenience property for common use. */
  static get glowAccent(): string {
    return this.glowShadow(this.accent, 0.5);
  }

  /** Pre-computed success glow - Convenience property for common use. */
  static get glowSuccess(): string {
    return this.glowShadow(this.success, 0.5);
  }

  /** Pre-computed danger glow - Convenience property for common use. */
  static get glowDanger(): string {
    return this.glowShadow(this.danger, 0.5);
  }

  /**
   * Glow shadow - For buttons, icons, and interactive elements.
   * @param color - The color for the glow
   * @param intensity - ranges from 0.0 to 1.0
   */
  static glowShadow(color: string, intensity = 0.5): string {
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    return `0 0 32px 4px ${this.hexToRgba(color, 0.15 * clampedIntensity)}, 0 0 16px 2px ${this.hexToRgba(color, 0.25 * clampedIntensity)}, 0 0 8px ${this.hexToRgba(color, 0.4 * clampedIntensity)}`;
  }

  /** Subtle glow - For hover states and subtle highlights. */
  static subtleGlow(color: string, darkMode = false): string {
    const alpha = darkMode ? 0.2 : 0.15;
    return `0 0 20px 1px ${this.hexToRgba(color, alpha)}`;
  }

  /**
   * Pulsating glow base - Use with CSS animation for pulsing effect.
   * @param color - The color for the glow
   * @param phase - should be animated between 0.0 and 1.0
   */
  static pulseGlow(color: string, phase: number): string {
    const intensity = 0.3 + (0.3 * phase);
    const blurRadius = 24 + (8 * phase);
    const spreadRadius = 2 + (2 * phase);
    return `0 0 ${blurRadius}px ${spreadRadius}px ${this.hexToRgba(color, intensity * 0.5)}, 0 0 ${12 + (4 * phase)}px ${this.hexToRgba(color, intensity)}`;
  }

  /** Neon glow - High intensity colored glow. */
  static neonGlow(color: string): string {
    return `0 0 40px 8px ${this.hexToRgba(color, 0.1)}, 0 0 20px 4px ${this.hexToRgba(color, 0.3)}, 0 0 10px 1px ${this.hexToRgba(color, 0.5)}, 0 0 4px ${this.hexToRgba(color, 0.8)}`;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NEUMORPHISM
  // ═══════════════════════════════════════════════════════════════════════════

  /** Neumorphic shadow pair - Creates the raised 3D effect. */
  static neumorphicShadow(darkMode = false, isPressed = false): string {
    if (darkMode) {
      return isPressed
        ? `-2px -2px 4px rgba(0, 0, 0, 0.5), 2px 2px 4px rgba(45, 58, 79, 0.3)`
        : `4px 4px 8px rgba(0, 0, 0, 0.6), -4px -4px 8px rgba(45, 58, 79, 0.4)`;
    } else {
      return isPressed
        ? `-2px -2px 4px rgba(0, 0, 0, 0.1), 2px 2px 4px rgba(255, 255, 255, 0.7)`
        : `4px 4px 8px rgba(0, 0, 0, 0.12), -4px -4px 8px rgba(255, 255, 255, 0.9)`;
    }
  }

  /** Inner shadow for pressed/inset states. Returns CSS background gradient string. */
  static innerShadowGradient(darkMode = false): string {
    if (darkMode) {
      return `linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, transparent 50%, rgba(45, 58, 79, 0.1) 100%)`;
    } else {
      return `linear-gradient(135deg, rgba(0, 0, 0, 0.08) 0%, transparent 50%, rgba(255, 255, 255, 0.5) 100%)`;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GLASSMORPHISM
  // ═══════════════════════════════════════════════════════════════════════════

  /** Glass effect background color. */
  static glassBackground(darkMode = false): string {
    return darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  }

  /** Glass effect border color. */
  static glassBorder(darkMode = false): string {
    return darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.35)';
  }

  /** Premium frosted glass styles as React CSSProperties. */
  static frostedGlass(darkMode = false, borderRadius = 20): React.CSSProperties {
    return {
      backgroundColor: darkMode
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(255, 255, 255, 0.75)',
      borderRadius: `${borderRadius}px`,
      border: darkMode
        ? '1.5px solid rgba(255, 255, 255, 0.12)'
        : '1.5px solid rgba(255, 255, 255, 0.8)',
      boxShadow: `0 8px 24px rgba(0, 0, 0, ${darkMode ? 0.3 : 0.08})`,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    };
  }

  /** Gradient border for glass effect. */
  static glassGradientBorder(darkMode = false): string {
    return darkMode
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 100%)';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERACTIVE STATE UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Get hover color for any base color. */
  static hoverColor(base: string, darkMode = false): string {
    const factor = darkMode ? 0.1 : 0.08;
    const mixColor = darkMode ? '#FFFFFF' : '#000000';
    return this.mixColors(base, mixColor, factor);
  }

  /** Get pressed/active color for any base color. */
  static pressedColor(base: string, darkMode = false): string {
    const factor = darkMode ? 0.2 : 0.15;
    const mixColor = darkMode ? '#FFFFFF' : '#000000';
    return this.mixColors(base, mixColor, factor);
  }

  /** Get disabled color for any base color. */
  static disabledColor(base: string): string {
    return this.hexToRgba(base, 0.4);
  }

  /** Get focus ring color. */
  static focusRing(darkMode = false): string {
    return darkMode
      ? this.hexToRgba(this.primaryDark, 0.5)
      : this.hexToRgba(this.primary, 0.4);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // OVERLAY & BACKDROP
  // ═══════════════════════════════════════════════════════════════════════════

  /** Modal backdrop overlay color. */
  static modalBackdrop(darkMode = false): string {
    return darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)';
  }

  /** Scrim overlay for dimming content. */
  static scrim(darkMode = false, opacity = 0.5): string {
    const adjustedOpacity = darkMode ? opacity : opacity * 0.6;
    return `rgba(0, 0, 0, ${adjustedOpacity})`;
  }

  /** Shimmer base color for loading states. */
  static shimmerBase(darkMode = false): string {
    return darkMode ? '#334155' : '#E2E8F0';
  }

  /** Shimmer highlight color for loading states. */
  static shimmerHighlight(darkMode = false): string {
    return darkMode ? '#475569' : '#F8FAFC';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COLOR MANIPULATION UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Creates a hex color from RGB values. */
  static fromRgb(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  /** Converts a hex color to rgba string. */
  static hexToRgba(hex: string, alpha: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(0, 0, 0, ${alpha})`;
    return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
  }

  /** Parses hex to RGB object. */
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /** Mixes two colors by a factor. */
  static mixColors(color1: string, color2: string, factor: number): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    if (!rgb1 || !rgb2) return color1;

    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

    return this.fromRgb(r, g, b);
  }

  /**
   * Adjusts brightness of a color.
   * @param color - Hex color
   * @param factor - ranges from -1.0 (darker) to 1.0 (lighter)
   */
  static adjustBrightness(color: string, factor: number): string {
    const clampedFactor = Math.max(-1, Math.min(1, factor));
    const mixColor = clampedFactor > 0 ? '#FFFFFF' : '#000000';
    return this.mixColors(color, mixColor, Math.abs(clampedFactor));
  }

  /**
   * Returns contrasting text color (white or dark) for given background.
   * Uses luminance calculation.
   */
  static contrastingText(background: string): string {
    const rgb = this.hexToRgb(background);
    if (!rgb) return this.textPrimary;

    // Calculate relative luminance
    const luminance =
      (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? this.textPrimary : this.textPrimaryDark;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DROPDOWN / INPUT STYLING
  // ═══════════════════════════════════════════════════════════════════════════

  /** Dropdown background color with proper contrast. */
  static dropdownBackground(darkMode = false): string {
    return darkMode ? '#1E293B' : '#FFFFFF';
  }

  /** Dropdown item hover/selected background. */
  static dropdownItemHover(darkMode = false): string {
    return darkMode
      ? this.hexToRgba(this.primary, 0.15)
      : this.hexToRgba(this.primary, 0.08);
  }

  /** Dropdown border color. */
  static dropdownBorder(darkMode = false): string {
    return darkMode
      ? this.hexToRgba(this.primary, 0.3)
      : this.hexToRgba(this.primary, 0.2);
  }

  /** Input/dropdown container styles with proper theming. */
  static dropdownStyles(darkMode = false, focused = false): React.CSSProperties {
    return {
      backgroundColor: darkMode
        ? this.hexToRgba(this.surfaceElevatedDark, 0.8)
        : 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      border: focused
        ? `2px solid ${darkMode ? this.primaryDark : this.primary}`
        : `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
      boxShadow: focused
        ? `0 0 8px ${this.hexToRgba(darkMode ? this.primaryDark : this.primary, 0.2)}`
        : undefined,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TOOLTIP STYLING
  // ═══════════════════════════════════════════════════════════════════════════

  /** Tooltip background color. */
  static tooltipBackground(darkMode = false): string {
    return darkMode ? '#334155' : '#1E293B';
  }

  /** Tooltip text color - always light for visibility. */
  static tooltipText(darkMode = false): string {
    // Always returns white for visibility, darkMode kept for API consistency
    void darkMode;
    return '#FFFFFF';
  }

  /** Tooltip styles with premium styling. */
  static tooltipStyles(darkMode = false): React.CSSProperties {
    return {
      backgroundColor: this.tooltipBackground(darkMode),
      borderRadius: '8px',
      border: `1px solid ${this.hexToRgba(this.primary, 0.3)}`,
      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 8px ${this.hexToRgba(this.primary, 0.1)}`,
      color: this.tooltipText(darkMode),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ALERT/NOTIFICATION BACKDROP
  // ═══════════════════════════════════════════════════════════════════════════

  /** Light/transparent alert backdrop - allows seeing content underneath. */
  static alertBackdrop(darkMode = false): string {
    return darkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.15)';
  }

  /** Get themed surface color based on elevation context. */
  static themedSurface(darkMode = false, elevation = 0): string {
    if (darkMode) {
      switch (elevation) {
        case 0:
          return this.backgroundDark;
        case 1:
          return this.surfaceDark;
        case 2:
          return this.surfaceElevatedDark;
        default:
          return this.cardHoverDark;
      }
    } else {
      switch (elevation) {
        case 0:
          return this.background;
        case 1:
          return this.surface;
        case 2:
          return this.surfaceElevated;
        default:
          return this.cardHover;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // THEMED TEXT & ICON COLORS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Theme-aware primary text color */
  static themedText(darkMode = false): string {
    return darkMode ? this.textPrimaryDark : this.textPrimary;
  }

  /** Theme-aware secondary text color */
  static themedSecondaryText(darkMode = false): string {
    return darkMode ? this.textSecondaryDark : this.textSecondary;
  }

  /** Theme-aware icon color (same as text for consistency) */
  static themedIcon(darkMode = false): string {
    return darkMode ? this.textPrimaryDark : this.textPrimary;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTROL BUTTON COLORS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Theme-aware control button inactive color */
  static controlButtonInactive(darkMode = false): string {
    return darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.87)';
  }

  /** Theme-aware control button active color */
  static controlButtonActive(darkMode = false): string {
    return darkMode ? this.primaryDark : this.primary;
  }

  /** Theme-aware text color for control labels */
  static controlTextColor(darkMode = false): string {
    return darkMode ? '#FFFFFF' : 'rgba(0, 0, 0, 0.87)';
  }

  /** Recording status - active (recording) */
  static get recordingActive(): string {
    return this.danger;
  }

  /** Recording status - paused */
  static get recordingPaused(): string {
    return this.warning;
  }

  /** Recording status - stopped */
  static get recordingStopped(): string {
    return this.success;
  }
}

export default MediasfuColors;
