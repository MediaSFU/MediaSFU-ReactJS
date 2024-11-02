import { ShowAlert } from "../../@types/types";
export interface RecordPauseTimerOptions {
    stop?: boolean;
    isTimerRunning: boolean;
    canPauseResume: boolean;
    showAlert?: ShowAlert;
}
export type RecordPauseTimerType = (options: RecordPauseTimerOptions) => boolean;
/**
 * Records the pause timer.
 *
 * @param {RecordPauseTimerOptions} options - The options for recording the pause timer.
 * @param {boolean} options.stop - A flag to stop the timer.
 * @param {boolean} options.isTimerRunning - A flag to check if the timer is running.
 * @param {boolean} options.canPauseResume - A flag to check if the timer can be paused or resumed.
 * @param {Function} options.showAlert - A function to show alerts.
 * @returns {boolean} A boolean value indicating if the timer can be paused or resumed.
 *
 * @example
 * ```typescript
 * const canPause = recordPauseTimer({
 *   stop: false,
 *   isTimerRunning: true,
 *   canPauseResume: true,
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * console.log("Can pause:", canPause); // Logs true or shows alert if conditions not met
 * ```
 */
export declare function recordPauseTimer({ stop, isTimerRunning, canPauseResume, showAlert }: RecordPauseTimerOptions): boolean;
//# sourceMappingURL=recordPauseTimer.d.ts.map