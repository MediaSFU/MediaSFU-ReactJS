import React from "react";
import { Poll, ShowAlert, HandleCreatePollType, HandleEndPollType, HandleVotePollType } from "../../@types/types";
import { Socket } from "socket.io-client";
import { ModalRenderMode } from '../menuComponents/MenuModal';
interface NewPollFormState {
    question: string;
    type: "" | "trueFalse" | "yesNo" | "custom";
    options: string[];
}
export interface PollModalOptions {
    isPollModalVisible: boolean;
    onClose: () => void;
    position?: string;
    backgroundColor?: string;
    member: string;
    islevel: string;
    polls: Poll[];
    poll: Poll | null;
    socket: Socket;
    roomName: string;
    showAlert?: ShowAlert;
    updateIsPollModalVisible: (isVisible: boolean) => void;
    handleCreatePoll: HandleCreatePollType;
    handleEndPoll: HandleEndPollType;
    handleVotePoll: HandleVotePollType;
    title?: React.ReactNode;
    overlayProps?: React.HTMLAttributes<HTMLDivElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    headerProps?: React.HTMLAttributes<HTMLDivElement>;
    titleProps?: React.HTMLAttributes<HTMLHeadingElement>;
    closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    closeIconComponent?: React.ReactNode;
    bodyProps?: React.HTMLAttributes<HTMLDivElement>;
    sectionsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    previousPollsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    previousPollsHeaderProps?: React.HTMLAttributes<HTMLHeadingElement>;
    createPollWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    createPollFormProps?: React.FormHTMLAttributes<HTMLFormElement>;
    activePollWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    pollQuestionInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    pollTypeSelectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
    pollOptionInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    voteButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    endPollButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    submitPollButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    emptyPreviousPolls?: React.ReactNode;
    emptyActivePoll?: React.ReactNode;
    renderHeader?: (options: {
        defaultHeader: React.ReactNode;
    }) => React.ReactNode;
    renderPreviousPolls?: (options: {
        defaultPreviousPolls: React.ReactNode;
        previousPolls: Poll[];
    }) => React.ReactNode;
    renderCreatePoll?: (options: {
        defaultCreatePoll: React.ReactNode;
        newPoll: NewPollFormState;
        setNewPoll: React.Dispatch<React.SetStateAction<NewPollFormState>>;
    }) => React.ReactNode;
    renderActivePoll?: (options: {
        defaultActivePoll: React.ReactNode;
        activePoll: Poll | null;
    }) => React.ReactNode;
    renderBody?: (options: {
        defaultBody: React.ReactNode;
    }) => React.ReactNode;
    renderContent?: (options: {
        defaultContent: React.ReactNode;
    }) => React.ReactNode;
    /** Theme control - whether dark mode is active */
    isDarkMode?: boolean;
    /** Enable glassmorphism effects (modern UI) */
    enableGlassmorphism?: boolean;
    /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
    renderMode?: ModalRenderMode;
}
export type PollModalType = (options: PollModalOptions) => React.JSX.Element;
/**
 * PollModal - Interactive polling interface for creating and managing live polls
 *
 * A comprehensive modal for creating, displaying, and voting on polls during events.
 * Supports multiple poll types (True/False, Yes/No, custom options), real-time voting,
 * and poll history tracking. Perfect for audience engagement and quick feedback.
 *
 * Features:
 * - Create new polls with multiple question types
 * - True/False and Yes/No quick poll templates
 * - Custom multiple-choice polls (2-5 options)
 * - Real-time voting with live result updates
 * - Previous polls history display with results
 * - Host controls (create, end polls)
 * - Participant voting interface
 * - Vote percentage calculations
 * - Custom render hooks for complete UI flexibility
 *
 * @component
 * @param {PollModalOptions} options - Configuration options
 * @param {boolean} options.isPollModalVisible - Modal visibility state
 * @param {Function} options.onClose - Callback when modal is closed
 * @param {string} [options.position="topRight"] - Modal position on screen
 * @param {string} [options.backgroundColor="#f5f5f5"] - Modal background color
 * @param {string} options.member - Current user's member ID
 * @param {string} options.islevel - User level ('2'=host, '1'=co-host, '0'=participant)
 * @param {Poll[]} options.polls - Array of all polls (active + previous)
 * @param {Poll|null} options.poll - Currently active poll
 * @param {Socket} options.socket - Socket.io client instance
 * @param {string} options.roomName - Meeting/room identifier
 * @param {ShowAlert} [options.showAlert] - Alert display function
 * @param {Function} options.updateIsPollModalVisible - Update modal visibility state
 * @param {HandleCreatePollType} options.handleCreatePoll - Function to create new poll
 * @param {HandleEndPollType} options.handleEndPoll - Function to end active poll
 * @param {HandleVotePollType} options.handleVotePoll - Function to submit vote
 * @param {React.ReactNode} [options.title="Polls"] - Modal title content
 * @param {object} [options.overlayProps] - HTML attributes for overlay div
 * @param {object} [options.contentProps] - HTML attributes for content container
 * @param {object} [options.headerProps] - HTML attributes for header section
 * @param {object} [options.closeButtonProps] - HTML attributes for close button
 * @param {React.ReactNode} [options.closeIconComponent] - Custom close icon
 * @param {object} [options.bodyProps] - HTML attributes for body section
 * @param {object} [options.createPollFormProps] - HTML attributes for create poll form
 * @param {object} [options.pollQuestionInputProps] - HTML attributes for question input
 * @param {object} [options.pollTypeSelectProps] - HTML attributes for type selector
 * @param {object} [options.voteButtonProps] - HTML attributes for vote buttons
 * @param {object} [options.endPollButtonProps] - HTML attributes for end poll button
 * @param {object} [options.submitPollButtonProps] - HTML attributes for submit button
 * @param {React.ReactNode} [options.emptyPreviousPolls] - Content when no previous polls
 * @param {React.ReactNode} [options.emptyActivePoll] - Content when no active poll
 * @param {Function} [options.renderHeader] - Custom header renderer
 * @param {Function} [options.renderPreviousPolls] - Custom previous polls renderer
 * @param {Function} [options.renderCreatePoll] - Custom create poll form renderer
 * @param {Function} [options.renderActivePoll] - Custom active poll renderer
 * @param {Function} [options.renderBody] - Custom body renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 *
 * @returns {React.JSX.Element} Rendered poll modal
 *
 * @example
 * // Basic poll modal for host
 * ```tsx
 * import React, { useState } from 'react';
 * import { PollModal } from 'mediasfu-reactjs';
 *
 * function HostPolls({ parameters }) {
 *   const [isVisible, setIsVisible] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Polls ({parameters.polls.length})
 *       </button>
 *       <PollModal
 *         isPollModalVisible={isVisible}
 *         onClose={() => setIsVisible(false)}
 *         member={parameters.member}
 *         islevel={parameters.islevel}
 *         polls={parameters.polls}
 *         poll={parameters.poll}
 *         socket={parameters.socket}
 *         roomName={parameters.roomName}
 *         showAlert={parameters.showAlert}
 *         updateIsPollModalVisible={parameters.updateIsPollModalVisible}
 *         handleCreatePoll={parameters.handleCreatePoll}
 *         handleEndPoll={parameters.handleEndPoll}
 *         handleVotePoll={parameters.handleVotePoll}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * // Custom styled poll with branded colors
 * ```tsx
 * import { PollModal } from 'mediasfu-reactjs';
 *
 * function BrandedPoll({ isVisible, onClose, parameters }) {
 *   return (
 *     <PollModal
 *       isPollModalVisible={isVisible}
 *       onClose={onClose}
 *       member={parameters.member}
 *       islevel={parameters.islevel}
 *       polls={parameters.polls}
 *       poll={parameters.poll}
 *       socket={parameters.socket}
 *       roomName={parameters.roomName}
 *       showAlert={parameters.showAlert}
 *       updateIsPollModalVisible={parameters.updateIsPollModalVisible}
 *       handleCreatePoll={parameters.handleCreatePoll}
 *       handleEndPoll={parameters.handleEndPoll}
 *       handleVotePoll={parameters.handleVotePoll}
 *       backgroundColor="#1e3a8a"
 *       position="topLeft"
 *       contentProps={{
 *         style: {
 *           borderRadius: 20,
 *           border: '2px solid #3b82f6',
 *           boxShadow: '0 20px 60px rgba(59,130,246,0.3)',
 *         },
 *       }}
 *       submitPollButtonProps={{
 *         style: {
 *           background: 'linear-gradient(135deg, #22c55e 0%, #14532d 100%)',
 *           color: 'white',
 *           padding: '12px 24px',
 *           borderRadius: 12,
 *           fontWeight: 600,
 *           border: 'none',
 *           cursor: 'pointer',
 *         },
 *       }}
 *       voteButtonProps={{
 *         style: {
 *           padding: '10px 20px',
 *           borderRadius: 8,
 *           transition: 'all 0.2s ease',
 *         },
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Custom poll with analytics tracking
 * ```tsx
 * import { PollModal } from 'mediasfu-reactjs';
 *
 * function AnalyticsPoll({ isVisible, onClose, parameters }) {
 *   const handleCreatePoll = async (options) => {
 *     analytics.track('poll_created', {
 *       question: options.poll.question,
 *       type: options.poll.type,
 *       optionsCount: options.poll.options.length,
 *     });
 *     return parameters.handleCreatePoll(options);
 *   };
 *
 *   const handleVotePoll = async (options) => {
 *     analytics.track('poll_voted', {
 *       pollId: options.pollId,
 *       optionIndex: options.optionIndex,
 *     });
 *     return parameters.handleVotePoll(options);
 *   };
 *
 *   return (
 *     <PollModal
 *       isPollModalVisible={isVisible}
 *       onClose={onClose}
 *       member={parameters.member}
 *       islevel={parameters.islevel}
 *       polls={parameters.polls}
 *       poll={parameters.poll}
 *       socket={parameters.socket}
 *       roomName={parameters.roomName}
 *       showAlert={parameters.showAlert}
 *       updateIsPollModalVisible={parameters.updateIsPollModalVisible}
 *       handleCreatePoll={handleCreatePoll}
 *       handleEndPoll={parameters.handleEndPoll}
 *       handleVotePoll={handleVotePoll}
 *       renderActivePoll={({ defaultActivePoll, activePoll }) => {
 *         if (!activePoll) return defaultActivePoll;
 *
 *         return (
 *           <div style={{
 *             background: 'white',
 *             padding: 20,
 *             borderRadius: 12,
 *             border: '2px solid #3b82f6',
 *           }}>
 *             <h3 style={{ marginBottom: 16, color: '#1e3a8a' }}>
 *               {activePoll.question}
 *             </h3>
 *             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
 *               {activePoll.options.map((option, index) => {
 *                 const voteCount = activePoll.votes?.[index] || 0;
 *                 const totalVotes = Object.values(activePoll.votes || {})
 *                   .reduce((sum: number, count) => sum + (count as number), 0);
 *                 const percentage = totalVotes > 0
 *                   ? Math.round((voteCount / totalVotes) * 100)
 *                   : 0;
 *
 *                 return (
 *                   <button
 *                     key={index}
 *                     onClick={() => handleVotePoll({ pollId: activePoll.id, optionIndex: index })}
 *                     style={{
 *                       padding: 12,
 *                       borderRadius: 8,
 *                       border: '2px solid #e2e8f0',
 *                       background: 'white',
 *                       cursor: 'pointer',
 *                       position: 'relative',
 *                       overflow: 'hidden',
 *                     }}
 *                   >
 *                     <div style={{
 *                       position: 'absolute',
 *                       left: 0,
 *                       top: 0,
 *                       bottom: 0,
 *                       width: `${percentage}%`,
 *                       background: '#3b82f6',
 *                       opacity: 0.2,
 *                       transition: 'width 0.3s ease',
 *                     }} />
 *                     <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between' }}>
 *                       <span>{option}</span>
 *                       <span style={{ fontWeight: 600 }}>{percentage}%</span>
 *                     </div>
 *                   </button>
 *                 );
 *               })}
 *             </div>
 *           </div>
 *         );
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, PollModal } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   pollModal: {
 *     component: (props) => (
 *       <PollModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         contentProps={{
 *           style: {
 *             maxHeight: '85vh',
 *             borderRadius: 20,
 *             border: '2px solid #3b82f6',
 *           },
 *         }}
 *         submitPollButtonProps={{
 *           style: {
 *             background: '#22c55e',
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
declare const PollModal: React.FC<PollModalOptions>;
export default PollModal;
//# sourceMappingURL=PollModal.d.ts.map