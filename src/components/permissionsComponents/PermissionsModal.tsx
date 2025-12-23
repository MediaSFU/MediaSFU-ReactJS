import React, { useState, useMemo, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@fortawesome/free-solid-svg-icons";
import { Socket } from "socket.io-client";
import {
  Participant,
  ShowAlert,
} from "../../@types/types";
import {
  updateParticipantPermission,
  bulkUpdateParticipantPermissions,
  PermissionLevel,
} from "../../methods/permissionsMethods/updateParticipantPermission";
import {
  updatePermissionConfig,
  PermissionConfig,
  PermissionCapabilities,
  // getDefaultPermissionConfig,
  getPermissionConfigFromEventSettings,
} from "../../methods/permissionsMethods/updatePermissionConfig";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PermissionsModalParameters {
  participants: Participant[];
  member: string;
  islevel: string;
  socket: Socket;
  roomName: string;
  showAlert?: ShowAlert;
  permissionConfig?: PermissionConfig;
  updatePermissionConfig?: (config: PermissionConfig) => void;
  getUpdatedAllParams: () => PermissionsModalParameters;
  // Event settings for initial values when permissionConfig is not set
  audioSetting?: string;
  videoSetting?: string;
  screenshareSetting?: string;
  chatSetting?: string;
}

export interface PermissionsModalOptions {
  isPermissionsModalVisible: boolean;
  onPermissionsClose: () => void;
  parameters: PermissionsModalParameters;
  backgroundColor?: string;
  position?: string;
}

export type PermissionsModalType = (
  options: PermissionsModalOptions
) => React.JSX.Element;

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const CapabilityIcon: React.FC<{ capability: string }> = ({ capability }) => {
  switch (capability) {
    case "useMic":
      return <FontAwesomeIcon icon={faMicrophone} />;
    case "useCamera":
      return <FontAwesomeIcon icon={faVideo} />;
    case "useScreen":
      return <FontAwesomeIcon icon={faDesktop} />;
    case "useChat":
      return <FontAwesomeIcon icon={faComment} />;
    default:
      return null;
  }
};

const CapabilityStatusIcon: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case "allow":
      return <FontAwesomeIcon icon={faCheck} style={{ color: "#22c55e" }} />;
    case "approval":
      return <FontAwesomeIcon icon={faClock} style={{ color: "#f59e0b" }} />;
    case "disallow":
      return <FontAwesomeIcon icon={faBan} style={{ color: "#ef4444" }} />;
    default:
      return null;
  }
};

const getLevelLabel = (level: string): string => {
  switch (level) {
    case "2":
      return "Host";
    case "1":
      return "Elevated";
    case "0":
      return "Basic";
    default:
      return "Unknown";
  }
};

const getLevelColor = (level: string): string => {
  switch (level) {
    case "2":
      return "#22c55e"; // green
    case "1":
      return "#3b82f6"; // blue
    case "0":
      return "#6b7280"; // gray
    default:
      return "#6b7280";
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * PermissionsModal - Modal for managing participant permissions.
 *
 * Features two tabs:
 * 1. Permission Config - Configure what each permission level can do
 * 2. User Permissions - Update individual/bulk participant permission levels
 *
 * @component
 */
const PermissionsModal: React.FC<PermissionsModalOptions> = ({
  isPermissionsModalVisible,
  onPermissionsClose,
  parameters,
  backgroundColor = "#1e293b",
  position = "topRight",
}) => {
  const {
    participants: initialParticipants,
    member,
    islevel,
    socket,
    roomName,
    showAlert,
    permissionConfig: initialConfig,
    updatePermissionConfig: updateConfigCallback,
    getUpdatedAllParams,
    // Event settings for initial values when permissionConfig is not set
    audioSetting,
    videoSetting,
    screenshareSetting,
    chatSetting,
  } = parameters;

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

  // State
  const [activeTab, setActiveTab] = useState<"config" | "users">("users");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
  const [expandedLevel, setExpandedLevel] = useState<"level0" | "level1" | null>("level0");
  const [localConfig, setLocalConfig] = useState<PermissionConfig>(computeInitialConfig());

  // Participants state - refreshed when modal opens or parameters change
  const [participantsState, setParticipantsState] = useState<Participant[]>(initialParticipants || []);

  // Keep localConfig in sync if permissionConfig is pushed externally,
  // or if event settings change and no config is set
  useEffect(() => {
    if (initialConfig) {
      setLocalConfig(initialConfig);
    } else {
      setLocalConfig(getPermissionConfigFromEventSettings(
        audioSetting || 'approval',
        videoSetting || 'approval',
        screenshareSetting || 'disallow',
        chatSetting || 'allow'
      ));
    }
  }, [initialConfig, audioSetting, videoSetting, screenshareSetting, chatSetting]);

  // Refresh participants when modal visibility or parameters change
  useEffect(() => {
    const freshParams = getUpdatedAllParams?.() || parameters;
    setParticipantsState(freshParams?.participants || []);
  }, [parameters, isPermissionsModalVisible]);

  // Use refreshed participants
  const participants = participantsState;

  // Filter participants (exclude host)
  const filteredParticipants = useMemo(() => {
    return participants
      .filter((p) => p.islevel !== "2") // Exclude host
      .filter((p) =>
        searchFilter
          ? p.name.toLowerCase().includes(searchFilter.toLowerCase())
          : true
      );
  }, [participants, searchFilter]);

  // Group by level
  const participantsByLevel = useMemo(() => {
    const grouped: Record<string, Participant[]> = { "1": [], "0": [] };
    filteredParticipants.forEach((p) => {
      const level = p.islevel || "0";
      if (grouped[level]) {
        grouped[level].push(p);
      }
    });
    return grouped;
  }, [filteredParticipants]);

  // Handlers
  const handleParticipantSelect = useCallback((participantId: string) => {
    setSelectedParticipants((prev) => {
      const next = new Set(prev);
      if (next.has(participantId)) {
        next.delete(participantId);
      } else {
        next.add(participantId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedParticipants.size === filteredParticipants.length) {
      setSelectedParticipants(new Set());
    } else {
      setSelectedParticipants(new Set(filteredParticipants.map((p) => p.id || "")));
    }
  }, [filteredParticipants, selectedParticipants.size]);

  const handleBulkUpdate = useCallback(
    async (newLevel: PermissionLevel) => {
      const selectedList = filteredParticipants.filter((p) =>
        selectedParticipants.has(p.id || "")
      );
      if (selectedList.length === 0) {
        showAlert?.({
          message: "Please select participants to update",
          type: "danger",
          duration: 3000,
        });
        return;
      }

      await bulkUpdateParticipantPermissions({
        socket,
        participants: selectedList,
        newLevel,
        member,
        islevel,
        roomName,
        showAlert,
        maxBatchSize: 50,
      });

      setSelectedParticipants(new Set());
    },
    [filteredParticipants, selectedParticipants, socket, member, islevel, roomName, showAlert]
  );

  const handleSingleUpdate = useCallback(
    async (participant: Participant, newLevel: PermissionLevel) => {
      await updateParticipantPermission({
        socket,
        participant,
        newLevel,
        member,
        islevel,
        roomName,
        showAlert,
      });
    },
    [socket, member, islevel, roomName, showAlert]
  );

  const handleConfigChange = useCallback(
    (
      level: "level0" | "level1",
      capability: keyof PermissionCapabilities,
      value: "allow" | "approval" | "disallow"
    ) => {
      setLocalConfig((prev) => ({
        ...prev,
        [level]: {
          ...prev[level],
          [capability]: value,
        },
      }));
    },
    []
  );

  const handleSaveConfig = useCallback(async () => {
    await updatePermissionConfig({
      socket,
      config: localConfig,
      member,
      islevel,
      roomName,
      showAlert,
    });
    updateConfigCallback?.(localConfig);
  }, [socket, localConfig, member, islevel, roomName, showAlert, updateConfigCallback]);

  // Position styles
  const getPositionStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "fixed",
      zIndex: 1000,
    };

    switch (position) {
      case "topRight":
        return { ...baseStyle, top: 10, right: 10 };
      case "topLeft":
        return { ...baseStyle, top: 10, left: 10 };
      case "bottomRight":
        return { ...baseStyle, bottom: 10, right: 10 };
      case "bottomLeft":
        return { ...baseStyle, bottom: 10, left: 10 };
      case "center":
        return {
          ...baseStyle,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
      default:
        return { ...baseStyle, top: 10, right: 10 };
    }
  };

  if (!isPermissionsModalVisible) return <></>;

  // Check if user is host
  const isHost = islevel === "2";

  return (
    <>
      <div
        onClick={onPermissionsClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          zIndex: 999,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...getPositionStyle(),
          zIndex: 1000,
          width: Math.min(450, typeof window !== "undefined" ? window.innerWidth * 0.9 : 400),
          maxHeight: "85vh",
          backgroundColor,
          borderRadius: 16,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <FontAwesomeIcon icon={faUserShield} style={{ color: "white", fontSize: 20 }} />
          <span style={{ color: "white", fontSize: 18, fontWeight: 600 }}>
            Permissions
          </span>
        </div>
        <button
          onClick={onPermissionsClose}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: 8,
            padding: "8px 10px",
            cursor: "pointer",
            color: "white",
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <button
          onClick={() => setActiveTab("users")}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: activeTab === "users" ? "rgba(255,255,255,0.06)" : "transparent",
            border: "none",
            borderBottom: activeTab === "users" ? "2px solid #3b82f6" : "2px solid transparent",
            color: activeTab === "users" ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <FontAwesomeIcon icon={faUsers} />
          User Permissions
        </button>
        <button
          onClick={() => setActiveTab("config")}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: activeTab === "config" ? "rgba(255,255,255,0.06)" : "transparent",
            border: "none",
            borderBottom: activeTab === "config" ? "2px solid #3b82f6" : "2px solid transparent",
            color: activeTab === "config" ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <FontAwesomeIcon icon={faCog} />
          Level Config
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {activeTab === "users" ? (
          <>
            {/* Search & Bulk Actions */}
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Search participants..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  color: "#ffffff",
                  fontSize: 14,
                  marginBottom: 12,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              {isHost && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={handleSelectAll}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(255,255,255,0.2)",
                      backgroundColor: "rgba(0,0,0,0.3)",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {selectedParticipants.size === filteredParticipants.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>

                  {selectedParticipants.size > 0 && (
                    <>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                        {selectedParticipants.size} selected →
                      </span>
                      <button
                        onClick={() => handleBulkUpdate("1")}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "none",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Set Elevated
                      </button>
                      <button
                        onClick={() => handleBulkUpdate("0")}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "none",
                          backgroundColor: "#6b7280",
                          color: "white",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Set Basic
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Participants List by Level */}
            {(["1", "0"] as const).map((level) => (
              <div key={level} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                    padding: "8px 12px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: getLevelColor(level),
                    }}
                  />
                  <span style={{ color: "white", fontWeight: 500, fontSize: 14 }}>
                    {getLevelLabel(level)}
                  </span>
                  <span
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      padding: "2px 8px",
                      borderRadius: 10,
                      fontSize: 11,
                      color: "white",
                    }}
                  >
                    {participantsByLevel[level]?.length || 0}
                  </span>
                </div>

                {participantsByLevel[level]?.length === 0 ? (
                  <div
                    style={{
                      padding: 12,
                      textAlign: "center",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 13,
                    }}
                  >
                    No participants at this level
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {participantsByLevel[level]?.map((participant) => (
                      <div
                        key={participant.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          backgroundColor: selectedParticipants.has(participant.id || "")
                            ? "rgba(59,130,246,0.2)"
                            : "rgba(255,255,255,0.03)",
                          borderRadius: 8,
                          border: selectedParticipants.has(participant.id || "")
                            ? "1px solid rgba(59,130,246,0.5)"
                            : "1px solid transparent",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {isHost && (
                            <input
                              type="checkbox"
                              checked={selectedParticipants.has(participant.id || "")}
                              onChange={() => handleParticipantSelect(participant.id || "")}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          <span style={{ color: "white", fontSize: 14 }}>
                            {participant.name}
                          </span>
                        </div>

                        {isHost && (
                          <select
                            value={participant.islevel || "0"}
                            onChange={(e) =>
                              handleSingleUpdate(participant, e.target.value as PermissionLevel)
                            }
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid rgba(255,255,255,0.2)",
                              backgroundColor: "rgba(0,0,0,0.4)",
                              color: "#ffffff",
                              fontSize: 12,
                              cursor: "pointer",
                              outline: "none",
                            }}
                          >
                            <option value="0" style={{ backgroundColor: "#1e293b", color: "#ffffff" }}>
                              Basic
                            </option>
                            <option value="1" style={{ backgroundColor: "#1e293b", color: "#ffffff" }}>
                              Elevated
                            </option>
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          /* Config Tab */
          <>
            <div style={{ marginBottom: 12 }}>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  margin: 0,
                  marginBottom: 16,
                }}
              >
                Configure what each permission level can do. Host (level 2) always has full
                permissions.
              </p>
            </div>

            {(["level0", "level1"] as const).map((levelKey) => (
              <div
                key={levelKey}
                style={{
                  marginBottom: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() =>
                    setExpandedLevel(expandedLevel === levelKey ? null : levelKey)
                  }
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: getLevelColor(levelKey === "level0" ? "0" : "1"),
                      }}
                    />
                    <span style={{ fontWeight: 500 }}>
                      {levelKey === "level0" ? "Basic (Level 0)" : "Elevated (Level 1)"}
                    </span>
                  </div>
                  <FontAwesomeIcon
                    icon={expandedLevel === levelKey ? faChevronUp : faChevronDown}
                  />
                </button>

                {expandedLevel === levelKey && (
                  <div style={{ padding: 16 }}>
                    {(["useMic", "useCamera", "useScreen", "useChat"] as const).map(
                      (capability) => (
                        <div
                          key={capability}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 0",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center", gap: 10 }}
                          >
                            <span style={{ color: "rgba(255,255,255,0.6)", width: 20 }}>
                              <CapabilityIcon capability={capability} />
                            </span>
                            <span style={{ color: "white", fontSize: 14 }}>
                              {capability === "useMic"
                                ? "Microphone"
                                : capability === "useCamera"
                                ? "Camera"
                                : capability === "useScreen"
                                ? "Screen Share"
                                : "Chat"}
                            </span>
                          </div>

                          {isHost ? (
                            <select
                              value={localConfig[levelKey][capability]}
                              onChange={(e) =>
                                handleConfigChange(
                                  levelKey,
                                  capability,
                                  e.target.value as "allow" | "approval" | "disallow"
                                )
                              }
                              style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: "1px solid rgba(255,255,255,0.2)",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                color: "#ffffff",
                                fontSize: 12,
                                cursor: "pointer",
                                outline: "none",
                              }}
                            >
                              <option value="allow" style={{ backgroundColor: "#1e293b", color: "#ffffff" }}>
                                Allow
                              </option>
                              {capability !== "useChat" && (
                                <option value="approval" style={{ backgroundColor: "#1e293b", color: "#ffffff" }}>
                                  Approval
                                </option>
                              )}
                              <option value="disallow" style={{ backgroundColor: "#1e293b", color: "#ffffff" }}>
                                Disallow
                              </option>
                            </select>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <CapabilityStatusIcon
                                status={localConfig[levelKey][capability]}
                              />
                              <span
                                style={{
                                  color: "rgba(255,255,255,0.6)",
                                  fontSize: 12,
                                  textTransform: "capitalize",
                                }}
                              >
                                {localConfig[levelKey][capability]}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            {isHost && (
              <button
                onClick={handleSaveConfig}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  marginTop: 8,
                }}
              >
                Save Configuration
              </button>
            )}
          </>
        )}
      </div>
      </div>
    </>
  );
};

export default PermissionsModal;
export { PermissionsModal };
