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
 * ParticipantsModal - A React component for displaying a modal with a list of participants.
 *
 * @param {ParticipantsModalOptions} props - The properties for the ParticipantsModal component.
 * @param {boolean} props.isParticipantsModalVisible - Flag to determine if the participants modal is visible.
 * @param {() => void} props.onParticipantsClose - Function to handle closing the participants modal.
 * @param {(filter: string) => void} props.onParticipantsFilterChange - Function to handle changes in the participants filter.
 * @param {number} props.participantsCounter - The number of participants.
 * @param {typeof muteParticipants} [props.onMuteParticipants=muteParticipants] - Function to handle muting participants.
 * @param {typeof messageParticipants} [props.onMessageParticipants=messageParticipants] - Function to handle messaging participants.
 * @param {typeof removeParticipants} [props.onRemoveParticipants=removeParticipants] - Function to handle removing participants.
 * @param {React.ComponentType<any>} [props.RenderParticipantList=ParticipantList] - Component to render the list of participants.
 * @param {React.ComponentType<any>} [props.RenderParticipantListOthers=ParticipantListOthers] - Component to render the list of other participants.
 * @param {string} [props.position="topRight"] - The position of the modal.
 * @param {string} [props.backgroundColor="#83c0e9"] - The background color of the modal.
 * @param {ParticipantsModalParameters} props.parameters - The parameters for the participants modal.
 *
 * @returns {JSX.Element} The ParticipantsModal component.
 */
declare const ParticipantsModal: React.FC<ParticipantsModalOptions>;
export default ParticipantsModal;
//# sourceMappingURL=ParticipantsModal.d.ts.map