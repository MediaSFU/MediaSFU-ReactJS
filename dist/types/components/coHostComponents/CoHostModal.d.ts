import React from 'react';
import './CoHostModal.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CoHostResponsibility, Participant, ModifyCoHostSettingsOptions, ShowAlert } from '../../@types/types';
import { Socket } from 'socket.io-client';
export interface CoHostModalOptions {
    isCoHostModalVisible: boolean;
    currentCohost?: string;
    participants: Participant[];
    coHostResponsibility: CoHostResponsibility[];
    position?: string;
    backgroundColor?: string;
    roomName: string;
    showAlert?: ShowAlert;
    updateCoHostResponsibility: (coHostResponsibility: CoHostResponsibility[]) => void;
    updateCoHost: (coHost: string) => void;
    updateIsCoHostModalVisible: (isCoHostModalVisible: boolean) => void;
    socket: Socket;
    onCoHostClose: () => void;
    onModifyEventSettings?: (settings: ModifyCoHostSettingsOptions) => void;
}
export type CoHostModalType = (options: CoHostModalOptions) => JSX.Element;
/**
 * CoHostModal component allows managing co-host settings for an event.
 *
 * @param {boolean} isCoHostModalVisible - Determines if the co-host modal is visible.
 * @param {() => void} onCoHostClose - Function to close the co-host modal.
 * @param {Function} [onModifyEventSettings=modifyCoHostSettings] - Function to modify event settings.
 * @param {string} [currentCohost='No coHost'] - The current co-host.
 * @param {Array} participants - List of participants.
 * @param {Array} coHostResponsibility - List of co-host responsibilities.
 * @param {string} [position='topRight'] - Position of the modal.
 * @param {string} [backgroundColor='#83c0e9'] - Background color of the modal.
 * @param {string} roomName - Name of the room.
 * @param {boolean} showAlert - Flag to show alert.
 * @param {Function} updateCoHostResponsibility - Function to update co-host responsibilities.
 * @param {Function} updateCoHost - Function to update co-host.
 * @param {Function} updateIsCoHostModalVisible - Function to update the visibility of the co-host modal.
 * @param {Object} socket - Socket object for real-time communication.
 *
 * @returns {JSX.Element} The CoHostModal component.
 */
declare const CoHostModal: React.FC<CoHostModalOptions>;
export default CoHostModal;
//# sourceMappingURL=CoHostModal.d.ts.map