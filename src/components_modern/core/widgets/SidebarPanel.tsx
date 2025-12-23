/**
 * SidebarPanel - Desktop sidebar panel component
 *
 * A glassmorphic sidebar panel that renders on the right side of the screen
 * for desktop layouts. Displays various modal content inline without overlay.
 *
 * @module SidebarPanel
 */

import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { SidebarContent } from '../types/ModalRenderMode';
import { MediasfuColors } from '../theme/MediasfuColors';
import { MediasfuSpacing } from '../theme/MediasfuSpacing';
import { MediasfuTypography } from '../theme/MediasfuTypography';
import { MediasfuAnimations } from '../theme/MediasfuAnimations';
import { MediasfuBorders } from '../theme/MediasfuBorders';

export interface SidebarPanelProps {
  /** Active sidebar content type */
  activeSidebarContent: SidebarContent;
  /** Whether sidebar can navigate back */
  canNavigateBack: boolean;
  /** Handler for back navigation */
  onNavigateBack: () => void;
  /** Handler for closing sidebar */
  onClose: () => void;
  /** Width of the sidebar in pixels */
  width: number;
  /** Dark mode toggle */
  isDarkMode?: boolean;
  /** Children content to render */
  children: React.ReactNode;
}

/**
 * Get the title for sidebar content
 */
const getSidebarTitle = (content: SidebarContent): string => {
  const titles: Record<SidebarContent, string> = {
    none: '',
    menu: 'Menu',
    participants: 'Participants',
    messages: 'Messages',
    requests: 'Requests',
    waiting: 'Waiting Room',
    coHost: 'Co-Host Settings',
    mediaSettings: 'Media Settings',
    displaySettings: 'Display Settings',
    eventSettings: 'Event Settings',
    recording: 'Recording',
    polls: 'Polls',
    breakoutRooms: 'Breakout Rooms',
    shareEvent: 'Share Event',
    configureWhiteboard: 'Whiteboard',
    background: 'Background',
  };
  return titles[content] || '';
};

export const SidebarPanel: React.FC<SidebarPanelProps> = ({
  activeSidebarContent,
  canNavigateBack,
  onNavigateBack,
  onClose,
  width,
  isDarkMode = true,
  children,
}) => {
  // Hide if no content
  if (activeSidebarContent === 'none' || width === 0) {
    return null;
  }

  const title = getSidebarTitle(activeSidebarContent);

  // Styles
  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'fixed' as const,
      top: 0,
      right: 0,
      width: `${width}px`,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: isDarkMode
        ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)'
        : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderLeft: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
      boxShadow: isDarkMode
        ? '-8px 0 32px rgba(0, 0, 0, 0.4)'
        : '-8px 0 32px rgba(0, 0, 0, 0.1)',
      zIndex: 100,
      animation: `slideInRight ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    }),
    [width, isDarkMode]
  );

  const headerStyle: React.CSSProperties = useMemo(
    () => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${MediasfuSpacing.md}px ${MediasfuSpacing.lg}px`,
      borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
      minHeight: 56,
      flexShrink: 0,
    }),
    [isDarkMode]
  );

  const headerLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: MediasfuSpacing.sm,
  };

  const titleStyle: React.CSSProperties = useMemo(
    () => ({
      ...MediasfuTypography.getTitleMedium(isDarkMode),
      margin: 0,
    }),
    [isDarkMode]
  );

  const iconButtonStyle: React.CSSProperties = useMemo(
    () => ({
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      border: 'none',
      borderRadius: MediasfuBorders.md,
      cursor: 'pointer',
      color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    }),
    [isDarkMode]
  );

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: MediasfuSpacing.md,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          {canNavigateBack && (
            <button
              style={iconButtonStyle}
              onClick={onNavigateBack}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)';
              }}
              aria-label="Go back"
            >
              <FontAwesomeIcon icon={faArrowLeft} size="sm" />
            </button>
          )}
          <h2 style={titleStyle}>{title}</h2>
        </div>
        <button
          style={iconButtonStyle}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkMode
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDarkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)';
          }}
          aria-label="Close sidebar"
        >
          <FontAwesomeIcon icon={faTimes} size="sm" />
        </button>
      </div>

      {/* Content */}
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

export default SidebarPanel;
