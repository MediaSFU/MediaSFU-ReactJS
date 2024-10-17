import React from "react";
import { Poll, ShowAlert } from "../../@types/types";
import { HandleCreatePollType, HandleEndPollType, HandleVotePollType } from "../../@types/types";
import { Socket } from "socket.io-client";
export interface PollModalOptions {
    isPollModalVisible: boolean;
    onClose: () => void;
    position?: string;
    backgroundColor?: string;
    member: string;
    islevel: string;
    polls: Poll[];
    poll: Poll | null;
    socket: Socket;
    roomName: string;
    showAlert?: ShowAlert;
    updateIsPollModalVisible: (isVisible: boolean) => void;
    handleCreatePoll: HandleCreatePollType;
    handleEndPoll: HandleEndPollType;
    handleVotePoll: HandleVotePollType;
}
export type PollModalType = (options: PollModalOptions) => JSX.Element;
/**
 * PollModal - A React component for displaying and managing polls.
 */
/**
 * PollModal component renders a modal for creating, viewing, and managing polls.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.isPollModalVisible - Determines if the poll modal is visible.
 * @param {function} props.onClose - Function to close the modal.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor="#f5f5f5"] - Background color of the modal.
 * @param {Object} props.member - The member object.
 * @param {string} props.islevel - The level of the user.
 * @param {Array} props.polls - Array of poll objects.
 * @param {Object} props.poll - The current poll object.
 * @param {Object} props.socket - The socket object for real-time communication.
 * @param {string} props.roomName - The name of the room.
 * @param {function} props.showAlert - Function to show alerts.
 * @param {function} props.updateIsPollModalVisible - Function to update the visibility of the poll modal.
 * @param {function} props.handleCreatePoll - Function to handle creating a new poll.
 * @param {function} props.handleEndPoll - Function to handle ending a poll.
 * @param {function} props.handleVotePoll - Function to handle voting in a poll.
 *
 * @returns {JSX.Element} The rendered PollModal component.
 */
declare const PollModal: React.FC<PollModalOptions>;
export default PollModal;
//# sourceMappingURL=PollModal.d.ts.map