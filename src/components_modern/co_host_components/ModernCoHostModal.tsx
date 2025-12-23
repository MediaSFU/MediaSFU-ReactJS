/**
 * Modern Co-Host Modal with glassmorphic design.
 *
 * A premium-styled co-host management modal for assigning co-host
 * and configuring responsibilities with glassmorphic effects.
 * Uses the same CoHostModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernCoHostModal
 *   isCoHostModalVisible={showCoHost}
 *   onCoHostClose={() => setShowCoHost(false)}
 *   participants={participants}
 *   coHostResponsibility={responsibilities}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUserShield,
  faCheck,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { CoHostModalOptions } from '../../components/coHostComponents/CoHostModal';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import { modifyCoHostSettings } from '../../methods/coHostMethods/modifyCoHostSettings';
import { CoHostResponsibility, Participant, ModifyCoHostSettingsOptions } from '../../@types/types';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';

export interface ModernCoHostModalProps extends CoHostModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
  renderMode?: ModalRenderMode;
}

export type ModernCoHostModalType = (
  options: ModernCoHostModalProps
) => React.JSX.Element;

/**
 * ModernCoHostModal displays co-host management with premium styling.
 */
export const ModernCoHostModal: React.FC<ModernCoHostModalProps> = ({
  isCoHostModalVisible,
  currentCohost = '',
  participants,
  coHostResponsibility,
  position = 'topRight',
  roomName,
  showAlert,
  updateCoHostResponsibility,
  updateCoHost,
  updateIsCoHostModalVisible,
  socket,
  onCoHostClose,
  onModifyEventSettings = modifyCoHostSettings,
  title,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCoHost, setSelectedCoHost] = useState(currentCohost);
  const [responsibilities, setResponsibilities] = useState<CoHostResponsibility[]>([]);
  const [isSelectHovered, setIsSelectHovered] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  // Initialize responsibilities
  useEffect(() => {
    if (coHostResponsibility) {
      setResponsibilities([...coHostResponsibility]);
    }
  }, [coHostResponsibility]);

  // Initialize selected co-host
  useEffect(() => {
    setSelectedCoHost(currentCohost);
  }, [currentCohost]);

  // Mount animation
  useEffect(() => {
    if (isCoHostModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isCoHostModalVisible]);

  // Toggle responsibility
  const toggleResponsibility = useCallback((name: string, field: 'value' | 'dedicated') => {
    setResponsibilities((prev) =>
      prev.map((resp) => {
        if (resp.name !== name) return resp;

        const nextValue = field === 'value' ? !resp.value : resp.value;
        const nextDedicated = field === 'dedicated'
          ? (resp.value ? !resp.dedicated : resp.dedicated)
          : nextValue ? resp.dedicated : false;

        return {
          ...resp,
          value: nextValue,
          dedicated: nextDedicated,
        };
      })
    );
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    onModifyEventSettings({
      roomName,
      showAlert,
      selectedParticipant: selectedCoHost,
      coHost: currentCohost,
      coHostResponsibility: responsibilities,
      updateCoHostResponsibility,
      updateCoHost,
      updateIsCoHostModalVisible,
      socket,
    } as ModifyCoHostSettingsOptions);
    onCoHostClose();
  }, [
    onModifyEventSettings,
    roomName,
    showAlert,
    selectedCoHost,
    currentCohost,
    responsibilities,
    updateCoHostResponsibility,
    updateCoHost,
    updateIsCoHostModalVisible,
    socket,
    onCoHostClose,
  ]);

  // Get eligible participants (non-hosts)
  const eligibleParticipants = participants.filter(
    (p: Participant) => p.islevel !== '2'
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

  // For sidebar or inline mode, skip visibility check
  if (renderMode !== 'sidebar' && renderMode !== 'inline') {
    if (!isCoHostModalVisible) return null;
  }

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
    width: 'min(450px, calc(100vw - 32px))',
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

  const selectWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const selectChevronStyle: React.CSSProperties = {
    position: 'absolute',
    right: MediasfuSpacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
    fontSize: 12,
  };

  const selectStyle = (state: { isHovered: boolean; isFocused: boolean }): React.CSSProperties => {
    const focusRing = isDarkMode ? 'rgba(59,130,246,0.35)' : 'rgba(59,130,246,0.45)';
    return {
      padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.lg}px ${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
      width: '100%',
      background: isDarkMode ? 'rgba(22,27,38,0.9)' : '#FFFFFF',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(17,24,39,0.12)'}`,
      borderRadius: MediasfuBorders.md,
      color: isDarkMode ? '#F9FAFB' : '#0F172A',
      fontSize: 14,
      outline: 'none',
      cursor: 'pointer',
      boxShadow: state.isFocused
        ? `0 0 0 3px ${focusRing}`
        : state.isHovered
          ? '0 10px 30px rgba(0,0,0,0.16)'
          : '0 2px 8px rgba(0,0,0,0.08)',
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
    };
  };

  const currentCoHostStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
    border: `1px solid ${isDarkMode ? MediasfuColors.primary : MediasfuColors.primaryDark}`,
    borderRadius: MediasfuBorders.md,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
  };

  const responsibilityRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    borderRadius: MediasfuBorders.md,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
  };

  const checkboxStyle = (isChecked: boolean): React.CSSProperties => ({
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isChecked
      ? MediasfuColors.brandGradient(isDarkMode)
      : 'transparent',
    border: `2px solid ${
      isChecked
        ? 'transparent'
        : isDarkMode
          ? 'rgba(255,255,255,0.3)'
          : 'rgba(0,0,0,0.3)'
    }`,
    borderRadius: 4,
    cursor: 'pointer',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  });

  const footerStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.md}px`,
    borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  // Build content components
  const headerContent = (
    <div style={headerStyle}>
      <h2 style={titleStyle}>
        <FontAwesomeIcon icon={faUserShield} />
        {title || 'Co-Host Settings'}
      </h2>
      <button style={closeButtonStyle} onClick={onCoHostClose}>
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
    </div>
  );

  const bodyContent = (
    <div style={contentStyle}>
      {/* Current Co-Host */}
      {currentCohost && (
        <div style={sectionStyle}>
          <label style={labelStyle}>Current Co-Host</label>
          <div style={currentCoHostStyle}>
            <FontAwesomeIcon icon={faUserShield} />
            {currentCohost}
          </div>
        </div>
      )}

      {/* Select Co-Host */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Select Co-Host</label>
        <div style={selectWrapperStyle}>
          <select
            value={selectedCoHost}
            onChange={(e) => setSelectedCoHost(e.target.value)}
            style={selectStyle({ isHovered: isSelectHovered, isFocused: isSelectFocused })}
            onMouseEnter={() => setIsSelectHovered(true)}
            onMouseLeave={() => setIsSelectHovered(false)}
            onFocus={() => setIsSelectFocused(true)}
            onBlur={() => setIsSelectFocused(false)}
            aria-label="Select co-host"
          >
            <option value="">Select a participant</option>
            {eligibleParticipants.map((p: Participant) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          <FontAwesomeIcon icon={faChevronDown} style={selectChevronStyle} />
        </div>
      </div>

      {/* Responsibilities */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Responsibilities</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: MediasfuSpacing.xs }}>
          {responsibilities.map((resp) => (
            <div key={resp.name} style={responsibilityRowStyle}>
              <span style={{ flex: 1, color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>
                {resp.name.charAt(0).toUpperCase() + resp.name.slice(1)}
              </span>
              <div style={{ display: 'flex', gap: MediasfuSpacing.md, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.xs }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                    Enabled
                  </span>
                  <div
                    style={checkboxStyle(resp.value)}
                    onClick={() => toggleResponsibility(resp.name, 'value')}
                  >
                    {resp.value && <FontAwesomeIcon icon={faCheck} size="xs" color="#FFFFFF" />}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.xs }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                    Dedicated
                  </span>
                  <div
                    style={{
                      ...checkboxStyle(resp.dedicated && resp.value),
                      opacity: resp.value ? 1 : 0.4,
                      cursor: resp.value ? 'pointer' : 'not-allowed',
                    }}
                    onClick={() => {
                      if (!resp.value) return;
                      toggleResponsibility(resp.name, 'dedicated');
                    }}
                    aria-disabled={!resp.value}
                  >
                    {resp.dedicated && <FontAwesomeIcon icon={faCheck} size="xs" color="#FFFFFF" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const footerContent = (
    <div style={footerStyle}>
      <PremiumButton
        variant="gradient"
        size="md"
        onPress={handleSave}
        isDarkMode={isDarkMode}
        fullWidth
      >
        <FontAwesomeIcon icon={faCheck} style={{ marginRight: MediasfuSpacing.sm }} />
        Save Changes
      </PremiumButton>
    </div>
  );

  // For sidebar/inline mode, render content directly without modal wrapper
  if (renderMode === 'sidebar' || renderMode === 'inline') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {headerContent}
        {bodyContent}
        {footerContent}
      </div>
    );
  }

  return (
    <>
      <div style={overlayStyle} onClick={onCoHostClose} />
      <GlassmorphicContainer
        isDarkMode={isDarkMode}
        borderRadius={MediasfuBorders.xl}
        blur={enableGlassmorphism ? 20 : 0}
        padding={0}
        elevation={4}
        style={{
          ...modalStyle,
          boxShadow: enableGlow
            ? `${MediasfuColors.elevation(4, isDarkMode)}, ${MediasfuColors.glowPrimary}`
            : MediasfuColors.elevation(4, isDarkMode),
        }}
      >
        {headerContent}
        {bodyContent}
        {footerContent}
      </GlassmorphicContainer>
    </>
  );
};

export default ModernCoHostModal;
