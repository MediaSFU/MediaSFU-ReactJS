/**
 * Core Widgets Module - Premium UI Components
 *
 * This module exports all premium widget components for the modern UI system.
 * These widgets provide consistent styling, animations, and dark mode support.
 *
 * @example
 * ```tsx
 * import {
 *   GlassmorphicContainer,
 *   GradientCard,
 *   PremiumButton,
 *   PremiumTextField,
 * } from './components_modern/core/widgets';
 * ```
 */

// Premium Containers
export { GlassmorphicContainer } from './GlassmorphicContainer';
export type { GlassmorphicContainerProps } from './GlassmorphicContainer';

export { GradientCard } from './GradientCard';
export type { GradientCardProps } from './GradientCard';

export { GlowContainer } from './GlowContainer';
export type { GlowContainerProps } from './GlowContainer';

export { NeumorphicContainer } from './NeumorphicContainer';
export type { NeumorphicContainerProps } from './NeumorphicContainer';

export { PulseBorderContainer } from './PulseBorderContainer';
export type { PulseBorderContainerProps } from './PulseBorderContainer';

export { StyledContainer } from './StyledContainer';
export type { StyledContainerProps } from './StyledContainer';

// Premium Form Elements
export { PremiumButton } from './PremiumButton';
export type { PremiumButtonProps, PremiumButtonVariant, PremiumButtonSize } from './PremiumButton';

export { PremiumTextField } from './PremiumTextField';
export type { PremiumTextFieldProps, PremiumTextFieldVariant } from './PremiumTextField';

// Interactive Elements
export { AnimatedIconButton } from './AnimatedIconButton';
export type { AnimatedIconButtonProps } from './AnimatedIconButton';

// Loading & Feedback
export { ShimmerLoading, ShimmerCard, ShimmerText, ShimmerAvatar } from './ShimmerLoading';
export type { ShimmerLoadingProps, ShimmerCardProps, ShimmerTextProps, ShimmerAvatarProps } from './ShimmerLoading';

// Animated Backgrounds
export { AnimatedGradientBackground } from './AnimatedGradientBackground';
export type { AnimatedGradientBackgroundProps, GradientAnimationType } from './AnimatedGradientBackground';

// Layout Components
export { SidebarPanel } from './SidebarPanel';
export type { SidebarPanelProps } from './SidebarPanel';

// Tooltip
export { ModernTooltip } from './ModernTooltip';
export type { ModernTooltipOptions, ModernTooltipType } from './ModernTooltip';
