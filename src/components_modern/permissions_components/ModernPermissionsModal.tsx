/**
 * Modern Permissions Modal with premium styling.
 *
 * A themed version of the classic PermissionsModal.
 * Keeps the same business logic and data flow, but uses modern
 * design tokens and glassmorphism like other components_modern modals.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUserShield,
  faUsers,
  faCog,
  faMicrophone,
  faVideo,
  faDesktop,
  faComment,
  faCheck,
  faBan,
  faClock,
  faChevronDown,
  faChevronUp,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

import type { Participant } from '../../@types/types';
import {
  updateParticipantPermission,
  bulkUpdateParticipantPermissions,
  type PermissionLevel,
} from '../../methods/permissionsMethods/updateParticipantPermission';
import {
  updatePermissionConfig,
  type PermissionConfig,
  getPermissionConfigFromEventSettings,
} from '../../methods/permissionsMethods/updatePermissionConfig';

import type { PermissionsModalOptions } from '../../components/permissionsComponents/PermissionsModal';
import type { ModalRenderMode } from '../../components/menuComponents/MenuModal';

import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';

export interface ModernPermissionsModalProps extends PermissionsModalOptions {
  isDarkMode?: boolean;
  enableGlassmorphism?: boolean;
  enableGlow?: boolean;
  renderMode?: ModalRenderMode;
}

export type ModernPermissionsModalType = (
  options: ModernPermissionsModalProps
) => React.JSX.Element;

const CapabilityIcon: React.FC<{ capability: string }> = ({ capability }) => {
  switch (capability) {
    case 'useMic':
      return <FontAwesomeIcon icon={faMicrophone} />;
    case 'useCamera':
      return <FontAwesomeIcon icon={faVideo} />;
    case 'useScreen':
      return <FontAwesomeIcon icon={faDesktop} />;
    case 'useChat':
      return <FontAwesomeIcon icon={faComment} />;
    default:
      return null;
  }
};

const CapabilityStatusIcon: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'allow':
      return <FontAwesomeIcon icon={faCheck} style={{ color: MediasfuColors.success }} />;
    case 'approval':
      return <FontAwesomeIcon icon={faClock} style={{ color: MediasfuColors.warning }} />;
    case 'disallow':
      return <FontAwesomeIcon icon={faBan} style={{ color: MediasfuColors.danger }} />;
    default:
      return null;
  }
};

const getLevelLabel = (level: string): string => {
  switch (level) {
    case '2':
      return 'Host';
    case '1':
      return 'Elevated';
    case '0':
      return 'Basic';
    default:
      return 'Unknown';
  }
};

const getLevelAccent = (level: string): string => {
  switch (level) {
    case '2':
      return MediasfuColors.success;
    case '1':
      return MediasfuColors.secondary;
    case '0':
      return MediasfuColors.textMutedDark;
    default:
      return MediasfuColors.textMutedDark;
  }
};

export const ModernPermissionsModal: React.FC<ModernPermissionsModalProps> = ({
  isPermissionsModalVisible,
  onPermissionsClose,
  parameters,
  position = 'topRight',
  // Theme
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isPermissionsModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    }
    setIsMounted(false);
  }, [isPermissionsModalVisible]);

  // Get fresh params on each render when modal is visible
  const getParams = () => parameters?.getUpdatedAllParams?.() || parameters;
  const params = getParams();

  const {
    participants: initialParticipants,
    member,
    islevel,
    socket,
    roomName,
    showAlert,
    permissionConfig: initialConfig,
    updatePermissionConfig: updateConfigCallback,
    // Event settings for initial values when permissionConfig is not set
    audioSetting,
    videoSetting,
    screenshareSetting,
    chatSetting,
  } = params || ({} as any);

  // Compute initial config: use permissionConfig if set, otherwise derive from event settings
  const computeInitialConfig = (): PermissionConfig => {
    if (initialConfig) return initialConfig;
    // If no permissionConfig, extract from event settings (same for level0 and level1)
    return getPermissionConfigFromEventSettings(
      audioSetting || 'approval',
      videoSetting || 'approval',
      screenshareSetting || 'disallow',
      chatSetting || 'allow'
    );
  };

  // State (same logic as classic)
  const [activeTab, setActiveTab] = useState<'config' | 'users'>('users');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
  const [expandedLevel, setExpandedLevel] = useState<'level0' | 'level1' | null>('level0');
  const [localConfig, setLocalConfig] = useState<PermissionConfig>(computeInitialConfig());
  const [participantsState, setParticipantsState] = useState<Participant[]>(initialParticipants || []);
  // Loading states
  const [isUpdatingConfig, setIsUpdatingConfig] = useState(false);
  const [isUpdatingParticipants, setIsUpdatingParticipants] = useState(false);
  const [updatingParticipantId, setUpdatingParticipantId] = useState<string | null>(null);

  // Keep localConfig in sync if permissionConfig is pushed externally, 
  // or if event settings change and no config is set
  useEffect(() => {
    if (initialConfig) {
      setLocalConfig(initialConfig);
    } else {
      // Derive from event settings if no permissionConfig
      setLocalConfig(getPermissionConfigFromEventSettings(
        audioSetting || 'approval',
        videoSetting || 'approval',
        screenshareSetting || 'disallow',
        chatSetting || 'allow'
      ));
    }
  }, [initialConfig, audioSetting, videoSetting, screenshareSetting, chatSetting]);

  // Refresh participants when modal becomes visible or parameters change
  useEffect(() => {
    const freshParams = parameters?.getUpdatedAllParams?.() || parameters;
    const newParticipants = freshParams?.participants || [];
    setParticipantsState(newParticipants);
  }, [parameters, isPermissionsModalVisible]);

  const participants: Participant[] = participantsState;

  const filteredParticipants = useMemo(() => {
    return participants
      .filter((p) => p.islevel !== '2')
      .filter((p) =>
        searchFilter ? p.name?.toLowerCase().includes(searchFilter.toLowerCase()) : true
      );
  }, [participants, searchFilter]);

  const participantsByLevel = useMemo(() => {
    const grouped: Record<string, Participant[]> = { '1': [], '0': [] };
    filteredParticipants.forEach((p) => {
      const level = p.islevel || '0';
      if (grouped[level]) grouped[level].push(p);
    });
    return grouped;
  }, [filteredParticipants]);

  const handleParticipantSelect = useCallback((participantId: string) => {
    setSelectedParticipants((prev) => {
      const next = new Set(prev);
      if (next.has(participantId)) next.delete(participantId);
      else next.add(participantId);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedParticipants.size === filteredParticipants.length) {
      setSelectedParticipants(new Set());
    } else {
      setSelectedParticipants(new Set(filteredParticipants.map((p) => p.id || '')));
    }
  }, [filteredParticipants, selectedParticipants.size]);

  const handleBulkUpdate = useCallback(
    async (newLevel: PermissionLevel) => {
      const selectedList = filteredParticipants.filter((p) => selectedParticipants.has(p.id || ''));
      if (selectedList.length === 0) {
        showAlert?.({ message: 'No participants selected', type: 'warning' });
        return;
      }

      setIsUpdatingParticipants(true);
      try {
        await bulkUpdateParticipantPermissions({
          socket,
          participants: selectedList,
          newLevel,
          member,
          islevel,
          roomName,
          showAlert,
        });
        setSelectedParticipants(new Set());
      } finally {
        setIsUpdatingParticipants(false);
      }
    },
    [filteredParticipants, selectedParticipants, socket, member, islevel, roomName, showAlert]
  );

  const handleSingleUpdate = useCallback(
    async (participant: Participant, newLevel: PermissionLevel) => {
      setUpdatingParticipantId(participant.id || null);
      try {
        await updateParticipantPermission({
          socket,
          participant,
          newLevel,
          member,
          islevel,
          roomName,
          showAlert,
        });
      } finally {
        setUpdatingParticipantId(null);
      }
    },
    [socket, member, islevel, roomName, showAlert]
  );

  const handleConfigChange = useCallback(
    (
      levelKey: 'level0' | 'level1',
      capability: 'useMic' | 'useCamera' | 'useScreen' | 'useChat',
      value: 'allow' | 'approval' | 'disallow'
    ) => {
      setLocalConfig((prev) => ({
        ...prev,
        [levelKey]: {
          ...prev[levelKey],
          [capability]: value,
        },
      }));
    },
    []
  );

  const handleSaveConfig = useCallback(async () => {
    setIsUpdatingConfig(true);
    try {
      await updatePermissionConfig({
        socket,
        config: localConfig,
        member,
        islevel,
        roomName,
        showAlert,
      });
      updateConfigCallback?.(localConfig);
    } finally {
      setIsUpdatingConfig(false);
    }
  }, [socket, localConfig, member, islevel, roomName, showAlert, updateConfigCallback]);

  const isHost = islevel === '2';

  // Render guards
  if (renderMode !== 'sidebar' && renderMode !== 'inline') {
    if (!isPermissionsModalVisible) return null;
  }

  // Position styles (match other modern modals)
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
    padding: `${MediasfuSpacing.md}px ${MediasfuSpacing.md}px`,
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
    color: isDarkMode ? MediasfuColors.textSecondaryDark : MediasfuColors.textSecondary,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  };

  const tabRowStyle: React.CSSProperties = {
    display: 'flex',
    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: active
      ? isDarkMode
        ? 'rgba(255,255,255,0.07)'
        : 'rgba(0,0,0,0.04)'
      : 'transparent',
    border: 'none',
    borderBottom: active ? `2px solid ${MediasfuColors.primary}` : '2px solid transparent',
    color: active
      ? isDarkMode
        ? MediasfuColors.textPrimaryDark
        : MediasfuColors.textPrimary
      : isDarkMode
        ? MediasfuColors.textSecondaryDark
        : MediasfuColors.textSecondary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: MediasfuSpacing.xs,
    fontSize: 14,
    fontWeight: 600,
  });

  const bodyStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: MediasfuSpacing.md,
    display: 'flex',
    flexDirection: 'column',
    gap: MediasfuSpacing.md,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    borderRadius: MediasfuBorders.md,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
    fontSize: 14,
    outline: 'none',
  };

  const pillStyle: React.CSSProperties = {
    background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    padding: `2px ${MediasfuSpacing.sm}px`,
    borderRadius: MediasfuBorders.full,
    fontSize: 12,
    fontWeight: 600,
    color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
  };

  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: MediasfuSpacing.sm,
    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    borderRadius: MediasfuBorders.md,
  };

  const listItemStyle = (selected: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.sm}px`,
    backgroundColor: selected
      ? MediasfuColors.hexToRgba(MediasfuColors.primary, isDarkMode ? 0.16 : 0.10)
      : isDarkMode
        ? 'rgba(255,255,255,0.03)'
        : 'rgba(0,0,0,0.02)',
    borderRadius: MediasfuBorders.md,
    border: selected
      ? `1px solid ${MediasfuColors.hexToRgba(MediasfuColors.primary, 0.35)}`
      : `1px solid ${MediasfuColors.hexToRgba(isDarkMode ? '#FFFFFF' : '#000000', 0.06)}`,
  });

  const selectStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
    borderRadius: MediasfuBorders.sm,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)'}`,
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
    color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
    fontSize: 12,
    cursor: 'pointer',
    outline: 'none',
  };

  const renderUsersTab = (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: MediasfuSpacing.sm }}>
        <input
          type="text"
          placeholder="Search participants..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          style={inputStyle}
        />

        {isHost && (
          <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm, flexWrap: 'wrap' }}>
            <PremiumButton
              size="sm"
              variant="glass"
              isDarkMode={isDarkMode}
              onPress={handleSelectAll}
            >
              {selectedParticipants.size === filteredParticipants.length ? 'Deselect All' : 'Select All'}
            </PremiumButton>

            {selectedParticipants.size > 0 && (
              <>
                <span style={{ ...MediasfuTypography.getBodySmall(isDarkMode), opacity: 0.8 }}>
                  {selectedParticipants.size} selected →
                </span>
                <PremiumButton
                  size="sm"
                  variant="gradient"
                  isDarkMode={isDarkMode}
                  onPress={() => handleBulkUpdate('1')}
                  disabled={isUpdatingParticipants}
                >
                  {isUpdatingParticipants ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    'Set Elevated'
                  )}
                </PremiumButton>
                <PremiumButton
                  size="sm"
                  variant="outlined"
                  isDarkMode={isDarkMode}
                  onPress={() => handleBulkUpdate('0')}
                  disabled={isUpdatingParticipants}
                >
                  {isUpdatingParticipants ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    'Set Basic'
                  )}
                </PremiumButton>
              </>
            )}
          </div>
        )}
      </div>

      {(['1', '0'] as const).map((level) => (
        <div key={level} style={{ display: 'flex', flexDirection: 'column', gap: MediasfuSpacing.sm }}>
          <div style={sectionHeaderStyle}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: MediasfuBorders.full,
                backgroundColor: getLevelAccent(level),
              }}
            />
            <span style={{ ...MediasfuTypography.getBodyMedium(isDarkMode), fontWeight: 700 }}>
              {getLevelLabel(level)}
            </span>
            <span style={pillStyle}>{participantsByLevel[level]?.length || 0}</span>
          </div>

          {participantsByLevel[level]?.length === 0 ? (
            <div
              style={{
                padding: MediasfuSpacing.md,
                textAlign: 'center',
                color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
                fontSize: 13,
              }}
            >
              No participants at this level
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: MediasfuSpacing.xs }}>
              {participantsByLevel[level]?.map((participant) => (
                <div
                  key={participant.id}
                  style={listItemStyle(selectedParticipants.has(participant.id || ''))}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm }}>
                    {isHost && (
                      <input
                        type="checkbox"
                        checked={selectedParticipants.has(participant.id || '')}
                        onChange={() => handleParticipantSelect(participant.id || '')}
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                    <span style={{ ...MediasfuTypography.getBodyMedium(isDarkMode) }}>
                      {participant.name}
                    </span>
                  </div>

                  {isHost && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.xs }}>
                      {updatingParticipantId === participant.id && (
                        <FontAwesomeIcon icon={faSpinner} spin style={{ color: MediasfuColors.primary }} />
                      )}
                      <select
                        value={participant.islevel || '0'}
                        onChange={(e) => handleSingleUpdate(participant, e.target.value as PermissionLevel)}
                        style={selectStyle}
                        disabled={updatingParticipantId === participant.id}
                      >
                        <option value="0">Basic</option>
                        <option value="1">Elevated</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );

  const renderConfigTab = (
    <>
      <div style={{ ...MediasfuTypography.getBodySmall(isDarkMode), opacity: 0.8 }}>
        Configure what each permission level can do. Host (level 2) always has full permissions.
      </div>

      {(['level0', 'level1'] as const).map((levelKey) => (
        <div
          key={levelKey}
          style={{
            border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
            borderRadius: MediasfuBorders.lg,
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setExpandedLevel(expandedLevel === levelKey ? null : levelKey)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: 'none',
              cursor: 'pointer',
              color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: MediasfuBorders.full,
                  backgroundColor: getLevelAccent(levelKey === 'level0' ? '0' : '1'),
                }}
              />
              <span style={{ ...MediasfuTypography.getBodyMedium(isDarkMode), fontWeight: 700 }}>
                {levelKey === 'level0' ? 'Basic (Level 0)' : 'Elevated (Level 1)'}
              </span>
            </div>
            <FontAwesomeIcon icon={expandedLevel === levelKey ? faChevronUp : faChevronDown} />
          </button>

          {expandedLevel === levelKey && (
            <div style={{ padding: MediasfuSpacing.md }}>
              {(['useMic', 'useCamera', 'useScreen', 'useChat'] as const).map((capability) => (
                <div
                  key={capability}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: `${MediasfuSpacing.sm}px 0`,
                    borderBottom: `1px solid ${MediasfuColors.hexToRgba(
                      isDarkMode ? '#FFFFFF' : '#000000',
                      0.06
                    )}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm }}>
                    <span style={{ opacity: 0.8, width: 20 }}>
                      <CapabilityIcon capability={capability} />
                    </span>
                    <span style={{ ...MediasfuTypography.getBodyMedium(isDarkMode) }}>
                      {capability === 'useMic'
                        ? 'Microphone'
                        : capability === 'useCamera'
                          ? 'Camera'
                          : capability === 'useScreen'
                            ? 'Screen Share'
                            : 'Chat'}
                    </span>
                  </div>

                  {isHost ? (
                    <select
                      value={localConfig[levelKey][capability]}
                      onChange={(e) =>
                        handleConfigChange(
                          levelKey,
                          capability,
                          e.target.value as 'allow' | 'approval' | 'disallow'
                        )
                      }
                      style={selectStyle}
                    >
                      <option value="allow">Allow</option>
                      {capability !== 'useChat' && <option value="approval">Approval</option>}
                      <option value="disallow">Disallow</option>
                    </select>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.xs }}>
                      <CapabilityStatusIcon status={localConfig[levelKey][capability]} />
                      <span
                        style={{
                          ...MediasfuTypography.getBodySmall(isDarkMode),
                          opacity: 0.85,
                          textTransform: 'capitalize',
                        }}
                      >
                        {localConfig[levelKey][capability]}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {isHost && (
        <PremiumButton
          fullWidth
          variant="gradient"
          isDarkMode={isDarkMode}
          onPress={handleSaveConfig}
          disabled={isUpdatingConfig}
        >
          {isUpdatingConfig ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: 8 }} />
              Saving...
            </>
          ) : (
            'Save Configuration'
          )}
        </PremiumButton>
      )}
    </>
  );

  const defaultHeader = (
    <div style={headerStyle}>
      <h2 style={titleStyle}>
        <FontAwesomeIcon icon={faUserShield} />
        Permissions
      </h2>
      <button style={closeButtonStyle} onClick={onPermissionsClose} aria-label="Close">
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
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
      <div
        style={{
          background: MediasfuColors.simpleBrandGradient(isDarkMode),
        }}
      >
        {defaultHeader}
      </div>

      <div style={tabRowStyle}>
        <button onClick={() => setActiveTab('users')} style={tabButtonStyle(activeTab === 'users')}>
          <FontAwesomeIcon icon={faUsers} />
          User Permissions
        </button>
        <button onClick={() => setActiveTab('config')} style={tabButtonStyle(activeTab === 'config')}>
          <FontAwesomeIcon icon={faCog} />
          Level Config
        </button>
      </div>

      <div style={bodyStyle}>{activeTab === 'users' ? renderUsersTab : renderConfigTab}</div>
    </GlassmorphicContainer>
  );

  if (renderMode === 'sidebar' || renderMode === 'inline') {
    return defaultContent;
  }

  return (
    <>
      <div style={overlayStyle} onClick={onPermissionsClose} />
      {defaultContent}
    </>
  );
};

export default ModernPermissionsModal;
