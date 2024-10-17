export interface StartMeetingProgressTimerParameters {
    updateMeetingProgressTime: (formattedTime: string) => void;
    validated: boolean;
    roomName: string;
    getUpdatedAllParams: () => StartMeetingProgressTimerParameters;
    [key: string]: any;
}
export interface StartMeetingProgressTimerOptions {
    startTime: number;
    parameters: StartMeetingProgressTimerParameters;
}
export type StartMeetingProgressTimerType = (options: StartMeetingProgressTimerOptions) => void;
/**
 * Starts a timer to track the progress of a meeting.
 *
 * @param {Object} options - The options for starting the meeting progress timer.
 * @param {number} options.startTime - The custom start time for the meeting progress timer.
 * @param {Object} options.parameters - The parameters required for updating the meeting progress.
 * @param {Function} options.parameters.updateMeetingProgressTime - Function to update the meeting progress time.
 * @param {Function} options.parameters.getUpdatedAllParams - Function to get updated parameters.
 *
 * @returns {void}
 */
export declare function startMeetingProgressTimer({ startTime, parameters, }: StartMeetingProgressTimerOptions): void;
//# sourceMappingURL=startMeetingProgressTimer.d.ts.map