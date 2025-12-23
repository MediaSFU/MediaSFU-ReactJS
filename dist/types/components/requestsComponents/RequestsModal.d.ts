import React from "react";
import { RenderRequestComponentOptions } from "./RenderRequestComponent";
import { RespondToRequestsType } from "../../methods/requestsMethods/respondToRequests";
import { Request } from "../../@types/types";
import { Socket } from "socket.io-client";
import { ModalRenderMode } from "../menuComponents/MenuModal";
export interface RequestsModalParameters {
    getUpdatedAllParams?: () => {
        filteredRequestList: Request[];
    };
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
    requestsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    requestItemWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    emptyState?: React.ReactNode | ((context: {
        counter: number;
    }) => React.ReactNode);
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
export type RequestsModalType = (options: RequestsModalOptions) => React.JSX.Element;
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
declare const RequestsModal: React.FC<RequestsModalOptions>;
export default RequestsModal;
//# sourceMappingURL=RequestsModal.d.ts.map