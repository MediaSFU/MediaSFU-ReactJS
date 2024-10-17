import { ShowAlert, SwitchUserVideoAltType, SwitchUserVideoParameters } from "../../@types/types";
export interface SwitchVideoAltParameters extends SwitchUserVideoParameters {
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
 * @function
 * @async
 * @param {SwitchVideoAltParams} options - The parameters object containing necessary variables.
 */
export declare const switchVideoAlt: ({ parameters }: SwitchVideoAltOptions) => Promise<void>;
//# sourceMappingURL=switchVideoAlt.d.ts.map