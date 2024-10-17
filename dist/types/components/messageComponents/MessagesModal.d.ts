import React from "react";
import { SendMessageOptions } from "../../methods/messageMethods/sendMessage";
import { CoHostResponsibility, EventType, Message, Participant, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";
export interface MessagesModalOptions {
    isMessagesModalVisible: boolean;
    onMessagesClose: () => void;
    onSendMessagePress?: (options: SendMessageOptions) => Promise<void>;
    messages: Message[];
    position?: string;
    backgroundColor?: string;
    activeTabBackgroundColor?: string;
    eventType: EventType;
    member: string;
    islevel: string;
    coHostResponsibility: CoHostResponsibility[];
    coHost: string;
    startDirectMessage: boolean;
    directMessageDetails: Participant | null;
    updateStartDirectMessage: (start: boolean) => void;
    updateDirectMessageDetails: (participant: Participant | null) => void;
    showAlert?: ShowAlert;
    roomName: string;
    socket: Socket;
    chatSetting: string;
}
export type MessagesModalType = (options: MessagesModalOptions) => void;
/**
 * MessagesModal component displays a modal for direct and group messages.
 *
 * @param {boolean} isMessagesModalVisible - Determines if the modal is visible.
 * @param {() => void} onMessagesClose - Function to close the modal.
 * @param {Function} [onSendMessagePress=sendMessage] - Function to handle sending messages.
 * @param {Message[]} messages - Array of message objects.
 * @param {string} [position="topRight"] - Position of the modal on the screen.
 * @param {string} [backgroundColor="#f5f5f5"] - Background color of the modal.
 * @param {string} [activeTabBackgroundColor="#2b7ce5"] - Background color of the active tab.
 * @param {string} eventType - Type of the event (e.g., webinar, conference, broadcast, chat).
 * @param {string} member - Current member's username.
 * @param {string} islevel - Level of the user.
 * @param {Array} coHostResponsibility - Array of co-host responsibilities.
 * @param {string} coHost - Co-host's username.
 * @param {boolean} startDirectMessage - Flag to start a direct message.
 * @param {Object} directMessageDetails - Details of the direct message.
 * @param {Function} updateStartDirectMessage - Function to update the start direct message flag.
 * @param {Function} updateDirectMessageDetails - Function to update direct message details.
 * @param {Function} showAlert - Function to show alerts.
 * @param {string} roomName - Name of the chat room.
 * @param {Object} socket - Socket object for real-time communication.
 * @param {Object} chatSetting - Settings for the chat.
 *
 * @returns {JSX.Element} The rendered MessagesModal component.
 */
declare const MessagesModal: React.FC<MessagesModalOptions>;
export default MessagesModal;
//# sourceMappingURL=MessagesModal.d.ts.map