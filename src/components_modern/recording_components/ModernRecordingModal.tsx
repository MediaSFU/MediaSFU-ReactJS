/**
 * Modern Recording Modal with glassmorphic design.
 *
 * A premium-styled recording settings modal with tab-based panels
 * for standard and advanced recording options.
 * Uses the same RecordingModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernRecordingModal
 *   isRecordingModalVisible={showRecording}
 *   onClose={() => setShowRecording(false)}
 *   confirmRecording={confirmRecording}
 *   startRecording={startRecording}
 *   parameters={recordingParams}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCircle,
  faVideo,
  faCog,
  faCheck,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import {
  RecordingModalOptions,
  RecordingModalType,
} from '../../components/recordingComponents/RecordingModal';
import StandardPanelComponent from './StandardPanelComponent';
import AdvancedPanelComponent from './AdvancedPanelComponent';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';

export interface ModernRecordingModalProps extends RecordingModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
  renderMode?: ModalRenderMode;
}

export type ModernRecordingModalType = RecordingModalType;

/**
 * ModernRecordingModal provides recording settings with premium styling.
 */
export const ModernRecordingModal: React.FC<ModernRecordingModalProps> = ({
  isRecordingModalVisible,
  onClose,
  backgroundColor = '#83c0e9',
  position = 'topRight',
  confirmRecording,
  startRecording,
  parameters,
  title,
  overlayProps,
  contentProps,
  headerProps,
  titleProps,
  closeButtonProps,
  headerDividerProps,
  bodyProps,
  panelsWrapperProps,
  panelsScrollProps,
  panelsContainerProps,
  panelsActionsDividerProps,
  actionsWrapperProps,
  confirmButtonProps,
  startButtonProps,
  confirmButtonLabel = 'Confirm',
  startButtonLabel = (
    <>
      Start <i className="fas fa-play" />
    </>
  ),
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
  // Render props
  renderHeader,
  renderPanels,
  renderBody,
  renderContent,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'standard' | 'advanced'>('standard');
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  // Mount animation
  useEffect(() => {
    if (isRecordingModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isRecordingModalVisible]);

  // Get parameters
  const params = parameters?.getUpdatedAllParams?.() || parameters;

  // Handle confirm
  const handleConfirm = useCallback(async () => {
    if (confirmRecording) {
      await confirmRecording({ parameters: params });
      setConfirmSuccess(true);
      setTimeout(() => setConfirmSuccess(false), 2000);
    }
  }, [confirmRecording, params]);

  // Handle start
  const handleStart = useCallback(async () => {
    if (startRecording) {
      await startRecording({ parameters: params });
      onClose();
    }
  }, [startRecording, params, onClose]);

  // Position styles
  const getPositionStyles = (): React.CSSProperties => {
    const positions: Record<string, React.CSSProperties> = {
      topRight: { top: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      topLeft: { top: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      bottomRight: { bottom: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      bottomLeft: { bottom: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      center: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    };
    return positions[position] || positions.topRight;
  };

  // For sidebar or inline mode, skip visibility check
  if (renderMode !== 'sidebar' && renderMode !== 'inline') {
    if (!isRecordingModalVisible) return null;
  }

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    onClick: overlayOnClick,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = ['mediasfu-recording-modal', overlayClassName]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

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
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    ...getPositionStyles(),
    width: 'min(500px, calc(100vw - 32px))',
    maxHeight: 'calc(100vh - 100px)',
    opacity: isMounted ? 1 : 0,
    transform: isMounted
      ? position === 'center'
        ? 'translate(-50%, -50%) scale(1)'
        : 'scale(1) translateY(0)'
      : position === 'center'
        ? 'translate(-50%, -50%) scale(0.95)'
        : 'scale(0.95) translateY(-10px)',
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.snappy}`,
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    background: backgroundColor,
    ...contentStyleOverrides,
  };
  const {
    className: headerClassName,
    style: headerStyleOverrides,
    ...restHeaderProps
  } = headerProps ?? {};

  const headerClassNames = ['modal-header', headerClassName]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.md}px`,
    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    ...headerStyleOverrides,
  };

  const {
    className: titleClassName,
    style: titleStyleOverrides,
    ...restTitleProps
  } = titleProps ?? {};

  const titleClassNames = ['modal-title', titleClassName]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const titleStyle: React.CSSProperties = {
    ...MediasfuTypography.getTitleMedium(isDarkMode),
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
    margin: 0,
    color: MediasfuColors.danger,
    ...titleStyleOverrides,
  };

  const {
    className: closeButtonClassName,
    style: closeButtonStyleOverrides,
    onClick: closeButtonOnClick,
    ...restCloseButtonProps
  } = closeButtonProps ?? {};

  const closeButtonClassNames = ['btn-close-recording', closeButtonClassName]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: MediasfuSpacing.xs,
    borderRadius: MediasfuBorders.sm,
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    ...closeButtonStyleOverrides,
  };

  const handleCloseClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    closeButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      onClose();
    }
  };

  const {
    style: headerDividerStyleOverrides,
    ...restHeaderDividerProps
  } = headerDividerProps ?? {};

  const headerDividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: MediasfuColors.glassBorder(isDarkMode),
    marginTop: 5,
    marginBottom: 5,
    border: 'none',
    ...headerDividerStyleOverrides,
  };

  const {
    className: bodyClassName,
    style: bodyStyleOverrides,
    ...restBodyProps
  } = bodyProps ?? {};

  const bodyClassNames = ['modal-body', bodyClassName]
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;

  const bodyStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.md}px`,
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.md}px`,
    minHeight: 0,
    ...bodyStyleOverrides,
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.xs}px`,
    padding: `${MediasfuSpacing.xs}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    borderRadius: MediasfuBorders.md,
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isActive
      ? MediasfuColors.brandGradient(isDarkMode)
      : 'transparent',
    border: 'none',
    borderRadius: MediasfuBorders.sm,
    cursor: 'pointer',
    color: isActive ? '#FFFFFF' : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    fontWeight: isActive ? 600 : 400,
    fontSize: 14,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${MediasfuSpacing.xs}px`,
  });

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.sm}px`,
    padding: `${MediasfuSpacing.md}px`,
    borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  // Default header
  const defaultHeader = (
    <div className={headerClassNames} style={headerStyle} {...restHeaderProps}>
      <h2 className={titleClassNames} style={titleStyle} {...restTitleProps}>
        <FontAwesomeIcon icon={faCircle} className="pulse" />
        {title || 'Recording Settings'}
      </h2>
      <button
        className={closeButtonClassNames}
        style={closeButtonStyle}
        onClick={handleCloseClick}
        {...restCloseButtonProps}
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
    </div>
  );

  // Panels wrapper styles
  const panelsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: MediasfuSpacing.md,
    ...panelsWrapperProps?.style,
  };

  const panelsScrollStyle: React.CSSProperties = {
    overflowY: 'auto',
    maxHeight: '100%',
    ...panelsScrollProps?.style,
  };

  const panelsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: MediasfuSpacing.sm,
    ...panelsContainerProps?.style,
  };

  const defaultPanels = (
    <div
      className={panelsWrapperProps?.className}
      style={panelsWrapperStyle}
      {...panelsWrapperProps}
    >
      <div style={tabsStyle}>
        <button
          style={tabStyle(activeTab === 'standard')}
          onClick={() => setActiveTab('standard')}
        >
          <FontAwesomeIcon icon={faVideo} />
          Standard
        </button>
        <button
          style={tabStyle(activeTab === 'advanced')}
          onClick={() => setActiveTab('advanced')}
        >
          <FontAwesomeIcon icon={faCog} />
          Advanced
        </button>
      </div>
      <div
        className={panelsScrollProps?.className}
        style={panelsScrollStyle}
        {...panelsScrollProps}
      >
        <div
          className={panelsContainerProps?.className}
          style={panelsContainerStyle}
          {...panelsContainerProps}
        >
          {activeTab === 'standard' ? (
            <StandardPanelComponent parameters={params} />
          ) : (
            <AdvancedPanelComponent parameters={params} />
          )}
        </div>
      </div>
    </div>
  );

  const panelsActionsDividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: MediasfuColors.glassBorder(isDarkMode),
    marginTop: 0,
    marginBottom: 0,
    ...panelsActionsDividerProps?.style,
  };

  const defaultActions = (
    <div
      className={actionsWrapperProps?.className}
      style={{ ...actionsStyle, ...actionsWrapperProps?.style }}
      {...actionsWrapperProps}
    >
      <PremiumButton
        variant={confirmSuccess ? 'filled' : 'outlined'}
        backgroundColor={confirmSuccess ? MediasfuColors.success : undefined}
        size="md"
        fullWidth
        onPress={() => {
          const handler = confirmButtonProps?.onClick as any;
          handler?.(undefined);
          void handleConfirm();
        }}
        isDarkMode={isDarkMode}
        icon={<FontAwesomeIcon icon={faCheck} />}
        {...confirmButtonProps}
      >
        {confirmSuccess ? 'Confirmed!' : confirmButtonLabel}
      </PremiumButton>
      {!params?.recordPaused && (
        <PremiumButton
          variant="glow"
          size="md"
          fullWidth
          onPress={() => {
            const handler = startButtonProps?.onClick as any;
            handler?.(undefined);
            void handleStart();
          }}
          isDarkMode={isDarkMode}
          icon={<FontAwesomeIcon icon={faPlay} />}
          backgroundColor={MediasfuColors.danger}
          {...startButtonProps}
        >
          {startButtonLabel}
        </PremiumButton>
      )}
    </div>
  );

  const defaultBody = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
      {renderPanels ? renderPanels({ defaultPanels, parameters: params }) : defaultPanels}
      <div
        className={panelsActionsDividerProps?.className}
        style={panelsActionsDividerStyle}
        {...panelsActionsDividerProps}
      />
    </div>
  );

  // For sidebar/inline mode, render content directly without modal wrapper
  if (renderMode === 'sidebar' || renderMode === 'inline') {
    const sidebarContent = (
      <div
        className={contentClassName}
        style={{ display: 'flex', flexDirection: 'column', height: '100%', ...contentStyleOverrides }}
        {...restContentProps}
      >
        {renderHeader ? renderHeader({ defaultHeader, onClose }) : defaultHeader}
        <hr style={headerDividerStyle} {...restHeaderDividerProps} />
        {renderBody ? renderBody({ defaultBody }) : defaultBody}
        {defaultActions}
      </div>
    );
    return renderContent
      ? <>{renderContent({ defaultContent: sidebarContent })}</>
      : sidebarContent;
  }

  // Default content for modal mode
  const defaultContent = (
    <GlassmorphicContainer
      className={contentClassName}
      isDarkMode={isDarkMode}
      borderRadius={MediasfuBorders.xl}
      blur={enableGlassmorphism ? 20 : 0}
      padding={0}
      elevation={4}
      style={{
        ...modalStyle,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
        boxShadow: enableGlow
          ? `${MediasfuColors.elevation(4, isDarkMode)}, 0 0 30px ${MediasfuColors.hexToRgba(MediasfuColors.danger, 0.3)}`
          : MediasfuColors.elevation(4, isDarkMode),
      }}
    >
      {renderHeader ? renderHeader({ defaultHeader, onClose }) : defaultHeader}
      <hr style={headerDividerStyle} {...restHeaderDividerProps} />
      {renderBody ? renderBody({ defaultBody }) : defaultBody}
      {defaultActions}
    </GlassmorphicContainer>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={overlayClassNames}
        style={overlayStyle}
        onClick={overlayOnClick}
        {...restOverlayProps}
      />
      {/* Modal */}
      {renderContent ? renderContent({ defaultContent }) : defaultContent}
    </>
  );
};

export default ModernRecordingModal;
