/**
 * MediaSFU Modern Theme System
 *
 * This module exports the complete theming infrastructure for the
 * modern MediaSFU UI, including colors, typography, spacing, animations,
 * and borders.
 *
 * ## Quick Start
 *
 * Import the theme system:
 * ```tsx
 * import {
 *   MediasfuColors,
 *   MediasfuTypography,
 *   MediasfuSpacing,
 *   MediasfuAnimations,
 *   MediasfuBorders,
 * } from 'mediasfu-reactjs/components_modern';
 * ```
 *
 * ## Usage Examples
 *
 * ### Colors
 * ```tsx
 * // Use static color values
 * const primaryColor = MediasfuColors.primary;
 *
 * // Use theme-aware colors
 * const bgColor = MediasfuColors.themedSurface(isDarkMode);
 *
 * // Use gradients
 * <div style={{ background: MediasfuColors.brandGradient(isDarkMode) }} />
 *
 * // Use glass effects
 * <div style={MediasfuColors.frostedGlass(isDarkMode)} />
 * ```
 *
 * ### Typography
 * ```tsx
 * // Get typography styles
 * <h1 style={MediasfuTypography.getHeadlineLarge(isDarkMode)}>Title</h1>
 * <p style={MediasfuTypography.getBodyMedium(isDarkMode)}>Content</p>
 * ```
 *
 * ### Spacing
 * ```tsx
 * // Use spacing constants
 * <div style={{ padding: MediasfuSpacing.md }} />
 *
 * // Use spacing helpers
 * <div style={MediasfuSpacing.insetSymmetric(MediasfuSpacing.lg, MediasfuSpacing.md)} />
 * ```
 *
 * ### Animations
 * ```tsx
 * // Use animation styles
 * <div style={MediasfuAnimations.fadeIn()} />
 *
 * // Use transitions
 * <button style={{ transition: MediasfuAnimations.transitionAll() }} />
 * ```
 *
 * ### Borders
 * ```tsx
 * // Use border radius
 * <div style={MediasfuBorders.circular(MediasfuBorders.lg)} />
 *
 * // Use border styles
 * <div style={MediasfuBorders.subtle(isDarkMode)} />
 * ```
 */

// Export all theme modules
export { MediasfuColors } from './MediasfuColors';
export type { BoxShadow, GradientConfig } from './MediasfuColors';

export { MediasfuTypography } from './MediasfuTypography';
export type { TextStyleConfig } from './MediasfuTypography';

export { MediasfuSpacing } from './MediasfuSpacing';

export { MediasfuAnimations } from './MediasfuAnimations';
export type { AnimationConfig, SpringConfig, Keyframe } from './MediasfuAnimations';

export { MediasfuBorders } from './MediasfuBorders';

export {
  defaultModernStyleOptions,
  mergeStyleOptions,
  styleOptionsToCSS,
} from './ModernStyleOptions';
export type {
  ModernStyleOptions,
  ContainerDecoration,
} from './ModernStyleOptions';

// Re-export default exports for convenience
export { default as Colors } from './MediasfuColors';
export { default as Typography } from './MediasfuTypography';
export { default as Spacing } from './MediasfuSpacing';
export { default as Animations } from './MediasfuAnimations';
export { default as Borders } from './MediasfuBorders';
