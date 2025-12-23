/**
 * Flexible button supporting filled, outlined, ghost, gradient, glass,
 * glow, and neumorphic variants in xs / sm / md / lg / xl sizes.
 *
 * A premium button component that provides multiple visual variants,
 * size options, loading states, and icon support with smooth animations.
 *
 * @example
 * ```tsx
 * <PremiumButton 
 *   variant="gradient" 
 *   size="md"
 *   onPress={() => console.log('Clicked!')}
 *   isDarkMode={true}
 * >
 *   Get Started
 * </PremiumButton>
 * ```
 */

import React, { useState, useCallback, useEffect } from 'react';
import { MediasfuColors } from '../theme/MediasfuColors';
import { MediasfuSpacing } from '../theme/MediasfuSpacing';
import { MediasfuTypography } from '../theme/MediasfuTypography';
import { MediasfuAnimations } from '../theme/MediasfuAnimations';
import { injectModernAnimations } from '../../utils/injectAnimations';

/** Button variant styles */
export type PremiumButtonVariant = 
  | 'filled'
  | 'outlined'
  | 'ghost'
  | 'gradient'
  | 'glass'
  | 'glow'
  | 'neumorphic';

/** Button size options */
export type PremiumButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface PremiumButtonProps {
  /** Button label/children */
  children: React.ReactNode;
  /** Click handler */
  onPress?: () => void;
  /** Button variant */
  variant?: PremiumButtonVariant;
  /** Button size */
  size?: PremiumButtonSize;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is loading */
  loading?: boolean;
  /** Icon to display before text */
  icon?: React.ReactNode;
  /** Icon to display after text */
  suffixIcon?: React.ReactNode;
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Custom background color (for filled variant) */
  backgroundColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Custom border color (for outlined variant) */
  borderColor?: string;
  /** Custom gradient (for gradient variant) */
  gradient?: string;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Full width button */
  fullWidth?: boolean;
  /** Border radius override */
  borderRadius?: number;
  /** Animation on mount */
  animateOnMount?: boolean;
  /** Button type for form submission */
  type?: 'button' | 'submit' | 'reset';
  /** Aria label for accessibility */
  ariaLabel?: string;
  /** Tooltip text to display on hover */
  tooltip?: string;
}

// Size configuration
const SIZE_CONFIG: Record<PremiumButtonSize, {
  height: number;
  fontSize: number;
  iconSize: number;
  paddingHorizontal: number;
  borderRadius: number;
}> = {
  xs: {
    height: 28,
    fontSize: 12,
    iconSize: 14,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  sm: {
    height: 32,
    fontSize: 13,
    iconSize: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  md: {
    height: 40,
    fontSize: 14,
    iconSize: 18,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  lg: {
    height: 48,
    fontSize: 15,
    iconSize: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  xl: {
    height: 56,
    fontSize: 16,
    iconSize: 22,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
};

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  onPress,
  variant = 'filled',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  suffixIcon,
  isDarkMode = true,
  backgroundColor,
  textColor,
  borderColor,
  gradient,
  className,
  style,
  fullWidth = false,
  borderRadius,
  animateOnMount = false,
  type = 'button',
  ariaLabel,
  tooltip,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(!animateOnMount);

  // Inject animations on mount
  useEffect(() => {
    injectModernAnimations();
    if (animateOnMount) {
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    }
  }, [animateOnMount]);

  const config = SIZE_CONFIG[size];
  const isDisabled = disabled || loading;

  // Get variant-specific styles
  const getVariantStyles = (): React.CSSProperties => {
    const baseColor = backgroundColor || MediasfuColors.primary;
    const baseTextColor = textColor;
    const baseBorderColor = borderColor || MediasfuColors.primary;

    switch (variant) {
      case 'filled':
        return {
          background: baseColor,
          color: baseTextColor || '#FFFFFF',
          border: 'none',
          boxShadow: isPressed
            ? 'none'
            : isHovered
              ? MediasfuColors.elevation(2, isDarkMode)
              : MediasfuColors.elevation(1, isDarkMode),
        };

      case 'outlined':
        return {
          background: 'transparent',
          color: baseTextColor || baseBorderColor,
          border: `2px solid ${baseBorderColor}`,
          boxShadow: 'none',
        };

      case 'ghost':
        return {
          background: isHovered
            ? MediasfuColors.hexToRgba(baseColor, 0.1)
            : 'transparent',
          color: baseTextColor || baseColor,
          border: 'none',
          boxShadow: 'none',
        };

      case 'gradient':
        return {
          background: gradient || MediasfuColors.brandGradient(isDarkMode),
          color: baseTextColor || '#FFFFFF',
          border: 'none',
          boxShadow: isPressed
            ? 'none'
            : isHovered
              ? MediasfuColors.elevation(3, isDarkMode)
              : MediasfuColors.elevation(2, isDarkMode),
        };

      case 'glass':
        return {
          background: MediasfuColors.glassBackground(isDarkMode),
          color: baseTextColor || (isDarkMode ? '#FFFFFF' : '#1F2937'),
          border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: isHovered
            ? MediasfuColors.elevation(2, isDarkMode)
            : MediasfuColors.elevation(1, isDarkMode),
        };

      case 'glow':
        return {
          background: gradient || MediasfuColors.brandGradient(isDarkMode),
          color: baseTextColor || '#FFFFFF',
          border: 'none',
          boxShadow: isHovered
            ? `${MediasfuColors.glowPrimary}, ${MediasfuColors.elevation(2, isDarkMode)}`
            : MediasfuColors.glowPrimary,
        };

      case 'neumorphic': {
        const bgColor = isDarkMode ? '#1E1E2E' : '#E0E5EC';
        const lightShadow = isDarkMode
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(255, 255, 255, 0.8)';
        const darkShadow = isDarkMode
          ? 'rgba(0, 0, 0, 0.5)'
          : 'rgba(163, 177, 198, 0.6)';
        
        return {
          background: bgColor,
          color: baseTextColor || (isDarkMode ? '#FFFFFF' : '#374151'),
          border: 'none',
          boxShadow: isPressed
            ? `inset 3px 3px 6px ${darkShadow}, inset -3px -3px 6px ${lightShadow}`
            : `5px 5px 10px ${darkShadow}, -5px -5px 10px ${lightShadow}`,
        };
      }

      default:
        return {};
    }
  };

  // Base button styles
  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${MediasfuSpacing.xs}px`,
    height: `${config.height}px`,
    padding: `0 ${config.paddingHorizontal}px`,
    borderRadius: `${borderRadius ?? config.borderRadius}px`,
    fontSize: `${config.fontSize}px`,
    fontWeight: 600,
    fontFamily: MediasfuTypography.fontFamily,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : isMounted ? 1 : 0,
    transform: isMounted
      ? isPressed
        ? 'scale(0.97)'
        : isHovered
          ? 'translateY(-1px)'
          : 'scale(1)'
      : 'scale(0.95)',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    outline: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : 'auto',
    ...getVariantStyles(),
    ...style,
  };

  // Loading spinner styles
  const spinnerStyle: React.CSSProperties = {
    width: `${config.iconSize}px`,
    height: `${config.iconSize}px`,
    border: '2px solid transparent',
    borderTopColor: 'currentColor',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  const handleMouseDown = useCallback(() => {
    if (!isDisabled) setIsPressed(true);
  }, [isDisabled]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!isDisabled) setIsHovered(true);
  }, [isDisabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!isDisabled && onPress) {
      onPress();
    }
  }, [isDisabled, onPress]);

  // Icon wrapper styles
  const iconWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${config.iconSize}px`,
    height: `${config.iconSize}px`,
  };

  return (
    <button
      type={type}
      className={className}
      style={buttonStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={isDisabled}
      title={tooltip}
    >
      {loading ? (
        <span style={spinnerStyle} />
      ) : (
        <>
          {icon && <span style={iconWrapperStyle}>{icon}</span>}
          {children}
          {suffixIcon && <span style={iconWrapperStyle}>{suffixIcon}</span>}
        </>
      )}
    </button>
  );
};

// Add keyframe for spinner
if (typeof document !== 'undefined') {
  const styleId = 'mediasfu-premium-button-styles';
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleEl);
  }
}

export default PremiumButton;
