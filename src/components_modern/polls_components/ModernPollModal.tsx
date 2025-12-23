/**
 * Modern Poll Modal with glassmorphic design.
 *
 * A premium-styled poll modal for creating and voting on polls,
 * featuring glassmorphic effects and smooth animations.
 * Uses the same PollModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernPollModal
 *   isPollModalVisible={showPoll}
 *   onClose={() => setShowPoll(false)}
 *   polls={polls}
 *   poll={activePoll}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faChartBar,
  faPlus,
  faVoteYea,
  faCheck,
  faStop,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { PollModalOptions } from '../../components/pollsComponents/PollModal';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import { Poll } from '../../@types/types';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';
import { ModernTooltip } from '../core/widgets/ModernTooltip';

interface NewPollFormState {
  question: string;
  type: '' | 'trueFalse' | 'yesNo' | 'custom';
  options: string[];
}

export interface ModernPollModalProps extends PollModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Render mode for modal/sidebar/inline display */
  renderMode?: ModalRenderMode;
}

export type ModernPollModalType = (
  options: ModernPollModalProps
) => React.JSX.Element;

/**
 * ModernPollModal displays polls with premium styling.
 */
export const ModernPollModal: React.FC<ModernPollModalProps> = ({
  isPollModalVisible,
  onClose,
  position = 'topRight',
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
  title,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'create' | 'history'>('active');
  const [newPoll, setNewPoll] = useState<NewPollFormState>({
    question: '',
    type: '',
    options: ['', ''],
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSidebarSelectHovered, setIsSidebarSelectHovered] = useState(false);
  const [isSidebarSelectFocused, setIsSidebarSelectFocused] = useState(false);
  const [isSelectHovered, setIsSelectHovered] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  // A poll is active only when status === 'active'; anything else (ended, inactive, etc.) is considered ended/completed
  const isPollActive = useCallback((p: Poll | null | undefined) =>
    (p?.status || '').toLowerCase() === 'active'
  , []);

  const getVoteStats = useCallback((p: Poll | null | undefined) => {
    if (!p) return { totalVotes: 0, rows: [] as Array<{ label: string; count: number; percent: number }> };
    const votes = p.votes || [];
    const totalVotes = votes.reduce((sum, v) => sum + (v || 0), 0);
    const rows = votes.map((count, index) => {
      const label = p.options?.[index] ?? `Option ${index + 1}`;
      const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
      return { label, count, percent };
    });
    return { totalVotes, rows };
  }, []);

  const activePollEnded = poll ? !isPollActive(poll) : false;
  const activePollStats = getVoteStats(poll);

  const presetOptionsForType = useCallback((type: NewPollFormState['type']) => {
    switch (type) {
      case 'trueFalse':
        return ['True', 'False'];
      case 'yesNo':
        return ['Yes', 'No'];
      case 'custom':
        return ['', ''];
      default:
        return ['', ''];
    }
  }, []);

  const handlePollTypeChange = useCallback((type: NewPollFormState['type']) => {
    setNewPoll((prev) => ({ ...prev, type, options: presetOptionsForType(type) }));
  }, [presetOptionsForType]);

  useEffect(() => {
    setSelectedOption(null);
  }, [poll?.id]);

  // Mount animation
  useEffect(() => {
    if (isPollModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isPollModalVisible]);

  // Handle create poll
  const handleCreate = useCallback(async () => {
    if (!newPoll.question.trim() || !newPoll.type) return;

    const pollOptions = newPoll.type === 'custom'
      ? (newPoll.options || []).map((o) => o.trim()).filter(Boolean)
      : presetOptionsForType(newPoll.type);

    if (newPoll.type === 'custom' && pollOptions.length < 2) {
      showAlert?.({
        message: 'Please provide at least two options for a custom poll.',
        type: 'danger',
      });
      return;
    }

    await handleCreatePoll({
      poll: {
        question: newPoll.question,
        type: newPoll.type,
        options: pollOptions,
      },
      socket,
      roomName,
      showAlert,
      updateIsPollModalVisible,
    });

    setNewPoll({ question: '', type: '', options: ['', ''] });
    setActiveTab('active');
  }, [newPoll, handleCreatePoll, socket, roomName, showAlert, updateIsPollModalVisible]);

  // Handle vote
  const handleVote = useCallback(async () => {
    if (selectedOption === null || !poll) return;

    await handleVotePoll({
      pollId: poll.id,
      optionIndex: selectedOption,
      socket,
      roomName,
      showAlert,
      member,
      updateIsPollModalVisible,
    });

    setSelectedOption(null);
  }, [selectedOption, poll, handleVotePoll, socket, roomName, showAlert, member, updateIsPollModalVisible]);

  // Handle end poll
  const handleEnd = useCallback(async () => {
    if (!poll) return;

    await handleEndPoll({
      pollId: poll.id,
      socket,
      roomName,
      showAlert,
      updateIsPollModalVisible,
    });
  }, [poll, handleEndPoll, socket, roomName, showAlert, updateIsPollModalVisible]);

  // Position styles
  const getPositionStyles = (): React.CSSProperties => {
    const positions: Record<string, React.CSSProperties> = {
      topRight: { top: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      topLeft: { top: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      bottomRight: { bottom: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      bottomLeft: { bottom: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
    };
    return positions[position] || positions.topRight;
  };

  const pollSummaryContainerStyle: React.CSSProperties = {
    marginTop: MediasfuSpacing.md,
    padding: MediasfuSpacing.md,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    borderRadius: MediasfuBorders.md,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
    display: 'flex',
    flexDirection: 'column',
    gap: MediasfuSpacing.sm,
  };

  const pollSummaryRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: MediasfuSpacing.sm,
  };

  const pollSummaryLabelStyle: React.CSSProperties = {
    ...MediasfuTypography.getBodySmall(isDarkMode),
    flex: 1,
  };

  const pollSummaryCountStyle: React.CSSProperties = {
    ...MediasfuTypography.getLabelSmall(isDarkMode),
    opacity: 0.75,
  };

  const pollSummaryBarTrackStyle: React.CSSProperties = {
    flex: 2,
    height: 8,
    background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  };

  const pollSummaryBarFillStyle = (percent: number): React.CSSProperties => ({
    width: `${percent}%`,
    height: '100%',
    background: MediasfuColors.brandGradient(isDarkMode),
  });

  // Sidebar/inline mode - render content directly without modal wrapper
  if (renderMode === 'sidebar' || renderMode === 'inline') {
    const sidebarHeaderStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${MediasfuSpacing.md}px`,
      borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    };

    const sidebarTitleStyle: React.CSSProperties = {
      ...MediasfuTypography.getTitleMedium(isDarkMode),
      display: 'flex',
      alignItems: 'center',
      gap: `${MediasfuSpacing.sm}px`,
      margin: 0,
    };

    const sidebarCloseButtonStyle: React.CSSProperties = {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: MediasfuSpacing.xs,
      borderRadius: MediasfuBorders.sm,
      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    };

    const sidebarTabsStyle: React.CSSProperties = {
      display: 'flex',
      gap: `${MediasfuSpacing.xs}px`,
      padding: `${MediasfuSpacing.sm}px`,
      background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
    };

    const sidebarTabStyle = (isActive: boolean): React.CSSProperties => ({
      flex: 1,
      padding: `${MediasfuSpacing.sm}px`,
      background: isActive
        ? MediasfuColors.brandGradient(isDarkMode)
        : 'transparent',
      border: 'none',
      borderRadius: MediasfuBorders.sm,
      cursor: 'pointer',
      color: isActive ? '#FFFFFF' : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      fontWeight: isActive ? 600 : 400,
      fontSize: 13,
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    });

    const sidebarContentStyle: React.CSSProperties = {
      flex: 1,
      overflowY: 'auto',
      padding: `${MediasfuSpacing.md}px`,
    };

    const sidebarInputStyle: React.CSSProperties = {
      width: '100%',
      padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
      background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
      borderRadius: MediasfuBorders.md,
      color: isDarkMode ? '#FFFFFF' : '#1F2937',
      fontSize: 14,
      outline: 'none',
      marginBottom: MediasfuSpacing.sm,
      boxSizing: 'border-box' as const,
    };

    const sidebarTextareaStyle: React.CSSProperties = {
      ...sidebarInputStyle,
      display: 'block',
      width: '100%',
      minHeight: 80,
      resize: 'vertical' as const,
      lineHeight: 1.5,
      fontFamily: 'inherit',
    };

    const sidebarSelectStyle = (state: { isHovered: boolean; isFocused: boolean }): React.CSSProperties => {
      const focusRing = isDarkMode ? 'rgba(59,130,246,0.35)' : 'rgba(59,130,246,0.45)';
      return {
        ...sidebarInputStyle,
        cursor: 'pointer',
        appearance: 'none' as const,
        WebkitAppearance: 'none' as const,
        MozAppearance: 'none' as const,
        paddingRight: 36,
        backgroundColor: isDarkMode ? 'rgba(22,27,38,0.9)' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.12)'}`,
        boxShadow: state.isFocused
          ? `0 0 0 3px ${focusRing}`
          : state.isHovered
            ? '0 10px 26px rgba(0,0,0,0.18)'
            : '0 6px 16px rgba(0,0,0,0.14)',
        transition: `border-color ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}, box-shadow ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
        colorScheme: isDarkMode ? 'dark' : 'light',
      };
    };

    const sidebarSelectWrapperStyle: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    };

    const sidebarSelectChevronStyle: React.CSSProperties = {
      position: 'absolute',
      right: MediasfuSpacing.md,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
      fontSize: 12,
    };

    const sidebarOptionStyle = (isSelected: boolean): React.CSSProperties => ({
      padding: `${MediasfuSpacing.md}px`,
      background: isSelected
        ? isDarkMode
          ? 'rgba(59, 130, 246, 0.2)'
          : 'rgba(59, 130, 246, 0.1)'
        : isDarkMode
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.02)',
      border: `1px solid ${
        isSelected
          ? (isDarkMode ? MediasfuColors.primary : MediasfuColors.primaryDark)
          : isDarkMode
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.08)'
      }`,
      borderRadius: MediasfuBorders.md,
      cursor: 'pointer',
      marginBottom: MediasfuSpacing.xs,
      color: isDarkMode ? '#FFFFFF' : '#1F2937',
      transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    });

    const sidebarEmptyStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
      padding: MediasfuSpacing.xl,
      textAlign: 'center',
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={sidebarHeaderStyle}>
          <h2 style={sidebarTitleStyle}>
            <FontAwesomeIcon icon={faChartBar} />
            {title || 'Polls'}
          </h2>
          <button style={sidebarCloseButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Tabs */}
        <div style={sidebarTabsStyle}>
          <button
            style={sidebarTabStyle(activeTab === 'active')}
            onClick={() => setActiveTab('active')}
          >
            <FontAwesomeIcon icon={faVoteYea} style={{ marginRight: 4 }} />
            Active
          </button>
          {islevel === '2' && (
            <button
              style={sidebarTabStyle(activeTab === 'create')}
              onClick={() => setActiveTab('create')}
            >
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: 4 }} />
              Create
            </button>
          )}
          <button
            style={sidebarTabStyle(activeTab === 'history')}
            onClick={() => setActiveTab('history')}
          >
            <FontAwesomeIcon icon={faChartBar} style={{ marginRight: 4 }} />
            History
          </button>
        </div>

        {/* Content */}
        <div style={sidebarContentStyle}>
          {/* Active Poll */}
          {activeTab === 'active' && (
            <>
              {poll ? (
                activePollEnded ? (
                  <div>
                    <h3 style={{
                      ...MediasfuTypography.getTitleSmall(isDarkMode),
                      marginBottom: MediasfuSpacing.md,
                    }}>
                      {poll.question}
                    </h3>
                    <div style={pollSummaryContainerStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ ...MediasfuTypography.getLabelSmall(isDarkMode), opacity: 0.7 }}>Poll ended</span>
                        <span style={pollSummaryCountStyle}>{activePollStats.totalVotes} votes</span>
                      </div>
                      {activePollStats.rows.map((row, idx) => (
                        <div key={idx} style={pollSummaryRowStyle}>
                          <span style={pollSummaryLabelStyle}>{row.label}</span>
                          <div style={pollSummaryBarTrackStyle}>
                            <div style={pollSummaryBarFillStyle(row.percent)} />
                          </div>
                          <span style={pollSummaryCountStyle}>{row.count} ({row.percent}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 style={{
                      ...MediasfuTypography.getTitleSmall(isDarkMode),
                      marginBottom: MediasfuSpacing.md,
                    }}>
                      {poll.question}
                    </h3>
                    {poll.options?.map((option, index) => (
                      <div
                        key={index}
                        style={sidebarOptionStyle(selectedOption === index)}
                        onClick={() => setSelectedOption(index)}
                      >
                        <span>{option}</span>
                        {selectedOption === index && (
                          <FontAwesomeIcon icon={faCheck} color={isDarkMode ? MediasfuColors.primary : MediasfuColors.primaryDark} />
                        )}
                      </div>
                    ))}
                    <div style={{ marginTop: MediasfuSpacing.md, display: 'flex', gap: MediasfuSpacing.sm }}>
                      <PremiumButton
                        variant="gradient"
                        size="md"
                        onPress={handleVote}
                        isDarkMode={isDarkMode}
                        disabled={selectedOption === null}
                        style={{ flex: 1 }}
                      >
                        Vote
                      </PremiumButton>
                      {islevel === '2' && (
                        <PremiumButton
                          variant="outlined"
                          size="md"
                          onPress={handleEnd}
                          isDarkMode={isDarkMode}
                        >
                          <FontAwesomeIcon icon={faStop} />
                        </PremiumButton>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <div style={sidebarEmptyStyle}>No active poll</div>
              )}
            </>
          )}

          {/* Create Poll */}
          {activeTab === 'create' && islevel === '2' && (
            <div>
              <ModernTooltip message="Enter the poll question that participants will vote on" position="top" isDarkMode={isDarkMode}>
                <textarea
                  placeholder="Enter your question..."
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  style={sidebarTextareaStyle}
                  rows={3}
                />
              </ModernTooltip>
              <ModernTooltip message="Choose the type of answers for your poll" position="top" isDarkMode={isDarkMode}>
                <div style={sidebarSelectWrapperStyle}>
                  <select
                    value={newPoll.type}
                    onChange={(e) => handlePollTypeChange(e.target.value as NewPollFormState['type'])}
                    style={sidebarSelectStyle({ isHovered: isSidebarSelectHovered, isFocused: isSidebarSelectFocused })}
                    onMouseEnter={() => setIsSidebarSelectHovered(true)}
                    onMouseLeave={() => setIsSidebarSelectHovered(false)}
                    onFocus={() => setIsSidebarSelectFocused(true)}
                    onBlur={() => setIsSidebarSelectFocused(false)}
                  >
                    <option value="">Select poll type</option>
                    <option value="trueFalse">True/False</option>
                    <option value="yesNo">Yes/No</option>
                    <option value="custom">Custom Options</option>
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} style={sidebarSelectChevronStyle} />
                </div>
              </ModernTooltip>
              {newPoll.type === 'custom' && (
                <div style={{ marginTop: MediasfuSpacing.sm }}>
                  {newPoll.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newPoll.options];
                        newOptions[index] = e.target.value;
                        setNewPoll({ ...newPoll, options: newOptions });
                      }}
                      style={sidebarInputStyle}
                    />
                  ))}
                  <ModernTooltip message="Add another answer option" position="top" isDarkMode={isDarkMode}>
                    <div>
                      <PremiumButton
                        variant="outlined"
                        size="sm"
                        onPress={() =>
                          setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })
                        }
                        isDarkMode={isDarkMode}
                        fullWidth
                      >
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: 4 }} />
                        Add Option
                      </PremiumButton>
                    </div>
                  </ModernTooltip>
                </div>
              )}
              <div style={{ marginTop: MediasfuSpacing.lg }}>
                <ModernTooltip message="Create and start the poll for all participants" position="top" isDarkMode={isDarkMode}>
                  <div>
                    <PremiumButton
                      variant="gradient"
                      size="md"
                      onPress={handleCreate}
                      isDarkMode={isDarkMode}
                      fullWidth
                      disabled={!newPoll.question.trim() || !newPoll.type}
                    >
                      Create Poll
                    </PremiumButton>
                  </div>
                </ModernTooltip>
              </div>
            </div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <>
              {polls.length === 0 ? (
                <div style={sidebarEmptyStyle}>No previous polls</div>
              ) : (
                polls.map((p: Poll, index: number) => {
                  const stats = getVoteStats(p);
                  const isActive = isPollActive(p);
                  return (
                    <div
                      key={p.id || index}
                      style={{
                        padding: MediasfuSpacing.md,
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        borderRadius: MediasfuBorders.lg,
                        marginBottom: MediasfuSpacing.md,
                        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                        boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                    >
                      {/* Header with status badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: MediasfuSpacing.sm }}>
                        <div style={{
                          ...MediasfuTypography.getTitleSmall(isDarkMode),
                          flex: 1,
                          marginRight: MediasfuSpacing.sm,
                        }}>
                          {p.question}
                        </div>
                        <span style={{
                          padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
                          borderRadius: MediasfuBorders.sm,
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: 'uppercase' as const,
                          letterSpacing: 0.5,
                          background: isActive
                            ? (isDarkMode ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.15)')
                            : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'),
                          color: isActive
                            ? (isDarkMode ? '#4ade80' : '#16a34a')
                            : (isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'),
                        }}>
                          {isActive ? 'Active' : 'Ended'}
                        </span>
                      </div>
                      {/* Vote count summary */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: MediasfuSpacing.sm,
                        marginBottom: MediasfuSpacing.sm,
                        padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
                        background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        borderRadius: MediasfuBorders.sm,
                      }}>
                        <FontAwesomeIcon icon={faVoteYea} style={{ fontSize: 12, opacity: 0.6 }} />
                        <span style={{ ...MediasfuTypography.getLabelSmall(isDarkMode), opacity: 0.7 }}>
                          {stats.totalVotes} {stats.totalVotes === 1 ? 'vote' : 'votes'}
                        </span>
                      </div>
                      {/* Results breakdown */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: MediasfuSpacing.xs }}>
                        {stats.rows.map((row, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm }}>
                            <span style={{
                              ...MediasfuTypography.getBodySmall(isDarkMode),
                              flex: 1,
                              minWidth: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap' as const,
                            }}>
                              {row.label}
                            </span>
                            <div style={{
                              flex: 2,
                              height: 6,
                              background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                              borderRadius: 999,
                              overflow: 'hidden',
                            }}>
                              <div style={{
                                width: `${row.percent}%`,
                                height: '100%',
                                background: MediasfuColors.brandGradient(isDarkMode),
                                transition: `width ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
                              }} />
                            </div>
                            <span style={{
                              ...MediasfuTypography.getLabelSmall(isDarkMode),
                              minWidth: 45,
                              textAlign: 'right' as const,
                              opacity: 0.75,
                            }}>
                              {row.percent}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  if (!isPollModalVisible) return null;

  // Styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: MediasfuColors.alertBackdrop(isDarkMode),
    backdropFilter: enableGlassmorphism ? 'blur(2px)' : undefined,
    WebkitBackdropFilter: enableGlassmorphism ? 'blur(2px)' : undefined,
    opacity: isMounted ? 1 : 0,
    transition: `opacity ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    ...getPositionStyles(),
    width: 'min(450px, calc(100vw - 32px))',
    maxHeight: 'min(600px, calc(100vh - 100px))',
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.snappy}`,
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.md}px`,
    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  const titleStyle: React.CSSProperties = {
    ...MediasfuTypography.getTitleMedium(isDarkMode),
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
    margin: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: MediasfuSpacing.xs,
    borderRadius: MediasfuBorders.sm,
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.xs}px`,
    padding: `${MediasfuSpacing.sm}px`,
    background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: `${MediasfuSpacing.sm}px`,
    background: isActive
      ? MediasfuColors.brandGradient(isDarkMode)
      : 'transparent',
    border: 'none',
    borderRadius: MediasfuBorders.sm,
    cursor: 'pointer',
    color: isActive ? '#FFFFFF' : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    fontWeight: isActive ? 600 : 400,
    fontSize: 13,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  });

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: `${MediasfuSpacing.md}px`,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    display: 'block',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: MediasfuBorders.md,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    fontSize: 14,
    outline: 'none',
    marginBottom: MediasfuSpacing.sm,
    boxSizing: 'border-box' as const,
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    display: 'block',
    width: '100%',
    minHeight: 80,
    resize: 'vertical' as const,
    lineHeight: 1.5,
    fontFamily: 'inherit',
  };

  const selectStyle = (state: { isHovered: boolean; isFocused: boolean }): React.CSSProperties => {
    const focusRing = isDarkMode ? 'rgba(59,130,246,0.35)' : 'rgba(59,130,246,0.45)';
    return {
      ...inputStyle,
      cursor: 'pointer',
      appearance: 'none' as const,
      WebkitAppearance: 'none' as const,
      MozAppearance: 'none' as const,
      paddingRight: 36,
      backgroundColor: isDarkMode ? 'rgba(22,27,38,0.9)' : '#FFFFFF',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.12)'}`,
      boxShadow: state.isFocused
        ? `0 0 0 3px ${focusRing}`
        : state.isHovered
          ? '0 12px 28px rgba(0,0,0,0.22)'
          : '0 8px 22px rgba(0,0,0,0.16)',
      transition: `border-color ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}, box-shadow ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
      colorScheme: isDarkMode ? 'dark' : 'light',
    };
  };

  const selectWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const selectChevronStyle: React.CSSProperties = {
    position: 'absolute',
    right: MediasfuSpacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
    fontSize: 12,
  };

  const optionStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: `${MediasfuSpacing.md}px`,
    background: isSelected
      ? isDarkMode
        ? 'rgba(59, 130, 246, 0.2)'
        : 'rgba(59, 130, 246, 0.1)'
      : isDarkMode
        ? 'rgba(255,255,255,0.05)'
        : 'rgba(0,0,0,0.02)',
    border: `1px solid ${
      isSelected
        ? (isDarkMode ? MediasfuColors.primary : MediasfuColors.primaryDark)
        : isDarkMode
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(0,0,0,0.08)'
    }`,
    borderRadius: MediasfuBorders.md,
    cursor: 'pointer',
    marginBottom: MediasfuSpacing.xs,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  });

  const emptyStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    padding: MediasfuSpacing.xl,
    textAlign: 'center',
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <GlassmorphicContainer
        isDarkMode={isDarkMode}
        borderRadius={MediasfuBorders.xl}
        blur={enableGlassmorphism ? 20 : 0}
        padding={0}
        elevation={4}
        style={{
          ...modalStyle,
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
          boxShadow: enableGlow
            ? `${MediasfuColors.elevation(4, isDarkMode)}, ${MediasfuColors.glowPrimary}`
            : MediasfuColors.elevation(4, isDarkMode),
        }}
      >
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            <FontAwesomeIcon icon={faChartBar} />
            {title || 'Polls'}
          </h2>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Tabs */}
        <div style={tabsStyle}>
          <button
            style={tabStyle(activeTab === 'active')}
            onClick={() => setActiveTab('active')}
          >
            <FontAwesomeIcon icon={faVoteYea} style={{ marginRight: 4 }} />
            Active
          </button>
          {islevel === '2' && (
            <button
              style={tabStyle(activeTab === 'create')}
              onClick={() => setActiveTab('create')}
            >
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: 4 }} />
              Create
            </button>
          )}
          <button
            style={tabStyle(activeTab === 'history')}
            onClick={() => setActiveTab('history')}
          >
            <FontAwesomeIcon icon={faChartBar} style={{ marginRight: 4 }} />
            History
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {/* Active Poll */}
          {activeTab === 'active' && (
            <>
              {poll ? (
                activePollEnded ? (
                  <div>
                    <h3 style={{
                      ...MediasfuTypography.getTitleSmall(isDarkMode),
                      marginBottom: MediasfuSpacing.md,
                    }}>
                      {poll.question}
                    </h3>
                    <div style={pollSummaryContainerStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ ...MediasfuTypography.getLabelSmall(isDarkMode), opacity: 0.7 }}>Poll ended</span>
                        <span style={pollSummaryCountStyle}>{activePollStats.totalVotes} votes</span>
                      </div>
                      {activePollStats.rows.map((row, idx) => (
                        <div key={idx} style={pollSummaryRowStyle}>
                          <span style={pollSummaryLabelStyle}>{row.label}</span>
                          <div style={pollSummaryBarTrackStyle}>
                            <div style={pollSummaryBarFillStyle(row.percent)} />
                          </div>
                          <span style={pollSummaryCountStyle}>{row.count} ({row.percent}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 style={{
                      ...MediasfuTypography.getTitleSmall(isDarkMode),
                      marginBottom: MediasfuSpacing.md,
                    }}>
                      {poll.question}
                    </h3>
                    {poll.options?.map((option, index) => (
                      <div
                        key={index}
                        style={optionStyle(selectedOption === index)}
                        onClick={() => setSelectedOption(index)}
                      >
                        <span>{option}</span>
                        {selectedOption === index && (
                          <FontAwesomeIcon icon={faCheck} color={isDarkMode ? MediasfuColors.primary : MediasfuColors.primaryDark} />
                        )}
                      </div>
                    ))}
                    <div style={{ marginTop: MediasfuSpacing.md, display: 'flex', gap: MediasfuSpacing.sm }}>
                      <PremiumButton
                        variant="gradient"
                        size="md"
                        onPress={handleVote}
                        isDarkMode={isDarkMode}
                        disabled={selectedOption === null}
                        style={{ flex: 1 }}
                      >
                        Vote
                      </PremiumButton>
                      {islevel === '2' && (
                        <PremiumButton
                          variant="outlined"
                          size="md"
                          onPress={handleEnd}
                          isDarkMode={isDarkMode}
                        >
                          <FontAwesomeIcon icon={faStop} />
                        </PremiumButton>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <div style={emptyStyle}>No active poll</div>
              )}
            </>
          )}

          {/* Create Poll */}
          {activeTab === 'create' && islevel === '2' && (
            <div>
              <ModernTooltip message="Enter the poll question that participants will vote on" position="top" isDarkMode={isDarkMode}>
                <textarea
                  placeholder="Enter your question..."
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  style={textareaStyle}
                  rows={3}
                />
              </ModernTooltip>
              <ModernTooltip message="Choose the type of answers for your poll" position="top" isDarkMode={isDarkMode}>
                <div style={selectWrapperStyle}>
                  <select
                    value={newPoll.type}
                    onChange={(e) => handlePollTypeChange(e.target.value as NewPollFormState['type'])}
                    style={selectStyle({ isHovered: isSelectHovered, isFocused: isSelectFocused })}
                    onMouseEnter={() => setIsSelectHovered(true)}
                    onMouseLeave={() => setIsSelectHovered(false)}
                    onFocus={() => setIsSelectFocused(true)}
                    onBlur={() => setIsSelectFocused(false)}
                  >
                    <option value="">Select poll type</option>
                    <option value="trueFalse">True/False</option>
                    <option value="yesNo">Yes/No</option>
                    <option value="custom">Custom Options</option>
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} style={selectChevronStyle} />
                </div>
              </ModernTooltip>
              {newPoll.type === 'custom' && (
                <div style={{ marginTop: MediasfuSpacing.sm }}>
                  {newPoll.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newPoll.options];
                        newOptions[index] = e.target.value;
                        setNewPoll({ ...newPoll, options: newOptions });
                      }}
                      style={inputStyle}
                    />
                  ))}
                  <ModernTooltip message="Add another answer option" position="top" isDarkMode={isDarkMode}>
                    <div>
                      <PremiumButton
                        variant="outlined"
                        size="sm"
                        onPress={() =>
                          setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })
                        }
                        isDarkMode={isDarkMode}
                        fullWidth
                      >
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: 4 }} />
                        Add Option
                      </PremiumButton>
                    </div>
                  </ModernTooltip>
                </div>
              )}
              <div style={{ marginTop: MediasfuSpacing.lg }}>
                <ModernTooltip message="Create and start the poll for all participants" position="top" isDarkMode={isDarkMode}>
                  <div>
                    <PremiumButton
                      variant="gradient"
                      size="md"
                      onPress={handleCreate}
                      isDarkMode={isDarkMode}
                      fullWidth
                      disabled={!newPoll.question.trim() || !newPoll.type}
                    >
                      Create Poll
                    </PremiumButton>
                  </div>
                </ModernTooltip>
              </div>
            </div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <>
              {polls.length === 0 ? (
                <div style={emptyStyle}>No previous polls</div>
              ) : (
                polls.map((p: Poll, index: number) => {
                  const stats = getVoteStats(p);
                  const isActive = isPollActive(p);
                  return (
                    <div
                      key={p.id || index}
                      style={{
                        padding: MediasfuSpacing.md,
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        borderRadius: MediasfuBorders.lg,
                        marginBottom: MediasfuSpacing.md,
                        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                        boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                    >
                      {/* Header with status badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: MediasfuSpacing.sm }}>
                        <div style={{
                          ...MediasfuTypography.getTitleSmall(isDarkMode),
                          flex: 1,
                          marginRight: MediasfuSpacing.sm,
                        }}>
                          {p.question}
                        </div>
                        <span style={{
                          padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
                          borderRadius: MediasfuBorders.sm,
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: 'uppercase' as const,
                          letterSpacing: 0.5,
                          background: isActive
                            ? (isDarkMode ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.15)')
                            : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'),
                          color: isActive
                            ? (isDarkMode ? '#4ade80' : '#16a34a')
                            : (isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'),
                        }}>
                          {isActive ? 'Active' : 'Ended'}
                        </span>
                      </div>
                      {/* Vote count summary */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: MediasfuSpacing.sm,
                        marginBottom: MediasfuSpacing.sm,
                        padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
                        background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        borderRadius: MediasfuBorders.sm,
                      }}>
                        <FontAwesomeIcon icon={faVoteYea} style={{ fontSize: 12, opacity: 0.6 }} />
                        <span style={{ ...MediasfuTypography.getLabelSmall(isDarkMode), opacity: 0.7 }}>
                          {stats.totalVotes} {stats.totalVotes === 1 ? 'vote' : 'votes'}
                        </span>
                      </div>
                      {/* Results breakdown */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: MediasfuSpacing.xs }}>
                        {stats.rows.map((row, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm }}>
                            <span style={{
                              ...MediasfuTypography.getBodySmall(isDarkMode),
                              flex: 1,
                              minWidth: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap' as const,
                            }}>
                              {row.label}
                            </span>
                            <div style={{
                              flex: 2,
                              height: 6,
                              background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                              borderRadius: 999,
                              overflow: 'hidden',
                            }}>
                              <div style={{
                                width: `${row.percent}%`,
                                height: '100%',
                                background: MediasfuColors.brandGradient(isDarkMode),
                                transition: `width ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
                              }} />
                            </div>
                            <span style={{
                              ...MediasfuTypography.getLabelSmall(isDarkMode),
                              minWidth: 45,
                              textAlign: 'right' as const,
                              opacity: 0.75,
                            }}>
                              {row.percent}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </GlassmorphicContainer>
    </>
  );
};

export default ModernPollModal;
