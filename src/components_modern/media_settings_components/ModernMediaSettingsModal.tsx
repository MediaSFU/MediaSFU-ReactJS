/**
 * Modern Media Settings Modal with glassmorphic design.
 *
 * A premium-styled media settings modal for configuring audio/video devices,
 * featuring glassmorphic effects and smooth animations.
 * Uses the same MediaSettingsModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernMediaSettingsModal
 *   isMediaSettingsModalVisible={showSettings}
 *   onMediaSettingsClose={() => setShowSettings(false)}
 *   parameters={parameters}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCamera,
  faMicrophone,
  faSyncAlt,
  faPhotoFilm,
  faVideo,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import {
  MediaSettingsModalOptions,
  MediaSettingsModalParameters,
} from '../../components/mediaSettingsComponents/MediaSettingsModal';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import { switchAudio, SwitchAudioOptions } from '../../methods/streamMethods/switchAudio';
import { switchVideo, SwitchVideoOptions } from '../../methods/streamMethods/switchVideo';
import { switchVideoAlt, SwitchVideoAltOptions } from '../../methods/streamMethods/switchVideoAlt';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';
import { ModernTooltip } from '../core/widgets/ModernTooltip';

export interface ModernMediaSettingsModalProps extends MediaSettingsModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
  renderMode?: ModalRenderMode;
  /** Request navigation to the background picker in sidebar render mode */
  onOpenBackgroundSidebar?: () => void;
}

export type ModernMediaSettingsModalType = (
  options: ModernMediaSettingsModalProps
) => React.JSX.Element;

/**
 * ModernMediaSettingsModal displays media device settings with premium styling.
 */
export const ModernMediaSettingsModal: React.FC<ModernMediaSettingsModalProps> = ({
  isMediaSettingsModalVisible,
  onMediaSettingsClose,
  switchCameraOnPress = switchVideoAlt,
  switchVideoOnPress = switchVideo,
  switchAudioOnPress = switchAudio,
  parameters,
  position = 'topRight',
  onOpenBackgroundSidebar,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<'video' | 'audio'>('video');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');

  // Get params
  const getParams = useCallback((): MediaSettingsModalParameters => {
    return parameters.getUpdatedAllParams
      ? parameters.getUpdatedAllParams()
      : parameters;
  }, [parameters]);

  const resolveParams = useCallback(() => {
    const params = getParams();
    const videoInputs = params?.videoInputs ?? [];
    const audioInputs = params?.audioInputs ?? [];

    const userDefaultVideoInputDevice = params?.userDefaultVideoInputDevice ?? (videoInputs[0]?.deviceId ?? '');
    const userDefaultAudioInputDevice = params?.userDefaultAudioInputDevice ?? (audioInputs[0]?.deviceId ?? '');

    return {
      ...params,
      videoInputs,
      audioInputs,
      userDefaultVideoInputDevice,
      userDefaultAudioInputDevice,
      isBackgroundModalVisible: params?.isBackgroundModalVisible ?? false,
      updateIsBackgroundModalVisible:
        params?.updateIsBackgroundModalVisible ?? (() => {}),
    } as MediaSettingsModalParameters;
  }, [getParams]);

  const syncSelectedDevices = useCallback(() => {
    const params = resolveParams();
    if (!params) return;
    setSelectedVideoDevice(params.userDefaultVideoInputDevice || '');
    setSelectedAudioDevice(params.userDefaultAudioInputDevice || '');
  }, [resolveParams]);

  // Initialize selected devices
  useEffect(() => {
    if (isMediaSettingsModalVisible) {
      syncSelectedDevices();
    }
  }, [isMediaSettingsModalVisible, syncSelectedDevices]);

  // Mount animation
  useEffect(() => {
    if (isMediaSettingsModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isMediaSettingsModalVisible]);

  // Handle video device change
  const handleVideoChange = useCallback(
    async (deviceId: string) => {
      if (!deviceId || deviceId === selectedVideoDevice) return;
      const params = resolveParams();
      if (!params) return;
      setSelectedVideoDevice(deviceId);
      await switchVideoOnPress({
        videoPreference: deviceId,
        parameters: params,
      } as SwitchVideoOptions);
    },
    [switchVideoOnPress, resolveParams, selectedVideoDevice]
  );

  // Handle audio device change
  const handleAudioChange = useCallback(
    async (deviceId: string) => {
      if (!deviceId || deviceId === selectedAudioDevice) return;
      const params = resolveParams();
      if (!params) return;
      setSelectedAudioDevice(deviceId);
      await switchAudioOnPress({
        audioPreference: deviceId,
        parameters: params,
      } as SwitchAudioOptions);
    },
    [switchAudioOnPress, resolveParams, selectedAudioDevice]
  );

  // Handle camera switch
  const handleCameraSwitch = useCallback(async () => {
    const params = resolveParams();
    if (!params) return;
    await switchCameraOnPress({
      parameters: params,
    } as SwitchVideoAltOptions);
  }, [switchCameraOnPress, resolveParams]);

  // Handle background modal
  const handleBackgroundModal = useCallback(() => {
    const params = resolveParams();
    if (!params) return;
    if (onOpenBackgroundSidebar) {
      onOpenBackgroundSidebar();
      return;
    }
    params.updateIsBackgroundModalVisible(!params.isBackgroundModalVisible);
  }, [resolveParams, onOpenBackgroundSidebar]);

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
    const params = resolveParams();
    
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

    const sidebarTabsStyle: React.CSSProperties = {
      display: 'flex',
      gap: `${MediasfuSpacing.xs}px`,
      padding: `${MediasfuSpacing.sm}px`,
      background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
    };

    const sidebarTabStyle = (isActive: boolean): React.CSSProperties => ({
      flex: 1,
      padding: `${MediasfuSpacing.sm}px`,
      background: isActive
        ? MediasfuColors.brandGradient(isDarkMode)
        : 'transparent',
      border: 'none',
      borderRadius: MediasfuBorders.sm,
      cursor: 'pointer',
      color: isActive ? '#FFFFFF' : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      fontWeight: isActive ? 600 : 400,
      fontSize: 14,
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: `${MediasfuSpacing.xs}px`,
    });

    const sidebarContentStyle: React.CSSProperties = {
      flex: 1,
      overflowY: 'auto',
      padding: `${MediasfuSpacing.md}px`,
    };

    const sidebarSectionTitleStyle: React.CSSProperties = {
      ...MediasfuTypography.getLabelLarge(isDarkMode),
      marginBottom: MediasfuSpacing.sm,
      display: 'flex',
      alignItems: 'center',
      gap: `${MediasfuSpacing.sm}px`,
    };

    const sidebarDeviceListStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: `${MediasfuSpacing.xs}px`,
    };

    const sidebarDeviceItemStyle = (isSelected: boolean): React.CSSProperties => ({
      padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
      background: isSelected
        ? isDarkMode
          ? 'rgba(59, 130, 246, 0.2)'
          : 'rgba(59, 130, 246, 0.1)'
        : isDarkMode
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.02)',
      border: `1px solid ${
        isSelected
          ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
          : isDarkMode
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.08)'
      }`,
      borderRadius: MediasfuBorders.md,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: `${MediasfuSpacing.sm}px`,
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
      color: isDarkMode ? '#FFFFFF' : '#1F2937',
      fontSize: 14,
    });

    const sidebarActionsStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: `${MediasfuSpacing.sm}px`,
      padding: `${MediasfuSpacing.md}px`,
      borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    };

    // Camera off indicator - shown when camera is off
    const videoAlreadyOn = params?.videoAlreadyOn ?? false;
    const cameraOffIndicator = !videoAlreadyOn && (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: `${MediasfuSpacing.sm}px`,
          padding: `${MediasfuSpacing.md}px`,
          backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
          border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)'}`,
          borderRadius: MediasfuBorders.md,
          margin: `0 ${MediasfuSpacing.md}px`,
        }}
      >
        <FontAwesomeIcon
          icon={faCamera}
          style={{
            color: isDarkMode ? '#60a5fa' : '#3b82f6',
            fontSize: 16,
            marginTop: 2,
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: isDarkMode ? '#93c5fd' : '#2563eb',
              marginBottom: 4,
            }}
          >
            Camera is currently off
          </div>
          <div
            style={{
              fontSize: 12,
              color: isDarkMode ? '#bfdbfe' : '#3b82f6',
              lineHeight: 1.4,
            }}
          >
            You can still choose a background now! It will be applied automatically when you turn on your camera.
          </div>
        </div>
      </div>
    );

    const actionsBlock = (
      <div style={sidebarActionsStyle}>
        {cameraOffIndicator}
        <ModernTooltip message="Toggle between front/back or available cameras" position="right">
          <div>
            <PremiumButton
              variant="outlined"
              size="md"
              onPress={handleCameraSwitch}
              isDarkMode={isDarkMode}
              fullWidth
            >
              <FontAwesomeIcon icon={faSyncAlt} style={{ marginRight: MediasfuSpacing.sm }} />
              Switch Camera
            </PremiumButton>
          </div>
        </ModernTooltip>
        <ModernTooltip message="Open virtual background settings" position="right">
          <div>
            <PremiumButton
              variant="gradient"
              size="md"
              onPress={handleBackgroundModal}
              isDarkMode={isDarkMode}
              fullWidth
            >
              <FontAwesomeIcon icon={faPhotoFilm} style={{ marginRight: MediasfuSpacing.sm }} />
              Virtual Background
            </PremiumButton>
          </div>
        </ModernTooltip>
      </div>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={sidebarHeaderStyle}>
          <h2 style={sidebarTitleStyle}>
            <FontAwesomeIcon icon={faVideo} />
            Media Settings
          </h2>
          <button style={sidebarCloseButtonStyle} onClick={onMediaSettingsClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Quick actions (top duplicate for visibility) */}
        {actionsBlock}

        {/* Tabs */}
        <div style={sidebarTabsStyle}>
          <button
            style={sidebarTabStyle(activeSection === 'video')}
            onClick={() => setActiveSection('video')}
          >
            <FontAwesomeIcon icon={faCamera} />
            Video
          </button>
          <button
            style={sidebarTabStyle(activeSection === 'audio')}
            onClick={() => setActiveSection('audio')}
          >
            <FontAwesomeIcon icon={faMicrophone} />
            Audio
          </button>
        </div>

        {/* Content */}
        <div style={sidebarContentStyle}>
          {activeSection === 'video' && (
            <>
              <div style={sidebarSectionTitleStyle}>
                <FontAwesomeIcon icon={faCamera} />
                Video Input
              </div>
              <div style={sidebarDeviceListStyle}>
                {params.videoInputs.map((device) => (
                  <ModernTooltip
                    key={device.deviceId}
                    message={device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
                    position="left"
                  >
                    <div
                      style={sidebarDeviceItemStyle(selectedVideoDevice === device.deviceId)}
                      onClick={() => handleVideoChange(device.deviceId)}
                    >
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
                      </span>
                      {selectedVideoDevice === device.deviceId && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary }}
                        />
                      )}
                    </div>
                  </ModernTooltip>
                ))}
              </div>
            </>
          )}

          {activeSection === 'audio' && (
            <>
              <div style={sidebarSectionTitleStyle}>
                <FontAwesomeIcon icon={faMicrophone} />
                Audio Input
              </div>
              <div style={sidebarDeviceListStyle}>
                {params.audioInputs.map((device) => (
                  <ModernTooltip
                    key={device.deviceId}
                    message={device.label || `Microphone ${device.deviceId.slice(0, 8)}...`}
                    position="left"
                  >
                    <div
                      style={sidebarDeviceItemStyle(selectedAudioDevice === device.deviceId)}
                      onClick={() => handleAudioChange(device.deviceId)}
                    >
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {device.label || `Microphone ${device.deviceId.slice(0, 8)}...`}
                      </span>
                      {selectedAudioDevice === device.deviceId && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary }}
                        />
                      )}
                    </div>
                  </ModernTooltip>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Actions (bottom) */}
        {actionsBlock}
      </div>
    );
  }

  if (!isMediaSettingsModalVisible) return null;

  const params = resolveParams();

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
    maxHeight: 'min(500px, calc(100vh - 100px))',
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

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.xs}px`,
    padding: `${MediasfuSpacing.sm}px`,
    background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: `${MediasfuSpacing.sm}px`,
    background: isActive
      ? MediasfuColors.brandGradient(isDarkMode)
      : 'transparent',
    border: 'none',
    borderRadius: MediasfuBorders.sm,
    cursor: 'pointer',
    color: isActive ? '#FFFFFF' : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    fontWeight: isActive ? 600 : 400,
    fontSize: 14,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${MediasfuSpacing.xs}px`,
  });

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: `${MediasfuSpacing.md}px`,
  };

  const sectionTitleStyle: React.CSSProperties = {
    ...MediasfuTypography.getLabelLarge(isDarkMode),
    marginBottom: MediasfuSpacing.sm,
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
  };

  const deviceListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.xs}px`,
  };

  const deviceItemStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isSelected
      ? isDarkMode
        ? 'rgba(59, 130, 246, 0.2)'
        : 'rgba(59, 130, 246, 0.1)'
      : isDarkMode
        ? 'rgba(255,255,255,0.05)'
        : 'rgba(0,0,0,0.02)',
    border: `1px solid ${
      isSelected
        ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
        : isDarkMode
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(0,0,0,0.08)'
    }`,
    borderRadius: MediasfuBorders.md,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: `${MediasfuSpacing.sm}px`,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    fontSize: 14,
  });

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.sm}px`,
    padding: `${MediasfuSpacing.md}px`,
    borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  return (
    <>
      <div style={overlayStyle} onClick={onMediaSettingsClose} />
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
            <FontAwesomeIcon icon={faVideo} />
            Media Settings
          </h2>
          <button style={closeButtonStyle} onClick={onMediaSettingsClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Tabs */}
        <div style={tabsStyle}>
          <button
            style={tabStyle(activeSection === 'video')}
            onClick={() => setActiveSection('video')}
          >
            <FontAwesomeIcon icon={faCamera} />
            Video
          </button>
          <button
            style={tabStyle(activeSection === 'audio')}
            onClick={() => setActiveSection('audio')}
          >
            <FontAwesomeIcon icon={faMicrophone} />
            Audio
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {activeSection === 'video' && (
            <>
              <div style={sectionTitleStyle}>
                <FontAwesomeIcon icon={faCamera} />
                Video Input
              </div>
              <div style={deviceListStyle}>
                {params.videoInputs.map((device) => (
                  <ModernTooltip
                    key={device.deviceId}
                    message={device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
                    position="left"
                  >
                    <div
                      style={deviceItemStyle(selectedVideoDevice === device.deviceId)}
                      onClick={() => handleVideoChange(device.deviceId)}
                    >
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
                      </span>
                      {selectedVideoDevice === device.deviceId && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary }}
                        />
                      )}
                    </div>
                  </ModernTooltip>
                ))}
              </div>
            </>
          )}

          {activeSection === 'audio' && (
            <>
              <div style={sectionTitleStyle}>
                <FontAwesomeIcon icon={faMicrophone} />
                Audio Input
              </div>
              <div style={deviceListStyle}>
                {params.audioInputs.map((device) => (
                  <ModernTooltip
                    key={device.deviceId}
                    message={device.label || `Microphone ${device.deviceId.slice(0, 8)}...`}
                    position="left"
                  >
                    <div
                      style={deviceItemStyle(selectedAudioDevice === device.deviceId)}
                      onClick={() => handleAudioChange(device.deviceId)}
                    >
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {device.label || `Microphone ${device.deviceId.slice(0, 8)}...`}
                      </span>
                      {selectedAudioDevice === device.deviceId && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary }}
                        />
                      )}
                    </div>
                  </ModernTooltip>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div style={actionsStyle}>
          {/* Camera off indicator for modal mode */}
          {!params?.videoAlreadyOn && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: `${MediasfuSpacing.sm}px`,
                padding: `${MediasfuSpacing.md}px`,
                backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)'}`,
                borderRadius: MediasfuBorders.md,
              }}
            >
              <FontAwesomeIcon
                icon={faCamera}
                style={{
                  color: isDarkMode ? '#60a5fa' : '#3b82f6',
                  fontSize: 16,
                  marginTop: 2,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: isDarkMode ? '#93c5fd' : '#2563eb',
                    marginBottom: 4,
                  }}
                >
                  Camera is currently off
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: isDarkMode ? '#bfdbfe' : '#3b82f6',
                    lineHeight: 1.4,
                  }}
                >
                  You can still choose a background now! It will be applied automatically when you turn on your camera.
                </div>
              </div>
            </div>
          )}
          <ModernTooltip message="Toggle between front/back or available cameras" position="left">
            <div>
              <PremiumButton
                variant="outlined"
                size="md"
                onPress={handleCameraSwitch}
                isDarkMode={isDarkMode}
                fullWidth
              >
                <FontAwesomeIcon icon={faSyncAlt} style={{ marginRight: MediasfuSpacing.sm }} />
                Switch Camera
              </PremiumButton>
            </div>
          </ModernTooltip>
          <ModernTooltip message="Open virtual background settings" position="left">
            <div>
              <PremiumButton
                variant="gradient"
                size="md"
                onPress={handleBackgroundModal}
                isDarkMode={isDarkMode}
                fullWidth
              >
                <FontAwesomeIcon icon={faPhotoFilm} style={{ marginRight: MediasfuSpacing.sm }} />
                Virtual Background
              </PremiumButton>
            </div>
          </ModernTooltip>
        </div>
      </GlassmorphicContainer>
    </>
  );
};

export default ModernMediaSettingsModal;
