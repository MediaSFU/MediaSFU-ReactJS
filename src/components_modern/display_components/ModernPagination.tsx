/**
 * Modern pagination with glassmorphic styling and smooth animations.
 *
 * A premium-styled pagination component with smart navigation,
 * breakout room support, and glassmorphic visual effects.
 * Uses the same PaginationOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernPagination
 *   totalPages={10}
 *   currentUserPage={0}
 *   parameters={parameters}
 * />
 * ```
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faStar,
  faLock,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { PaginationOptions } from '../../components/displayComponents/Pagination';
import { generatePageContent } from '../../consumers/generatePageContent';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';

export interface ModernPaginationOptions extends PaginationOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Maximum visible page buttons */
  maxVisiblePages?: number;
  /** Button size */
  buttonSize?: number;
}

export type ModernPaginationType = (options: ModernPaginationOptions) => React.JSX.Element;

/**
 * ModernPagination provides page navigation with premium styling.
 */
export const ModernPagination: React.FC<ModernPaginationOptions> = ({
  totalPages,
  currentUserPage,
  handlePageChange = generatePageContent,
  position = 'middle',
  // location - reserved for future vertical positioning
  direction = 'horizontal',
  buttonsContainerStyle,
  activePageStyle,
  inactivePageStyle,
  backgroundColor,
  paginationHeight = 40,
  showAspect = true,
  parameters,
  containerProps,
  pageButtonProps,
  renderContainer,
  renderPageButton,
  renderPageContent,
  // Modern-specific props
  isDarkMode,
  enableGlassmorphism = true,
  enableGlow = true,
  maxVisiblePages = 5,
  buttonSize = 36,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [windowStart, setWindowStart] = useState(1);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get updated parameters
  const params = useMemo(() => {
    return parameters.getUpdatedAllParams();
  }, [parameters]);

  // Resolve dark mode - prefer explicit prop, fallback to parameters, then default to true
  const resolvedIsDarkMode = isDarkMode ?? params.isDarkModeValue ?? true;

  // Check if breakout rooms are active
  const isBreakout = params.breakOutRoomStarted && !params.breakOutRoomEnded;

  // Adjust window when breakout starts
  useEffect(() => {
    if (isBreakout) {
      const userRoom = params.memberRoom + params.mainRoomsLength;
      const halfWindow = Math.floor(maxVisiblePages / 2);
      const newStart = Math.max(1, Math.min(userRoom - halfWindow, totalPages - maxVisiblePages + 1));
      setWindowStart(newStart);
    }
  }, [isBreakout, params.memberRoom, params.mainRoomsLength, totalPages, maxVisiblePages]);

  // Page change handler
  const onPageChange = useCallback(async (page: number) => {
    const updatedParams = parameters.getUpdatedAllParams();
    await handlePageChange({
      page,
      parameters: updatedParams,
      breakRoom: page >= updatedParams.mainRoomsLength ? page - updatedParams.mainRoomsLength : -1,
      inBreakRoom: page >= updatedParams.mainRoomsLength,
    });
  }, [parameters, handlePageChange]);

  // Navigation helpers
  const canGoBack = windowStart > 1;
  const canGoForward = windowStart + maxVisiblePages <= totalPages;
  const needsArrows = totalPages > maxVisiblePages + 1;

  const shiftWindowBack = useCallback(() => {
    setWindowStart((prev) => Math.max(1, prev - 3));
  }, []);

  const shiftWindowForward = useCallback(() => {
    setWindowStart((prev) => Math.min(totalPages - maxVisiblePages + 1, prev + 3));
  }, [totalPages, maxVisiblePages]);

  // Get visible pages
  const visiblePages = useMemo(() => {
    const pages: number[] = [0]; // Always include home (0)
    
    if (totalPages <= maxVisiblePages + 1) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show windowed pages
      const windowEnd = Math.min(windowStart + maxVisiblePages - 1, totalPages);
      for (let i = windowStart; i <= windowEnd; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }, [totalPages, windowStart, maxVisiblePages]);

  // Get page label
  const getPageLabel = useCallback((page: number): React.ReactNode => {
    if (page === 0) {
      return <FontAwesomeIcon icon={faHome} size="sm" />;
    }

    if (isBreakout && page >= params.mainRoomsLength) {
      const roomIndex = page - params.mainRoomsLength;
      const isUserRoom = roomIndex === params.memberRoom;
      const isHostRoom = roomIndex === params.hostNewRoom;

      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FontAwesomeIcon icon={faUsers} size="xs" />
          <span>{roomIndex + 1}</span>
          {isUserRoom && <FontAwesomeIcon icon={faStar} size="xs" />}
          {isHostRoom && <FontAwesomeIcon icon={faLock} size="xs" />}
        </span>
      );
    }

    return <span>{page}</span>;
  }, [isBreakout, params.mainRoomsLength, params.memberRoom, params.hostNewRoom]);

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center',
    gap: `${MediasfuSpacing.xs}px`,
    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
    height: paginationHeight,
    background: backgroundColor || (enableGlassmorphism
      ? MediasfuColors.glassBackground(resolvedIsDarkMode)
      : resolvedIsDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)'),
    backdropFilter: enableGlassmorphism ? 'blur(12px)' : 'none',
    WebkitBackdropFilter: enableGlassmorphism ? 'blur(12px)' : 'none',
    borderRadius: `${MediasfuBorders.md}px`,
    border: enableGlassmorphism
      ? `1px solid ${MediasfuColors.glassBorder(resolvedIsDarkMode)}`
      : 'none',
    boxShadow: MediasfuColors.elevation(2, resolvedIsDarkMode),
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? 'translateY(0)' : 'translateY(10px)',
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    ...buttonsContainerStyle,
  };

  // Arrow button styles
  const arrowButtonStyle = (disabled: boolean): React.CSSProperties => ({
    width: buttonSize,
    height: buttonSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: `${MediasfuBorders.sm}px`,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: 'transparent',
    color: disabled
      ? (resolvedIsDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(15, 23, 42, 0.3)')
      : (resolvedIsDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)'),
    opacity: disabled ? 0.5 : 1,
    transition: `all ${MediasfuAnimations.fast}ms`,
  });

  // Page button styles
  const getPageButtonStyle = (_page: number, isActive: boolean, isHovered: boolean): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      minWidth: buttonSize,
      height: buttonSize,
      padding: `0 ${MediasfuSpacing.xs}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: `${MediasfuBorders.sm}px`,
      border: 'none',
      cursor: 'pointer',
      ...MediasfuTypography.toStyle(MediasfuTypography.labelSmall),
      fontWeight: isActive ? 700 : 500,
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    };

    if (isActive) {
      return {
        ...baseStyle,
        background: enableGlow
          ? MediasfuColors.brandGradient(resolvedIsDarkMode)
          : MediasfuColors.primary,
        color: '#FFFFFF',
        boxShadow: enableGlow ? MediasfuColors.glowPrimary : 'none',
        transform: 'scale(1.05)',
        ...activePageStyle,
      };
    }

    return {
      ...baseStyle,
      background: isHovered
        ? (resolvedIsDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)')
        : (resolvedIsDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.05)'),
      color: resolvedIsDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      ...inactivePageStyle,
    };
  };

  if (!showAspect || totalPages < 1) {
    return <></>;
  }

  // Build page buttons
  const pageButtons = visiblePages.map((page) => {
    const isActive = page === currentUserPage;
    const isHomePage = page === 0;
    const isHovered = hoverIndex === page;
    const label = getPageLabel(page);

    const defaultButton = (
      <button
        key={page}
        style={getPageButtonStyle(page, isActive, isHovered)}
        onClick={() => onPageChange(page)}
        onMouseEnter={() => setHoverIndex(page)}
        onMouseLeave={() => setHoverIndex(null)}
        {...(pageButtonProps?.({ page, isActive, isHomePage }) || {})}
      >
        {renderPageContent
          ? renderPageContent({ defaultContent: label, page, isActive, isHomePage, label })
          : label}
      </button>
    );

    if (renderPageButton) {
      return renderPageButton({
        defaultButton,
        page,
        isActive,
        isHomePage,
        onSelect: () => onPageChange(page),
        label,
      });
    }

    return defaultButton;
  });

  const defaultContainer = (
    <div style={containerStyle} {...containerProps}>
      {/* Back Arrow */}
      {needsArrows && (
        <button
          style={arrowButtonStyle(!canGoBack)}
          onClick={shiftWindowBack}
          disabled={!canGoBack}
          aria-label="Previous pages"
        >
          <FontAwesomeIcon
            icon={direction === 'vertical' ? faChevronUp : faChevronLeft}
            size="sm"
          />
        </button>
      )}

      {/* Page Buttons */}
      {pageButtons}

      {/* Forward Arrow */}
      {needsArrows && (
        <button
          style={arrowButtonStyle(!canGoForward)}
          onClick={shiftWindowForward}
          disabled={!canGoForward}
          aria-label="Next pages"
        >
          <FontAwesomeIcon
            icon={direction === 'vertical' ? faChevronDown : faChevronRight}
            size="sm"
          />
        </button>
      )}
    </div>
  );

  if (renderContainer) {
    return <>{renderContainer({ defaultContainer, pages: visiblePages })}</>;
  }

  return defaultContainer;
};

export default ModernPagination;
