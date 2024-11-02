import React from "react";
import { muteParticipants } from "../../methods/participantsMethods/muteParticipants";
import { messageParticipants } from "../../methods/participantsMethods/messageParticipants";
import { removeParticipants } from "../../methods/participantsMethods/removeParticipants";
import { CoHostResponsibility, EventType, Participant, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";
export interface ParticipantsModalParameters {
    position?: string;
    backgroundColor?: string;
    coHostResponsibility: CoHostResponsibility[];
    coHost: string;
    member: string;
    islevel: string;
    participants: Participant[];
    eventType: EventType;
    filteredParticipants: Participant[];
    socket: Socket;
    showAlert?: ShowAlert;
    roomName: string;
    updateIsMessagesModalVisible: (isVisible: boolean) => void;
    updateDirectMessageDetails: (participant: Participant | null) => void;
    updateStartDirectMessage: (start: boolean) => void;
    updateParticipants: (participants: Participant[]) => void;
    getUpdatedAllParams: () => ParticipantsModalParameters;
    [key: string]: any;
}
export interface ParticipantsModalOptions {
    isParticipantsModalVisible: boolean;
    onParticipantsClose: () => void;
    onParticipantsFilterChange: (filter: string) => void;
    participantsCounter: number;
    onMuteParticipants?: typeof muteParticipants;
    onMessageParticipants?: typeof messageParticipants;
    onRemoveParticipants?: typeof removeParticipants;
    RenderParticipantList?: React.ComponentType<any>;
    RenderParticipantListOthers?: React.ComponentType<any>;
    parameters: ParticipantsModalParameters;
    backgroundColor?: string;
    position?: string;
}
export type ParticipantsModalType = (options: ParticipantsModalOptions) => JSX.Element;
/**
 * ParticipantsModal - A React component that displays a modal for managing participants in an event.
 *
 * @param {ParticipantsModalOptions} props - Properties for the ParticipantsModal component.
 * @param {boolean} props.isParticipantsModalVisible - Flag to control the visibility of the modal.
 * @param {() => void} props.onParticipantsClose - Function to handle modal close.
 * @param {(filter: string) => void} props.onParticipantsFilterChange - Callback to filter participants.
 * @param {number} props.participantsCounter - Number of participants to display.
 * @param {typeof muteParticipants} [props.onMuteParticipants=muteParticipants] - Function for muting participants.
 * @param {typeof messageParticipants} [props.onMessageParticipants=messageParticipants] - Function for messaging participants.
 * @param {typeof removeParticipants} [props.onRemoveParticipants=removeParticipants] - Function for removing participants.
 * @param {React.ComponentType<any>} [props.RenderParticipantList=ParticipantList] - Component for listing participants with controls.
 * @param {React.ComponentType<any>} [props.RenderParticipantListOthers=ParticipantListOthers] - Component for listing basic participant information.
 * @param {string} [props.position="topRight"] - Position of the modal.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {ParticipantsModalParameters} props.parameters - Modal-specific parameters.
 *
 * @returns {JSX.Element} ParticipantsModal component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ParticipantsModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * const parameters = {
 *   coHostResponsibility: [{ name: "participants", value: true }],
 *   coHost: "John Doe",
 *   member: "Jane Smith",
 *   islevel: "2",
 *   participants: [{ id: "1", name: "Participant 1", muted: false, videoOn: true }],
 *   eventType: "meeting",
 *   socket: io("http://localhost:3000"),
 *   showAlert: (message) => console.log(message),
 *   roomName: "Room 1",
 *   updateIsMessagesModalVisible: (isVisible) => console.log("Messages modal:", isVisible),
 *   updateDirectMessageDetails: (participant) => console.log("Direct message details:", participant),
 *   updateStartDirectMessage: (start) => console.log("Direct message started:", start),
 *   updateParticipants: (participants) => console.log("Updated participants:", participants),
 *   getUpdatedAllParams: () => ({ filteredParticipants: [{ id: "1", name: "Participant 1", muted: false, videoOn: true }] }),
 * };
 *
 * <ParticipantsModal
 *   isParticipantsModalVisible={true}
 *   onParticipantsClose={() => console.log("Participants modal closed")}
 *   onParticipantsFilterChange={(filter) => console.log("Filter:", filter)}
 *   participantsCounter={2}
 *   onMuteParticipants={muteParticipants}
 *   onMessageParticipants={messageParticipants}
 *   onRemoveParticipants={removeParticipants}
 *   RenderParticipantList={ParticipantList}
 *   RenderParticipantListOthers={ParticipantListOthers}
 *   position="topRight"
 *   backgroundColor="#83c0e9"
 *   parameters={parameters}
 * />
 * ```
 */
declare const ParticipantsModal: React.FC<ParticipantsModalOptions>;
export default ParticipantsModal;
//# sourceMappingURL=ParticipantsModal.d.ts.map