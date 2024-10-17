import { Socket } from "socket.io-client";
import { Participant, CoHostResponsibility, ShowAlert } from "../../@types/types";
export interface MuteParticipantsOptions {
    socket: Socket;
    coHostResponsibility: CoHostResponsibility[];
    participant: Participant;
    member: string;
    islevel: string;
    showAlert?: ShowAlert;
    coHost: string;
    roomName: string;
}
export type MuteParticipantsType = (options: MuteParticipantsOptions) => Promise<void>;
/**
 * Mutes a participant in a media session if certain conditions are met.
 *
 * @param {Object} options - The options for muting participants.
 * @param {Socket} options.socket - The socket instance for communication.
 * @param {Array} options.coHostResponsibility - List of co-host responsibilities.
 * @param {Object} options.participant - The participant to be muted.
 * @param {Object} options.member - The current member attempting to mute.
 * @param {string} options.islevel - The level of the current member.
 * @param {Function} [options.showAlert] - Optional function to show alerts.
 * @param {Object} options.coHost - The co-host information.
 * @param {string} options.roomName - The name of the room.
 *
 * @returns {Promise<void>} A promise that resolves when the participant is muted.
 *
 * @throws Will log an error if there is an issue accessing co-host responsibilities.
 */
export declare const muteParticipants: ({ socket, coHostResponsibility, participant, member, islevel, showAlert, coHost, roomName, }: MuteParticipantsOptions) => Promise<void>;
//# sourceMappingURL=muteParticipants.d.ts.map