/**
 * ModernTooltip - Premium styled tooltip component.
 * 
 * Provides a styled tooltip with glassmorphic styling and theme support.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MediasfuColors } from '../theme/MediasfuColors';

export interface ModernTooltipOptions {
  /** Tooltip message */
  message: string;
  /** Dark mode toggle */
  isDarkMode?: boolean;
  /** Position of tooltip relative to child */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Child element to wrap */
  children: React.ReactNode;
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Additional styles for tooltip container */
  style?: React.CSSProperties;
  /** Use React Portal to render tooltip (prevents clipping) */
  usePortal?: boolean;
}

export type ModernTooltipType = React.FC<ModernTooltipOptions>;

/**
 * ModernTooltip component provides a styled tooltip wrapper.
 * 
 * @example
 * ```tsx
 * <ModernTooltip message="Click to edit" isDarkMode={true}>
 *   <button>Edit</button>
 * </ModernTooltip>
 * ```
 */
const ModernTooltipComponent: React.FC<ModernTooltipOptions> = ({
  message,
  isDarkMode = true,
  position = 'top',
  children,
  delay = 300,
  style,
  usePortal = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (containerRef.current && usePortal) {
      const rect = containerRef.current.getBoundingClientRect();
      
      // When using position: fixed, coordinates are relative to the viewport
      // so we don't need to add scroll offsets
      
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = rect.top - 8; // 8px margin
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - 8;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 8;
          break;
      }
      setCoords({ top, left });
    }
  }, [position, usePortal]);

  const showTooltip = useCallback(() => {
    updatePosition();
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  }, [delay, updatePosition]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  }, []);

  // Update position on scroll/resize if visible and using portal
  useEffect(() => {
    if (visible && usePortal) {
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [visible, usePortal, updatePosition]);

  // Get tooltip styles from theme
  const tooltipStyles = MediasfuColors.tooltipStyles(isDarkMode);

  // Position-based styles
  const positionStyles: React.CSSProperties = (() => {
    if (usePortal) {
      switch (position) {
        case 'top':
          return {
            top: coords.top,
            left: coords.left,
            transform: 'translate(-50%, -100%)',
          };
        case 'bottom':
          return {
            top: coords.top,
            left: coords.left,
            transform: 'translate(-50%, 0)',
          };
        case 'left':
          return {
            top: coords.top,
            left: coords.left,
            transform: 'translate(-100%, -50%)',
          };
        case 'right':
          return {
            top: coords.top,
            left: coords.left,
            transform: 'translate(0, -50%)',
          };
        default:
          return {};
      }
    }

    switch (position) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
        };
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
        };
      case 'left':
        return {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '8px',
        };
      case 'right':
        return {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '8px',
        };
      default:
        return {};
    }
  })();

  // Arrow styles based on position
  const arrowStyles: React.CSSProperties = (() => {
    const arrowBase: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
    };
    const arrowColor = isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(248, 250, 252, 0.95)';

    switch (position) {
      case 'top':
        return {
          ...arrowBase,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `6px solid ${arrowColor}`,
        };
      case 'bottom':
        return {
          ...arrowBase,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: `6px solid ${arrowColor}`,
        };
      case 'left':
        return {
          ...arrowBase,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderLeft: `6px solid ${arrowColor}`,
        };
      case 'right':
        return {
          ...arrowBase,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderRight: `6px solid ${arrowColor}`,
        };
      default:
        return arrowBase;
    }
  })();

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    ...style,
  };

  const tooltipContainerStyle: React.CSSProperties = {
    position: usePortal ? 'fixed' : 'absolute',
    ...positionStyles,
    ...tooltipStyles,
    whiteSpace: 'normal',
    maxWidth: '280px',
    textAlign: 'center',
    zIndex: 99999,
    pointerEvents: 'none',
    opacity: visible ? 1 : 0,
    transition: 'opacity 200ms ease-in-out',
    boxShadow: `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 12px ${isDarkMode ? 'rgba(79, 172, 254, 0.15)' : 'rgba(102, 126, 234, 0.15)'}`,
  };

  if (!message) {
    return <>{children}</>;
  }

  const tooltipContent = (
    <div style={tooltipContainerStyle}>
      {message}
      <div style={arrowStyles} />
    </div>
  );

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {usePortal ? createPortal(tooltipContent, document.body) : tooltipContent}
    </div>
  );
};

export const ModernTooltip = React.memo(ModernTooltipComponent);
export default ModernTooltip;
