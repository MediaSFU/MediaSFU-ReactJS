import { EventType, Message, Participant } from "../../@types/types";
export interface ReceiveMessageOptions {
    message: Message;
    messages: Message[];
    participantsAll: Participant[];
    member: string;
    eventType: EventType;
    islevel: string;
    coHost: string;
    updateMessages: (messages: Message[]) => void;
    updateShowMessagesBadge: (showBadge: boolean) => void;
}
export type ReceiveMessageType = (options: ReceiveMessageOptions) => Promise<void>;
/**
 * Asynchronously processes and updates the received message.
 *
 * @param {Object} options - The options object.
 * @param {Message} options.message - The received message object.
 * @param {Message[]} options.messages - The current array of messages.
 * @param {Participant[]} options.participantsAll - The list of all participants.
 * @param {string} options.member - The current member's name.
 * @param {string} options.eventType - The type of event triggering the message reception.
 * @param {string} options.islevel - The level of the current member.
 * @param {string} options.coHost - The co-host's name.
 * @param {Function} options.updateMessages - Function to update the messages array.
 * @param {Function} options.updateShowMessagesBadge - Function to update the visibility of the messages badge.
 *
 * @returns {Promise<void>} A promise that resolves when the message processing is complete.
 */
export declare const receiveMessage: ({ message, messages, participantsAll, member, eventType, islevel, coHost, updateMessages, updateShowMessagesBadge, }: ReceiveMessageOptions) => Promise<void>;
//# sourceMappingURL=receiveMessage.d.ts.map