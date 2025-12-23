/**
 * Modern video card with glassmorphic overlays and enhanced visual design.
 *
 * A premium-styled video card that wraps participant video with animated
 * overlays, smooth hover effects, and glassmorphic controls.
 * Uses the same VideoCardOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernVideoCard
 *   name="John Doe"
 *   remoteProducerId="producer-123"
 *   eventType="conference"
 *   forceFullDisplay={false}
 *   videoStream={mediaStream}
 *   participant={participant}
 *   parameters={parameters}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faCrop,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { VideoCardOptions } from '../../components/displayComponents/VideoCard';
import CardVideoDisplay from '../../components/displayComponents/CardVideoDisplay';
import { controlMedia } from '../../consumers/controlMedia';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { ModernTooltip } from '../core/widgets/ModernTooltip';

export interface ModernVideoCardOptions extends VideoCardOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects on hover */
  enableGlow?: boolean;
  /** Border radius for the card */
  borderRadius?: number;
  /** Show status indicator (online/offline) */
  showStatusIndicator?: boolean;
  /** Callback to toggle self view fit mode */
  onToggleSelfViewFit?: () => void;
}

export type ModernVideoCardType = (options: ModernVideoCardOptions) => React.JSX.Element;

/**
 * ModernVideoCard displays participant video with premium glassmorphic styling.
 */
export const ModernVideoCard: React.FC<ModernVideoCardOptions> = ({
  customStyle,
  name,
  barColor = MediasfuColors.primary,
  textColor = '#FFFFFF',
  // imageSource, roundedImage, imageStyle - reserved for future avatar fallback
  remoteProducerId,
  eventType,
  forceFullDisplay,
  videoStream,
  showControls = true,
  showInfo = true,
  videoInfoComponent,
  videoControlsComponent,
  controlsPosition = 'topLeft',
  infoPosition = 'bottomLeft',
  participant,
  backgroundColor,
  audioDecibels,
  doMirror = false,
  parameters,
  containerProps,
  infoOverlayProps,
  controlsOverlayProps,
  waveformContainerProps,
  waveformBarStyle,
  waveformBarClassName,
  videoDisplayProps,
  extraWidgets,
  children,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  borderRadius = MediasfuBorders.md,
  showStatusIndicator = true,
  onToggleSelfViewFit,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);
  const [waveformValues, setWaveformValues] = useState<number[]>(Array(5).fill(0));
  const [showCropIndicator, setShowCropIndicator] = useState(true);
  const animationRef = useRef<number | null>(null);

  // Mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Audio level polling - like the original VideoCard
  // Polls getUpdatedAllParams every second to check for active audio
  useEffect(() => {
    const interval = setInterval(() => {
      if (!participant) return;
      
      // Try to get live data from parameters
      if (parameters?.getUpdatedAllParams) {
        const latestParams = parameters.getUpdatedAllParams();
        const latestAudioDecibels = latestParams?.audioDecibels;
        const participants = latestParams?.participants;
        
        const existingEntry = latestAudioDecibels?.find(
          (entry: { name: string; averageLoudness: number }) => entry.name === participant.name
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedParticipant = participants?.find(
          (p: any) => p.name === participant.name
        );

        if (
          existingEntry &&
          existingEntry.averageLoudness > 127.5 &&
          updatedParticipant &&
          !updatedParticipant.muted
        ) {
          if (!showWaveform) {
            setShowWaveform(true);
          }
        } else {
          setShowWaveform(false);
        }
      } else if (audioDecibels) {
        // Fallback to audioDecibels prop
        const participantEntry = audioDecibels.find(
          (entry) => entry.name === participant.name
        );
        const averageLoudness = participantEntry?.averageLoudness ?? 0;
        const shouldShow = averageLoudness > 127.5 && !participant?.muted;
        setShowWaveform(shouldShow);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [parameters, participant, showWaveform, audioDecibels]);

  // Waveform bar animation when showWaveform is active
  useEffect(() => {
    if (showWaveform) {
      const animate = () => {
        setWaveformValues((prev) =>
          prev.map(() => Math.random() * 12 + 4)
        );
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setWaveformValues(Array(5).fill(0));
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showWaveform]);

  // Media control handlers
  const handleToggleAudio = useCallback(async () => {
    if (!participant?.muted) {
      const updatedParams = parameters.getUpdatedAllParams();
      await controlMedia({
        participantId: participant.id || '',
        participantName: participant.name,
        type: 'audio',
        socket: updatedParams.socket,
        roomName: updatedParams.roomName,
        coHostResponsibility: updatedParams.coHostResponsibility,
        showAlert: updatedParams.showAlert,
        coHost: updatedParams.coHost,
        participants: updatedParams.participants,
        member: updatedParams.member,
        islevel: updatedParams.islevel,
      });
    }
  }, [participant, parameters]);

  const handleToggleVideo = useCallback(async () => {
    if (participant?.videoOn) {
      const updatedParams = parameters.getUpdatedAllParams();
      await controlMedia({
        participantId: participant.id || '',
        participantName: participant.name,
        type: 'video',
        socket: updatedParams.socket,
        roomName: updatedParams.roomName,
        coHostResponsibility: updatedParams.coHostResponsibility,
        showAlert: updatedParams.showAlert,
        coHost: updatedParams.coHost,
        participants: updatedParams.participants,
        member: updatedParams.member,
        islevel: updatedParams.islevel,
      });
    }
  }, [participant, parameters]);

  // Render the crop indicator for self-awareness when forceFullDisplay is enabled
  const renderCropIndicator = useCallback(() => {
    // Only show for user's own video when forceFullDisplay is enabled
    const isOwnVideo = (participant?.name === parameters?.member) || (participant?.id?.includes('youyou'));
    
    if (!isOwnVideo || !forceFullDisplay || !showCropIndicator) {
      return null;
    }

    const hasToggleAction = !!onToggleSelfViewFit;

    const cropIndicatorStyle: React.CSSProperties = {
      position: 'absolute',
      bottom: MediasfuSpacing.sm,
      left: MediasfuSpacing.sm,
      right: MediasfuSpacing.sm,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 3,
    };

    const cropIndicatorInnerStyle: React.CSSProperties = {
      maxWidth: 320,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: `1px solid rgba(245, 158, 11, 0.5)`,
      borderRadius: 10,
    };

    return (
      <div style={cropIndicatorStyle}>
        <div style={cropIndicatorInnerStyle}>
          {/* Warning/crop icon */}
          <FontAwesomeIcon
            icon={faCrop}
            style={{ color: MediasfuColors.warning, fontSize: 14 }}
          />
          {/* Text */}
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 11,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {hasToggleAction 
              ? 'Cropped - others see more.'
              : 'Cropped view - others see more of your video.'}
          </span>
          {/* Action button (if callback provided) */}
          {hasToggleAction && (
            <button
              onClick={() => {
                onToggleSelfViewFit?.();
                setShowCropIndicator(false);
              }}
              style={{
                marginLeft: 4,
                padding: '4px 8px',
                background: MediasfuColors.primary,
                border: 'none',
                borderRadius: 6,
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Full View
            </button>
          )}
          {/* Dismiss button */}
          <button
            onClick={() => setShowCropIndicator(false)}
            style={{
              marginLeft: 2,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FontAwesomeIcon
              icon={faTimes}
              style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
            />
          </button>
        </div>
      </div>
    );
  }, [participant?.name, parameters?.member, forceFullDisplay, showCropIndicator, onToggleSelfViewFit]);

  // Render self-awareness indicator for webinar selfview
  const renderSelfAwarenessIndicator = useCallback(() => {
    // Only show for user's own video in webinar mode (not when forceFullDisplay, since crop indicator handles that)
    const isOwnVideo = (participant?.name === parameters?.member) || (participant?.id?.includes('youyou'));
    const isWebinar = eventType === 'webinar';
    
    // Show for own video in webinar when not cropped (when cropped, use crop indicator instead)
    if (!isOwnVideo || !isWebinar || forceFullDisplay) {
      return null;
    }

    const selfAwarenessStyle: React.CSSProperties = {
      position: 'absolute',
      top: MediasfuSpacing.sm,
      left: MediasfuSpacing.sm,
      right: MediasfuSpacing.sm,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 3,
    };

    const selfAwarenessInnerStyle: React.CSSProperties = {
      maxWidth: 320,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: `1px solid rgba(59, 130, 246, 0.5)`,
      borderRadius: 10,
    };

    return (
      <div style={selfAwarenessStyle}>
        <div style={selfAwarenessInnerStyle}>
          {/* Eye icon for self-awareness */}
          <FontAwesomeIcon
            icon={faVideo}
            style={{ color: MediasfuColors.primary, fontSize: 14 }}
          />
          {/* Text */}
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 11,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Full capture area - this is exactly what others see
          </span>
        </div>
      </div>
    );
  }, [participant?.name, participant?.id, parameters?.member, eventType, forceFullDisplay]);

  // Position styles
  const getPositionStyle = (position: string): React.CSSProperties => {
    const styles: React.CSSProperties = { position: 'absolute' };
    if (position.includes('top')) styles.top = MediasfuSpacing.sm;
    if (position.includes('bottom')) styles.bottom = MediasfuSpacing.sm;
    if (position.includes('Left')) styles.left = MediasfuSpacing.sm;
    if (position.includes('Right')) styles.right = MediasfuSpacing.sm;
    return styles;
  };

  // Container styles - fill parent like original VideoCard
  // Add speaking indicator border when waveform is active
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: `${borderRadius}px`,
    overflow: 'hidden',
    backgroundColor: backgroundColor || (isDarkMode ? '#0F172A' : '#F1F5F9'),
    boxShadow: showWaveform
      ? `0 0 0 2px ${barColor}, 0 0 20px ${barColor}60, ${MediasfuColors.elevation(3, isDarkMode)}`
      : (isHovered && enableGlow
        ? `${MediasfuColors.glowPrimary}, ${MediasfuColors.elevation(3, isDarkMode)}`
        : MediasfuColors.elevation(2, isDarkMode)),
    transform: isMounted
      ? (isHovered ? 'scale(1.01)' : 'scale(1)')
      : 'scale(0.98)',
    opacity: isMounted ? 1 : 0,
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    ...customStyle,
  };

  // Gradient overlay
  const gradientOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
  };

  // Glassmorphic info overlay
  const infoOverlayStyle: React.CSSProperties = {
    ...getPositionStyle(infoPosition),
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.xs}px`,
    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
    background: enableGlassmorphism
      ? MediasfuColors.glassBackground(isDarkMode)
      : 'rgba(0, 0, 0, 0.6)',
    backdropFilter: enableGlassmorphism ? 'blur(10px)' : 'none',
    WebkitBackdropFilter: enableGlassmorphism ? 'blur(10px)' : 'none',
    border: enableGlassmorphism
      ? `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`
      : 'none',
    borderRadius: `${MediasfuBorders.sm}px`,
    zIndex: 2,
  };

  // Name text style
  const nameStyle: React.CSSProperties = {
    ...MediasfuTypography.toStyle(MediasfuTypography.labelSmall),
    color: textColor,
    fontWeight: 600,
    letterSpacing: '0.3px',
  };

  // Waveform styles
  const waveformContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    height: '16px',
    opacity: showWaveform ? 1 : 0,
    transition: `opacity ${MediasfuAnimations.fast}ms`,
  };

  // Controls overlay styles
  const controlsOverlayStyle: React.CSSProperties = {
    ...getPositionStyle(controlsPosition),
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.xs}px`,
    padding: `${MediasfuSpacing.xs}px`,
    background: enableGlassmorphism
      ? MediasfuColors.glassBackground(isDarkMode)
      : 'rgba(0, 0, 0, 0.6)',
    backdropFilter: enableGlassmorphism ? 'blur(8px)' : 'none',
    WebkitBackdropFilter: enableGlassmorphism ? 'blur(8px)' : 'none',
    border: enableGlassmorphism
      ? `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`
      : 'none',
    borderRadius: `${MediasfuBorders.sm}px`,
    opacity: isHovered ? 1 : 0.7,
    transition: `opacity ${MediasfuAnimations.fast}ms`,
    zIndex: 2,
  };

  // Control button style
  const controlButtonStyle = (isActive: boolean): React.CSSProperties => ({
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    background: isActive
      ? MediasfuColors.brandGradient(isDarkMode)
      : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    color: isActive ? '#FFFFFF' : (isDarkMode ? '#FFFFFF' : '#1F2937'),
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  });

  // Status indicator styles
  const statusIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    top: MediasfuSpacing.sm,
    right: MediasfuSpacing.sm,
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: participant?.videoOn ? MediasfuColors.success : MediasfuColors.danger,
    boxShadow: `0 0 8px ${participant?.videoOn ? MediasfuColors.success : MediasfuColors.danger}`,
    zIndex: 2,
  };

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <>
      {/* Inject keyframes for speaking pulse */}
      <style>
        {`
          @keyframes speakingPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.7; }
          }
        `}
      </style>
      <div
        style={containerStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...containerProps}
      >
        {/* Video Display */}
        <CardVideoDisplay
        remoteProducerId={remoteProducerId}
        eventType={eventType}
        forceFullDisplay={forceFullDisplay}
        videoStream={videoStream}
        backgroundColor={backgroundColor || (isDarkMode ? '#0F172A' : '#F1F5F9')}
        doMirror={doMirror}
        {...videoDisplayProps}
      />

      {/* Gradient Overlay */}
      <div style={gradientOverlayStyle} />

      {/* Status Indicator */}
      {showStatusIndicator && <div style={statusIndicatorStyle} />}

      {/* Info Overlay */}
      {showInfo && (
        <div style={infoOverlayStyle} {...infoOverlayProps}>
          {videoInfoComponent || (
            <>
              {/* Pulse indicator when speaking */}
              {showWaveform && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: barColor,
                    animation: 'speakingPulse 1s ease-in-out infinite',
                    marginRight: 6,
                    flexShrink: 0,
                  }}
                />
              )}
              <span style={nameStyle}>{name}</span>
              <div style={waveformContainerStyle} {...waveformContainerProps}>
                {waveformValues.map((value, index) => (
                  <div
                    key={index}
                    className={waveformBarClassName}
                    style={{
                      width: 3,
                      height: `${Math.max(4, value)}px`,
                      backgroundColor: barColor,
                      borderRadius: 2,
                      transition: 'height 50ms linear',
                      ...waveformBarStyle,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Controls Overlay */}
      {showControls && (
        <div style={controlsOverlayStyle} {...controlsOverlayProps}>
          {videoControlsComponent || (
            <>
              <ModernTooltip
                message={participant?.muted ? 'Participant is muted' : 'Mute participant'}
                isDarkMode={isDarkMode}
                position="bottom"
              >
                <button
                  style={controlButtonStyle(!participant?.muted)}
                  onClick={handleToggleAudio}
                  disabled={participant?.muted}
                >
                  <FontAwesomeIcon
                    icon={participant?.muted ? faMicrophoneSlash : faMicrophone}
                    size="sm"
                  />
                </button>
              </ModernTooltip>
              <ModernTooltip
                message={participant?.videoOn ? 'Turn off camera' : 'Camera is off'}
                isDarkMode={isDarkMode}
                position="bottom"
              >
                <button
                  style={controlButtonStyle(participant?.videoOn ?? false)}
                  onClick={handleToggleVideo}
                  disabled={!participant?.videoOn}
                >
                  <FontAwesomeIcon
                    icon={participant?.videoOn ? faVideo : faVideoSlash}
                    size="sm"
                  />
                </button>
              </ModernTooltip>
            </>
          )}
        </div>
      )}

      {/* Force Full Display Crop Indicator */}
      {renderCropIndicator()}

      {/* Webinar Self-Awareness Indicator */}
      {renderSelfAwarenessIndicator()}

      {/* Extra Widgets */}
      {extraWidgets}

      {/* Children */}
      {children}
      </div>
    </>
  );
};

export default ModernVideoCard;
