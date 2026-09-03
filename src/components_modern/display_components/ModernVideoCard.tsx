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

import React, { useState, useEffect, useCallback } from 'react';
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
import type { LiveSubtitle } from '../../producers/socketReceiveMethods/translationReceiveMethods';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { ModernTooltip } from '../core/widgets/ModernTooltip';
import { SubtitleOverlay } from './SubtitleOverlay';
import { SpeakingWaveform } from './SpeakingWaveform';

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
  /** Live subtitle for displaying translated speech - can be static value or getter function */
  liveSubtitle?: LiveSubtitle | null | (() => LiveSubtitle | null);
  /** Whether to show subtitles on this card */
  showSubtitles?: boolean;
}

export type ModernVideoCardType = (options: ModernVideoCardOptions) => React.JSX.Element;

/**
 * ModernVideoCard displays participant video with premium glassmorphic styling.
 */
const ModernVideoCardComponent: React.FC<ModernVideoCardOptions> = ({
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
  borderRadius = MediasfuBorders.md,
  showStatusIndicator = true,
  onToggleSelfViewFit,
  liveSubtitle: liveSubtitleProp,
  showSubtitles = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);
  const [showCropIndicator, setShowCropIndicator] = useState(true);
  
  // Suppress unused variable warnings - these are kept for backwards compatibility
  void liveSubtitleProp;
  void showSubtitles;

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
      {
      // A read, not an update: `getUpdatedAllParams()` republishes the bag to
      // every consumer, and doing that once a second per card is a re-render
      // storm for data nobody asked to be pushed. `getCurrentParams()` is the
      // pure equivalent on the same bag.
      const readParams = () => {
        if (typeof parameters?.getCurrentParams === 'function') {
          try {
            const current = parameters.getCurrentParams();
            if (current && typeof current === 'object') return current;
          } catch {
            // Fall through.
          }
        }
        return parameters;
      };
        const latestParams = readParams();
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
          setShowWaveform(true);
        } else {
          setShowWaveform(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
    // `showWaveform` is deliberately absent: including it tore down and
    // recreated the interval every time the participant started or stopped
    // talking. The setter is idempotent, so reading a stale value is safe.
  }, [parameters, participant, audioDecibels]);


  // Media control handlers
  const handleToggleAudio = useCallback(async () => {
    if (!participant?.muted) {
      let updatedParams = parameters;
      try {
        updatedParams = parameters.getCurrentParams?.() ?? parameters;
      } catch {
        // Fall back to the already-held snapshot without publishing.
      }
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
      let updatedParams = parameters;
      try {
        updatedParams = parameters.getCurrentParams?.() ?? parameters;
      } catch {
        // Fall back to the already-held snapshot without publishing.
      }
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
            style={{ color: MediasfuColors.warning, fontSize: MediasfuTypography.sizeBodyMedium }}
          />
          {/* Text */}
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: MediasfuTypography.sizeCaption,
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
                fontSize: MediasfuTypography.sizeMicro,
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
              style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: MediasfuTypography.sizeBodySmall }}
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
            style={{ color: MediasfuColors.primary, fontSize: MediasfuTypography.sizeBodyMedium }}
          />
          {/* Text */}
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: MediasfuTypography.sizeCaption,
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
      ? `0 0 0 2.5px ${MediasfuColors.success}, ${MediasfuColors.elevation(2, isDarkMode)}`
      : MediasfuColors.elevation(2, isDarkMode),
    transform: isMounted
      ? (isHovered ? 'scale(1.01)' : 'scale(1)')
      : 'scale(0.98)',
    opacity: isMounted ? 1 : 0,
    // Explicitly transform/opacity/box-shadow — never `all`. This container
    // holds a live <video>; `all` animated width and height on every layout
    // change, forcing layout each frame around the video surface.
    transition: `transform ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}, opacity ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}, box-shadow ${MediasfuAnimations.fast}ms ${MediasfuAnimations.easeOut}`,
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
    background: 'transparent',
    zIndex: 2,
  };

  // Name text style
  const nameStyle: React.CSSProperties = {
    ...MediasfuTypography.toStyle(MediasfuTypography.labelSmall),
    color: textColor,
    fontWeight: 600,
    letterSpacing: '0.3px',
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.7)',
    fontSize: MediasfuTypography.sizeBodySmall,
  };

  // Waveform styles
  // Controls overlay styles
  const controlsOverlayStyle: React.CSSProperties = {
    ...getPositionStyle(controlsPosition),
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.xs}px`,
    padding: `${MediasfuSpacing.xs}px`,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    border: `1px solid rgba(255, 255, 255, 0.08)`,
    borderRadius: '6px',
    opacity: isHovered ? 1 : 0,
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
    borderRadius: '6px',
    border: `1px solid rgba(255, 255, 255, 0.08)`,
    cursor: 'pointer',
    background: 'rgba(0, 0, 0, 0.55)',
    color: isActive ? MediasfuColors.success : MediasfuColors.danger,
    transition: MediasfuAnimations.transitionInteractive(MediasfuAnimations.fast, MediasfuAnimations.smooth),
    fontSize: MediasfuTypography.sizeBodyMedium,
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
                    backgroundColor: MediasfuColors.success,
                    marginRight: 6,
                    flexShrink: 0,
                  }}
                />
              )}
              <span style={nameStyle}>{name}</span>
              <SpeakingWaveform
                active={showWaveform}
                barColor={barColor}
                barStyle={waveformBarStyle}
                barClassName={waveformBarClassName}
                containerProps={waveformContainerProps}
              />
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

      {/* Live Subtitle Overlay - uses context for reactive updates without card re-render */}
      <SubtitleOverlay
        speakerId={participant?.id || ''}
        speakerName={participant?.name || name || ''}
        enableGlassmorphism={enableGlassmorphism}
      />

      {/* Extra Widgets */}
      {extraWidgets}

      {/* Children */}
      {children}
      </div>
    </>
  );
};

/**
 * Loudness for one participant, or undefined when there is no entry.
 *
 * The `audioDecibels` array is rebuilt upstream on every tick, so comparing it
 * by identity would re-render every tile once a second. Only this card's own
 * entry can change what it draws.
 */
const loudnessFor = (
  entries: ModernVideoCardOptions['audioDecibels'],
  name: string | undefined,
): number | undefined => {
  if (!entries || !name) return undefined;
  return entries.find((entry) => entry.name === name)?.averageLoudness;
};

/**
 * Props that change what the card paints.
 *
 * `parameters` is excluded on purpose: it is a live getter bag whose identity
 * changes constantly by design, and every read inside the card goes through
 * `getCurrentParams()`, which returns fresh state even
 * from a closure captured several renders ago. Comparing it would defeat
 * memoisation entirely while buying nothing.
 */
const arePropsEqual = (
  prev: Readonly<ModernVideoCardOptions>,
  next: Readonly<ModernVideoCardOptions>,
): boolean => {
  if (
    prev.name !== next.name ||
    prev.remoteProducerId !== next.remoteProducerId ||
    prev.videoStream !== next.videoStream ||
    prev.eventType !== next.eventType ||
    prev.forceFullDisplay !== next.forceFullDisplay ||
    prev.doMirror !== next.doMirror ||
    prev.barColor !== next.barColor ||
    prev.textColor !== next.textColor ||
    prev.backgroundColor !== next.backgroundColor ||
    prev.showControls !== next.showControls ||
    prev.showInfo !== next.showInfo ||
    prev.controlsPosition !== next.controlsPosition ||
    prev.infoPosition !== next.infoPosition ||
    prev.isDarkMode !== next.isDarkMode ||
    prev.enableGlassmorphism !== next.enableGlassmorphism ||
    prev.enableGlow !== next.enableGlow ||
    prev.borderRadius !== next.borderRadius ||
    prev.showStatusIndicator !== next.showStatusIndicator ||
    prev.showSubtitles !== next.showSubtitles
  ) {
    return false;
  }

  // Only the fields the card actually reads off the participant.
  const a = prev.participant;
  const b = next.participant;
  if (a !== b) {
    if (!a || !b) return false;
    if (
      a.id !== b.id ||
      a.name !== b.name ||
      a.muted !== b.muted ||
      a.videoOn !== b.videoOn
    ) {
      return false;
    }
  }

  if (
    loudnessFor(prev.audioDecibels, prev.participant?.name) !==
    loudnessFor(next.audioDecibels, next.participant?.name)
  ) {
    return false;
  }

  // Slots and escape hatches: identity is the only safe test. A caller passing
  // inline JSX here opts that card out of memoisation, which is correct.
  return (
    prev.customStyle === next.customStyle &&
    prev.videoInfoComponent === next.videoInfoComponent &&
    prev.videoControlsComponent === next.videoControlsComponent &&
    prev.extraWidgets === next.extraWidgets &&
    prev.children === next.children &&
    prev.containerProps === next.containerProps &&
    prev.infoOverlayProps === next.infoOverlayProps &&
    prev.controlsOverlayProps === next.controlsOverlayProps &&
    prev.waveformContainerProps === next.waveformContainerProps &&
    prev.waveformBarStyle === next.waveformBarStyle &&
    prev.videoDisplayProps === next.videoDisplayProps &&
    prev.onToggleSelfViewFit === next.onToggleSelfViewFit &&
    prev.liveSubtitle === next.liveSubtitle
  );
};

/**
 * One instance renders per participant, so this is the most-instanced component
 * on the stage. Without memoisation any state change in the meeting shell
 * re-rendered every tile and rebuilt every style object inside it.
 */
export const ModernVideoCard = React.memo(
  ModernVideoCardComponent,
  arePropsEqual,
);

ModernVideoCard.displayName = 'ModernVideoCard';

export default ModernVideoCard;
