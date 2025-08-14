import React from "react";
import { RespondToWaitingType } from "../../methods/waitingMethods/respondToWaiting";
import "./WaitingRoomModal.css";
import { WaitingRoomParticipant } from "../../@types/types";
import { Socket } from "socket.io-client";
export interface WaitingRoomModalParameters {
    filteredWaitingRoomList: WaitingRoomParticipant[];
    getUpdatedAllParams: () => WaitingRoomModalParameters;
    [key: string]: any;
}
export interface WaitingRoomModalOptions {
    isWaitingModalVisible: boolean;
    onWaitingRoomClose: () => void;
    waitingRoomCounter: number;
    onWaitingRoomFilterChange: (filter: string) => void;
    waitingRoomList: WaitingRoomParticipant[];
    updateWaitingList: (updatedList: WaitingRoomParticipant[]) => void;
    roomName: string;
    socket: Socket;
    position?: string;
    backgroundColor?: string;
    parameters: WaitingRoomModalParameters;
    onWaitingRoomItemPress?: RespondToWaitingType;
}
export type WaitingRoomModalType = (options: WaitingRoomModalOptions) => React.JSX.Element;
/**
 * WaitingRoomModal displays a modal interface for managing participants in a waiting room.
 * It allows for accepting or rejecting participants and filtering the list in real time.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.isWaitingModalVisible - Controls the visibility of the modal.
 * @param {Function} props.onWaitingRoomClose - Callback for closing the modal.
 * @param {number} props.waitingRoomCounter - Initial count of participants in the waiting room.
 * @param {Function} props.onWaitingRoomFilterChange - Handles changes in the search filter.
 * @param {Array<WaitingRoomParticipant>} props.waitingRoomList - List of waiting room participants.
 * @param {Function} props.updateWaitingList - Function to update the waiting room list.
 * @param {string} props.roomName - Name of the room.
 * @param {Socket} props.socket - Socket instance for real-time updates.
 * @param {Function} [props.onWaitingRoomItemPress=respondToWaiting] - Callback for handling participant item actions.
 * @param {string} [props.position="topRight"] - Sets the position of the modal on the screen.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {Object} props.parameters - Additional parameters for the modal.
 *
 * @returns {React.JSX.Element} The rendered waiting room modal component.
 *
 * @example
 * ```tsx
 * import { WaitingRoomModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * const waitingRoomList = [
 *   { id: "1", name: "John Doe" },
 *   { id: "2", name: "Jane Smith" },
 * ];
 *
 * const parameters = {
 *   filteredWaitingRoomList: waitingRoomList,
 *   getUpdatedAllParams: () => ({ filteredWaitingRoomList: waitingRoomList }),
 * };
 *
 * const socket = io("http://localhost:3000");
 *
 * // Render the WaitingRoomModal
 * <WaitingRoomModal
 *   isWaitingModalVisible={true}
 *   onWaitingRoomClose={() => console.log("Waiting room modal closed")}
 *   waitingRoomCounter={2}
 *   onWaitingRoomFilterChange={(text) => console.log("Filter changed to:", text)}
 *   waitingRoomList={waitingRoomList}
 *   updateWaitingList={(updatedList) => console.log("Updated waiting list:", updatedList)}
 *   roomName="Room 1"
 *   socket={socket}
 *   onWaitingRoomItemPress={(options) => console.log("Action taken on participant:", options)}
 *   position="topRight"
 *   backgroundColor="#83c0e9"
 *   parameters={parameters}
 * />
 * ```
 */
declare const WaitingRoomModal: React.FC<WaitingRoomModalOptions>;
export default WaitingRoomModal;
//# sourceMappingURL=WaitingModal.d.ts.map