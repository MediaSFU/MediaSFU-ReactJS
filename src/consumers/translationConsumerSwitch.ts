/**
 * Translation Consumer Switch Utilities
 * 
 * Provides functions to switch between original audio and translated audio
 * by pausing/resuming the appropriate consumers.
 * 
 * Key concepts:
 * - When a user subscribes to a translation, the original audio consumer should be paused
 * - When translation stops or user unsubscribes, resume the original audio consumer
 * - Translation producers are consumed via the regular pipe producer flow (newPipeProducer)
 * - We just need to pause/resume the original audio consumers
 * - IMPORTANT: Must respect breakout room state - don't resume audio for speakers not in our room
 * 
 * The consumer transports array contains objects with:
 * - consumerTransport: The mediasoup Transport object
 * - serverConsumerTransportId: ID on the server
 * - producerId: The producer being consumed
 * - consumer: The mediasoup Consumer object
 * - socket_: The socket used for this transport
 */

import { Transport, BreakoutParticipant, Participant, EventType } from "../@types/types";

export interface TranslationConsumerSwitchParameters {
  consumerTransports: Transport[];
  roomName: string;
  member: string;
  updateConsumerTransports: (transports: Transport[]) => void;
  // Breakout room state - mirrors resumePauseAudioStreams logic
  breakOutRoomStarted?: boolean;
  breakOutRoomEnded?: boolean;
  breakoutRooms?: BreakoutParticipant[][]; // All breakout rooms (2D array)
  limitedBreakRoom?: BreakoutParticipant[]; // Current user's room participants
  participants?: Participant[];
  ref_participants?: Participant[];
  islevel?: string; // "2" = host
  eventType?: EventType; // "webinar" | "conference" | etc.
  hostNewRoom?: number; // Which room the host is in (-1 = main room)
  [key: string]: any;
}

export interface PauseOriginalProducerOptions {
  originalProducerId: string;
  speakerId?: string; // Speaker name to check breakout room membership
  parameters: TranslationConsumerSwitchParameters;
}

export interface ResumeOriginalProducerOptions {
  originalProducerId: string;
  speakerId?: string; // Speaker name to check breakout room membership
  parameters: TranslationConsumerSwitchParameters;
}

export type PauseOriginalProducerType = (options: PauseOriginalProducerOptions) => Promise<void>;
export type ResumeOriginalProducerType = (options: ResumeOriginalProducerOptions) => Promise<void>;

/**
 * Check if a speaker is in the current user's breakout room (or main room).
 * Returns true if the speaker's audio should be active (they are in our room).
 * 
 * This mirrors the logic in resumePauseAudioStreams.ts to ensure parity:
 * - In webinars: host audio is always active for non-hosts
 * - In conferences: host audio depends on hostNewRoom vs current user's room
 * - Regular participants: must be in the same limitedBreakRoom
 */
export const isSpeakerInMyBreakoutRoom = (
  speakerName: string,
  parameters: TranslationConsumerSwitchParameters
): boolean => {
  const {
    breakOutRoomStarted = false,
    breakOutRoomEnded = false,
    limitedBreakRoom = [],
    participants = [],
    islevel = "1",
    eventType = "conference",
    hostNewRoom = -1,
    breakoutRooms = [],
    member = "",
  } = parameters;

  // If breakout rooms are not active, everyone is in the same room
  if (!breakOutRoomStarted || breakOutRoomEnded) {
    return true;
  }

  // Check if the speaker is the host
  const host = participants.find((p) => p.islevel === "2");
  const speakerIsHost = host?.name === speakerName;

  // If current user is NOT the host, apply host audio logic
  if (islevel !== "2") {
    // For webinars, host audio is always included
    if (eventType === "webinar" && speakerIsHost) {
      return true;
    }

    // For conferences, check if host should be audible based on hostNewRoom
    if (eventType === "conference" && speakerIsHost) {
      // Find which breakout room the current user is in
      const roomMember = breakoutRooms.find((r) =>
        r.find((p) => p.name === member)
      );
      const memberBreakRoom = roomMember ? breakoutRooms.indexOf(roomMember) : -1;
      const inBreakRoom = memberBreakRoom !== -1;

      // Logic from resumePauseAudioStreams:
      // Host is NOT audible if:
      //   (inBreakRoom && breakRoom !== hostNewRoom) ||
      //   (!inBreakRoom && hostNewRoom !== -1 && hostNewRoom !== memberBreakRoom)
      // Host IS audible if:
      //   (inBreakRoom && breakRoom === hostNewRoom) ||
      //   (!inBreakRoom && hostNewRoom === -1) ||
      //   (!inBreakRoom && hostNewRoom === memberBreakRoom && memberBreakRoom !== -1)
      
      if (inBreakRoom) {
        // User is in a breakout room
        return memberBreakRoom === hostNewRoom;
      } else {
        // User is in main room
        if (hostNewRoom === -1) {
          return true; // Host is also in main room
        }
        return hostNewRoom === memberBreakRoom && memberBreakRoom !== -1;
      }
    }
  }

  // For regular participants (non-host), check if they're in our limitedBreakRoom
  return limitedBreakRoom.some((p) => p.name === speakerName);
};

/**
 * Pause the original audio producer consumer when switching to translation.
 * This saves bandwidth by not receiving audio we won't use.
 * 
 * NOTE: Only pauses if the speaker is in our breakout room. If they're not,
 * their audio is already paused by the breakout room logic.
 */
export const pauseOriginalProducer: PauseOriginalProducerType = async ({
  originalProducerId,
  speakerId,
  parameters,
}) => {
  try {
    const { consumerTransports } = parameters;

    // If we have a speakerId, check if they're in our breakout room
    if (speakerId && !isSpeakerInMyBreakoutRoom(speakerId, parameters)) {
      return;
    }

    // Find the consumer transport for this original producer
    const transport = consumerTransports.find(
      (t) => t.producerId === originalProducerId && t.consumer?.kind === 'audio'
    );

    if (transport && transport.consumer && !transport.consumer.paused) {
      // Pause locally
      transport.consumer.pause();
      
      // Notify server
      transport.socket_?.emit(
        'consumer-pause',
        { serverConsumerId: transport.serverConsumerTransportId },
        async () => { /* acknowledged */ }
      );
    }
  } catch (error) {
    console.error('[TranslationSwitch] Error pausing original producer:', error);
  }
};

/**
 * Resume the original audio producer consumer when translation stops.
 * 
 * NOTE: Only resumes if the speaker is in our breakout room. If they're not,
 * their audio should stay paused (controlled by breakout room logic).
 */
export const resumeOriginalProducer: ResumeOriginalProducerType = async ({
  originalProducerId,
  speakerId,
  parameters,
}) => {
  try {
    const { consumerTransports } = parameters;

    // If we have a speakerId, check if they're in our breakout room
    // Only resume if the speaker is in our room
    if (speakerId && !isSpeakerInMyBreakoutRoom(speakerId, parameters)) {
      return;
    }

    // Find the consumer transport for this original producer
    const transport = consumerTransports.find(
      (t) => t.producerId === originalProducerId && t.consumer?.kind === 'audio'
    );

    if (transport && transport.consumer && transport.consumer.paused) {
      // Resume on server first
      transport.socket_?.emit(
        'consumer-resume',
        { serverConsumerId: transport.serverConsumerTransportId },
        async ({ resumed }: { resumed: boolean }) => {
          if (resumed) {
            transport.consumer.resume();
          }
        }
      );
    }
  } catch (error) {
    console.error('[TranslationSwitch] Error resuming original producer:', error);
  }
};

/**
 * Check if we're currently consuming a translation for a given speaker.
 * Looks for consumers that have translation metadata attached.
 */
export const isConsumingTranslationForSpeaker = (
  speakerId: string,
  consumerTransports: Transport[],
  translationProducerMap: Map<string, { translationProducerId: string; originalProducerId: string; language: string }>
): { consuming: boolean; language?: string; translationProducerId?: string; originalProducerId?: string } => {
  // Check our translation map for this speaker
  const translationInfo = translationProducerMap.get(speakerId);
  
  if (translationInfo) {
    // Verify we have a consumer for this translation producer
    const hasConsumer = consumerTransports.some(
      (t) => t.producerId === translationInfo.translationProducerId
    );
    
    if (hasConsumer) {
      return {
        consuming: true,
        language: translationInfo.language,
        translationProducerId: translationInfo.translationProducerId,
        originalProducerId: translationInfo.originalProducerId,
      };
    }
  }

  return { consuming: false };
};

/**
 * Get all active translation consumers from the map.
 */
export const getActiveTranslationConsumers = (
  translationProducerMap: Map<string, { translationProducerId: string; originalProducerId: string; language: string }>,
  consumerTransports: Transport[]
): Array<{ speakerId: string; translationProducerId: string; originalProducerId: string; language: string }> => {
  const results: Array<{ speakerId: string; translationProducerId: string; originalProducerId: string; language: string }> = [];
  
  translationProducerMap.forEach((info, speakerId) => {
    // Verify we have an active consumer for this translation
    const hasConsumer = consumerTransports.some(
      (t) => t.producerId === info.translationProducerId
    );
    
    if (hasConsumer) {
      results.push({
        speakerId,
        ...info,
      });
    }
  });
  
  return results;
};

/**
 * Find the original producer ID for a speaker from all audio streams.
 * This is needed when we receive a translation producer and need to pause the original.
 */
export const findOriginalProducerForSpeaker = (
  speakerId: string,
  allAudioStreams: Array<{ producerId: string; name?: string; [key: string]: any }>
): string | null => {
  const stream = allAudioStreams.find(
    (s) => s.name === speakerId || s.producerId?.includes(speakerId)
  );
  return stream?.producerId || null;
};

/**
 * Handle breakout room changes for translation audio.
 * 
 * When a user moves between breakout rooms, we need to re-evaluate
 * which translation streams should be active:
 * - Resume original audio for speakers now in our room (if no translation active)
 * - The breakout room audio logic (resumePauseAudioStreams) will handle pausing
 *   speakers not in our room
 * 
 * This function is called after breakout room updates to sync translation state.
 * 
 * @param translationProducerMap - Map of originalProducerId → { language → translationProducerId }
 * @param parameters - Consumer switch parameters including breakout room state
 */
export interface StopConsumingTranslationOptions {
  speakerId: string;
  language: string;
  translationProducerMap: Record<string, Record<string, string>>;
  parameters: TranslationConsumerSwitchParameters;
}

export type StopConsumingTranslationType = (options: StopConsumingTranslationOptions) => Promise<string | null>;

/**
 * Stop consuming a translation producer and close its consumer.
 * Returns the original producer ID if found, so caller can resume it.
 * 
 * Flow:
 * 1. Find the translation producer ID from the translation map
 * 2. Find the consumer transport for that producer
 * 3. Close the consumer (both locally and on server)
 * 4. Return the original producer ID for resuming
 */
export const stopConsumingTranslation: StopConsumingTranslationType = async (options) => {
  const { language, translationProducerMap, parameters } = options;
  try {
    const { consumerTransports, updateConsumerTransports } = parameters;
    
    // Find the original producer ID and translation producer ID from the map
    // The map is: { originalProducerId: { language: translationProducerId } }
    let originalProducerId: string | null = null;
    let translationProducerId: string | null = null;
    
    for (const [origId, langMap] of Object.entries(translationProducerMap)) {
      if (langMap && langMap[language]) {
        // Check if this original producer belongs to the speaker
        // We need to verify by checking consumer transports or other metadata
        translationProducerId = langMap[language];
        originalProducerId = origId;
        break;
      }
    }
    
    if (!translationProducerId) {
      return originalProducerId;
    }
    
    // Find the consumer transport for the translation producer
    const transportIndex = consumerTransports.findIndex(
      (t) => t.producerId === translationProducerId
    );
    
    if (transportIndex === -1) {
      return originalProducerId;
    }
    
    const transport = consumerTransports[transportIndex];
    
    // Close the consumer on the server
    if (transport.socket_ && transport.consumer) {
      transport.socket_.emit(
        'consumer-close',
        { serverConsumerId: transport.serverConsumerTransportId },
        () => { /* acknowledged */ }
      );
    }
    
    // Close the consumer locally
    if (transport.consumer) {
      transport.consumer.close();
    }
    
    // Remove from consumer transports array
    const updatedTransports = consumerTransports.filter((_, i) => i !== transportIndex);
    updateConsumerTransports(updatedTransports);
    
    return originalProducerId;
    
    return originalProducerId;
  } catch (error) {
    console.error('[TranslationSwitch] Error stopping translation consumer:', error);
    return null;
  }
};

export const syncTranslationStateAfterBreakoutChange = async (
  translationProducerMap: Record<string, Record<string, string>>,
  speakerIdByProducerId: Record<string, string>,
  parameters: TranslationConsumerSwitchParameters
): Promise<void> => {
  try {
    const { consumerTransports } = parameters;

    // For each active translation, check if the speaker is now in our room or not
    for (const [originalProducerId, langMap] of Object.entries(translationProducerMap)) {
      const speakerId = speakerIdByProducerId[originalProducerId];
      if (!speakerId) continue;

      const inMyRoom = isSpeakerInMyBreakoutRoom(speakerId, parameters);
      const hasTranslation = Object.keys(langMap).length > 0;

      // Find the original producer's consumer
      const originalConsumer = consumerTransports.find(
        (t) => t.producerId === originalProducerId && t.consumer?.kind === 'audio'
      );

      if (!originalConsumer) continue;

      if (inMyRoom && hasTranslation) {
        // Speaker is in our room and we have translation - original should be paused
        if (!originalConsumer.consumer.paused) {
          await pauseOriginalProducer({
            originalProducerId,
            speakerId,
            parameters,
          });
        }
      }
      // Note: If speaker is NOT in our room, the breakout room audio logic
      // (resumePauseAudioStreams) will handle pausing their audio.
      // We don't need to explicitly handle that case here.
    }
  } catch (error) {
    console.error('[TranslationSwitch] Error syncing translation state:', error);
  }
};
