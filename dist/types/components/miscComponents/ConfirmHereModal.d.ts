import React from "react";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { Socket } from "socket.io-client";
export interface ConfirmHereModalOptions {
    isConfirmHereModalVisible: boolean;
    onConfirmHereClose: () => void;
    backgroundColor?: string;
    countdownDuration?: number;
    socket: Socket;
    localSocket?: Socket;
    roomName: string;
    member: string;
    title?: React.ReactNode;
    message?: React.ReactNode | ((context: {
        counter: number;
        countdownDuration: number;
    }) => React.ReactNode);
    countdownLabel?: React.ReactNode;
    confirmButtonLabel?: React.ReactNode;
    onTimeout?: () => void;
    overlayProps?: React.HTMLAttributes<HTMLDivElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
    spinnerWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    spinnerIcon?: React.ReactNode;
    spinnerIconProps?: Partial<FontAwesomeIconProps>;
    titleProps?: React.HTMLAttributes<HTMLHeadingElement>;
    messageProps?: React.HTMLAttributes<HTMLParagraphElement>;
    countdownWrapperProps?: React.HTMLAttributes<HTMLParagraphElement>;
    countdownValueProps?: React.HTMLAttributes<HTMLSpanElement>;
    confirmButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    renderSpinner?: (options: {
        defaultSpinner: React.ReactNode;
    }) => React.ReactNode;
    renderTitle?: (options: {
        defaultTitle: React.ReactNode;
    }) => React.ReactNode;
    renderMessage?: (options: {
        defaultMessage: React.ReactNode;
        counter: number;
        countdownDuration: number;
    }) => React.ReactNode;
    renderCountdown?: (options: {
        defaultCountdown: React.ReactNode;
        counter: number;
        countdownLabel: React.ReactNode;
    }) => React.ReactNode;
    renderConfirmButton?: (options: {
        defaultButton: React.ReactNode;
    }) => React.ReactNode;
    renderBody?: (options: {
        defaultBody: React.ReactNode;
        spinner: React.ReactNode;
        title: React.ReactNode;
        message: React.ReactNode;
        countdown: React.ReactNode;
        confirmButton: React.ReactNode;
    }) => React.ReactNode;
    renderContent?: (options: {
        defaultContent: React.ReactNode;
    }) => React.ReactNode;
}
export type ConfirmHereModalType = (options: ConfirmHereModalOptions) => void;
/**
 * ConfirmHereModal - A modal component for confirming user presence with countdown timer.
 *
 * This component displays an interactive modal that prompts users to confirm their presence in a session.
 * It features a configurable countdown timer, socket-based presence confirmation, and comprehensive
 * customization options for styling, content, and behavior.
 *
 * **Key Features:**
 * - **Countdown Timer**: Configurable countdown duration (default 120 seconds) with real-time display
 * - **Socket Communication**: Emits presence confirmation to both primary and local sockets
 * - **Timeout Handling**: Custom callback support for timeout scenarios with automatic modal dismissal
 * - **Custom Content**: Fully customizable title, message (with dynamic context), and labels
 * - **Loading States**: Built-in spinner with customizable appearance during confirmation processing
 * - **Flexible Messaging**: Message can be static node or dynamic function receiving countdown context
 * - **HTML Attributes**: Granular control over all UI elements (overlay, content, buttons, text, etc.)
 * - **Render Hooks**: Complete override capability for all visual elements (spinner, title, message, countdown, button, body, content)
 * - **Responsive Design**: Automatic centering and z-index management for overlay positioning
 * - **Accessibility**: Semantic HTML with proper button and heading elements
 *
 * @component
 *
 * @param {ConfirmHereModalOptions} props - Configuration options for ConfirmHereModal
 * @param {boolean} props.isConfirmHereModalVisible - Controls modal visibility
 * @param {() => void} props.onConfirmHereClose - Callback function invoked when modal is closed
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color for the modal content
 * @param {number} [props.countdownDuration=120] - Countdown duration in seconds before automatic timeout
 * @param {Socket} props.socket - Primary socket instance for emitting presence confirmation
 * @param {Socket} [props.localSocket] - Optional local socket instance for local presence events
 * @param {string} props.roomName - Room identifier for socket communication
 * @param {string} props.member - Member identifier for presence confirmation
 * @param {React.ReactNode} [props.title] - Custom title content (default: "Confirm Your Presence")
 * @param {React.ReactNode | ((context: {counter: number; countdownDuration: number}) => React.ReactNode)} [props.message] - Message content or function receiving countdown context
 * @param {React.ReactNode} [props.countdownLabel] - Label preceding countdown value (default: "Time remaining: ")
 * @param {React.ReactNode} [props.confirmButtonLabel] - Button label for confirmation action (default: "I'm Here")
 * @param {() => void} [props.onTimeout] - Callback invoked when countdown reaches zero
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.overlayProps] - HTML attributes for overlay container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.contentProps] - HTML attributes for content wrapper
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - HTML attributes for main container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.spinnerWrapperProps] - HTML attributes for spinner wrapper
 * @param {React.ReactNode} [props.spinnerIcon] - Custom spinner icon component
 * @param {Partial<FontAwesomeIconProps>} [props.spinnerIconProps] - FontAwesome icon props for spinner customization
 * @param {React.HTMLAttributes<HTMLHeadingElement>} [props.titleProps] - HTML attributes for title element
 * @param {React.HTMLAttributes<HTMLParagraphElement>} [props.messageProps] - HTML attributes for message element
 * @param {React.HTMLAttributes<HTMLParagraphElement>} [props.countdownWrapperProps] - HTML attributes for countdown wrapper
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props.countdownValueProps] - HTML attributes for countdown value
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.confirmButtonProps] - HTML attributes for confirm button
 * @param {(options: {defaultSpinner: React.ReactNode}) => React.ReactNode} [props.renderSpinner] - Custom render function for spinner
 * @param {(options: {defaultTitle: React.ReactNode}) => React.ReactNode} [props.renderTitle] - Custom render function for title
 * @param {(options: {defaultMessage: React.ReactNode; counter: number; countdownDuration: number}) => React.ReactNode} [props.renderMessage] - Custom render function for message
 * @param {(options: {defaultCountdown: React.ReactNode; counter: number; countdownLabel: React.ReactNode}) => React.ReactNode} [props.renderCountdown] - Custom render function for countdown
 * @param {(options: {defaultButton: React.ReactNode}) => React.ReactNode} [props.renderConfirmButton] - Custom render function for confirm button
 * @param {(options: {defaultBody: React.ReactNode; spinner: React.ReactNode; title: React.ReactNode; message: React.ReactNode; countdown: React.ReactNode; confirmButton: React.ReactNode}) => React.ReactNode} [props.renderBody] - Custom render function for modal body
 * @param {(options: {defaultContent: React.ReactNode}) => React.ReactNode} [props.renderContent] - Custom render function for entire content
 *
 * @returns {React.JSX.Element} The rendered ConfirmHereModal component
 *
 * @example
 * // Basic usage with default countdown
 * ```tsx
 * import React, { useState } from 'react';
 * import { ConfirmHereModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * const BasicPresenceCheck = () => {
 *   const [showModal, setShowModal] = useState(true);
 *   const socket = io('https://mediasfu.com');
 *
 *   return (
 *     <ConfirmHereModal
 *       isConfirmHereModalVisible={showModal}
 *       onConfirmHereClose={() => setShowModal(false)}
 *       socket={socket}
 *       roomName="meeting-room-123"
 *       member="user@example.com"
 *       countdownDuration={120}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * // Custom styled with timeout warning
 * ```tsx
 * import React, { useState } from 'react';
 * import { ConfirmHereModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * const CustomStyledPresence = () => {
 *   const [showModal, setShowModal] = useState(true);
 *   const socket = io('https://mediasfu.com');
 *
 *   const handleTimeout = () => {
 *     console.warn('User failed to confirm presence');
 *     // Redirect to lobby or end session
 *   };
 *
 *   return (
 *     <ConfirmHereModal
 *       isConfirmHereModalVisible={showModal}
 *       onConfirmHereClose={() => setShowModal(false)}
 *       socket={socket}
 *       roomName="meeting-room-123"
 *       member="user@example.com"
 *       backgroundColor="#ff6b6b"
 *       countdownDuration={60}
 *       onTimeout={handleTimeout}
 *       title={<h2 style={{ color: '#fff' }}>⚠️ Are You Still There?</h2>}
 *       message={({ counter }) => (
 *         <p style={{ color: counter < 10 ? '#fff' : '#333' }}>
 *           You will be removed from the meeting if you don't respond!
 *         </p>
 *       )}
 *       confirmButtonLabel="Yes, I'm Here!"
 *       confirmButtonProps={{
 *         style: {
 *           backgroundColor: '#2ecc71',
 *           color: '#fff',
 *           padding: '12px 24px',
 *           fontSize: '16px'
 *         }
 *       }}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * // Analytics tracking for presence confirmations
 * ```tsx
 * import React, { useState } from 'react';
 * import { ConfirmHereModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * const AnalyticsPresence = () => {
 *   const [showModal, setShowModal] = useState(true);
 *   const socket = io('https://mediasfu.com');
 *
 *   const handleConfirm = () => {
 *     // Track confirmation
 *     analytics.track('Presence Confirmed', {
 *       roomName: 'meeting-room-123',
 *       timeRemaining: counter
 *     });
 *     setShowModal(false);
 *   };
 *
 *   const handleTimeout = () => {
 *     analytics.track('Presence Timeout', {
 *       roomName: 'meeting-room-123'
 *     });
 *   };
 *
 *   return (
 *     <ConfirmHereModal
 *       isConfirmHereModalVisible={showModal}
 *       onConfirmHereClose={handleConfirm}
 *       socket={socket}
 *       roomName="meeting-room-123"
 *       member="user@example.com"
 *       onTimeout={handleTimeout}
 *       renderCountdown={({ defaultCountdown, counter }) => (
 *         <div>
 *           {defaultCountdown}
 *           {counter < 30 && (
 *             <p style={{ color: 'red' }}>⏰ Less than 30 seconds remaining!</p>
 *           )}
 *         </div>
 *       )}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, ConfirmHereModal } from 'mediasfu-reactjs';
 *
 * const CustomPresenceComponent = (props) => (
 *   <ConfirmHereModal
 *     {...props}
 *     title="Custom Presence Check"
 *     countdownDuration={90}
 *     message="Please confirm you're still attending this session."
 *     renderBody={({ spinner, title, message, countdown, confirmButton }) => (
 *       <div className="custom-presence">
 *         <div className="presence-header">
 *           {spinner}
 *           {title}
 *         </div>
 *         <div className="presence-content">
 *           {message}
 *           <div className="presence-countdown">{countdown}</div>
 *         </div>
 *         <div className="presence-footer">
 *           {confirmButton}
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
 *         ConfirmHereModal: CustomPresenceComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 */
declare const ConfirmHereModal: React.FC<ConfirmHereModalOptions>;
export default ConfirmHereModal;
//# sourceMappingURL=ConfirmHereModal.d.ts.map