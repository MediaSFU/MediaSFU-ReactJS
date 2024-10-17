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
export type WaitingRoomModalType = (options: WaitingRoomModalOptions) => JSX.Element;
/**
 * A modal component for displaying a waiting room list with participants.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.isWaitingModalVisible - Flag to control the visibility of the modal.
 * @param {Function} props.onWaitingRoomClose - Callback function to handle closing the modal.
 * @param {number} props.waitingRoomCounter - Initial count of participants in the waiting room.
 * @param {Function} props.onWaitingRoomFilterChange - Callback function to handle changes in the search input.
 * @param {Array<WaitingRoomParticipant>} props.waitingRoomList - Initial list of participants in the waiting room.
 * @param {Function} props.updateWaitingList - Function to update the waiting list.
 * @param {string} props.roomName - Name of the room.
 * @param {Object} props.socket - Socket instance for real-time communication.
 * @param {Function} [props.onWaitingRoomItemPress=respondToWaiting] - Callback function to handle participant item press.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {Object} props.parameters - Additional parameters for the modal.
 *
 * @returns {JSX.Element} The rendered modal component.
 */
declare const WaitingRoomModal: React.FC<WaitingRoomModalOptions>;
export default WaitingRoomModal;
//# sourceMappingURL=WaitingModal.d.ts.map