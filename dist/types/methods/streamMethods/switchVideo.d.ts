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
 * @param {SwitchVideoOptions} options - The function parameters.
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * switchVideo({
 *   videoPreference: "newVideoDeviceID",
 *   parameters: {
 *     recordStarted: true,
 *     recordResumed: false,
 *     recordStopped: false,
 *     recordPaused: false,
 *     recordingMediaOptions: "video",
 *     videoAlreadyOn: true,
 *     userDefaultVideoInputDevice: "currentVideoDeviceID",
 *     defVideoID: "defaultVideoDeviceID",
 *     allowed: true,
 *     updateDefVideoID: (deviceId) => setDefVideoID(deviceId),
 *     updatePrevVideoInputDevice: (deviceId) => setPrevVideoDevice(deviceId),
 *     updateUserDefaultVideoInputDevice: (deviceId) => setUserDefaultVideo(deviceId),
 *     updateIsMediaSettingsModalVisible: (isVisible) => setMediaSettingsModal(isVisible),
 *     showAlert: (alertOptions) => showAlert(alertOptions),
 *     switchUserVideo: switchUserVideoFunction,
 *   }
 * });
 * ```
 */
export declare const switchVideo: ({ videoPreference, parameters }: SwitchVideoOptions) => Promise<void>;
//# sourceMappingURL=switchVideo.d.ts.map