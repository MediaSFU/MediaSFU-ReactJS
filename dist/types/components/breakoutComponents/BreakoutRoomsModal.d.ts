import React from 'react';
import { BreakoutParticipant, Participant, ShowAlert } from '../../@types/types';
import { Socket } from 'socket.io-client';
export interface BreakoutRoomsModalParameters {
    participants: Participant[];
    showAlert?: ShowAlert;
    socket: Socket;
    itemPageLimit: number;
    meetingDisplayType: string;
    prevMeetingDisplayType: string;
    roomName: string;
    shareScreenStarted: boolean;
    shared: boolean;
    breakOutRoomStarted: boolean;
    breakOutRoomEnded: boolean;
    isBreakoutRoomsModalVisible: boolean;
    currentRoomIndex: number | null;
    canStartBreakout: boolean;
    breakoutRooms: BreakoutParticipant[][];
    updateBreakOutRoomStarted: (started: boolean) => void;
    updateBreakOutRoomEnded: (ended: boolean) => void;
    updateCurrentRoomIndex: (roomIndex: number) => void;
    updateCanStartBreakout: (canStart: boolean) => void;
    updateBreakoutRooms: (breakoutRooms: BreakoutParticipant[][]) => void;
    updateMeetingDisplayType: (displayType: string) => void;
    getUpdatedAllParams: () => BreakoutRoomsModalParameters;
    [key: string]: any;
}
export interface BreakoutRoomsModalOptions {
    isVisible: boolean;
    onBreakoutRoomsClose: () => void;
    parameters: BreakoutRoomsModalParameters;
    position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
    backgroundColor?: string;
}
export type BreakoutRoomsModalType = (options: BreakoutRoomsModalOptions) => JSX.Element;
/**
 * BreakoutRoomsModal component is a React functional component that manages the breakout rooms modal.
 * It allows users to create, edit, and manage breakout rooms for participants in a meeting.
 *
 * @component
 * @param {BreakoutRoomsModalOptions} props - The properties for the BreakoutRoomsModal component.
 * @param {boolean} props.isVisible - Determines if the modal is visible.
 * @param {Function} props.onBreakoutRoomsClose - Callback function to close the modal.
 * @param {Object} props.parameters - Parameters for managing breakout rooms.
 * @param {string} [props.position='topRight'] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor='#83c0e9'] - Background color of the modal.
 *
 * @returns {JSX.Element} The rendered BreakoutRoomsModal component.
 *
 * @example
 * ```tsx
 * <BreakoutRoomsModal
 *   isVisible={true}
 *   onBreakoutRoomsClose={handleClose}
 *   parameters={parameters}
 *   position="topRight"
 *   backgroundColor="#83c0e9"
 * />
 * ```
 */
declare const BreakoutRoomsModal: React.FC<BreakoutRoomsModalOptions>;
export default BreakoutRoomsModal;
//# sourceMappingURL=BreakoutRoomsModal.d.ts.map