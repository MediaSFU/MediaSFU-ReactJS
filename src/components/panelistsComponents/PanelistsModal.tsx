import React, { useState, useMemo, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@fortawesome/free-solid-svg-icons";
import { Socket } from "socket.io-client";
import { Participant, ShowAlert } from "../../@types/types";
import {
  addPanelist,
  removePanelist,
} from "../../methods/panelistsMethods/updatePanelists";
import { focusPanelists } from "../../methods/panelistsMethods/focusPanelists";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PanelistsModalParameters {
  participants: Participant[];
  panelists: Participant[];
  member: string;
  islevel: string;
  socket: Socket;
  roomName: string;
  showAlert?: ShowAlert;
  itemPageLimit: number;
  panelistsFocused?: boolean;
  updatePanelists?: (panelists: Participant[]) => void;
  updatePanelistsFocused?: (focused: boolean) => void;
  getUpdatedAllParams: () => PanelistsModalParameters;
}

export interface PanelistsModalOptions {
  isPanelistsModalVisible: boolean;
  onPanelistsClose: () => void;
  parameters: PanelistsModalParameters;
  backgroundColor?: string;
  position?: string;
}

export type PanelistsModalType = (
  options: PanelistsModalOptions
) => React.JSX.Element;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * PanelistsModal - Modal for managing panelists.
 *
 * Features:
 * - Select up to itemPageLimit participants as panelists
 * - Focus mode: only show panelists on the grid
 * - Optional: mute all others' mic/camera when focusing
 *
 * @component
 */
const PanelistsModal: React.FC<PanelistsModalOptions> = ({
  isPanelistsModalVisible,
  onPanelistsClose,
  parameters,
  backgroundColor = "#1e293b",
  position = "topRight",
}) => {
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
    getUpdatedAllParams,
  } = parameters;

  // State
  const [searchFilter, setSearchFilter] = useState("");
  const [localPanelists, setLocalPanelists] = useState<Participant[]>(initialPanelists || []);
  const [isFocused, setIsFocused] = useState(initialFocused);
  const [muteOthersMic, setMuteOthersMic] = useState(false);
  const [muteOthersCamera, setMuteOthersCamera] = useState(false);

  // Participants state - refreshed when modal opens or parameters change
  const [participantsState, setParticipantsState] = useState<Participant[]>(initialParticipants || []);

  // Refresh participants when modal visibility or parameters change
  useEffect(() => {
    const freshParams = getUpdatedAllParams?.() || parameters;
    setParticipantsState(freshParams?.participants || []);
  }, [parameters, isPanelistsModalVisible]);

  // Use refreshed participants
  const participants = participantsState;

  // Non-panelist participants (available to add)
  const availableParticipants = useMemo(() => {
    const panelistIds = new Set(localPanelists.map((p) => p.id));
    return participants
      .filter((p) => !panelistIds.has(p.id) && p.islevel !== "2") // Exclude host and current panelists
      .filter((p) =>
        searchFilter
          ? p.name.toLowerCase().includes(searchFilter.toLowerCase())
          : true
      );
  }, [participants, localPanelists, searchFilter]);

  // Check if user is host
  const isHost = islevel === "2";

  // Handlers
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

  if (!isPanelistsModalVisible) return <></>;

  return (
    <>
      <div
        onClick={onPanelistsClose}
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
          background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <FontAwesomeIcon icon={faUserTie} style={{ color: "white", fontSize: 20 }} />
          <span style={{ color: "white", fontSize: 18, fontWeight: 600 }}>
            Panelists
          </span>
          <span
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: "2px 10px",
              borderRadius: 12,
              fontSize: 12,
              color: "white",
            }}
          >
            {localPanelists.length} / {itemPageLimit}
          </span>
        </div>
        <button
          onClick={onPanelistsClose}
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

      {/* Focus Controls */}
      {isHost && localPanelists.length > 0 && (
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(139,92,246,0.14)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FontAwesomeIcon
                icon={isFocused ? faEye : faEyeSlash}
                style={{ color: isFocused ? "#8b5cf6" : "rgba(255,255,255,0.7)" }}
              />
              <span style={{ color: "white", fontSize: 14, fontWeight: 500 }}>
                Focus on Panelists
              </span>
            </div>
            <button
              onClick={handleToggleFocus}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: isFocused
                  ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                  : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {isFocused ? "Disable Focus" : "Enable Focus"}
            </button>
          </div>

          {/* Mute Options (only show when not focused yet) */}
          {!isFocused && (
            <div
              style={{
                display: "flex",
                gap: 16,
                paddingTop: 8,
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#ffffff",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={muteOthersMic}
                  onChange={(e) => setMuteOthersMic(e.target.checked)}
                  style={{ cursor: "pointer", accentColor: "#8b5cf6" }}
                />
                <FontAwesomeIcon icon={muteOthersMic ? faMicrophoneSlash : faMicrophone} />
                Mute others&#39; mic
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#ffffff",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={muteOthersCamera}
                  onChange={(e) => setMuteOthersCamera(e.target.checked)}
                  style={{ cursor: "pointer", accentColor: "#8b5cf6" }}
                />
                <FontAwesomeIcon icon={muteOthersCamera ? faVideoSlash : faVideo} />
                Mute others&apos; camera
              </label>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {/* Current Panelists */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <FontAwesomeIcon icon={faStar} style={{ color: "#fbbf24" }} />
            <span style={{ color: "white", fontWeight: 600, fontSize: 14 }}>
              Current Panelists
            </span>
          </div>

          {localPanelists.length === 0 ? (
            <div
              style={{
                padding: 16,
                textAlign: "center",
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                backgroundColor: "rgba(255,255,255,0.03)",
                borderRadius: 8,
              }}
            >
              No panelists selected yet
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {localPanelists.map((panelist) => (
                <div
                  key={panelist.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    backgroundColor: "rgba(139,92,246,0.15)",
                    borderRadius: 8,
                    border: "1px solid rgba(139,92,246,0.3)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <FontAwesomeIcon icon={faStar} style={{ color: "#fbbf24", fontSize: 12 }} />
                    <span style={{ color: "white", fontSize: 14 }}>
                      {panelist.name}
                    </span>
                  </div>

                  {isHost && (
                    <button
                      onClick={() => handleRemovePanelist(panelist)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid rgba(239,68,68,0.4)",
                        backgroundColor: "rgba(239,68,68,0.15)",
                        color: "#f87171",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Panelists */}
        {isHost && localPanelists.length < itemPageLimit && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <FontAwesomeIcon icon={faUsers} style={{ color: "rgba(255,255,255,0.6)" }} />
              <span style={{ color: "white", fontWeight: 600, fontSize: 14 }}>
                Add Panelists
              </span>
            </div>

            {/* Search */}
            <div
              style={{
                position: "relative",
                marginBottom: 12,
              }}
            >
              <FontAwesomeIcon
                icon={faSearch}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 14,
                }}
              />
              <input
                type="text"
                placeholder="Search participants..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 36px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  color: "#ffffff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Available Participants */}
            {availableParticipants.length === 0 ? (
              <div
                style={{
                  padding: 16,
                  textAlign: "center",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 13,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: 8,
                }}
              >
                {searchFilter
                  ? "No matching participants"
                  : "No available participants to add"}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {availableParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      backgroundColor: "rgba(255,255,255,0.03)",
                      borderRadius: 8,
                      border: "1px solid transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: "white", fontSize: 14 }}>
                        {participant.name}
                      </span>
                      <span
                        style={{
                          backgroundColor:
                            participant.islevel === "1"
                              ? "rgba(59,130,246,0.2)"
                              : "rgba(107,114,128,0.2)",
                          color:
                            participant.islevel === "1" ? "#3b82f6" : "#9ca3af",
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontSize: 10,
                        }}
                      >
                        {participant.islevel === "1" ? "Elevated" : "Basic"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddPanelist(participant)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid rgba(139,92,246,0.4)",
                        backgroundColor: "rgba(139,92,246,0.15)",
                        color: "#a78bfa",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Limit reached message */}
        {isHost && localPanelists.length >= itemPageLimit && (
          <div
            style={{
              padding: 12,
              textAlign: "center",
              color: "#f59e0b",
              fontSize: 13,
              backgroundColor: "rgba(245,158,11,0.1)",
              borderRadius: 8,
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            Maximum panelist limit ({itemPageLimit}) reached. Remove a panelist to add more.
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default PanelistsModal;
export { PanelistsModal };
