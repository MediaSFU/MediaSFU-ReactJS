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
 * PollModal component renders a modal for creating, viewing, and managing polls.
 *
 * @component
 * @param {PollModalOptions} props - Properties for the PollModal component.
 * @param {boolean} props.isPollModalVisible - Controls the visibility of the poll modal.
 * @param {() => void} props.onClose - Function to close the modal.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor="#f5f5f5"] - Background color of the modal.
 * @param {string} props.member - The member's identifier.
 * @param {string} props.islevel - User level, determines access rights.
 * @param {Poll[]} props.polls - Array of all polls available in the session.
 * @param {Poll | null} props.poll - The currently active poll.
 * @param {Socket} props.socket - Socket connection for real-time interaction.
 * @param {string} props.roomName - The name of the chat room.
 * @param {ShowAlert} [props.showAlert] - Function to show alert messages.
 * @param {() => void} props.updateIsPollModalVisible - Function to toggle poll modal visibility.
 * @param {HandleCreatePollType} props.handleCreatePoll - Function to handle poll creation.
 * @param {HandleEndPollType} props.handleEndPoll - Function to handle poll ending.
 * @param {HandleVotePollType} props.handleVotePoll - Function to handle voting on a poll option.
 *
 * @returns {JSX.Element} The rendered PollModal component.
 *
 * @example
 * ```tsx
 * import { PollModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * // Define poll array and poll objects
 * const polls = [
 *   {
 *     id: "1",
 *     question: "Do you like React?",
 *     options: ["Yes", "No"],
 *     votes: [0, 0],
 *     status: "active",
 *   },
 * ];
 * const currentPoll = polls[0];
 * const socket = io("http://localhost:3000");
 *
 * // Render the PollModal component
 * <PollModal
 *   isPollModalVisible={true}
 *   onClose={() => console.log("Modal closed")}
 *   position="topRight"
 *   backgroundColor="#f5f5f5"
 *   member="user1"
 *   islevel="2"
 *   polls={polls}
 *   poll={currentPoll}
 *   socket={socket}
 *   roomName="Room 1"
 *   showAlert={(message, type) => console.log("Show alert:", message, type)}
 *   updateIsPollModalVisible={() => console.log("Toggle poll modal visibility")}
 *   handleCreatePoll={(pollOptions) => console.log("Create poll:", pollOptions)}
 *   handleEndPoll={(pollId) => console.log("End poll:", pollId)}
 *   handleVotePoll={(voteOptions) => console.log("Vote in poll:", voteOptions)}
 * />
 * ```
 */
declare const PollModal: React.FC<PollModalOptions>;
export default PollModal;
//# sourceMappingURL=PollModal.d.ts.map