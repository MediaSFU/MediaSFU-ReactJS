import { SwitchUserAudioType, SwitchUserAudioParameters } from "../../@types/types";

export interface SwitchAudioParameters extends SwitchUserAudioParameters {
  defAudioID: string;
  userDefaultAudioInputDevice: string;
  prevAudioInputDevice: string;
  updateUserDefaultAudioInputDevice: (deviceId: string) => void;
  updatePrevAudioInputDevice: (deviceId: string) => void;

  // mediasfu functions
  switchUserAudio: SwitchUserAudioType;
  
  getUpdatedAllParams: () => SwitchAudioParameters;
  [key: string]: any;
}

export interface SwitchAudioOptions {
  audioPreference: string;
  parameters: SwitchAudioParameters;
}

// Export the type definition for the function
export type SwitchAudioType = (options: SwitchAudioOptions) => Promise<void>;

/**
 * Switches the audio input device based on user preference.
 *
 * @param {SwitchAudioParams} options - The function parameters.
 * @returns {Promise<void>}
 */
export const switchAudio = async ({ audioPreference, parameters }: SwitchAudioOptions): Promise<void> => {
  let {
    defAudioID,
    userDefaultAudioInputDevice,
    prevAudioInputDevice,
    updateUserDefaultAudioInputDevice,
    updatePrevAudioInputDevice,

    //mediasfu functions
    switchUserAudio,
  } = parameters;

  if (audioPreference !== defAudioID) {
    prevAudioInputDevice = userDefaultAudioInputDevice;
    updatePrevAudioInputDevice(prevAudioInputDevice);
    userDefaultAudioInputDevice = audioPreference;
    updateUserDefaultAudioInputDevice(userDefaultAudioInputDevice);

    if (defAudioID) {
      await switchUserAudio({ audioPreference, parameters });
    }
  }
};