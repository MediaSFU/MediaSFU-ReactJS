/**
 * Modern Display Settings Modal with glassmorphic design.
 *
 * A premium-styled display settings modal for configuring video layouts,
 * featuring glassmorphic effects and smooth animations.
 * Uses the same DisplaySettingsModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernDisplaySettingsModal
 *   isDisplaySettingsModalVisible={showSettings}
 *   onDisplaySettingsClose={() => setShowSettings(false)}
 *   parameters={parameters}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faDisplay,
  faVideo,
  faExpand,
  faWaveSquare,
  faGaugeHigh,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { DisplaySettingsModalOptions } from '../../components/displaySettingsComponents/DisplaySettingsModal';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import { modifyDisplaySettings } from '../../methods/displaySettingsMethods/modifyDisplaySettings';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';

export interface ModernDisplaySettingsModalProps extends DisplaySettingsModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Render mode for modal/sidebar/inline display */
  renderMode?: ModalRenderMode;
}

export type ModernDisplaySettingsModalType = (
  options: ModernDisplaySettingsModalProps
) => React.JSX.Element;

/**
 * ModernDisplaySettingsModal displays video layout settings with premium styling.
 */
export const ModernDisplaySettingsModal: React.FC<ModernDisplaySettingsModalProps> = ({
  isDisplaySettingsModalVisible,
  onDisplaySettingsClose,
  onModifyDisplaySettings = modifyDisplaySettings,
  parameters,
  position = 'topRight',
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  // Initialize state directly from parameters (matching original component pattern)
  // Using a ref to track if we've initialized for this modal open session
  const [displayType, setDisplayType] = useState<string>(parameters.meetingDisplayType);
  const [autoWave, setAutoWave] = useState(parameters.autoWave);
  const [forceFullDisplay, setForceFullDisplay] = useState(parameters.forceFullDisplay);
  const [videoOptimized, setVideoOptimized] = useState(parameters.meetingVideoOptimized);
  const hasInitializedRef = React.useRef(false);

  // Only re-initialize settings when modal opens (not on every parameter change)
  useEffect(() => {
    if (isDisplaySettingsModalVisible && !hasInitializedRef.current) {
      setDisplayType(parameters.meetingDisplayType);
      setAutoWave(parameters.autoWave);
      setForceFullDisplay(parameters.forceFullDisplay);
      setVideoOptimized(parameters.meetingVideoOptimized);
      hasInitializedRef.current = true;
    } else if (!isDisplaySettingsModalVisible) {
      // Reset the flag when modal closes so next open will re-initialize
      hasInitializedRef.current = false;
    }
  }, [isDisplaySettingsModalVisible]);

  // Mount animation
  useEffect(() => {
    if (isDisplaySettingsModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isDisplaySettingsModalVisible]);

  // Handle save - merge new values into parameters (matching original DisplaySettingsModal pattern)
  const handleSave = useCallback(async () => {
    await onModifyDisplaySettings({
      parameters: {
        ...parameters,
        meetingDisplayType: displayType,
        autoWave,
        forceFullDisplay,
        meetingVideoOptimized: videoOptimized,
      },
    });
    onDisplaySettingsClose();
  }, [
    onModifyDisplaySettings,
    parameters,
    displayType,
    autoWave,
    forceFullDisplay,
    videoOptimized,
    onDisplaySettingsClose,
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
    // Display type options for sidebar
    const displayOptions = [
      { value: 'video', label: 'Video Only', icon: faVideo },
      { value: 'media', label: 'Media', icon: faDisplay },
      { value: 'all', label: 'All Participants', icon: faExpand },
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
      gap: `${MediasfuSpacing.lg}px`,
    };

    const sidebarSectionStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: `${MediasfuSpacing.sm}px`,
    };

    const sidebarLabelStyle: React.CSSProperties = {
      ...MediasfuTypography.getLabelLarge(isDarkMode),
      marginBottom: MediasfuSpacing.xs,
    };

    const sidebarOptionGridStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: `${MediasfuSpacing.sm}px`,
    };

    const sidebarOptionStyle = (isSelected: boolean): React.CSSProperties => ({
      padding: `${MediasfuSpacing.md}px ${MediasfuSpacing.sm}px`,
      background: isSelected
        ? MediasfuColors.brandGradient(isDarkMode)
        : isDarkMode
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.02)',
      border: `1px solid ${
        isSelected
          ? 'transparent'
          : isDarkMode
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.08)'
      }`,
      borderRadius: MediasfuBorders.md,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: `${MediasfuSpacing.xs}px`,
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
      color: isSelected ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#1F2937',
      fontSize: 12,
      fontWeight: isSelected ? 600 : 400,
    });

    const sidebarToggleRowStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderRadius: MediasfuBorders.md,
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
    };

    const sidebarToggleLabelStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: `${MediasfuSpacing.sm}px`,
      color: isDarkMode ? '#FFFFFF' : '#1F2937',
      fontSize: 14,
    };

    const sidebarSwitchStyle = (isOn: boolean): React.CSSProperties => ({
      width: 48,
      height: 24,
      borderRadius: 12,
      background: isOn
        ? MediasfuColors.brandGradient(isDarkMode)
        : isDarkMode
          ? 'rgba(255,255,255,0.2)'
          : 'rgba(0,0,0,0.2)',
      position: 'relative',
      cursor: 'pointer',
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    });

    const sidebarSwitchKnobStyle = (isOn: boolean): React.CSSProperties => ({
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: '#FFFFFF',
      position: 'absolute',
      top: 2,
      left: isOn ? 26 : 2,
      transition: `left ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
            <FontAwesomeIcon icon={faDisplay} />
            Display Settings
          </h2>
          <button style={sidebarCloseButtonStyle} onClick={onDisplaySettingsClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Content */}
        <div style={sidebarContentStyle}>
          {/* Display Type */}
          <div style={sidebarSectionStyle}>
            <label style={sidebarLabelStyle}>Display Type</label>
            <div style={sidebarOptionGridStyle}>
              {displayOptions.map((option) => (
                <div
                  key={option.value}
                  style={sidebarOptionStyle(displayType === option.value)}
                  onClick={() => setDisplayType(option.value)}
                >
                  <FontAwesomeIcon icon={option.icon} size="lg" />
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div style={sidebarSectionStyle}>
            <label style={sidebarLabelStyle}>Display Options</label>
            
            {/* Auto Wave */}
            <div style={sidebarToggleRowStyle}>
              <div style={sidebarToggleLabelStyle}>
                <FontAwesomeIcon icon={faWaveSquare} />
                Audio Visualization
              </div>
              <div
                style={sidebarSwitchStyle(autoWave)}
                onClick={() => setAutoWave(!autoWave)}
              >
                <div style={sidebarSwitchKnobStyle(autoWave)} />
              </div>
            </div>

            {/* Force Full Display */}
            <div style={sidebarToggleRowStyle}>
              <div style={sidebarToggleLabelStyle}>
                <FontAwesomeIcon icon={faExpand} />
                Force Full Display
              </div>
              <div
                style={sidebarSwitchStyle(forceFullDisplay)}
                onClick={() => setForceFullDisplay(!forceFullDisplay)}
              >
                <div style={sidebarSwitchKnobStyle(forceFullDisplay)} />
              </div>
            </div>

            {/* Video Optimized */}
            <div style={sidebarToggleRowStyle}>
              <div style={sidebarToggleLabelStyle}>
                <FontAwesomeIcon icon={faGaugeHigh} />
                Video Optimization
              </div>
              <div
                style={sidebarSwitchStyle(videoOptimized)}
                onClick={() => setVideoOptimized(!videoOptimized)}
              >
                <div style={sidebarSwitchKnobStyle(videoOptimized)} />
              </div>
            </div>
          </div>
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
            Apply Settings
          </PremiumButton>
        </div>
      </div>
    );
  }

  if (!isDisplaySettingsModalVisible) return null;

  // Display type options
  const displayOptions = [
    { value: 'video', label: 'Video Only', icon: faVideo },
    { value: 'media', label: 'Media', icon: faDisplay },
    { value: 'all', label: 'All Participants', icon: faExpand },
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
    width: 'min(380px, calc(100vw - 32px))',
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

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: `${MediasfuSpacing.md}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.lg}px`,
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.sm}px`,
  };

  const labelStyle: React.CSSProperties = {
    ...MediasfuTypography.getLabelLarge(isDarkMode),
    marginBottom: MediasfuSpacing.xs,
  };

  const optionGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: `${MediasfuSpacing.sm}px`,
  };

  const optionStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: `${MediasfuSpacing.md}px ${MediasfuSpacing.sm}px`,
    background: isSelected
      ? MediasfuColors.brandGradient(isDarkMode)
      : isDarkMode
        ? 'rgba(255,255,255,0.05)'
        : 'rgba(0,0,0,0.02)',
    border: `1px solid ${
      isSelected
        ? 'transparent'
        : isDarkMode
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(0,0,0,0.08)'
    }`,
    borderRadius: MediasfuBorders.md,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: `${MediasfuSpacing.xs}px`,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    color: isSelected ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#1F2937',
    fontSize: 12,
    fontWeight: isSelected ? 600 : 400,
  });

  const toggleRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    borderRadius: MediasfuBorders.md,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
  };

  const toggleLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    fontSize: 14,
  };

  const switchStyle = (isOn: boolean): React.CSSProperties => ({
    width: 48,
    height: 24,
    borderRadius: 12,
    background: isOn
      ? MediasfuColors.brandGradient(isDarkMode)
      : isDarkMode
        ? 'rgba(255,255,255,0.2)'
        : 'rgba(0,0,0,0.2)',
    position: 'relative',
    cursor: 'pointer',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  });

  const switchKnobStyle = (isOn: boolean): React.CSSProperties => ({
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#FFFFFF',
    position: 'absolute',
    top: 2,
    left: isOn ? 26 : 2,
    transition: `left ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  });

  const footerStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.md}px`,
    borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  return (
    <>
      <div style={overlayStyle} onClick={onDisplaySettingsClose} />
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
            <FontAwesomeIcon icon={faDisplay} />
            Display Settings
          </h2>
          <button style={closeButtonStyle} onClick={onDisplaySettingsClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {/* Display Type */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Display Type</label>
            <div style={optionGridStyle}>
              {displayOptions.map((option) => (
                <div
                  key={option.value}
                  style={optionStyle(displayType === option.value)}
                  onClick={() => setDisplayType(option.value)}
                >
                  <FontAwesomeIcon icon={option.icon} size="lg" />
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Display Options</label>
            
            {/* Auto Wave */}
            <div style={toggleRowStyle}>
              <div style={toggleLabelStyle}>
                <FontAwesomeIcon icon={faWaveSquare} />
                Audio Visualization
              </div>
              <div
                style={switchStyle(autoWave)}
                onClick={() => setAutoWave(!autoWave)}
              >
                <div style={switchKnobStyle(autoWave)} />
              </div>
            </div>

            {/* Force Full Display */}
            <div style={toggleRowStyle}>
              <div style={toggleLabelStyle}>
                <FontAwesomeIcon icon={faExpand} />
                Force Full Display
              </div>
              <div
                style={switchStyle(forceFullDisplay)}
                onClick={() => setForceFullDisplay(!forceFullDisplay)}
              >
                <div style={switchKnobStyle(forceFullDisplay)} />
              </div>
            </div>

            {/* Video Optimized */}
            <div style={toggleRowStyle}>
              <div style={toggleLabelStyle}>
                <FontAwesomeIcon icon={faGaugeHigh} />
                Video Optimization
              </div>
              <div
                style={switchStyle(videoOptimized)}
                onClick={() => setVideoOptimized(!videoOptimized)}
              >
                <div style={switchKnobStyle(videoOptimized)} />
              </div>
            </div>
          </div>
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
            Apply Settings
          </PremiumButton>
        </div>
      </GlassmorphicContainer>
    </>
  );
};

export default ModernDisplaySettingsModal;
