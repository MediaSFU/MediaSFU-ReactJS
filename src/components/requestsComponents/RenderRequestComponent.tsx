import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faDesktop,
  faVideo,
  faComments,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Socket } from "socket.io-client";
import { Request, RespondToRequestsType } from "../../@types/types";
import { ModernTooltip } from "../../components_modern/core/widgets/ModernTooltip";

export interface RenderRequestComponentOptions {
  request: Request;
  onRequestItemPress: RespondToRequestsType;
  requestList: Request[];
  updateRequestList: (newRequestList: Request[]) => void;
  roomName: string;
  socket: Socket;
  /** Optional dark-mode toggle for theme-aware styling */
  isDarkMode?: boolean;
  /** Enable native title tooltips on controls */
  showTooltips?: boolean;
  /** Accent color used for the icon background */
  accentColor?: string;
}

export type RenderRequestComponentType = (
  options: RenderRequestComponentOptions
) => React.JSX.Element;

/**
 * RenderRequestComponent displays a request item with the request's name, icon, 
 * and action buttons for acceptance or rejection. It enables real-time 
 * updates for request actions, such as accepting or rejecting, 
 * through the socket instance.
 *
 * @component
 * @param {RenderRequestComponentOptions} props - Properties passed to the component.
 * @param {Request} props.request - The request object with request details.
 * @param {RespondToRequestsType} props.onRequestItemPress - Callback for request item actions.
 * @param {Array<Request>} props.requestList - Array of all request items.
 * @param {Function} props.updateRequestList - Updates the request list state.
 * @param {string} props.roomName - The name of the room where the request is made.
 * @param {Socket} props.socket - The socket instance for real-time communication.
 *
 * @returns {React.JSX.Element} The rendered request component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { io } from 'socket.io-client';
 * import { RenderRequestComponent } from 'mediasfu-reactjs';
 * 
 * const request = {
 *   id: "1",
 *   name: "Enable Microphone",
 *   icon: "fa-microphone",
 * };
 * 
 * const requestList = [
 *   request,
 *   { id: "2", name: "Enable Video", icon: "fa-video" }
 * ];
 * 
 * const socket = io("http://localhost:3000");
 * 
 * const handleRequestItemPress = ({ request, action }) => {
 *   console.log(`${action} request for ${request.name}`);
 * };
 * 
 * const updateRequestList = (newRequestList) => {
 *   console.log("Updated request list:", newRequestList);
 * };
 * 
 * <RenderRequestComponent
 *   request={request}
 *   onRequestItemPress={handleRequestItemPress}
 *   requestList={requestList}
 *   updateRequestList={updateRequestList}
 *   roomName="Room 1"
 *   socket={socket}
 * />
 * ```
 */

const RenderRequestComponent: React.FC<RenderRequestComponentOptions> = ({
  request,
  onRequestItemPress,
  requestList,
  updateRequestList,
  roomName,
  socket,
  isDarkMode = false,
  showTooltips = true,
  accentColor = "#6366F1",
}) => {
  const keyMap: { [key: string]: any } = {
    "fa-microphone": faMicrophone,
    "fa-desktop": faDesktop,
    "fa-video": faVideo,
    "fa-comments": faComments,
  };

  const resolvedIcon = keyMap[request.icon] || faComments;
  const backgroundColor = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.03)";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.08)";
  const textColor = isDarkMode ? "#F8FAFC" : "#0F172A";
  const subTextColor = isDarkMode ? "rgba(248,250,252,0.7)" : "rgba(15,23,42,0.7)";
  const iconBackground = isDarkMode ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.12)";
  const iconColor = isDarkMode ? "#E0E7FF" : "#4338CA";
  const resolvedAccent = accentColor ?? iconColor;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 12,
    background: backgroundColor,
    border: `1px solid ${borderColor}`,
    boxShadow: isDarkMode
      ? "0 6px 18px rgba(0,0,0,0.35)"
      : "0 6px 16px rgba(15,23,42,0.08)",
  };

  const iconWrapperStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    minWidth: 36,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: iconBackground,
    color: iconColor,
  };

  const nameStyle: React.CSSProperties = {
    color: textColor,
    fontWeight: 600,
    fontSize: 15,
    lineHeight: 1.3,
  };

  const metaStyle: React.CSSProperties = {
    color: subTextColor,
    fontSize: 12,
    marginTop: 2,
  };

  const actionWrapperStyle: React.CSSProperties = {
    display: "flex",
    gap: 8,
    marginLeft: "auto",
  };

  const actionButtonStyle = (isAccept: boolean): React.CSSProperties => ({
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    color: "#FFFFFF",
    background: isAccept
      ? "linear-gradient(135deg, #10B981, #059669)"
      : "linear-gradient(135deg, #F87171, #DC2626)",
    boxShadow: isAccept
      ? isDarkMode
        ? "0 8px 16px rgba(16,185,129,0.25)"
        : "0 8px 16px rgba(16,185,129,0.2)"
      : isDarkMode
      ? "0 8px 16px rgba(248,113,113,0.25)"
      : "0 8px 16px rgba(248,113,113,0.2)",
    transition: "transform 120ms ease, box-shadow 160ms ease",
  });

  const handleRequestAction = (action: "accepted" | "rejected") => {
    onRequestItemPress({
      request,
      updateRequestList,
      requestList,
      action,
      roomName,
      socket,
    });
  };
  const tooltipText = (action: "accepted" | "rejected") =>
    showTooltips ? `${action === "accepted" ? "Accept" : "Reject"} ${request.name ?? "request"}` : undefined;

  const iconTooltip = showTooltips ? (request.name ?? "Request") : undefined;

  return (
    <div key={request.id} style={containerStyle}>
      <ModernTooltip message={iconTooltip || ""} isDarkMode={isDarkMode}>
        <div style={iconWrapperStyle} aria-label={request.name}>
          <FontAwesomeIcon icon={resolvedIcon} size="lg" color={resolvedAccent || iconColor} />
        </div>
      </ModernTooltip>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={nameStyle}>{request.name}</span>
        <span style={metaStyle}>{request.icon?.replace(/^fa-/, "").replace(/-/g, " ") || "request"}</span>
      </div>
      <div style={actionWrapperStyle}>
        <ModernTooltip message={tooltipText("accepted") || ""} isDarkMode={isDarkMode}>
          <button
            onClick={() => handleRequestAction("accepted")}
            style={actionButtonStyle(true)}
            aria-label={tooltipText("accepted")}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </ModernTooltip>
        <ModernTooltip message={tooltipText("rejected") || ""} isDarkMode={isDarkMode}>
          <button
            onClick={() => handleRequestAction("rejected")}
            style={actionButtonStyle(false)}
            aria-label={tooltipText("rejected")}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </ModernTooltip>
      </div>
    </div>
  );
};

export default RenderRequestComponent;
