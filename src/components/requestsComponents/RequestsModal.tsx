import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import RenderRequestComponent, {
  RenderRequestComponentOptions,
} from "./RenderRequestComponent";
import {
  respondToRequests,
  RespondToRequestsType,
} from "../../methods/requestsMethods/respondToRequests";
import { Request } from "../../@types/types";
import { Socket } from "socket.io-client";

export interface RequestsModalParameters {
  getUpdatedAllParams?: () => { filteredRequestList: Request[] };
  filteredRequestList?: Request[];
  [key: string]: any;
}

export interface RequestsModalOptions {
  isRequestsModalVisible: boolean;
  onRequestClose: () => void;
  requestCounter: number;
  onRequestFilterChange: (text: string) => void;
  onRequestItemPress?: RespondToRequestsType;
  requestList: Request[];
  updateRequestList: (newRequestList: Request[]) => void;
  roomName: string;
  socket: Socket;
  renderRequestComponent?: React.FC<RenderRequestComponentOptions>;
  backgroundColor?: string;
  position?: string;
  parameters: RequestsModalParameters;
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
  requestsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  requestItemWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
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
  renderRequest?: (options: {
    request: Request;
    index: number;
    defaultRequest: React.ReactNode;
    handleRespond: (action: "accepted" | "rejected") => void;
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

export type RequestsModalType = (
  options: RequestsModalOptions
) => React.JSX.Element;

/**
 * RequestsModal - Manage participant join and feature requests
 * 
 * A comprehensive modal for hosts to review and respond to participant requests including
 * meeting entry requests, screen share requests, and other permission requests. Provides
 * search/filter functionality, request counters, and accept/reject actions. Perfect for
 * managing meeting security and participant approvals.
 * 
 * Features:
 * - Display pending requests with counter badge
 * - Search/filter requests by participant name
 * - Accept/reject actions for each request
 * - Request type identification (entry, screenshare, etc.)
 * - Real-time request list updates via socket
 * - Empty state handling
 * - Customizable request rendering
 * - Extensive HTML attributes customization
 * - Custom render hooks for header, search, requests
 * - Responsive positioning
 * 
 * @component
 * @param {RequestsModalOptions} options - Configuration options
 * @param {boolean} options.isRequestsModalVisible - Modal visibility state
 * @param {Function} options.onRequestClose - Callback when modal is closed
 * @param {number} options.requestCounter - Total pending requests count
 * @param {Function} options.onRequestFilterChange - Search filter change handler
 * @param {Function} [options.onRequestItemPress=respondToRequests] - Request action handler
 * @param {Request[]} options.requestList - Array of all pending requests
 * @param {Function} options.updateRequestList - Update request list state
 * @param {string} options.roomName - Meeting/room identifier
 * @param {Socket} options.socket - Socket.io client instance
 * @param {React.FC} [options.renderRequestComponent=RenderRequestComponent] - Custom request item renderer
 * @param {string} [options.backgroundColor="#83c0e9"] - Modal background color
 * @param {string} [options.position="topRight"] - Modal screen position
 * @param {RequestsModalParameters} options.parameters - Additional parameters
 * @param {Function} [options.parameters.getUpdatedAllParams] - Retrieve latest parameters
 * @param {Request[]} [options.parameters.filteredRequestList] - Filtered requests array
 * @param {React.ReactNode} [options.title="Requests"] - Modal title
 * @param {object} [options.overlayProps] - HTML attributes for overlay
 * @param {object} [options.contentProps] - HTML attributes for content container
 * @param {object} [options.headerProps] - HTML attributes for header
 * @param {object} [options.titleProps] - HTML attributes for title
 * @param {object} [options.badgeWrapperProps] - HTML attributes for badge wrapper
 * @param {object} [options.badgeProps] - HTML attributes for counter badge
 * @param {object} [options.closeButtonProps] - HTML attributes for close button
 * @param {React.ReactNode} [options.closeIconComponent] - Custom close icon
 * @param {object} [options.bodyProps] - HTML attributes for body
 * @param {object} [options.searchWrapperProps] - HTML attributes for search wrapper
 * @param {object} [options.searchInputProps] - HTML attributes for search input
 * @param {object} [options.requestsWrapperProps] - HTML attributes for requests wrapper
 * @param {object} [options.requestItemWrapperProps] - HTML attributes for request items
 * @param {React.ReactNode|Function} [options.emptyState] - Empty state content or renderer
 * @param {Function} [options.renderHeader] - Custom header renderer
 * @param {Function} [options.renderSearch] - Custom search renderer
 * @param {Function} [options.renderRequest] - Custom request item renderer
 * @param {Function} [options.renderBody] - Custom body renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 * 
 * @returns {React.JSX.Element} Rendered requests modal
 * 
 * @example
 * // Basic requests management
 * ```tsx
 * import React, { useState } from 'react';
 * import { RequestsModal } from 'mediasfu-reactjs';
 * 
 * function RequestsManagement({ socket, roomName, parameters }) {
 *   const [isVisible, setIsVisible] = useState(false);
 *   const [requestList, setRequestList] = useState([]);
 *   const [searchText, setSearchText] = useState('');
 * 
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Requests ({requestList.length})
 *       </button>
 *       <RequestsModal
 *         isRequestsModalVisible={isVisible}
 *         onRequestClose={() => setIsVisible(false)}
 *         requestCounter={requestList.length}
 *         onRequestFilterChange={setSearchText}
 *         requestList={requestList}
 *         updateRequestList={setRequestList}
 *         roomName={roomName}
 *         socket={socket}
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
 * // Custom styled with request type indicators
 * ```tsx
 * import { RequestsModal } from 'mediasfu-reactjs';
 * 
 * function BrandedRequests(props) {
 *   return (
 *     <RequestsModal
 *       {...props}
 *       backgroundColor="#1e3a8a"
 *       position="topLeft"
 *       contentProps={{
 *         style: {
 *           borderRadius: 20,
 *           border: '2px solid #3b82f6',
 *           maxHeight: '80vh',
 *         },
 *       }}
 *       badgeProps={{
 *         style: {
 *           background: '#ef4444',
 *           color: 'white',
 *           borderRadius: '50%',
 *           padding: '4px 8px',
 *           fontSize: 12,
 *           fontWeight: 600,
 *         },
 *       }}
 *       renderRequest={({ request, index, defaultRequest, handleRespond }) => (
 *         <div style={{
 *           padding: 16,
 *           background: index % 2 === 0 ? '#f8fafc' : 'white',
 *           borderRadius: 8,
 *           marginBottom: 8,
 *         }}>
 *           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 *             <div>
 *               <div style={{ fontWeight: 600 }}>{request.name || request.username}</div>
 *               <div style={{ fontSize: 14, color: '#64748b' }}>
 *                 {request.icon ? `${request.icon} ` : ''}Request to join
 *               </div>
 *             </div>
 *             <div style={{ display: 'flex', gap: 8 }}>
 *               <button
 *                 onClick={() => handleRespond('accepted')}
 *                 style={{
 *                   background: '#22c55e',
 *                   color: 'white',
 *                   border: 'none',
 *                   borderRadius: 8,
 *                   padding: '8px 16px',
 *                   cursor: 'pointer',
 *                 }}
 *               >
 *                 Accept
 *               </button>
 *               <button
 *                 onClick={() => handleRespond('rejected')}
 *                 style={{
 *                   background: '#ef4444',
 *                   color: 'white',
 *                   border: 'none',
 *                   borderRadius: 8,
 *                   padding: '8px 16px',
 *                   cursor: 'pointer',
 *                 }}
 *               >
 *                 Reject
 *               </button>
 *             </div>
 *           </div>
 *         </div>
 *       )}
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Analytics tracking for request actions
 * ```tsx
 * import { RequestsModal } from 'mediasfu-reactjs';
 * 
 * function AnalyticsRequests(props) {
 *   const handleRequestAction = async (options) => {
 *     analytics.track('request_action', {
 *       action: options.action,
 *       requestType: options.type,
 *       participantName: options.request.name || options.request.username,
 *     });
 *     return props.onRequestItemPress?.(options);
 *   };
 * 
 *   return (
 *     <RequestsModal
 *       {...props}
 *       onRequestItemPress={handleRequestAction}
 *       renderHeader={({ defaultHeader, counter, onClose }) => (
 *         <div>
 *           <div style={{
 *             padding: 12,
 *             background: '#f8fafc',
 *             borderRadius: 8,
 *             marginBottom: 16,
 *           }}>
 *             <div style={{ fontWeight: 600 }}>
 *               {counter} pending {counter === 1 ? 'request' : 'requests'}
 *             </div>
 *           </div>
 *           {defaultHeader}
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
 * import { MediasfuGeneric, RequestsModal } from 'mediasfu-reactjs';
 * 
 * const uiOverrides = {
 *   requestsModal: {
 *     component: (props) => (
 *       <RequestsModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         badgeProps={{
 *           style: {
 *             background: '#ef4444',
 *             borderRadius: '50%',
 *             padding: '4px 8px',
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

const RequestsModal: React.FC<RequestsModalOptions> = ({
  isRequestsModalVisible,
  onRequestClose,
  requestCounter,
  onRequestFilterChange,
  onRequestItemPress = respondToRequests,
  requestList,
  updateRequestList,
  roomName,
  socket,
  renderRequestComponent = RenderRequestComponent,
  backgroundColor = "#83c0e9",
  position = "topRight",
  parameters,
  title = "Requests",
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
  requestsWrapperProps,
  requestItemWrapperProps,
  emptyState,
  renderHeader,
  renderSearch,
  renderRequest,
  renderBody,
  renderContent,
}) => {
  const initialList = useMemo(() => {
    if (parameters?.getUpdatedAllParams) {
      return parameters.getUpdatedAllParams().filteredRequestList;
    }

    if (parameters?.filteredRequestList) {
      return parameters.filteredRequestList;
    }

    return requestList;
  }, [parameters, requestList]);

  const [requestListState, setRequestListState] = useState<Request[]>(initialList);
  const [requestCounterState, setRequestCounterState] = useState<number>(
    parameters?.filteredRequestList?.length ?? requestCounter
  );
  const [rerenderToggle, setRerenderToggle] = useState(false);

  useEffect(() => {
    if (parameters?.getUpdatedAllParams) {
      const updatedParams = parameters.getUpdatedAllParams();
      setRequestListState(updatedParams.filteredRequestList);
      setRequestCounterState(updatedParams.filteredRequestList.length);
      return;
    }

    if (parameters?.filteredRequestList) {
      setRequestListState(parameters.filteredRequestList);
      setRequestCounterState(parameters.filteredRequestList.length);
      return;
    }

    setRequestListState(requestList);
    setRequestCounterState(requestList.length);
  }, [parameters, requestList, rerenderToggle]);

  const defaultOverlayWidth =
    typeof window !== "undefined" ? Math.min(window.innerWidth * 0.8, 350) : 320;

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = [
    "mediasfu-requests-modal",
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
    display: isRequestsModalVisible ? "block" : "none",
    zIndex: 999,
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = [
    "mediasfu-requests-modal__content",
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
    "requests-counter",
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
    "btn-close-requests",
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
    if (event.defaultPrevented) {
      return;
    }
    onRequestClose();
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
      onRequestFilterChange(event.target.value);
      setRerenderToggle((prev) => !prev);
    }
  };

  const {
    className: requestsWrapperClassName,
    style: requestsWrapperStyleOverrides,
    ...restRequestsWrapperProps
  } = requestsWrapperProps ?? {};

  const requestsWrapperClassNames = [
    "requests-list",
    requestsWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const requestsWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: "calc(100% - 150px)",
    overflowY: "auto",
    ...requestsWrapperStyleOverrides,
  };

  const {
    className: requestItemWrapperClassName,
    style: requestItemWrapperStyleOverrides,
    ...restRequestItemWrapperProps
  } = requestItemWrapperProps ?? {};

  const requestItemWrapperClassNames = [
    "request-item-wrapper",
    requestItemWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const renderRequestRow = (request: Request, index: number) => {
    const handleRespond = (action: "accepted" | "rejected") => {
      onRequestItemPress({
        request,
        updateRequestList,
        requestList: requestListState,
        roomName,
        socket,
        action,
      });
    };

    const defaultRequest = (
      <div
        className={requestItemWrapperClassNames}
        style={{
          marginTop: 5,
          ...requestItemWrapperStyleOverrides,
        }}
        {...restRequestItemWrapperProps}
      >
        {renderRequestComponent({
          request,
          onRequestItemPress,
          requestList: requestListState,
          updateRequestList,
          roomName,
          socket,
        }) as React.ReactElement}
      </div>
    );

    if (renderRequest) {
      return renderRequest({
        request,
        index,
        defaultRequest,
        handleRespond,
      });
    }

    return defaultRequest;
  };

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
            {requestCounterState}
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
        counter: requestCounterState,
        onClose: onRequestClose,
      })
    : defaultHeader;

  const defaultSearchInput = (
    <input
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
          onRequestFilterChange(value);
          setRerenderToggle((prev) => !prev);
        },
      })
    : defaultSearchInput;

  const requestsListContent = requestListState.length
    ? requestListState.map((requestItem, index) => (
        <React.Fragment key={requestItem.id ?? index}>
          {renderRequestRow(requestItem, index)}
        </React.Fragment>
      ))
    : emptyState
    ? typeof emptyState === "function"
      ? emptyState({ counter: requestCounterState })
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
        className={requestsWrapperClassNames}
        style={requestsWrapperStyle}
        {...restRequestsWrapperProps}
      >
        {requestsListContent}
      </div>
    </div>
  );

  const bodyNode = renderBody
    ? renderBody({
        defaultBody,
        counter: requestCounterState,
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
        counter: requestCounterState,
      })
    : defaultContent;

  return (
    <div className={overlayClassNames} style={overlayStyle} {...restOverlayProps}>
      {contentNode}
    </div>
  );
};

export default RequestsModal;
