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

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';
import { AudioCardOptions } from '../../components/displayComponents/AudioCard';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { ModernTooltip } from '../core/widgets/ModernTooltip';
import { ModernMiniCard } from './ModernMiniCard';

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
}

export type ModernAudioCardType = (options: ModernAudioCardOptions) => React.JSX.Element;

/**
 * ModernAudioCard displays participant audio with premium glassmorphic styling.
 */
export const ModernAudioCard: React.FC<ModernAudioCardOptions> = ({
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
  enableGlow = true,
  borderRadius = MediasfuBorders.md,
  size,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);
  const [waveformValues, setWaveformValues] = useState<number[]>(Array(waveformBarCount).fill(0));
  const animationRef = useRef<number | null>(null);

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
      if (parameters?.getUpdatedAllParams) {
        const latestParams = parameters.getUpdatedAllParams();
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
      } else if (audioDecibels) {
        // Fallback to audioDecibels prop
        const averageLoudness = audioDecibels.averageLoudness ?? 0;
        const shouldShow = averageLoudness > 127.5 && !participant?.muted;
        setShowWaveform(shouldShow);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [parameters, name, showWaveform, audioDecibels, participant?.muted]);

  // Waveform bar animation when showWaveform is active
  useEffect(() => {
    if (showWaveform) {
      // Use setInterval instead of requestAnimationFrame for controlled timing
      // This gives the bars time to animate smoothly between values
      const interval = setInterval(() => {
        setWaveformValues((prev) =>
          prev.map(() => Math.random() * 22 + 2) // Range: 2px to 24px
        );
      }, 150); // Update every 150ms for bouncy effect
      
      return () => clearInterval(interval);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setWaveformValues(Array(waveformBarCount).fill(3));
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showWaveform, waveformBarCount]);

  // Media control handlers
  const handleToggleAudio = useCallback(async () => {
    if (!participant?.muted && controlUserMedia) {
      const updatedParams = parameters.getUpdatedAllParams();
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
      const updatedParams = parameters.getUpdatedAllParams();
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
    boxShadow: isHovered && enableGlow
      ? `0 0 24px ${MediasfuColors.primary}40, ${MediasfuColors.elevation(3, isDarkMode)}`
      : MediasfuColors.elevation(2, isDarkMode),
    transform: isMounted
      ? (isHovered ? 'scale(1.02)' : 'scale(1)')
      : 'scale(0.95)',
    opacity: isMounted ? 1 : 0,
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
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
    boxShadow: showWaveform
      ? `0 0 30px ${barColor}80, 0 0 60px ${barColor}40`
      : `0 0 10px ${MediasfuColors.primary}20`,
    transform: showWaveform ? 'scale(1.02)' : 'scale(1)',
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    animation: showWaveform ? 'avatarPulse 2s ease-in-out infinite' : 'none',
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

  // Generate waveform ring bars positioned in a circle
  const waveformRingBars = useMemo(() => {
    const bars = [];
    const numBars = 9;
    for (let i = 0; i < numBars; i++) {
      const height = waveformValues[i % waveformValues.length] || 8;
      bars.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: `${Math.max(8, Math.min(28, height))}px`,
            backgroundColor: barColor,
            borderRadius: '2px',
            boxShadow: `0 0 4px ${barColor}80`,
            transform: `rotate(${i * 40}deg) translateY(-90px)`,
            transformOrigin: 'center',
            transition: 'height 100ms linear',
          }}
        />
      );
    }
    return bars;
  }, [waveformValues, barColor]);

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
    background: enableGlassmorphism
      ? 'rgba(0, 0, 0, 0.5)'
      : 'rgba(0, 0, 0, 0.7)',
    backdropFilter: enableGlassmorphism ? 'blur(8px)' : 'none',
    WebkitBackdropFilter: enableGlassmorphism ? 'blur(8px)' : 'none',
    borderRadius: `${MediasfuBorders.xs}px`,
    zIndex: 2,
    maxWidth: size ? size - MediasfuSpacing.sm * 2 : 'calc(100% - 16px)',
  };

  // Name text style
  const nameStyle: React.CSSProperties = {
    ...MediasfuTypography.toStyle(MediasfuTypography.labelSmall),
    fontSize: 12,
    color: textColor,
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  // Waveform styles
  const waveformContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1px',
    height: 14,
    opacity: showWaveform ? 1 : 0,
    transition: `opacity ${MediasfuAnimations.fast}ms`,
  };

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
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    background: enableGlassmorphism
      ? 'rgba(0, 0, 0, 0.5)'
      : 'rgba(0, 0, 0, 0.7)',
    backdropFilter: enableGlassmorphism ? 'blur(8px)' : 'none',
    WebkitBackdropFilter: enableGlassmorphism ? 'blur(8px)' : 'none',
    color: isActive ? MediasfuColors.success : MediasfuColors.danger,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    fontSize: 12,
  });

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <>
      {/* Inject keyframes */}
      <style>
        {`
          @keyframes avatarPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 30px ${MediasfuColors.primary}80, 0 0 60px ${MediasfuColors.primary}40; }
            50% { transform: scale(1.05); box-shadow: 0 0 40px ${MediasfuColors.primary}99, 0 0 80px ${MediasfuColors.primary}60; }
          }
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
                      style={{
                        width: 3,
                        height: showWaveform ? `${Math.max(2, Math.min(24, value))}px` : '3px',
                        backgroundColor: barColor,
                        borderRadius: 2,
                        transition: 'height 120ms cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy spring effect
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

export default ModernAudioCard;
