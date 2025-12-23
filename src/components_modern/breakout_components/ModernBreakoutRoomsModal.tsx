/**
 * Modern Breakout Rooms Modal with glassmorphic design.
 *
 * A premium-styled breakout rooms modal for managing breakout sessions,
 * featuring glassmorphic effects and smooth animations.
 * Uses the same BreakoutRoomsModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernBreakoutRoomsModal
 *   isVisible={showBreakout}
 *   onBreakoutRoomsClose={() => setShowBreakout(false)}
 *   parameters={parameters}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUsers,
  faPlus,
  faPlay,
  faStop,
  faRandom,
  faTrash,
  faSave,
  faPen,
  faUserPlus,
  faUserMinus,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import { BreakoutRoomsModalOptions } from '../../components/breakoutComponents/BreakoutRoomsModal';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import { BreakoutParticipant, Participant } from '../../@types/types';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';
import { ModernTooltip } from '../core/widgets/ModernTooltip';

export interface ModernBreakoutRoomsModalProps extends BreakoutRoomsModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Render mode for modal/sidebar/inline display */
  renderMode?: ModalRenderMode;
}

export type ModernBreakoutRoomsModalType = (
  options: ModernBreakoutRoomsModalProps
) => React.JSX.Element;

/**
 * ModernBreakoutRoomsModal displays breakout room management with premium styling.
 */
export const ModernBreakoutRoomsModal: React.FC<ModernBreakoutRoomsModalProps> = ({
  isVisible,
  onBreakoutRoomsClose,
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
  const [numRooms, setNumRooms] = useState(2);
  const [localRooms, setLocalRooms] = useState<BreakoutParticipant[][]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
  
  // Track initialization to prevent re-initialization on every render
  const isInitializedRef = useRef(false);
  const prevIsVisibleRef = useRef(isVisible);

  // Get params - use ref to keep stable reference
  const getParamsRef = useRef(() => parameters.getUpdatedAllParams());
  getParamsRef.current = () => parameters.getUpdatedAllParams();

  // Memoized current params for render - avoid calling getParams in render body
  const currentParams = useMemo(() => {
    // Only compute when visible to avoid unnecessary work
    if (!isVisible && renderMode !== 'sidebar' && renderMode !== 'inline') {
      return null;
    }
    return getParamsRef.current();
  }, [isVisible, renderMode]);

  // Initialize rooms when modal becomes visible OR when breakoutRooms change while visible
  useEffect(() => {
    const wasVisible = prevIsVisibleRef.current;
    prevIsVisibleRef.current = isVisible;
    
    const shouldInitialize = 
      // Modal just became visible
      (isVisible && !wasVisible) ||
      // Sidebar/inline mode - always keep in sync
      (renderMode === 'sidebar' || renderMode === 'inline');
    
    if (shouldInitialize) {
      const params = getParamsRef.current();
      const rooms = params.breakoutRooms || [];
      const filteredParticipants = (params.participants || [])
        .filter((p: Participant) => p.islevel !== '2')
        .map((p: Participant) => ({ ...p }));

      const hydratedRooms = rooms.map((room, roomIndex) =>
        room.map((p) => ({ name: p.name, breakRoom: roomIndex }))
      );

      const nameToRoom = new Map<string, number>();
      hydratedRooms.forEach((room, roomIndex) => {
        room.forEach((p) => nameToRoom.set(p.name, roomIndex));
      });

      const syncedParticipants = filteredParticipants.map((p) => ({
        ...p,
        breakRoom: nameToRoom.has(p.name) ? nameToRoom.get(p.name)! : null,
      }));

      if (JSON.stringify(hydratedRooms) !== JSON.stringify(localRooms)) {
        setLocalRooms(hydratedRooms.length > 0 ? hydratedRooms : []);
        setNumRooms(Math.max(hydratedRooms.length || 0, 2));
      }

      setParticipants(syncedParticipants);
      isInitializedRef.current = true;
    } else if (!isVisible && renderMode === 'modal') {
      isInitializedRef.current = false;
    }
  }, [isVisible, renderMode, currentParams?.breakoutRooms]);

  // Mount animation
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isVisible]);

  // Random assign
  const handleRandomAssign = useCallback(() => {
    const eligibleParticipants = participants.filter(
      (p: Participant) => p.islevel !== '2'
    );
    const rooms: BreakoutParticipant[][] = Array.from({ length: numRooms }, () => []);

    // Shuffle and distribute
    const shuffled = [...eligibleParticipants].sort(() => Math.random() - 0.5);
    shuffled.forEach((participant, index) => {
      const roomIndex = index % numRooms;
      rooms[roomIndex].push({
        name: participant.name,
        breakRoom: roomIndex,
      });
    });

    const nameToRoom = new Map<string, number>();
    rooms.forEach((room, roomIndex) => {
      room.forEach((p) => nameToRoom.set(p.name, roomIndex));
    });

    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        breakRoom: nameToRoom.has(p.name) ? nameToRoom.get(p.name)! : null,
      }))
    );
    setLocalRooms(rooms);
  }, [numRooms, participants]);

  // Add room
  const handleAddRoom = useCallback(() => {
    setLocalRooms((prev) => {
      const updated = [...prev, []];
      setNumRooms(updated.length);
      return updated;
    });
  }, []);

  // Delete room
  const handleDeleteRoom = useCallback((roomIndex: number) => {
    setLocalRooms((prev) => {
      const removedRoom = prev[roomIndex] || [];
      const updated = prev.filter((_, i) => i !== roomIndex);
      const reindexed = updated.map((room, idx) =>
        room.map((p) => ({ ...p, breakRoom: idx }))
      );
      setNumRooms(Math.max(reindexed.length, 1));

      setParticipants((prevParticipants) => {
        const removedNames = new Set(removedRoom.map((p) => p.name));
        const nameToRoom = new Map<string, number>();
        reindexed.forEach((room, idx) => {
          room.forEach((p) => nameToRoom.set(p.name, idx));
        });

        return prevParticipants.map((p) => {
          if (removedNames.has(p.name) && !nameToRoom.has(p.name)) {
            return { ...p, breakRoom: null };
          }
          if (nameToRoom.has(p.name)) {
            return { ...p, breakRoom: nameToRoom.get(p.name)! };
          }
          return p;
        });
      });

      return reindexed;
    });
  }, []);

  const handleEditRoom = useCallback((roomIndex: number) => {
    // Toggle: if already editing this room, close it; otherwise open it
    setEditingRoomIndex((prev) => (prev === roomIndex ? null : roomIndex));
  }, []);

  const handleAddParticipant = useCallback(
    (roomIndex: number, participant: Participant) => {
      const params = getParamsRef.current();
      const limit = params.itemPageLimit ?? Number.MAX_SAFE_INTEGER;

      setLocalRooms((prev) => {
        if ((prev[roomIndex]?.length ?? 0) >= limit) {
          params.showAlert?.({ message: 'Room is full', type: 'danger', duration: 3000 });
          return prev;
        }

        const updated = prev.map((room, idx) =>
          idx === roomIndex ? [...room, { name: participant.name, breakRoom: roomIndex }] : room
        );

        setParticipants((prevParticipants) =>
          prevParticipants.map((p) =>
            p.name === participant.name ? { ...p, breakRoom: roomIndex } : p
          )
        );

        return updated;
      });
    },
    []
  );

  const handleRemoveParticipant = useCallback(
    (roomIndex: number, participantName: string) => {
      setLocalRooms((prev) => {
        const updated = prev.map((room, idx) =>
          idx === roomIndex ? room.filter((p) => p.name !== participantName) : room
        );

        setParticipants((prevParticipants) =>
          prevParticipants.map((p) =>
            p.name === participantName ? { ...p, breakRoom: null } : p
          )
        );

        return updated;
      });
    },
    []
  );

  const validateRooms = useCallback(() => {
    const params = getParamsRef.current();
    const limit = params.itemPageLimit ?? Number.MAX_SAFE_INTEGER;

    if (localRooms.length === 0) {
      params.showAlert?.({ message: 'There must be at least one room', type: 'danger', duration: 3000 });
      return false;
    }

    for (const room of localRooms) {
      if (room.length === 0) {
        params.showAlert?.({ message: 'Rooms must not be empty', type: 'danger', duration: 3000 });
        return false;
      }

      const participantNames = room.map((p) => p.name);
      const uniqueNames = new Set(participantNames);
      if (participantNames.length !== uniqueNames.size) {
        params.showAlert?.({ message: 'Duplicate participant names in a room', type: 'danger', duration: 3000 });
        return false;
      }

      if (room.length > limit) {
        params.showAlert?.({ message: 'A room exceeds the participant limit', type: 'danger', duration: 3000 });
        return false;
      }
    }

    return true;
  }, [localRooms]);

  // Save rooms (does NOT close modal)
  const handleSave = useCallback(() => {
    const params = getParamsRef.current();
    if (validateRooms()) {
      params.updateBreakoutRooms(localRooms);
      params.updateCanStartBreakout(true);
      params.showAlert?.({ message: 'Rooms saved successfully', type: 'success', duration: 3000 });
    }
  }, [localRooms, validateRooms]);

  // Start breakout - matches original implementation
  const handleStart = useCallback(() => {
    const params = getParamsRef.current();
    
    // Check if screen sharing is active
    if (params.shareScreenStarted || params.shared) {
      params.showAlert?.({ message: 'You cannot start breakout rooms while screen sharing is active', type: 'danger', duration: 3000 });
      return;
    }

    // Check if we can start
    if (!params.canStartBreakout) {
      params.showAlert?.({ message: 'Please save rooms first', type: 'danger', duration: 3000 });
      return;
    }

    // Determine emit name based on current state
    const emitName = params.breakOutRoomStarted && !params.breakOutRoomEnded ? 'updateBreakout' : 'startBreakout';
    
    // Filter rooms to only include name and breakRoom
    const filteredBreakoutRooms = localRooms.map((room) =>
      room.map(({ name, breakRoom }) => ({ name, breakRoom }))
    );

    // Emit to socket with callback
    params.socket?.emit(
      emitName,
      { 
        breakoutRooms: filteredBreakoutRooms, 
        newParticipantAction: params.newParticipantAction || 'autoAssignNewRoom',
        roomName: params.roomName 
      },
      (response: { success: boolean; reason?: string }) => {
        if (response.success) {
          params.showAlert?.({ message: 'Breakout rooms active', type: 'success', duration: 3000 });
          params.updateBreakOutRoomStarted(true);
          params.updateBreakOutRoomEnded(false);
          if (params.meetingDisplayType !== 'all') {
            params.updateMeetingDisplayType('all');
          }
          onBreakoutRoomsClose();
        } else {
          params.showAlert?.({ message: response.reason || 'Failed to start breakout rooms', type: 'danger', duration: 3000 });
        }
      }
    );

    // Also emit to local socket if available
    if (params.localSocket?.id) {
      try {
        params.localSocket.emit(
          emitName,
          { 
            breakoutRooms: filteredBreakoutRooms, 
            newParticipantAction: params.newParticipantAction || 'autoAssignNewRoom',
            roomName: params.roomName 
          },
          () => { /* Response handled by main socket */ }
        );
      } catch {
        // Silently handle local socket errors
      }
    }
  }, [localRooms, onBreakoutRoomsClose]);

  // End breakout - matches original implementation
  const handleEnd = useCallback(() => {
    const params = getParamsRef.current();

    // Emit to socket with callback
    params.socket?.emit(
      'stopBreakout',
      { roomName: params.roomName },
      (response: { success: boolean; reason?: string }) => {
        if (response.success) {
          params.showAlert?.({ message: 'Breakout rooms stopped', type: 'success', duration: 3000 });
          params.updateBreakOutRoomStarted(false);
          params.updateBreakOutRoomEnded(true);
          if (params.meetingDisplayType !== params.prevMeetingDisplayType) {
            params.updateMeetingDisplayType(params.prevMeetingDisplayType || 'video');
          }
          onBreakoutRoomsClose();
        } else {
          params.showAlert?.({ message: response.reason || 'Failed to stop breakout rooms', type: 'danger', duration: 3000 });
        }
      }
    );

    if (params.localSocket?.id) {
      try {
        params.localSocket.emit(
          'stopBreakout',
          { roomName: params.roomName },
          () => { /* Response handled by main socket */ }
        );
      } catch {
        // Silently handle local socket errors
      }
    }
  }, [onBreakoutRoomsClose]);

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
    const isStarted = currentParams?.breakOutRoomStarted ?? false;

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

    const sidebarControlsStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: `${MediasfuSpacing.sm}px`,
      padding: `${MediasfuSpacing.md}px`,
      borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
      flexWrap: 'wrap',
    };

    const sidebarInputStyle: React.CSSProperties = {
      width: 60,
      padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
      background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
      borderRadius: MediasfuBorders.sm,
      color: isDarkMode ? '#FFFFFF' : '#1F2937',
      fontSize: 14,
      outline: 'none',
      textAlign: 'center',
    };

    const sidebarContentStyle: React.CSSProperties = {
      flex: 1,
      overflowY: 'auto',
      padding: `${MediasfuSpacing.md}px`,
      display: 'flex',
      flexDirection: 'column',
      gap: `${MediasfuSpacing.md}px`,
    };

    const sidebarRoomCardStyle: React.CSSProperties = {
      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderRadius: MediasfuBorders.md,
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      overflow: 'hidden',
    };

    const sidebarRoomHeaderStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
      background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
      borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
    };

    const sidebarRoomTitleStyle: React.CSSProperties = {
      ...MediasfuTypography.getLabelLarge(isDarkMode),
      display: 'flex',
      alignItems: 'center',
      gap: `${MediasfuSpacing.xs}px`,
    };

    const sidebarParticipantStyle: React.CSSProperties = {
      padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.md}px`,
      fontSize: 13,
      color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      gap: `${MediasfuSpacing.xs}px`,
    };

    const sidebarFooterStyle: React.CSSProperties = {
      display: 'flex',
      gap: `${MediasfuSpacing.sm}px`,
      padding: `${MediasfuSpacing.md}px`,
      borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={sidebarHeaderStyle}>
          <h2 style={sidebarTitleStyle}>
            <FontAwesomeIcon icon={faUsers} />
            {title || 'Breakout Rooms'}
          </h2>
          <button style={sidebarCloseButtonStyle} onClick={onBreakoutRoomsClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Controls */}
        <div style={sidebarControlsStyle}>
          <span style={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', fontSize: 13 }}>
            Number of rooms:
          </span>
          <ModernTooltip message="Set between 1 and 20 breakout rooms" position="top" isDarkMode={isDarkMode}>
            <input
              type="number"
              min={1}
              max={20}
              value={numRooms === 0 ? '' : numRooms}
              onChange={(e) => {
                const inputVal = e.target.value;
                if (inputVal === '') {
                  setNumRooms(0); // Allow empty field
                } else {
                  const val = parseInt(inputVal);
                  if (!isNaN(val) && val >= 0) {
                    setNumRooms(val);
                  }
                }
              }}
              onBlur={(e) => {
                // Clamp value on blur, default to 2 if empty
                const val = parseInt(e.target.value);
                if (isNaN(val) || val < 1) {
                  setNumRooms(2);
                } else {
                  setNumRooms(Math.min(20, val));
                }
              }}
              style={sidebarInputStyle}
              disabled={isStarted}
            />
          </ModernTooltip>
          <ModernTooltip message="Auto-distribute participants evenly" position="top" isDarkMode={isDarkMode}>
            <div>
              <PremiumButton
                variant="outlined"
                size="sm"
                onPress={handleRandomAssign}
                isDarkMode={isDarkMode}
                disabled={isStarted}
              >
                <FontAwesomeIcon icon={faRandom} />
              </PremiumButton>
            </div>
          </ModernTooltip>
          <ModernTooltip message="Add an empty breakout room" position="top" isDarkMode={isDarkMode}>
            <div>
              <PremiumButton
                variant="outlined"
                size="sm"
                onPress={handleAddRoom}
                isDarkMode={isDarkMode}
                disabled={isStarted}
              >
                <FontAwesomeIcon icon={faPlus} />
              </PremiumButton>
            </div>
          </ModernTooltip>
        </div>

        {/* Content */}
        <div style={sidebarContentStyle}>
          {localRooms.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}>
              No breakout rooms configured. Click Random Assign or Add Room to start.
            </div>
          ) : (
            localRooms.map((room, roomIndex) => (
              <div key={roomIndex}>
                <div style={sidebarRoomCardStyle}>
                  <div style={sidebarRoomHeaderStyle}>
                    <span style={sidebarRoomTitleStyle}>
                      <FontAwesomeIcon icon={faUsers} />
                      Room {roomIndex + 1}
                      <span style={{ opacity: 0.6, fontSize: 12 }}>
                        ({room.length} participants)
                      </span>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ModernTooltip message={editingRoomIndex === roomIndex ? "Close edit" : "Edit participants"} position="top" isDarkMode={isDarkMode}>
                        <button
                          style={{
                            background: editingRoomIndex === roomIndex
                              ? (isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)')
                              : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                            padding: 4,
                            borderRadius: 4,
                          }}
                          onClick={() => handleEditRoom(roomIndex)}
                        >
                          <FontAwesomeIcon icon={editingRoomIndex === roomIndex ? faTimes : faPen} />
                        </button>
                      </ModernTooltip>
                      <ModernTooltip message="Delete room" position="top" isDarkMode={isDarkMode}>
                        <button
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#EF4444',
                            padding: 4,
                          }}
                          onClick={() => handleDeleteRoom(roomIndex)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </ModernTooltip>
                    </div>
                  </div>
                  <div style={{ padding: `${MediasfuSpacing.sm}px 0` }}>
                    {room.length === 0 ? (
                      <div style={sidebarParticipantStyle}>
                        <span style={{ opacity: 0.5, fontStyle: 'italic' }}>No participants</span>
                      </div>
                    ) : (
                      room.map((participant, pIndex) => (
                        <div key={pIndex} style={sidebarParticipantStyle}>
                          • {participant.name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {/* Inline edit section */}
                {editingRoomIndex === roomIndex && (
                  <div
                    style={{
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderRadius: MediasfuBorders.md,
                      border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
                      padding: MediasfuSpacing.md,
                      marginBottom: MediasfuSpacing.sm,
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: MediasfuSpacing.sm }}>
                      <div>
                        <div style={{ ...MediasfuTypography.getLabelSmall(isDarkMode), marginBottom: MediasfuSpacing.xs, opacity: 0.7 }}>
                          Assigned
                        </div>
                        <div
                          style={{
                            border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
                            borderRadius: MediasfuBorders.sm,
                            maxHeight: 150,
                            overflowY: 'auto',
                          }}
                        >
                          {room.length === 0 ? (
                            <div style={{ padding: MediasfuSpacing.sm, opacity: 0.5, fontSize: 12, color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>No participants</div>
                          ) : (
                            room.map((participant) => (
                              <div
                                key={participant.name}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
                                  borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
                                  fontSize: 13,
                                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                                }}
                              >
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                  {participant.name}
                                </span>
                                <button
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#EF4444',
                                    padding: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                  onClick={() => handleRemoveParticipant(roomIndex, participant.name)}
                                >
                                  <FontAwesomeIcon icon={faUserMinus} size="sm" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      <div>
                        <div style={{ ...MediasfuTypography.getLabelSmall(isDarkMode), marginBottom: MediasfuSpacing.xs, opacity: 0.7 }}>
                          Unassigned
                        </div>
                        <div
                          style={{
                            border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
                            borderRadius: MediasfuBorders.sm,
                            maxHeight: 150,
                            overflowY: 'auto',
                          }}
                        >
                          {participants.filter((p) => p.breakRoom == null).length === 0 ? (
                            <div style={{ padding: MediasfuSpacing.sm, opacity: 0.5, fontSize: 12, color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>None available</div>
                          ) : (
                            participants
                              .filter((p) => p.breakRoom == null)
                              .map((participant) => (
                                <div
                                  key={participant.name}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
                                    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
                                    fontSize: 13,
                                    color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                                  }}
                                >
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                    {participant.name}
                                  </span>
                                  <button
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      cursor: 'pointer',
                                      color: '#10B981',
                                      padding: 2,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                    onClick={() => handleAddParticipant(roomIndex, participant)}
                                  >
                                    <FontAwesomeIcon icon={faUserPlus} size="sm" />
                                  </button>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={sidebarFooterStyle}>
          <ModernTooltip message={isStarted ? "Save and update rooms" : "Save the current room assignments"} position="top" isDarkMode={isDarkMode}>
            <div style={{ flex: 1 }}>
              <PremiumButton
                variant="outlined"
                size="md"
                onPress={handleSave}
                isDarkMode={isDarkMode}
                style={{ width: '100%' }}
              >
                <FontAwesomeIcon icon={faSave} style={{ marginRight: MediasfuSpacing.xs }} />
                Save
              </PremiumButton>
            </div>
          </ModernTooltip>
          {!isStarted ? (
            <ModernTooltip message="Start breakout rooms for participants" position="top" isDarkMode={isDarkMode}>
              <div style={{ flex: 1 }}>
                <PremiumButton
                  variant="gradient"
                  size="md"
                  onPress={handleStart}
                  isDarkMode={isDarkMode}
                  style={{ width: '100%' }}
                  disabled={localRooms.length === 0 || !localRooms.some((r) => r.length > 0)}
                >
                  <FontAwesomeIcon icon={faPlay} style={{ marginRight: MediasfuSpacing.xs }} />
                  Start
                </PremiumButton>
              </div>
            </ModernTooltip>
          ) : (
            <>
              <ModernTooltip message="Update breakout rooms with new assignments" position="top" isDarkMode={isDarkMode}>
                <div style={{ flex: 1 }}>
                  <PremiumButton
                    variant="gradient"
                    size="md"
                    onPress={handleStart}
                    isDarkMode={isDarkMode}
                    style={{ width: '100%' }}
                  >
                    <FontAwesomeIcon icon={faSyncAlt} style={{ marginRight: MediasfuSpacing.xs }} />
                    Update
                  </PremiumButton>
                </div>
              </ModernTooltip>
              <ModernTooltip message="End all breakout rooms and bring everyone back" position="top" isDarkMode={isDarkMode}>
                <div style={{ flex: 1 }}>
                  <PremiumButton
                    variant="filled"
                    size="md"
                    onPress={handleEnd}
                    isDarkMode={isDarkMode}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                    }}
                  >
                    <FontAwesomeIcon icon={faStop} style={{ marginRight: MediasfuSpacing.xs }} />
                    End
                  </PremiumButton>
                </div>
              </ModernTooltip>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  const isStarted = currentParams?.breakOutRoomStarted ?? false;

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
    width: 'min(500px, calc(100vw - 32px))',
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

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
    padding: `${MediasfuSpacing.md}px`,
    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    flexWrap: 'wrap',
  };

  const inputStyle: React.CSSProperties = {
    width: 60,
    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: MediasfuBorders.sm,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    fontSize: 14,
    outline: 'none',
    textAlign: 'center',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: `${MediasfuSpacing.md}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.md}px`,
  };

  const roomCardStyle: React.CSSProperties = {
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    borderRadius: MediasfuBorders.md,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
    overflow: 'hidden',
  };

  const roomHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
    borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  };

  const roomTitleStyle: React.CSSProperties = {
    ...MediasfuTypography.getLabelLarge(isDarkMode),
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.xs}px`,
  };

  const participantStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.md}px`,
    fontSize: 13,
    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.xs}px`,
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.sm}px`,
    padding: `${MediasfuSpacing.md}px`,
    borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  return (
    <>
      <div style={overlayStyle} onClick={onBreakoutRoomsClose} />
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
            <FontAwesomeIcon icon={faUsers} />
            {title || 'Breakout Rooms'}
          </h2>
          <button style={closeButtonStyle} onClick={onBreakoutRoomsClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Controls */}
        <div style={controlsStyle}>
          <span style={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', fontSize: 13 }}>
            Number of rooms:
          </span>
          <ModernTooltip message="Set between 1 and 20 breakout rooms" position="top" isDarkMode={isDarkMode}>
            <input
              type="number"
              min={1}
              max={20}
              value={numRooms === 0 ? '' : numRooms}
              onChange={(e) => {
                const inputVal = e.target.value;
                if (inputVal === '') {
                  setNumRooms(0); // Allow empty field
                } else {
                  const val = parseInt(inputVal);
                  if (!isNaN(val) && val >= 0) {
                    setNumRooms(val);
                  }
                }
              }}
              onBlur={(e) => {
                // Clamp value on blur, default to 2 if empty
                const val = parseInt(e.target.value);
                if (isNaN(val) || val < 1) {
                  setNumRooms(2);
                } else {
                  setNumRooms(Math.min(20, val));
                }
              }}
              style={inputStyle}
              disabled={isStarted}
            />
          </ModernTooltip>
          <ModernTooltip message="Auto-distribute participants evenly" position="top" isDarkMode={isDarkMode}>
            <div>
              <PremiumButton
                variant="outlined"
                size="sm"
                onPress={handleRandomAssign}
                isDarkMode={isDarkMode}
                disabled={isStarted}
              >
                <FontAwesomeIcon icon={faRandom} />
              </PremiumButton>
            </div>
          </ModernTooltip>
          <ModernTooltip message="Add an empty breakout room" position="top" isDarkMode={isDarkMode}>
            <div>
              <PremiumButton
                variant="outlined"
                size="sm"
                onPress={handleAddRoom}
                isDarkMode={isDarkMode}
                disabled={isStarted}
              >
                <FontAwesomeIcon icon={faPlus} />
              </PremiumButton>
            </div>
          </ModernTooltip>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {localRooms.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}>
              No breakout rooms configured. Click Random Assign or Add Room to start.
            </div>
          ) : (
            localRooms.map((room, roomIndex) => (
              <div key={roomIndex}>
                <div style={roomCardStyle}>
                  <div style={roomHeaderStyle}>
                    <span style={roomTitleStyle}>
                      <FontAwesomeIcon icon={faUsers} />
                      Room {roomIndex + 1}
                      <span style={{ opacity: 0.6, fontSize: 12 }}>
                        ({room.length} participants)
                      </span>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ModernTooltip message={editingRoomIndex === roomIndex ? "Close edit" : "Edit participants"} position="top" isDarkMode={isDarkMode}>
                        <button
                          style={{
                            background: editingRoomIndex === roomIndex
                              ? (isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)')
                              : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                            padding: 4,
                            borderRadius: 4,
                          }}
                          onClick={() => handleEditRoom(roomIndex)}
                        >
                          <FontAwesomeIcon icon={editingRoomIndex === roomIndex ? faTimes : faPen} />
                        </button>
                      </ModernTooltip>
                      <ModernTooltip message="Delete room" position="top" isDarkMode={isDarkMode}>
                        <button
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#EF4444',
                            padding: 4,
                          }}
                          onClick={() => handleDeleteRoom(roomIndex)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </ModernTooltip>
                    </div>
                  </div>
                  <div style={{ padding: `${MediasfuSpacing.sm}px 0` }}>
                    {room.length === 0 ? (
                      <div style={participantStyle}>
                        <span style={{ opacity: 0.5, fontStyle: 'italic' }}>No participants</span>
                      </div>
                    ) : (
                      room.map((participant, pIndex) => (
                        <div key={pIndex} style={participantStyle}>
                          • {participant.name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {/* Inline edit section */}
                {editingRoomIndex === roomIndex && (
                  <div
                    style={{
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderRadius: MediasfuBorders.md,
                      border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
                      padding: MediasfuSpacing.md,
                      marginBottom: MediasfuSpacing.sm,
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: MediasfuSpacing.md }}>
                      <div>
                        <div style={{ ...MediasfuTypography.getLabelSmall(isDarkMode), marginBottom: MediasfuSpacing.xs, opacity: 0.7 }}>
                          Assigned
                        </div>
                        <div
                          style={{
                            border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
                            borderRadius: MediasfuBorders.sm,
                            maxHeight: 180,
                            overflowY: 'auto',
                          }}
                        >
                          {room.length === 0 ? (
                            <div style={{ padding: MediasfuSpacing.sm, opacity: 0.5, fontSize: 13, color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>No participants</div>
                          ) : (
                            room.map((participant) => (
                              <div
                                key={participant.name}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
                                  borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
                                  fontSize: 13,
                                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                                }}
                              >
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                  {participant.name}
                                </span>
                                <button
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#EF4444',
                                    padding: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                  onClick={() => handleRemoveParticipant(roomIndex, participant.name)}
                                >
                                  <FontAwesomeIcon icon={faUserMinus} size="sm" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      <div>
                        <div style={{ ...MediasfuTypography.getLabelSmall(isDarkMode), marginBottom: MediasfuSpacing.xs, opacity: 0.7 }}>
                          Unassigned
                        </div>
                        <div
                          style={{
                            border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
                            borderRadius: MediasfuBorders.sm,
                            maxHeight: 180,
                            overflowY: 'auto',
                          }}
                        >
                          {participants.filter((p) => p.breakRoom == null).length === 0 ? (
                            <div style={{ padding: MediasfuSpacing.sm, opacity: 0.5, fontSize: 13, color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>None available</div>
                          ) : (
                            participants
                              .filter((p) => p.breakRoom == null)
                              .map((participant) => (
                                <div
                                  key={participant.name}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
                                    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
                                    fontSize: 13,
                                    color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                                  }}
                                >
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                    {participant.name}
                                  </span>
                                  <button
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      cursor: 'pointer',
                                      color: '#10B981',
                                      padding: 2,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                    onClick={() => handleAddParticipant(roomIndex, participant)}
                                  >
                                    <FontAwesomeIcon icon={faUserPlus} size="sm" />
                                  </button>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <ModernTooltip message={isStarted ? "Save and update rooms" : "Save the current room assignments"} position="top" isDarkMode={isDarkMode}>
            <div style={{ flex: 1 }}>
              <PremiumButton
                variant="outlined"
                size="md"
                onPress={handleSave}
                isDarkMode={isDarkMode}
                style={{ width: '100%' }}
              >
                <FontAwesomeIcon icon={faSave} style={{ marginRight: MediasfuSpacing.xs }} />
                Save
              </PremiumButton>
            </div>
          </ModernTooltip>
          {!isStarted ? (
            <ModernTooltip message="Start breakout rooms for participants" position="top" isDarkMode={isDarkMode}>
              <div style={{ flex: 1 }}>
                <PremiumButton
                  variant="gradient"
                  size="md"
                  onPress={handleStart}
                  isDarkMode={isDarkMode}
                  style={{ width: '100%' }}
                  disabled={localRooms.length === 0 || !localRooms.some((r) => r.length > 0)}
                >
                  <FontAwesomeIcon icon={faPlay} style={{ marginRight: MediasfuSpacing.xs }} />
                  Start
                </PremiumButton>
              </div>
            </ModernTooltip>
          ) : (
            <>
              <ModernTooltip message="Update breakout rooms with new assignments" position="top" isDarkMode={isDarkMode}>
                <div style={{ flex: 1 }}>
                  <PremiumButton
                    variant="gradient"
                    size="md"
                    onPress={handleStart}
                    isDarkMode={isDarkMode}
                    style={{ width: '100%' }}
                  >
                    <FontAwesomeIcon icon={faSyncAlt} style={{ marginRight: MediasfuSpacing.xs }} />
                    Update
                  </PremiumButton>
                </div>
              </ModernTooltip>
              <ModernTooltip message="End all breakout rooms and bring everyone back" position="top" isDarkMode={isDarkMode}>
                <div style={{ flex: 1 }}>
                  <PremiumButton
                    variant="filled"
                    size="md"
                    onPress={handleEnd}
                    isDarkMode={isDarkMode}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                    }}
                  >
                    <FontAwesomeIcon icon={faStop} style={{ marginRight: MediasfuSpacing.xs }} />
                    End
                  </PremiumButton>
                </div>
              </ModernTooltip>
            </>
          )}
        </div>
      </GlassmorphicContainer>
    </>
  );
};

export default ModernBreakoutRoomsModal;
