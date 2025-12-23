import { Socket } from 'socket.io-client';
import { signalNewConsumerTransport } from '../../consumers/signalNewConsumerTransport';
import { ReorderStreamsParameters, ReorderStreamsType, SignalNewConsumerTransportParameters, ConnectRecvTransportParameters, ConnectRecvTransportType, ShowAlert } from '../../@types/types';
import { Device } from 'mediasoup-client/lib/types';

/**
 * Translation metadata passed with translation producers
 */
export interface TranslationMeta {
  speakerId: string;
  speakerName: string;
  language: string;
  originalProducerId?: string;
  isSpeakerControlled?: boolean; // true = speaker set output language for everyone
}

export interface NewPipeProducerParameters extends ReorderStreamsParameters, SignalNewConsumerTransportParameters, ConnectRecvTransportParameters {

  first_round: boolean;
  shareScreenStarted: boolean;
  shared: boolean;
  landScaped: boolean;
  showAlert?: ShowAlert;
  isWideScreen: boolean;
  updateFirst_round: (firstRound: boolean) => void;
  updateLandScaped: (landScaped: boolean) => void;
  device: Device | null;
  consumingTransports: string[];
  lock_screen: boolean;
  updateConsumingTransports: (transports: string[]) => void;

  // mediasfu functions
  connectRecvTransport: ConnectRecvTransportType;
  reorderStreams: ReorderStreamsType;
  getUpdatedAllParams: () => NewPipeProducerParameters;
  
  // Translation handling - nsock is the consuming socket for signalNewConsumerTransport
  startConsumingTranslation?: (producerId: string, speakerId: string, language: string, originalProducerId?: string, nsock?: Socket) => Promise<void>;
  translationSubscriptions?: Map<string, { speakerId: string; language: string }>;
  
  // Speaker-controlled translation tracking
  speakerTranslationStates?: Map<string, { speakerId: string; speakerName: string; inputLanguage: string; outputLanguage: string; originalProducerId: string; enabled: boolean }>;
  
  // Listener translation overrides - allows listeners to override speaker-controlled output
  listenerTranslationOverrides?: Map<string, { speakerId: string; wantOriginal: boolean; preferredLanguage?: string }>;
  
  // Listener translation preferences - full preferences including global language preference
  listenerTranslationPreferences?: {
    perSpeaker: Map<string, { speakerId: string; language: string | null; wantOriginal: boolean }>;
    globalLanguage: string | null;
  };
  
  [key: string]: any;

}

export interface NewPipeProducerOptions {
  producerId: string;
  islevel: string;
  nsock: Socket;
  parameters: NewPipeProducerParameters;
  isTranslation?: boolean;
  translationMeta?: TranslationMeta;
}

// Export the type definition for the function
export type NewPipeProducerType = (options: NewPipeProducerOptions) => Promise<void>;


/**
 * Handles the creation of a new pipe producer by signaling for a new consumer transport and updating the necessary parameters.
 *
 * @function
 * @async
 * @param {NewPipeProducerOptions} options - The options for the new pipe producer.
 * @param {string} options.producerId - The ID of the producer to be consumed.
 * @param {string} options.islevel - The level status of the participant.
 * @param {Socket} options.nsock - The socket instance for real-time communication.
 * @param {NewPipeProducerParameters} options.parameters - Additional parameters required for the producer.
 * @param {boolean} options.parameters.shareScreenStarted - Indicates if screen sharing has started.
 * @param {boolean} options.parameters.shared - Indicates if sharing is active.
 * @param {boolean} options.parameters.landScaped - Indicates if the device is in landscape mode.
 * @param {ShowAlert} options.parameters.showAlert - Function to show alerts to the user.
 * @param {boolean} options.parameters.isWideScreen - Indicates if the device is a widescreen.
 * @param {Function} options.parameters.updateFirst_round - Function to update the first round status.
 * @param {Function} options.parameters.updateLandScaped - Function to update the landscape status.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 * @throws {Error} Will throw an error if the operation fails to signal the new consumer transport.
 *
 * @example
 * import { newPipeProducer } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 * 
 * const parameters = {
 *   shareScreenStarted: true,
 *   shared: true,
 *   landScaped: false,
 *   showAlert: (alert) => console.log(alert.message),
 *   isWideScreen: false,
 *   updateFirst_round: (firstRound) => console.log('First round updated:', firstRound),
 *   updateLandScaped: (landScaped) => console.log('Landscape status updated:', landScaped),
 * };
 * 
 * const producerId = 'producer-123';
 * const islevel = '2';
 * const nsock = io("http://localhost:3000");
 * 
 * async function init() {
 *   try {
 *     await newPipeProducer({
 *       producerId,
 *       islevel,
 *       nsock,
 *       parameters,
 *     });
 *     console.log('New pipe producer created successfully');
 *   } catch (error) {
 *     console.error('Error creating new pipe producer:', error);
 *   }
 * }
 * 
 * init();
 */

export const newPipeProducer = async ({
  producerId,
  islevel,
  nsock,
  parameters,
  isTranslation,
  translationMeta,
}: NewPipeProducerOptions): Promise<void> => {
  
  // Handle translation producers separately - skip grid/UI updates
  if (isTranslation && translationMeta) {
    // Get fresh parameters to ensure we have the latest state
    const freshParams = parameters.getUpdatedAllParams ? parameters.getUpdatedAllParams() : parameters;
    
    const { 
      startConsumingTranslation, 
      translationSubscriptions, 
      speakerTranslationStates, 
      listenerTranslationOverrides,
      listenerTranslationPreferences 
    } = freshParams;
    
    const normalizedLang = translationMeta.language?.toLowerCase();
    
    // 1. SPEAKER-CONTROLLED (from metadata): Speaker set output language for everyone
    const isSpeakerControlledFromMeta = translationMeta.isSpeakerControlled === true;
    
    // 2. Fallback: Check local state - this tells us WHICH language the speaker chose
    const speakerState = speakerTranslationStates?.get(translationMeta.speakerId);
    
    // For speaker-controlled translations, we should ONLY consume the language the speaker chose
    // isSpeakerControlledFromMeta just tells us the speaker is in control mode
    // isSpeakerControlledFromState tells us this specific language matches what the speaker chose
    const isSpeakerControlledFromState = speakerState?.enabled && 
      speakerState?.outputLanguage?.toLowerCase() === normalizedLang;
    
    // If speaker-controlled mode but we don't have state yet OR language doesn't match, skip
    // This prevents consuming ALL translations when speaker only chose ONE language
    const shouldSkipBecauseWrongLanguage = isSpeakerControlledFromMeta && 
      speakerState?.enabled && 
      speakerState?.outputLanguage?.toLowerCase() !== normalizedLang;
    
    // 3. LISTENER SUBSCRIPTION: Listener explicitly chose this language
    const subscriptionKey = `${translationMeta.speakerId}_${normalizedLang}`;
    const isListenerSubscribed = translationSubscriptions?.has(subscriptionKey) ||
      translationSubscriptions?.has(translationMeta.speakerId);
    
    // 4. CHECK LISTENER PREFERENCES (server-synced, includes global preference)
    let overrideBlocksConsumption = false;
    let shouldConsumeForOverride = false;
    let shouldConsumeForGlobal = false;
    
    // Check per-speaker preference first (higher priority than global)
    const perSpeakerPref = listenerTranslationPreferences?.perSpeaker?.get(translationMeta.speakerId);
    const globalPref = listenerTranslationPreferences?.globalLanguage;
    
    // Also check legacy overrides for backwards compatibility
    const listenerOverride = listenerTranslationOverrides?.get(translationMeta.speakerId);
    
    if (perSpeakerPref) {
      // Per-speaker preference takes highest priority
      if (perSpeakerPref.wantOriginal) {
        overrideBlocksConsumption = true;
      } else if (perSpeakerPref.language) {
        if (perSpeakerPref.language === normalizedLang) {
          shouldConsumeForOverride = true;
        } else {
          overrideBlocksConsumption = true;
        }
      }
    } else if (globalPref) {
      // Global preference: "I want to hear everyone in Twi"
      if (globalPref === normalizedLang) {
        shouldConsumeForGlobal = true;
      } else {
        overrideBlocksConsumption = true;
      }
    } else if (listenerOverride) {
      // Legacy override support
      if (listenerOverride.wantOriginal) {
        overrideBlocksConsumption = true;
      } else if (listenerOverride.preferredLanguage) {
        if (listenerOverride.preferredLanguage.toLowerCase() === normalizedLang) {
          shouldConsumeForOverride = true;
        } else {
          overrideBlocksConsumption = true;
        }
      }
    }
    
    // Determine if we should consume:
    // - If listener has preference that blocks consumption, skip
    // - If speaker-controlled but this is the WRONG language, skip
    // - If listener has per-speaker or global preference that matches, consume
    // - If speaker-controlled (from metadata OR state) AND language matches, consume
    // - If listener is explicitly subscribed, consume
    
    // CRITICAL FIX: For speaker-controlled translations, we must verify the language matches
    // what the speaker chose. If speakerState is not yet synced, we cannot blindly trust
    // isSpeakerControlledFromMeta because multiple translation producers might exist.
    // Only consume speaker-controlled if:
    // 1. We have local speaker state confirming this exact language, OR
    // 2. This is the ONLY translation for this speaker (no state conflict possible)
    const shouldConsumeForSpeakerControlled = 
      isSpeakerControlledFromMeta && 
      (!speakerState?.enabled || speakerState?.outputLanguage?.toLowerCase() === normalizedLang);
    
    // If listener has NO preference (no global, no per-speaker), they should only consume
    // speaker-controlled translations - NOT translations requested by other listeners
    const hasNoPreference = !perSpeakerPref && !globalPref && !listenerOverride;
    const isListenerInitiated = !isSpeakerControlledFromMeta && !isSpeakerControlledFromState;
    
    // Block consumption if: listener has no preference AND this is listener-initiated
    // (meaning another listener requested this, not the speaker or this listener)
    const blockBecauseNotRelevant = hasNoPreference && isListenerInitiated && !isListenerSubscribed;
    
    const shouldConsume = 
      !overrideBlocksConsumption && 
      !shouldSkipBecauseWrongLanguage &&
      !blockBecauseNotRelevant &&
      (shouldConsumeForOverride || shouldConsumeForGlobal || shouldConsumeForSpeakerControlled || isSpeakerControlledFromState || isListenerSubscribed);

    if (shouldConsume && startConsumingTranslation) {
      try {
        await startConsumingTranslation(
          producerId,
          translationMeta.speakerId,
          translationMeta.language,
          translationMeta.originalProducerId,
          nsock
        );
      } catch (err) {
        console.error(`[newPipeProducer][Translation] startConsumingTranslation error:`, err);
      }
    }
    // For translation producers, we don't do any grid/UI updates
    return;
  }
  
  const {
    shareScreenStarted,
    shared,
    landScaped,
    showAlert,
    isWideScreen,
    updateFirst_round,
    updateLandScaped,
  } = parameters;

  // Signal new consumer transport
  await signalNewConsumerTransport({
    remoteProducerId: producerId,
    islevel,
    nsock,
    parameters
  });

  // Modify first_round and landscape status
  let updatedFirstRound = false;

  if (shareScreenStarted || shared) {
    if (!isWideScreen) {
      if (!landScaped) {
        if (showAlert) {
          showAlert({
            message: 'Please rotate your device to landscape mode for better experience',
            type: 'success',
            duration: 3000,
          });
        }
        updateLandScaped(true);
      }
    }

    updatedFirstRound = true;
    updateFirst_round(updatedFirstRound);
  }
};
