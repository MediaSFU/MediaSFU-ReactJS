/**
 * Modern Loading Modal Component
 *
 * A redesigned loading modal with glassmorphic styling, gradient spinner,
 * and premium animations. Uses the same LoadingModalOptions as the classic component.
 *
 * @example
 * ```tsx
 * <ModernLoadingModal
 *   isVisible={isLoading}
 *   displayColor="#6366F1"
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from 'react';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { injectModernAnimations } from '../utils/injectAnimations';

// Import classic LoadingModalOptions for compatibility
import { LoadingModalOptions } from '../../components/displayComponents/LoadingModal';

export interface ModernLoadingModalOptions {
  /** Whether the modal is visible */
  isVisible: boolean;
  /** Background color */
  backgroundColor?: string;
  /** Display/accent color */
  displayColor?: string;
  /** Custom loading text */
  loadingText?: string;
  /** Whether to show the spinner */
  showSpinner?: boolean;
  /** Custom spinner component */
  spinner?: React.ReactNode;
  /** Spacing between spinner and text */
  spinnerTextSpacing?: number;
  /** Content padding */
  contentPadding?: string | number;
}

// Props interface extends LoadingModalOptions for withOverride compatibility
// Pick required props and make others optional for flexibility
export interface ModernLoadingModalProps extends Omit<Partial<LoadingModalOptions>, 'isVisible'> {
  /** Whether the modal is visible (required for compatibility) */
  isVisible: boolean;
  /** Loading modal options (alternative to direct props) */
  options?: ModernLoadingModalOptions;
  /** Whether to use dark mode */
  isDarkMode?: boolean;
  /** Close handler for backdrop click */
  onClose?: () => void;
  /** Whether backdrop click closes modal */
  closeOnBackdropClick?: boolean;
}

export const ModernLoadingModal: React.FC<ModernLoadingModalProps> = ({
  options,
  // Direct props from LoadingModalOptions (for withOverride compatibility)
  isVisible: isVisibleProp,
  loadingText: loadingTextProp,
  showSpinner: showSpinnerProp,
  // Modern-specific props
  isDarkMode = true,
  onClose,
  closeOnBackdropClick = false,
}) => {
  // Merge options with individual props - supports both patterns
  const isVisible = options?.isVisible ?? isVisibleProp ?? false;
  const loadingText = options?.loadingText ?? loadingTextProp ?? 'Loading...';
  const showSpinner = options?.showSpinner ?? showSpinnerProp ?? true;
  const customSpinner = options?.spinner;
  const spinnerTextSpacing = options?.spinnerTextSpacing ?? MediasfuSpacing.md;

  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [pulseValue, setPulseValue] = useState(0);
  const [spinValue, setSpinValue] = useState(0);
  const pulseRef = useRef<number | null>(null);
  const spinRef = useRef<number | null>(null);

  // Inject animations on mount
  useEffect(() => {
    injectModernAnimations();
  }, []);

  // Handle visibility transitions
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), MediasfuAnimations.normal);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Pulse animation for spinner
  useEffect(() => {
    if (!isVisible || !showSpinner) return;

    let startTime: number | null = null;
    const duration = 1500;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      // Ease in out
      const eased = Math.sin(progress * Math.PI);
      setPulseValue(0.8 + eased * 0.2);
      pulseRef.current = requestAnimationFrame(animate);
    };

    pulseRef.current = requestAnimationFrame(animate);

    return () => {
      if (pulseRef.current) {
        cancelAnimationFrame(pulseRef.current);
      }
    };
  }, [isVisible, showSpinner]);

  // Spin animation
  useEffect(() => {
    if (!isVisible || !showSpinner) return;

    let startTime: number | null = null;
    const duration = 1000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rotation = (elapsed % duration) / duration * 360;
      setSpinValue(rotation);
      spinRef.current = requestAnimationFrame(animate);
    };

    spinRef.current = requestAnimationFrame(animate);

    return () => {
      if (spinRef.current) {
        cancelAnimationFrame(spinRef.current);
      }
    };
  }, [isVisible, showSpinner]);

  if (!shouldRender) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdropClick && onClose) {
      onClose();
    }
  };

  // Backdrop styles
  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    opacity: isAnimating ? 1 : 0,
    transition: `opacity ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    zIndex: 9999,
  };

  // Content wrapper styles
  const contentWrapperStyle: React.CSSProperties = {
    transform: isAnimating ? 'scale(1)' : 'scale(0.8)',
    opacity: isAnimating ? 1 : 0,
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.snappy}`,
  };

  // Spinner container styles
  const spinnerContainerStyle: React.CSSProperties = {
    width: 56,
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: MediasfuColors.brandGradient(isDarkMode),
    boxShadow: MediasfuColors.glowPrimary,
    transform: `scale(${pulseValue})`,
    transition: 'transform 50ms linear',
  };

  // Spinner styles (circular progress)
  const spinnerStyle: React.CSSProperties = {
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: '3px solid rgba(255, 255, 255, 0.2)',
    borderTopColor: '#FFFFFF',
    transform: `rotate(${spinValue}deg)`,
  };

  // Text styles with gradient
  const textStyle: React.CSSProperties = {
    ...MediasfuTypography.getTitleMedium(isDarkMode),
    background: MediasfuColors.brandGradient(isDarkMode),
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 600,
    letterSpacing: '0.5px',
  };

  // Glow wrapper styles
  const glowWrapperStyle: React.CSSProperties = {
    boxShadow: `0 0 30px ${MediasfuColors.hexToRgba(MediasfuColors.primary, 0.2)}`,
    borderRadius: 24,
  };

  return (
    <div style={backdropStyle} onClick={handleBackdropClick}>
      <div style={contentWrapperStyle} onClick={(e) => e.stopPropagation()}>
        <div style={glowWrapperStyle}>
          <GlassmorphicContainer
            borderRadius={24}
            blur={25}
            padding={MediasfuSpacing.xl}
            isDarkMode={isDarkMode}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: `${spinnerTextSpacing}px` }}>
              {showSpinner && (
                customSpinner || (
                  <div style={spinnerContainerStyle}>
                    <div style={spinnerStyle} />
                  </div>
                )
              )}
              <span style={textStyle}>{loadingText}</span>
            </div>
          </GlassmorphicContainer>
        </div>
      </div>
    </div>
  );
};

export default ModernLoadingModal;
