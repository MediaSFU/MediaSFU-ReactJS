import { ClickVideoParameters } from "../methods/streamMethods/clickVideo";
import { ShowAlert, VidCons, RequestPermissionCameraType, StreamSuccessVideoType, SleepType, StreamSuccessVideoParameters } from "../@types/types";
export interface SwitchUserVideoAltParameters extends StreamSuccessVideoParameters, ClickVideoParameters {
    audioOnlyRoom: boolean;
    frameRate: number;
    vidCons: VidCons;
    showAlert?: ShowAlert;
    mediaDevices: MediaDevices;
    hasCameraPermission: boolean;
    updateVideoSwitching: (state: boolean) => void;
    updateCurrentFacingMode: (mode: string) => void;
    requestPermissionCamera: RequestPermissionCameraType;
    streamSuccessVideo: StreamSuccessVideoType;
    sleep: SleepType;
    checkMediaPermission: boolean;
    getUpdatedAllParams: () => SwitchUserVideoAltParameters;
    [key: string]: any;
}
export interface SwitchUserVideoAltOptions {
    videoPreference: string;
    checkoff: boolean;
    parameters: SwitchUserVideoAltParameters;
}
export type SwitchUserVideoAltType = (options: SwitchUserVideoAltOptions) => Promise<void>;
/**
 * Switches the user's video stream based on the provided video preference and other parameters.
 *
 * @param {SwitchUserVideoAltOptions} options - The options for switching the user's video.
 * @param {string} options.videoPreference - The preferred video facing mode (e.g., "user" or "environment").
 * @param {boolean} options.checkoff - A flag indicating whether to turn off the video before switching.
 * @param {SwitchUserVideoAltParameters} options.parameters - The parameters required for switching the video.
 *
 * @returns {Promise<void>} A promise that resolves when the video switching is complete.
 *
 * @throws Will throw an error if there is an issue with switching the video.
 *
 * @example
 * ```typescript
 * const options = {
 *   videoPreference: "user",
 *   checkoff: false,
 *   parameters: {
 *     audioOnlyRoom: false,
 *     frameRate: 30,
 *     vidCons: { width: 640, height: 480 },
 *     showAlert: showNotification,
 *     mediaDevices: navigator.mediaDevices,
 *     hasCameraPermission: true,
 *     updateVideoSwitching: updateVideoSwitchingState,
 *     updateCurrentFacingMode: updateCurrentFacingMode,
 *     requestPermissionCamera: requestCameraPermission,
 *     streamSuccessVideo: streamSuccessVideoFunction,
 *     sleep: sleepFunction,
 *     checkMediaPermission: true,
 *     getUpdatedAllParams: getUpdatedAllParamsFunction,
 *   },
 * };
 *
 * switchUserVideoAlt(options)
 *   .then(() => {
 *     console.log("Video switched successfully");
 *   })
 *   .catch((error) => {
 *     console.error("Error switching video:", error);
 *   });
 * ```
 */
export declare function switchUserVideoAlt({ videoPreference, checkoff, parameters, }: SwitchUserVideoAltOptions): Promise<void>;
//# sourceMappingURL=switchUserVideoAlt.d.ts.map