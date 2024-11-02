import { Socket } from 'socket.io-client';
import { CoHostResponsibility, Participant, ShowAlert } from '../../@types/types';
export interface RemoveParticipantsOptions {
    coHostResponsibility: CoHostResponsibility[];
    participant: Participant;
    member: string;
    islevel: string;
    showAlert?: ShowAlert;
    coHost: string;
    participants: Participant[];
    socket: Socket;
    roomName: string;
    updateParticipants: (participants: Participant[]) => void;
}
export type RemoveParticipantsType = (options: RemoveParticipantsOptions) => Promise<void>;
/**
 * Removes a participant from the room if the user has the necessary permissions.
 *
 * @param {RemoveParticipantsOptions} options - The options for removing a participant.
 * @param {CoHostResponsibility[]} options.coHostResponsibility - The responsibilities assigned to the co-host.
 * @param {Participant} options.participant - The participant to be removed from the room.
 * @param {string} options.member - The current member attempting to remove the participant.
 * @param {string} options.islevel - The level of the current member.
 * @param {ShowAlert} [options.showAlert] - Optional function to display an alert.
 * @param {string} options.coHost - The co-host identifier.
 * @param {Participant[]} options.participants - List of current participants.
 * @param {Socket} options.socket - The socket instance for communication.
 * @param {string} options.roomName - The name of the room.
 * @param {Function} options.updateParticipants - Function to update the participants list.
 *
 * @example
 * ```typescript
 * removeParticipants({
 *   coHostResponsibility: [{ name: "participants", value: true }],
 *   participant: { id: "123", name: "John Doe", islevel: "1" },
 *   member: "currentMember",
 *   islevel: "2",
 *   showAlert: (alert) => console.log(alert.message),
 *   coHost: "coHostMember",
 *   participants: [{ id: "123", name: "John Doe", islevel: "1" }],
 *   socket,
 *   roomName: "room1",
 *   updateParticipants: (updatedParticipants) => console.log(updatedParticipants),
 * });
 * ```
 */
export declare const removeParticipants: ({ coHostResponsibility, participant, member, islevel, showAlert, coHost, participants, socket, roomName, updateParticipants }: RemoveParticipantsOptions) => Promise<void>;
//# sourceMappingURL=removeParticipants.d.ts.map