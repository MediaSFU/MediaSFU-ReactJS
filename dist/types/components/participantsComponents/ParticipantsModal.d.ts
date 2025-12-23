import React from "react";
import { muteParticipants } from "../../methods/participantsMethods/muteParticipants";
import { messageParticipants } from "../../methods/participantsMethods/messageParticipants";
import { removeParticipants } from "../../methods/participantsMethods/removeParticipants";
import { CoHostResponsibility, EventType, Participant, ShowAlert } from "../../@types/types";
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
export type ParticipantsModalType = (options: ParticipantsModalOptions) => React.JSX.Element;
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
declare const ParticipantsModal: React.FC<ParticipantsModalOptions>;
export default ParticipantsModal;
//# sourceMappingURL=ParticipantsModal.d.ts.map