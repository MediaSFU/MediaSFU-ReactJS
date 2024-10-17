import { ShowAlert, SwitchUserVideoParameters, SwitchUserVideoType } from "../../@types/types";
export interface SwitchVideoParameters extends SwitchUserVideoParameters {
    recordStarted: boolean;
    recordResumed: boolean;
    recordStopped: boolean;
    recordPaused: boolean;
    recordingMediaOptions: string;
    videoAlreadyOn: boolean;
    userDefaultVideoInputDevice: string;
    defVideoID: string;
    allowed: boolean;
    updateDefVideoID: (deviceId: string) => void;
    updatePrevVideoInputDevice: (deviceId: string) => void;
    updateUserDefaultVideoInputDevice: (deviceId: string) => void;
    updateIsMediaSettingsModalVisible: (isVisible: boolean) => void;
    showAlert?: ShowAlert;
    switchUserVideo: SwitchUserVideoType;
    [key: string]: any;
}
export interface SwitchVideoOptions {
    videoPreference: string;
    parameters: SwitchVideoParameters;
}
export type SwitchVideoType = (options: SwitchVideoOptions) => Promise<void>;
/**
 * Switches the user's video device based on the provided video preference.
 *
 * @param {SwitchVideoParams} options - The function parameters.
 */
export declare const switchVideo: ({ videoPreference, parameters }: SwitchVideoOptions) => Promise<void>;
//# sourceMappingURL=switchVideo.d.ts.map