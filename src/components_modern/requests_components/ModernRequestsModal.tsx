/**
 * Modern Requests Modal with glassmorphic design.
 *
 * A premium-styled requests modal for managing join requests,
 * featuring glassmorphic effects and smooth animations.
 * Uses the same RequestsModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernRequestsModal
 *   isRequestsModalVisible={showRequests}
 *   onRequestClose={() => setShowRequests(false)}
 *   requestList={requests}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faHandPaper,
  faCheck,
  faBan,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import RenderRequestComponent, { RenderRequestComponentOptions } from '../../components/requestsComponents/RenderRequestComponent';
import { RequestsModalOptions } from '../../components/requestsComponents/RequestsModal';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import { respondToRequests } from '../../methods/requestsMethods/respondToRequests';
import { Request } from '../../@types/types';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { ModernTooltip } from '../core/widgets/ModernTooltip';

export interface ModernRequestsModalOptions extends RequestsModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
  renderMode?: ModalRenderMode;
  /** Enable tooltips for request actions */
  requestTooltips?: boolean;
  /** Accent color passed to the request renderer */
  requestAccentColor?: string;
}

export type ModernRequestsModalType = (
  options: ModernRequestsModalOptions
) => React.JSX.Element;

/**
 * ModernRequestsModal displays pending requests with premium styling.
 */
export const ModernRequestsModal: React.FC<ModernRequestsModalOptions> = ({
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
  emptyState,
  renderHeader,
  renderSearch,
  renderRequest,
  renderBody,
  renderContent,
  parameters,
  position = 'topRight',
  title,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
  requestTooltips = true,
  requestAccentColor,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [searchText, setSearchText] = useState('');

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

  // Get filtered list
  const filteredList = useMemo(() => {
    const updatedParams = parameters.getUpdatedAllParams?.();
    const baseList = updatedParams?.filteredRequestList || requestListState;
    if (!searchText.trim()) return baseList;
    return baseList.filter(
      (req: Request) =>
        (req.name ?? '').toLowerCase().includes(searchText.toLowerCase())
    );
  }, [parameters, requestListState, searchText]);

  // Mount animation
  useEffect(() => {
    if (isRequestsModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isRequestsModalVisible]);

  // Handle filter change
  const handleFilterChange = useCallback(
    (text: string) => {
      setSearchText(text);
      onRequestFilterChange(text);
      setRerenderToggle((prev) => !prev);
    },
    [onRequestFilterChange]
  );

  // Handle request response
  const handleResponse = useCallback(
    async (request: Request, action: 'accepted' | 'rejected') => {
      await onRequestItemPress({
        request,
        updateRequestList,
        requestList: requestListState,
        action,
        roomName,
        socket,
      });
    },
    [onRequestItemPress, updateRequestList, requestListState, roomName, socket]
  );

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

  // For sidebar or inline mode, skip visibility check
  if (renderMode !== 'sidebar' && renderMode !== 'inline') {
    if (!isRequestsModalVisible) return null;
  }

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
    width: 'min(400px, calc(100vw - 32px))',
    maxHeight: 'min(500px, calc(100vh - 100px))',
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

  const badgeStyle: React.CSSProperties = {
    background: MediasfuColors.brandGradient(isDarkMode),
    color: '#FFFFFF',
    borderRadius: MediasfuBorders.full,
    padding: `2px ${MediasfuSpacing.sm}px`,
    fontSize: 12,
    fontWeight: 600,
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

  const searchContainerStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    paddingLeft: 36,
    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: MediasfuBorders.md,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    fontSize: 14,
    outline: 'none',
  };

  const listStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: `${MediasfuSpacing.md}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.sm}px`,
  };

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    borderRadius: MediasfuBorders.md,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
  };

  const nameStyle: React.CSSProperties = {
    ...MediasfuTypography.getBodyMedium(isDarkMode),
    flex: 1,
  };

  const actionButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.xs}px`,
  };

  const actionButtonStyle = (isAccept: boolean): React.CSSProperties => ({
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isAccept
      ? 'linear-gradient(135deg, #10B981, #059669)'
      : 'linear-gradient(135deg, #EF4444, #DC2626)',
    border: 'none',
    borderRadius: MediasfuBorders.sm,
    cursor: 'pointer',
    color: '#FFFFFF',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  });

  const emptyStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    padding: MediasfuSpacing.xl,
    textAlign: 'center',
  };

  // Build content
  const defaultHeader = (
    <div style={headerStyle}>
      <h2 style={titleStyle}>
        <FontAwesomeIcon icon={faHandPaper} />
        {title || 'Requests'}
        {requestCounterState > 0 && (
          <span style={badgeStyle}>{requestCounterState}</span>
        )}
      </h2>
      <button style={closeButtonStyle} onClick={onRequestClose}>
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
    </div>
  );

  const headerContent = renderHeader
    ? renderHeader({ defaultHeader, counter: requestCounterState, onClose: onRequestClose })
    : defaultHeader;

  const defaultSearch = (
    <div style={searchContainerStyle}>
      <div style={{ position: 'relative' }}>
        <FontAwesomeIcon
          icon={faSearch}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          }}
        />
        <input
          type="text"
          placeholder="Search requests..."
          value={searchText}
          onChange={(e) => handleFilterChange(e.target.value)}
          style={searchInputStyle}
        />
      </div>
    </div>
  );

  const searchContent = renderSearch
    ? renderSearch({ defaultSearch, onFilter: handleFilterChange })
    : defaultSearch;

  const renderRequestRow = (request: Request, index: number) => {
    const handleRespond = (action: 'accepted' | 'rejected') => handleResponse(request, action);

    const defaultRequest = (
      <div key={`${request.id}-${index}`} style={itemStyle}>
        <span style={nameStyle}>{request.name}</span>
        <div style={actionButtonsStyle}>
          <ModernTooltip
            message={requestTooltips ? `Accept ${request.name ?? 'request'}` : ''}
            isDarkMode={isDarkMode}
          >
            <button
              style={actionButtonStyle(true)}
              onClick={() => handleRespond('accepted')}
              aria-label={requestTooltips ? `Accept ${request.name ?? 'request'}` : undefined}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </ModernTooltip>
          <ModernTooltip
            message={requestTooltips ? `Reject ${request.name ?? 'request'}` : ''}
            isDarkMode={isDarkMode}
          >
            <button
              style={actionButtonStyle(false)}
              onClick={() => handleRespond('rejected')}
              aria-label={requestTooltips ? `Reject ${request.name ?? 'request'}` : undefined}
            >
              <FontAwesomeIcon icon={faBan} />
            </button>
          </ModernTooltip>
        </div>
      </div>
    );

    const renderedRow = renderRequest
      ? renderRequest({ request, index, defaultRequest, handleRespond })
      : defaultRequest;

    if (React.isValidElement(renderedRow)) {
      return React.cloneElement(renderedRow, { key: `${request.id}-${index}` });
    }
    return <React.Fragment key={`${request.id}-${index}`}>{renderedRow}</React.Fragment>;
  };

  const listContent = (
    <div style={listStyle}>
      {filteredList.length === 0
        ? typeof emptyState === 'function'
          ? emptyState({ counter: requestCounterState })
          : emptyState || <div style={emptyStyle}>No pending requests</div>
        : filteredList.map((request: Request, index: number) => {
            if (renderRequestComponent && !renderRequest) {
              const rendered = renderRequestComponent({
                request,
                onRequestItemPress,
                requestList: requestListState,
                updateRequestList,
                roomName,
                socket,
                isDarkMode,
                showTooltips: requestTooltips,
                accentColor: requestAccentColor,
              } as RenderRequestComponentOptions) as React.ReactElement;
              return (
                <div key={`${request.id}-${index}`} style={{ marginTop: 5 }}>
                  {rendered}
                </div>
              );
            }

            return renderRequestRow(request, index);
          })}
    </div>
  );

  const defaultBody = (
    <div style={listStyle}>
      {listContent}
    </div>
  );

  const bodyContent = renderBody
    ? renderBody({ defaultBody, counter: requestCounterState })
    : defaultBody;

  // For sidebar/inline mode, render content directly without modal wrapper
  if (renderMode === 'sidebar' || renderMode === 'inline') {
    const sidebarContent = (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {headerContent}
        {searchContent}
        {bodyContent}
      </div>
    );

    return renderContent
      ? renderContent({ defaultContent: sidebarContent, counter: requestCounterState })
      : sidebarContent;
  }

  const defaultContent = (
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
      {headerContent}
      {searchContent}
      {bodyContent}
    </GlassmorphicContainer>
  );

  const resolvedContent = renderContent
    ? renderContent({ defaultContent, counter: requestCounterState })
    : defaultContent;

  return (
    <>
      <div style={overlayStyle} onClick={onRequestClose} />
      {resolvedContent}
    </>
  );
};

export default ModernRequestsModal;
