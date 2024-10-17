import React from "react";
import { ConfirmExitOptions } from "../../methods/exitMethods/confirmExit";
import { Socket } from "socket.io-client";
export interface ConfirmExitModalOptions {
    isConfirmExitModalVisible: boolean;
    onConfirmExitClose: () => void;
    position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft";
    backgroundColor?: string;
    exitEventOnConfirm?: (options: ConfirmExitOptions) => void;
    member: string;
    ban?: boolean;
    roomName: string;
    socket: Socket;
    islevel: string;
}
export type ConfirmExitModalType = (options: ConfirmExitModalOptions) => JSX.Element;
/**
 * ConfirmExitModal component renders a modal dialog to confirm the exit action.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.isConfirmExitModalVisible - Flag to control the visibility of the modal.
 * @param {function} props.onConfirmExitClose - Callback function to close the modal.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {function} [props.exitEventOnConfirm=confirmExit] - Event handler function to be called on confirming exit.
 * @param {string} props.member - Name of the member exiting.
 * @param {boolean} props.ban - Flag indicating if the member is banned.
 * @param {string} props.roomName - Name of the room.
 * @param {Object} props.socket - Socket object for communication.
 * @param {string} props.islevel - Level of the user.
 *
 * @returns {JSX.Element} The ConfirmExitModal component.
 */
declare const ConfirmExitModal: React.FC<ConfirmExitModalOptions>;
export default ConfirmExitModal;
//# sourceMappingURL=ConfirmExitModal.d.ts.map