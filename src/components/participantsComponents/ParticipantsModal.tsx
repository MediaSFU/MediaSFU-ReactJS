import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ParticipantList from "./ParticipantList";
import ParticipantListOthers from "./ParticipantListOthers";
import { muteParticipants } from "../../methods/participantsMethods/muteParticipants";
import { messageParticipants } from "../../methods/participantsMethods/messageParticipants";
import { removeParticipants } from "../../methods/participantsMethods/removeParticipants";
import {
  CoHostResponsibility,
  EventType,
  Participant,
  ShowAlert,
} from "../../@types/types";
import { Socket } from "socket.io-client";
import { ModalRenderMode } from "../menuComponents/MenuModal";

export interface ParticipantsModalParameters {
  position?: string;
  backgroundColor?: string;
  coHostResponsibility: CoHostResponsibility[];
  coHost: string;
  member: string;
  islevel: string;
  participants: Participant[];
  eventType: EventType;
  filteredParticipants: Participant[];
  socket: Socket;
  showAlert?: ShowAlert;
  roomName: string;
  updateIsMessagesModalVisible: (isVisible: boolean) => void;
  updateDirectMessageDetails: (participant: Participant | null) => void;
  updateStartDirectMessage: (start: boolean) => void;
  updateParticipants: (participants: Participant[]) => void;
  getUpdatedAllParams: () => ParticipantsModalParameters;
  [key: string]: any;
}

export interface ParticipantsModalOptions {
  isParticipantsModalVisible: boolean;
  onParticipantsClose: () => void;
  onParticipantsFilterChange: (filter: string) => void;
  participantsCounter: number;
  onMuteParticipants?: typeof muteParticipants;
  onMessageParticipants?: typeof messageParticipants;
  onRemoveParticipants?: typeof removeParticipants;
  RenderParticipantList?: React.ComponentType<any>;
  RenderParticipantListOthers?: React.ComponentType<any>;
  parameters: ParticipantsModalParameters;
  backgroundColor?: string;
  position?: string;
  /** Theme control - whether dark mode is active */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects (modern UI) */
  enableGlassmorphism?: boolean;
  /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
  renderMode?: ModalRenderMode;
  title?: React.ReactNode;
  overlayProps?: React.HTMLAttributes<HTMLDivElement>;
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  titleProps?: React.HTMLAttributes<HTMLDivElement>;
  badgeWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  badgeProps?: React.HTMLAttributes<HTMLSpanElement>;
  closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  closeIconComponent?: React.ReactNode;
  bodyProps?: React.HTMLAttributes<HTMLDivElement>;
  searchWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  searchInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  listsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  moderatorListProps?: React.HTMLAttributes<HTMLDivElement>;
  attendeeListProps?: React.HTMLAttributes<HTMLDivElement>;
  emptyState?: React.ReactNode | ((context: { counter: number }) => React.ReactNode);
  renderHeader?: (options: {
    defaultHeader: React.ReactNode;
    counter: number;
    onClose: () => void;
  }) => React.ReactNode;
  renderSearch?: (options: {
    defaultSearch: React.ReactNode;
    onFilter: (value: string) => void;
  }) => React.ReactNode;
  renderLists?: (options: {
    defaultLists: React.ReactNode;
    participants: Participant[];
    hasModeratorControls: boolean;
  }) => React.ReactNode;
  renderBody?: (options: {
    defaultBody: React.ReactNode;
    counter: number;
  }) => React.ReactNode;
  renderContent?: (options: {
    defaultContent: React.ReactNode;
    counter: number;
  }) => React.ReactNode;
}

export type ParticipantsModalType = (
  options: ParticipantsModalOptions
) => React.JSX.Element;

/**
 * ParticipantsModal - Comprehensive participant management interface
 * 
 * A feature-rich modal for viewing and managing meeting participants with search,
 * filtering, and moderator controls. Displays separate lists for moderators and
 * attendees with role-based actions (mute, message, remove).
 * 
 * Features:
 * - Real-time participant count badge
 * - Search/filter functionality for large participant lists
 * - Separate moderator and attendee sections
 * - Role-based action buttons (mute, message, remove)
 * - Co-host permission controls
 * - Direct messaging initiation
 * - Custom render hooks for complete UI flexibility
 * - Responsive positioning (topRight, topLeft, etc.)
 * 
 * @component
 * @param {ParticipantsModalOptions} options - Configuration options
 * @param {boolean} options.isParticipantsModalVisible - Modal visibility state
 * @param {Function} options.onParticipantsClose - Callback when modal is closed
 * @param {Function} options.onParticipantsFilterChange - Callback when search filter changes
 * @param {number} options.participantsCounter - Total participant count for badge
 * @param {Function} [options.onMuteParticipants] - Handler for muting participants (defaults to built-in)
 * @param {Function} [options.onMessageParticipants] - Handler for messaging participants (defaults to built-in)
 * @param {Function} [options.onRemoveParticipants] - Handler for removing participants (defaults to built-in)
 * @param {React.ComponentType} [options.RenderParticipantList] - Custom component for moderator list
 * @param {React.ComponentType} [options.RenderParticipantListOthers] - Custom component for attendee list
 * @param {ParticipantsModalParameters} options.parameters - MediaSFU parameters object
 * @param {string} [options.backgroundColor="#83c0e9"] - Modal background color
 * @param {string} [options.position="topRight"] - Modal position on screen
 * @param {React.ReactNode} [options.title="Participants"] - Modal title content
 * @param {object} [options.overlayProps] - HTML attributes for overlay div
 * @param {object} [options.contentProps] - HTML attributes for content container
 * @param {object} [options.headerProps] - HTML attributes for header section
 * @param {object} [options.titleProps] - HTML attributes for title element
 * @param {object} [options.badgeWrapperProps] - HTML attributes for badge wrapper
 * @param {object} [options.badgeProps] - HTML attributes for count badge
 * @param {object} [options.closeButtonProps] - HTML attributes for close button
 * @param {React.ReactNode} [options.closeIconComponent] - Custom close icon
 * @param {object} [options.bodyProps] - HTML attributes for body section
 * @param {object} [options.searchWrapperProps] - HTML attributes for search wrapper
 * @param {object} [options.searchInputProps] - HTML attributes for search input
 * @param {object} [options.listsWrapperProps] - HTML attributes for lists container
 * @param {object} [options.moderatorListProps] - HTML attributes for moderator section
 * @param {object} [options.attendeeListProps] - HTML attributes for attendee section
 * @param {React.ReactNode|Function} [options.emptyState] - Content when no participants match filter
 * @param {Function} [options.renderHeader] - Custom header renderer
 * @param {Function} [options.renderSearch] - Custom search renderer
 * @param {Function} [options.renderLists] - Custom participant lists renderer
 * @param {Function} [options.renderBody] - Custom body renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 * 
 * @returns {React.JSX.Element} Rendered participants modal
 * 
 * @example
 * // Basic participant modal with default controls
 * ```tsx
 * import React, { useState } from 'react';
 * import { ParticipantsModal } from 'mediasfu-reactjs';
 * 
 * function Meeting({ parameters }) {
 *   const [isVisible, setIsVisible] = useState(false);
 *   const [filter, setFilter] = useState('');
 * 
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Show Participants ({parameters.participants.length})
 *       </button>
 *       <ParticipantsModal
 *         isParticipantsModalVisible={isVisible}
 *         onParticipantsClose={() => setIsVisible(false)}
 *         onParticipantsFilterChange={setFilter}
 *         participantsCounter={parameters.participants.length}
 *         parameters={parameters}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *       />
 *     </>
 *   );
 * }
 * ```
 * 
 * @example
 * // Custom styling with branded colors
 * ```tsx
 * import { ParticipantsModal } from 'mediasfu-reactjs';
 * 
 * function BrandedParticipants({ isVisible, onClose, parameters, participantCount }) {
 *   return (
 *     <ParticipantsModal
 *       isParticipantsModalVisible={isVisible}
 *       onParticipantsClose={onClose}
 *       onParticipantsFilterChange={(filter) => console.log('Filter:', filter)}
 *       participantsCounter={participantCount}
 *       parameters={parameters}
 *       backgroundColor="#1e3a8a"
 *       position="topLeft"
 *       contentProps={{
 *         style: {
 *           borderRadius: 20,
 *           border: '2px solid #3b82f6',
 *           boxShadow: '0 20px 60px rgba(59,130,246,0.3)',
 *         },
 *       }}
 *       badgeProps={{
 *         style: {
 *           backgroundColor: '#22c55e',
 *           color: 'white',
 *           fontWeight: 700,
 *           padding: '4px 12px',
 *           borderRadius: 12,
 *         },
 *       }}
 *       searchInputProps={{
 *         placeholder: 'Search by name...',
 *         style: {
 *           borderRadius: 12,
 *           padding: '12px 16px',
 *           border: '2px solid #3b82f6',
 *           fontSize: 14,
 *         },
 *       }}
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Custom render with analytics tracking
 * ```tsx
 * import { ParticipantsModal } from 'mediasfu-reactjs';
 * 
 * function AnalyticsParticipants({ parameters, isVisible, onClose }) {
 *   return (
 *     <ParticipantsModal
 *       isParticipantsModalVisible={isVisible}
 *       onParticipantsClose={onClose}
 *       onParticipantsFilterChange={(filter) => {
 *         analytics.track('participant_search', { query: filter });
 *       }}
 *       participantsCounter={parameters.participants.length}
 *       parameters={parameters}
 *       onMuteParticipants={async (options) => {
 *         analytics.track('participant_muted', { participantId: options.participant.id });
 *         return muteParticipants(options);
 *       }}
 *       onMessageParticipants={async (options) => {
 *         analytics.track('direct_message_initiated', { participantId: options.participant.id });
 *         return messageParticipants(options);
 *       }}
 *       renderHeader={({ defaultHeader, counter }) => (
 *         <div style={{
 *           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 *           padding: 20,
 *           borderRadius: '16px 16px 0 0',
 *         }}>
 *           {defaultHeader}
 *           <p style={{ color: '#e2e8f0', fontSize: 12, marginTop: 8 }}>
 *             {counter} active participant{counter !== 1 ? 's' : ''}
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
 * import { MediasfuGeneric, ParticipantsModal } from 'mediasfu-reactjs';
 * 
 * const uiOverrides = {
 *   participantsModal: {
 *     component: (props) => (
 *       <ParticipantsModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         contentProps={{
 *           style: {
 *             maxHeight: '80vh',
 *             borderRadius: 20,
 *             border: '2px solid #3b82f6',
 *           },
 *         }}
 *         searchInputProps={{
 *           placeholder: 'Filter participants...',
 *           style: {
 *             borderRadius: 12,
 *             border: '1px solid #3b82f6',
 *             padding: '10px 14px',
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

const ParticipantsModal: React.FC<ParticipantsModalOptions> = ({
  isParticipantsModalVisible,
  onParticipantsClose,
  onParticipantsFilterChange,
  participantsCounter,
  onMuteParticipants = muteParticipants,
  onMessageParticipants = messageParticipants,
  onRemoveParticipants = removeParticipants,
  RenderParticipantList = ParticipantList,
  RenderParticipantListOthers = ParticipantListOthers,
  parameters,
  backgroundColor = parameters?.backgroundColor ?? "#83c0e9",
  position = parameters?.position ?? "topRight",
  title = "Participants",
  overlayProps,
  contentProps,
  headerProps,
  titleProps,
  badgeWrapperProps,
  badgeProps,
  closeButtonProps,
  closeIconComponent,
  bodyProps,
  searchWrapperProps,
  searchInputProps,
  listsWrapperProps,
  moderatorListProps,
  attendeeListProps,
  emptyState,
  renderHeader,
  renderSearch,
  renderLists,
  renderBody,
  renderContent,
}) => {
  const {
    coHostResponsibility,
    coHost,
    member,
    islevel,
    participants,
    eventType,
    socket,
    showAlert,
    roomName,
    updateIsMessagesModalVisible,
    updateDirectMessageDetails,
    updateStartDirectMessage,
    updateParticipants,
    filteredParticipants,
    getUpdatedAllParams,
  } = parameters;

  const initialParticipants = useMemo(() => {
    if (getUpdatedAllParams) {
      return getUpdatedAllParams().filteredParticipants;
    }

    if (filteredParticipants) {
      return filteredParticipants;
    }

    return participants;
  }, [filteredParticipants, getUpdatedAllParams, participants]);

  const [participantsState, setParticipantsState] = useState(initialParticipants);
  const [participantsCounterState, setParticipantsCounterState] = useState<number>(
    filteredParticipants?.length ?? participantsCounter
  );
  const [rerenderToggle, setRerenderToggle] = useState(false);

  useEffect(() => {
    if (getUpdatedAllParams) {
      const updatedParams = getUpdatedAllParams();
      setParticipantsState(updatedParams.filteredParticipants);
      setParticipantsCounterState(updatedParams.filteredParticipants.length);
      return;
    }

    if (filteredParticipants) {
      setParticipantsState(filteredParticipants);
      setParticipantsCounterState(filteredParticipants.length);
      return;
    }

    setParticipantsState(participants);
    setParticipantsCounterState(participants.length);
  }, [filteredParticipants, participants, getUpdatedAllParams, rerenderToggle]);

  const defaultOverlayWidth =
    typeof window !== "undefined" ? Math.min(window.innerWidth * 0.8, 400) : 360;

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = [
    "mediasfu-participants-modal",
    overlayClassName,
  ]
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
    display: isParticipantsModalVisible ? "block" : "none",
    zIndex: 999,
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = [
    "mediasfu-participants-modal__content",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const contentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor,
    borderRadius: 10,
    padding: 16,
    width: defaultOverlayWidth,
    maxHeight: "75%",
    overflowY: "auto",
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
    ...contentStyleOverrides,
  };

  const {
    className: headerClassName,
    style: headerStyleOverrides,
    ...restHeaderProps
  } = headerProps ?? {};

  const headerClassNames = [
    "modal-header",
    headerClassName,
  ]
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
    className: titleClassName,
    style: titleStyleOverrides,
    ...restTitleProps
  } = titleProps ?? {};

  const titleClassNames = [
    "modal-title",
    titleClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const titleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: 0,
    ...titleStyleOverrides,
  };

  const {
    className: badgeWrapperClassName,
    style: badgeWrapperStyleOverrides,
    ...restBadgeWrapperProps
  } = badgeWrapperProps ?? {};

  const badgeWrapperClassNames = [
    "participants-counter",
    badgeWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const badgeWrapperStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 10,
    padding: 5,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...badgeWrapperStyleOverrides,
  };

  const {
    className: badgeClassName,
    style: badgeStyleOverrides,
    ...restBadgeProps
  } = badgeProps ?? {};

  const badgeClassNames = ["badge", badgeClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const badgeStyle: React.CSSProperties = {
    ...badgeStyleOverrides,
  };

  const {
    className: closeButtonClassName,
    style: closeButtonStyleOverrides,
    onClick: closeButtonOnClick,
    ...restCloseButtonProps
  } = closeButtonProps ?? {};

  const closeButtonClassNames = [
    "btn-close-participants",
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

  const defaultCloseIcon = closeIconComponent ?? (
    <FontAwesomeIcon icon={faTimes} className="icon" />
  );

  const handleCloseClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    closeButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      onParticipantsClose();
    }
  };

  const {
    className: bodyClassName,
    style: bodyStyleOverrides,
    ...restBodyProps
  } = bodyProps ?? {};

  const bodyClassNames = ["modal-body", bodyClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const bodyStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    ...bodyStyleOverrides,
  };

  const {
    className: searchWrapperClassName,
    style: searchWrapperStyleOverrides,
    ...restSearchWrapperProps
  } = searchWrapperProps ?? {};

  const searchWrapperClassNames = ["form-group", searchWrapperClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const searchWrapperStyle: React.CSSProperties = {
    ...searchWrapperStyleOverrides,
  };

  const handleFilterChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    searchInputProps?.onChange?.(event);
    if (!event.defaultPrevented) {
      onParticipantsFilterChange(event.target.value);
      setRerenderToggle((prev) => !prev);
    }
  };

  const {
    className: listsWrapperClassName,
    style: listsWrapperStyleOverrides,
    ...restListsWrapperProps
  } = listsWrapperProps ?? {};

  const listsWrapperClassNames = [
    "participants-lists",
    listsWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const listsWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto",
    ...listsWrapperStyleOverrides,
  };

  const {
    className: moderatorListClassName,
    style: moderatorListStyleOverrides,
    ...restModeratorListProps
  } = moderatorListProps ?? {};

  const moderatorListClassNames = [
    "participants-list--moderator",
    moderatorListClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const {
    className: attendeeListClassName,
    style: attendeeListStyleOverrides,
    ...restAttendeeListProps
  } = attendeeListProps ?? {};

  const attendeeListClassNames = [
    "participants-list--attendee",
    attendeeListClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const canModerate = (() => {
    try {
      const responsibility = coHostResponsibility?.find(
        (item: { name: string; value: boolean }) => item.name === "participants"
      );
      const participantsValue = responsibility?.value ?? false;
      return (
        (participants && islevel === "2") ||
        (coHost === member && participantsValue === true)
      );
    } catch {
      return (participants && islevel === "2") || false;
    }
  })();

  const renderDefaultLists = (): React.ReactNode => {
    if (!participantsState || participantsState.length === 0) {
      if (emptyState) {
        return typeof emptyState === "function"
          ? emptyState({ counter: participantsCounterState })
          : emptyState;
      }
      return <div className="participants-empty">No participants</div>;
    }

    if (canModerate) {
      return (
        <div
          className={moderatorListClassNames}
          style={moderatorListStyleOverrides}
          {...restModeratorListProps}
        >
          <RenderParticipantList
            participants={participantsState}
            isBroadcast={eventType === "broadcast"}
            onMuteParticipants={onMuteParticipants}
            onMessageParticipants={onMessageParticipants}
            onRemoveParticipants={onRemoveParticipants}
            socket={socket}
            coHostResponsibility={coHostResponsibility}
            member={member}
            islevel={islevel}
            showAlert={showAlert}
            coHost={coHost}
            roomName={roomName}
            updateIsMessagesModalVisible={updateIsMessagesModalVisible}
            updateDirectMessageDetails={updateDirectMessageDetails}
            updateStartDirectMessage={updateStartDirectMessage}
            updateParticipants={updateParticipants}
          />
        </div>
      );
    }

    return (
      <div
        className={attendeeListClassNames}
        style={attendeeListStyleOverrides}
        {...restAttendeeListProps}
      >
        <RenderParticipantListOthers
          participants={participantsState}
          coHost={coHost}
          member={member}
        />
      </div>
    );
  };

  const defaultLists = (
    <div
      className={listsWrapperClassNames}
      style={listsWrapperStyle}
      {...restListsWrapperProps}
    >
      {renderDefaultLists()}
    </div>
  );

  const listsNode = renderLists
    ? renderLists({
        defaultLists,
        participants: participantsState,
        hasModeratorControls: canModerate,
      })
    : defaultLists;

  const defaultHeader = (
    <div className={headerClassNames} style={headerStyle} {...restHeaderProps}>
      <div className={titleClassNames} style={titleStyle} {...restTitleProps}>
        {title}
        <div
          className={badgeWrapperClassNames}
          style={badgeWrapperStyle}
          {...restBadgeWrapperProps}
        >
          <span className={badgeClassNames} style={badgeStyle} {...restBadgeProps}>
            {participantsCounterState}
          </span>
        </div>
      </div>
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

  const headerNode = renderHeader
    ? renderHeader({
        defaultHeader,
        counter: participantsCounterState,
        onClose: onParticipantsClose,
      })
    : defaultHeader;

  const defaultSearchInput = (
    <input
      type="text"
      placeholder="Search ..."
      {...searchInputProps}
      className={searchInputProps?.className}
      style={{
        width: "90%",
        padding: 10,
        borderRadius: 5,
        border: "1px solid #000",
        fontSize: 16,
        marginBottom: 10,
        ...searchInputProps?.style,
      }}
      onChange={handleFilterChange}
    />
  );

  const searchNode = renderSearch
    ? renderSearch({
        defaultSearch: defaultSearchInput,
        onFilter: (value: string) => {
          onParticipantsFilterChange(value);
          setRerenderToggle((prev) => !prev);
        },
      })
    : defaultSearchInput;

  const defaultBody = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
      <div
        className={searchWrapperClassNames}
        style={searchWrapperStyle}
        {...restSearchWrapperProps}
      >
        {searchNode}
      </div>
      {listsNode}
    </div>
  );

  const bodyNode = renderBody
    ? renderBody({
        defaultBody,
        counter: participantsCounterState,
      })
    : defaultBody;

  const defaultContent = (
    <div className={contentClassNames} style={contentStyle} {...restContentProps}>
      {headerNode}
      <hr className="hr" />
      {bodyNode}
    </div>
  );

  const contentNode = renderContent
    ? renderContent({
        defaultContent,
        counter: participantsCounterState,
      })
    : defaultContent;

  return (
    <div className={overlayClassNames} style={overlayStyle} {...restOverlayProps}>
      {contentNode}
    </div>
  );
};

export default ParticipantsModal;
