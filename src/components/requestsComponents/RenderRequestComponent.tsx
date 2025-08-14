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

export interface RenderRequestComponentOptions {
  request: Request;
  onRequestItemPress: RespondToRequestsType;
  requestList: Request[];
  updateRequestList: (newRequestList: Request[]) => void;
  roomName: string;
  socket: Socket;
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
}) => {
  const keyMap: { [key: string]: any } = {
    "fa-microphone": faMicrophone,
    "fa-desktop": faDesktop,
    "fa-video": faVideo,
    "fa-comments": faComments,
  };

  const handleRequestAction = (action: string) => {
    onRequestItemPress({
      request,
      updateRequestList,
      requestList,
      action,
      roomName,
      socket,
    });
  };

  return (
    <div
      key={request.id}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        margin: "10px 0",
        paddingBottom: "5px",
      }}
    >
      <div style={{ flex: 5 }}>
        <span>{request.name}</span>
      </div>
      <div style={{ flex: 2, alignItems: "center" }}>
        <FontAwesomeIcon icon={keyMap[request.icon]} size="lg" color="black" />
      </div>
      <div style={{ flex: 2, alignItems: "center", paddingRight: "10px" }}>
        <button onClick={() => handleRequestAction("accepted")}>
          <FontAwesomeIcon icon={faCheck} size="lg" color="green" />
        </button>
      </div>
      <div style={{ flex: 2, alignItems: "center" }}>
        <button onClick={() => handleRequestAction("rejected")}>
          <FontAwesomeIcon icon={faTimes} size="lg" color="red" />
        </button>
      </div>
      <div style={{ flex: 1, marginBottom: "2px" }}></div>
    </div>
  );
};

export default RenderRequestComponent;
