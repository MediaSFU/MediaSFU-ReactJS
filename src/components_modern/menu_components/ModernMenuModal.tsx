/**
 * Modern Menu Modal with glassmorphic design.
 *
 * A premium-styled menu modal with meeting info display, share buttons,
 * and custom action buttons with glassmorphic effects and smooth animations.
 * Uses the same MenuModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernMenuModal
 *   isVisible={showMenu}
 *   onClose={() => setShowMenu(false)}
 *   roomName="room-123"
 *   adminPasscode="1234"
 *   islevel="2"
 *   eventType="conference"
 * />
 * ```
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTimes,
  faCopy,
  faCheck,
  faLink,
  faEnvelope,
  faEye,
  faEyeSlash,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faTwitter,
  faWhatsapp,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons';
import { MenuModalOptions, MenuModalType } from '../../components/menuComponents/MenuModal';
import { ShareButton } from '../../components/menuComponents/ShareButtonsComponent';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';
import { ModernTooltip } from '../core/widgets/ModernTooltip';

export interface ModernMenuModalProps extends MenuModalOptions {
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
}

export type ModernMenuModalType = MenuModalType;

/**
 * ModernMenuModal displays meeting info and actions with premium styling.
 * Supports modal, sidebar, and inline render modes.
 */
export const ModernMenuModal: React.FC<ModernMenuModalProps> = ({
  isVisible,
  onClose,
  customButtons = [],
  shareButtons = true,
  position = 'topRight',
  roomName,
  adminPasscode,
  islevel,
  localLink,
  eventType,
  shareButtonsComponentProps,
  title,
  // Theme props from MenuModalOptions
  isDarkMode = true,
  onToggleTheme,
  renderMode = 'modal',
  // Modern-specific props
  enableGlassmorphism = true,
  enableGlow = true,
  // Render props
  renderHeader,
  renderCustomButtons,
  renderMeetingPasscode,
  renderMeetingId,
  renderShareButtons,
  renderBody,
  renderContent,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPasscode, setCopiedPasscode] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  // Mount animation
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isVisible]);

  // Check if user is host
  const isHost = useMemo(() => islevel === '2', [islevel]);

  // Compute share URL based on legacy logic (eventType/localLink aware)
  const shareUrl = useMemo(() => {
    const getShareUrl = shareButtonsComponentProps?.getShareUrl;
    if (getShareUrl) {
      return getShareUrl({ meetingID: roomName, eventType, localLink });
    }

    const shareName =
      eventType === 'chat' ? 'chat' : eventType === 'broadcast' ? 'broadcast' : 'meeting';

    if (localLink && !localLink.includes('mediasfu.com')) {
      return `${localLink}/meeting/${roomName}`;
    }

    return `https://${shareName}.mediasfu.com/${shareName}/${roomName}`;
  }, [eventType, localLink, roomName, shareButtonsComponentProps?.getShareUrl]);

  // Copy handlers
  const handleCopyId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomName);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [roomName]);

  const handleCopyPasscode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(adminPasscode);
      setCopiedPasscode(true);
      setTimeout(() => setCopiedPasscode(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [adminPasscode]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }, [shareUrl]);

  // Share handlers
  const shareButtonsList: ShareButton[] = useMemo(() => {
    const customButtons = shareButtonsComponentProps?.shareButtons;
    if (customButtons && customButtons.length > 0) {
      return customButtons.filter((btn) => btn.show !== false);
    }

    const defaultButtons: ShareButton[] = [
      {
        icon: faCopy,
        action: async () => {
          try {
            await navigator.clipboard.writeText(shareUrl);
          } catch (err) {
            console.error('Failed to copy link:', err);
          }
        },
        show: true,
        color: '#6b7280',
      },
      {
        icon: faEnvelope,
        action: () => {
          const emailUrl = `mailto:?subject=Join my meeting&body=Here is the link: ${shareUrl}`;
          window.open(emailUrl, '_blank');
        },
        show: true,
        color: '#ea4335',
      },
      {
        icon: faFacebook,
        action: () => {
          const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          window.open(url, '_blank', 'width=600,height=400');
        },
        show: true,
        color: '#1877F2',
      },
      {
        icon: faTwitter,
        action: () => {
          const text = encodeURIComponent(`Join my meeting: ${shareUrl}`);
          const url = `https://twitter.com/intent/tweet?text=${text}`;
          window.open(url, '_blank', 'width=600,height=400');
        },
        show: true,
        color: '#1DA1F2',
      },
      {
        icon: faWhatsapp,
        action: () => {
          const url = `https://wa.me/?text=${encodeURIComponent(`Join my meeting: ${shareUrl}`)}`;
          window.open(url, '_blank');
        },
        show: true,
        color: '#25D366',
      },
      {
        icon: faTelegram,
        action: () => {
          const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Join my meeting')}`;
          window.open(url, '_blank');
        },
        show: true,
        color: '#0088CC',
      },
      {
        icon: faLink,
        action: handleCopyLink,
        show: true,
        color: MediasfuColors.primary,
      },
    ];

    return defaultButtons;
  }, [shareButtonsComponentProps?.shareButtons, shareUrl, handleCopyLink]);

  const shareTooltips = useMemo(() => {
    const customButtons = shareButtonsComponentProps?.shareButtons;
    if (customButtons && customButtons.length > 0) {
      return shareButtonsList.map(() => 'Share');
    }
    return [
      'Copy meeting link',
      'Share via email',
      'Share on Facebook',
      'Share on Twitter',
      'Share on WhatsApp',
      'Share on Telegram',
      'Copy link',
    ];
  }, [shareButtonsComponentProps?.shareButtons, shareButtonsList]);

  const handleShare = useCallback(
    async (button: ShareButton) => {
      await Promise.resolve(button.action());
    },
    []
  );

  // Position styles
  const getPositionStyles = (): React.CSSProperties => {
    const positions: Record<string, React.CSSProperties> = {
      topRight: { top: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      topLeft: { top: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      bottomRight: { bottom: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      bottomLeft: { bottom: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      center: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    };
    return positions[position] || positions.topRight;
  };

  // Common styles used by both modal and sidebar modes
  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.xs}px`,
  };

  const sectionTitleStyle: React.CSSProperties = {
    ...MediasfuTypography.getLabelMedium(isDarkMode),
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    marginBottom: MediasfuSpacing.xs,
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    borderRadius: MediasfuBorders.sm,
  };

  const infoValueStyle: React.CSSProperties = {
    ...MediasfuTypography.getBodyMedium(isDarkMode),
    fontFamily: 'monospace',
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
  };

  const copyButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: MediasfuSpacing.xs,
    borderRadius: MediasfuBorders.xs,
    color: MediasfuColors.primary,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  };

  const shareButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.sm}px`,
    flexWrap: 'wrap',
  };

  const socialButtonStyle = (color: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: MediasfuBorders.sm,
    background: `${color}20`,
    border: 'none',
    cursor: 'pointer',
    color: color,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  });

  const customButtonsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.sm}px`,
  };

  // Default meeting ID section
  const defaultMeetingId = (
    <div style={sectionStyle}>
      <span style={sectionTitleStyle}>Meeting ID</span>
      <div style={infoRowStyle}>
        <span style={infoValueStyle}>{roomName}</span>
        <ModernTooltip message="Copy ID" isDarkMode={isDarkMode} position="top">
          <button style={copyButtonStyle} onClick={handleCopyId}>
            <FontAwesomeIcon icon={copiedId ? faCheck : faCopy} />
          </button>
        </ModernTooltip>
      </div>
    </div>
  );

  // Default passcode section (host only)
  const defaultMeetingPasscode = isHost ? (
    <div style={sectionStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.xs }}>
        <span style={sectionTitleStyle}>Admin Passcode</span>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4, 
          fontSize: 10, 
          color: MediasfuColors.danger,
          background: `${MediasfuColors.danger}15`,
          padding: '2px 6px',
          borderRadius: 4,
          fontWeight: 'bold'
        }}>
          <FontAwesomeIcon icon={faShieldAlt} size="xs" />
          <span>Private</span>
        </div>
      </div>
      
      <div style={infoRowStyle}>
        <span style={infoValueStyle}>
          {showPasscode ? adminPasscode : '•'.repeat(adminPasscode.length || 8)}
        </span>
        <div style={{ display: 'flex', gap: MediasfuSpacing.xs }}>
          <ModernTooltip message={showPasscode ? "Hide" : "Show"} isDarkMode={isDarkMode} position="top">
            <button style={copyButtonStyle} onClick={() => setShowPasscode(!showPasscode)}>
              <FontAwesomeIcon icon={showPasscode ? faEyeSlash : faEye} />
            </button>
          </ModernTooltip>
          <ModernTooltip message="Copy Passcode" isDarkMode={isDarkMode} position="top">
            <button style={copyButtonStyle} onClick={handleCopyPasscode}>
              <FontAwesomeIcon icon={copiedPasscode ? faCheck : faCopy} />
            </button>
          </ModernTooltip>
        </div>
      </div>
      <div style={{ 
        fontSize: 11, 
        color: isDarkMode ? MediasfuColors.textSecondaryDark : MediasfuColors.textSecondary,
        marginTop: 4,
        fontStyle: 'italic'
      }}>
        Others with this passcode can join as host with full privileges.
      </div>
    </div>
  ) : null;

  // Default share buttons
  const defaultShareButtons = shareButtons ? (
    <div style={sectionStyle}>
      <span style={sectionTitleStyle}>Share Meeting</span>
      <div style={shareButtonsStyle}>
        {shareButtonsList.map((button, index) => {
          const buttonColor = button.color || MediasfuColors.primary;
          const iconColor = button.iconColor || 'currentColor';
          const tooltipMessage = button.tooltip || shareTooltips[index] || 'Share';
          return (
            <ModernTooltip
              key={index}
              message={tooltipMessage}
              isDarkMode={isDarkMode}
              position="top"
            >
              <button
                style={socialButtonStyle(buttonColor)}
                onClick={() => handleShare(button)}
              >
                <FontAwesomeIcon icon={button.icon} size="lg" color={iconColor} />
              </button>
            </ModernTooltip>
          );
        })}
      </div>
    </div>
  ) : null;

  // Filter buttons by show property (like original CustomButtons component)
  const visibleButtons = customButtons.filter((button) => button.show !== false);

  // Default custom buttons
  const defaultCustomButtons = visibleButtons.length > 0 ? (
    <div style={sectionStyle}>
      <span style={sectionTitleStyle}>Actions</span>
      <div style={customButtonsStyle}>
        {visibleButtons.map((button, index) => {
          // Handle custom component buttons (like record controls)
          if (button.customComponent && button.renderAsButton === false) {
            return <React.Fragment key={index}>{button.customComponent}</React.Fragment>;
          }
          
          const buttonElement = (
            <PremiumButton
              key={index}
              variant="glass"
              size="md"
              fullWidth
              onPress={button.action}
              isDarkMode={isDarkMode}
              icon={button.icon ? <FontAwesomeIcon icon={button.icon} /> : undefined}
            >
              {button.text}
            </PremiumButton>
          );

          // Wrap with ModernTooltip for styled tooltip (use tooltip if provided, otherwise use text)
          const tooltipMessage = button.tooltip || button.text;
          return tooltipMessage ? (
            <ModernTooltip
              key={index}
              message={tooltipMessage}
              isDarkMode={isDarkMode}
              position="top"
            >
              {buttonElement}
            </ModernTooltip>
          ) : (
            buttonElement
          );
        })}
      </div>
    </div>
  ) : null;

  // Theme toggle section
  const themeToggleSection = onToggleTheme ? (
    <div style={sectionStyle}>
      <span style={sectionTitleStyle}>Theme</span>
      <div style={{ display: 'flex', gap: `${MediasfuSpacing.sm}px` }}>
        <PremiumButton
          variant={isDarkMode ? 'filled' : 'outlined'}
          size="sm"
          onPress={() => onToggleTheme(true)}
          isDarkMode={isDarkMode}
        >
          Dark
        </PremiumButton>
        <PremiumButton
          variant={!isDarkMode ? 'filled' : 'outlined'}
          size="sm"
          onPress={() => onToggleTheme(false)}
          isDarkMode={isDarkMode}
        >
          Light
        </PremiumButton>
      </div>
    </div>
  ) : null;

  // Sidebar body style (full height, scrollable)
  const sidebarBodyStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.md}px`,
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.md}px`,
  };

  // Sidebar header style
  const sidebarHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
    padding: `${MediasfuSpacing.md}px`,
    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    ...MediasfuTypography.getTitleMedium(isDarkMode),
  };

  // For sidebar or inline mode, render content directly without modal wrapper
  if (renderMode === 'sidebar' || renderMode === 'inline') {
    const sidebarContent = (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Sidebar header */}
        <div style={sidebarHeaderStyle}>
          <FontAwesomeIcon icon={faBars} />
          <span style={{ flex: 1 }}>{title || 'Menu'}</span>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isDarkMode 
                ? 'rgba(255,255,255,0.1)' 
                : 'rgba(0,0,0,0.08)',
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 300,
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode 
                ? 'rgba(255,255,255,0.15)' 
                : 'rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode 
                ? 'rgba(255,255,255,0.1)' 
                : 'rgba(0,0,0,0.08)';
            }}
          >
            ×
          </button>
        </div>
        <div style={sidebarBodyStyle}>
          {themeToggleSection}
          {renderCustomButtons
            ? renderCustomButtons({ defaultCustomButtons, buttons: customButtons })
            : defaultCustomButtons}
          {renderMeetingId
            ? renderMeetingId({ defaultMeetingId, roomName })
            : defaultMeetingId}
          {renderMeetingPasscode
            ? renderMeetingPasscode({ defaultMeetingPasscode, adminPasscode, isHost })
            : defaultMeetingPasscode}
          {renderShareButtons
            ? renderShareButtons({ defaultShareButtons, hasShareButtons: shareButtons })
            : defaultShareButtons}
        </div>
      </div>
    );

    return sidebarContent;
  }

  // Modal mode - return null if not visible
  if (!isVisible) return null;

  // Styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: MediasfuColors.alertBackdrop(isDarkMode),
    backdropFilter: enableGlassmorphism ? 'blur(2px)' : undefined,
    WebkitBackdropFilter: enableGlassmorphism ? 'blur(2px)' : undefined,
    opacity: isMounted ? 1 : 0,
    transition: `opacity ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    ...getPositionStyles(),
    width: 'min(400px, calc(100vw - 32px))',
    maxHeight: 'calc(100vh - 100px)',
    opacity: isMounted ? 1 : 0,
    transform: isMounted
      ? position === 'center'
        ? 'translate(-50%, -50%) scale(1)'
        : 'scale(1) translateY(0)'
      : position === 'center'
        ? 'translate(-50%, -50%) scale(0.95)'
        : 'scale(0.95) translateY(-10px)',
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.snappy}`,
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.md}px`,
    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  const titleStyle: React.CSSProperties = {
    ...MediasfuTypography.getTitleMedium(isDarkMode),
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
    margin: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: MediasfuSpacing.xs,
    borderRadius: MediasfuBorders.sm,
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  };

  const bodyStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.md}px`,
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.md}px`,
  };

  // Default header
  const defaultHeader = (
    <div style={headerStyle}>
      <h2 style={titleStyle}>
        <FontAwesomeIcon icon={faBars} />
        {title || 'Menu'}
      </h2>
      <button style={closeButtonStyle} onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
    </div>
  );

  // Default body content
  const defaultBody = (
    <div style={bodyStyle}>
      {themeToggleSection}
      {renderCustomButtons
        ? renderCustomButtons({ defaultCustomButtons, buttons: customButtons })
        : defaultCustomButtons}
      {renderMeetingId
        ? renderMeetingId({ defaultMeetingId, roomName })
        : defaultMeetingId}
      {renderMeetingPasscode
        ? renderMeetingPasscode({ defaultMeetingPasscode, adminPasscode, isHost })
        : defaultMeetingPasscode}
      {renderShareButtons
        ? renderShareButtons({ defaultShareButtons, hasShareButtons: shareButtons })
        : defaultShareButtons}
    </div>
  );

  // Default content
  const defaultContent = (
    <GlassmorphicContainer
      isDarkMode={isDarkMode}
      borderRadius={MediasfuBorders.xl}
      blur={enableGlassmorphism ? 20 : 0}
      padding={0}
      elevation={4}
      style={{
        ...modalStyle,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
        boxShadow: enableGlow
          ? `${MediasfuColors.elevation(4, isDarkMode)}, ${MediasfuColors.glowPrimary}`
          : MediasfuColors.elevation(4, isDarkMode),
      }}
    >
      {renderHeader ? renderHeader({ defaultHeader, onClose }) : defaultHeader}
      {renderBody ? renderBody({ defaultBody }) : defaultBody}
    </GlassmorphicContainer>
  );

  return (
    <>
      {/* Backdrop */}
      <div style={overlayStyle} onClick={onClose} />
      {/* Modal */}
      {renderContent ? renderContent({ defaultContent }) : defaultContent}
    </>
  );
};

export default ModernMenuModal;
