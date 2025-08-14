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
export type CoHostModalType = (options: CoHostModalOptions) => React.JSX.Element;
/**
 * CoHostModal component allows managing co-host settings for an event.
 *
 * This component displays a modal that enables users to select a new co-host from the list of participants,
 * assign responsibilities, and save the updated settings. Real-time communication is facilitated using a
 * Socket instance, and it includes customizable options for modal appearance and position.
 *
 * @component
 * @param {boolean} isCoHostModalVisible - Determines if the co-host modal is visible.
 * @param {() => void} onCoHostClose - Function to close the co-host modal.
 * @param {Function} [onModifyEventSettings=modifyCoHostSettings] - Function to modify event settings, defaulting to `modifyCoHostSettings`.
 * @param {string} [currentCohost='No coHost'] - The name of the current co-host.
 * @param {Participant[]} participants - List of participants.
 * @param {CoHostResponsibility[]} coHostResponsibility - Array of co-host responsibilities.
 * @param {string} [position='topRight'] - Position of the modal within the viewport.
 * @param {string} [backgroundColor='#83c0e9'] - Background color of the modal.
 * @param {string} roomName - Name of the room.
 * @param {ShowAlert} [showAlert] - Function to display an alert.
 * @param {Function} updateCoHostResponsibility - Function to update the array of co-host responsibilities.
 * @param {Function} updateCoHost - Function to update the current co-host.
 * @param {Function} updateIsCoHostModalVisible - Function to control the visibility of the co-host modal.
 * @param {Socket} socket - Socket instance for real-time communication.
 *
 * @returns {React.JSX.Element} The CoHostModal component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { CoHostModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * function App() {
 *   const isCoHostModalVisible = true;
 *   const onCoHostClose = () => console.log('Co-host modal closed');
 *   const onModifyEventSettings = (settings) => console.log('Settings modified', settings);
 *   const currentCohost = 'John Doe';
 *   const participants = [
 *     { name: 'John Doe', islevel: '1' },
 *     { name: 'Jane Doe', islevel: '0' }
 *   ];
 *   const coHostResponsibility = [
 *     { name: 'manageParticipants', value: true, dedicated: false }
 *   ];
 *   const position = 'topRight';
 *   const backgroundColor = '#83c0e9';
 *   const roomName = 'Room 1';
 *   const showAlert = ({ message, type }) => console.log('Alert:', message, type);
 *   const updateCoHostResponsibility = (responsibilities) => console.log('Co-host responsibilities updated', responsibilities);
 *   const updateCoHost = (coHost) => console.log('Co-host updated', coHost);
 *   const updateIsCoHostModalVisible = (visible) => console.log('Co-host modal visibility:', visible);
 *   const socket = io('http://localhost:3000');
 *
 *   return (
 *     <CoHostModal
 *       isCoHostModalVisible={isCoHostModalVisible}
 *       onCoHostClose={onCoHostClose}
 *       onModifyEventSettings={onModifyEventSettings}
 *       currentCohost={currentCohost}
 *       participants={participants}
 *       coHostResponsibility={coHostResponsibility}
 *       position={position}
 *       backgroundColor={backgroundColor}
 *       roomName={roomName}
 *       showAlert={showAlert}
 *       updateCoHostResponsibility={updateCoHostResponsibility}
 *       updateCoHost={updateCoHost}
 *       updateIsCoHostModalVisible={updateIsCoHostModalVisible}
 *       socket={socket}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const CoHostModal: React.FC<CoHostModalOptions>;
export default CoHostModal;
//# sourceMappingURL=CoHostModal.d.ts.map