import { Participant, CoHostResponsibility, ShowAlert } from "../../@types/types";
export interface MessageParticipantsOptions {
    coHostResponsibility: CoHostResponsibility[];
    participant: Participant;
    member: string;
    islevel: string;
    showAlert?: ShowAlert;
    coHost: string;
    updateIsMessagesModalVisible: (isVisible: boolean) => void;
    updateDirectMessageDetails: (participant: Participant | null) => void;
    updateStartDirectMessage: (start: boolean) => void;
}
export type MessageParticipantsType = (options: MessageParticipantsOptions) => void;
/**
 * Sends a direct message to a participant if certain conditions are met.
 *s
 * @param coHostResponsibility - Array of responsibilities assigned to the co-host.
 * @param participant - The participant to whom the message is to be sent.
 * @param member - The current member attempting to send the message.
 * @param islevel - The level of the current member.
 * @param showAlert - Function to show an alert message.
 * @param coHost - The co-host member.
 * @param updateIsMessagesModalVisible - Function to update the visibility of the messages modal.
 * @param updateDirectMessageDetails - Function to update the details of the direct message.
 * @param updateStartDirectMessage - Function to start the direct message.
 *
 * @returns void
 */
export declare const messageParticipants: ({ coHostResponsibility, participant, member, islevel, showAlert, coHost, updateIsMessagesModalVisible, updateDirectMessageDetails, updateStartDirectMessage, }: MessageParticipantsOptions) => void;
//# sourceMappingURL=messageParticipants.d.ts.map