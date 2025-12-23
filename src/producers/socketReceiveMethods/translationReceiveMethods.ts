/**
 * Handler for translation-related socket events.
 * 
 * Listens for:
 * - translation:roomConfig - Room-level translation configuration
 * - translation:configUpdated - Host updated room config
 * - translation:languageSet - Confirmation of spoken language set
 * - translation:subscribed - Confirmation of translation subscription
 * - translation:unsubscribed - Confirmation of translation unsubscription
 * - translation:producerReady - Translation producer is available for consumption
 * - translation:producerClosed - Translation producer was closed
 * - translation:channelsAvailable - Channels available from a speaker
 * - translation:memberState - Another member's translation state
 * - translation:error - Translation operation error
 */

import { ShowAlert } from '../../@types/types';
import { getLanguageName } from '../../utils/translationLanguages';

// ============================================================================
// Types
// ============================================================================

export type LanguageMode = 'allowlist' | 'blocklist' | 'any';

/**
 * Voice config for per-language credential/param overrides
 */
export interface TranslationVoiceConfig {
  sttNickName?: string;
  llmNickName?: string;
  ttsNickName?: string;
  sttParams?: Record<string, string | number | boolean>;
  llmParams?: Record<string, string | number | boolean>;
  ttsParams?: Record<string, string | number | boolean>;
}

/**
 * Language entry with optional per-language voice config
 */
export interface LanguageEntry {
  code: string;
  nickname?: string;
  voiceConfig?: TranslationVoiceConfig;
}

export interface TranslationRoomConfig {
  supportTranslation: boolean;
  
  // Spoken language mode-based filtering
  spokenLanguageMode: LanguageMode;
  allowedSpokenLanguages?: LanguageEntry[];
  blockedSpokenLanguages?: string[];
  
  // Listen language mode-based filtering
  listenLanguageMode: LanguageMode;
  allowedListenLanguages?: LanguageEntry[];
  blockedListenLanguages?: string[];
  
  // Advanced options
  maxActiveChannelsPerSpeaker: number;
  autoDetectSpokenLanguage: boolean;
  
  // Permission controls
  allowSpokenLanguageChange?: boolean;
  allowListenLanguageChange?: boolean;
  
  // Global fallback voice config
  translationVoiceConfig?: TranslationVoiceConfig | null;
  
  // Provider groups for language-based TTS/STT routing
  providerGroups?: {
    groupA?: {
      languages: string[];
      sttNickName?: string;
      llmNickName?: string;
      ttsNickName?: string;
    };
    groupB?: {
      languages: string[];
      sttNickName?: string;
      llmNickName?: string;
      ttsNickName?: string;
    };
    default?: {
      sttNickName?: string;
      llmNickName?: string;
      ttsNickName?: string;
    };
  } | null;
}

export interface TranslationRoomConfigData {
  config: TranslationRoomConfig;
}

export interface TranslationConfigUpdatedData {
  config: TranslationRoomConfig;
}

export interface TranslationLanguageSetData {
  success: boolean;
  language: string;
  enabled: boolean;
  error?: string;
}

export interface TranslationSubscribedData {
  speakerId: string;
  speakerName?: string;
  language: string;
  channelCreated: boolean;
  producerId?: string;
  originalProducerId?: string;
}

export interface TranslationUnsubscribedData {
  speakerId: string;
  language: string;
  channelClosed: boolean;
}

export interface TranslationProducerReadyData {
  speakerId: string;
  speakerName?: string;
  language: string;
  producerId: string;
  originalProducerId: string;
}

export interface TranslationProducerClosedData {
  speakerId: string;
  language: string;
  producerId: string;
  reason?: string;
}

export interface TranslationChannelsAvailableData {
  speakerId: string;
  speakerName?: string;
  languages: string[];
  originalProducerId: string;
}

export interface TranslationMemberStateData {
  memberId: string;
  memberName?: string;
  state: {
    speaking?: {
      enabled: boolean;
      inputLanguage: string;
      originalProducerId: string;
    };
    listening?: {
      [speakerId: string]: {
        language: string;
        producerId: string | null;
      };
    };
  };
}

export interface TranslationErrorData {
  error: string;
  code?: string;
  details?: unknown;
  /** Available channels when max_channels error occurs */
  availableChannels?: string[];
  /** Maximum channels allowed for a speaker */
  maxChannels?: number;
  /** User-friendly message from backend */
  message?: string;
}

/**
 * Data received when a speaker changes their output language.
 * This is automatic - consumers don't choose, the speaker decides.
 * When outputLanguage is set, consumers should:
 * 1. Pause their consumer of the speaker's original audio
 * 2. Wait for translation producer to arrive via new-pipe-producer
 * 3. Consume the translation producer instead
 */
export interface TranslationSpeakerOutputChangedData {
  speakerId: string;
  speakerName: string;
  inputLanguage: string;
  outputLanguage: string | null; // null = no translation, original audio
  originalProducerId: string;
  enabled: boolean;
}

// ============================================================================
// Option Interfaces
// ============================================================================

export interface TranslationRoomConfigOptions {
  data: TranslationRoomConfigData;
  updateTranslationConfig?: (config: TranslationRoomConfig) => void;
  updateTranslationSupported?: (supported: boolean) => void;
}

export interface TranslationConfigUpdatedOptions {
  data: TranslationConfigUpdatedData;
  updateTranslationConfig?: (config: TranslationRoomConfig) => void;
  showAlert?: ShowAlert;
}

export interface TranslationLanguageSetOptions {
  data: TranslationLanguageSetData;
  updateMySpokenLanguage?: (lang: string) => void;
  updateMySpokenLanguageEnabled?: (enabled: boolean) => void;
  showAlert?: ShowAlert;
}

export interface TranslationSubscribedOptions {
  data: TranslationSubscribedData;
  updateListenPreferences?: (updater: (prev: Map<string, string>) => Map<string, string>) => void;
  updateTranslationProducerMap?: (updater: (prev: TranslationProducerMap) => TranslationProducerMap) => void;
  // Trigger consumption of the translation producer
  startConsumingTranslation?: (producerId: string, speakerId: string, language: string) => Promise<void>;
  showAlert?: ShowAlert;
}

export interface TranslationUnsubscribedOptions {
  data: TranslationUnsubscribedData;
  updateListenPreferences?: (updater: (prev: Map<string, string>) => Map<string, string>) => void;
  // Stop consuming the translation producer
  stopConsumingTranslation?: (speakerId: string, language: string) => Promise<void>;
}

export interface TranslationProducerReadyOptions {
  data: TranslationProducerReadyData;
  updateTranslationProducerMap?: (updater: (prev: TranslationProducerMap) => TranslationProducerMap) => void;
  // Start consuming the translation producer
  startConsumingTranslation?: (producerId: string, speakerId: string, language: string, originalProducerId: string) => Promise<void>;
  // Pause original producer when switching to translation
  pauseOriginalProducer?: (originalProducerId: string) => Promise<void>;
  showAlert?: ShowAlert;
}

export interface TranslationProducerClosedOptions {
  data: TranslationProducerClosedData;
  updateTranslationProducerMap?: (updater: (prev: TranslationProducerMap) => TranslationProducerMap) => void;
  // Stop consuming the translation producer
  stopConsumingTranslation?: (producerId: string) => Promise<void>;
  // Resume original producer when translation stops
  resumeOriginalProducer?: (speakerId: string) => Promise<void>;
  showAlert?: ShowAlert;
}

export interface TranslationChannelsAvailableOptions {
  data: TranslationChannelsAvailableData;
  updateAvailableTranslationChannels?: (speakerId: string, languages: string[], originalProducerId: string) => void;
  // Auto-subscribe if user has a default listen language
  myDefaultListenLanguage?: string | null;
  socket?: any;
  roomName?: string;
}

export interface TranslationMemberStateOptions {
  data: TranslationMemberStateData;
  updateParticipantTranslationState?: (memberId: string, state: TranslationMemberStateData['state']) => void;
}

export interface TranslationErrorOptions {
  data: TranslationErrorData;
  showAlert?: ShowAlert;
}

/**
 * Options for handling speaker output language change
 * This is automatic - when a speaker sets an output language, ALL consumers
 * must pause original audio and consume translation instead
 */
export interface TranslationSpeakerOutputChangedOptions {
  data: TranslationSpeakerOutputChangedData;
  // Pause original audio consumer for this speaker
  pauseOriginalProducer?: (originalProducerId: string, speakerId: string) => Promise<void>;
  // Resume original audio consumer (when translation is disabled)
  resumeOriginalProducer?: (originalProducerId: string, speakerId: string) => Promise<void>;
  // Stop consuming translation and close the consumer
  stopConsumingTranslationForSpeaker?: (speakerId: string) => Promise<void>;
  // Track which speakers have translation output active
  updateSpeakerTranslationState?: (speakerId: string, outputLanguage: string | null, originalProducerId: string) => void;
  showAlert?: ShowAlert;
  // Check if listener has override for this speaker (wants original or different language)
  listenerOverride?: { speakerId: string; wantOriginal: boolean; preferredLanguage?: string } | null;
}

// ============================================================================
// Transcript Types
// ============================================================================

export interface TranslationTranscriptData {
  speakerId: string;
  speakerName: string;
  language: string;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  detectedLanguage?: string | null;
  timestamp: number;
}

export interface TranslationTranscriptOptions {
  data: TranslationTranscriptData;
  updateTranscripts?: (updater: (prev: TranslationTranscriptData[]) => TranslationTranscriptData[]) => void;
  onTranscriptReceived?: (transcript: TranslationTranscriptData) => void;
  maxTranscripts?: number; // Max transcripts to keep in state (default 100)
}

// ============================================================================
// Producer Map Type
// ============================================================================

export interface TranslationProducerMap {
  [originalProducerId: string]: {
    [languageCode: string]: string; // translationProducerId
  };
}

// ============================================================================
// Type Exports
// ============================================================================

export type TranslationRoomConfigType = (options: TranslationRoomConfigOptions) => Promise<void>;
export type TranslationConfigUpdatedType = (options: TranslationConfigUpdatedOptions) => Promise<void>;
export type TranslationLanguageSetType = (options: TranslationLanguageSetOptions) => Promise<void>;
export type TranslationSubscribedType = (options: TranslationSubscribedOptions) => Promise<void>;
export type TranslationUnsubscribedType = (options: TranslationUnsubscribedOptions) => Promise<void>;
export type TranslationProducerReadyType = (options: TranslationProducerReadyOptions) => Promise<void>;
export type TranslationProducerClosedType = (options: TranslationProducerClosedOptions) => Promise<void>;
export type TranslationChannelsAvailableType = (options: TranslationChannelsAvailableOptions) => Promise<void>;
export type TranslationMemberStateType = (options: TranslationMemberStateOptions) => Promise<void>;
export type TranslationErrorType = (options: TranslationErrorOptions) => Promise<void>;
export type TranslationTranscriptType = (options: TranslationTranscriptOptions) => Promise<void>;
export type TranslationSpeakerOutputChangedType = (options: TranslationSpeakerOutputChangedOptions) => Promise<void>;

// ============================================================================
// Handlers
// ============================================================================

/**
 * Handles the translation:roomConfig socket event.
 * Called when joining a room to receive room-level translation configuration.
 * 
 * @example
 * ```typescript
 * socket.on("translation:roomConfig", async (data: TranslationRoomConfigData) => {
 *   await translationRoomConfig({
 *     data,
 *     updateTranslationConfig,
 *     updateTranslationSupported,
 *   });
 * });
 * ```
 */
export const translationRoomConfig: TranslationRoomConfigType = async ({
  data,
  updateTranslationConfig,
  updateTranslationSupported,
}) => {
  try {
    const { config } = data;

    if (updateTranslationSupported) {
      updateTranslationSupported(config.supportTranslation);
    }

    if (updateTranslationConfig && config.supportTranslation) {
      updateTranslationConfig(config);
    }
  } catch (error) {
    console.error('Error handling translation:roomConfig:', error);
  }
};

/**
 * Handles the translation:configUpdated socket event.
 * Called when the host changes room translation settings.
 */
export const translationConfigUpdated: TranslationConfigUpdatedType = async ({
  data,
  updateTranslationConfig,
  showAlert,
}) => {
  try {
    const { config } = data;

    if (updateTranslationConfig) {
      updateTranslationConfig(config);
    }

    if (showAlert) {
      showAlert({
        message: 'Translation settings updated by host',
        type: 'info',
        duration: 2000,
      });
    }
  } catch (error) {
    console.error('Error handling translation:configUpdated:', error);
  }
};

/**
 * Handles the translation:languageSet socket event.
 * Called when the user's spoken language is confirmed.
 */
export const translationLanguageSet: TranslationLanguageSetType = async ({
  data,
  updateMySpokenLanguage,
  updateMySpokenLanguageEnabled,
  showAlert,
}) => {
  try {
    const { success, language, enabled, error } = data;

    if (success) {
      if (updateMySpokenLanguage) {
        updateMySpokenLanguage(language);
      }
      if (updateMySpokenLanguageEnabled) {
        updateMySpokenLanguageEnabled(enabled);
      }
    } else if (showAlert && error) {
      showAlert({
        message: error,
        type: 'danger',
        duration: 3000,
      });
    }
  } catch (error) {
    console.error('Error handling translation:languageSet:', error);
  }
};

/**
 * Handles the translation:subscribed socket event.
 * Called when successfully subscribed to a translation channel.
 */
export const translationSubscribed: TranslationSubscribedType = async ({
  data,
  updateListenPreferences,
  updateTranslationProducerMap,
  startConsumingTranslation,
  showAlert,
}) => {
  try {
    const { speakerId, language, channelCreated, producerId, originalProducerId } = data;

    // Update listen preferences
    if (updateListenPreferences) {
      updateListenPreferences((prev) => {
        const next = new Map(prev);
        next.set(speakerId, language);
        return next;
      });
    }

    // Update producer map if we have a producer ID
    if (producerId && originalProducerId && updateTranslationProducerMap) {
      updateTranslationProducerMap((prev) => ({
        ...prev,
        [originalProducerId]: {
          ...(prev[originalProducerId] || {}),
          [language]: producerId,
        },
      }));
    }

    // Start consuming if producer is ready
    if (producerId && startConsumingTranslation) {
      await startConsumingTranslation(producerId, speakerId, language);
    }

    if (showAlert && channelCreated) {
      showAlert({
        message: `Translation channel created for ${language}`,
        type: 'success',
        duration: 2000,
      });
    }
  } catch (error) {
    console.error('Error handling translation:subscribed:', error);
  }
};

/**
 * Handles the translation:unsubscribed socket event.
 * Called when unsubscribed from a translation channel.
 */
export const translationUnsubscribed: TranslationUnsubscribedType = async ({
  data,
  updateListenPreferences,
  stopConsumingTranslation,
}) => {
  try {
    const { speakerId, language } = data;

    // Update listen preferences
    if (updateListenPreferences) {
      updateListenPreferences((prev) => {
        const next = new Map(prev);
        next.delete(speakerId);
        return next;
      });
    }

    // Stop consuming
    if (stopConsumingTranslation) {
      await stopConsumingTranslation(speakerId, language);
    }
  } catch (error) {
    console.error('Error handling translation:unsubscribed:', error);
  }
};

/**
 * Handles the translation:producerReady socket event.
 * Called when a translation producer is ready for consumption.
 * 
 * NOTE: This event comes from the PRODUCING socket with the original producer ID.
 * The actual consumption happens via `new-pipe-producer` from CONSUMING sockets
 * with the piped producer ID. This handler only updates state/maps.
 */
export const translationProducerReady: TranslationProducerReadyType = async ({
  data,
  updateTranslationProducerMap,
  pauseOriginalProducer,
}) => {
  try {
    const { language, producerId, originalProducerId } = data;

    // Update producer map (for tracking purposes)
    // Note: producerId here is the ORIGINAL producer ID on producing side
    // The piped producer ID will be different and handled by new-pipe-producer
    if (updateTranslationProducerMap) {
      updateTranslationProducerMap((prev) => ({
        ...prev,
        [originalProducerId]: {
          ...(prev[originalProducerId] || {}),
          [language]: producerId,
        },
      }));
    }

    // Pause original producer to save bandwidth when translation is active
    if (pauseOriginalProducer) {
      await pauseOriginalProducer(originalProducerId);
    }

    // NOTE: startConsumingTranslation is NOT called here because:
    // 1. This producerId is from the producing server (original)
    // 2. The frontend connects to CONSUMING servers
    // 3. The piped producer (different ID) arrives via new-pipe-producer event
    // 4. newPipeProducer.ts handles the actual consumption
  } catch (error) {
    console.error('Error handling translation:producerReady:', error);
  }
};

/**
 * Handles the translation:producerClosed socket event.
 * Called when a translation producer is closed.
 */
export const translationProducerClosed: TranslationProducerClosedType = async ({
  data,
  updateTranslationProducerMap,
  stopConsumingTranslation,
  resumeOriginalProducer,
  showAlert,
}) => {
  try {
    const { speakerId, language, producerId, reason } = data;

    // Remove from producer map
    if (updateTranslationProducerMap) {
      updateTranslationProducerMap((prev) => {
        const next = { ...prev };
        for (const [origId, langMap] of Object.entries(next)) {
          if (langMap[language] === producerId) {
            delete langMap[language];
            if (Object.keys(langMap).length === 0) {
              delete next[origId];
            }
          }
        }
        return next;
      });
    }

    // Stop consuming
    if (stopConsumingTranslation) {
      await stopConsumingTranslation(producerId);
    }

    // Resume original producer
    if (resumeOriginalProducer) {
      await resumeOriginalProducer(speakerId);
    }

    if (showAlert && reason) {
      showAlert({
        message: `Translation stopped: ${reason}`,
        type: 'info',
        duration: 2000,
      });
    }
  } catch (error) {
    console.error('Error handling translation:producerClosed:', error);
  }
};

/**
 * Handles the translation:channelsAvailable socket event.
 * Called when a speaker has translation channels available.
 */
export const translationChannelsAvailable: TranslationChannelsAvailableType = async ({
  data,
  updateAvailableTranslationChannels,
  myDefaultListenLanguage,
  socket,
  roomName,
}) => {
  try {
    const { speakerId, languages, originalProducerId } = data;

    if (updateAvailableTranslationChannels) {
      updateAvailableTranslationChannels(speakerId, languages, originalProducerId);
    }

    // Auto-subscribe if user has a default listen language and it's available
    if (myDefaultListenLanguage && languages.includes(myDefaultListenLanguage) && socket && roomName) {
      socket.emit('translation:subscribe', {
        roomName,
        speakerId,
        language: myDefaultListenLanguage,
        originalProducerId,
      });
    }
  } catch (error) {
    console.error('Error handling translation:channelsAvailable:', error);
  }
};

/**
 * Handles the translation:memberState socket event.
 * Called when another member's translation state changes.
 */
export const translationMemberState: TranslationMemberStateType = async ({
  data,
  updateParticipantTranslationState,
}) => {
  try {
    const { memberId, state } = data;

    if (updateParticipantTranslationState) {
      updateParticipantTranslationState(memberId, state);
    }
  } catch (error) {
    console.error('Error handling translation:memberState:', error);
  }
};

/**
 * Handles the translation:error socket event.
 * Called when a translation operation fails.
 */
export const translationError: TranslationErrorType = async ({
  data,
  showAlert,
}) => {
  try {
    const { error, code, availableChannels, maxChannels, message: backendMessage } = data;

    if (showAlert) {
      let message = error;
      
      // Provide user-friendly messages for known error codes
      switch (code) {
        case 'max_channels':
          if (availableChannels && availableChannels.length > 0) {
            message = `Maximum ${maxChannels || 5} translation channels reached. Available: ${availableChannels.join(', ')}`;
          } else {
            message = backendMessage || 'Maximum translation channels reached. Please wait for a slot to open.';
          }
          break;
        case 'speaker_not_found':
          message = 'Speaker not found or has left the meeting.';
          break;
        case 'language_not_allowed':
          message = 'This language is not available for translation in this room.';
          break;
        default:
          message = error || 'Translation error occurred';
      }

      showAlert({
        message,
        type: 'danger',
        duration: 5000,
      });
    }
  } catch (err) {
    console.error('Error handling translation:error:', err);
  }
};
/**
 * Handles the translation:transcript socket event.
 * Called when a translation transcript (text) is available for display.
 * 
 * Use this for:
 * - Live captions/subtitles
 * - Transcript panel
 * - Accessibility features
 * 
 * @example
 * ```typescript
 * socket.on("translation:transcript", async (data: TranslationTranscriptData) => {
 *   await translationTranscript({
 *     data,
 *     updateTranscripts: setTranscripts,
 *     onTranscriptReceived: (transcript) => {
 *       console.log(`${transcript.speakerName}: ${transcript.translatedText}`);
 *     },
 *   });
 * });
 * ```
 */
export const translationTranscript: TranslationTranscriptType = async ({
  data,
  updateTranscripts,
  onTranscriptReceived,
  maxTranscripts = 100,
}) => {
  try {
    // Update transcript state if updater provided
    if (updateTranscripts) {
      updateTranscripts((prev) => {
        const next = [...prev, data];
        // Keep only last N transcripts to prevent memory bloat
        if (next.length > maxTranscripts) {
          return next.slice(-maxTranscripts);
        }
        return next;
      });
    }

    // Call custom callback if provided
    if (onTranscriptReceived) {
      onTranscriptReceived(data);
    }
  } catch (err) {
    console.error('Error handling translation:transcript:', err);
  }
};

/**
 * Handles the `translation:speakerOutputChanged` event.
 * 
 * This is emitted when a speaker changes their output language.
 * When a speaker sets an output language (different from their spoken language),
 * ALL consumers must automatically:
 * 1. Pause their consumer of the speaker's original audio
 * 2. Wait for translation producer to arrive via new-pipe-producer
 * 3. Consume the translation producer instead
 * 
 * This is NOT optional for consumers - the speaker decides what everyone hears.
 * 
 * @example
 * ```typescript
 * socket.on("translation:speakerOutputChanged", async (data) => {
 *   await translationSpeakerOutputChanged({
 *     data,
 *     pauseOriginalProducer: async (producerId, speakerId) => {
 *       // Pause consumer for this producer
 *     },
 *     resumeOriginalProducer: async (producerId, speakerId) => {
 *       // Resume consumer for this producer
 *     },
 *   });
 * });
 * ```
 */
export const translationSpeakerOutputChanged: TranslationSpeakerOutputChangedType = async ({
  data,
  pauseOriginalProducer,
  resumeOriginalProducer,
  stopConsumingTranslationForSpeaker,
  updateSpeakerTranslationState,
  showAlert,
  listenerOverride,
}) => {
  try {
    const { speakerId, speakerName, outputLanguage, originalProducerId, enabled } = data;
    
    // Update local tracking state
    if (updateSpeakerTranslationState) {
      updateSpeakerTranslationState(speakerId, outputLanguage, originalProducerId);
    }
    
    // Check if listener has an override that affects whether we pause/resume original
    const listenerWantsOriginal = listenerOverride?.wantOriginal === true;
    const listenerWantsDifferentLanguage = listenerOverride?.preferredLanguage && 
      listenerOverride.preferredLanguage.toLowerCase() !== outputLanguage?.toLowerCase();
    
    // If listener wants original audio, don't pause the original producer
    if (listenerWantsOriginal) {
      if (showAlert) {
        showAlert({
          message: `${speakerName} is speaking in ${outputLanguage ? getLanguageName(outputLanguage) : 'translated'} but you're hearing original`,
          type: 'info',
          duration: 3000,
        });
      }
      return;
    }
    
    // If listener wants a different language than speaker's output, don't pause
    // (they'll consume the different language's translation producer instead)
    if (listenerWantsDifferentLanguage) {
      // Still pause original if we're subscribed to a different translation
      if (pauseOriginalProducer && originalProducerId) {
        await pauseOriginalProducer(originalProducerId, speakerId);
      }
      return;
    }
    
    if (enabled && outputLanguage && originalProducerId) {
      // Speaker has enabled translation output
      // Pause the original audio - translation producer will arrive via new-pipe-producer
      if (pauseOriginalProducer) {
        await pauseOriginalProducer(originalProducerId, speakerId);
      }
      
      if (showAlert) {
        showAlert({
          message: `${speakerName} is now speaking in ${getLanguageName(outputLanguage)}`,
          type: 'info',
          duration: 3000,
        });
      }
    } else if (!enabled || !outputLanguage) {
      // Speaker disabled translation or set to original
      // 1. Stop consuming translation and close the consumer
      if (stopConsumingTranslationForSpeaker) {
        await stopConsumingTranslationForSpeaker(speakerId);
      }
      
      // 2. Resume original audio consumer
      if (resumeOriginalProducer && originalProducerId) {
        await resumeOriginalProducer(originalProducerId, speakerId);
      }
      
      if (showAlert && !enabled) {
        showAlert({
          message: `${speakerName} returned to original language`,
          type: 'info',
          duration: 3000,
        });
      }
    }
  } catch (err) {
    console.error('Error handling translation:speakerOutputChanged:', err);
  }
};