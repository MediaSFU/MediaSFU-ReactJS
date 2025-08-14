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
export type RenderRequestComponentType = (options: RenderRequestComponentOptions) => React.JSX.Element;
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
declare const RenderRequestComponent: React.FC<RenderRequestComponentOptions>;
export default RenderRequestComponent;
//# sourceMappingURL=RenderRequestComponent.d.ts.map