import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  Poll,
  ShowAlert,
  HandleCreatePollType,
  HandleEndPollType,
  HandleVotePollType,
} from "../../@types/types";
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
  renderHeader?: (options: { defaultHeader: React.ReactNode }) => React.ReactNode;
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

const PollModal: React.FC<PollModalOptions> = ({
  isPollModalVisible,
  onClose,
  position = "topRight",
  backgroundColor = "#f5f5f5",
  member,
  islevel,
  polls,
  poll,
  socket,
  roomName,
  showAlert,
  updateIsPollModalVisible,
  handleCreatePoll,
  handleEndPoll,
  handleVotePoll,
  title = "Polls",
  overlayProps,
  contentProps,
  headerProps,
  titleProps,
  closeButtonProps,
  closeIconComponent,
  bodyProps,
  sectionsWrapperProps,
  previousPollsWrapperProps,
  previousPollsHeaderProps,
  createPollWrapperProps,
  createPollFormProps,
  activePollWrapperProps,
  pollQuestionInputProps,
  pollTypeSelectProps,
  pollOptionInputProps,
  voteButtonProps,
  endPollButtonProps,
  submitPollButtonProps,
  emptyPreviousPolls,
  emptyActivePoll,
  renderHeader,
  renderPreviousPolls,
  renderCreatePoll,
  renderActivePoll,
  renderBody,
  renderContent,
}) => {
  const [newPoll, setNewPoll] = useState<NewPollFormState>({
    question: "",
    type: "",
    options: [],
  });

  const activePoll = useMemo(() => poll ?? null, [poll]);

  useEffect(() => {
    if (!isPollModalVisible || !polls?.length || !poll) {
      return;
    }

    const activePollCount = polls.filter(
      (existingPoll) => existingPoll?.status === "active" && poll.id === existingPoll?.id
    ).length;

    if (islevel === "2" && activePollCount === 0 && poll.status === "active") {
      // Maintain previous behaviour of flagging the poll as inactive when none are active.
      // eslint-disable-next-line no-param-reassign
      poll.status = "inactive";
    }
  }, [isPollModalVisible, polls, poll, islevel]);

  const defaultOverlayWidth =
    typeof window !== "undefined" ? Math.min(window.innerWidth * 0.7, 360) : 320;

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = [
    "mediasfu-poll-modal",
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
    display: isPollModalVisible ? "block" : "none",
    zIndex: 999,
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = [
    "mediasfu-poll-modal__content",
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
    overflow: "hidden",
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
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "black",
    ...titleStyleOverrides,
  };

  const {
    className: closeButtonClassName,
    style: closeButtonStyleOverrides,
    onClick: closeButtonOnClick,
    ...restCloseButtonProps
  } = closeButtonProps ?? {};

  const closeButtonClassNames = [
    "btn-close-poll",
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
      onClose();
    }
  };

  const {
    className: bodyClassName,
    style: bodyStyleOverrides,
    ...restBodyProps
  } = bodyProps ?? {};

  const bodyClassNames = [
    "modal-body",
    bodyClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const bodyStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    ...bodyStyleOverrides,
  };

  const {
    className: sectionsWrapperClassName,
    style: sectionsWrapperStyleOverrides,
    ...restSectionsWrapperProps
  } = sectionsWrapperProps ?? {};

  const sectionsWrapperClassNames = [
    "poll-modal-sections",
    sectionsWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const sectionsWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    overflowY: "auto",
    ...sectionsWrapperStyleOverrides,
  };

  const buildHeader = () => {
    const defaultHeader = (
      <div className={headerClassNames} style={headerStyle} {...restHeaderProps}>
        <h2 className={titleClassNames} style={titleStyle} {...restTitleProps}>
          {title}
        </h2>
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

    return renderHeader ? renderHeader({ defaultHeader }) : defaultHeader;
  };

  const calculatePercentage = (votes: number[], optionIndex: number) => {
    const totalVotes = votes.reduce((a, b) => a + b, 0);
    return totalVotes > 0 ? ((votes[optionIndex] / totalVotes) * 100).toFixed(2) : "0";
  };

  const renderPollOptions = (): React.ReactNode => {
    switch (newPoll.type) {
      case "trueFalse":
      case "yesNo":
        return (
          <div className="poll-options poll-options--preset">
            {newPoll.options.map((option, index) => (
              <div className="form-check" key={index}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="pollOption"
                  value={option.toLowerCase()}
                  id={`option-${option}`}
                  readOnly
                />
                <label className="form-check-label" htmlFor={`option-${option}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case "custom":
        return (
          <div className="poll-options poll-options--custom">
            {newPoll.options.map((option, index) => (
              <div className="form-group" key={`custom-option-${index}`}>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Option ${index + 1}`}
                  maxLength={50}
                  value={option}
                  {...pollOptionInputProps}
                  onChange={(event) => {
                    pollOptionInputProps?.onChange?.(event);
                    if (!event.defaultPrevented) {
                      const updatedOptions = [...newPoll.options];
                      updatedOptions[index] = event.target.value;
                      setNewPoll((prev) => ({ ...prev, options: updatedOptions }));
                    }
                  }}
                />
              </div>
            ))}
            {[...Array(Math.max(0, 5 - newPoll.options.length))].map((_, index) => (
              <div className="form-group" key={`custom-empty-${index}`}>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Option ${newPoll.options.length + index + 1}`}
                  maxLength={50}
                  {...pollOptionInputProps}
                  onChange={(event) => {
                    pollOptionInputProps?.onChange?.(event);
                    if (!event.defaultPrevented && event.target.value) {
                      setNewPoll((prev) => ({
                        ...prev,
                        options: [...prev.options, event.target.value],
                      }));
                    }
                  }}
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const handlePollTypeChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    pollTypeSelectProps?.onChange?.(event);
    if (event.defaultPrevented) {
      return;
    }

    const { value } = event.target;
    let options: string[] = [];

    switch (value) {
      case "trueFalse":
        options = ["True", "False"];
        break;
      case "yesNo":
        options = ["Yes", "No"];
        break;
      case "custom":
        options = [];
        break;
      default:
        options = [];
    }

    setNewPoll((prev) => ({ ...prev, type: value as NewPollFormState["type"], options }));
  };

  const buildPreviousPollsSection = () => {
    const { className, style, ...restProps } = previousPollsWrapperProps ?? {};

    const previousPollsClassNames = [
      "poll-section poll-section--previous",
      className,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || undefined;

    const previousPollsHeaderClassNames = [
      "poll-section__title",
      previousPollsHeaderProps?.className,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || undefined;

    const previousPollsHeaderStyle: React.CSSProperties = {
      fontWeight: 600,
      marginBottom: 8,
      ...previousPollsHeaderProps?.style,
    };

    const previousPollItems = polls.filter((polled) => {
      if (!polled) return false;
      if (!activePoll) return true;
      return polled.id !== activePoll.id || polled.status !== "active";
    });

    const previousContent = previousPollItems.length ? (
      previousPollItems.map((polled, index) => (
        <div key={polled.id ?? index} className="poll-card">
          <h6>Question:</h6>
          <textarea className="form-control" rows={3} disabled value={polled.question} />
          <h6 style={{ marginTop: 8 }}>Options:</h6>
          {polled.options.map((option, i) => (
            <div key={`${polled.id}-${i}`}>
              {option}: {polled.votes[i]} votes ({calculatePercentage(polled.votes, i)}%)
            </div>
          ))}
          {polled.status === "active" && (
            <button
              type="button"
              className="btn btn-danger btn-block"
              {...endPollButtonProps}
              onClick={(event) => {
                endPollButtonProps?.onClick?.(event);
                if (!event.defaultPrevented) {
                  handleEndPoll({
                    pollId: polled.id,
                    socket,
                    showAlert,
                    roomName,
                    updateIsPollModalVisible,
                  });
                }
              }}
            >
              End Poll
            </button>
          )}
        </div>
      ))
    ) : (
      emptyPreviousPolls ?? <div className="poll-empty">No polls available</div>
    );

    const defaultPreviousPolls = (
      <div
        className={previousPollsClassNames}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
          maxHeight: "25%",
          ...style,
        }}
        {...restProps}
      >
        <h5
          className={previousPollsHeaderClassNames}
          style={previousPollsHeaderStyle}
          {...previousPollsHeaderProps}
        >
          Previous Polls
        </h5>
        {previousContent}
      </div>
    );

    return renderPreviousPolls
      ? renderPreviousPolls({ defaultPreviousPolls, previousPolls: previousPollItems })
      : defaultPreviousPolls;
  };

  const buildCreatePollSection = () => {
    if (islevel !== "2") {
      return null;
    }

    const { className, style, ...restProps } = createPollWrapperProps ?? {};

    const createPollClassNames = [
      "poll-section poll-section--create",
      className,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || undefined;

    const defaultCreatePoll = (
      <div
        className={createPollClassNames}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
          maxHeight: "30%",
          ...style,
        }}
        {...restProps}
      >
        <h5>Create a New Poll</h5>
        <form
          {...createPollFormProps}
          onSubmit={(event) => {
            createPollFormProps?.onSubmit?.(event);
            if (event.defaultPrevented) {
              return;
            }
            event.preventDefault();
            handleCreatePoll({
              poll: newPoll,
              socket,
              roomName,
              showAlert,
              updateIsPollModalVisible,
            });
            setNewPoll({ question: "", type: "", options: [] });
          }}
        >
          <div className="form-group">
            <label htmlFor="poll-question">Question</label>
            <input
              id="poll-question"
              type="text"
              className="form-control"
              placeholder="Enter poll question"
              maxLength={200}
              value={newPoll.question}
              {...pollQuestionInputProps}
              onChange={(event) => {
                pollQuestionInputProps?.onChange?.(event);
                if (!event.defaultPrevented) {
                  setNewPoll((prev) => ({ ...prev, question: event.target.value }));
                }
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="poll-type">Poll Type</label>
            <select
              id="poll-type"
              className="form-control"
              value={newPoll.type}
              {...pollTypeSelectProps}
              onChange={handlePollTypeChange}
            >
              <option value="">Select poll type</option>
              <option value="trueFalse">True / False</option>
              <option value="yesNo">Yes / No</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {renderPollOptions()}
          <button type="submit" className="btn btn-primary" {...submitPollButtonProps}>
            Create Poll
          </button>
        </form>
      </div>
    );

    return renderCreatePoll
      ? renderCreatePoll({ defaultCreatePoll, newPoll, setNewPoll })
      : defaultCreatePoll;
  };

  const buildActivePollSection = () => {
    const { className, style, ...restProps } = activePollWrapperProps ?? {};

    const activePollClassNames = [
      "poll-section poll-section--active",
      className,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || undefined;

    const defaultActivePoll = (
      <div
        className={activePollClassNames}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
          maxHeight: "35%",
          ...style,
        }}
        {...restProps}
      >
        <h5>Current Poll</h5>
        {activePoll ? (
          <div className="poll-card poll-card--active">
            <h6>Question:</h6>
            <textarea className="form-control" rows={3} disabled value={activePoll.question} />
            <h6 style={{ marginTop: 8 }}>Options:</h6>
            {activePoll.options.map((option, index) => (
              <button
                key={`${activePoll.id}-${index}`}
                type="button"
                className="btn btn-outline-primary btn-block"
                {...voteButtonProps}
                onClick={(event) => {
                  voteButtonProps?.onClick?.(event);
                  if (!event.defaultPrevented) {
                    handleVotePoll({
                      pollId: activePoll.id,
                      optionIndex: index,
                      member,
                      socket,
                      showAlert,
                      roomName,
                      updateIsPollModalVisible,
                    });
                  }
                }}
              >
                {option}
              </button>
            ))}
            {islevel === "2" && (
              <button
                type="button"
                className="btn btn-danger btn-block"
                {...endPollButtonProps}
                onClick={(event) => {
                  endPollButtonProps?.onClick?.(event);
                  if (!event.defaultPrevented) {
                    handleEndPoll({
                      pollId: activePoll.id,
                      socket,
                      showAlert,
                      roomName,
                      updateIsPollModalVisible,
                    });
                  }
                }}
              >
                End Poll
              </button>
            )}
          </div>
        ) : (
          emptyActivePoll ?? <div className="poll-empty">No active poll</div>
        )}
      </div>
    );

    return renderActivePoll
      ? renderActivePoll({ defaultActivePoll, activePoll })
      : defaultActivePoll;
  };

  const sections = (
    <div
      className={sectionsWrapperClassNames}
      style={sectionsWrapperStyle}
      {...restSectionsWrapperProps}
    >
      {buildPreviousPollsSection()}
      {buildCreatePollSection()}
      {buildActivePollSection()}
    </div>
  );

  const defaultBody = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
      {sections}
    </div>
  );

  const bodyNode = renderBody ? renderBody({ defaultBody }) : defaultBody;

  const defaultContent = (
    <div className={contentClassNames} style={contentStyle} {...restContentProps}>
      {buildHeader()}
      <hr className="hr" />
      {bodyNode}
    </div>
  );

  const contentNode = renderContent
    ? renderContent({
        defaultContent,
      })
    : defaultContent;

  return (
    <div className={overlayClassNames} style={overlayStyle} {...restOverlayProps}>
      {contentNode}
    </div>
  );
};

export default PollModal;
