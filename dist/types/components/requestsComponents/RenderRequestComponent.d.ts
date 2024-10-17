import React from "react";
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
export type RenderRequestComponentType = (options: RenderRequestComponentOptions) => JSX.Element;
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
declare const RenderRequestComponent: React.FC<RenderRequestComponentOptions>;
export default RenderRequestComponent;
//# sourceMappingURL=RenderRequestComponent.d.ts.map