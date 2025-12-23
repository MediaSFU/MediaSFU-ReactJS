
 
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTimes, faPlus, faPlay, faSyncAlt, faStop, faDoorOpen, faSave, faRandom, faUsers, faHandPointer } from '@fortawesome/free-solid-svg-icons';
import { BreakoutParticipant, Participant, ShowAlert } from '../../@types/types';
import { Socket } from 'socket.io-client';
import { ModalRenderMode } from '../menuComponents/MenuModal';


interface RoomOptions {
  rooms: BreakoutParticipant[][];
  handleEditRoom: (roomIndex: number) => void;
  handleDeleteRoom: (roomIndex: number) => void;
  handleRemoveParticipant: (roomIndex: number, participant: BreakoutParticipant) => void;
}

interface EditRoomModalOptions {
  editRoomModalVisible: boolean;
  setEditRoomModalVisible: (visible: boolean) => void;
  currentRoom: BreakoutParticipant[] | null;
  participantsRef: React.MutableRefObject<Participant[]>;
  handleAddParticipant: (roomIndex: number, participant: (Participant | BreakoutParticipant)) => void;
  handleRemoveParticipant: (roomIndex: number, participant: (Participant | BreakoutParticipant)) => void;
  currentRoomIndex: number | null;
}

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
  renderHeader?: (options: { defaultHeader: React.ReactNode }) => React.ReactNode;
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
  renderBody?: (options: { defaultBody: React.ReactNode }) => React.ReactNode;
  renderContent?: (options: { defaultContent: React.ReactNode }) => React.ReactNode;
  /** Theme control - whether dark mode is active */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects (modern UI) */
  enableGlassmorphism?: boolean;
  /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
  renderMode?: ModalRenderMode;
}

// Export the type definition for the function
export type BreakoutRoomsModalType = (options: BreakoutRoomsModalOptions) => React.JSX.Element;

// RoomList component with types
const RoomList: React.FC<RoomOptions> = ({ rooms, handleEditRoom, handleDeleteRoom, handleRemoveParticipant }) => {
  return (
    <>
      {rooms.map((room, roomIndex) => (
        <div className="card mb-3 text-dark" key={roomIndex}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Room {roomIndex + 1} <FontAwesomeIcon icon={faUsers} /></span>
            <div>
              <button className="btn btn-secondary btn-sm" onClick={() => handleEditRoom(roomIndex)}>
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRoom(roomIndex)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
          <div className="card-body">
            <ul className="list-group">
              {room.map((participant, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center text-dark">
                  {participant.name}
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemoveParticipant(roomIndex, participant)}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

// EditRoomModal component with types
const EditRoomModal: React.FC<EditRoomModalOptions> = ({
  editRoomModalVisible,
  setEditRoomModalVisible,
  currentRoom,
  participantsRef,
  handleAddParticipant,
  handleRemoveParticipant,
  currentRoomIndex,
}) => {
  const modalContainerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: editRoomModalVisible ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: '500px',
    maxHeight: '80%',
    overflowY: 'auto',
  };

  const listContainerStyle = {
    border: '1px solid #ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div className="modal-header">
          <h5 className="modal-title">
            Edit Room {currentRoomIndex! + 1} <FontAwesomeIcon icon={faPen} />
          </h5>
          <button type="button" className="close" onClick={() => setEditRoomModalVisible(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-body">
          <div style={listContainerStyle}>
            <h5>
              Assigned Participants <FontAwesomeIcon icon={faUsers} />
            </h5>
            <ul className="list-group">
              {currentRoom && currentRoom.length > 0 ? (
                currentRoom.map((participant, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center text-dark">
                    {participant.name}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveParticipant(currentRoomIndex!, participant)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </li>
                ))
              ) : (
                <li className="list-group-item d-flex justify-content-between align-items-center text-dark">
                  None assigned
                </li>
              )}
            </ul>
          </div>
          <div style={listContainerStyle}>
            <h5>
              Unassigned Participants <FontAwesomeIcon icon={faUsers} />
            </h5>
            <ul className="list-group">
              {participantsRef.current
                .filter((participant) => participant.breakRoom == null)
                .length > 0 ? (
                participantsRef.current
                  .filter((participant) => participant.breakRoom == null)
                  .map((participant, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center text-dark"
                    >
                      {participant.name}
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddParticipant(currentRoomIndex!, participant)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </li>
                  ))
              ) : (
                <li className="list-group-item d-flex justify-content-between align-items-center text-dark">
                  None pending
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setEditRoomModalVisible(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// BreakoutRoomsModal component with types
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
const BreakoutRoomsModal: React.FC<BreakoutRoomsModalOptions> = ({
  isVisible,
  onBreakoutRoomsClose,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
  title = (
    <>
      Breakout Rooms <FontAwesomeIcon icon={faDoorOpen} />
    </>
  ),
  overlayProps,
  contentProps,
  headerProps,
  titleProps,
  closeButtonProps,
  closeIconComponent,
  headerDividerProps,
  bodyProps,
  controlsWrapperProps,
  numRoomsFieldProps,
  numRoomsLabelProps,
  numRoomsInputProps,
  actionsWrapperProps,
  randomAssignButtonProps,
  manualAssignButtonProps,
  addRoomButtonProps,
  saveRoomsButtonProps,
  newParticipantFieldProps,
  newParticipantLabelProps,
  newParticipantSelectProps,
  roomsContainerProps,
  startButtonProps,
  stopButtonProps,
  numRoomsLabel,
  newParticipantActionLabel,
  randomAssignButtonLabel,
  manualAssignButtonLabel,
  addRoomButtonLabel,
  saveRoomsButtonLabel,
  startBreakoutButtonLabel,
  updateBreakoutButtonLabel,
  stopBreakoutButtonLabel,
  renderHeader,
  renderControls,
  renderRoomList,
  renderStartButton,
  renderStopButton,
  renderBody,
  renderContent,
}) => {
  const {
    participants,
    showAlert,
    socket,
    localSocket,
    itemPageLimit,
    meetingDisplayType,
    prevMeetingDisplayType,
    roomName,
    shareScreenStarted,
    shared,
    breakOutRoomStarted,
    breakOutRoomEnded,
    currentRoomIndex,
    canStartBreakout,
    breakoutRooms,
    updateBreakOutRoomStarted,
    updateBreakOutRoomEnded,
    updateCurrentRoomIndex,
    updateCanStartBreakout,
    updateBreakoutRooms,
    updateMeetingDisplayType,
  } = parameters;

  const participantsRef = useRef<Participant[]>(participants);
  const breakoutRoomsRef = useRef<BreakoutParticipant[][]>(breakoutRooms && breakoutRooms.length > 0 ? [...breakoutRooms] : []);

  const [numRooms, setNumRooms] = useState<string>('');
  const [newParticipantAction, setNewParticipantAction] = useState<string>('autoAssignNewRoom');
  const [currentRoom, setCurrentRoom] = useState<BreakoutParticipant[]>([]);
  const [editRoomModalVisible, setEditRoomModalVisible] = useState<boolean>(false);

  const [startBreakoutButtonVisible, setStartBreakoutButtonVisible] = useState<boolean>(false);
  const [stopBreakoutButtonVisible, setStopBreakoutButtonVisible] = useState<boolean>(false);

  const defaultOverlayWidth =
    typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.9, 600) : 360;

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = [
    'mediasfu-breakout-modal',
    overlayClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isVisible ? 'block' : 'none',
    zIndex: 999,
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = [
    'mediasfu-breakout-modal__content',
    contentClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const contentStyle: React.CSSProperties = {
    position: 'fixed',
    backgroundColor,
    borderRadius: 10,
    padding: 16,
    width: defaultOverlayWidth,
    maxHeight: '65%',
    maxWidth: defaultOverlayWidth,
    overflow: 'hidden',
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
    ...contentStyleOverrides,
  };

  const {
    className: headerClassName,
    style: headerStyleOverrides,
    ...restHeaderProps
  } = headerProps ?? {};

  const headerClassNames = [
    'modal-header',
    headerClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    ...headerStyleOverrides,
  };

  const {
    className: titleClassName,
    style: titleStyleOverrides,
    ...restTitleProps
  } = titleProps ?? {};

  const titleClassNames = [
    'modal-title',
    titleClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'black',
    ...titleStyleOverrides,
  };

  const {
    className: closeButtonClassName,
    style: closeButtonStyleOverrides,
    onClick: closeButtonOnClick,
    ...restCloseButtonProps
  } = closeButtonProps ?? {};

  const closeButtonClassNames = [
    'btn-close-breakout',
    closeButtonClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: 4,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    ...closeButtonStyleOverrides,
  };

  const defaultCloseIcon = closeIconComponent ?? (
    <FontAwesomeIcon icon={faTimes} className="icon" />
  );

  const handleCloseClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    closeButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      onBreakoutRoomsClose();
    }
  };

  const {
    style: headerDividerStyleOverrides,
    ...restHeaderDividerProps
  } = headerDividerProps ?? {};

  const headerDividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: 'black',
    marginTop: 5,
    marginBottom: 5,
    border: 'none',
    ...headerDividerStyleOverrides,
  };

  const {
    className: bodyClassName,
    style: bodyStyleOverrides,
    ...restBodyProps
  } = bodyProps ?? {};

  const bodyClassNames = [
    'modal-body',
    bodyClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const bodyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingRight: 4,
    ...bodyStyleOverrides,
  };

  const {
    className: controlsWrapperClassName,
    style: controlsWrapperStyleOverrides,
    ...restControlsWrapperProps
  } = controlsWrapperProps ?? {};

  const controlsWrapperClassNames = [
    'breakout-modal__controls',
    controlsWrapperClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const controlsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    ...controlsWrapperStyleOverrides,
  };

  const {
    className: numRoomsFieldClassName,
    style: numRoomsFieldStyleOverrides,
    ...restNumRoomsFieldProps
  } = numRoomsFieldProps ?? {};

  const numRoomsFieldClassNames = [
    'form-group',
    numRoomsFieldClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const numRoomsFieldStyle: React.CSSProperties = {
    ...numRoomsFieldStyleOverrides,
  };

  const {
    className: numRoomsLabelClassName,
    style: numRoomsLabelStyleOverrides,
    ...restNumRoomsLabelProps
  } = numRoomsLabelProps ?? {};

  const numRoomsLabelClassNames = [
    numRoomsLabelClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const numRoomsLabelStyle: React.CSSProperties = {
    fontWeight: 600,
    ...numRoomsLabelStyleOverrides,
  };

  const {
    className: numRoomsInputClassName,
    style: numRoomsInputStyleOverrides,
    ...restNumRoomsInputProps
  } = numRoomsInputProps ?? {};

  const numRoomsInputClassNames = [
    'form-control',
    numRoomsInputClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const numRoomsInputStyle: React.CSSProperties = {
    ...numRoomsInputStyleOverrides,
  };

  const {
    className: newParticipantFieldClassName,
    style: newParticipantFieldStyleOverrides,
    ...restNewParticipantFieldProps
  } = newParticipantFieldProps ?? {};

  const newParticipantFieldClassNames = [
    'form-group',
    newParticipantFieldClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const newParticipantFieldStyle: React.CSSProperties = {
    ...newParticipantFieldStyleOverrides,
  };

  const {
    className: newParticipantLabelClassName,
    style: newParticipantLabelStyleOverrides,
    ...restNewParticipantLabelProps
  } = newParticipantLabelProps ?? {};

  const newParticipantLabelClassNames = [
    newParticipantLabelClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const newParticipantLabelStyle: React.CSSProperties = {
    fontWeight: 600,
    ...newParticipantLabelStyleOverrides,
  };

  const {
    className: newParticipantSelectClassName,
    style: newParticipantSelectStyleOverrides,
    ...restNewParticipantSelectProps
  } = newParticipantSelectProps ?? {};

  const newParticipantSelectClassNames = [
    'form-control',
    newParticipantSelectClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const newParticipantSelectStyle: React.CSSProperties = {
    ...newParticipantSelectStyleOverrides,
  };

  const {
    className: roomsContainerClassName,
    style: roomsContainerStyleOverrides,
    ...restRoomsContainerProps
  } = roomsContainerProps ?? {};

  const roomsContainerClassNames = [
    'breakout-modal__rooms',
    roomsContainerClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const roomsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    ...roomsContainerStyleOverrides,
  };

  const {
    className: actionsWrapperClassName,
    style: actionsWrapperStyleOverrides,
    ...restActionsWrapperProps
  } = actionsWrapperProps ?? {};

  const actionsWrapperClassNames = [
    'breakout-modal__actions',
    'form-group',
    'd-flex',
    'justify-content-between',
    'align-items-center',
    actionsWrapperClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const actionsWrapperStyle: React.CSSProperties = {
    gap: 8,
    flexWrap: 'wrap',
    ...actionsWrapperStyleOverrides,
  };

  const {
    className: randomAssignButtonClassName,
    style: randomAssignButtonStyleOverrides,
    onClick: randomAssignButtonOnClick,
    ...restRandomAssignButtonProps
  } = randomAssignButtonProps ?? {};

  const randomAssignButtonClassNames = [
    'btn',
    'btn-primary',
    randomAssignButtonClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const randomAssignButtonStyle: React.CSSProperties = {
    ...randomAssignButtonStyleOverrides,
  };

  const {
    className: manualAssignButtonClassName,
    style: manualAssignButtonStyleOverrides,
    onClick: manualAssignButtonOnClick,
    ...restManualAssignButtonProps
  } = manualAssignButtonProps ?? {};

  const manualAssignButtonClassNames = [
    'btn',
    'btn-secondary',
    manualAssignButtonClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const manualAssignButtonStyle: React.CSSProperties = {
    ...manualAssignButtonStyleOverrides,
  };

  const {
    className: addRoomButtonClassName,
    style: addRoomButtonStyleOverrides,
    onClick: addRoomButtonOnClick,
    ...restAddRoomButtonProps
  } = addRoomButtonProps ?? {};

  const addRoomButtonClassNames = [
    'btn',
    'btn-success',
    addRoomButtonClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const addRoomButtonStyle: React.CSSProperties = {
    ...addRoomButtonStyleOverrides,
  };

  const {
    className: saveRoomsButtonClassName,
    style: saveRoomsButtonStyleOverrides,
    onClick: saveRoomsButtonOnClick,
    ...restSaveRoomsButtonProps
  } = saveRoomsButtonProps ?? {};

  const saveRoomsButtonClassNames = [
    'btn',
    'btn-info',
    saveRoomsButtonClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const saveRoomsButtonStyle: React.CSSProperties = {
    ...saveRoomsButtonStyleOverrides,
  };

  const {
    className: startButtonClassName,
    style: startButtonStyleOverrides,
    onClick: startButtonOnClick,
    ...restStartButtonProps
  } = startButtonProps ?? {};

  const startButtonClassNames = [
    'btn',
    'btn-primary',
    'mr-2',
    'mb-2',
    startButtonClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const startButtonStyle: React.CSSProperties = {
    ...startButtonStyleOverrides,
  };

  const {
    className: stopButtonClassName,
    style: stopButtonStyleOverrides,
    onClick: stopButtonOnClick,
    ...restStopButtonProps
  } = stopButtonProps ?? {};

  const stopButtonClassNames = [
    'btn',
    'btn-danger',
    'mr-2',
    'mb-2',
    stopButtonClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const stopButtonStyle: React.CSSProperties = {
    ...stopButtonStyleOverrides,
  };

  const roomsContainerRef = useRef<HTMLDivElement | null>(null);

  const checkCanStartBreakout = () => {
    if (canStartBreakout) {
      setStartBreakoutButtonVisible(true);
      setStopBreakoutButtonVisible(breakOutRoomStarted && !breakOutRoomEnded);
    } else {
      setStartBreakoutButtonVisible(false);
      setStopBreakoutButtonVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      const filteredParticipants = participants.filter((participant: Participant) => participant.islevel != '2');
      participantsRef.current = filteredParticipants;
      breakoutRoomsRef.current = breakoutRooms && breakoutRooms.length > 0 ? [...breakoutRooms] : [];
      checkCanStartBreakout();
    }
  }, [isVisible]);

  const handleRandomAssign = () => {
    const numRoomsInt = parseInt(numRooms);
    if (!numRoomsInt || numRoomsInt <= 0) {
      showAlert?.({ message: 'Please enter a valid number of rooms', type: 'danger' });
      return;
    }

    const newBreakoutRooms: BreakoutParticipant[][] = Array.from({ length: numRoomsInt }, () => []);
    const shuffledParticipants = [...participantsRef.current].sort(() => 0.5 - Math.random());

    shuffledParticipants.forEach((participant, index) => {
      const roomIndex = index % numRoomsInt;
      if (newBreakoutRooms[roomIndex].length < itemPageLimit) {
        const participant_: BreakoutParticipant = { name: participant.name, breakRoom: roomIndex };
        newBreakoutRooms[roomIndex].push(participant_);
        participant.breakRoom = roomIndex;
      } else {
        for (let i = 0; i < numRoomsInt; i++) {
          if (newBreakoutRooms[i].length < itemPageLimit) {
            newBreakoutRooms[i].push(participant);
            participant.breakRoom = i;
            break;
          }
        }
      }
    });
    breakoutRoomsRef.current = newBreakoutRooms;
    checkCanStartBreakout();
  };

  const handleManualAssign = () => {
    const numRoomsInt = parseInt(numRooms);
    if (!numRoomsInt || numRoomsInt <= 0) {
      showAlert?.({ message: 'Please enter a valid number of rooms', type: 'danger' });
      return;
    }

    breakoutRoomsRef.current = Array.from({ length: numRoomsInt }, () => []);
    updateCanStartBreakout(false);
    checkCanStartBreakout();
  };

  const handleAddRoom = () => {
    breakoutRoomsRef.current = [...breakoutRoomsRef.current, []];
    updateCanStartBreakout(false);
    checkCanStartBreakout();
  };

  const handleSaveRooms = () => {
    if (validateRooms()) {
      updateBreakoutRooms(breakoutRoomsRef.current);
      updateCanStartBreakout(true);
      checkCanStartBreakout();
      showAlert?.({ message: 'Rooms saved successfully', type: 'success' });
    } else {
      showAlert?.({ message: 'Rooms validation failed', type: 'danger' });
    }
  };

  const validateRooms = (): boolean => {
    if (breakoutRoomsRef.current.length === 0) {
      showAlert?.({ message: 'There must be at least one room', type: 'danger' });
      return false;
    }

    for (let room of breakoutRoomsRef.current) {
      if (room.length === 0) {
        showAlert?.({ message: 'Rooms must not be empty', type: 'danger' });
        return false;
      }

      const participantNames = room.map((p) => p.name);
      const uniqueNames = new Set(participantNames);
      if (participantNames.length !== uniqueNames.size) {
        showAlert?.({ message: 'Duplicate participant names in a room', type: 'danger' });
        return false;
      }

      if (room.length > itemPageLimit) {
        showAlert?.({ message: 'A room exceeds the participant limit', type: 'danger' });
        return false;
      }
    }

    return true;
  };

  const handleStartBreakout = () => {
    if (shareScreenStarted || shared) {
      showAlert?.({ message: 'You cannot start breakout rooms while screen sharing is active', type: 'danger' });
      return;
    }

    if (canStartBreakout) {
      const emitName = breakOutRoomStarted && !breakOutRoomEnded ? 'updateBreakout' : 'startBreakout';
      const filteredBreakoutRooms = breakoutRoomsRef.current.map((room) =>
        room.map(({ name, breakRoom }) => ({ name, breakRoom }))
      );
      socket.emit(emitName, { breakoutRooms: filteredBreakoutRooms, newParticipantAction, roomName }, (response: { success: boolean; reason: string }) => {
        if (response.success) {
          showAlert?.({ message: 'Breakout rooms active', type: 'success' });
          updateBreakOutRoomStarted(true);
          updateBreakOutRoomEnded(false);
          onBreakoutRoomsClose();
          if (meetingDisplayType !== 'all') {
            updateMeetingDisplayType('all');
          }
        } else {
          showAlert?.({ message: response.reason, type: 'danger' });
        }
      });

      if (localSocket && localSocket.id) {
        try {
          localSocket.emit(emitName, { breakoutRooms: filteredBreakoutRooms, newParticipantAction, roomName }, (response: { success: boolean; reason: string }) => {
            if (response.success) {
              // do nothing
            }
          });
        } catch {
          console.log('Error starting local breakout rooms:');
        }
      }
    }
  };

  const handleStopBreakout = () => {
    socket.emit('stopBreakout', { roomName }, (response: { success: boolean; reason: string }) => {
      if (response.success) {
        showAlert?.({ message: 'Breakout rooms stopped', type: 'success' });
        updateBreakOutRoomStarted(false);
        updateBreakOutRoomEnded(true);
        onBreakoutRoomsClose();
        if (meetingDisplayType !== prevMeetingDisplayType) {
          updateMeetingDisplayType(prevMeetingDisplayType);
        }
      } else {
        showAlert?.({ message: response.reason, type: 'danger' });
      }
    });

    if (localSocket && localSocket.id) {
      try {
        localSocket.emit('stopBreakout', { roomName }, (response: { success: boolean; reason: string }) => {
          if (response.success) {
            // do nothing
          }
        });
      } catch {
        console.log('Error stopping local breakout rooms:');
      }
    }
  };

  const handleEditRoom = (roomIndex: number) => {
    updateCurrentRoomIndex(roomIndex);
    setCurrentRoom(breakoutRoomsRef.current[roomIndex]);
    setEditRoomModalVisible(true);
    updateCanStartBreakout(false);
    checkCanStartBreakout();
  };

  const handleDeleteRoom = (roomIndex: number) => {
    const room = breakoutRoomsRef.current[roomIndex];
    room.forEach((participant) => (participant.breakRoom = null));
    const newBreakoutRooms = [...breakoutRoomsRef.current];
    newBreakoutRooms.splice(roomIndex, 1);

    newBreakoutRooms.forEach((room, index) => {
      room.forEach((participant) => (participant.breakRoom = index));
    });

    breakoutRoomsRef.current = newBreakoutRooms;
    checkCanStartBreakout();
  };

  const handleAddParticipant = (roomIndex: number, participant: (Participant | BreakoutParticipant)) => {
    if (breakoutRoomsRef.current[roomIndex].length < itemPageLimit) {
      const newBreakoutRooms = [...breakoutRoomsRef.current];
      const participant_: BreakoutParticipant = { name: participant.name, breakRoom: roomIndex };
      newBreakoutRooms[roomIndex].push(participant_);
      breakoutRoomsRef.current = newBreakoutRooms;
      participant.breakRoom = roomIndex;
      if (currentRoomIndex != null) {
        handleEditRoom(currentRoomIndex);
      }
    } else {
      showAlert?.({ message: 'Room is full', type: 'danger' });
    }
  };

  const handleRemoveParticipant = (roomIndex: number, participant: (Participant | BreakoutParticipant)) => {
    const newBreakoutRooms = [...breakoutRoomsRef.current];
    newBreakoutRooms[roomIndex] = newBreakoutRooms[roomIndex].filter((p) => p !== participant);
    breakoutRoomsRef.current = newBreakoutRooms;
    participant.breakRoom = null;
    if (currentRoomIndex != null) {
      handleEditRoom(currentRoomIndex);
    }
  };

  const numRoomsLabelNode =
    numRoomsLabel ?? (
      <>
        Number of Rooms <FontAwesomeIcon icon={faUsers} />
      </>
    );

  const newParticipantLabelNode =
    newParticipantActionLabel ?? (
      <>
        New Participant Action <FontAwesomeIcon icon={faUsers} />
      </>
    );

  const randomAssignLabelNode =
    randomAssignButtonLabel ?? (
      <>
        Random Assign <FontAwesomeIcon icon={faRandom} />
      </>
    );

  const manualAssignLabelNode =
    manualAssignButtonLabel ?? (
      <>
        Manual Assign <FontAwesomeIcon icon={faHandPointer} />
      </>
    );

  const addRoomLabelNode =
    addRoomButtonLabel ?? (
      <>
        Add Room <FontAwesomeIcon icon={faPlus} />
      </>
    );

  const saveRoomsLabelNode =
    saveRoomsButtonLabel ?? (
      <>
        Save Rooms <FontAwesomeIcon icon={faSave} />
      </>
    );

  const isUpdatingBreakout = breakOutRoomStarted && !breakOutRoomEnded;

  const startBreakoutLabelNode = isUpdatingBreakout
    ? updateBreakoutButtonLabel ?? (
        <>
          Update Breakout <FontAwesomeIcon icon={faSyncAlt} />
        </>
      )
    : startBreakoutButtonLabel ?? (
        <>
          Start Breakout <FontAwesomeIcon icon={faPlay} />
        </>
      );

  const stopBreakoutLabelNode =
    stopBreakoutButtonLabel ?? (
      <>
        Stop Breakout <FontAwesomeIcon icon={faStop} />
      </>
    );

  const handleRandomAssignClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    randomAssignButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      handleRandomAssign();
    }
  };

  const handleManualAssignClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    manualAssignButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      handleManualAssign();
    }
  };

  const handleAddRoomClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    addRoomButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      handleAddRoom();
    }
  };

  const handleSaveRoomsClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    saveRoomsButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      handleSaveRooms();
    }
  };

  const handleStartBreakoutClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    startButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      handleStartBreakout();
    }
  };

  const handleStopBreakoutClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    stopButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      handleStopBreakout();
    }
  };

  const buildHeader = () => {
    const defaultHeader = (
      <div className={headerClassNames} style={headerStyle} {...restHeaderProps}>
        <h2 className={titleClassNames} style={titleStyle} {...restTitleProps}>
          {title}
        </h2>
        <button
          type="button"
          className={closeButtonClassNames}
          style={closeButtonStyle}
          onClick={handleCloseClick}
          {...restCloseButtonProps}
        >
          {defaultCloseIcon}
        </button>
      </div>
    );

    return renderHeader ? renderHeader({ defaultHeader }) : defaultHeader;
  };

  const buildControls = () => {
    const defaultControls = (
      <div className={controlsWrapperClassNames} style={controlsWrapperStyle} {...restControlsWrapperProps}>
        <div
          className={numRoomsFieldClassNames}
          style={numRoomsFieldStyle}
          {...restNumRoomsFieldProps}
        >
          <label
            htmlFor="numRooms"
            className={numRoomsLabelClassNames}
            style={numRoomsLabelStyle}
            {...restNumRoomsLabelProps}
          >
            {numRoomsLabelNode}
          </label>
          <input
            type="number"
            id="numRooms"
            className={numRoomsInputClassNames}
            style={numRoomsInputStyle}
            value={numRooms}
            onChange={(e) => setNumRooms(e.target.value)}
            {...restNumRoomsInputProps}
          />
        </div>
        <div
          className={actionsWrapperClassNames}
          style={actionsWrapperStyle}
          {...restActionsWrapperProps}
        >
          <button
            type="button"
            className={randomAssignButtonClassNames}
            style={randomAssignButtonStyle}
            onClick={handleRandomAssignClick}
            {...restRandomAssignButtonProps}
          >
            {randomAssignLabelNode}
          </button>
          <button
            type="button"
            className={manualAssignButtonClassNames}
            style={manualAssignButtonStyle}
            onClick={handleManualAssignClick}
            {...restManualAssignButtonProps}
          >
            {manualAssignLabelNode}
          </button>
          <button
            type="button"
            className={addRoomButtonClassNames}
            style={addRoomButtonStyle}
            onClick={handleAddRoomClick}
            {...restAddRoomButtonProps}
          >
            {addRoomLabelNode}
          </button>
          <button
            type="button"
            className={saveRoomsButtonClassNames}
            style={saveRoomsButtonStyle}
            onClick={handleSaveRoomsClick}
            {...restSaveRoomsButtonProps}
          >
            {saveRoomsLabelNode}
          </button>
        </div>
        <div
          className={newParticipantFieldClassNames}
          style={newParticipantFieldStyle}
          {...restNewParticipantFieldProps}
        >
          <label
            htmlFor="newParticipantAction"
            className={newParticipantLabelClassNames}
            style={newParticipantLabelStyle}
            {...restNewParticipantLabelProps}
          >
            {newParticipantLabelNode}
          </label>
          <select
            id="newParticipantAction"
            className={newParticipantSelectClassNames}
            style={newParticipantSelectStyle}
            value={newParticipantAction}
            onChange={(e) => setNewParticipantAction(e.target.value)}
            {...restNewParticipantSelectProps}
          >
            <option value="autoAssignNewRoom">Add to new room</option>
            <option value="autoAssignAvailableRoom">Add to open room</option>
            <option value="manualAssign">No action</option>
          </select>
        </div>
      </div>
    );

    return renderControls ? renderControls({ defaultControls }) : defaultControls;
  };

  const defaultRoomList = (
    <div
      ref={roomsContainerRef}
      className={roomsContainerClassNames}
      style={roomsContainerStyle}
      {...restRoomsContainerProps}
    >
      <RoomList
        rooms={breakoutRoomsRef.current}
        handleEditRoom={handleEditRoom}
        handleDeleteRoom={handleDeleteRoom}
        handleRemoveParticipant={handleRemoveParticipant}
      />
    </div>
  );

  const roomListNode = renderRoomList
    ? renderRoomList({
        defaultRoomList,
        rooms: breakoutRoomsRef.current,
      })
    : defaultRoomList;

  const defaultStartButton = !startBreakoutButtonVisible
    ? null
    : (
        <button
          type="button"
          className={startButtonClassNames}
          style={startButtonStyle}
          onClick={handleStartBreakoutClick}
          {...restStartButtonProps}
        >
          {startBreakoutLabelNode}
        </button>
      );

  const startButtonNode = renderStartButton
    ? renderStartButton({
        defaultStartButton,
        isUpdating: isUpdatingBreakout,
      })
    : defaultStartButton;

  const defaultStopButton = !stopBreakoutButtonVisible
    ? null
    : (
        <button
          type="button"
          className={stopButtonClassNames}
          style={stopButtonStyle}
          onClick={handleStopBreakoutClick}
          {...restStopButtonProps}
        >
          {stopBreakoutLabelNode}
        </button>
      );

  const stopButtonNode = renderStopButton
    ? renderStopButton({ defaultStopButton })
    : defaultStopButton;

  const headerNode = buildHeader();
  const controlsNode = buildControls();

  const defaultBody = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
      {controlsNode}
      {roomListNode}
      {startButtonNode}
      {stopButtonNode}
    </div>
  );

  const bodyNode = renderBody ? renderBody({ defaultBody }) : defaultBody;

  const defaultContent = (
    <div className={contentClassNames} style={contentStyle} {...restContentProps}>
      {headerNode}
      <hr style={headerDividerStyle} {...restHeaderDividerProps} />
      {bodyNode}
    </div>
  );

  const contentNode = renderContent ? renderContent({ defaultContent }) : defaultContent;

  return (
    <>
      <div className={overlayClassNames} style={overlayStyle} {...restOverlayProps}>
        {contentNode}
      </div>
      <EditRoomModal
        editRoomModalVisible={editRoomModalVisible}
        setEditRoomModalVisible={setEditRoomModalVisible}
        currentRoom={currentRoom}
        participantsRef={participantsRef}
        handleAddParticipant={handleAddParticipant}
        handleRemoveParticipant={handleRemoveParticipant}
        currentRoomIndex={currentRoomIndex}
      />
    </>
  );
};

export default BreakoutRoomsModal;
