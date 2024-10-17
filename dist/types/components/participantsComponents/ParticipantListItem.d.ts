import React from "react";
import { Participant, MuteParticipantsType, MessageParticipantsType, RemoveParticipantsType, ShowAlert, CoHostResponsibility } from "../../@types/types";
import { Socket } from "socket.io-client";
export interface ParticipantListItemOptions {
    participant: Participant;
    isBroadcast: boolean;
    onMuteParticipants: MuteParticipantsType;
    onMessageParticipants: MessageParticipantsType;
    onRemoveParticipants: RemoveParticipantsType;
    socket: Socket;
    coHostResponsibility: CoHostResponsibility[];
    member: string;
    islevel: string;
    showAlert?: ShowAlert;
    coHost: string;
    roomName: string;
    updateIsMessagesModalVisible: (isVisible: boolean) => void;
    updateDirectMessageDetails: (participant: Participant | null) => void;
    updateStartDirectMessage: (start: boolean) => void;
    participants: Participant[];
    updateParticipants: (participants: Participant[]) => void;
}
export type ParticipantListItemType = (options: ParticipantListItemOptions) => JSX.Element;
/**
 * ParticipantListItem component renders a list item for a participant with various controls.
 *
 * @component
 * @param {ParticipantListItemOptions} props - The properties for the component.
 * @param {Object} props.participant - The participant object.
 * @param {boolean} props.isBroadcast - Flag indicating if it is a broadcast.
 * @param {Function} props.onMuteParticipants - Function to mute participants.
 * @param {Function} props.onMessageParticipants - Function to message participants.
 * @param {Function} props.onRemoveParticipants - Function to remove participants.
 * @param {Object} props.socket - The socket object for communication.
 * @param {boolean} props.coHostResponsibility - Flag indicating co-host responsibility.
 * @param {Object} props.member - The member object.
 * @param {boolean} props.islevel - Flag indicating the level of the participant.
 * @param {Function} props.showAlert - Function to show alerts.
 * @param {boolean} props.coHost - Flag indicating if the participant is a co-host.
 * @param {string} props.roomName - The name of the room.
 * @param {Function} props.updateIsMessagesModalVisible - Function to update message modal visibility.
 * @param {Function} props.updateDirectMessageDetails - Function to update direct message details.
 * @param {Function} props.updateStartDirectMessage - Function to start a direct message.
 * @param {Array} props.participants - Array of participants.
 * @param {Function} props.updateParticipants - Function to update participants.
 * @returns {JSX.Element} The rendered component.
 */
declare const ParticipantListItem: React.FC<ParticipantListItemOptions>;
export default ParticipantListItem;
//# sourceMappingURL=ParticipantListItem.d.ts.map