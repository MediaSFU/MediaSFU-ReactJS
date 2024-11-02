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
 * Mutes a participant in a media session if the current member has the necessary permissions.
 *
 * @param {MuteParticipantsOptions} options - The options for muting participants.
 * @param {Socket} options.socket - The socket instance for communication.
 * @param {CoHostResponsibility[]} options.coHostResponsibility - List of co-host responsibilities.
 * @param {Participant} options.participant - The participant to be muted.
 * @param {string} options.member - The current member attempting to mute.
 * @param {string} options.islevel - The level of the current member.
 * @param {ShowAlert} [options.showAlert] - Optional function to show alerts.
 * @param {string} options.coHost - The co-host information.
 * @param {string} options.roomName - The name of the room.
 *
 * @example
 * ```typescript
 * muteParticipants({
 *   socket,
 *   coHostResponsibility: [{ name: "media", value: true }],
 *   participant: { id: "123", name: "John Doe", muted: false, islevel: "1" },
 *   member: "currentMember",
 *   islevel: "2",
 *   showAlert: (alert) => console.log(alert.message),
 *   coHost: "coHostMember",
 *   roomName: "room1",
 * });
 * ```
 */
export declare const muteParticipants: ({ socket, coHostResponsibility, participant, member, islevel, showAlert, coHost, roomName, }: MuteParticipantsOptions) => Promise<void>;
//# sourceMappingURL=muteParticipants.d.ts.map