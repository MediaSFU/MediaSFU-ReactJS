/**
 * Context for providing live subtitles to video/audio cards.
 * 
 * This allows cards to reactively access subtitle data without
 * needing to re-render the entire grid when subtitles change.
 */

import React, { createContext, useContext, useMemo } from 'react';
import type { LiveSubtitle } from '../producers/socketReceiveMethods/translationReceiveMethods';

export interface LiveSubtitleContextValue {
  /** Map of speakerId/speakerName to LiveSubtitle */
  liveSubtitles: Map<string, LiveSubtitle>;
  /** Whether to show subtitles on cards */
  showSubtitlesOnCards: boolean;
  /** Helper to get subtitle for a speaker by id or name */
  getSubtitleForSpeaker: (speakerId: string, speakerName: string) => LiveSubtitle | null;
}

const LiveSubtitleContext = createContext<LiveSubtitleContextValue | null>(null);

export interface LiveSubtitleProviderProps {
  liveSubtitles: Map<string, LiveSubtitle>;
  showSubtitlesOnCards: boolean;
  children: React.ReactNode;
}

export const LiveSubtitleProvider: React.FC<LiveSubtitleProviderProps> = ({
  liveSubtitles,
  showSubtitlesOnCards,
  children,
}) => {
  const getSubtitleForSpeaker = useMemo(() => {
    return (speakerId: string, speakerName: string): LiveSubtitle | null => {
      // Try by speakerId first
      if (speakerId && liveSubtitles.has(speakerId)) {
        return liveSubtitles.get(speakerId) || null;
      }
      // Fall back to speakerName
      if (speakerName && liveSubtitles.has(speakerName)) {
        return liveSubtitles.get(speakerName) || null;
      }
      return null;
    };
  }, [liveSubtitles]);

  const value = useMemo<LiveSubtitleContextValue>(() => ({
    liveSubtitles,
    showSubtitlesOnCards,
    getSubtitleForSpeaker,
  }), [liveSubtitles, showSubtitlesOnCards, getSubtitleForSpeaker]);

  return (
    <LiveSubtitleContext.Provider value={value}>
      {children}
    </LiveSubtitleContext.Provider>
  );
};

/**
 * Hook to access live subtitle context.
 * Returns null if used outside of LiveSubtitleProvider.
 */
export const useLiveSubtitles = (): LiveSubtitleContextValue | null => {
  return useContext(LiveSubtitleContext);
};

/**
 * Hook to get subtitle for a specific speaker.
 * Returns null if no subtitle exists or context is unavailable.
 */
export const useSpeakerSubtitle = (speakerId: string, speakerName: string): LiveSubtitle | null => {
  const context = useContext(LiveSubtitleContext);
  if (!context) return null;
  return context.getSubtitleForSpeaker(speakerId, speakerName);
};

/**
 * Hook to check if subtitles should be shown.
 */
export const useShowSubtitles = (): boolean => {
  const context = useContext(LiveSubtitleContext);
  return context?.showSubtitlesOnCards ?? false;
};

export default LiveSubtitleContext;
