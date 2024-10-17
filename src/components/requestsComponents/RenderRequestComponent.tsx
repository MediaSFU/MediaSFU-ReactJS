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
) => JSX.Element;

/**
 * RenderRequestComponent is a React functional component that renders a request item.
 * It displays the request name, an icon, and buttons to accept or reject the request.
 *
 * @param {RenderRequestComponentOptions} props - The properties passed to the component.
 * @param {Request} props.request - The request object containing details of the request.
 * @param {Function} props.onRequestItemPress - Callback function to handle the action when a request item is pressed.
 * @param {Array<Request>} props.requestList - List of all requests.
 * @param {Function} props.updateRequestList - Function to update the request list.
 * @param {string} props.roomName - The name of the room.
 * @param {Socket} props.socket - The socket instance for real-time communication.
 *
 * @returns {JSX.Element} The rendered request component.
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
