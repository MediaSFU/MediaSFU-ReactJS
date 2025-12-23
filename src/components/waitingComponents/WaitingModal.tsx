import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  respondToWaiting,
  RespondToWaitingType,
} from "../../methods/waitingMethods/respondToWaiting";
import "./WaitingRoomModal.css";
import { WaitingRoomParticipant } from "../../@types/types";
import { Socket } from "socket.io-client";
import { ModalRenderMode } from "../menuComponents/MenuModal";

export interface WaitingRoomModalParameters {
  filteredWaitingRoomList: WaitingRoomParticipant[];

  // mediasfu functions
  getUpdatedAllParams: () => WaitingRoomModalParameters;
  [key: string]: any;
}

export interface WaitingRoomModalOptions {
  isWaitingModalVisible: boolean;
  onWaitingRoomClose: () => void;
  waitingRoomCounter: number;
  onWaitingRoomFilterChange: (filter: string) => void;
  waitingRoomList: WaitingRoomParticipant[];
  updateWaitingList: (updatedList: WaitingRoomParticipant[]) => void;
  roomName: string;
  socket: Socket;
  position?: string;
  backgroundColor?: string;
  parameters: WaitingRoomModalParameters;
  /** Theme control - whether dark mode is active */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects (modern UI) */
  enableGlassmorphism?: boolean;
  /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
  renderMode?: ModalRenderMode;

  // mediasfu functions
  onWaitingRoomItemPress?: RespondToWaitingType;

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
  waitingListProps?: React.HTMLAttributes<HTMLDivElement>;
  participantRowProps?: React.HTMLAttributes<HTMLDivElement>;
  acceptButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  rejectButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  acceptIconComponent?: React.ReactNode;
  rejectIconComponent?: React.ReactNode;
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
  renderParticipant?: (options: {
    participant: WaitingRoomParticipant;
    index: number;
    defaultParticipant: React.ReactNode;
    handleAccept: () => void;
    handleReject: () => void;
  }) => React.ReactNode;
  renderBody?: (options: {
    defaultBody: React.ReactNode;
    counter: number;
  }) => React.ReactNode;
}

export type WaitingRoomModalType = (
  options: WaitingRoomModalOptions
) => React.JSX.Element;

const WaitingRoomModal: React.FC<WaitingRoomModalOptions> = ({
  isWaitingModalVisible,
  onWaitingRoomClose,
  waitingRoomCounter,
  onWaitingRoomFilterChange,
  waitingRoomList,
  updateWaitingList,
  roomName,
  socket,
  onWaitingRoomItemPress = respondToWaiting,
  position = "topRight",
  backgroundColor = "#83c0e9",
  parameters,
  title = "Waiting",
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
  waitingListProps,
  participantRowProps,
  acceptButtonProps,
  rejectButtonProps,
  acceptIconComponent,
  rejectIconComponent,
  emptyState,
  renderHeader,
  renderSearch,
  renderParticipant,
  renderBody,
}) => {
  const initialList = useMemo(
    () => parameters?.filteredWaitingRoomList ?? waitingRoomList,
    [parameters, waitingRoomList]
  );

  const [waitingRoomListState, setWaitingRoomListState] =
    useState<WaitingRoomParticipant[]>(initialList);
  const [waitingRoomCounterState, setWaitingRoomCounterState] =
    useState<number>(parameters?.filteredWaitingRoomList?.length ?? waitingRoomCounter);
  const [rerenderToggle, setRerenderToggle] = useState(false);

  useEffect(() => {
    if (parameters?.getUpdatedAllParams) {
      const latestParams = parameters.getUpdatedAllParams();
      setWaitingRoomListState(latestParams.filteredWaitingRoomList);
      setWaitingRoomCounterState(latestParams.filteredWaitingRoomList.length);
    } else if (parameters?.filteredWaitingRoomList) {
      setWaitingRoomListState(parameters.filteredWaitingRoomList);
      setWaitingRoomCounterState(parameters.filteredWaitingRoomList.length);
    } else {
      setWaitingRoomListState(waitingRoomList);
      setWaitingRoomCounterState(waitingRoomList.length);
    }
  }, [parameters, waitingRoomList, rerenderToggle]);

  const defaultOverlayWidth =
    typeof window !== "undefined" ? Math.min(window.innerWidth * 0.8, 350) : 320;

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = [
    "mediasfu-waiting-modal",
    overlayClassName,
  ].filter(Boolean).join(" ") || undefined;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isWaitingModalVisible ? "block" : "none",
    zIndex: 999,
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = [
    "mediasfu-waiting-modal__content",
    contentClassName,
  ].filter(Boolean).join(" ") || undefined;

  const contentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor,
    borderRadius: 10,
    padding: 16,
    width: defaultOverlayWidth,
    maxHeight: "65%",
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
    "modal-title",
    titleClassName,
  ].filter(Boolean).join(" ") || undefined;

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
    "waiting-counter",
    badgeWrapperClassName,
  ].filter(Boolean).join(" ") || undefined;

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

  const badgeClassNames = [
    "badge",
    badgeClassName,
  ].filter(Boolean).join(" ") || undefined;

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
    "btn-close-waitings",
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
    <FontAwesomeIcon icon={faTimes} className="icon" />
  );

  const handleCloseClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    closeButtonOnClick?.(event);
    if (event.defaultPrevented) {
      return;
    }
    onWaitingRoomClose();
  };

  const {
    className: bodyClassName,
    style: bodyStyleOverrides,
    ...restBodyProps
  } = bodyProps ?? {};

  const bodyClassNames = [
    "modal-body",
    bodyClassName,
  ].filter(Boolean).join(" ") || undefined;

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

  const searchWrapperClassNames = [
    "form-group",
    searchWrapperClassName,
  ].filter(Boolean).join(" ") || undefined;

  const searchWrapperStyle: React.CSSProperties = {
    ...searchWrapperStyleOverrides,
  };

  const {
    className: waitingListClassName,
    style: waitingListStyleOverrides,
    ...restWaitingListProps
  } = waitingListProps ?? {};

  const waitingListClassNames = [
    "waiting-list",
    waitingListClassName,
  ].filter(Boolean).join(" ") || undefined;

  const waitingListStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    ...waitingListStyleOverrides,
  };

  const handleFilterChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    searchInputProps?.onChange?.(event);
    if (!event.defaultPrevented) {
      onWaitingRoomFilterChange(event.target.value);
      setRerenderToggle((prev) => !prev);
    }
  };

  const {
    className: participantRowClassName,
    style: participantRowStyleOverrides,
    ...restParticipantRowProps
  } = participantRowProps ?? {};

  const participantRowClassNames = [
    "waiting-item",
    participantRowClassName,
  ].filter(Boolean).join(" ") || undefined;

  const {
    className: acceptButtonClassName,
    style: acceptButtonStyleOverrides,
    onClick: acceptButtonOnClick,
    ...restAcceptButtonProps
  } = acceptButtonProps ?? {};

  const acceptButtonClassNames = [
    acceptButtonClassName,
  ].filter(Boolean).join(" ") || undefined;

  const {
    className: rejectButtonClassName,
    style: rejectButtonStyleOverrides,
    onClick: rejectButtonOnClick,
    ...restRejectButtonProps
  } = rejectButtonProps ?? {};

  const rejectButtonClassNames = [
    rejectButtonClassName,
  ].filter(Boolean).join(" ") || undefined;

  const renderParticipantRow = (
    participant: WaitingRoomParticipant,
    index: number
  ): React.ReactNode => {
    const handleAccept = () => {
      onWaitingRoomItemPress({
        participantId: participant.id,
        participantName: participant.name,
        updateWaitingList,
        waitingList: waitingRoomList,
        roomName,
        type: true,
        socket,
      });
    };

    const handleReject = () => {
      onWaitingRoomItemPress({
        participantId: participant.id,
        participantName: participant.name,
        updateWaitingList,
        waitingList: waitingRoomList,
        roomName,
        type: false,
        socket,
      });
    };

    const acceptButton = (
      <button
        type="button"
        className={acceptButtonClassNames}
        style={acceptButtonStyleOverrides}
        onClick={(event) => {
          acceptButtonOnClick?.(event);
          if (!event.defaultPrevented) {
            handleAccept();
          }
        }}
        {...restAcceptButtonProps}
      >
        {acceptIconComponent ?? (
          <FontAwesomeIcon icon={faCheck} size="lg" color="green" />
        )}
      </button>
    );

    const rejectButton = (
      <button
        type="button"
        className={rejectButtonClassNames}
        style={rejectButtonStyleOverrides}
        onClick={(event) => {
          rejectButtonOnClick?.(event);
          if (!event.defaultPrevented) {
            handleReject();
          }
        }}
        {...restRejectButtonProps}
      >
        {rejectIconComponent ?? (
          <FontAwesomeIcon icon={faTimes} size="lg" color="red" />
        )}
      </button>
    );

    const defaultParticipant = (
      <div
        className={participantRowClassNames}
        style={{
          marginTop: 5,
          flexDirection: "row",
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
          ...participantRowStyleOverrides,
        }}
        {...restParticipantRowProps}
      >
        <div className="col7">{participant.name}</div>
        <div className="col2">{acceptButton}</div>
        <div className="col2">{rejectButton}</div>
        <div className="col1" />
      </div>
    );

    if (renderParticipant) {
      return renderParticipant({
        participant,
        index,
        defaultParticipant,
        handleAccept,
        handleReject,
      });
    }

    return defaultParticipant;
  };

  const defaultHeader = (
    <div
      className={headerClassNames}
      style={headerStyle}
      {...restHeaderProps}
    >
      <div className={titleClassNames} style={titleStyle} {...restTitleProps}>
        {title}
        <div
          className={badgeWrapperClassNames}
          style={badgeWrapperStyle}
          {...restBadgeWrapperProps}
        >
          <span className={badgeClassNames} style={badgeStyle} {...restBadgeProps}>
            {waitingRoomCounterState}
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
        counter: waitingRoomCounterState,
        onClose: onWaitingRoomClose,
      })
    : defaultHeader;

  const searchInputElement = (
    <input
      style={{
        width: "90%",
        padding: 10,
        borderRadius: 5,
        border: "1px solid #000",
        fontSize: 16,
        marginBottom: 10,
        ...searchInputProps?.style,
      }}
      placeholder="Search ..."
      {...searchInputProps}
      className={searchInputProps?.className}
      onChange={handleFilterChange}
    />
  );

  const searchNode = renderSearch
    ? renderSearch({
        defaultSearch: searchInputElement,
        onFilter: (value) => {
          onWaitingRoomFilterChange(value);
          setRerenderToggle((prev) => !prev);
        },
      })
    : searchInputElement;

  const waitingListContent = waitingRoomListState.length
    ? waitingRoomListState.map((participant, index) => (
        <React.Fragment key={participant.id ?? index}>
          {renderParticipantRow(participant, index)}
        </React.Fragment>
      ))
    : emptyState
    ? typeof emptyState === "function"
      ? emptyState({ counter: waitingRoomCounterState })
      : emptyState
    : null;

  const defaultBody = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
      <div
        className={searchWrapperClassNames}
        style={searchWrapperStyle}
        {...restSearchWrapperProps}
      >
        {searchNode}
      </div>
      <div
        className={waitingListClassNames}
        style={waitingListStyle}
        {...restWaitingListProps}
      >
        {waitingListContent}
      </div>
    </div>
  );

  const bodyNode = renderBody
    ? renderBody({
        defaultBody,
        counter: waitingRoomCounterState,
      })
    : defaultBody;

  return (
    <div
      className={overlayClassNames}
      style={overlayStyle}
      {...restOverlayProps}
    >
      <div
        className={contentClassNames}
        style={contentStyle}
        {...restContentProps}
      >
        {headerNode}
        <hr className="hr" />
        {bodyNode}
      </div>
    </div>
  );
};

export default WaitingRoomModal;
