/**
 * Style configuration for modern MediaSFU components.
 *
 * This interface provides a unified way to customize the appearance of
 * modern UI components. It supports custom decorations, colors, shadows,
 * animations, and builder hooks for maximum flexibility.
 *
 * @example
 * ```tsx
 * const customStyle: ModernStyleOptions = {
 *   backgroundColor: MediasfuColors.surfaceDark,
 *   backgroundGradient: MediasfuColors.metallicGradient(true),
 *   borderRadius: 16,
 *   glowEnabled: true,
 *   glowIntensity: 0.5,
 *   animationDuration: MediasfuAnimations.fast,
 * };
 * ```
 */

import React from 'react';

/**
 * Custom decoration configuration
 */
export interface ContainerDecoration {
  /** Background color */
  backgroundColor?: string;
  /** Background gradient (CSS gradient string) */
  backgroundGradient?: string;
  /** Border radius in pixels */
  borderRadius?: number | string;
  /** Border style (CSS border string) */
  border?: string;
  /** Box shadow (CSS box-shadow string) */
  boxShadow?: string;
}

/**
 * Style configuration options for modern components
 */
export interface ModernStyleOptions {
  // ═══════════════════════════════════════════════════════════════════════════
  // CONTAINER DECORATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Custom decoration for the container */
  containerDecoration?: ContainerDecoration;

  /** Custom decoration for hover/focus states */
  hoverDecoration?: ContainerDecoration;

  /** Custom decoration for pressed/active states */
  activeDecoration?: ContainerDecoration;

  /** Custom padding (CSS padding value or React.CSSProperties) */
  padding?: string | number | React.CSSProperties;

  /** Custom margin (CSS margin value or React.CSSProperties) */
  margin?: string | number | React.CSSProperties;

  // ═══════════════════════════════════════════════════════════════════════════
  // GLOW EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Enable glow effect around the container */
  glowEnabled?: boolean;

  /** Intensity of the glow effect (0.0 to 1.0) */
  glowIntensity?: number;

  /** Custom color for the glow effect */
  glowColor?: string;

  // ═══════════════════════════════════════════════════════════════════════════
  // NEUMORPHISM
  // ═══════════════════════════════════════════════════════════════════════════

  /** Enable neumorphic (soft 3D) effect */
  neumorphicEnabled?: boolean;

  /** Depth of neumorphic effect (1, 2, or 3) */
  neumorphicDepth?: 1 | 2 | 3;

  // ═══════════════════════════════════════════════════════════════════════════
  // PULSE BORDER
  // ═══════════════════════════════════════════════════════════════════════════

  /** Enable pulse border animation */
  pulseBorderEnabled?: boolean;

  /** Color of the pulse border */
  pulseBorderColor?: string;

  // ═══════════════════════════════════════════════════════════════════════════
  // SKELETON LOADING
  // ═══════════════════════════════════════════════════════════════════════════

  /** Enable skeleton loading state */
  showSkeleton?: boolean;

  // ═══════════════════════════════════════════════════════════════════════════
  // STYLING PROPERTIES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Custom border radius in pixels */
  borderRadius?: number;

  /** Custom border (CSS border string) */
  border?: string;

  /** Custom background color */
  backgroundColor?: string;

  /** Custom gradient background (CSS gradient string) */
  backgroundGradient?: string;

  /** Custom box shadow (CSS box-shadow string) */
  boxShadow?: string;

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATION OPTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Animation duration for state transitions in milliseconds */
  animationDuration?: number;

  /** CSS animation easing function */
  animationEasing?: string;

  /** Enable/disable animations */
  animationsEnabled?: boolean;

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE OPTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Opacity for disabled state (0.0 to 1.0) */
  disabledOpacity?: number;

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSFORM OPTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Custom CSS transform */
  transform?: string;

  // ═══════════════════════════════════════════════════════════════════════════
  // SIZE CONSTRAINTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Minimum height */
  minHeight?: number | string;

  /** Minimum width */
  minWidth?: number | string;

  /** Maximum height */
  maxHeight?: number | string;

  /** Maximum width */
  maxWidth?: number | string;

  /** Fixed height */
  height?: number | string;

  /** Fixed width */
  width?: number | string;

  // ═══════════════════════════════════════════════════════════════════════════
  // LAYOUT OPTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Alignment of child within the container */
  alignment?: 'flex-start' | 'center' | 'flex-end' | 'stretch';

  /** Justify content */
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

  // ═══════════════════════════════════════════════════════════════════════════
  // GLASSMORPHISM
  // ═══════════════════════════════════════════════════════════════════════════

  /** Blur amount for glassmorphism in pixels */
  blurAmount?: number;

  /** Enable backdrop filter blur */
  backdropBlurEnabled?: boolean;

  // ═══════════════════════════════════════════════════════════════════════════
  // THEME OPTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Use adaptive styling based on platform */
  adaptiveStyling?: boolean;

  /** Theme brightness override */
  brightnessOverride?: 'light' | 'dark';

  // ═══════════════════════════════════════════════════════════════════════════
  // OVERFLOW
  // ═══════════════════════════════════════════════════════════════════════════

  /** CSS overflow property */
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSTOM STYLES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Additional custom styles to merge */
  customStyles?: React.CSSProperties;
}

/**
 * Default style options
 */
export const defaultModernStyleOptions: ModernStyleOptions = {
  glowEnabled: false,
  glowIntensity: 0.3,
  neumorphicEnabled: false,
  neumorphicDepth: 1,
  pulseBorderEnabled: false,
  showSkeleton: false,
  animationsEnabled: true,
  disabledOpacity: 0.5,
  backdropBlurEnabled: false,
  adaptiveStyling: true,
};

/**
 * Merge two ModernStyleOptions objects.
 * Values from the second object take precedence when not undefined.
 */
export function mergeStyleOptions(
  base: ModernStyleOptions,
  override?: ModernStyleOptions
): ModernStyleOptions {
  if (!override) return base;
  return { ...base, ...override };
}

/**
 * Convert ModernStyleOptions to React CSSProperties.
 * This is useful for applying options directly to a component's style prop.
 * @param options - The style options to convert
 * @param darkMode - Whether dark mode is enabled (reserved for future use)
 */
export function styleOptionsToCSS(
  options: ModernStyleOptions,
  darkMode = false
): React.CSSProperties {
  // darkMode reserved for future theme-aware conversions
  void darkMode;
  const styles: React.CSSProperties = {};

  // Background
  if (options.backgroundGradient) {
    styles.background = options.backgroundGradient;
  } else if (options.backgroundColor) {
    styles.backgroundColor = options.backgroundColor;
  }

  // Border
  if (options.borderRadius !== undefined) {
    styles.borderRadius = typeof options.borderRadius === 'number'
      ? `${options.borderRadius}px`
      : options.borderRadius;
  }
  if (options.border) {
    styles.border = options.border;
  }

  // Shadow
  if (options.boxShadow) {
    styles.boxShadow = options.boxShadow;
  }

  // Size constraints
  if (options.width !== undefined) {
    styles.width = typeof options.width === 'number' ? `${options.width}px` : options.width;
  }
  if (options.height !== undefined) {
    styles.height = typeof options.height === 'number' ? `${options.height}px` : options.height;
  }
  if (options.minWidth !== undefined) {
    styles.minWidth = typeof options.minWidth === 'number' ? `${options.minWidth}px` : options.minWidth;
  }
  if (options.minHeight !== undefined) {
    styles.minHeight = typeof options.minHeight === 'number' ? `${options.minHeight}px` : options.minHeight;
  }
  if (options.maxWidth !== undefined) {
    styles.maxWidth = typeof options.maxWidth === 'number' ? `${options.maxWidth}px` : options.maxWidth;
  }
  if (options.maxHeight !== undefined) {
    styles.maxHeight = typeof options.maxHeight === 'number' ? `${options.maxHeight}px` : options.maxHeight;
  }

  // Padding and margin
  if (options.padding !== undefined) {
    if (typeof options.padding === 'object') {
      Object.assign(styles, options.padding);
    } else {
      styles.padding = typeof options.padding === 'number' ? `${options.padding}px` : options.padding;
    }
  }
  if (options.margin !== undefined) {
    if (typeof options.margin === 'object') {
      Object.assign(styles, options.margin);
    } else {
      styles.margin = typeof options.margin === 'number' ? `${options.margin}px` : options.margin;
    }
  }

  // Transform
  if (options.transform) {
    styles.transform = options.transform;
  }

  // Layout
  if (options.alignment) {
    styles.alignItems = options.alignment;
  }
  if (options.justifyContent) {
    styles.justifyContent = options.justifyContent;
  }

  // Overflow
  if (options.overflow) {
    styles.overflow = options.overflow;
  }

  // Glassmorphism
  if (options.backdropBlurEnabled && options.blurAmount) {
    styles.backdropFilter = `blur(${options.blurAmount}px)`;
    styles.WebkitBackdropFilter = `blur(${options.blurAmount}px)`;
  }

  // Animation
  if (options.animationsEnabled !== false && options.animationDuration) {
    const easing = options.animationEasing || 'ease-in-out';
    styles.transition = `all ${options.animationDuration}ms ${easing}`;
  }

  // Custom styles
  if (options.customStyles) {
    Object.assign(styles, options.customStyles);
  }

  return styles;
}

export default ModernStyleOptions;
