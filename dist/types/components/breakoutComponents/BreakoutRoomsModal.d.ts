import React from 'react';
import { BreakoutParticipant, Participant, ShowAlert } from '../../@types/types';
import { Socket } from 'socket.io-client';
export interface BreakoutRoomsModalParameters {
    participants: Participant[];
    showAlert?: ShowAlert;
    socket: Socket;
    localSocket?: Socket;
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
    title?: React.ReactNode;
    overlayProps?: React.HTMLAttributes<HTMLDivElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    headerProps?: React.HTMLAttributes<HTMLDivElement>;
    titleProps?: React.HTMLAttributes<HTMLHeadingElement>;
    closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    closeIconComponent?: React.ReactNode;
    headerDividerProps?: React.HTMLAttributes<HTMLHRElement>;
    bodyProps?: React.HTMLAttributes<HTMLDivElement>;
    controlsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    numRoomsFieldProps?: React.HTMLAttributes<HTMLDivElement>;
    numRoomsLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
    numRoomsInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    actionsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    randomAssignButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    manualAssignButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    addRoomButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    saveRoomsButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    newParticipantFieldProps?: React.HTMLAttributes<HTMLDivElement>;
    newParticipantLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
    newParticipantSelectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
    roomsContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    startButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    stopButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    numRoomsLabel?: React.ReactNode;
    newParticipantActionLabel?: React.ReactNode;
    randomAssignButtonLabel?: React.ReactNode;
    manualAssignButtonLabel?: React.ReactNode;
    addRoomButtonLabel?: React.ReactNode;
    saveRoomsButtonLabel?: React.ReactNode;
    startBreakoutButtonLabel?: React.ReactNode;
    updateBreakoutButtonLabel?: React.ReactNode;
    stopBreakoutButtonLabel?: React.ReactNode;
    renderHeader?: (options: {
        defaultHeader: React.ReactNode;
    }) => React.ReactNode;
    renderControls?: (options: {
        defaultControls: React.ReactNode;
    }) => React.ReactNode;
    renderRoomList?: (options: {
        defaultRoomList: React.ReactNode;
        rooms: BreakoutParticipant[][];
    }) => React.ReactNode;
    renderStartButton?: (options: {
        defaultStartButton: React.ReactNode;
        isUpdating: boolean;
    }) => React.ReactNode;
    renderStopButton?: (options: {
        defaultStopButton: React.ReactNode;
    }) => React.ReactNode;
    renderBody?: (options: {
        defaultBody: React.ReactNode;
    }) => React.ReactNode;
    renderContent?: (options: {
        defaultContent: React.ReactNode;
    }) => React.ReactNode;
}
export type BreakoutRoomsModalType = (options: BreakoutRoomsModalOptions) => React.JSX.Element;
/**
 * BreakoutRoomsModal - Comprehensive breakout room management interface
 *
 * A feature-rich modal for creating, configuring, and managing breakout rooms during meetings.
 * Supports random/manual participant assignment, real-time room editing, start/stop controls,
 * and participant movement. Perfect for facilitating small-group discussions, workshops,
 * and collaborative activities within larger meetings.
 *
 * Features:
 * - Create multiple breakout rooms
 * - Random participant assignment across rooms
 * - Manual participant assignment with drag-and-drop
 * - Add/remove rooms dynamically
 * - Edit room participants on-the-fly
 * - Start/stop breakout sessions
 * - Update active breakout configurations
 * - Participant visibility in each room
 * - Real-time socket synchronization
 * - Extensive HTML attributes customization for all UI elements
 * - Custom render hooks for complete UI flexibility
 *
 * @component
 * @param {BreakoutRoomsModalOptions} options - Configuration options
 * @param {boolean} options.isVisible - Modal visibility state
 * @param {Function} options.onBreakoutRoomsClose - Callback when modal is closed
 * @param {BreakoutRoomsModalParameters} options.parameters - Breakout room parameters
 * @param {Participant[]} options.parameters.participants - All meeting participants
 * @param {ShowAlert} [options.parameters.showAlert] - Alert display function
 * @param {Socket} options.parameters.socket - Socket.io client instance
 * @param {Socket} [options.parameters.localSocket] - Local socket for internal communication
 * @param {number} options.parameters.itemPageLimit - Pagination limit
 * @param {string} options.parameters.meetingDisplayType - Current display mode
 * @param {string} options.parameters.prevMeetingDisplayType - Previous display mode
 * @param {string} options.parameters.roomName - Meeting/room identifier
 * @param {boolean} options.parameters.shareScreenStarted - Screen share active state
 * @param {boolean} options.parameters.shared - Content sharing state
 * @param {boolean} options.parameters.breakOutRoomStarted - Breakout session active
 * @param {boolean} options.parameters.breakOutRoomEnded - Breakout session ended
 * @param {boolean} options.parameters.isBreakoutRoomsModalVisible - Modal visibility state
 * @param {number|null} options.parameters.currentRoomIndex - Currently selected room index
 * @param {boolean} options.parameters.canStartBreakout - Permission to start breakout
 * @param {BreakoutParticipant[][]} options.parameters.breakoutRooms - Room configurations
 * @param {Function} options.parameters.updateBreakOutRoomStarted - Update session state
 * @param {Function} options.parameters.updateBreakOutRoomEnded - Update ended state
 * @param {Function} options.parameters.updateCurrentRoomIndex - Update selected room
 * @param {Function} options.parameters.updateCanStartBreakout - Update start permission
 * @param {Function} options.parameters.updateBreakoutRooms - Update room configurations
 * @param {Function} options.parameters.updateMeetingDisplayType - Update display mode
 * @param {Function} options.parameters.getUpdatedAllParams - Retrieve latest parameters
 * @param {string} [options.position='topRight'] - Modal screen position
 * @param {string} [options.backgroundColor='#83c0e9'] - Modal background color
 * @param {React.ReactNode} [options.title] - Custom modal title
 * @param {object} [options.overlayProps] - HTML attributes for overlay div
 * @param {object} [options.contentProps] - HTML attributes for content container
 * @param {object} [options.headerProps] - HTML attributes for header section
 * @param {object} [options.titleProps] - HTML attributes for title element
 * @param {object} [options.closeButtonProps] - HTML attributes for close button
 * @param {React.ReactNode} [options.closeIconComponent] - Custom close icon
 * @param {object} [options.headerDividerProps] - HTML attributes for header divider
 * @param {object} [options.bodyProps] - HTML attributes for body section
 * @param {object} [options.controlsWrapperProps] - HTML attributes for controls wrapper
 * @param {object} [options.numRoomsFieldProps] - HTML attributes for room count field
 * @param {object} [options.numRoomsLabelProps] - HTML attributes for room count label
 * @param {object} [options.numRoomsInputProps] - HTML attributes for room count input
 * @param {object} [options.actionsWrapperProps] - HTML attributes for actions wrapper
 * @param {object} [options.randomAssignButtonProps] - HTML attributes for random button
 * @param {object} [options.manualAssignButtonProps] - HTML attributes for manual button
 * @param {object} [options.addRoomButtonProps] - HTML attributes for add room button
 * @param {object} [options.saveRoomsButtonProps] - HTML attributes for save button
 * @param {object} [options.newParticipantFieldProps] - HTML attributes for participant field
 * @param {object} [options.newParticipantLabelProps] - HTML attributes for participant label
 * @param {object} [options.newParticipantSelectProps] - HTML attributes for participant select
 * @param {object} [options.roomsContainerProps] - HTML attributes for rooms container
 * @param {object} [options.startButtonProps] - HTML attributes for start button
 * @param {object} [options.stopButtonProps] - HTML attributes for stop button
 * @param {React.ReactNode} [options.numRoomsLabel] - Custom label for room count
 * @param {React.ReactNode} [options.newParticipantActionLabel] - Custom label for participant action
 * @param {React.ReactNode} [options.randomAssignButtonLabel] - Custom label for random button
 * @param {React.ReactNode} [options.manualAssignButtonLabel] - Custom label for manual button
 * @param {React.ReactNode} [options.addRoomButtonLabel] - Custom label for add button
 * @param {React.ReactNode} [options.saveRoomsButtonLabel] - Custom label for save button
 * @param {React.ReactNode} [options.startBreakoutButtonLabel] - Custom label for start button
 * @param {React.ReactNode} [options.updateBreakoutButtonLabel] - Custom label for update button
 * @param {React.ReactNode} [options.stopBreakoutButtonLabel] - Custom label for stop button
 * @param {Function} [options.renderHeader] - Custom header renderer
 * @param {Function} [options.renderControls] - Custom controls renderer
 * @param {Function} [options.renderRoomList] - Custom room list renderer
 * @param {Function} [options.renderStartButton] - Custom start button renderer
 * @param {Function} [options.renderStopButton] - Custom stop button renderer
 * @param {Function} [options.renderBody] - Custom body renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 *
 * @returns {React.JSX.Element} Rendered breakout rooms modal
 *
 * @example
 * // Basic breakout rooms management
 * ```tsx
 * import React, { useState } from 'react';
 * import { BreakoutRoomsModal } from 'mediasfu-reactjs';
 *
 * function BreakoutControl({ parameters }) {
 *   const [isVisible, setIsVisible] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Breakout Rooms ({parameters.breakoutRooms.length})
 *       </button>
 *       <BreakoutRoomsModal
 *         isVisible={isVisible}
 *         onBreakoutRoomsClose={() => setIsVisible(false)}
 *         parameters={parameters}
 *         position="topRight"
 *         backgroundColor="#0f172a"
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * // Custom styled with room count display
 * ```tsx
 * import { BreakoutRoomsModal } from 'mediasfu-reactjs';
 *
 * function BrandedBreakout({ isVisible, onClose, parameters }) {
 *   const totalParticipantsInRooms = parameters.breakoutRooms.reduce(
 *     (sum, room) => sum + room.length,
 *     0
 *   );
 *
 *   return (
 *     <BreakoutRoomsModal
 *       isVisible={isVisible}
 *       onBreakoutRoomsClose={onClose}
 *       parameters={parameters}
 *       backgroundColor="#1e3a8a"
 *       position="topLeft"
 *       contentProps={{
 *         style: {
 *           maxHeight: '90vh',
 *           borderRadius: 20,
 *           border: '2px solid #3b82f6',
 *         },
 *       }}
 *       startButtonProps={{
 *         style: {
 *           background: 'linear-gradient(135deg, #22c55e 0%, #14532d 100%)',
 *           color: 'white',
 *           padding: '12px 28px',
 *           borderRadius: 12,
 *           fontWeight: 600,
 *         },
 *       }}
 *       title={
 *         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 *           <span>Breakout Rooms</span>
 *           <span style={{ fontSize: 14, fontWeight: 400 }}>
 *             ({totalParticipantsInRooms}/{parameters.participants.length} assigned)
 *           </span>
 *         </div>
 *       }
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Analytics tracking for breakout operations
 * ```tsx
 * import { BreakoutRoomsModal } from 'mediasfu-reactjs';
 *
 * function AnalyticsBreakout({ isVisible, onClose, parameters }) {
 *   return (
 *     <BreakoutRoomsModal
 *       isVisible={isVisible}
 *       onBreakoutRoomsClose={onClose}
 *       parameters={{
 *         ...parameters,
 *         updateBreakOutRoomStarted: (started) => {
 *           analytics.track('breakout_session_started', {
 *             roomCount: parameters.breakoutRooms.length,
 *             participantCount: parameters.participants.length,
 *           });
 *           parameters.updateBreakOutRoomStarted(started);
 *         },
 *         updateBreakOutRoomEnded: (ended) => {
 *           analytics.track('breakout_session_ended', {
 *             duration: Date.now() - sessionStartTime,
 *           });
 *           parameters.updateBreakOutRoomEnded(ended);
 *         },
 *       }}
 *       renderRoomList={({ defaultRoomList, rooms }) => {
 *         return (
 *           <div>
 *             <div style={{
 *               padding: 12,
 *               background: '#f8fafc',
 *               borderRadius: 8,
 *               marginBottom: 16,
 *             }}>
 *               <div style={{ fontWeight: 600 }}>
 *                 {rooms.length} rooms configured
 *               </div>
 *               <div style={{ fontSize: 14, marginTop: 4 }}>
 *                 Avg: {Math.round(
 *                   rooms.reduce((sum, r) => sum + r.length, 0) / rooms.length
 *                 )} participants per room
 *               </div>
 *             </div>
 *             {defaultRoomList}
 *           </div>
 *         );
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, BreakoutRoomsModal } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   breakoutRoomsModal: {
 *     component: (props) => (
 *       <BreakoutRoomsModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         startButtonProps={{
 *           style: {
 *             background: '#22c55e',
 *             borderRadius: 12,
 *             padding: '12px 28px',
 *             fontWeight: 600,
 *           },
 *         }}
 *         stopButtonProps={{
 *           style: {
 *             background: '#ef4444',
 *             borderRadius: 12,
 *             padding: '12px 28px',
 *             fontWeight: 600,
 *           },
 *         }}
 *       />
 *     ),
 *   },
 * };
 *
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
 */
declare const BreakoutRoomsModal: React.FC<BreakoutRoomsModalOptions>;
export default BreakoutRoomsModal;
//# sourceMappingURL=BreakoutRoomsModal.d.ts.map