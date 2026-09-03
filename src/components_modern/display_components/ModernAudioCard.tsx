/**
 * Modern audio card with glassmorphic overlays and animated waveform.
 *
 * A premium-styled audio card that displays participant information with
 * animated audio levels, glassmorphic controls, and smooth hover effects.
 * Features a centered circular avatar area with theme-aware background.
 *
 * @example
 * ```tsx
 * <ModernAudioCard
 *   name="John Doe"
 *   participant={participant}
 *   parameters={parameters}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';
import { AudioCardOptions } from '../../components/displayComponents/AudioCard';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import type { LiveSubtitle } from '../../producers/socketReceiveMethods/translationReceiveMethods';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { stageCardPropsEqual } from './stageCardMemo';
import { SpeakingWaveform } from './SpeakingWaveform';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { ModernTooltip } from '../core/widgets/ModernTooltip';
import { ModernMiniCard } from './ModernMiniCard';
import { SubtitleOverlay } from './SubtitleOverlay';

export interface ModernAudioCardOptions extends AudioCardOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Border radius for the card */
  borderRadius?: number;
  /** Optional card size (width/height). If omitted, card fills parent container */
  size?: number;
  /** Live subtitle for displaying translated speech - can be static value or getter function */
  liveSubtitle?: LiveSubtitle | null | (() => LiveSubtitle | null);
  /** Whether to show subtitles on this card */
  showSubtitles?: boolean;
}

export type ModernAudioCardType = (options: ModernAudioCardOptions) => React.JSX.Element;

/**
 * ModernAudioCard displays participant audio with premium glassmorphic styling.
 */
const ModernAudioCardComponent: React.FC<ModernAudioCardOptions> = ({
  controlUserMedia,
  customStyle,
  name,
  barColor = MediasfuColors.primary,
  textColor = '#FFFFFF',
  imageSource,
  // roundedImage is inherited but not used - ModernMiniCard always uses circular
  showControls = true,
  showInfo = true,
  videoInfoComponent,
  videoControlsComponent,
  controlsPosition = 'topLeft',
  infoPosition = 'bottomLeft',
  participant,
  backgroundColor,
  audioDecibels,
  parameters,
  cardProps,
  infoOverlayProps,
  waveformContainerProps,
  waveformBarStyle,
  waveformBarCount = 5,
  controlsOverlayProps,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  borderRadius = MediasfuBorders.md,
  size,
  liveSubtitle: liveSubtitleProp,
  showSubtitles = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);
  
  // Suppress unused variable warnings - these are kept for backwards compatibility
  void liveSubtitleProp;
  void showSubtitles;

  // Mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Audio level polling - like the original AudioCard
  // Polls getUpdatedAllParams every second to check for active audio
  // Falls back to audioDecibels prop if parameters not available
  useEffect(() => {
    const interval = setInterval(() => {
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
          (entry: { name: string; averageLoudness: number }) => entry.name === name
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedParticipant = participants?.find(
          (p: any) => p.name === name
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
      }
    }, 1000);

    return () => clearInterval(interval);
    // `showWaveform` is deliberately absent: including it rebuilt the interval
    // every time the participant started or stopped talking.
  }, [parameters, name, audioDecibels, participant?.muted]);


  // Media control handlers
  const handleToggleAudio = useCallback(async () => {
    if (!participant?.muted && controlUserMedia) {
      let updatedParams = parameters;
      try {
        updatedParams = parameters.getCurrentParams?.() ?? parameters;
      } catch {
        // Fall back to the already-held snapshot without publishing.
      }
      await controlUserMedia({
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
  }, [participant, parameters, controlUserMedia]);

  const handleToggleVideo = useCallback(async () => {
    if (participant?.videoOn && controlUserMedia) {
      let updatedParams = parameters;
      try {
        updatedParams = parameters.getCurrentParams?.() ?? parameters;
      } catch {
        // Fall back to the already-held snapshot without publishing.
      }
      await controlUserMedia({
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
  }, [participant, parameters, controlUserMedia]);

  // Generate gradient for initials background
  const initialsGradient = useMemo(() => {
    // Create a consistent gradient based on name hash
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const gradients = [
      MediasfuColors.brandGradient(isDarkMode),
      MediasfuColors.accentGradient(isDarkMode),
      MediasfuColors.oceanGradient(isDarkMode),
      MediasfuColors.auroraGradient(isDarkMode),
    ];
    return gradients[Math.abs(hash) % gradients.length];
  }, [name, isDarkMode]);

  // Calculate avatar size - 150px like Flutter or responsive
  const avatarSize = useMemo(() => {
    if (size) return Math.min(150, size * 0.6);
    return 150;
  }, [size]);

  // Position styles
  const getPositionStyle = (position: string): React.CSSProperties => {
    const styles: React.CSSProperties = { position: 'absolute' };
    if (position.includes('top')) styles.top = MediasfuSpacing.xs;
    if (position.includes('bottom')) styles.bottom = MediasfuSpacing.xs;
    if (position.includes('Left')) styles.left = MediasfuSpacing.xs;
    if (position.includes('Right')) styles.right = MediasfuSpacing.xs;
    return styles;
  };

  // Container styles - fill parent with theme-aware gradient background
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: `${borderRadius}px`,
    overflow: 'hidden',
    background: backgroundColor || (isDarkMode 
      ? 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)'
      : 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 50%, #DEE2E6 100%)'),
    boxShadow: showWaveform
      ? `0 0 0 2.5px ${MediasfuColors.success}, ${MediasfuColors.elevation(2, isDarkMode)}`
      : MediasfuColors.elevation(2, isDarkMode),
    transform: isMounted
      ? (isHovered ? 'scale(1.02)' : 'scale(1)')
      : 'scale(0.95)',
    opacity: isMounted ? 1 : 0,
    transition: MediasfuAnimations.transitionInteractive(MediasfuAnimations.normal, MediasfuAnimations.smooth),
    ...customStyle,
  };

  // Centered avatar container - like Flutter's Positioned.fill with Center
  const avatarContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Circular avatar wrapper - like Flutter's 150x150 circle
  // Uses aspect-ratio to guarantee perfect circle
  const avatarWrapperStyle: React.CSSProperties = {
    width: `${avatarSize}px`,
    height: `${avatarSize}px`,
    aspectRatio: '1 / 1',
    borderRadius: '50%',
    background: initialsGradient,
    padding: '3px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.10)',
    transform: showWaveform ? 'scale(1.02)' : 'scale(1)',
    transition: `transform ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    animation: 'none',
  };

  // Waveform ring - bars radiating outward around avatar (like Flutter)
  const waveformRingContainerStyle: React.CSSProperties = {
    position: 'absolute',
    width: '190px',
    height: '190px',
    display: showWaveform ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Waveform ring bars positioned in a circle.
  //
  // Placement and motion are split across two elements on purpose: the outer
  // div owns the static rotate/translate that puts the bar on the ring, and the
  // inner one owns the scaleY keyframe. That keeps the animation to `transform`
  // on a single element — the previous version animated `height`, which forces
  // layout for all nine bars on every tick.
  const waveformRingBars = useMemo(() => {
    const bars = [];
    const numBars = 9;
    for (let i = 0; i < numBars; i++) {
      bars.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '28px',
            transform: `rotate(${i * 40}deg) translateY(-90px)`,
            transformOrigin: 'center',
          }}
        >
          <div
            className="mediasfu-speaking-bar"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: barColor,
              borderRadius: '2px',
              animation: `speakingBar ${520 + ((i * 70) % 260)}ms ease-in-out ${(i * 90) % 360}ms infinite`,
            }}
          />
        </div>
      );
    }
    return bars;
  }, [barColor]);

  // Glass overlay
  const glassOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  };

  // Info overlay styles
  const infoOverlayStyle: React.CSSProperties = {
    ...getPositionStyle(infoPosition),
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.xs}px`,
    padding: `2px 6px`,
    background: 'transparent',
    borderRadius: `${MediasfuBorders.xs}px`,
    zIndex: 2,
    maxWidth: size ? size - MediasfuSpacing.sm * 2 : 'calc(100% - 16px)',
  };

  // Name text style
  const nameStyle: React.CSSProperties = {
    ...MediasfuTypography.toStyle(MediasfuTypography.labelSmall),
    fontSize: MediasfuTypography.sizeBodySmall,
    color: textColor,
    fontWeight: 600,
    textShadow: '0 1px 4px rgba(0,0,0,0.7)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  // Waveform styles
  // Controls overlay styles
  const controlsOverlayStyle: React.CSSProperties = {
    ...getPositionStyle(controlsPosition),
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
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
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
    background: 'rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    color: isActive ? MediasfuColors.success : MediasfuColors.danger,
    transition: MediasfuAnimations.transitionInteractive(MediasfuAnimations.fast, MediasfuAnimations.smooth),
    fontSize: MediasfuTypography.sizeBodySmall,
  });

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <>
      {/* Inject keyframes */}
      <style>
        {`
          @keyframes avatarPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          @keyframes speakingPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
        `}
      </style>
      <div
        style={containerStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...cardProps}
      >
        {/* Centered Avatar using ModernMiniCard - like Flutter */}
        <div style={avatarContainerStyle}>
          {/* Waveform ring - bars radiating around avatar when speaking */}
          {showWaveform && (
            <div style={waveformRingContainerStyle}>
              {waveformRingBars}
            </div>
          )}
          <div style={avatarWrapperStyle}>
            <ModernMiniCard
              initials={name}
              imageSource={imageSource}
              fontSize={28}
              isDarkMode={isDarkMode}
              roundedImage={true}
              showGradientBackground={true}
            />
          </div>
        </div>

        {/* Glass overlay */}
        <div style={glassOverlayStyle} />

        {/* Info Overlay */}
        {showInfo && (
          <div style={infoOverlayStyle} {...infoOverlayProps}>
            {videoInfoComponent || (
              <>
                {/* Pulse indicator when speaking */}
                {showWaveform && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: MediasfuColors.success,
                      marginRight: 4,
                      flexShrink: 0,
                    }}
                  />
                )}
                <span style={nameStyle}>{name}</span>
                <SpeakingWaveform
                  active={showWaveform}
                  barColor={barColor}
                  barCount={waveformBarCount}
                  height={14}
                  barStyle={waveformBarStyle}
                  containerProps={waveformContainerProps}
                />
              </>
            )}
          </div>
        )}

        {/* Live Subtitle Overlay - uses context for reactive updates without card re-render */}
        <SubtitleOverlay
          speakerId={participant?.id || ''}
          speakerName={participant?.name || name || ''}
          enableGlassmorphism={enableGlassmorphism}
        />

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
                  >
                    <FontAwesomeIcon
                      icon={participant?.muted ? faMicrophoneSlash : faMicrophone}
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
                  >
                    <FontAwesomeIcon
                      icon={participant?.videoOn ? faVideo : faVideoSlash}
                    />
                  </button>
                </ModernTooltip>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

/**
 * Renders once per audio-only participant, so it carries the same
 * re-render cost as the video card.
 */
export const ModernAudioCard = React.memo(ModernAudioCardComponent, stageCardPropsEqual);

ModernAudioCard.displayName = 'ModernAudioCard';

export default ModernAudioCard;
