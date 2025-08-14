import React from "react";
import { Socket } from "socket.io-client";
export interface ConfirmHereModalOptions {
    isConfirmHereModalVisible: boolean;
    onConfirmHereClose: () => void;
    backgroundColor?: string;
    countdownDuration?: number;
    socket: Socket;
    localSocket?: Socket;
    roomName: string;
    member: string;
}
export type ConfirmHereModalType = (options: ConfirmHereModalOptions) => void;
/**
 * ConfirmHereModal component displays a modal asking the user to confirm their presence.
 *
 * @param {ConfirmHereModalOptions} props - The properties for ConfirmHereModal component.
 * @param {boolean} props.isConfirmHereModalVisible - Determines if the modal is visible.
 * @param {() => void} props.onConfirmHereClose - Function to close the modal.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {number} [props.countdownDuration=120] - Duration of the countdown in seconds.
 * @param {Socket} props.socket - Socket instance for communication.
 * @param {Socket} [props.localSocket] - Local socket instance for communication.
 * @param {string} props.roomName - Name of the room for socket communication.
 * @param {string} props.member - Member information for socket communication.
 *
 * @returns {React.JSX.Element} The rendered ConfirmHereModal component.
 *
 * @example
 * ```tsx
 * import React, { useState } from 'react';
 * import { ConfirmHereModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * const App = () => {
 *   const [isModalVisible, setIsModalVisible] = useState(true);
 *   const socket = io("http://localhost:3000");
 *   const localSocket = io("http://localhost:3001");
 *
 *   const handleCloseModal = () => setIsModalVisible(false);
 *
 *   return (
 *     <ConfirmHereModal
 *       isConfirmHereModalVisible={isModalVisible}
 *       onConfirmHereClose={handleCloseModal}
 *       backgroundColor="#83c0e9"
 *       countdownDuration={120}
 *       socket={socket}
 *       localSocket={socket}
 *       roomName="room1"
 *       member="user1"
 *     />
 *   );
 * };
 *
 * export default App;
 * ```
 */
declare const ConfirmHereModal: React.FC<ConfirmHereModalOptions>;
export default ConfirmHereModal;
//# sourceMappingURL=ConfirmHereModal.d.ts.map