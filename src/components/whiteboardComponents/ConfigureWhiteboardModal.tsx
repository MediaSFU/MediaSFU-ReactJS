import React, { useState, useEffect, useRef, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCheck,
  faSyncAlt,
  faPlay,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { Socket } from "socket.io-client";
import {
  CaptureCanvasStreamParameters,
  CaptureCanvasStreamType,
  EventType,
  OnScreenChangesParameters,
  OnScreenChangesType,
  Participant,
  PrepopulateUserMediaParameters,
  PrepopulateUserMediaType,
  RePortParameters,
  RePortType,
  ShowAlert,
  WhiteboardUpdatedData,
  WhiteboardUser
} from "../../@types/types";

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(" ").trim();
  return filtered.length > 0 ? filtered : undefined;
};

export interface ConfigureWhiteboardModalParameters
  extends OnScreenChangesParameters,
    CaptureCanvasStreamParameters,
    PrepopulateUserMediaParameters,
    RePortParameters {
  participants: Participant[];
  showAlert?: ShowAlert;
  socket: Socket;
  itemPageLimit: number;
  islevel: string;
  roomName: string;
  eventType: EventType;
  shareScreenStarted: boolean;
  shared: boolean;
  breakOutRoomStarted: boolean;
  breakOutRoomEnded: boolean;
  recordStarted: boolean;
  recordResumed: boolean;
  recordPaused: boolean;
  recordStopped: boolean;
  recordingMediaOptions: string;
  canStartWhiteboard: boolean;
  whiteboardStarted: boolean;
  whiteboardEnded: boolean;
  hostLabel: string;
  updateWhiteboardStarted: (started: boolean) => void;
  updateWhiteboardEnded: (ended: boolean) => void;
  updateWhiteboardUsers: (users: WhiteboardUser[]) => void;
  updateCanStartWhiteboard: (canStart: boolean) => void;
  updateIsConfigureWhiteboardModalVisible: (isVisible: boolean) => void;

  // mediasfu functions
  onScreenChanges: OnScreenChangesType;
  captureCanvasStream: CaptureCanvasStreamType;
  prepopulateUserMedia: PrepopulateUserMediaType;
  rePort: RePortType;

  getUpdatedAllParams: () => ConfigureWhiteboardModalParameters;
  [key: string]: any;
}

export interface ConfigureWhiteboardModalOptions {
  isVisible: boolean;
  onConfigureWhiteboardClose: () => void;
  parameters: ConfigureWhiteboardModalParameters;
  backgroundColor?: string;
  position?: string;
  title?: React.ReactNode;
  overlayProps?: React.HTMLAttributes<HTMLDivElement>;
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  titleProps?: React.HTMLAttributes<HTMLHeadingElement>;
  closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  closeIconComponent?: React.ReactNode;
  headerDividerProps?: React.HTMLAttributes<HTMLHRElement>;
  bodyProps?: React.HTMLAttributes<HTMLDivElement>;
  listsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  assignedSectionProps?: React.HTMLAttributes<HTMLDivElement>;
  pendingSectionProps?: React.HTMLAttributes<HTMLDivElement>;
  assignedTitleProps?: React.HTMLAttributes<HTMLHeadingElement>;
  pendingTitleProps?: React.HTMLAttributes<HTMLHeadingElement>;
  assignedListProps?: React.HTMLAttributes<HTMLUListElement>;
  pendingListProps?: React.HTMLAttributes<HTMLUListElement>;
  assignedItemProps?: React.LiHTMLAttributes<HTMLLIElement>;
  pendingItemProps?: React.LiHTMLAttributes<HTMLLIElement>;
  assignedActionButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  pendingActionButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  footerProps?: React.HTMLAttributes<HTMLDivElement>;
  saveButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  actionsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  startButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  updateButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  stopButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  sectionDividerProps?: React.HTMLAttributes<HTMLHRElement>;
  assignedTitle?: React.ReactNode;
  pendingTitle?: React.ReactNode;
  saveButtonLabel?: React.ReactNode;
  startButtonLabel?: React.ReactNode;
  updateButtonLabel?: React.ReactNode;
  stopButtonLabel?: React.ReactNode;
  addIcon?: React.ReactNode;
  removeIcon?: React.ReactNode;
  saveIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  updateIcon?: React.ReactNode;
  stopIcon?: React.ReactNode;
  emptyAssignedState?:
    | React.ReactNode
    | ((context: { participants: Participant[] }) => React.ReactNode);
  emptyPendingState?:
    | React.ReactNode
    | ((context: { participants: Participant[] }) => React.ReactNode);
  renderTitle?: (options: {
    defaultTitle: React.ReactNode;
  }) => React.ReactNode;
  renderHeader?: (options: {
    defaultHeader: React.ReactNode;
  }) => React.ReactNode;
  renderLists?: (options: {
    defaultLists: React.ReactNode;
    assignedParticipants: Participant[];
    pendingParticipants: Participant[];
  }) => React.ReactNode;
  renderAssignedList?: (options: {
    defaultAssignedList: React.ReactNode;
    participants: Participant[];
    removeParticipant: (participant: Participant) => void;
  }) => React.ReactNode;
  renderPendingList?: (options: {
    defaultPendingList: React.ReactNode;
    participants: Participant[];
    addParticipant: (participant: Participant) => void;
  }) => React.ReactNode;
  renderAssignedItem?: (options: {
    defaultItem: React.ReactNode;
    participant: Participant;
    remove: () => void;
    index: number;
  }) => React.ReactNode;
  renderPendingItem?: (options: {
    defaultItem: React.ReactNode;
    participant: Participant;
    add: () => void;
    index: number;
  }) => React.ReactNode;
  renderFooter?: (options: {
    defaultFooter: React.ReactNode;
    isEditing: boolean;
    canStartWhiteboard: boolean;
  }) => React.ReactNode;
  renderActions?: (options: {
    defaultActions: React.ReactNode;
    isEditing: boolean;
    canStartWhiteboard: boolean;
    whiteboardStarted: boolean;
    whiteboardEnded: boolean;
  }) => React.ReactNode;
  renderBody?: (options: {
    defaultBody: React.ReactNode;
    isEditing: boolean;
    assignedParticipants: Participant[];
    pendingParticipants: Participant[];
  }) => React.ReactNode;
  renderContent?: (options: {
    defaultContent: React.ReactNode;
    isEditing: boolean;
    canStartWhiteboard: boolean;
  }) => React.ReactNode;
}

export type ConfigureWhiteboardModalType = (
  options: ConfigureWhiteboardModalOptions
) => React.JSX.Element;

/**
 * ConfigureWhiteboardModal - A comprehensive modal for configuring and managing collaborative whiteboard sessions.
 * 
 * This component provides a sophisticated interface for host-controlled whiteboard management, including
 * participant selection, access control, session lifecycle management, and compatibility checks with other
 * session features like screen sharing and recording.
 * 
 * **Key Features:**
 * - **Participant Management**: Dual-list interface for assigning/removing whiteboard access from participants
 * - **Session Control**: Start, stop, and update whiteboard sessions with socket-based synchronization
 * - **Access Validation**: Automatic checks for host permissions and session state compatibility
 * - **Screen Share Integration**: Validates compatibility with active screen sharing sessions
 * - **Recording Integration**: Ensures whiteboard works correctly with recording states (started, paused, resumed, stopped)
 * - **Breakout Room Awareness**: Handles whiteboard availability during breakout room sessions
 * - **Canvas Stream Management**: Integrates with captureCanvasStream for whiteboard video streaming
 * - **User Media Sync**: Prepopulates user media when whiteboard state changes via prepopulateUserMedia
 * - **Pagination Support**: Handles large participant lists with configurable page limits
 * - **Real-time Updates**: Socket-based synchronization for whiteboard state across all participants
 * - **Granular Customization**: Extensive HTML attributes and render hooks for all UI elements
 * - **Empty States**: Custom messages for empty assigned/pending participant lists
 * - **Responsive Layout**: Flexible positioning and responsive design
 * 
 * @component
 * 
 * @param {ConfigureWhiteboardModalOptions} props - Configuration options for ConfigureWhiteboardModal
 * @param {boolean} props.isVisible - Controls modal visibility
 * @param {() => void} props.onConfigureWhiteboardClose - Callback function invoked when modal is closed
 * @param {ConfigureWhiteboardModalParameters} props.parameters - Comprehensive parameters object containing:
 *   - **State Properties**: participants, islevel, roomName, eventType, shareScreenStarted, shared, breakOutRoomStarted, breakOutRoomEnded, recordStarted, recordResumed, recordPaused, recordStopped, recordingMediaOptions, canStartWhiteboard, whiteboardStarted, whiteboardEnded, hostLabel
 *   - **Configuration**: socket, itemPageLimit
 *   - **Update Functions**: updateWhiteboardStarted, updateWhiteboardEnded, updateWhiteboardUsers, updateCanStartWhiteboard, updateIsConfigureWhiteboardModalVisible
 *   - **MediaSFU Functions**: onScreenChanges, captureCanvasStream, prepopulateUserMedia, rePort
 *   - **Optional**: showAlert (for displaying validation messages)
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color for modal content
 * @param {string} [props.position="topRight"] - Modal screen position
 * @param {React.ReactNode} [props.title] - Custom title content (default: "Configure Whiteboard")
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.overlayProps] - HTML attributes for overlay container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.contentProps] - HTML attributes for content wrapper
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.headerProps] - HTML attributes for header section
 * @param {React.HTMLAttributes<HTMLHeadingElement>} [props.titleProps] - HTML attributes for title element
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.closeButtonProps] - HTML attributes for close button
 * @param {React.ReactNode} [props.closeIconComponent] - Custom close icon component
 * @param {React.HTMLAttributes<HTMLHRElement>} [props.headerDividerProps] - HTML attributes for header divider
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.bodyProps] - HTML attributes for body section
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.listsWrapperProps] - HTML attributes for lists container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.assignedSectionProps] - HTML attributes for assigned participants section
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.pendingSectionProps] - HTML attributes for pending participants section
 * @param {React.HTMLAttributes<HTMLHeadingElement>} [props.assignedTitleProps] - HTML attributes for assigned list title
 * @param {React.HTMLAttributes<HTMLHeadingElement>} [props.pendingTitleProps] - HTML attributes for pending list title
 * @param {React.HTMLAttributes<HTMLUListElement>} [props.assignedListProps] - HTML attributes for assigned list
 * @param {React.HTMLAttributes<HTMLUListElement>} [props.pendingListProps] - HTML attributes for pending list
 * @param {React.LiHTMLAttributes<HTMLLIElement>} [props.assignedItemProps] - HTML attributes for assigned list items
 * @param {React.LiHTMLAttributes<HTMLLIElement>} [props.pendingItemProps] - HTML attributes for pending list items
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.assignedActionButtonProps] - HTML attributes for remove buttons
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.pendingActionButtonProps] - HTML attributes for add buttons
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.footerProps] - HTML attributes for footer section
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.saveButtonProps] - HTML attributes for save button
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.actionsWrapperProps] - HTML attributes for actions wrapper
 * @param {React.ButtonHTMLAttributes<HTMLButtonButton>} [props.startButtonProps] - HTML attributes for start button
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.updateButtonProps] - HTML attributes for update button
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.stopButtonProps] - HTML attributes for stop button
 * @param {React.HTMLAttributes<HTMLHRElement>} [props.sectionDividerProps] - HTML attributes for section divider
 * @param {React.ReactNode} [props.assignedTitle] - Custom title for assigned participants section
 * @param {React.ReactNode} [props.pendingTitle] - Custom title for pending participants section
 * @param {React.ReactNode} [props.saveButtonLabel] - Custom label for save button
 * @param {React.ReactNode} [props.startButtonLabel] - Custom label for start button
 * @param {React.ReactNode} [props.updateButtonLabel] - Custom label for update button
 * @param {React.ReactNode} [props.stopButtonLabel] - Custom label for stop button
 * @param {React.ReactNode} [props.addIcon] - Custom icon for add action buttons
 * @param {React.ReactNode} [props.removeIcon] - Custom icon for remove action buttons
 * @param {React.ReactNode} [props.saveIcon] - Custom icon for save button
 * @param {React.ReactNode} [props.startIcon] - Custom icon for start button
 * @param {React.ReactNode} [props.updateIcon] - Custom icon for update button
 * @param {React.ReactNode} [props.stopIcon] - Custom icon for stop button
 * @param {React.ReactNode | ((context: {participants: Participant[]}) => React.ReactNode)} [props.emptyAssignedState] - Content shown when no participants assigned
 * @param {React.ReactNode | ((context: {participants: Participant[]}) => React.ReactNode)} [props.emptyPendingState] - Content shown when no participants pending
 * @param {(options: {defaultTitle: React.ReactNode}) => React.ReactNode} [props.renderTitle] - Custom render function for title
 * @param {(options: {defaultHeader: React.ReactNode}) => React.ReactNode} [props.renderHeader] - Custom render function for header
 * @param {(options: {defaultLists: React.ReactNode; assignedParticipants: Participant[]; pendingParticipants: Participant[]}) => React.ReactNode} [props.renderLists] - Custom render function for participant lists
 * @param {(options: {defaultAssignedList: React.ReactNode; participants: Participant[]; removeParticipant: (p: Participant) => void}) => React.ReactNode} [props.renderAssignedList] - Custom render function for assigned list
 * @param {(options: {defaultPendingList: React.ReactNode; participants: Participant[]; addParticipant: (p: Participant) => void}) => React.ReactNode} [props.renderPendingList] - Custom render function for pending list
 * @param {(options: {defaultItem: React.ReactNode; participant: Participant; remove: () => void; index: number}) => React.ReactNode} [props.renderAssignedItem] - Custom render function for assigned items
 * @param {(options: {defaultItem: React.ReactNode; participant: Participant; add: () => void; index: number}) => React.ReactNode} [props.renderPendingItem] - Custom render function for pending items
 * @param {(options: {defaultFooter: React.ReactNode; isEditing: boolean; canStartWhiteboard: boolean}) => React.ReactNode} [props.renderFooter] - Custom render function for footer
 * @param {(options: {defaultActions: React.ReactNode; isEditing: boolean; canStartWhiteboard: boolean; whiteboardStarted: boolean; whiteboardEnded: boolean}) => React.ReactNode} [props.renderActions] - Custom render function for action buttons
 * @param {(options: {defaultBody: React.ReactNode; isEditing: boolean; assignedParticipants: Participant[]; pendingParticipants: Participant[]}) => React.ReactNode} [props.renderBody] - Custom render function for body
 * @param {(options: {defaultContent: React.ReactNode; isEditing: boolean; canStartWhiteboard: boolean}) => React.ReactNode} [props.renderContent] - Custom render function for entire content
 * 
 * @returns {React.JSX.Element} The rendered ConfigureWhiteboardModal component
 * 
 * @example
 * // Basic usage for whiteboard configuration
 * ```tsx
 * import React, { useState } from 'react';
 * import { ConfigureWhiteboardModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 * 
 * const BasicWhiteboardConfig = () => {
 *   const [showModal, setShowModal] = useState(true);
 *   const socket = io('https://mediasfu.com');
 * 
 *   const participants = [
 *     { id: '1', name: 'Alice', islevel: '1', useBoard: false },
 *     { id: '2', name: 'Bob', islevel: '1', useBoard: false }
 *   ];
 * 
 *   const parameters = {
 *     participants,
 *     socket,
 *     itemPageLimit: 10,
 *     islevel: '2',
 *     roomName: 'meeting-room-123',
 *     eventType: 'meeting' as const,
 *     shareScreenStarted: false,
 *     shared: false,
 *     breakOutRoomStarted: false,
 *     breakOutRoomEnded: true,
 *     recordStarted: false,
 *     recordResumed: false,
 *     recordPaused: false,
 *     recordStopped: false,
 *     recordingMediaOptions: 'video',
 *     canStartWhiteboard: true,
 *     whiteboardStarted: false,
 *     whiteboardEnded: true,
 *     hostLabel: 'Host',
 *     updateWhiteboardStarted: (started) => console.log('Whiteboard started:', started),
 *     updateWhiteboardEnded: (ended) => console.log('Whiteboard ended:', ended),
 *     updateWhiteboardUsers: (users) => console.log('Whiteboard users:', users),
 *     updateCanStartWhiteboard: (can) => console.log('Can start:', can),
 *     updateIsConfigureWhiteboardModalVisible: (visible) => setShowModal(visible),
 *     onScreenChanges: async ({ changed }) => console.log('Screen changed:', changed),
 *     captureCanvasStream: async (options) => console.log('Capture canvas stream'),
 *     prepopulateUserMedia: async ({ name }) => console.log('Prepopulate for:', name),
 *     rePort: async ({ restart }) => console.log('Report restart:', restart),
 *     getUpdatedAllParams: () => parameters
 *   };
 * 
 *   return (
 *     <ConfigureWhiteboardModal
 *       isVisible={showModal}
 *       onConfigureWhiteboardClose={() => setShowModal(false)}
 *       parameters={parameters}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Custom styled with validation alerts
 * ```tsx
 * import React, { useState } from 'react';
 * import { ConfigureWhiteboardModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 * 
 * const CustomStyledWhiteboardConfig = () => {
 *   const [showModal, setShowModal] = useState(true);
 *   const [alertMessage, setAlertMessage] = useState('');
 *   const socket = io('https://mediasfu.com');
 * 
 *   const showAlert = ({ message, type }) => {
 *     setAlertMessage(`${type}: ${message}`);
 *     setTimeout(() => setAlertMessage(''), 5000);
 *   };
 * 
 *   const parameters = {
 *     // ... (same as basic example)
 *     showAlert,
 *     getUpdatedAllParams: () => parameters
 *   };
 * 
 *   return (
 *     <>
 *       {alertMessage && <div className="alert">{alertMessage}</div>}
 *       <ConfigureWhiteboardModal
 *         isVisible={showModal}
 *         onConfigureWhiteboardClose={() => setShowModal(false)}
 *         parameters={parameters}
 *         backgroundColor="#2c3e50"
 *         position="bottomRight"
 *         assignedTitle={<h3 style={{ color: '#2ecc71' }}>✅ Whiteboard Users</h3>}
 *         pendingTitle={<h3 style={{ color: '#95a5a6' }}>👥 Available Participants</h3>}
 *         startButtonProps={{
 *           style: {
 *             backgroundColor: '#2ecc71',
 *             color: '#fff',
 *             padding: '12px 24px'
 *           }
 *         }}
 *       />
 *     </>
 *   );
 * };
 * ```
 * 
 * @example
 * // Analytics tracking for whiteboard management
 * ```tsx
 * import React, { useState } from 'react';
 * import { ConfigureWhiteboardModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 * 
 * const AnalyticsWhiteboardConfig = () => {
 *   const [showModal, setShowModal] = useState(true);
 *   const socket = io('https://mediasfu.com');
 * 
 *   const parameters = {
 *     // ... (basic parameters)
 *     updateWhiteboardStarted: (started) => {
 *       analytics.track('Whiteboard Started', {
 *         roomName: 'meeting-room-123',
 *         timestamp: new Date()
 *       });
 *     },
 *     updateWhiteboardUsers: (users) => {
 *       analytics.track('Whiteboard Users Updated', {
 *         userCount: users.length,
 *         users: users.map(u => u.name)
 *       });
 *     },
 *     getUpdatedAllParams: () => parameters
 *   };
 * 
 *   return (
 *     <ConfigureWhiteboardModal
 *       isVisible={showModal}
 *       onConfigureWhiteboardClose={() => {
 *         analytics.track('Whiteboard Config Closed');
 *         setShowModal(false);
 *       }}
 *       parameters={parameters}
 *       renderActions={({ defaultActions, whiteboardStarted }) => {
 *         React.useEffect(() => {
 *           if (whiteboardStarted) {
 *             analytics.track('Whiteboard Session Active');
 *           }
 *         }, [whiteboardStarted]);
 *         return defaultActions;
 *       }}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, ConfigureWhiteboardModal } from 'mediasfu-reactjs';
 * 
 * const CustomWhiteboardComponent = (props) => (
 *   <ConfigureWhiteboardModal
 *     {...props}
 *     position="topLeft"
 *     renderBody={({ assignedParticipants, pendingParticipants, isEditing }) => (
 *       <div className="custom-whiteboard-config">
 *         <div className="participants-stats">
 *           <div className="stat-card">
 *             <h4>{assignedParticipants.length}</h4>
 *             <p>Active on Whiteboard</p>
 *           </div>
 *           <div className="stat-card">
 *             <h4>{pendingParticipants.length}</h4>
 *             <p>Can Be Added</p>
 *           </div>
 *         </div>
 *         <div className="participants-grid">
 *           <div className="assigned-column">
 *             <h3>🎨 Whiteboard Access</h3>
 *             {assignedParticipants.map(p => (
 *               <div key={p.id} className="participant-card active">
 *                 {p.name}
 *                 {isEditing && <button>Remove</button>}
 *               </div>
 *             ))}
 *           </div>
 *           <div className="pending-column">
 *             <h3>👥 Other Participants</h3>
 *             {pendingParticipants.map(p => (
 *               <div key={p.id} className="participant-card">
 *                 {p.name}
 *                 {isEditing && <button>Add</button>}
 *               </div>
 *             ))}
 *           </div>
 *         </div>
 *       </div>
 *     )}
 *   />
 * );
 * 
 * const App = () => {
 *   const [credentials] = useState({
 *     apiUserName: 'user123',
 *     apiKey: 'your-api-key'
 *   });
 * 
 *   return (
 *     <MediasfuGeneric
 *       credentials={credentials}
 *       uiOverrides={{
 *         ConfigureWhiteboardModal: CustomWhiteboardComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 */

const ConfigureWhiteboard: React.FC<ConfigureWhiteboardModalOptions> = ({
  isVisible,
  onConfigureWhiteboardClose,
  parameters,
  backgroundColor = "#83c0e9",
  position = "topRight",
  title = "Configure Whiteboard",
  overlayProps,
  contentProps,
  headerProps,
  titleProps,
  closeButtonProps,
  closeIconComponent,
  headerDividerProps,
  bodyProps,
  listsWrapperProps,
  assignedSectionProps,
  pendingSectionProps,
  assignedTitleProps,
  pendingTitleProps,
  assignedListProps,
  pendingListProps,
  assignedItemProps,
  pendingItemProps,
  assignedActionButtonProps,
  pendingActionButtonProps,
  footerProps,
  saveButtonProps,
  actionsWrapperProps,
  startButtonProps,
  updateButtonProps,
  stopButtonProps,
  sectionDividerProps,
  assignedTitle = "Assigned",
  pendingTitle = "Pending",
  saveButtonLabel = "Save",
  startButtonLabel = "Start",
  updateButtonLabel = "Update",
  stopButtonLabel = "Stop",
  addIcon,
  removeIcon,
  saveIcon,
  startIcon,
  updateIcon,
  stopIcon,
  emptyAssignedState,
  emptyPendingState,
  renderTitle,
  renderHeader,
  renderLists,
  renderAssignedList,
  renderPendingList,
  renderAssignedItem,
  renderPendingItem,
  renderFooter,
  renderActions,
  renderBody,
  renderContent,
}) => {
  let {
    participants,
    showAlert,
    socket,
    itemPageLimit,
    islevel,
    roomName,
    eventType,
    shareScreenStarted,
    shared,
    breakOutRoomStarted,
    breakOutRoomEnded,
    recordStarted,
    recordResumed,
    recordPaused,
    recordStopped,
    recordingMediaOptions,
    canStartWhiteboard,
    whiteboardStarted,
    whiteboardEnded,
    updateWhiteboardStarted,
    updateWhiteboardEnded,
    updateWhiteboardUsers,
    updateCanStartWhiteboard,
    updateIsConfigureWhiteboardModalVisible,
    onScreenChanges,
    captureCanvasStream,
    prepopulateUserMedia,
    rePort,
    hostLabel,
  } = parameters;

  const [participantsCopy, setParticipantsCopy] = useState<Participant[]>([]);
  const [whiteboardLimit] = useState(itemPageLimit);
  const [isEditing, setIsEditing] = useState(false);

  const assignedListRef = useRef<HTMLUListElement>(null);
  const unassignedListRef = useRef<HTMLUListElement>(null);

  const defaultOverlayWidth =
    typeof window !== "undefined" ? Math.min(window.innerWidth * 0.75, 420) : 360;

  const screenPositionStyles: React.CSSProperties = {
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
  };

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayAttributes
  } = overlayProps ?? {};

  const overlayClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__overlay",
    overlayClassName
  );

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isVisible ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 999,
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentAttributes
  } = contentProps ?? {};

  const contentClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__content",
    contentClassName
  );

  const contentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor,
    borderRadius: 12,
    padding: 16,
    width: defaultOverlayWidth,
    maxHeight: "80%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxShadow: "0 12px 36px rgba(0,0,0,0.24)",
    ...screenPositionStyles,
    ...contentStyleOverrides,
  };

  const {
    className: headerClassName,
    style: headerStyleOverrides,
    ...restHeaderAttributes
  } = headerProps ?? {};

  const headerClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__header",
    headerClassName
  );

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    ...headerStyleOverrides,
  };

  const {
    className: titleClassName,
    style: titleStyleOverrides,
    children: titleChildren,
    ...restTitleAttributes
  } = titleProps ?? {};

  const titleClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__title",
    titleClassName
  );

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "black",
    ...titleStyleOverrides,
  };

  const {
    className: closeButtonClassName,
    style: closeButtonStyleOverrides,
    onClick: closeButtonOnClick,
    ...restCloseButtonAttributes
  } = closeButtonProps ?? {};

  const closeButtonClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__close",
    closeButtonClassName
  );

  const closeButtonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    padding: 4,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    ...closeButtonStyleOverrides,
  };

  const resolvedCloseIcon =
    closeIconComponent ?? <FontAwesomeIcon icon={faTimes} className="icon" />;

  const handleCloseClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    closeButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      onConfigureWhiteboardClose();
    }
  };

  const {
    style: headerDividerStyleOverrides,
    ...restHeaderDividerAttributes
  } = headerDividerProps ?? {};

  const headerDividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    border: "none",
    margin: "4px 0",
    ...headerDividerStyleOverrides,
  };

  const {
    className: bodyClassName,
    style: bodyStyleOverrides,
    ...restBodyAttributes
  } = bodyProps ?? {};

  const bodyClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__body",
    bodyClassName
  );

  const bodyStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    ...bodyStyleOverrides,
  };

  const {
    className: listsWrapperClassName,
    style: listsWrapperStyleOverrides,
    ...restListsWrapperAttributes
  } = listsWrapperProps ?? {};

  const listsWrapperClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__lists-wrapper",
    listsWrapperClassName
  );

  const listsWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
    justifyContent: "stretch",
    flexWrap: "wrap",
    ...listsWrapperStyleOverrides,
  };

  const {
    className: assignedSectionClassName,
    style: assignedSectionStyleOverrides,
    ...restAssignedSectionAttributes
  } = assignedSectionProps ?? {};

  const assignedSectionClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__assigned-section",
    assignedSectionClassName
  );

  const assignedSectionStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    ...assignedSectionStyleOverrides,
  };

  const {
    className: pendingSectionClassName,
    style: pendingSectionStyleOverrides,
    ...restPendingSectionAttributes
  } = pendingSectionProps ?? {};

  const pendingSectionClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__pending-section",
    pendingSectionClassName
  );

  const pendingSectionStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    ...pendingSectionStyleOverrides,
  };

  const {
    className: assignedTitleClassName,
    style: assignedTitleStyleOverrides,
    children: assignedTitleChildren,
    ...restAssignedTitleAttributes
  } = assignedTitleProps ?? {};

  const assignedTitleClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__assigned-title",
    assignedTitleClassName
  );

  const assignedTitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
    color: "black",
    ...assignedTitleStyleOverrides,
  };

  const {
    className: pendingTitleClassName,
    style: pendingTitleStyleOverrides,
    children: pendingTitleChildren,
    ...restPendingTitleAttributes
  } = pendingTitleProps ?? {};

  const pendingTitleClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__pending-title",
    pendingTitleClassName
  );

  const pendingTitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
    color: "black",
    ...pendingTitleStyleOverrides,
  };

  const {
    className: assignedListClassName,
    style: assignedListStyleOverrides,
    ...restAssignedListAttributes
  } = assignedListProps ?? {};

  const assignedListClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__assigned-list",
    "mediasfu-configure-whiteboard__list",
    assignedListClassName
  );

  const assignedListStyle: React.CSSProperties = {
    listStyle: "none",
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: 240,
    overflowY: "auto",
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.15)",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    ...assignedListStyleOverrides,
  };

  const {
    className: pendingListClassName,
    style: pendingListStyleOverrides,
    ...restPendingListAttributes
  } = pendingListProps ?? {};

  const pendingListClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__pending-list",
    "mediasfu-configure-whiteboard__list",
    pendingListClassName
  );

  const pendingListStyle: React.CSSProperties = {
    listStyle: "none",
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: 240,
    overflowY: "auto",
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.15)",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    ...pendingListStyleOverrides,
  };

  const {
    className: assignedItemClassName,
    style: assignedItemStyleOverrides,
    ...restAssignedItemAttributes
  } = assignedItemProps ?? {};

  const assignedItemClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__assigned-item",
    "mediasfu-configure-whiteboard__list-item",
    assignedItemClassName
  );

  const assignedItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "6px 8px",
    borderRadius: 6,
    backgroundColor: "rgba(131,192,233,0.15)",
    color: "#1f2933",
    ...assignedItemStyleOverrides,
  };

  const {
    className: pendingItemClassName,
    style: pendingItemStyleOverrides,
    ...restPendingItemAttributes
  } = pendingItemProps ?? {};

  const pendingItemClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__pending-item",
    "mediasfu-configure-whiteboard__list-item",
    pendingItemClassName
  );

  const pendingItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "6px 8px",
    borderRadius: 6,
    backgroundColor: "rgba(131,192,233,0.05)",
    color: "#1f2933",
    ...pendingItemStyleOverrides,
  };

  const {
    className: assignedActionButtonClassName,
    style: assignedActionButtonStyleOverrides,
    onClick: assignedActionButtonOnClick,
    ...restAssignedActionButtonAttributes
  } = assignedActionButtonProps ?? {};

  const assignedActionButtonClassNames = joinClassNames(
    "btn",
    "btn-danger",
    "btn-sm",
    "mediasfu-configure-whiteboard__assigned-action",
    assignedActionButtonClassName
  );

  const assignedActionButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...assignedActionButtonStyleOverrides,
  };

  const {
    className: pendingActionButtonClassName,
    style: pendingActionButtonStyleOverrides,
    onClick: pendingActionButtonOnClick,
    ...restPendingActionButtonAttributes
  } = pendingActionButtonProps ?? {};

  const pendingActionButtonClassNames = joinClassNames(
    "btn",
    "btn-primary",
    "btn-sm",
    "mediasfu-configure-whiteboard__pending-action",
    pendingActionButtonClassName
  );

  const pendingActionButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...pendingActionButtonStyleOverrides,
  };

  const {
    className: footerClassName,
    style: footerStyleOverrides,
    ...restFooterAttributes
  } = footerProps ?? {};

  const footerClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__footer",
    footerClassName
  );

  const footerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    ...footerStyleOverrides,
  };

  const {
    className: saveButtonClassName,
    style: saveButtonStyleOverrides,
    children: saveButtonChildren,
    onClick: saveButtonOnClick,
    ...restSaveButtonAttributes
  } = saveButtonProps ?? {};

  const saveButtonClassNames = joinClassNames(
    "btn",
    "btn-info",
    "mediasfu-configure-whiteboard__save-button",
    saveButtonClassName
  );

  const saveButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...saveButtonStyleOverrides,
  };

  const {
    className: actionsWrapperClassName,
    style: actionsWrapperStyleOverrides,
    ...restActionsWrapperAttributes
  } = actionsWrapperProps ?? {};

  const actionsWrapperClassNames = joinClassNames(
    "mediasfu-configure-whiteboard__actions",
    actionsWrapperClassName
  );

  const actionsWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "stretch",
    ...actionsWrapperStyleOverrides,
  };

  const {
    className: startButtonClassName,
    style: startButtonStyleOverrides,
    children: startButtonChildren,
    onClick: startButtonOnClick,
    ...restStartButtonAttributes
  } = startButtonProps ?? {};

  const startButtonClassNames = joinClassNames(
    "btn",
    "btn-success",
    "mediasfu-configure-whiteboard__start-button",
    startButtonClassName
  );

  const startButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...startButtonStyleOverrides,
  };

  const {
    className: updateButtonClassName,
    style: updateButtonStyleOverrides,
    children: updateButtonChildren,
    onClick: updateButtonOnClick,
    ...restUpdateButtonAttributes
  } = updateButtonProps ?? {};

  const updateButtonClassNames = joinClassNames(
    "btn",
    "btn-warning",
    "mediasfu-configure-whiteboard__update-button",
    updateButtonClassName
  );

  const updateButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...updateButtonStyleOverrides,
  };

  const {
    className: stopButtonClassName,
    style: stopButtonStyleOverrides,
    children: stopButtonChildren,
    onClick: stopButtonOnClick,
    ...restStopButtonAttributes
  } = stopButtonProps ?? {};

  const stopButtonClassNames = joinClassNames(
    "btn",
    "btn-danger",
    "mediasfu-configure-whiteboard__stop-button",
    stopButtonClassName
  );

  const stopButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...stopButtonStyleOverrides,
  };

  const {
    style: sectionDividerStyleOverrides,
    ...restSectionDividerAttributes
  } = sectionDividerProps ?? {};

  const sectionDividerStyle: React.CSSProperties = {
    border: "none",
    height: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    margin: "8px 0",
    ...sectionDividerStyleOverrides,
  };

  const checkCanStartWhiteboard = () => {
    const isValid = validateWhiteboard();
    canStartWhiteboard = isValid;
    updateCanStartWhiteboard(isValid);
  };

  useEffect(() => {
    if (isVisible) {
      const filteredParticipants = participants.filter(
        (participant: Participant) => participant.islevel != "2"
      );
      setParticipantsCopy(filteredParticipants);
      checkCanStartWhiteboard();
    }
  }, [isVisible]);

  useEffect(() => {
    if (socket && socket instanceof Socket) {
      socket.on("whiteboardUpdated", async (data: WhiteboardUpdatedData) => {
        if (islevel == "2" && data.members) {
          const filteredParticipants = data.members.filter(
            (participant: Participant) => !participant.isBanned
          );
          setParticipantsCopy(filteredParticipants);
        }

        updateWhiteboardUsers(data.whiteboardUsers);

        if (data.status == "started") {
          whiteboardStarted = true;
          whiteboardEnded = false;
          updateWhiteboardStarted(true);
          updateWhiteboardEnded(false);

          if (islevel != "2") {
            shareScreenStarted = true;
            await onScreenChanges({ changed: true, parameters });
          }
        } else if (data.status == "ended") {
          whiteboardEnded = true;
          whiteboardStarted = false;
          updateWhiteboardStarted(false);
          updateWhiteboardEnded(true);

          shareScreenStarted = false;
          await onScreenChanges({ changed: true, parameters });
          await prepopulateUserMedia({ name: hostLabel, parameters });
          await rePort({ restart: true, parameters });
        }
      });
    }
  }, [socket, eventType, islevel]);

  const toggleParticipant = (participant: Participant, add: boolean) => {
    setIsEditing(true);
    const selectedParticipants = participantsCopy.filter((p) => p.useBoard);
    if (add && selectedParticipants.length >= whiteboardLimit - 1) {
      showAlert?.({
        message: `Participant limit exceeded - you can only add ${
          whiteboardLimit - 1
        } other participants`,
        type: "danger",
      });
      return;
    }

    const updatedParticipants = participantsCopy.map((p) =>
      p.name == participant.name ? { ...p, useBoard: add } : p
    );

    setParticipantsCopy(updatedParticipants);
  };

  const validateWhiteboard = () => {
    const selectedParticipants = participantsCopy.filter(
      (participant) => participant.useBoard
    );

    if (selectedParticipants.length > whiteboardLimit) {
      showAlert?.({ message: "Participant limit exceeded", type: "danger" });
      return false;
    }

    return true;
  };

  const handleSaveWhiteboard = () => {
    if (validateWhiteboard()) {
      setIsEditing(false);
      canStartWhiteboard = true;
      updateCanStartWhiteboard(true);
      checkCanStartWhiteboard();
      showAlert?.({ message: "Whiteboard saved successfully", type: "success" });
    } else {
      showAlert?.({ message: "Whiteboard validation failed", type: "danger" });
    }
  };

  const handleStartWhiteboard = async () => {
    if ((shareScreenStarted || shared) && !whiteboardStarted) {
      showAlert?.({
        message: "You cannot start whiteboard while screen sharing is active",
        type: "danger",
      });
      return;
    }

    if (breakOutRoomStarted && !breakOutRoomEnded) {
      showAlert?.({
        message: "You cannot start whiteboard while breakout rooms are active",
        type: "danger",
      });
      return;
    }

    if (canStartWhiteboard) {
      const emitName =
        whiteboardStarted && !whiteboardEnded
          ? "updateWhiteboard"
          : "startWhiteboard";
      const filteredWhiteboardUsers = participantsCopy
        .filter((participant) => participant.useBoard)
        .map(({ name, useBoard }) => ({ name, useBoard }));
      socket.emit(
        emitName,
        { whiteboardUsers: filteredWhiteboardUsers, roomName },
        async (response: any) => {
          if (response.success) {
            showAlert?.({ message: "Whiteboard active", type: "success" });
            whiteboardStarted = true;
            whiteboardEnded = false;
            updateWhiteboardStarted(true);
            updateWhiteboardEnded(false);
            updateIsConfigureWhiteboardModalVisible(false);

            if (islevel != "2") {
              shareScreenStarted = true;
              await onScreenChanges({ changed: true, parameters });
            }

            if (islevel == "2" && (recordStarted || recordResumed)) {
              if (!(recordPaused || recordStopped) &&
                recordingMediaOptions == "video") {
                await captureCanvasStream({ parameters });
              }
            }
          } else {
            showAlert?.({ message: response.reason, type: "danger" });
          }
        }
      );
    }
  };

  const handleStopWhiteboard = async () => {
    socket.emit("stopWhiteboard", { roomName }, async (response: any) => {
      if (response.success) {
        showAlert?.({ message: "Whiteboard stopped", type: "success" });
        whiteboardEnded = true;
        whiteboardStarted = false;
        updateWhiteboardStarted(false);
        updateWhiteboardEnded(true);
        updateIsConfigureWhiteboardModalVisible(false);

        shareScreenStarted = false;
        await onScreenChanges({ changed: true, parameters });
        await prepopulateUserMedia({ name: hostLabel, parameters });
        await rePort({ restart: true, parameters });
      } else {
        showAlert?.({ message: response.reason, type: "danger" });
      }
    });
  };

  const assignedParticipants = useMemo(
    () => participantsCopy.filter((participant) => participant.useBoard),
    [participantsCopy]
  );

  const pendingParticipants = useMemo(
    () => participantsCopy.filter((participant) => !participant.useBoard),
    [participantsCopy]
  );

  const assignedTitleNode = (
    <h6
      className={assignedTitleClassNames}
      style={assignedTitleStyle}
      {...restAssignedTitleAttributes}
    >
      {assignedTitleChildren ?? assignedTitle}
    </h6>
  );

  const pendingTitleNode = (
    <h6
      className={pendingTitleClassNames}
      style={pendingTitleStyle}
      {...restPendingTitleAttributes}
    >
      {pendingTitleChildren ?? pendingTitle}
    </h6>
  );

  const resolvedRemoveIcon = removeIcon ?? <FontAwesomeIcon icon={faTimes} />;
  const resolvedAddIcon = addIcon ?? <FontAwesomeIcon icon={faCheck} />;
  const resolvedSaveIcon = saveIcon ?? <FontAwesomeIcon icon={faSave} />;
  const resolvedStartIcon = startIcon ?? <FontAwesomeIcon icon={faPlay} />;
  const resolvedUpdateIcon = updateIcon ?? <FontAwesomeIcon icon={faSyncAlt} />;
  const resolvedStopIcon = stopIcon ?? <FontAwesomeIcon icon={faTimes} />;

  const getButtonContent = (
    children: React.ReactNode | undefined,
    label: React.ReactNode,
    icon: React.ReactNode
  ): React.ReactNode => {
    if (children !== undefined && children !== null) {
      return children;
    }

    return (
      <>
        {label}
        {icon ? (
          <span className="mediasfu-configure-whiteboard__button-icon">
            {icon}
          </span>
        ) : null}
      </>
    );
  };

  const resolvedEmptyAssignedState =
    typeof emptyAssignedState === "function"
      ? emptyAssignedState({ participants: participantsCopy })
      : emptyAssignedState;

  const assignedListItems =
    assignedParticipants.length > 0
      ? assignedParticipants.map((participant, index) => {
          const remove = () => toggleParticipant(participant, false);

          const defaultItem = (
            <li
              className={assignedItemClassNames}
              style={assignedItemStyle}
              {...restAssignedItemAttributes}
            >
              <span>{participant.name}</span>
              <button
                type="button"
                className={assignedActionButtonClassNames}
                style={assignedActionButtonStyle}
                onClick={(event) => {
                  assignedActionButtonOnClick?.(event);
                  if (!event.defaultPrevented) {
                    remove();
                  }
                }}
                {...restAssignedActionButtonAttributes}
              >
                {resolvedRemoveIcon}
              </button>
            </li>
          );

          const itemNode =
            renderAssignedItem?.({
              defaultItem,
              participant,
              remove,
              index,
            }) ?? defaultItem;

          if (React.isValidElement(itemNode)) {
            return React.cloneElement(itemNode, { key: participant.name });
          }

          return (
            <React.Fragment key={participant.name}>{itemNode}</React.Fragment>
          );
        })
      : [
          React.isValidElement(resolvedEmptyAssignedState)
            ? React.cloneElement(resolvedEmptyAssignedState, {
                key: "empty-assigned",
              })
            : (
                <React.Fragment key="empty-assigned">
                  {resolvedEmptyAssignedState ?? (
                    <li
                      className={assignedItemClassNames}
                      style={{
                        ...assignedItemStyle,
                        justifyContent: "center",
                      }}
                    >
                      None
                    </li>
                  )}
                </React.Fragment>
              ),
        ];

  const resolvedEmptyPendingState =
    typeof emptyPendingState === "function"
      ? emptyPendingState({ participants: participantsCopy })
      : emptyPendingState;

  const pendingListItems =
    pendingParticipants.length > 0
      ? pendingParticipants.map((participant, index) => {
          const add = () => toggleParticipant(participant, true);

          const defaultItem = (
            <li
              className={pendingItemClassNames}
              style={pendingItemStyle}
              {...restPendingItemAttributes}
            >
              <span>{participant.name}</span>
              <button
                type="button"
                className={pendingActionButtonClassNames}
                style={pendingActionButtonStyle}
                onClick={(event) => {
                  pendingActionButtonOnClick?.(event);
                  if (!event.defaultPrevented) {
                    add();
                  }
                }}
                {...restPendingActionButtonAttributes}
              >
                {resolvedAddIcon}
              </button>
            </li>
          );

          const itemNode =
            renderPendingItem?.({
              defaultItem,
              participant,
              add,
              index,
            }) ?? defaultItem;

          if (React.isValidElement(itemNode)) {
            return React.cloneElement(itemNode, { key: participant.name });
          }

          return (
            <React.Fragment key={participant.name}>{itemNode}</React.Fragment>
          );
        })
      : [
          React.isValidElement(resolvedEmptyPendingState)
            ? React.cloneElement(resolvedEmptyPendingState, {
                key: "empty-pending",
              })
            : (
                <React.Fragment key="empty-pending">
                  {resolvedEmptyPendingState ?? (
                    <li
                      className={pendingItemClassNames}
                      style={{
                        ...pendingItemStyle,
                        justifyContent: "center",
                      }}
                    >
                      None
                    </li>
                  )}
                </React.Fragment>
              ),
        ];

  const defaultAssignedList = (
    <div
      className={assignedSectionClassNames}
      style={assignedSectionStyle}
      {...restAssignedSectionAttributes}
    >
      {assignedTitleNode}
      <ul
        className={assignedListClassNames}
        style={assignedListStyle}
        ref={assignedListRef}
        {...restAssignedListAttributes}
      >
        {assignedListItems}
      </ul>
    </div>
  );

  const assignedListNode = renderAssignedList
    ? renderAssignedList({
        defaultAssignedList,
        participants: assignedParticipants,
        removeParticipant: (participant) => toggleParticipant(participant, false),
      })
    : defaultAssignedList;

  const defaultPendingList = (
    <div
      className={pendingSectionClassNames}
      style={pendingSectionStyle}
      {...restPendingSectionAttributes}
    >
      {pendingTitleNode}
      <ul
        className={pendingListClassNames}
        style={pendingListStyle}
        ref={unassignedListRef}
        {...restPendingListAttributes}
      >
        {pendingListItems}
      </ul>
    </div>
  );

  const pendingListNode = renderPendingList
    ? renderPendingList({
        defaultPendingList,
        participants: pendingParticipants,
        addParticipant: (participant) => toggleParticipant(participant, true),
      })
    : defaultPendingList;

  const defaultLists = (
    <div
      className={listsWrapperClassNames}
      style={listsWrapperStyle}
      {...restListsWrapperAttributes}
    >
      {assignedListNode}
      {pendingListNode}
    </div>
  );

  const listsNode = renderLists
    ? renderLists({
        defaultLists,
        assignedParticipants,
        pendingParticipants,
      })
    : defaultLists;

  const handleSaveClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    saveButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      handleSaveWhiteboard();
    }
  };

  const defaultSaveButton = (
    <button
      type="button"
      className={saveButtonClassNames}
      style={saveButtonStyle}
      onClick={handleSaveClick}
      {...restSaveButtonAttributes}
    >
      {getButtonContent(saveButtonChildren, saveButtonLabel, resolvedSaveIcon)}
    </button>
  );

  const defaultFooter = (
    <div className={footerClassNames} style={footerStyle} {...restFooterAttributes}>
      {defaultSaveButton}
    </div>
  );

  const footerNode = renderFooter
    ? renderFooter({
        defaultFooter,
        isEditing,
        canStartWhiteboard,
      })
    : defaultFooter;

  const handleStartClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    startButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      handleStartWhiteboard();
    }
  };

  const handleUpdateClick: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    updateButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      handleStartWhiteboard();
    }
  };

  const handleStopClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    stopButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      handleStopWhiteboard();
    }
  };

  const startButtonNode = (
    <button
      type="button"
      className={startButtonClassNames}
      style={startButtonStyle}
      onClick={handleStartClick}
      {...restStartButtonAttributes}
    >
      {getButtonContent(startButtonChildren, startButtonLabel, resolvedStartIcon)}
    </button>
  );

  const updateButtonNode = (
    <button
      type="button"
      className={updateButtonClassNames}
      style={updateButtonStyle}
      onClick={handleUpdateClick}
      {...restUpdateButtonAttributes}
    >
      {getButtonContent(updateButtonChildren, updateButtonLabel, resolvedUpdateIcon)}
    </button>
  );

  const stopButtonNode = (
    <button
      type="button"
      className={stopButtonClassNames}
      style={stopButtonStyle}
      onClick={handleStopClick}
      {...restStopButtonAttributes}
    >
      {getButtonContent(stopButtonChildren, stopButtonLabel, resolvedStopIcon)}
    </button>
  );

  const defaultActions = !isEditing ? (
    <div
      className={actionsWrapperClassNames}
      style={actionsWrapperStyle}
      {...restActionsWrapperAttributes}
    >
      {canStartWhiteboard
        ? whiteboardStarted && !whiteboardEnded
          ? updateButtonNode
          : startButtonNode
        : null}
      {whiteboardStarted && !whiteboardEnded ? stopButtonNode : null}
    </div>
  ) : null;

  const actionsNode = renderActions
    ? renderActions({
        defaultActions,
        isEditing,
        canStartWhiteboard,
        whiteboardStarted,
        whiteboardEnded,
      })
    : defaultActions;

  const dividerNode = !isEditing && actionsNode ? (
    <hr style={sectionDividerStyle} {...restSectionDividerAttributes} />
  ) : null;

  const defaultBody = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyAttributes}>
      {listsNode}
      {footerNode}
      {dividerNode}
      {actionsNode}
    </div>
  );

  const bodyNode = renderBody
    ? renderBody({
        defaultBody,
        isEditing,
        assignedParticipants,
        pendingParticipants,
      })
    : defaultBody;

  const defaultTitleNode = (
    <h2
      className={titleClassNames}
      style={titleStyle}
      {...restTitleAttributes}
    >
      {titleChildren ?? title}
    </h2>
  );

  const titleNode = renderTitle
    ? renderTitle({ defaultTitle: defaultTitleNode })
    : defaultTitleNode;

  const defaultHeader = (
    <div className={headerClassNames} style={headerStyle} {...restHeaderAttributes}>
      {titleNode}
      <button
        type="button"
        className={closeButtonClassNames}
        style={closeButtonStyle}
        onClick={handleCloseClick}
        {...restCloseButtonAttributes}
      >
        {resolvedCloseIcon}
      </button>
    </div>
  );

  const headerNode = renderHeader
    ? renderHeader({ defaultHeader })
    : defaultHeader;

  const headerDividerNode = (
    <hr style={headerDividerStyle} {...restHeaderDividerAttributes} />
  );

  const defaultContent = (
    <div
      className={contentClassNames}
      style={contentStyle}
      {...restContentAttributes}
    >
      {headerNode}
      {headerDividerNode}
      {bodyNode}
    </div>
  );

  const contentNode = renderContent
    ? renderContent({
        defaultContent,
        isEditing,
        canStartWhiteboard,
      })
    : defaultContent;

  return (
    <div className={overlayClassNames} style={overlayStyle} {...restOverlayAttributes}>
      {contentNode}
    </div>
  );
};

export default ConfigureWhiteboard;
