/**
 * Typography scale derived from the redesign specification.
 *
 * Provides text styles that match the Flutter implementation
 * using the Inter font family.
 */

import React from 'react';
import { MediasfuColors } from './MediasfuColors';

// Type definition for text style
export interface TextStyleConfig {
  fontSize: number;
  fontWeight: number | string;
  letterSpacing?: number;
  lineHeight?: number;
  fontFamily: string;
}

export class MediasfuTypography {
  private constructor() {}

  // ═══════════════════════════════════════════════════════════════════════════
  // FONT CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════

  /** Primary font family */
  static readonly fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif";

  /** Monospace font family for code */
  static readonly monoFontFamily = "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace";

  // ═══════════════════════════════════════════════════════════════════════════
  // TEXT STYLE PRESETS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Display Large - For hero sections and major headings */
  static readonly displayLarge: TextStyleConfig = {
    fontSize: 57,
    fontWeight: 600,
    letterSpacing: -0.25,
    lineHeight: 1.05,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Display Medium - For section headings */
  static readonly displayMedium: TextStyleConfig = {
    fontSize: 45,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1.1,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Display Small */
  static readonly displaySmall: TextStyleConfig = {
    fontSize: 36,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1.15,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Headline Large - Primary page headings */
  static readonly headlineLarge: TextStyleConfig = {
    fontSize: 32,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1.2,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Headline Medium */
  static readonly headlineMedium: TextStyleConfig = {
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1.25,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Headline Small */
  static readonly headlineSmall: TextStyleConfig = {
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1.3,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Title Large - Card and section titles */
  static readonly titleLarge: TextStyleConfig = {
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1.3,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Title Medium */
  static readonly titleMedium: TextStyleConfig = {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: 0.1,
    lineHeight: 1.35,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Title Small */
  static readonly titleSmall: TextStyleConfig = {
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.1,
    lineHeight: 1.4,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Body Large - Primary body text */
  static readonly bodyLarge: TextStyleConfig = {
    fontSize: 16,
    fontWeight: 400,
    letterSpacing: 0.5,
    lineHeight: 1.4,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Body Medium - Secondary body text */
  static readonly bodyMedium: TextStyleConfig = {
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 0.25,
    lineHeight: 1.45,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Body Small - Captions and helper text */
  static readonly bodySmall: TextStyleConfig = {
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: 0.4,
    lineHeight: 1.5,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Label Large - Button text, tabs */
  static readonly labelLarge: TextStyleConfig = {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.1,
    lineHeight: 1.4,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Label Medium - Smaller button text */
  static readonly labelMedium: TextStyleConfig = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.5,
    lineHeight: 1.4,
    fontFamily: MediasfuTypography.fontFamily,
  };

  /** Label Small - Tiny labels, badges */
  static readonly labelSmall: TextStyleConfig = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.5,
    lineHeight: 1.4,
    fontFamily: MediasfuTypography.fontFamily,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STYLE GENERATORS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Convert TextStyleConfig to React CSSProperties */
  static toStyle(config: TextStyleConfig, color?: string): React.CSSProperties {
    return {
      fontSize: `${config.fontSize}px`,
      fontWeight: config.fontWeight,
      letterSpacing: config.letterSpacing ? `${config.letterSpacing}px` : undefined,
      lineHeight: config.lineHeight,
      fontFamily: config.fontFamily,
      color: color,
    };
  }

  /** Get display large style */
  static getDisplayLarge(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.displayLarge,
      darkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary
    );
  }

  /** Get display medium style */
  static getDisplayMedium(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.displayMedium,
      darkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary
    );
  }

  /** Get headline large style */
  static getHeadlineLarge(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.headlineLarge,
      darkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary
    );
  }

  /** Get headline medium style */
  static getHeadlineMedium(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.headlineMedium,
      darkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary
    );
  }

  /** Get headline small style */
  static getHeadlineSmall(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.headlineSmall,
      darkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary
    );
  }

  /** Get title large style */
  static getTitleLarge(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.titleLarge,
      darkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary
    );
  }

  /** Get title medium style */
  static getTitleMedium(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.titleMedium,
      darkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary
    );
  }

  /** Get title small style */
  static getTitleSmall(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.titleSmall,
      darkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary
    );
  }

  /** Get body large style */
  static getBodyLarge(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.bodyLarge,
      darkMode ? MediasfuColors.textSecondaryDark : MediasfuColors.textSecondary
    );
  }

  /** Get body medium style */
  static getBodyMedium(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.bodyMedium,
      darkMode ? MediasfuColors.textSecondaryDark : MediasfuColors.textSecondary
    );
  }

  /** Get body small style */
  static getBodySmall(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.bodySmall,
      darkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted
    );
  }

  /** Get label large style */
  static getLabelLarge(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.labelLarge,
      darkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary
    );
  }

  /** Get label medium style */
  static getLabelMedium(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.labelMedium,
      darkMode ? MediasfuColors.textSecondaryDark : MediasfuColors.textSecondary
    );
  }

  /** Get label small style */
  static getLabelSmall(darkMode = false): React.CSSProperties {
    return this.toStyle(
      this.labelSmall,
      darkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SEMANTIC TEXT STYLES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Error text style */
  static getErrorText(darkMode = false): React.CSSProperties {
    return {
      ...this.toStyle(this.bodySmall),
      color: darkMode ? MediasfuColors.dangerLight : MediasfuColors.danger,
    };
  }

  /** Success text style */
  static getSuccessText(darkMode = false): React.CSSProperties {
    return {
      ...this.toStyle(this.bodySmall),
      color: darkMode ? MediasfuColors.successLight : MediasfuColors.success,
    };
  }

  /** Warning text style */
  static getWarningText(darkMode = false): React.CSSProperties {
    return {
      ...this.toStyle(this.bodySmall),
      color: darkMode ? MediasfuColors.warningLight : MediasfuColors.warning,
    };
  }

  /** Info text style */
  static getInfoText(darkMode = false): React.CSSProperties {
    return {
      ...this.toStyle(this.bodySmall),
      color: darkMode ? MediasfuColors.infoLight : MediasfuColors.info,
    };
  }

  /** Link text style */
  static getLinkText(darkMode = false): React.CSSProperties {
    return {
      ...this.toStyle(this.bodyMedium),
      color: darkMode ? MediasfuColors.primaryDark : MediasfuColors.primary,
      textDecoration: 'none',
      cursor: 'pointer',
    };
  }

  /** Muted text style */
  static getMutedText(darkMode = false): React.CSSProperties {
    return {
      ...this.toStyle(this.bodyMedium),
      color: darkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
    };
  }

  /** Code/Monospace text style */
  static getCodeText(darkMode = false): React.CSSProperties {
    return {
      fontSize: '13px',
      fontWeight: 400,
      fontFamily: this.monoFontFamily,
      color: darkMode ? MediasfuColors.accentDark : MediasfuColors.accent,
      backgroundColor: darkMode
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.06)',
      padding: '2px 6px',
      borderRadius: '4px',
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Truncate text with ellipsis */
  static truncate(lines = 1): React.CSSProperties {
    if (lines === 1) {
      return {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      };
    }
    return {
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: lines,
      WebkitBoxOrient: 'vertical',
    };
  }

  /** Text alignment */
  static align(alignment: 'left' | 'center' | 'right' | 'justify'): React.CSSProperties {
    return { textAlign: alignment };
  }

  /** Text transform */
  static transform(
    type: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
  ): React.CSSProperties {
    return { textTransform: type };
  }

  /** Custom font weight */
  static weight(weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900): React.CSSProperties {
    return { fontWeight: weight };
  }
}

export default MediasfuTypography;
