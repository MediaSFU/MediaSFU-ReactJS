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
export type ParticipantListItemType = (options: ParticipantListItemOptions) => React.JSX.Element;
/**
 * ParticipantListItem component renders a list item for a participant with various controls.
 *
 * @component
 * @param {ParticipantListItemOptions} props - The properties for the component.
 * @param {Participant} props.participant - The participant object.
 * @param {boolean} props.isBroadcast - Flag indicating if it is a broadcast.
 * @param {MuteParticipantsType} props.onMuteParticipants - Function to mute participants.
 * @param {MessageParticipantsType} props.onMessageParticipants - Function to message participants.
 * @param {RemoveParticipantsType} props.onRemoveParticipants - Function to remove participants.
 * @param {Socket} props.socket - The socket object for communication.
 * @param {CoHostResponsibility[]} props.coHostResponsibility - Array indicating co-host responsibilities.
 * @param {string} props.member - The current member's username or ID.
 * @param {string} props.islevel - Level of the participant.
 * @param {ShowAlert} [props.showAlert] - Function to show alerts.
 * @param {string} props.coHost - Username or ID of the co-host.
 * @param {string} props.roomName - The name of the room.
 * @param {Function} props.updateIsMessagesModalVisible - Function to update message modal visibility.
 * @param {Function} props.updateDirectMessageDetails - Function to update direct message details.
 * @param {Function} props.updateStartDirectMessage - Function to start a direct message.
 * @param {Participant[]} props.participants - Array of participants.
 * @param {Function} props.updateParticipants - Function to update the participants list.
 * @returns {React.JSX.Element} The rendered ParticipantListItem component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ParticipantListItem } from 'mediasfu-reactjs';
 *
 * const participant = {
 *   name: "Participant 1",
 *   videoOn: true,
 *   audioOn: true,
 *   muted: false,
 *   id: "1",
 *   islevel: "1"
 * };
 *
 * const handleMuteParticipants = (options) => console.log("Mute participant", options.participant);
 * const handleMessageParticipants = (options) => console.log("Message participant", options.participant);
 * const handleRemoveParticipants = (options) => console.log("Remove participant", options.participant);
 *
 * <ParticipantListItem
 *   participant={participant}
 *   isBroadcast={false}
 *   onMuteParticipants={handleMuteParticipants}
 *   onMessageParticipants={handleMessageParticipants}
 *   onRemoveParticipants={handleRemoveParticipants}
 *   socket={socket}
 *   coHostResponsibility={[]}
 *   member="user123"
 *   islevel="1"
 *   showAlert={(message) => console.log(message)}
 *   coHost="host123"
 *   roomName="Room 1"
 *   updateIsMessagesModalVisible={(isVisible) => console.log(isVisible)}
 *   updateDirectMessageDetails={(participant) => console.log(participant)}
 *   updateStartDirectMessage={(start) => console.log(start)}
 *   participants={[participant]}
 *   updateParticipants={(updatedList) => console.log(updatedList)}
 * />
 * ```
 */
declare const ParticipantListItem: React.FC<ParticipantListItemOptions>;
export default ParticipantListItem;
//# sourceMappingURL=ParticipantListItem.d.ts.map