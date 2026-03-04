/**
 * SubtitleOverlay - A lightweight component that reactively displays subtitles.
 * 
 * This component subscribes to the LiveSubtitleContext and only re-renders
 * when the specific speaker's subtitle changes, avoiding full card re-renders.
 */

import React from 'react';
import { useLiveSubtitles } from '../../contexts/LiveSubtitleContext';
import { isSubtitleExpired } from '../../producers/socketReceiveMethods/translationReceiveMethods';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';

export interface SubtitleOverlayProps {
  /** Speaker's ID for subtitle lookup */
  speakerId: string;
  /** Speaker's name for fallback subtitle lookup */
  speakerName: string;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
}

/**
 * Renders a subtitle overlay for a specific speaker.
 * Uses context to reactively update when subtitles change without
 * causing the parent card to re-render.
 */
export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  speakerId,
  speakerName,
  enableGlassmorphism = true,
}) => {
  const subtitleContext = useLiveSubtitles();
  
  // If no context or subtitles disabled, render nothing
  if (!subtitleContext || !subtitleContext.showSubtitlesOnCards) {
    return null;
  }
  
  // Look up subtitle for this speaker
  const subtitle = subtitleContext.getSubtitleForSpeaker(speakerId, speakerName);
  
  // If no subtitle or expired, render nothing
  if (!subtitle || isSubtitleExpired(subtitle)) {
    return null;
  }
  
  return (
    <div
      style={{
        position: 'absolute',
        bottom: MediasfuSpacing.md,
        left: MediasfuSpacing.sm,
        right: MediasfuSpacing.sm,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 3,
      }}
    >
      <div
        style={{
          maxWidth: '90%',
          padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
          background: enableGlassmorphism
            ? 'rgba(0, 0, 0, 0.6)'
            : 'rgba(0, 0, 0, 0.75)',
          backdropFilter: enableGlassmorphism ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: enableGlassmorphism ? 'blur(10px)' : 'none',
          border: enableGlassmorphism
            ? '1px solid rgba(255, 255, 255, 0.15)'
            : 'none',
          borderRadius: MediasfuBorders.sm,
        }}
      >
        <span
          style={{
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 500,
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {subtitle.text}
        </span>
      </div>
    </div>
  );
};

export default SubtitleOverlay;
