import React from "react";
import {
  confirmExit,
  ConfirmExitOptions,
} from "../../methods/exitMethods/confirmExit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Socket } from "socket.io-client";

// Define the prop types using TypeScript interface
export interface ConfirmExitModalOptions {
  isConfirmExitModalVisible: boolean;
  onConfirmExitClose: () => void;
  position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft";
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
  message?: React.ReactNode | ((context: { islevel: string }) => React.ReactNode);
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
  renderHeaderDivider?: (options: { defaultDivider: React.ReactNode }) => React.ReactNode;
  renderBodyDivider?: (options: { defaultDivider: React.ReactNode }) => React.ReactNode;
  renderMessage?: (options: {
    defaultMessage: React.ReactNode;
    resolvedMessage: React.ReactNode;
  }) => React.ReactNode;
  renderContent?: (options: { defaultContent: React.ReactNode }) => React.ReactNode;
}

export type ConfirmExitModalType = (
  options: ConfirmExitModalOptions
) => React.JSX.Element;

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

const ConfirmExitModal: React.FC<ConfirmExitModalOptions> = ({
  isConfirmExitModalVisible,
  onConfirmExitClose,
  position = "topRight",
  backgroundColor = "#83c0e9",
  exitEventOnConfirm = confirmExit,
  member,
  ban,
  roomName,
  socket,
  islevel,
  title = "Confirm Exit",
  confirmLabel,
  cancelLabel,
  message,
  overlayProps,
  contentProps,
  headerProps,
  titleProps,
  closeButtonProps,
  closeIconComponent,
  bodyProps,
  messageProps,
  footerProps,
  cancelButtonProps,
  confirmButtonProps,
  headerDividerProps,
  bodyDividerProps,
  renderHeader,
  renderBody,
  renderFooter,
  renderHeaderDivider,
  renderBodyDivider,
  renderMessage,
  renderContent,
}) => {
  const defaultConfirmLabel = confirmLabel ?? (islevel === "2" ? "End Event" : "Exit");
  const defaultCancelLabel = cancelLabel ?? "Cancel";

  const resolvedMessage = (() => {
    if (typeof message === "function") {
      return message({ islevel });
    }
    if (message !== undefined) {
      return message;
    }
    return islevel === "2"
      ? "This will end the event for all. Confirm exit."
      : "Are you sure you want to exit?";
  })();

  const defaultModalWidth = typeof window !== "undefined" ? window.innerWidth * 0.8 : 320;
  const modalWidth = Math.min(defaultModalWidth, 350);

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = [
    "mediasfu-confirm-exit__overlay",
    overlayClassName,
  ].filter(Boolean).join(" ") || undefined;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isConfirmExitModalVisible ? "block" : "none",
    zIndex: 999,
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = [
    "mediasfu-confirm-exit__content",
    contentClassName,
  ].filter(Boolean).join(" ") || undefined;

  const contentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor,
    borderRadius: 10,
    padding: 16,
    width: modalWidth,
    maxHeight: "65%",
    overflowY: "auto",
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    ...contentStyleOverrides,
  };

  const {
    className: headerClassName,
    style: headerStyleOverrides,
    ...restHeaderProps
  } = headerProps ?? {};

  const headerClassNames = [
    "mediasfu-confirm-exit__header",
    headerClassName,
  ].filter(Boolean).join(" ") || undefined;

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
    ...restTitleProps
  } = titleProps ?? {};

  const titleClassNames = [
    "mediasfu-confirm-exit__title",
    titleClassName,
  ].filter(Boolean).join(" ") || undefined;

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "1.1rem",
    ...titleStyleOverrides,
  };

  const {
    className: closeButtonClassName,
    style: closeButtonStyleOverrides,
    onClick: closeButtonOnClick,
    ...restCloseButtonProps
  } = closeButtonProps ?? {};

  const closeButtonClassNames = [
    "mediasfu-confirm-exit__close",
    closeButtonClassName,
  ].filter(Boolean).join(" ") || undefined;

  const closeButtonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    padding: 4,
    cursor: "pointer",
    color: "black",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...closeButtonStyleOverrides,
  };

  const defaultCloseIcon = closeIconComponent ?? (
    <FontAwesomeIcon icon={faTimes} size="lg" />
  );

  const handleCloseClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    closeButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      onConfirmExitClose();
    }
  };

  const {
    className: headerDividerClassName,
    style: headerDividerStyleOverrides,
    ...restHeaderDividerProps
  } = headerDividerProps ?? {};

  const headerDividerClassNames = [
    "mediasfu-confirm-exit__divider",
    headerDividerClassName,
  ].filter(Boolean).join(" ") || undefined;

  const headerDividerStyle: React.CSSProperties = {
    margin: "6px 0",
    height: 1,
    border: "none",
    backgroundColor: "rgba(0,0,0,0.15)",
    ...headerDividerStyleOverrides,
  };

  const {
    className: bodyClassName,
    style: bodyStyleOverrides,
    ...restBodyProps
  } = bodyProps ?? {};

  const bodyClassNames = [
    "mediasfu-confirm-exit__body",
    bodyClassName,
  ].filter(Boolean).join(" ") || undefined;

  const bodyStyle: React.CSSProperties = {
    fontSize: "0.95rem",
    ...bodyStyleOverrides,
  };

  const {
    className: messageClassName,
    style: messageStyleOverrides,
    ...restMessageProps
  } = messageProps ?? {};

  const messageClassNames = [
    "mediasfu-confirm-exit__message",
    messageClassName,
  ].filter(Boolean).join(" ") || undefined;

  const messageStyle: React.CSSProperties = {
    margin: 0,
    ...messageStyleOverrides,
  };

  const {
    className: bodyDividerClassName,
    style: bodyDividerStyleOverrides,
    ...restBodyDividerProps
  } = bodyDividerProps ?? {};

  const bodyDividerClassNames = [
    "mediasfu-confirm-exit__divider",
    bodyDividerClassName,
  ].filter(Boolean).join(" ") || undefined;

  const bodyDividerStyle: React.CSSProperties = {
    margin: "6px 0",
    height: 1,
    border: "none",
    backgroundColor: "rgba(0,0,0,0.15)",
    ...bodyDividerStyleOverrides,
  };

  const {
    className: footerClassName,
    style: footerStyleOverrides,
    ...restFooterProps
  } = footerProps ?? {};

  const footerClassNames = [
    "mediasfu-confirm-exit__footer",
    footerClassName,
  ].filter(Boolean).join(" ") || undefined;

  const footerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    flexWrap: "wrap",
    ...footerStyleOverrides,
  };

  const {
    className: cancelButtonClassName,
    style: cancelButtonStyleOverrides,
    onClick: cancelButtonOnClick,
    ...restCancelButtonProps
  } = cancelButtonProps ?? {};

  const cancelButtonClassNames = [
    "mediasfu-confirm-exit__cancel",
    cancelButtonClassName,
  ].filter(Boolean).join(" ") || undefined;

  const cancelButtonStyle: React.CSSProperties = {
    borderRadius: 6,
    backgroundColor: "black",
    color: "white",
    padding: "6px 14px",
    border: "none",
    cursor: "pointer",
    ...cancelButtonStyleOverrides,
  };

  const {
    className: confirmButtonClassName,
    style: confirmButtonStyleOverrides,
    onClick: confirmButtonOnClick,
    ...restConfirmButtonProps
  } = confirmButtonProps ?? {};

  const confirmButtonClassNames = [
    "mediasfu-confirm-exit__confirm",
    confirmButtonClassName,
  ].filter(Boolean).join(" ") || undefined;

  const confirmButtonStyle: React.CSSProperties = {
    borderRadius: 6,
    backgroundColor: "red",
    color: "white",
    padding: "6px 14px",
    border: "none",
    cursor: "pointer",
    ...confirmButtonStyleOverrides,
  };

  const handleCancelClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    cancelButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      onConfirmExitClose();
    }
  };

  const handleConfirmExit = () => {
    exitEventOnConfirm({
      socket,
      member,
      roomName,
      ban,
    });
    onConfirmExitClose();
  };

  const handleConfirmClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    confirmButtonOnClick?.(event);
    if (event.defaultPrevented) {
      return;
    }

    handleConfirmExit();
  };

  const defaultHeader = (
    <div
      className={headerClassNames}
      style={headerStyle}
      {...restHeaderProps}
    >
      <h2 className={titleClassNames} style={titleStyle} {...restTitleProps}>
        {title}
      </h2>
      <button
        type="button"
        onClick={handleCloseClick}
        className={closeButtonClassNames}
        style={closeButtonStyle}
        aria-label="Close confirm exit modal"
        {...restCloseButtonProps}
      >
        {defaultCloseIcon}
      </button>
    </div>
  );

  const headerNode = renderHeader
    ? renderHeader({
        defaultHeader,
        title,
        onClose: onConfirmExitClose,
      })
    : defaultHeader;

  const defaultMessageNode = (
    <p
      className={messageClassNames}
      style={messageStyle}
      {...restMessageProps}
    >
      {resolvedMessage}
    </p>
  );

  const messageNode = renderMessage
    ? renderMessage({
        defaultMessage: defaultMessageNode,
        resolvedMessage,
      })
    : defaultMessageNode;

  const defaultBody = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
      {messageNode}
    </div>
  );

  const bodyNode = renderBody
    ? renderBody({
        defaultBody,
        message: resolvedMessage,
      })
    : defaultBody;

  const defaultFooter = (
    <div className={footerClassNames} style={footerStyle} {...restFooterProps}>
      <button
        type="button"
        onClick={handleCancelClick}
        className={cancelButtonClassNames}
        style={cancelButtonStyle}
        {...restCancelButtonProps}
      >
        {defaultCancelLabel}
      </button>
      <button
        type="button"
        onClick={handleConfirmClick}
        className={confirmButtonClassNames}
        style={confirmButtonStyle}
        {...restConfirmButtonProps}
      >
        {defaultConfirmLabel}
      </button>
    </div>
  );

  const footerNode = renderFooter
    ? renderFooter({
        defaultFooter,
        onCancel: onConfirmExitClose,
        onConfirm: handleConfirmExit,
      })
    : defaultFooter;

  const defaultHeaderDivider = (
    <hr
      className={headerDividerClassNames}
      style={headerDividerStyle}
      {...restHeaderDividerProps}
    />
  );

  const headerDividerNode = renderHeaderDivider
    ? renderHeaderDivider({ defaultDivider: defaultHeaderDivider })
    : defaultHeaderDivider;

  const defaultBodyDivider = (
    <hr
      className={bodyDividerClassNames}
      style={bodyDividerStyle}
      {...restBodyDividerProps}
    />
  );

  const bodyDividerNode = renderBodyDivider
    ? renderBodyDivider({ defaultDivider: defaultBodyDivider })
    : defaultBodyDivider;

  const defaultContent = (
      <div
      className={contentClassNames}
      style={contentStyle}
      {...restContentProps}
      >
        {headerNode}
        {headerDividerNode}
        {bodyNode}
        {bodyDividerNode}
        {footerNode}
      </div>
  );

  const contentNode = renderContent
    ? renderContent({ defaultContent })
    : defaultContent;

  return (
    <div
      className={overlayClassNames}
      style={overlayStyle}
      {...restOverlayProps}
    >
      {contentNode}
    </div>
  );
};

export default ConfirmExitModal;
