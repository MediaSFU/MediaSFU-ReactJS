import React from "react";
import { ConfirmExitOptions } from "../../methods/exitMethods/confirmExit";
import { Socket } from "socket.io-client";
export interface ConfirmExitModalOptions {
    isConfirmExitModalVisible: boolean;
    onConfirmExitClose: () => void;
    position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft" | "center";
    backgroundColor?: string;
    exitEventOnConfirm?: (options: ConfirmExitOptions) => void;
    member: string;
    ban?: boolean;
    roomName: string;
    socket: Socket;
    islevel: string;
    title?: React.ReactNode;
    confirmLabel?: React.ReactNode;
    cancelLabel?: React.ReactNode;
    message?: React.ReactNode | ((context: {
        islevel: string;
    }) => React.ReactNode);
    overlayProps?: React.HTMLAttributes<HTMLDivElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    headerProps?: React.HTMLAttributes<HTMLDivElement>;
    titleProps?: React.HTMLAttributes<HTMLHeadingElement>;
    closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    closeIconComponent?: React.ReactNode;
    headerDividerProps?: React.HTMLAttributes<HTMLHRElement>;
    bodyProps?: React.HTMLAttributes<HTMLDivElement>;
    messageProps?: React.HTMLAttributes<HTMLParagraphElement>;
    footerProps?: React.HTMLAttributes<HTMLDivElement>;
    cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    confirmButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    bodyDividerProps?: React.HTMLAttributes<HTMLHRElement>;
    renderHeader?: (options: {
        defaultHeader: React.ReactNode;
        title: React.ReactNode;
        onClose: () => void;
    }) => React.ReactNode;
    renderBody?: (options: {
        defaultBody: React.ReactNode;
        message: React.ReactNode;
    }) => React.ReactNode;
    renderFooter?: (options: {
        defaultFooter: React.ReactNode;
        onCancel: () => void;
        onConfirm: () => void;
    }) => React.ReactNode;
    renderHeaderDivider?: (options: {
        defaultDivider: React.ReactNode;
    }) => React.ReactNode;
    renderBodyDivider?: (options: {
        defaultDivider: React.ReactNode;
    }) => React.ReactNode;
    renderMessage?: (options: {
        defaultMessage: React.ReactNode;
        resolvedMessage: React.ReactNode;
    }) => React.ReactNode;
    renderContent?: (options: {
        defaultContent: React.ReactNode;
    }) => React.ReactNode;
}
export type ConfirmExitModalType = (options: ConfirmExitModalOptions) => React.JSX.Element;
/**
 * ConfirmExitModal - Confirmation dialog for leaving or ending meetings
 *
 * A critical confirmation modal that appears before a user exits a meeting or before a host
 * ends a meeting for all participants. Provides clear messaging differentiated by user role
 * and supports ban scenarios. Essential for preventing accidental meeting exits/terminations.
 *
 * Features:
 * - Role-specific confirmation messages (host vs participant)
 * - Differentiated wording for exit vs end meeting
 * - Ban scenario handling
 * - Customizable messages and labels
 * - Confirm/cancel action buttons
 * - Extensive HTML attributes customization
 * - Custom render hooks for all sections
 * - Responsive positioning
 * - Socket-based exit handling
 *
 * @component
 * @param {ConfirmExitModalOptions} options - Configuration options
 * @param {boolean} options.isConfirmExitModalVisible - Modal visibility state
 * @param {Function} options.onConfirmExitClose - Callback when modal is closed
 * @param {string} [options.position="topRight"] - Modal screen position
 * @param {string} [options.backgroundColor="#83c0e9"] - Modal background color
 * @param {Function} [options.exitEventOnConfirm=confirmExit] - Exit confirmation handler
 * @param {string} options.member - Current user member ID
 * @param {boolean} [options.ban] - Ban state flag
 * @param {string} options.roomName - Meeting/room identifier
 * @param {Socket} options.socket - Socket.io client instance
 * @param {string} options.islevel - User permission level ('2'=host)
 * @param {React.ReactNode} [options.title] - Custom modal title
 * @param {React.ReactNode} [options.confirmLabel] - Custom confirm button label
 * @param {React.ReactNode} [options.cancelLabel] - Custom cancel button label
 * @param {React.ReactNode|Function} [options.message] - Custom message or message renderer
 * @param {object} [options.overlayProps] - HTML attributes for overlay
 * @param {object} [options.contentProps] - HTML attributes for content container
 * @param {object} [options.headerProps] - HTML attributes for header
 * @param {object} [options.titleProps] - HTML attributes for title
 * @param {object} [options.closeButtonProps] - HTML attributes for close button
 * @param {React.ReactNode} [options.closeIconComponent] - Custom close icon
 * @param {object} [options.headerDividerProps] - HTML attributes for header divider
 * @param {object} [options.bodyProps] - HTML attributes for body
 * @param {object} [options.messageProps] - HTML attributes for message paragraph
 * @param {object} [options.footerProps] - HTML attributes for footer
 * @param {object} [options.cancelButtonProps] - HTML attributes for cancel button
 * @param {object} [options.confirmButtonProps] - HTML attributes for confirm button
 * @param {object} [options.bodyDividerProps] - HTML attributes for body divider
 * @param {Function} [options.renderHeader] - Custom header renderer
 * @param {Function} [options.renderBody] - Custom body renderer
 * @param {Function} [options.renderFooter] - Custom footer renderer
 * @param {Function} [options.renderHeaderDivider] - Custom header divider renderer
 * @param {Function} [options.renderBodyDivider] - Custom body divider renderer
 * @param {Function} [options.renderMessage] - Custom message renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 *
 * @returns {React.JSX.Element} Rendered confirmation modal
 *
 * @example
 * // Basic exit confirmation for participant
 * ```tsx
 * import React, { useState } from 'react';
 * import { ConfirmExitModal } from 'mediasfu-reactjs';
 *
 * function ExitConfirmation({ member, roomName, socket, islevel }) {
 *   const [isVisible, setIsVisible] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Leave Meeting
 *       </button>
 *       <ConfirmExitModal
 *         isConfirmExitModalVisible={isVisible}
 *         onConfirmExitClose={() => setIsVisible(false)}
 *         member={member}
 *         roomName={roomName}
 *         socket={socket}
 *         islevel={islevel}
 *         position="topRight"
 *         backgroundColor="#0f172a"
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * // Custom styled with role-specific messaging
 * ```tsx
 * import { ConfirmExitModal } from 'mediasfu-reactjs';
 *
 * function BrandedExitConfirm(props) {
 *   const isHost = props.islevel === '2';
 *
 *   return (
 *     <ConfirmExitModal
 *       {...props}
 *       backgroundColor="#1e3a8a"
 *       contentProps={{
 *         style: {
 *           borderRadius: 20,
 *           border: `2px solid ${isHost ? '#ef4444' : '#3b82f6'}`,
 *         },
 *       }}
 *       confirmButtonProps={{
 *         style: {
 *           background: isHost
 *             ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
 *             : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
 *           color: 'white',
 *           padding: '12px 28px',
 *           borderRadius: 12,
 *           fontWeight: 600,
 *         },
 *       }}
 *       cancelButtonProps={{
 *         style: {
 *           background: '#6b7280',
 *           color: 'white',
 *           padding: '12px 28px',
 *           borderRadius: 12,
 *           fontWeight: 600,
 *         },
 *       }}
 *       message={({ islevel }) =>
 *         islevel === '2'
 *           ? 'Are you sure you want to end the meeting for everyone?'
 *           : 'Are you sure you want to leave this meeting?'
 *       }
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Analytics tracking for exit actions
 * ```tsx
 * import { ConfirmExitModal } from 'mediasfu-reactjs';
 *
 * function AnalyticsExitConfirm(props) {
 *   const handleExitConfirm = async (options) => {
 *     analytics.track('meeting_exit_confirmed', {
 *       userRole: props.islevel === '2' ? 'host' : 'participant',
 *       meetingId: props.roomName,
 *       banned: props.ban || false,
 *     });
 *     return props.exitEventOnConfirm?.(options);
 *   };
 *
 *   return (
 *     <ConfirmExitModal
 *       {...props}
 *       exitEventOnConfirm={handleExitConfirm}
 *       renderFooter={({ defaultFooter, onCancel, onConfirm }) => (
 *         <div>
 *           <div style={{
 *             padding: 12,
 *             background: '#fef3c7',
 *             borderRadius: 8,
 *             marginBottom: 16,
 *             fontSize: 14,
 *           }}>
 *             {props.islevel === '2'
 *               ? '⚠️ This will end the meeting for all participants'
 *               : 'You can rejoin anytime'}
 *           </div>
 *           {defaultFooter}
 *         </div>
 *       )}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, ConfirmExitModal } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   confirmExitModal: {
 *     component: (props) => (
 *       <ConfirmExitModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         confirmButtonProps={{
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
declare const ConfirmExitModal: React.FC<ConfirmExitModalOptions>;
export default ConfirmExitModal;
//# sourceMappingURL=ConfirmExitModal.d.ts.map