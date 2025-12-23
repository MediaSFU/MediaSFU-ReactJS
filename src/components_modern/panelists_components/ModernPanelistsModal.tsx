/**
 * Modern Panelists Modal with premium styling.
 *
 * A themed version of the classic PanelistsModal.
 * Keeps the same business logic and data flow, but uses modern
 * design tokens and glassmorphism like other components_modern modals.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUserTie,
  faPlus,
  faMinus,
  faEye,
  faEyeSlash,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faSearch,
  faUsers,
  faStar,
} from '@fortawesome/free-solid-svg-icons';

import type { Participant } from '../../@types/types';
import {
  addPanelist,
  removePanelist,
} from '../../methods/panelistsMethods/updatePanelists';
import { focusPanelists } from '../../methods/panelistsMethods/focusPanelists';

import type { PanelistsModalOptions } from '../../components/panelistsComponents/PanelistsModal';
import type { ModalRenderMode } from '../../components/menuComponents/MenuModal';

import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';

export interface ModernPanelistsModalProps extends PanelistsModalOptions {
  isDarkMode?: boolean;
  enableGlassmorphism?: boolean;
  enableGlow?: boolean;
  renderMode?: ModalRenderMode;
}

export type ModernPanelistsModalType = (
  options: ModernPanelistsModalProps
) => React.JSX.Element;

export const ModernPanelistsModal: React.FC<ModernPanelistsModalProps> = ({
  isPanelistsModalVisible,
  onPanelistsClose,
  parameters,
  position = 'topRight',
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isPanelistsModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    }
    setIsMounted(false);
  }, [isPanelistsModalVisible]);

  // Get fresh params on each render when modal is visible
  const getParams = () => parameters?.getUpdatedAllParams?.() || parameters;
  const params = getParams();

  const {
    participants: initialParticipants,
    panelists: initialPanelists,
    member,
    islevel,
    socket,
    roomName,
    showAlert,
    itemPageLimit,
    panelistsFocused: initialFocused = false,
    updatePanelists: updatePanelistsCallback,
    updatePanelistsFocused: updateFocusedCallback,
  } = params || ({} as any);

  const [searchFilter, setSearchFilter] = useState('');
  const [localPanelists, setLocalPanelists] = useState<Participant[]>(initialPanelists || []);
  const [isFocused, setIsFocused] = useState<boolean>(initialFocused);
  const [muteOthersMic, setMuteOthersMic] = useState(false);
  const [muteOthersCamera, setMuteOthersCamera] = useState(false);
  const [participantsState, setParticipantsState] = useState<Participant[]>(initialParticipants || []);

  useEffect(() => {
    setLocalPanelists(initialPanelists || []);
  }, [initialPanelists]);

  // Only sync isFocused when modal becomes visible (to pick up external changes)
  // Don't sync on every initialFocused change to avoid resetting user's toggle action
  useEffect(() => {
    if (isPanelistsModalVisible) {
      setIsFocused(initialFocused);
    }

  }, [isPanelistsModalVisible]);

  // Refresh participants when modal becomes visible or parameters change
  useEffect(() => {
    const freshParams = parameters?.getUpdatedAllParams?.() || parameters;
    const newParticipants = freshParams?.participants || [];
    setParticipantsState(newParticipants);
  }, [parameters, isPanelistsModalVisible]);

  const participants: Participant[] = participantsState;

  const availableParticipants = useMemo(() => {
    const panelistIds = new Set(localPanelists.map((p) => p.id));
    return participants
      .filter((p) => !panelistIds.has(p.id) && p.islevel !== '2')
      .filter((p) =>
        searchFilter ? p.name?.toLowerCase().includes(searchFilter.toLowerCase()) : true
      );
  }, [participants, localPanelists, searchFilter]);

  const isHost = islevel === '2';

  const handleAddPanelist = useCallback(
    async (participant: Participant) => {
      const success = await addPanelist({
        socket,
        participant,
        currentPanelists: localPanelists,
        maxPanelists: itemPageLimit,
        roomName,
        member,
        islevel,
        showAlert,
      });

      if (success) {
        const newPanelists = [...localPanelists, participant];
        setLocalPanelists(newPanelists);
        updatePanelistsCallback?.(newPanelists);
      }
    },
    [socket, localPanelists, itemPageLimit, roomName, member, islevel, showAlert, updatePanelistsCallback]
  );

  const handleRemovePanelist = useCallback(
    async (participant: Participant) => {
      await removePanelist({
        socket,
        participant,
        roomName,
        member,
        islevel,
        showAlert,
      });

      const newPanelists = localPanelists.filter((p) => p.id !== participant.id);
      setLocalPanelists(newPanelists);
      updatePanelistsCallback?.(newPanelists);
    },
    [socket, localPanelists, roomName, member, islevel, showAlert, updatePanelistsCallback]
  );

  const handleToggleFocus = useCallback(async () => {
    const newFocused = !isFocused;

    await focusPanelists({
      socket,
      roomName,
      member,
      islevel,
      focusEnabled: newFocused,
      muteOthersMic: newFocused ? muteOthersMic : false,
      muteOthersCamera: newFocused ? muteOthersCamera : false,
      showAlert,
    });

    setIsFocused(newFocused);
    updateFocusedCallback?.(newFocused);
  }, [isFocused, socket, roomName, member, islevel, muteOthersMic, muteOthersCamera, showAlert, updateFocusedCallback]);

  if (renderMode !== 'sidebar' && renderMode !== 'inline') {
    if (!isPanelistsModalVisible) return null;
  }

  const getPositionStyles = (): React.CSSProperties => {
    const positions: Record<string, React.CSSProperties> = {
      topRight: { top: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      topLeft: { top: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      bottomRight: { bottom: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      bottomLeft: { bottom: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    };
    return positions[position] || positions.topRight;
  };

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

  const isSidebarMode = renderMode === 'sidebar' || renderMode === 'inline';

  const modalStyle: React.CSSProperties = isSidebarMode
    ? {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }
    : {
        position: 'fixed',
        ...getPositionStyles(),
        width: 'min(460px, calc(100vw - 32px))',
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

  const badgeStyle: React.CSSProperties = {
    background: MediasfuColors.brandGradient(isDarkMode),
    padding: `2px ${MediasfuSpacing.sm}px`,
    borderRadius: MediasfuBorders.full,
    fontSize: 12,
    fontWeight: 700,
    color: '#FFFFFF',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: MediasfuSpacing.xs,
    borderRadius: MediasfuBorders.sm,
    color: isDarkMode ? MediasfuColors.textSecondaryDark : MediasfuColors.textSecondary,
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

  const cardStyle: React.CSSProperties = {
    background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    borderRadius: MediasfuBorders.lg,
    padding: MediasfuSpacing.md,
  };

  const listItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    borderRadius: MediasfuBorders.md,
    border: `1px solid ${MediasfuColors.hexToRgba(isDarkMode ? '#FFFFFF' : '#000000', 0.06)}`,
  };

  const searchWrapStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: MediasfuSpacing.sm,
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    borderRadius: MediasfuBorders.md,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  };

  const searchInputStyle: React.CSSProperties = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
    fontSize: 14,
  };

  const focusHeader = (
    <div style={{ ...cardStyle, padding: MediasfuSpacing.sm }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: MediasfuSpacing.sm }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm }}>
          <FontAwesomeIcon
            icon={isFocused ? faEye : faEyeSlash}
            style={{ color: isFocused ? MediasfuColors.primary : (isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted) }}
          />
          <span style={{ ...MediasfuTypography.getBodyMedium(isDarkMode), fontWeight: 700 }}>
            Focus on Panelists
          </span>
        </div>

        <PremiumButton
          size="sm"
          variant={isFocused ? 'outlined' : 'gradient'}
          isDarkMode={isDarkMode}
          onPress={handleToggleFocus}
        >
          {isFocused ? 'Disable Focus' : 'Enable Focus'}
        </PremiumButton>
      </div>

      {!isFocused && (
        <div
          style={{
            marginTop: MediasfuSpacing.sm,
            paddingTop: MediasfuSpacing.sm,
            borderTop: `1px solid ${MediasfuColors.hexToRgba(isDarkMode ? '#FFFFFF' : '#000000', 0.06)}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: MediasfuSpacing.md,
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: MediasfuSpacing.sm,
              color: isDarkMode ? MediasfuColors.textSecondaryDark : MediasfuColors.textSecondary,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={muteOthersMic}
              onChange={(e) => setMuteOthersMic(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <FontAwesomeIcon icon={muteOthersMic ? faMicrophoneSlash : faMicrophone} />
            Mute others&#39; mic
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: MediasfuSpacing.sm,
              color: isDarkMode ? MediasfuColors.textSecondaryDark : MediasfuColors.textSecondary,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={muteOthersCamera}
              onChange={(e) => setMuteOthersCamera(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <FontAwesomeIcon icon={muteOthersCamera ? faVideoSlash : faVideo} />
            Mute others&#39; camera
          </label>
        </div>
      )}
    </div>
  );

  const defaultHeader = (
    <div style={headerStyle}>
      <h2 style={titleStyle}>
        <FontAwesomeIcon icon={faUserTie} />
        Panelists
        <span style={badgeStyle}>{localPanelists.length} / {itemPageLimit}</span>
      </h2>
      <button style={closeButtonStyle} onClick={onPanelistsClose} aria-label="Close">
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
    </div>
  );

  const defaultBody = (
    <div style={bodyStyle}>
      {isHost && localPanelists.length > 0 && focusHeader}

      {/* Current Panelists */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm, marginBottom: MediasfuSpacing.sm }}>
          <FontAwesomeIcon icon={faStar} style={{ color: MediasfuColors.warning }} />
          <span style={{ ...MediasfuTypography.getBodyMedium(isDarkMode), fontWeight: 800 }}>
            Current Panelists
          </span>
        </div>

        {localPanelists.length === 0 ? (
          <div
            style={{
              padding: MediasfuSpacing.md,
              textAlign: 'center',
              color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
              fontSize: 13,
            }}
          >
            No panelists selected yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: MediasfuSpacing.xs }}>
            {localPanelists.map((panelist) => (
              <div key={panelist.id} style={listItemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm }}>
                  <FontAwesomeIcon icon={faStar} style={{ color: MediasfuColors.warning, fontSize: 12 }} />
                  <span style={{ ...MediasfuTypography.getBodyMedium(isDarkMode) }}>
                    {panelist.name}
                  </span>
                </div>

                {isHost && (
                  <PremiumButton
                    size="sm"
                    variant="ghost"
                    isDarkMode={isDarkMode}
                    backgroundColor={MediasfuColors.danger}
                    textColor={MediasfuColors.danger}
                    onPress={() => handleRemovePanelist(panelist)}
                    icon={<FontAwesomeIcon icon={faMinus} />}
                  >
                    Remove
                  </PremiumButton>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Panelists */}
      {isHost && localPanelists.length < itemPageLimit && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm, marginBottom: MediasfuSpacing.sm }}>
            <FontAwesomeIcon icon={faUsers} style={{ color: isDarkMode ? MediasfuColors.textSecondaryDark : MediasfuColors.textSecondary }} />
            <span style={{ ...MediasfuTypography.getBodyMedium(isDarkMode), fontWeight: 800 }}>
              Add Panelists
            </span>
          </div>

          <div style={searchWrapStyle}>
            <FontAwesomeIcon
              icon={faSearch}
              style={{ color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted, fontSize: 14 }}
            />
            <input
              type="text"
              placeholder="Search participants..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={searchInputStyle}
            />
          </div>

          <div style={{ marginTop: MediasfuSpacing.sm }}>
            {availableParticipants.length === 0 ? (
              <div
                style={{
                  padding: MediasfuSpacing.md,
                  textAlign: 'center',
                  color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
                  fontSize: 13,
                }}
              >
                {searchFilter ? 'No matching participants' : 'No available participants to add'}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: MediasfuSpacing.xs,
                  maxHeight: 220,
                  overflowY: 'auto',
                  marginTop: MediasfuSpacing.sm,
                }}
              >
                {availableParticipants.map((participant) => (
                  <div key={participant.id} style={listItemStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm, flexWrap: 'wrap' }}>
                      <span style={{ ...MediasfuTypography.getBodyMedium(isDarkMode) }}>
                        {participant.name}
                      </span>
                      <span
                        style={{
                          backgroundColor: MediasfuColors.hexToRgba(
                            participant.islevel === '1' ? MediasfuColors.secondary : MediasfuColors.textMutedDark,
                            isDarkMode ? 0.18 : 0.12
                          ),
                          color: participant.islevel === '1' ? MediasfuColors.secondary : (isDarkMode ? MediasfuColors.textSecondaryDark : MediasfuColors.textSecondary),
                          padding: `2px ${MediasfuSpacing.xs}px`,
                          borderRadius: MediasfuBorders.sm,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {participant.islevel === '1' ? 'Elevated' : 'Basic'}
                      </span>
                    </div>

                    <PremiumButton
                      size="sm"
                      variant="ghost"
                      isDarkMode={isDarkMode}
                      backgroundColor={MediasfuColors.primary}
                      textColor={MediasfuColors.primary}
                      onPress={() => handleAddPanelist(participant)}
                      icon={<FontAwesomeIcon icon={faPlus} />}
                    >
                      Add
                    </PremiumButton>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isHost && localPanelists.length >= itemPageLimit && (
        <div
          style={{
            ...cardStyle,
            borderColor: MediasfuColors.hexToRgba(MediasfuColors.warning, 0.35),
            background: MediasfuColors.hexToRgba(MediasfuColors.warning, isDarkMode ? 0.10 : 0.12),
            color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
          }}
        >
          <div style={{ color: MediasfuColors.warningDark, fontWeight: 700, fontSize: 13, textAlign: 'center' }}>
            Maximum panelist limit ({itemPageLimit}) reached. Remove a panelist to add more.
          </div>
        </div>
      )}
    </div>
  );

  const defaultContent = (
    <GlassmorphicContainer
      isDarkMode={isDarkMode}
      borderRadius={isSidebarMode ? 0 : MediasfuBorders.xl}
      blur={enableGlassmorphism && !isSidebarMode ? 20 : 0}
      padding={0}
      elevation={isSidebarMode ? 0 : 4}
      style={{
        ...modalStyle,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
        boxShadow: isSidebarMode 
          ? 'none'
          : enableGlow
            ? `${MediasfuColors.elevation(4, isDarkMode)}, ${MediasfuColors.glowPrimary}`
            : MediasfuColors.elevation(4, isDarkMode),
      }}
    >
      <div style={{ background: MediasfuColors.accentGradient(isDarkMode) }}>
        {defaultHeader}
      </div>
      {defaultBody}
    </GlassmorphicContainer>
  );

  if (renderMode === 'sidebar' || renderMode === 'inline') {
    return defaultContent;
  }

  return (
    <>
      <div style={overlayStyle} onClick={onPanelistsClose} />
      {defaultContent}
    </>
  );
};

export default ModernPanelistsModal;
