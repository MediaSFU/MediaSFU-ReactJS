export interface RecordStartTimerParameters {
    recordStartTime: number;
    recordTimerInterval?: NodeJS.Timeout | null;
    isTimerRunning: boolean;
    canPauseResume: boolean;
    recordChangeSeconds: number;
    recordPaused: boolean;
    recordStopped: boolean;
    roomName: string | null;
    updateRecordStartTime: (time: number) => void;
    updateRecordTimerInterval: (interval: NodeJS.Timeout | null) => void;
    updateIsTimerRunning: (isRunning: boolean) => void;
    updateCanPauseResume: (canPause: boolean) => void;
    getUpdatedAllParams: () => RecordStartTimerParameters;
    [key: string]: any;
}
export interface RecordStartTimerOptions {
    parameters: RecordStartTimerParameters;
}
export type RecordStartTimerType = (options: RecordStartTimerOptions) => Promise<void>;
/**
 * Starts the recording timer.
 * @function
 * @param {RecordStartTimerOptions} options - The options object containing necessary variables and functions.
 */
/**
 * Starts a recording timer and manages its state.
 *
 * @param {RecordStartTimerOptions} options - The options for starting the recording timer.
 * @param {Function} options.parameters.getUpdatedAllParams - Function to get updated parameters.
 * @param {number} options.parameters.recordStartTime - The start time of the recording.
 * @param {number | null} options.parameters.recordTimerInterval - The interval ID for the recording timer.
 * @param {boolean} options.parameters.isTimerRunning - Flag indicating if the timer is running.
 * @param {boolean} options.parameters.canPauseResume - Flag indicating if pause/resume actions are enabled.
 * @param {number} options.parameters.recordChangeSeconds - The time after which pause/resume actions are enabled.
 * @param {Function} options.parameters.updateRecordStartTime - Function to update the recording start time.
 * @param {Function} options.parameters.updateRecordTimerInterval - Function to update the recording timer interval.
 * @param {Function} options.parameters.updateIsTimerRunning - Function to update the timer running state.
 * @param {Function} options.parameters.updateCanPauseResume - Function to update the pause/resume state.
 *
 * @returns {Promise<void>} A promise that resolves when the timer is started.
 *
 * @remarks
 * This function initializes the recording start time and sets up an interval to update the timer every second.
 * It also manages the state of the timer, including enabling and disabling pause/resume actions.
 * The timer is stopped if the recording is paused, stopped, or if the room name is invalid.
 *
 * @example
 * ```typescript
 * recordStartTimer({
 *   parameters: {
 *     recordStartTime: Date.now(),
 *     recordTimerInterval: null,
 *     isTimerRunning: false,
 *     canPauseResume: false,
 *     recordChangeSeconds: 10000,
 *     updateRecordStartTime: (time) => console.log("Start time:", time),
 *     updateRecordTimerInterval: (interval) => console.log("Timer interval:", interval),
 *     updateIsTimerRunning: (isRunning) => console.log("Is timer running:", isRunning),
 *     updateCanPauseResume: (canPause) => console.log("Can pause/resume:", canPause),
 *     getUpdatedAllParams: () => updatedParameters,
 *   },
 * });
 * ```
 */
export declare function recordStartTimer({ parameters, }: RecordStartTimerOptions): Promise<void>;
//# sourceMappingURL=recordStartTimer.d.ts.map