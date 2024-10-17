import { SwitchUserAudioType, SwitchUserAudioParameters } from "../../@types/types";
export interface SwitchAudioParameters extends SwitchUserAudioParameters {
    defAudioID: string;
    userDefaultAudioInputDevice: string;
    prevAudioInputDevice: string;
    updateUserDefaultAudioInputDevice: (deviceId: string) => void;
    updatePrevAudioInputDevice: (deviceId: string) => void;
    switchUserAudio: SwitchUserAudioType;
    getUpdatedAllParams: () => SwitchAudioParameters;
    [key: string]: any;
}
export interface SwitchAudioOptions {
    audioPreference: string;
    parameters: SwitchAudioParameters;
}
export type SwitchAudioType = (options: SwitchAudioOptions) => Promise<void>;
/**
 * Switches the audio input device based on user preference.
 *
 * @param {SwitchAudioParams} options - The function parameters.
 * @returns {Promise<void>}
 */
export declare const switchAudio: ({ audioPreference, parameters }: SwitchAudioOptions) => Promise<void>;
//# sourceMappingURL=switchAudio.d.ts.map