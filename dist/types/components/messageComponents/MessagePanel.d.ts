import React from "react";
import { SendMessageOptions } from "../../methods/messageMethods/sendMessage";
import { CoHostResponsibility, EventType, Message, Participant, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";
export interface MessagePanelOptions {
    messages: Message[];
    messagesLength: number;
    type: "direct" | "group";
    username: string;
    onSendMessagePress: (options: SendMessageOptions) => Promise<void>;
    backgroundColor?: string;
    focusedInput: boolean;
    showAlert?: ShowAlert;
    eventType: EventType;
    member: string;
    islevel: string;
    startDirectMessage: boolean;
    updateStartDirectMessage: (start: boolean) => void;
    directMessageDetails: Participant | null;
    updateDirectMessageDetails: (participant: Participant | null) => void;
    coHostResponsibility: CoHostResponsibility[];
    coHost: string;
    roomName: string;
    socket: Socket;
    chatSetting: string;
}
export type MessagePanelType = (options: MessagePanelOptions) => React.JSX.Element;
/**
 * MessagePanel component renders a panel for displaying and sending messages.
 *
 * @component
 * @param {MessagePanelOptions} props - The properties for the MessagePanel component.
 * @param {Message[]} props.messages - The list of messages to display.
 * @param {number} props.messagesLength - The total number of messages.
 * @param {"direct" | "group"} props.type - The type of message panel, either "direct" or "group".
 * @param {string} props.username - The username of the current user.
 * @param {(options: SendMessageOptions) => Promise<void>} props.onSendMessagePress - Function to call when the send button is pressed.
 * @param {string} [props.backgroundColor="#f5f5f5"] - Background color of the message panel.
 * @param {boolean} props.focusedInput - Whether the input is focused.
 * @param {ShowAlert} [props.showAlert] - Function to show an alert message.
 * @param {EventType} props.eventType - The type of event.
 * @param {string} props.member - The member associated with the messages.
 * @param {string} props.islevel - The level of the user.
 * @param {boolean} props.startDirectMessage - Determines if a direct message should be started.
 * @param {(start: boolean) => void} props.updateStartDirectMessage - Function to update the start direct message state.
 * @param {Participant | null} props.directMessageDetails - Details of the participant for direct messages.
 * @param {(participant: Participant | null) => void} props.updateDirectMessageDetails - Function to update direct message details.
 * @param {CoHostResponsibility[]} props.coHostResponsibility - Array of co-host responsibilities.
 * @param {string} props.coHost - The co-host's name.
 * @param {string} props.roomName - The name of the room.
 * @param {Socket} props.socket - The socket for real-time communication.
 * @param {string} props.chatSetting - Chat settings for the message panel.
 *
 * @returns {React.JSX.Element} The rendered MessagePanel component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MessagePanel } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * const messages = [
 *   { message: "Hello, how are you?", sender: "user1", receivers: ["user2"], timestamp: "12:00 PM", group: false },
 *   { message: "I'm good, thank you!", sender: "user2", receivers: ["user1"], timestamp: "12:01 PM", group: false },
 * ];
 *
 * const App = () => {
 *   const socket = io("http://localhost:3000");
 *   const handleSendMessage = async (options) => console.log("Message sent", options);
 *   const handleShowAlert = (options) => console.log("Alert", options);
 *
 *   return (
 *     <MessagePanel
 *       messages={messages}
 *       messagesLength={messages.length}
 *       type="direct"
 *       username="user1"
 *       onSendMessagePress={handleSendMessage}
 *       backgroundColor="#f5f5f5"
 *       focusedInput={true}
 *       showAlert={handleShowAlert}
 *       eventType="chat"
 *       member="user2"
 *       islevel="2"
 *       startDirectMessage={true}
 *       updateStartDirectMessage={(start) => console.log("Start direct message:", start)}
 *       directMessageDetails={{ name: "user2" }}
 *       updateDirectMessageDetails={(participant) => console.log("Direct message details updated:", participant)}
 *       coHostResponsibility={[]}
 *       coHost="user1"
 *       roomName="room1"
 *       socket={socket}
 *       chatSetting="chat"
 *     />
 *   );
 * };
 *
 * export default App;
 * ```
 */
declare const MessagePanel: React.FC<MessagePanelOptions>;
export default MessagePanel;
//# sourceMappingURL=MessagePanel.d.ts.map