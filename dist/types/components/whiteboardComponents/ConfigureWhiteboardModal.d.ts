import React from "react";
import { Socket } from "socket.io-client";
import { CaptureCanvasStreamParameters, CaptureCanvasStreamType, EventType, OnScreenChangesParameters, OnScreenChangesType, Participant, PrepopulateUserMediaParameters, PrepopulateUserMediaType, RePortParameters, RePortType, ShowAlert, WhiteboardUser } from "../../@types/types";
export interface ConfigureWhiteboardModalParameters extends OnScreenChangesParameters, CaptureCanvasStreamParameters, PrepopulateUserMediaParameters, RePortParameters {
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
    emptyAssignedState?: React.ReactNode | ((context: {
        participants: Participant[];
    }) => React.ReactNode);
    emptyPendingState?: React.ReactNode | ((context: {
        participants: Participant[];
    }) => React.ReactNode);
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
export type ConfigureWhiteboardModalType = (options: ConfigureWhiteboardModalOptions) => React.JSX.Element;
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
declare const ConfigureWhiteboard: React.FC<ConfigureWhiteboardModalOptions>;
export default ConfigureWhiteboard;
//# sourceMappingURL=ConfigureWhiteboardModal.d.ts.map