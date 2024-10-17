import { ShowAlert } from "../../@types/types";
export interface RecordResumeTimerParameters {
    isTimerRunning: boolean;
    canPauseResume: boolean;
    recordElapsedTime: number;
    recordStartTime: number;
    recordTimerInterval?: NodeJS.Timeout | null;
    showAlert?: ShowAlert;
    updateRecordStartTime: (time: number) => void;
    updateRecordTimerInterval: (interval: NodeJS.Timeout | null) => void;
    updateIsTimerRunning: (isRunning: boolean) => void;
    updateCanPauseResume: (canPause: boolean) => void;
    getUpdatedAllParams: () => RecordResumeTimerParameters;
    [key: string]: any;
}
export interface RecordResumeTimerOptions {
    parameters: RecordResumeTimerParameters;
}
export type RecordResumeTimerType = (options: RecordResumeTimerOptions) => Promise<boolean>;
/**
 * Resumes the recording timer if it is not already running and can be paused/resumed.
 *
 * @param {RecordResumeTimerOptions} options - The options for resuming the recording timer.
 * @param {Object} options.parameters - The parameters for the recording timer.
 * @param {Function} options.parameters.getUpdatedAllParams - Function to get updated parameters.
 * @param {boolean} options.parameters.isTimerRunning - Indicates if the timer is currently running.
 * @param {boolean} options.parameters.canPauseResume - Indicates if the timer can be paused/resumed.
 * @param {number} options.parameters.recordElapsedTime - The elapsed recording time in seconds.
 * @param {number} options.parameters.recordStartTime - The start time of the recording.
 * @param {number | null} options.parameters.recordTimerInterval - The interval ID for the recording timer.
 * @param {Function} options.parameters.showAlert - Function to show an alert message.
 * @param {Function} options.parameters.updateRecordStartTime - Function to update the recording start time.
 * @param {Function} options.parameters.updateRecordTimerInterval - Function to update the recording timer interval.
 * @param {Function} options.parameters.updateIsTimerRunning - Function to update the timer running status.
 * @param {Function} options.parameters.updateCanPauseResume - Function to update the pause/resume status.
 *
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the timer was successfully resumed, otherwise false.
 */
export declare function recordResumeTimer({ parameters, }: RecordResumeTimerOptions): Promise<boolean>;
//# sourceMappingURL=recordResumeTimer.d.ts.map