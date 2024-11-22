import { ShowAlert, SwitchUserVideoAltType, SwitchUserVideoAltParameters } from "../../@types/types";
export interface SwitchVideoAltParameters extends SwitchUserVideoAltParameters {
    recordStarted: boolean;
    recordResumed: boolean;
    recordStopped: boolean;
    recordPaused: boolean;
    recordingMediaOptions: string;
    videoAlreadyOn: boolean;
    currentFacingMode: string;
    prevFacingMode: string;
    allowed: boolean;
    audioOnlyRoom: boolean;
    updateCurrentFacingMode: (mode: string) => void;
    updatePrevFacingMode: (mode: string) => void;
    updateIsMediaSettingsModalVisible: (isVisible: boolean) => void;
    showAlert?: ShowAlert;
    switchUserVideoAlt: SwitchUserVideoAltType;
    getUpdatedAllParams: () => SwitchVideoAltParameters;
    [key: string]: any;
}
export interface SwitchVideoAltOptions {
    parameters: SwitchVideoAltParameters;
}
export type SwitchVideoAltType = (options: SwitchVideoAltOptions) => Promise<void>;
/**
 * Switches the user's video device with alternate logic, taking into account recording state and camera access permissions.
 *
 * @param {SwitchVideoAltOptions} options - The parameters object containing necessary variables.
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * switchVideoAlt({
 *   parameters: {
 *     recordStarted: true,
 *     recordResumed: false,
 *     recordStopped: false,
 *     recordPaused: false,
 *     recordingMediaOptions: 'video',
 *     videoAlreadyOn: true,
 *     currentFacingMode: 'user',
 *     prevFacingMode: 'environment',
 *     allowed: true,
 *     audioOnlyRoom: false,
 *     updateCurrentFacingMode: (mode) => setCurrentFacingMode(mode),
 *     updatePrevFacingMode: (mode) => setPrevFacingMode(mode),
 *     updateIsMediaSettingsModalVisible: (isVisible) => setMediaSettingsModal(isVisible),
 *     showAlert: (alertOptions) => showAlert(alertOptions),
 *     switchUserVideoAlt: switchUserVideoAltFunction,
 *   }
 * });
 * ```
 */
export declare const switchVideoAlt: ({ parameters }: SwitchVideoAltOptions) => Promise<void>;
//# sourceMappingURL=switchVideoAlt.d.ts.map