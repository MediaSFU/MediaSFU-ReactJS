/**
 * Modern Event Settings Modal with glassmorphic design.
 *
 * A premium-styled event settings modal for configuring meeting permissions,
 * featuring glassmorphic effects and smooth animations.
 * Uses the same EventSettingsModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernEventSettingsModal
 *   isEventSettingsModalVisible={showSettings}
 *   onEventSettingsClose={() => setShowSettings(false)}
 *   audioSetting="approval"
 *   videoSetting="approval"
 *   screenshareSetting="approval"
 *   chatSetting="allow"
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCog,
  faMicrophone,
  faVideo,
  faDesktop,
  faComments,
  faCheck,
  faLock,
  faCheckCircle,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import { EventSettingsModalOptions } from '../../components/eventSettingsComponents/EventSettingsModal';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import {
  modifySettings,
  ModifySettingsOptions,
} from '../../methods/settingsMethods/modifySettings';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';

export interface ModernEventSettingsModalProps extends EventSettingsModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Render mode for modal/sidebar/inline display */
  renderMode?: ModalRenderMode;
}

export type ModernEventSettingsModalType = (
  options: ModernEventSettingsModalProps
) => React.JSX.Element;

/**
 * ModernEventSettingsModal displays event settings with premium styling.
 */
export const ModernEventSettingsModal: React.FC<ModernEventSettingsModalProps> = ({
  isEventSettingsModalVisible,
  onEventSettingsClose,
  onModifyEventSettings = modifySettings,
  position = 'topRight',
  audioSetting,
  videoSetting,
  screenshareSetting,
  chatSetting,
  updateAudioSetting,
  updateVideoSetting,
  updateScreenshareSetting,
  updateChatSetting,
  updateIsSettingsModalVisible,
  roomName,
  socket,
  showAlert,
  title,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [localAudio, setLocalAudio] = useState(audioSetting);
  const [localVideo, setLocalVideo] = useState(videoSetting);
  const [localScreenshare, setLocalScreenshare] = useState(screenshareSetting);
  const [localChat, setLocalChat] = useState(chatSetting);

  // Sync local state with props
  useEffect(() => {
    setLocalAudio(audioSetting);
    setLocalVideo(videoSetting);
    setLocalScreenshare(screenshareSetting);
    setLocalChat(chatSetting);
  }, [audioSetting, videoSetting, screenshareSetting, chatSetting]);

  // Mount animation
  useEffect(() => {
    if (isEventSettingsModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isEventSettingsModalVisible]);

  // Handle save
  const handleSave = useCallback(async () => {
    await onModifyEventSettings({
      audioSet: localAudio,
      videoSet: localVideo,
      screenshareSet: localScreenshare,
      chatSet: localChat,
      updateAudioSetting,
      updateVideoSetting,
      updateScreenshareSetting,
      updateChatSetting,
      updateIsSettingsModalVisible,
      roomName,
      socket,
      showAlert,
    } as ModifySettingsOptions);
    onEventSettingsClose();
  }, [
    onModifyEventSettings,
    localAudio,
    localVideo,
    localScreenshare,
    localChat,
    updateAudioSetting,
    updateVideoSetting,
    updateScreenshareSetting,
    updateChatSetting,
    updateIsSettingsModalVisible,
    roomName,
    socket,
    showAlert,
    onEventSettingsClose,
  ]);

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

  // Sidebar/inline mode - render content directly without modal wrapper
  if (renderMode === 'sidebar' || renderMode === 'inline') {
    // Setting options for sidebar
    const settingOptions = [
      { value: 'allow', label: 'Allow', icon: faCheckCircle },
      { value: 'approval', label: 'Approval', icon: faLock },
      { value: 'disallow', label: 'Disallow', icon: faBan },
    ];

    // Settings sections for sidebar
    const settingsSections = [
      {
        key: 'audio',
        label: 'Audio',
        icon: faMicrophone,
        value: localAudio,
        setValue: setLocalAudio,
      },
      {
        key: 'video',
        label: 'Video',
        icon: faVideo,
        value: localVideo,
        setValue: setLocalVideo,
      },
      {
        key: 'screenshare',
        label: 'Screen Share',
        icon: faDesktop,
        value: localScreenshare,
        setValue: setLocalScreenshare,
      },
      {
        key: 'chat',
        label: 'Chat',
        icon: faComments,
        value: localChat,
        setValue: setLocalChat,
      },
    ];

    const sidebarHeaderStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${MediasfuSpacing.md}px`,
      borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    };

    const sidebarTitleStyle: React.CSSProperties = {
      ...MediasfuTypography.getTitleMedium(isDarkMode),
      display: 'flex',
      alignItems: 'center',
      gap: `${MediasfuSpacing.sm}px`,
      margin: 0,
    };

    const sidebarCloseButtonStyle: React.CSSProperties = {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: MediasfuSpacing.xs,
      borderRadius: MediasfuBorders.sm,
      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    };

    const sidebarContentStyle: React.CSSProperties = {
      flex: 1,
      overflowY: 'auto',
      padding: `${MediasfuSpacing.md}px`,
      display: 'flex',
      flexDirection: 'column',
      gap: `${MediasfuSpacing.md}px`,
    };

    const sidebarSectionStyle: React.CSSProperties = {
      background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      borderRadius: MediasfuBorders.md,
      padding: `${MediasfuSpacing.md}px`,
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
    };

    const sidebarSectionHeaderStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: `${MediasfuSpacing.sm}px`,
      marginBottom: MediasfuSpacing.sm,
      color: isDarkMode ? '#FFFFFF' : '#1F2937',
      fontWeight: 600,
    };

    const sidebarOptionsRowStyle: React.CSSProperties = {
      display: 'flex',
      gap: `${MediasfuSpacing.xs}px`,
    };

    const sidebarOptionStyle = (isSelected: boolean): React.CSSProperties => ({
      flex: 1,
      padding: `${MediasfuSpacing.sm}px`,
      background: isSelected
        ? MediasfuColors.brandGradient(isDarkMode)
        : 'transparent',
      border: `1px solid ${
        isSelected
          ? 'transparent'
          : isDarkMode
            ? 'rgba(255,255,255,0.15)'
            : 'rgba(0,0,0,0.1)'
      }`,
      borderRadius: MediasfuBorders.sm,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: `${MediasfuSpacing.xs}px`,
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
      color: isSelected ? '#FFFFFF' : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      fontSize: 11,
      fontWeight: isSelected ? 600 : 400,
    });

    const sidebarFooterStyle: React.CSSProperties = {
      padding: `${MediasfuSpacing.md}px`,
      borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={sidebarHeaderStyle}>
          <h2 style={sidebarTitleStyle}>
            <FontAwesomeIcon icon={faCog} />
            {title || 'Event Settings'}
          </h2>
          <button style={sidebarCloseButtonStyle} onClick={onEventSettingsClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Content */}
        <div style={sidebarContentStyle}>
          {settingsSections.map((section) => (
            <div key={section.key} style={sidebarSectionStyle}>
              <div style={sidebarSectionHeaderStyle}>
                <FontAwesomeIcon icon={section.icon} />
                {section.label}
              </div>
              <div style={sidebarOptionsRowStyle}>
                {settingOptions.map((option) => (
                  <div
                    key={option.value}
                    style={sidebarOptionStyle(section.value === option.value)}
                    onClick={() => section.setValue(option.value)}
                  >
                    <FontAwesomeIcon icon={option.icon} />
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={sidebarFooterStyle}>
          <PremiumButton
            variant="gradient"
            size="md"
            onPress={handleSave}
            isDarkMode={isDarkMode}
            fullWidth
          >
            <FontAwesomeIcon icon={faCheck} style={{ marginRight: MediasfuSpacing.sm }} />
            Save Settings
          </PremiumButton>
        </div>
      </div>
    );
  }

  if (!isEventSettingsModalVisible) return null;

  // Setting options
  const settingOptions = [
    { value: 'allow', label: 'Allow', icon: faCheckCircle },
    { value: 'approval', label: 'Approval', icon: faLock },
    { value: 'disallow', label: 'Disallow', icon: faBan },
  ];

  // Settings sections
  const settingsSections = [
    {
      key: 'audio',
      label: 'Audio',
      icon: faMicrophone,
      value: localAudio,
      setValue: setLocalAudio,
    },
    {
      key: 'video',
      label: 'Video',
      icon: faVideo,
      value: localVideo,
      setValue: setLocalVideo,
    },
    {
      key: 'screenshare',
      label: 'Screen Share',
      icon: faDesktop,
      value: localScreenshare,
      setValue: setLocalScreenshare,
    },
    {
      key: 'chat',
      label: 'Chat',
      icon: faComments,
      value: localChat,
      setValue: setLocalChat,
    },
  ];

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
    width: 'min(420px, calc(100vw - 32px))',
    maxHeight: 'min(600px, calc(100vh - 100px))',
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
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

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: `${MediasfuSpacing.md}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.md}px`,
  };

  const sectionStyle: React.CSSProperties = {
    background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    borderRadius: MediasfuBorders.md,
    padding: `${MediasfuSpacing.md}px`,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
  };

  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
    marginBottom: MediasfuSpacing.sm,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    fontWeight: 600,
  };

  const optionsRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.xs}px`,
  };

  const optionStyle = (isSelected: boolean): React.CSSProperties => ({
    flex: 1,
    padding: `${MediasfuSpacing.sm}px`,
    background: isSelected
      ? MediasfuColors.brandGradient(isDarkMode)
      : 'transparent',
    border: `1px solid ${
      isSelected
        ? 'transparent'
        : isDarkMode
          ? 'rgba(255,255,255,0.15)'
          : 'rgba(0,0,0,0.1)'
    }`,
    borderRadius: MediasfuBorders.sm,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: `${MediasfuSpacing.xs}px`,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    color: isSelected ? '#FFFFFF' : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    fontSize: 11,
    fontWeight: isSelected ? 600 : 400,
  });

  const footerStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.md}px`,
    borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  return (
    <>
      <div style={overlayStyle} onClick={onEventSettingsClose} />
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
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            <FontAwesomeIcon icon={faCog} />
            {title || 'Event Settings'}
          </h2>
          <button style={closeButtonStyle} onClick={onEventSettingsClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {settingsSections.map((section) => (
            <div key={section.key} style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <FontAwesomeIcon icon={section.icon} />
                {section.label}
              </div>
              <div style={optionsRowStyle}>
                {settingOptions.map((option) => (
                  <div
                    key={option.value}
                    style={optionStyle(section.value === option.value)}
                    onClick={() => section.setValue(option.value)}
                  >
                    <FontAwesomeIcon icon={option.icon} />
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <PremiumButton
            variant="gradient"
            size="md"
            onPress={handleSave}
            isDarkMode={isDarkMode}
            fullWidth
          >
            <FontAwesomeIcon icon={faCheck} style={{ marginRight: MediasfuSpacing.sm }} />
            Save Settings
          </PremiumButton>
        </div>
      </GlassmorphicContainer>
    </>
  );
};

export default ModernEventSettingsModal;
