import { Socket } from "socket.io-client";
import { SignalNewConsumerTransportParameters, SignalNewConsumerTransportType } from '../@types/types';

/**
 * Translation metadata for translation producers
 */
interface TranslationMeta {
  speakerId: string;
  speakerName: string;
  language: string;
  originalProducerId?: string;
  isSpeakerControlled?: boolean;
}

/**
 * Producer info returned from backend (can be string ID or object with metadata)
 */
interface ProducerInfo {
  id: string;
  translationMeta?: TranslationMeta | null;
}

export interface GetPipedProducersAltParameters extends Omit<SignalNewConsumerTransportParameters, 'getUpdatedAllParams'> {
  member: string;

  // Listener translation preferences for filtering
  listenerTranslationPreferences?: {
    perSpeaker: Map<string, { speakerId: string; language: string | null; wantOriginal: boolean }>;
    globalLanguage: string | null;
  };

  // mediasfu functions
  signalNewConsumerTransport: SignalNewConsumerTransportType;
  // For consuming translation producers with proper tracking
  startConsumingTranslation?: (
    producerId: string,
    speakerId: string,
    language: string,
    originalProducerId?: string,
    nsock?: Socket
  ) => Promise<void>;
  getUpdatedAllParams?: () => GetPipedProducersAltParameters;
  [key: string]: any;
}

export interface GetPipedProducersAltOptions {
  community?: boolean;
  nsock: Socket;
  islevel: string;
  parameters: GetPipedProducersAltParameters;
}

// Export the type definition for the function
export type GetPipedProducersAltType = (options: GetPipedProducersAltOptions) => Promise<void>;

/**
 * Checks if a translation producer should be consumed based on listener preferences.
 * 
 * PRIORITY (highest to lowest):
 * 1. Per-speaker preference (listener explicitly set for this speaker)
 * 2. Global preference (listener wants all speakers in a specific language)  
 * 3. Speaker-controlled output (speaker set their output language, listeners should hear it by default)
 */
const shouldConsumeTranslationProducer = (
  translationMeta: TranslationMeta,
  listenerTranslationPreferences?: {
    perSpeaker: Map<string, { speakerId: string; language: string | null; wantOriginal: boolean }>;
    globalLanguage: string | null;
  }
): boolean => {
  const normalizedLang = translationMeta.language?.toLowerCase();
  const speakerId = translationMeta.speakerId;
  const isSpeakerControlled = translationMeta.isSpeakerControlled === true;

  // If listener has preferences set, check them first (they have higher priority)
  if (listenerTranslationPreferences) {
    // Check per-speaker preference first (highest priority)
    const perSpeakerPref = listenerTranslationPreferences.perSpeaker?.get(speakerId);
    if (perSpeakerPref) {
      if (perSpeakerPref.wantOriginal) {
        return false;
      }
      if (perSpeakerPref.language) {
        return perSpeakerPref.language.toLowerCase() === normalizedLang;
      }
    }

    // Check global preference (second priority)
    const globalPref = listenerTranslationPreferences.globalLanguage;
    if (globalPref) {
      return globalPref.toLowerCase() === normalizedLang;
    }
  }

  // If speaker has set their output (speaker-controlled), consume it by default
  // This ensures new joiners hear the speaker's chosen output even without setting preferences
  if (isSpeakerControlled) {
    return true;
  }

  // No preferences and not speaker-controlled - skip translation producer
  return false;
};

/**
 * Retrieves piped producers and signals new consumer transport for each retrieved producer.
 * Filters out translation producers that the listener hasn't requested.
 *
 * @param {GetPipedProducersAltOptions} options - The options for retrieving piped producers.
 * @param {boolean} options.community - A flag indicating if the room is a community edition room.
 * @param {Socket} options.nsock - The WebSocket instance used for communication.
 * @param {string} options.islevel - A flag indicating the level of the request.
 * @param {GetPipedProducersAltParameters} options.parameters - Additional parameters for the request.
 * @param {string} options.parameters.member - The member identifier.
 * @param {Function} options.parameters.signalNewConsumerTransport - A function to signal new consumer transport.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @throws {Error} If an error occurs during the process of retrieving producers.
 *
 * @example
 * const options = {
 *   community: false,
 *   nsock: socketInstance,
 *   islevel: '1',
 *   parameters: {
 *     member: 'memberId',
 *     signalNewConsumerTransport: async ({ nsock, remoteProducerId, islevel, parameters }) => {
 *       // Implementation for signaling new consumer transport
 *     },
 *   },
 * };
 *
 * getPipedProducersAlt(options)
 *   .then(() => {
 *     console.log('Successfully retrieved piped producers');
 *   })
 *   .catch((error) => {
 *     console.error('Error retrieving piped producers:', error);
 *   });
 */

export const getPipedProducersAlt = async ({
  community = false,
  nsock,
  islevel,
  parameters,
}: GetPipedProducersAltOptions): Promise<void> => {
  try {
    // Get fresh parameters
    const freshParams = parameters.getUpdatedAllParams ? parameters.getUpdatedAllParams() : parameters;
    
    // Destructure parameters
    const { member, signalNewConsumerTransport, startConsumingTranslation, listenerTranslationPreferences } = freshParams;

    const emitName = community ? "getProducersAlt" : "getProducersPipedAlt";

    // Emit request to get piped producers using WebSocket
    await nsock.emit(
      emitName,
      { islevel, member },
      async (producers: (string | ProducerInfo)[]) => {
        // Check if producers are retrieved
        if (producers.length > 0) {
          // Filter and signal new consumer transport for each retrieved producer
          for (const producer of producers) {
            // Handle both old format (string ID) and new format (object with metadata)
            let producerId: string;
            let translationMeta: TranslationMeta | null = null;
            
            if (typeof producer === 'string') {
              // Old format - just ID
              producerId = producer;
            } else {
              // New format - object with id and translationMeta
              producerId = producer.id;
              translationMeta = producer.translationMeta || null;
            }
            
            // Handle translation producers specially - use startConsumingTranslation for proper tracking
            if (translationMeta) {
              const shouldConsume = shouldConsumeTranslationProducer(translationMeta, listenerTranslationPreferences);
              if (!shouldConsume) {
                continue; // Skip this translation producer
              }
              
              // Use startConsumingTranslation if available - this properly tracks the consumer
              // and closes existing consumers for the same speaker (different language)
              if (startConsumingTranslation) {
                await startConsumingTranslation(
                  producerId,
                  translationMeta.speakerId,
                  translationMeta.language,
                  translationMeta.originalProducerId,
                  nsock
                );
                continue; // Already consumed via startConsumingTranslation
              }
              // Fall through to regular consumption if startConsumingTranslation not available
            }
            
            // Consume this producer (non-translation or no startConsumingTranslation available)
            await signalNewConsumerTransport({
              nsock,
              remoteProducerId: producerId,
              islevel,
              parameters: freshParams as unknown as SignalNewConsumerTransportParameters,
            });
          }
        }
      }
    );
  } catch (error) {
    // Handle errors during the process of retrieving producers
    console.log("Error getting piped producers:", (error as Error).message);
  }
};
