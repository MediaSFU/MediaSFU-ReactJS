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
 * @param {MessagesModalOptions} props - The properties for MessagesModal component.
 * @param {boolean} props.isMessagesModalVisible - Determines if the modal is visible.
 * @param {() => void} props.onMessagesClose - Function to close the modal.
 * @param {(options: SendMessageOptions) => Promise<void>} [props.onSendMessagePress=sendMessage] - Function to handle sending messages.
 * @param {Message[]} props.messages - Array of message objects.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor="#f5f5f5"] - Background color of the modal.
 * @param {string} [props.activeTabBackgroundColor="#2b7ce5"] - Background color of the active tab.
 * @param {EventType} props.eventType - Type of the event (e.g., webinar, conference, broadcast, chat).
 * @param {string} props.member - Current member's username.
 * @param {string} props.islevel - Level of the user.
 * @param {CoHostResponsibility[]} props.coHostResponsibility - Array of co-host responsibilities.
 * @param {string} props.coHost - Co-host's username.
 * @param {boolean} props.startDirectMessage - Flag to start a direct message.
 * @param {Participant | null} props.directMessageDetails - Details of the direct message.
 * @param {(start: boolean) => void} props.updateStartDirectMessage - Function to update the start direct message flag.
 * @param {(participant: Participant | null) => void} props.updateDirectMessageDetails - Function to update direct message details.
 * @param {ShowAlert} [props.showAlert] - Function to show alerts.
 * @param {string} props.roomName - Name of the chat room.
 * @param {Socket} props.socket - Socket object for real-time communication.
 * @param {string} props.chatSetting - Settings for the chat.
 *
 * @returns {JSX.Element} The rendered MessagesModal component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MessagesModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * const messages = [
 *   { sender: "user1", receivers: ["user2"], message: "Hello, user2!", group: false },
 *   { sender: "user2", receivers: ["user1"], message: "Hi, user1!", group: false },
 * ];
 *
 * const App = () => {
 *   const socket = io("http://localhost:3000");
 *   const handleClose = () => console.log("Modal closed");
 *   const handleSendMessage = async (options) => console.log("Message sent", options);
 *   const handleAlert = (message, type) => console.log("Alert shown:", message, type);
 *
 *   return (
 *     <MessagesModal
 *       isMessagesModalVisible={true}
 *       onMessagesClose={handleClose}
 *       onSendMessagePress={handleSendMessage}
 *       messages={messages}
 *       position="topRight"
 *       backgroundColor="#f5f5f5"
 *       activeTabBackgroundColor="#2b7ce5"
 *       eventType="webinar"
 *       member="user1"
 *       islevel="1"
 *       coHostResponsibility={[{ name: "chat", value: true }, { name: "video", value: false }]}
 *       coHost="user2"
 *       startDirectMessage={true}
 *       directMessageDetails={{ username: "user2", name: "User 2" }}
 *       updateStartDirectMessage={(start) => console.log("Start direct message:", start)}
 *       updateDirectMessageDetails={(participant) => console.log("Direct message details:", participant)}
 *       showAlert={handleAlert}
 *       roomName="1234567890"
 *       socket={socket}
 *       chatSetting="public"
 *     />
 *   );
 * };
 *
 * export default App;
 * ```
 */
declare const MessagesModal: React.FC<MessagesModalOptions>;
export default MessagesModal;
//# sourceMappingURL=MessagesModal.d.ts.map