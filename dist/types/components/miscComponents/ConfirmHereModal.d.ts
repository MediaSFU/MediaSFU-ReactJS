import React from "react";
import { Socket } from "socket.io-client";
export interface ConfirmHereModalOptions {
    isConfirmHereModalVisible: boolean;
    onConfirmHereClose: () => void;
    backgroundColor?: string;
    countdownDuration?: number;
    socket: Socket;
    roomName: string;
    member: string;
}
export type ConfirmHereModalType = (options: ConfirmHereModalOptions) => void;
/**
 * ConfirmHereModal component displays a modal asking the user to confirm their presence.
 *
 * @param {boolean} isConfirmHereModalVisible - Determines if the modal is visible.
 * @param {() => void} onConfirmHereClose - Function to call when the modal is closed.
 * @param {string} [backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {number} [countdownDuration=120] - Duration of the countdown in seconds.
 * @param {Socket} socket - Socket instance for communication.
 * @param {string} roomName - Name of the room for socket communication.
 * @param {Member} member - Member information for socket communication.
 *
 * @returns {JSX.Element} The rendered ConfirmHereModal component.
 */
declare const ConfirmHereModal: React.FC<ConfirmHereModalOptions>;
export default ConfirmHereModal;
//# sourceMappingURL=ConfirmHereModal.d.ts.map