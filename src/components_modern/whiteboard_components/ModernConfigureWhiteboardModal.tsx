/**
 * Modern Configure Whiteboard Modal with glassmorphic design.
 *
 * A premium-styled whiteboard configuration modal for managing whiteboard settings,
 * featuring glassmorphic effects and smooth animations.
 * Uses the same ConfigureWhiteboardModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernConfigureWhiteboardModal
 *   isVisible={showWhiteboard}
 *   onConfigureWhiteboardClose={() => setShowWhiteboard(false)}
 *   parameters={parameters}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faChalkboard,
  faPlay,
  faStop,
  faCheck,
  faUser,
  faSearch,
  faSyncAlt,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { Socket } from 'socket.io-client';
import { ConfigureWhiteboardModalOptions } from '../../components/whiteboardComponents/ConfigureWhiteboardModal';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import { Participant, WhiteboardUser, WhiteboardUpdatedData } from '../../@types/types';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';
import { ModernTooltip } from '../core/widgets/ModernTooltip';

export interface ModernConfigureWhiteboardModalProps extends ConfigureWhiteboardModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Render mode for modal/sidebar/inline display */
  renderMode?: ModalRenderMode;
}

export type ModernConfigureWhiteboardModalType = (
  options: ModernConfigureWhiteboardModalProps
) => React.JSX.Element;

/**
 * ModernConfigureWhiteboardModal displays whiteboard settings with premium styling.
 */
export const ModernConfigureWhiteboardModal: React.FC<ModernConfigureWhiteboardModalProps> = ({
  isVisible,
  onConfigureWhiteboardClose,
  parameters,
  position = 'topRight',
  title,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<WhiteboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const EMIT_TIMEOUT_MS = 45000; // 45 seconds timeout

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Derive params and helpers
  const getParams = useCallback(() => parameters.getUpdatedAllParams(), [parameters]);
  const showAlert = useMemo(() => getParams().showAlert, [getParams]);

  const whiteboardLimit = useMemo(() => {
    const params = getParams();
    return params.itemPageLimit ?? 10;
  }, [getParams, onConfigureWhiteboardClose, showAlert]);

  // Get eligible participants (non-host)
  const filteredParticipants = useMemo(() => {
    const params = getParams();
    const allParticipants = params.participants || [];
    const participants = allParticipants.filter(
      (p: Participant) => String(p.islevel) !== '2' // Exclude host
    );
    if (!searchText.trim()) return participants;
    return participants.filter(
      (p: Participant) => p.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [getParams, searchText]);

  // Reserve one slot for host; align with legacy limit semantics
  const otherParticipantLimit = useMemo(() => Math.max(0, whiteboardLimit - 1), [whiteboardLimit]);

  const limitRowStyle = useMemo<React.CSSProperties>(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: MediasfuSpacing.xs,
    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.md}px`,
    color: isDarkMode ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)',
    fontSize: 13,
    fontWeight: 500,
  }), [isDarkMode]);

  const limitBadgeStyle = useMemo<React.CSSProperties>(() => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 999,
    background: isDarkMode ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.12)',
    color: isDarkMode ? '#cbd5f5' : '#1e3a8a',
    border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  }), [isDarkMode]);

  // Mount animation
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isVisible]);

  // Sync selection ONLY when modal first opens (not on every param change)
  useEffect(() => {
    if (!isVisible) return;
    const params = getParams();
    const existing = (params.whiteboardUsers as WhiteboardUser[] | undefined) || [];
    if (existing.length) {
      setSelectedUsers(existing);
    } else {
      setSelectedUsers([]);
    }
  }, [isVisible]); // intentionally omit getParams to avoid re-sync on every render

  // Socket listener for whiteboard updates (parity with non-modern)
  useEffect(() => {
    const params = getParams();
    const socket = params.socket as Socket | undefined;
    const islevel = String(params.islevel ?? '1');
    const updateWhiteboardUsers = params.updateWhiteboardUsers;
    const updateWhiteboardStarted = params.updateWhiteboardStarted;
    const updateWhiteboardEnded = params.updateWhiteboardEnded;
    const onScreenChanges = params.onScreenChanges;
    const prepopulateUserMedia = params.prepopulateUserMedia;
    const rePort = params.rePort;
    const hostLabel = params.hostLabel ?? 'Host';

    if (!socket || !(socket instanceof Socket)) return;

    const handleWhiteboardUpdated = async (data: WhiteboardUpdatedData) => {
      // Update whiteboard users
      if (data.whiteboardUsers) {
        updateWhiteboardUsers?.(data.whiteboardUsers);
      }

      // Handle start/end status
      if (data.status === 'started') {
        updateWhiteboardStarted?.(true);
        updateWhiteboardEnded?.(false);

        if (islevel !== '2') {
          await onScreenChanges?.({ changed: true, parameters: params });
        }else{
          if (params.mainHeightWidth != 84) {
            params.updateMainHeightWidth(84);
            await onScreenChanges?.({ changed: true, parameters: params });
            await prepopulateUserMedia?.({ name: hostLabel, parameters: params });
          }
        }
      } else if (data.status === 'ended') {
        updateWhiteboardStarted?.(false);
        updateWhiteboardEnded?.(true);
       
        await onScreenChanges?.({ changed: true, parameters: params });
        await prepopulateUserMedia?.({ name: hostLabel, parameters: params });
        await rePort?.({ restart: true, parameters: params });
      }
    };

    socket.on('whiteboardUpdated', handleWhiteboardUpdated);

    return () => {
      socket.off('whiteboardUpdated', handleWhiteboardUpdated);
    };
  }, [getParams]);

  // Toggle user selection
  const toggleUser = useCallback((participant: Participant) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u.name === participant.name);
      if (exists) {
        return prev.filter((u) => u.name !== participant.name);
      }

      // Mirror legacy behavior: reserve a slot for host and cap "other" participants
      if (prev.length >= otherParticipantLimit) {
        showAlert?.({
          message: `Participant limit exceeded - you can only add ${otherParticipantLimit} other participants`,
          type: 'danger',
        });
        return prev;
      }

      return [...prev, { name: participant.name, useBoard: true }];
    });
  }, [otherParticipantLimit, showAlert]);

  const validateSelection = useCallback(() => {
    if (selectedUsers.length > whiteboardLimit) {
      showAlert?.({
        message: `Participant limit exceeded - you can only add ${whiteboardLimit} participants`,
        type: 'danger',
      });
      return false;
    }
    return true;
  }, [selectedUsers, whiteboardLimit, showAlert]);

  // Handle start/update whiteboard
  const handleStart = useCallback(() => {
    if (isLoading) return;
    const params = getParams();

    if ((params.shareScreenStarted || params.shared) && !params.whiteboardStarted) {
      showAlert?.({
        message: 'You cannot start whiteboard while screen sharing is active',
        type: 'danger',
      });
      return;
    }

    if (params.breakOutRoomStarted && !params.breakOutRoomEnded) {
      showAlert?.({
        message: 'You cannot start whiteboard while breakout rooms are active',
        type: 'danger',
      });
      return;
    }

    if (!validateSelection()) return;

    setIsLoading(true);
    
    // Set timeout to auto-reset loading state after 45s
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      showAlert?.({ message: 'Request timed out. Please try again.', type: 'danger' });
    }, EMIT_TIMEOUT_MS);

    const emitName = params.whiteboardStarted && !params.whiteboardEnded ? 'updateWhiteboard' : 'startWhiteboard';
    params.socket?.emit(
      emitName,
      { whiteboardUsers: selectedUsers, roomName: params.roomName },
      async (response: any) => {
        // Clear timeout on response
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        setIsLoading(false);

        if (response?.success) {
          showAlert?.({ message: 'Whiteboard active', type: 'success' });
          params.updateWhiteboardStarted(true);
          params.updateWhiteboardEnded(false);
          params.updateWhiteboardUsers(selectedUsers);
          params.updateCanStartWhiteboard?.(false);
          params.updateIsConfigureWhiteboardModalVisible?.(false);

          if (params.islevel !== '2') {
            params.shareScreenStarted = true;
            await params.onScreenChanges?.({ changed: true, parameters: params });
          } else {
            if (params.mainHeightWidth != 84) {
              params.updateMainHeightWidth(84);
              await params.onScreenChanges?.({ changed: true, parameters: params });
              await params.prepopulateUserMedia?.({ name: params.hostLabel, parameters: params });
            }
          }

          if (params.islevel === '2' && (params.recordStarted || params.recordResumed)) {
            if (!(params.recordPaused || params.recordStopped) && params.recordingMediaOptions === 'video') {
              await params.captureCanvasStream?.({ parameters: params });
            }
          }

          onConfigureWhiteboardClose();
        } else {
          showAlert?.({ message: response?.reason || 'Unable to start whiteboard', type: 'danger' });
        }
      }
    );
  }, [getParams, selectedUsers, validateSelection, showAlert, onConfigureWhiteboardClose, isLoading]);

  // Handle stop whiteboard
  const handleStop = useCallback(() => {
    if (isLoading) return;
    const params = getParams();
    
    setIsLoading(true);
    
    // Set timeout to auto-reset loading state after 45s
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      showAlert?.({ message: 'Request timed out. Please try again.', type: 'danger' });
    }, EMIT_TIMEOUT_MS);

    params.socket?.emit('stopWhiteboard', { roomName: params.roomName }, async (response: any) => {
      // Clear timeout on response
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setIsLoading(false);

      if (response?.success) {
        showAlert?.({ message: 'Whiteboard stopped', type: 'info' });
        params.updateWhiteboardStarted(false);
        params.updateWhiteboardEnded(true);
        params.updateWhiteboardUsers([]);
        params.updateCanStartWhiteboard?.(true);
        params.updateIsConfigureWhiteboardModalVisible?.(false);

        params.shareScreenStarted = false;
        await params.onScreenChanges?.({ changed: true, parameters: params });
        await params.prepopulateUserMedia?.({ name: params.hostLabel, parameters: params });
        await params.rePort?.({ restart: true, parameters: params });
        onConfigureWhiteboardClose();
      } else {
        showAlert?.({ message: response?.reason || 'Unable to stop whiteboard', type: 'danger' });
      }
    });
  }, [getParams, isLoading, showAlert, onConfigureWhiteboardClose]);

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
    const params = getParams();
    const isStarted = params.whiteboardStarted;

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

    const sidebarSearchContainerStyle: React.CSSProperties = {
      padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
      borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    };

    const sidebarSearchInputStyle: React.CSSProperties = {
      width: '100%',
      padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
      paddingLeft: 36,
      background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
      borderRadius: MediasfuBorders.md,
      color: isDarkMode ? '#FFFFFF' : '#1F2937',
      fontSize: 14,
      outline: 'none',
    };

    const sidebarContentStyle: React.CSSProperties = {
      flex: 1,
      overflowY: 'auto',
      padding: `${MediasfuSpacing.md}px`,
    };

    const sidebarParticipantStyle = (isSelected: boolean): React.CSSProperties => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
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
          ? MediasfuColors.primary
          : isDarkMode
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.08)'
      }`,
      borderRadius: MediasfuBorders.md,
      marginBottom: MediasfuSpacing.xs,
      cursor: 'pointer',
      opacity: 1,
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    });

    const sidebarCheckboxStyle = (isChecked: boolean): React.CSSProperties => ({
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
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    });

    const sidebarFooterStyle: React.CSSProperties = {
      display: 'flex',
      gap: `${MediasfuSpacing.sm}px`,
      padding: `${MediasfuSpacing.md}px`,
      borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    };

    const sidebarStatusStyle: React.CSSProperties = {
      padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
      background: isStarted
        ? 'rgba(16, 185, 129, 0.1)'
        : isDarkMode
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.02)',
      border: `1px solid ${isStarted ? 'rgba(16, 185, 129, 0.3)' : 'transparent'}`,
      borderRadius: MediasfuBorders.md,
      marginBottom: MediasfuSpacing.md,
      textAlign: 'center',
      color: isStarted ? '#10B981' : isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
      fontSize: 13,
      fontWeight: 500,
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={sidebarHeaderStyle}>
          <h2 style={sidebarTitleStyle}>
            <FontAwesomeIcon icon={faChalkboard} />
            {title || 'Whiteboard'}
          </h2>
          <button style={sidebarCloseButtonStyle} onClick={onConfigureWhiteboardClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div style={limitRowStyle}>
          <ModernTooltip
            message={`Add up to ${otherParticipantLimit} other participants; host can start alone.`}
            isDarkMode={isDarkMode}
            position="bottom"
          >
            <div style={limitBadgeStyle}>
              <FontAwesomeIcon icon={faUser} />
              <span>Limit {whiteboardLimit}</span>
            </div>
          </ModernTooltip>
        </div>

        {/* Search */}
        <div style={sidebarSearchContainerStyle}>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              }}
            />
            <input
              type="text"
              placeholder="Search participants..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={sidebarSearchInputStyle}
            />
          </div>
        </div>

        {/* Content */}
        <div style={sidebarContentStyle}>
          {/* Status */}
          <div style={sidebarStatusStyle}>
            {isStarted ? '✓ Whiteboard is active' : 'Select participants who can use the whiteboard'}
          </div>

          {/* Participant List */}
          {filteredParticipants.map((participant: Participant) => {
            const isSelected = selectedUsers.some((u) => u.name === participant.name);
            return (
              <div
                key={participant.id}
                style={sidebarParticipantStyle(isSelected)}
                onClick={() => toggleUser(participant)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm }}>
                  <FontAwesomeIcon
                    icon={faUser}
                    color={isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}
                  />
                  <span style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>
                    {participant.name}
                  </span>
                </div>
                <div style={sidebarCheckboxStyle(isSelected)}>
                  {isSelected && <FontAwesomeIcon icon={faCheck} size="xs" color="#FFFFFF" />}
                </div>
              </div>
            );
          })}

          {filteredParticipants.length === 0 && (
            <div style={{
              textAlign: 'center',
              color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              padding: MediasfuSpacing.xl,
            }}>
              {searchText.trim() 
                ? 'No participants match your search'
                : 'No other participants available. Whiteboard requires at least one other participant.'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={sidebarFooterStyle}>
          {!isStarted ? (
            <PremiumButton
              variant="gradient"
              size="md"
              onPress={handleStart}
              isDarkMode={isDarkMode}
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: MediasfuSpacing.xs }} />
              ) : (
                <FontAwesomeIcon icon={faPlay} style={{ marginRight: MediasfuSpacing.xs }} />
              )}
              {isLoading ? 'Starting...' : 'Start Whiteboard'}
            </PremiumButton>
          ) : (
            <>
              <PremiumButton
                variant="gradient"
                size="md"
                onPress={handleStart}
                isDarkMode={isDarkMode}
                style={{ flex: 1 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: MediasfuSpacing.xs }} />
                ) : (
                  <FontAwesomeIcon icon={faSyncAlt} style={{ marginRight: MediasfuSpacing.xs }} />
                )}
                {isLoading ? 'Updating...' : 'Update'}
              </PremiumButton>
              <PremiumButton
                variant="filled"
                size="md"
                onPress={handleStop}
                isDarkMode={isDarkMode}
                style={{ flex: 1, background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: MediasfuSpacing.xs }} />
                ) : (
                  <FontAwesomeIcon icon={faStop} style={{ marginRight: MediasfuSpacing.xs }} />
                )}
                {isLoading ? 'Stopping...' : 'Stop'}
              </PremiumButton>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  const params = getParams();
  const isStarted = params.whiteboardStarted;

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
    maxHeight: 'min(550px, calc(100vh - 100px))',
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

  const searchContainerStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    paddingLeft: 36,
    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: MediasfuBorders.md,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    fontSize: 14,
    outline: 'none',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: `${MediasfuSpacing.md}px`,
  };

  const participantStyle = (isSelected: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
        ? MediasfuColors.primary
        : isDarkMode
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(0,0,0,0.08)'
    }`,
    borderRadius: MediasfuBorders.md,
    marginBottom: MediasfuSpacing.xs,
    cursor: 'pointer',
    opacity: 1,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  });

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
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  });

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.sm}px`,
    padding: `${MediasfuSpacing.md}px`,
    borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  const statusStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isStarted
      ? 'rgba(16, 185, 129, 0.1)'
      : isDarkMode
        ? 'rgba(255,255,255,0.05)'
        : 'rgba(0,0,0,0.02)',
    border: `1px solid ${isStarted ? 'rgba(16, 185, 129, 0.3)' : 'transparent'}`,
    borderRadius: MediasfuBorders.md,
    marginBottom: MediasfuSpacing.md,
    textAlign: 'center',
    color: isStarted ? '#10B981' : isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    fontSize: 13,
    fontWeight: 500,
  };

  return (
    <>
      <div style={overlayStyle} onClick={onConfigureWhiteboardClose} />
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
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            <FontAwesomeIcon icon={faChalkboard} />
            {title || 'Whiteboard'}
          </h2>
          <button style={closeButtonStyle} onClick={onConfigureWhiteboardClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div style={limitRowStyle}>
          <ModernTooltip
            message={`Add up to ${otherParticipantLimit} other participants; host can start alone.`}
            isDarkMode={isDarkMode}
            position="bottom"
          >
            <div style={limitBadgeStyle}>
              <FontAwesomeIcon icon={faUser} />
              <span>Limit {whiteboardLimit}</span>
            </div>
          </ModernTooltip>
        </div>

        {/* Search */}
        <div style={searchContainerStyle}>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              }}
            />
            <input
              type="text"
              placeholder="Search participants..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={searchInputStyle}
              disabled={isStarted}
            />
          </div>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {/* Status */}
          <div style={statusStyle}>
            {isStarted ? '✓ Whiteboard is active' : 'Select participants who can use the whiteboard'}
          </div>

          {/* Participant List */}
          {filteredParticipants.map((participant: Participant) => {
            const isSelected = selectedUsers.some((u) => u.name === participant.name);
            return (
              <div
                key={participant.id}
                style={participantStyle(isSelected)}
                onClick={() => !isStarted && toggleUser(participant)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm }}>
                  <FontAwesomeIcon
                    icon={faUser}
                    color={isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}
                  />
                  <span style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>
                    {participant.name}
                  </span>
                </div>
                <div style={checkboxStyle(isSelected)}>
                  {isSelected && <FontAwesomeIcon icon={faCheck} size="xs" color="#FFFFFF" />}
                </div>
              </div>
            );
          })}

          {filteredParticipants.length === 0 && (
            <div style={{
              textAlign: 'center',
              color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              padding: MediasfuSpacing.xl,
            }}>
              {searchText.trim() 
                ? 'No participants match your search'
                : 'No other participants available. Whiteboard requires at least one other participant.'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          {!isStarted ? (
            <PremiumButton
              variant="gradient"
              size="md"
              onPress={handleStart}
              isDarkMode={isDarkMode}
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: MediasfuSpacing.xs }} />
              ) : (
                <FontAwesomeIcon icon={faPlay} style={{ marginRight: MediasfuSpacing.xs }} />
              )}
              {isLoading ? 'Starting...' : 'Start Whiteboard'}
            </PremiumButton>
          ) : (
            <>
              <PremiumButton
                variant="gradient"
                size="md"
                onPress={handleStart}
                isDarkMode={isDarkMode}
                style={{ flex: 1 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: MediasfuSpacing.xs }} />
                ) : (
                  <FontAwesomeIcon icon={faSyncAlt} style={{ marginRight: MediasfuSpacing.xs }} />
                )}
                {isLoading ? 'Updating...' : 'Update'}
              </PremiumButton>
              <PremiumButton
                variant="filled"
                size="md"
                onPress={handleStop}
                isDarkMode={isDarkMode}
                style={{ flex: 1, background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: MediasfuSpacing.xs }} />
                ) : (
                  <FontAwesomeIcon icon={faStop} style={{ marginRight: MediasfuSpacing.xs }} />
                )}
                {isLoading ? 'Stopping...' : 'Stop'}
              </PremiumButton>
            </>
          )}
        </div>
      </GlassmorphicContainer>
    </>
  );
};

export default ModernConfigureWhiteboardModal;
