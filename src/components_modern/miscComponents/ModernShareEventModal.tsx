import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faShareAlt,
  faCopy,
  faEnvelope,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faTwitter,
  faWhatsapp,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons';
import { ShareEventModalOptions } from '../../components/miscComponents/ShareEventModal';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import MeetingIdComponent from '../../components/menuComponents/MeetingIDComponent';
import MeetingPasscodeComponent from '../../components/menuComponents/MeetingPasscodeComponent';
import { ShareButton } from '../../components/menuComponents/ShareButtonsComponent';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { ModernTooltip } from '../core/widgets/ModernTooltip';

export interface ModernShareEventModalProps extends ShareEventModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Render mode for modal/sidebar/inline display */
  renderMode?: ModalRenderMode;
}

export const ModernShareEventModal: React.FC<ModernShareEventModalProps> = ({
  isShareEventModalVisible,
  onShareEventClose,
  position = 'topRight',
  roomName,
  adminPasscode,
  islevel,
  eventType,
  localLink,
  shareButtons = true,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  renderMode = 'modal',
  // Render overrides
  renderMeetingId,
  renderMeetingPasscode,
  renderShareButtons,
  shareButtonsComponentProps,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Mount animation
  useEffect(() => {
    if (isShareEventModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isShareEventModalVisible]);

  // Compute share URL
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

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
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
        icon: copiedLink ? faCheck : faCopy,
        action: handleCopyLink,
        show: true,
        color: copiedLink ? MediasfuColors.success : MediasfuColors.primary,
        tooltip: copiedLink ? 'Copied!' : 'Copy link',
      },
      {
        icon: faEnvelope,
        action: () => {
          const emailUrl = `mailto:?subject=Join my meeting&body=Here is the link: ${shareUrl}`;
          window.open(emailUrl, '_blank');
        },
        show: true,
        color: '#ea4335',
        tooltip: 'Share via email',
      },
      {
        icon: faFacebook,
        action: () => {
          const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          window.open(url, '_blank', 'width=600,height=400');
        },
        show: true,
        color: '#1877F2',
        tooltip: 'Share on Facebook',
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
        tooltip: 'Share on Twitter',
      },
      {
        icon: faWhatsapp,
        action: () => {
          const url = `https://wa.me/?text=${encodeURIComponent(`Join my meeting: ${shareUrl}`)}`;
          window.open(url, '_blank');
        },
        show: true,
        color: '#25D366',
        tooltip: 'Share on WhatsApp',
      },
      {
        icon: faTelegram,
        action: () => {
          const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Join my meeting')}`;
          window.open(url, '_blank');
        },
        show: true,
        color: '#0088CC',
        tooltip: 'Share on Telegram',
      },
    ];

    return defaultButtons;
  }, [shareButtonsComponentProps?.shareButtons, shareUrl, handleCopyLink, copiedLink]);

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
    };
    return positions[position] || positions.topRight;
  };

  // Common styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
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
    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: 'none',
    cursor: 'pointer',
    padding: MediasfuSpacing.xs,
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: `${MediasfuSpacing.md}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.md}px`,
  };

  const sectionStyle: React.CSSProperties = {
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    borderRadius: MediasfuBorders.md,
    padding: `${MediasfuSpacing.sm}px`,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
  };

  const labelStyle: React.CSSProperties = {
    ...MediasfuTypography.getLabelMedium(isDarkMode),
    color: isDarkMode ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)',
    marginBottom: MediasfuSpacing.xs,
  };

  const cardInnerStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
    borderRadius: MediasfuBorders.sm,
    border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  const renderContent = () => (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          <div style={{
            padding: MediasfuSpacing.xs,
            background: `linear-gradient(135deg, ${MediasfuColors.secondary}, ${MediasfuColors.secondary}B3)`,
            borderRadius: MediasfuBorders.sm,
            boxShadow: `0 4px 12px ${MediasfuColors.secondary}80`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FontAwesomeIcon icon={faShareAlt} color="white" size="sm" />
          </div>
          Share Event
        </h2>
        <button 
          style={closeButtonStyle} 
          onClick={onShareEventClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {/* Body */}
      <div style={contentStyle}>
        {/* Meeting ID Section */}
        <div style={sectionStyle}>
          <div style={labelStyle}>Meeting ID</div>
          <div style={cardInnerStyle}>
            {renderMeetingId ? (
              renderMeetingId({
                defaultMeetingId: (
                  <MeetingIdComponent
                    meetingID={roomName}
                    labelProps={{ style: { color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#333', fontWeight: 'bold' } }}
                    inputProps={{ style: { color: isDarkMode ? '#fff' : '#000', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f0f0f0' } }}
                    copyIconColors={{ default: isDarkMode ? 'rgba(255,255,255,0.7)' : '#333', copied: MediasfuColors.success }}
                  />
                ),
                roomName,
              })
            ) : (
              <MeetingIdComponent
                meetingID={roomName}
                labelProps={{ style: { color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#333', fontWeight: 'bold' } }}
                inputProps={{ style: { color: isDarkMode ? '#fff' : '#000', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f0f0f0' } }}
                copyIconColors={{ default: isDarkMode ? 'rgba(255,255,255,0.7)' : '#333', copied: MediasfuColors.success }}
              />
            )}
          </div>
        </div>

        {/* Passcode Section (Host Only) */}
        {islevel === '2' && adminPasscode && (
          <div style={sectionStyle}>
            <div style={labelStyle}>Admin Passcode</div>
            <div style={cardInnerStyle}>
              {renderMeetingPasscode ? (
                renderMeetingPasscode({
                  defaultMeetingPasscode: (
                    <MeetingPasscodeComponent
                      meetingPasscode={adminPasscode}
                      labelProps={{ style: { color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#333', fontWeight: 'bold' } }}
                      inputProps={{ style: { color: isDarkMode ? '#fff' : '#000', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f0f0f0' } }}
                    />
                  ),
                  adminPasscode,
                  isHost: true,
                })
              ) : (
                <MeetingPasscodeComponent
                  meetingPasscode={adminPasscode}
                  labelProps={{ style: { color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#333', fontWeight: 'bold' } }}
                  inputProps={{ style: { color: isDarkMode ? '#fff' : '#000', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f0f0f0' } }}
                />
              )}
            </div>
          </div>
        )}

        {/* Share Buttons Section */}
        {shareButtons && (
          <div style={sectionStyle}>
            <div style={labelStyle}>Share</div>
            {renderShareButtons ? (
              renderShareButtons({
                defaultShareButtons: (
                  <div style={{ display: 'flex', gap: MediasfuSpacing.sm, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {shareButtonsList.map((button, index) => (
                      <ModernTooltip
                        key={index}
                        message={button.tooltip || 'Share'}
                        isDarkMode={isDarkMode}
                        position="top"
                      >
                        <button
                          onClick={() => handleShare(button)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            borderRadius: MediasfuBorders.sm,
                            background: `${button.color || MediasfuColors.primary}20`,
                            border: 'none',
                            cursor: 'pointer',
                            color: button.color || MediasfuColors.primary,
                            transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.background = `${button.color || MediasfuColors.primary}30`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.background = `${button.color || MediasfuColors.primary}20`;
                          }}
                        >
                          <FontAwesomeIcon icon={button.icon} />
                        </button>
                      </ModernTooltip>
                    ))}
                  </div>
                ),
                hasShareButtons: true,
              })
            ) : (
              <div style={{ display: 'flex', gap: MediasfuSpacing.sm, flexWrap: 'wrap', justifyContent: 'center' }}>
                {shareButtonsList.map((button, index) => (
                  <ModernTooltip
                    key={index}
                    message={button.tooltip || 'Share'}
                    isDarkMode={isDarkMode}
                    position="top"
                  >
                    <button
                      onClick={() => handleShare(button)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: MediasfuBorders.sm,
                        background: `${button.color || MediasfuColors.primary}20`,
                        border: 'none',
                        cursor: 'pointer',
                        color: button.color || MediasfuColors.primary,
                        transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.background = `${button.color || MediasfuColors.primary}30`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.background = `${button.color || MediasfuColors.primary}20`;
                      }}
                    >
                      <FontAwesomeIcon icon={button.icon} />
                    </button>
                  </ModernTooltip>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Sidebar/inline mode
  if (renderMode === 'sidebar' || renderMode === 'inline') {
    return renderContent();
  }

  // Modal mode
  if (!isShareEventModalVisible) return null;

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    zIndex: 999,
    opacity: isMounted ? 1 : 0,
    transition: `opacity ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    backdropFilter: 'blur(2px)',
  };

  const modalContainerStyle: React.CSSProperties = {
    position: 'absolute',
    ...getPositionStyles(),
    width: '400px',
    maxWidth: '90vw',
    maxHeight: '80vh',
    backgroundColor: isDarkMode 
      ? 'rgba(0, 0, 0, 0.35)' // High transparency as requested
      : 'rgba(255, 255, 255, 0.45)', // High transparency as requested
    backdropFilter: enableGlassmorphism ? 'blur(20px)' : 'none',
    borderRadius: MediasfuBorders.lg,
    border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    boxShadow: `0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px ${MediasfuColors.glassBorder(isDarkMode)}`,
    transform: isMounted ? 'scale(1)' : 'scale(0.95)',
    opacity: isMounted ? 1 : 0,
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.snappy}`,
    overflow: 'hidden',
  };

  return (
    <div style={modalOverlayStyle} onClick={onShareEventClose}>
      <div 
        style={modalContainerStyle} 
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </div>
    </div>
  );
};
