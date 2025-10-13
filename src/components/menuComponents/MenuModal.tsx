import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

import MeetingIdComponent, {
  MeetingIdComponentOptions,
} from "./MeetingIDComponent";
import MeetingPasscodeComponent, {
  MeetingPasscodeComponentOptions,
} from "./MeetingPasscodeComponent";
import ShareButtonsComponent, {
  ShareButtonsComponentOptions,
} from "./ShareButtonsComponent";
import CustomButtons, { CustomButton, CustomButtonsOptions } from "./CustomButtons";
import { EventType } from "../../@types/types";


// Define props interface
export interface MenuModalOptions {
  backgroundColor?: string;
  isVisible: boolean;
  onClose: () => void;
  customButtons?: CustomButton[];
  shareButtons?: boolean;
  position?: string;
  roomName: string;
  adminPasscode: string;
  islevel: string;
  eventType: EventType;
  localLink?: string;
  title?: React.ReactNode;
  menuIcon?: React.ReactNode;
  menuIconProps?: Partial<FontAwesomeIconProps>;
  closeIcon?: React.ReactNode;
  closeIconProps?: Partial<FontAwesomeIconProps>;
  overlayProps?: React.HTMLAttributes<HTMLDivElement>;
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  titleWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  badgeWrapperProps?: React.HTMLAttributes<HTMLSpanElement>;
  closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  dividerProps?: React.HTMLAttributes<HTMLHRElement>;
  bodyProps?: React.HTMLAttributes<HTMLDivElement>;
  scrollWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  customButtonsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  customButtonsComponentProps?: Partial<CustomButtonsOptions>;
  meetingPasscodeWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  meetingPasscodeComponentProps?: Partial<MeetingPasscodeComponentOptions>;
  meetingIdWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  meetingIdComponentProps?: Partial<MeetingIdComponentOptions>;
  shareButtonsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  shareButtonsComponentProps?: Partial<ShareButtonsComponentOptions>;
  sectionsDividerProps?: React.HTMLAttributes<HTMLHRElement>;
  renderHeader?: (options: {
    defaultHeader: React.ReactNode;
    onClose: () => void;
  }) => React.ReactNode;
  renderTitle?: (options: {
    defaultTitle: React.ReactNode;
    menuIcon: React.ReactNode;
    titleContent: React.ReactNode;
  }) => React.ReactNode;
  renderCustomButtons?: (options: {
    defaultCustomButtons: React.ReactNode;
    buttons: CustomButton[];
  }) => React.ReactNode;
  renderMeetingPasscode?: (options: {
    defaultMeetingPasscode: React.ReactNode;
    adminPasscode: string;
    isHost: boolean;
  }) => React.ReactNode;
  renderMeetingId?: (options: {
    defaultMeetingId: React.ReactNode;
    roomName: string;
  }) => React.ReactNode;
  renderShareButtons?: (options: {
    defaultShareButtons: React.ReactNode;
    hasShareButtons: boolean;
  }) => React.ReactNode;
  renderBody?: (options: {
    defaultBody: React.ReactNode;
  }) => React.ReactNode;
  renderContent?: (options: {
    defaultContent: React.ReactNode;
  }) => React.ReactNode;
}
export type MenuModalType = (options: MenuModalOptions) => React.JSX.Element;

/**
 * MenuModal - Quick actions tray with meeting info, sharing, and custom buttons
 * 
 * A comprehensive menu modal that provides access to meeting details (ID, passcode), 
 * share functionality, and custom action buttons. Perfect for exposing common actions
 * and meeting information in a compact, accessible interface.
 * 
 * Features:
 * - Meeting ID display with copy functionality
 * - Admin passcode display (host only)
 * - Configurable share buttons for inviting participants
 * - Custom action buttons with icons and styling
 * - Flexible positioning (bottomRight, topRight, etc.)
 * - Custom render hooks for complete customization
 * - Responsive design with scrollable content
 * 
 * @component
 * @param {MenuModalOptions} options - Configuration options
 * @param {string} [options.backgroundColor="#83c0e9"] - Modal content background color
 * @param {boolean} options.isVisible - Modal visibility state
 * @param {Function} options.onClose - Callback when modal is closed
 * @param {CustomButton[]} [options.customButtons=[]] - Array of custom action buttons
 * @param {boolean} [options.shareButtons=true] - Show share buttons section
 * @param {string} [options.position="bottomRight"] - Modal position (bottomRight, topRight, etc.)
 * @param {string} options.roomName - Meeting/room identifier
 * @param {string} options.adminPasscode - Admin passcode (shown to hosts only)
 * @param {string} options.islevel - User level ('2'=host, '1'=co-host, '0'=participant)
 * @param {EventType} options.eventType - Event type (conference, webinar, etc.)
 * @param {string} [options.localLink] - Local server link for self-hosted scenarios
 * @param {React.ReactNode} [options.title="Menu"] - Modal title content
 * @param {React.ReactNode} [options.menuIcon] - Custom menu icon (defaults to faBars)
 * @param {React.ReactNode} [options.closeIcon] - Custom close icon (defaults to faTimes)
 * @param {object} [options.overlayProps] - HTML attributes for overlay div
 * @param {object} [options.contentProps] - HTML attributes for content container
 * @param {object} [options.headerProps] - HTML attributes for header section
 * @param {object} [options.titleWrapperProps] - HTML attributes for title wrapper
 * @param {object} [options.closeButtonProps] - HTML attributes for close button
 * @param {object} [options.bodyProps] - HTML attributes for body section
 * @param {Function} [options.renderHeader] - Custom header renderer
 * @param {Function} [options.renderTitle] - Custom title renderer
 * @param {Function} [options.renderCustomButtons] - Custom buttons section renderer
 * @param {Function} [options.renderMeetingPasscode] - Custom passcode section renderer
 * @param {Function} [options.renderMeetingId] - Custom meeting ID section renderer
 * @param {Function} [options.renderShareButtons] - Custom share buttons renderer
 * @param {Function} [options.renderBody] - Custom body renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 * 
 * @returns {React.JSX.Element} Rendered menu modal
 * 
 * @example
 * // Basic menu with meeting info and share buttons
 * ```tsx
 * import React, { useState } from 'react';
 * import { MenuModal } from 'mediasfu-reactjs';
 * 
 * function MeetingMenu() {
 *   const [isMenuVisible, setIsMenuVisible] = useState(false);
 * 
 *   return (
 *     <>
 *       <button onClick={() => setIsMenuVisible(true)}>Open Menu</button>
 *       <MenuModal
 *         isVisible={isMenuVisible}
 *         onClose={() => setIsMenuVisible(false)}
 *         roomName="meeting-123-456"
 *         adminPasscode="1234"
 *         islevel="2"
 *         eventType="conference"
 *         shareButtons={true}
 *         backgroundColor="#0f172a"
 *         position="bottomRight"
 *       />
 *     </>
 *   );
 * }
 * ```
 * 
 * @example
 * // Menu with custom action buttons
 * ```tsx
 * import { MenuModal } from 'mediasfu-reactjs';
 * import { faRecordVinyl, faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';
 * 
 * function CustomActionsMenu({ isVisible, onClose, onStartRecording, onViewStats }) {
 *   const customButtons = [
 *     {
 *       action: onStartRecording,
 *       show: true,
 *       backgroundColor: "#dc2626",
 *       disabled: false,
 *       icon: faRecordVinyl,
 *       text: "Start Recording",
 *       textStyle: { color: "white", fontWeight: 600 },
 *     },
 *     {
 *       action: onViewStats,
 *       show: true,
 *       backgroundColor: "#3b82f6",
 *       disabled: false,
 *       icon: faChartLine,
 *       text: "View Statistics",
 *       textStyle: { color: "white" },
 *     },
 *     {
 *       action: () => console.log("Manage participants"),
 *       show: true,
 *       backgroundColor: "#22c55e",
 *       icon: faUsers,
 *       text: "Manage Participants",
 *     },
 *   ];
 * 
 *   return (
 *     <MenuModal
 *       isVisible={isVisible}
 *       onClose={onClose}
 *       customButtons={customButtons}
 *       shareButtons={false}
 *       roomName="event-789"
 *       adminPasscode="secure123"
 *       islevel="2"
 *       eventType="webinar"
 *       backgroundColor="#1e3a8a"
 *       position="topRight"
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Custom rendering with branded styling
 * ```tsx
 * import { MenuModal } from 'mediasfu-reactjs';
 * 
 * function BrandedMenu({ isVisible, onClose, roomName, passcode }) {
 *   return (
 *     <MenuModal
 *       isVisible={isVisible}
 *       onClose={onClose}
 *       roomName={roomName}
 *       adminPasscode={passcode}
 *       islevel="2"
 *       eventType="conference"
 *       backgroundColor="transparent"
 *       contentProps={{
 *         style: {
 *           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 *           borderRadius: 16,
 *           boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
 *         },
 *       }}
 *       renderTitle={({ defaultTitle, titleContent }) => (
 *         <div style={{
 *           display: 'flex',
 *           alignItems: 'center',
 *           gap: 12,
 *           fontSize: 20,
 *           fontWeight: 700,
 *           color: '#ffffff',
 *         }}>
 *           <span>🎯</span>
 *           {titleContent}
 *         </div>
 *       )}
 *       renderMeetingId={({ defaultMeetingId, roomName }) => (
 *         <div style={{
 *           padding: 16,
 *           backgroundColor: 'rgba(255,255,255,0.1)',
 *           borderRadius: 12,
 *           backdropFilter: 'blur(10px)',
 *         }}>
 *           <p style={{ color: '#e2e8f0', fontSize: 12, marginBottom: 4 }}>Meeting ID</p>
 *           <p style={{ color: '#ffffff', fontSize: 16, fontWeight: 600, fontFamily: 'monospace' }}>
 *             {roomName}
 *           </p>
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
 * import { MediasfuGeneric, MenuModal } from 'mediasfu-reactjs';
 * 
 * const uiOverrides = {
 *   menuModal: {
 *     component: (props) => (
 *       <MenuModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         contentProps={{
 *           style: {
 *             borderRadius: 20,
 *             border: '2px solid #3b82f6',
 *             boxShadow: '0 10px 40px rgba(59,130,246,0.3)',
 *           },
 *         }}
 *         customButtonsComponentProps={{
 *           buttonStyle: {
 *             borderRadius: 12,
 *             padding: '12px 20px',
 *             transition: 'all 0.2s ease',
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


const MenuModal: React.FC<MenuModalOptions> = ({
  backgroundColor = "#83c0e9",
  isVisible,
  onClose,
  customButtons = [],
  shareButtons = true,
  position = "bottomRight",
  roomName,
  adminPasscode,
  islevel,
  eventType,
  localLink,
  title = "Menu",
  menuIcon,
  menuIconProps,
  closeIcon,
  closeIconProps,
  overlayProps,
  contentProps,
  headerProps,
  titleWrapperProps,
  badgeWrapperProps,
  closeButtonProps,
  dividerProps,
  bodyProps,
  scrollWrapperProps,
  customButtonsWrapperProps,
  customButtonsComponentProps,
  meetingPasscodeWrapperProps,
  meetingPasscodeComponentProps,
  meetingIdWrapperProps,
  meetingIdComponentProps,
  shareButtonsWrapperProps,
  shareButtonsComponentProps,
  sectionsDividerProps,
  renderHeader,
  renderTitle,
  renderCustomButtons,
  renderMeetingPasscode,
  renderMeetingId,
  renderShareButtons,
  renderBody,
  renderContent,
}) => {
  const overlayWidth =
    typeof window !== "undefined"
      ? Math.min(window.innerWidth * 0.7, 400)
      : 320;

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = ["mediasfu-menu-modal__overlay", overlayClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

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
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = ["mediasfu-menu-modal__content", contentClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const positionStyle: React.CSSProperties = {
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
  };

  const contentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor,
    borderRadius: 12,
    padding: 16,
    width: overlayWidth,
    maxHeight: "85%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: "0 12px 36px rgba(0,0,0,0.25)",
    ...positionStyle,
    ...contentStyleOverrides,
  };

  const {
    className: headerClassName,
    style: headerStyleOverrides,
    ...restHeaderProps
  } = headerProps ?? {};

  const headerClassNames = ["mediasfu-menu-modal__header", headerClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    ...headerStyleOverrides,
  };

  const {
    className: titleWrapperClassName,
    style: titleWrapperStyleOverrides,
    ...restTitleWrapperProps
  } = titleWrapperProps ?? {};

  const titleWrapperClassNames = [
    "mediasfu-menu-modal__title",
    titleWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const titleWrapperStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 18,
    fontWeight: 700,
    color: "black",
    ...titleWrapperStyleOverrides,
  };

  const {
    className: badgeWrapperClassName,
    style: badgeWrapperStyleOverrides,
    ...restBadgeWrapperProps
  } = badgeWrapperProps ?? {};

  const badgeWrapperClassNames = [
    "mediasfu-menu-modal__title-icon",
    badgeWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const badgeWrapperStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...badgeWrapperStyleOverrides,
  };

  const {
    className: closeButtonClassName,
    style: closeButtonStyleOverrides,
    onClick: closeButtonOnClick,
    ...restCloseButtonProps
  } = closeButtonProps ?? {};

  const closeButtonClassNames = [
    "mediasfu-menu-modal__close",
    closeButtonClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

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

  const {
    style: dividerStyleOverrides,
    ...restDividerProps
  } = dividerProps ?? {};

  const dividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: "black",
    border: "none",
    margin: "4px 0",
    ...dividerStyleOverrides,
  };

  const {
    className: bodyClassName,
    style: bodyStyleOverrides,
    ...restBodyProps
  } = bodyProps ?? {};

  const bodyClassNames = ["mediasfu-menu-modal__body", bodyClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const bodyStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    flex: 1,
    minHeight: 0,
    ...bodyStyleOverrides,
  };

  const {
    className: scrollWrapperClassName,
    style: scrollWrapperStyleOverrides,
    ...restScrollWrapperProps
  } = scrollWrapperProps ?? {};

  const scrollWrapperClassNames = [
    "mediasfu-menu-modal__scroll",
    scrollWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const scrollWrapperStyle: React.CSSProperties = {
    overflowY: "auto",
    maxHeight: "100%",
    paddingRight: 4,
    ...scrollWrapperStyleOverrides,
  };

  const {
    className: customButtonsWrapperClassName,
    style: customButtonsWrapperStyleOverrides,
    ...restCustomButtonsWrapperProps
  } = customButtonsWrapperProps ?? {};

  const customButtonsWrapperClassNames = [
    "mediasfu-menu-modal__custom-buttons",
    customButtonsWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const customButtonsWrapperStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    ...customButtonsWrapperStyleOverrides,
  };

  const customButtonsOptions: CustomButtonsOptions = {
    buttons: customButtons,
    ...(customButtonsComponentProps ?? {}),
  };

  const {
    className: meetingPasscodeWrapperClassName,
    style: meetingPasscodeWrapperStyleOverrides,
    ...restMeetingPasscodeWrapperProps
  } = meetingPasscodeWrapperProps ?? {};

  const meetingPasscodeWrapperClassNames = [
    "mediasfu-menu-modal__passcode",
    meetingPasscodeWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const meetingPasscodeWrapperStyle: React.CSSProperties = {
    margin: "10px 0",
    ...meetingPasscodeWrapperStyleOverrides,
  };

  const meetingPasscodeOptions: MeetingPasscodeComponentOptions = {
    meetingPasscode: adminPasscode,
    ...(meetingPasscodeComponentProps ?? {}),
  };

  const {
    className: meetingIdWrapperClassName,
    style: meetingIdWrapperStyleOverrides,
    ...restMeetingIdWrapperProps
  } = meetingIdWrapperProps ?? {};

  const meetingIdWrapperClassNames = [
    "mediasfu-menu-modal__meeting-id",
    meetingIdWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const meetingIdWrapperStyle: React.CSSProperties = {
    marginBottom: 10,
    ...meetingIdWrapperStyleOverrides,
  };

  const meetingIdOptions: MeetingIdComponentOptions = {
    meetingID: roomName,
    ...(meetingIdComponentProps ?? {}),
  };

  const {
    className: shareButtonsWrapperClassName,
    style: shareButtonsWrapperStyleOverrides,
    ...restShareButtonsWrapperProps
  } = shareButtonsWrapperProps ?? {};

  const shareButtonsWrapperClassNames = [
    "mediasfu-menu-modal__share-buttons",
    shareButtonsWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const shareButtonsWrapperStyle: React.CSSProperties = {
    marginTop: 10,
    ...shareButtonsWrapperStyleOverrides,
  };

  const shareButtonsOptions: ShareButtonsComponentOptions = {
    meetingID: roomName,
    eventType,
    localLink,
    ...(shareButtonsComponentProps ?? {}),
  } as ShareButtonsComponentOptions;

  const {
    style: sectionsDividerStyleOverrides,
    ...restSectionsDividerProps
  } = sectionsDividerProps ?? {};

  const sectionsDividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: "#ffffff",
    border: "none",
    margin: "10px 0",
    ...sectionsDividerStyleOverrides,
  };

  const resolvedMenuIcon =
    menuIcon ?? (
      <FontAwesomeIcon
        icon={faBars}
        style={{ fontSize: 20, color: "black", ...(menuIconProps?.style ?? {}) }}
        {...menuIconProps}
      />
    );

  const resolvedCloseIcon =
    closeIcon ?? (
      <FontAwesomeIcon
        icon={faTimes}
        style={{ fontSize: 20, color: "black", ...(closeIconProps?.style ?? {}) }}
        {...closeIconProps}
      />
    );

  const handleCloseClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    closeButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      onClose();
    }
  };

  const defaultTitle = (
    <div
      className={titleWrapperClassNames}
      style={titleWrapperStyle}
      {...restTitleWrapperProps}
    >
      <span
        className={badgeWrapperClassNames}
        style={badgeWrapperStyle}
        {...restBadgeWrapperProps}
      >
        {resolvedMenuIcon}
      </span>
      <span>{title}</span>
    </div>
  );

  const titleNode = renderTitle
    ? renderTitle({
        defaultTitle,
        menuIcon: resolvedMenuIcon,
        titleContent: title,
      })
    : defaultTitle;

  const defaultCustomButtons = (
    <div
      className={customButtonsWrapperClassNames}
      style={customButtonsWrapperStyle}
      {...restCustomButtonsWrapperProps}
    >
      <CustomButtons {...customButtonsOptions} />
    </div>
  );

  const customButtonsNode = renderCustomButtons
    ? renderCustomButtons({
        defaultCustomButtons,
        buttons: customButtonsOptions.buttons,
      })
    : defaultCustomButtons;

  const shouldShowPasscode = islevel === "2";

  const defaultMeetingPasscode = shouldShowPasscode ? (
    <div
      className={meetingPasscodeWrapperClassNames}
      style={meetingPasscodeWrapperStyle}
      {...restMeetingPasscodeWrapperProps}
    >
      <MeetingPasscodeComponent {...meetingPasscodeOptions} />
    </div>
  ) : null;

  const meetingPasscodeNode = renderMeetingPasscode
    ? renderMeetingPasscode({
        defaultMeetingPasscode,
        adminPasscode,
        isHost: shouldShowPasscode,
      })
    : defaultMeetingPasscode;

  const defaultMeetingId = (
    <div
      className={meetingIdWrapperClassNames}
      style={meetingIdWrapperStyle}
      {...restMeetingIdWrapperProps}
    >
      <MeetingIdComponent {...meetingIdOptions} />
    </div>
  );

  const meetingIdNode = renderMeetingId
    ? renderMeetingId({
        defaultMeetingId,
        roomName,
      })
    : defaultMeetingId;

  const hasShareButtons = Boolean(shareButtons);

  const defaultShareButtonsNode = hasShareButtons ? (
    <div
      className={shareButtonsWrapperClassNames}
      style={shareButtonsWrapperStyle}
      {...restShareButtonsWrapperProps}
    >
      <ShareButtonsComponent {...shareButtonsOptions} />
    </div>
  ) : null;

  const shareButtonsNode = renderShareButtons
    ? renderShareButtons({
        defaultShareButtons: defaultShareButtonsNode,
        hasShareButtons,
      })
    : defaultShareButtonsNode;

  const defaultScrollWrapper = (
    <div
      className={scrollWrapperClassNames}
      style={scrollWrapperStyle}
      {...restScrollWrapperProps}
    >
      {customButtonsNode}
      <hr style={sectionsDividerStyle} {...restSectionsDividerProps} />
      {meetingPasscodeNode}
      {meetingIdNode}
      {shareButtonsNode}
    </div>
  );

  const scrollContent = renderBody
    ? renderBody({ defaultBody: defaultScrollWrapper })
    : defaultScrollWrapper;

  const defaultHeader = (
    <div className={headerClassNames} style={headerStyle} {...restHeaderProps}>
      {titleNode}
      <button
        type="button"
        className={closeButtonClassNames}
        style={closeButtonStyle}
        onClick={handleCloseClick}
        {...restCloseButtonProps}
      >
        {resolvedCloseIcon}
      </button>
    </div>
  );

  const headerNode = renderHeader
    ? renderHeader({
        defaultHeader,
        onClose,
      })
    : defaultHeader;

  const defaultContent = (
    <div className={contentClassNames} style={contentStyle} {...restContentProps}>
      {headerNode}
      <hr style={dividerStyle} {...restDividerProps} />
      <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
        {scrollContent}
      </div>
    </div>
  );

  const contentNode = renderContent
    ? renderContent({ defaultContent })
    : defaultContent;

  return (
    <div className={overlayClassNames} style={overlayStyle} {...restOverlayProps}>
      {contentNode}
    </div>
  );
};

export default MenuModal;
