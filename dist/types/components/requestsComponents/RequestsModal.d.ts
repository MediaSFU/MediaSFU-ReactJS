import React from "react";
import { RespondToRequestsType } from "../../methods/requestsMethods/respondToRequests";
import { Request } from "../../@types/types";
import { RenderRequestComponentOptions } from "./RenderRequestComponent";
import { Socket } from "socket.io-client";
export interface RequestsModalParameters {
    getUpdatedAllParams: () => {
        filteredRequestList: Request[];
    };
    [key: string]: any;
}
export interface RequestsModalOptions {
    isRequestsModalVisible: boolean;
    onRequestClose: () => void;
    requestCounter: number;
    onRequestFilterChange: (text: string) => void;
    onRequestItemPress?: RespondToRequestsType;
    requestList: Request[];
    updateRequestList: (newRequestList: Request[]) => void;
    roomName: string;
    socket: Socket;
    renderRequestComponent?: React.FC<RenderRequestComponentOptions>;
    backgroundColor?: string;
    position?: string;
    parameters: RequestsModalParameters;
}
export type RequestsModalType = (options: RequestsModalOptions) => JSX.Element;
/**
 * RequestsModal component displays a modal with a list of requests.
 *
 * @param {boolean} isRequestsModalVisible - Determines if the modal is visible.
 * @param {() => void} onRequestClose - Function to call when the modal is closed.
 * @param {number} requestCounter - Initial count of requests.
 * @param {(filter: string) => void} onRequestFilterChange - Function to call when the filter input changes.
 * @param {(request: Request) => void} [onRequestItemPress=respondToRequests] - Function to call when a request item is pressed.
 * @param {Request[]} requestList - Initial list of requests.
 * @param {(updatedList: Request[]) => void} updateRequestList - Function to update the request list.
 * @param {string} roomName - Name of the room.
 * @param {Socket} socket - Socket instance for real-time communication.
 * @param {React.ComponentType<RequestComponentProps>} [renderRequestComponent=RenderRequestComponent] - Component to render each request item.
 * @param {string} [backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {string} [position="topRight"] - Position of the modal on the screen.
 * @param {RequestsModalParameters} parameters - Additional parameters for the modal.
 *
 * @returns {JSX.Element} The rendered RequestsModal component.
 *
 * @example
 * ```tsx
 * import { RequestsModal, RenderRequestComponent } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * // Define request list and parameters
 * const requestList = [
 *   { id: "1", name: "Request 1", icon: "fa-microphone" },
 *   { id: "2", name: "Request 2", icon: "fa-desktop" },
 * ];
 * const socket = io("http://localhost:3000");
 *
 * const parameters = {
 *   getUpdatedAllParams: () => ({ filteredRequestList: requestList }),
 * };
 *
 * // Render the RequestsModal component
 * <RequestsModal
 *   isRequestsModalVisible={true}
 *   onRequestClose={() => console.log('Requests modal closed')}
 *   requestCounter={2}
 *   onRequestFilterChange={(text) => console.log('Filter changed to:', text)}
 *   requestList={requestList}
 *   updateRequestList={(newList) => console.log("Updated request list:", newList)}
 *   roomName="Room 1"
 *   socket={socket}
 *   renderRequestComponent={RenderRequestComponent}
 *   backgroundColor="#83c0e9"
 *   position="topRight"
 *   parameters={parameters}
 * />
 * ```
 */
declare const RequestsModal: React.FC<RequestsModalOptions>;
export default RequestsModal;
//# sourceMappingURL=RequestsModal.d.ts.map