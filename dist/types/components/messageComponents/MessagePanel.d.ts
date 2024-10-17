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
export type MessagePanelType = (options: MessagePanelOptions) => JSX.Element;
/**
 * MessagePanel component renders a panel for displaying and sending messages.
 *
 * @component
 * @param {MessagePanelOptions} props - The properties for the MessagePanel component.
 * @param {Array} props.messages - The list of messages to display.
 * @param {number} props.messagesLength - The total number of messages.
 * @param {string} props.type - The type of message panel, either "direct" or "group".
 * @param {string} props.username - The username of the current user.
 * @param {function} [props.onSendMessagePress] - The function to call when the send button is pressed.
 * @param {string} [props.backgroundColor="#f5f5f5"] - The background color of the message panel.
 * @param {boolean} props.focusedInput - Whether the input is focused.
 * @param {function} props.showAlert - The function to call to show an alert.
 * @param {string} props.eventType - The type of event.
 * @param {string} props.member - The member associated with the messages.
 * @param {string} props.islevel - The level of the user.
 * @param {boolean} props.startDirectMessage - Whether to start a direct message.
 * @param {function} props.updateStartDirectMessage - The function to update the start direct message state.
 * @param {object} props.directMessageDetails - The details of the direct message.
 * @param {function} props.updateDirectMessageDetails - The function to update the direct message details.
 * @param {boolean} props.coHostResponsibility - Whether the user has co-host responsibilities.
 * @param {boolean} props.coHost - Whether the user is a co-host.
 * @param {string} props.roomName - The name of the room.
 * @param {object} props.socket - The socket object for real-time communication.
 * @param {object} props.chatSetting - The settings for the chat.
 *
 * @returns {JSX.Element} The rendered MessagePanel component.
 */
declare const MessagePanel: React.FC<MessagePanelOptions>;
export default MessagePanel;
//# sourceMappingURL=MessagePanel.d.ts.map