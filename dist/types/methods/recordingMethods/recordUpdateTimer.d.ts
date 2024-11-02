export interface RecordUpdateTimerOptions {
    recordElapsedTime: number;
    recordStartTime: number;
    updateRecordElapsedTime: (elapsedTime: number) => void;
    updateRecordingProgressTime: (formattedTime: string) => void;
}
export type RecordUpdateTimerType = (options: RecordUpdateTimerOptions) => void;
/**
 * Updates the recording timer and progress time.
 * @function
 * @param {RecordUpdateTimerOptions} options - The options object containing necessary variables and functions.
 */
/**
 * Updates the recording timer by calculating the elapsed time since the recording started
 * and formatting it in HH:MM:SS format.
 *
 * @param {Object} options - The options object.
 * @param {number} options.recordElapsedTime - The elapsed recording time in seconds.
 * @param {number} options.recordStartTime - The timestamp when the recording started.
 * @param {Function} options.updateRecordElapsedTime - Callback to update the elapsed recording time.
 * @param {Function} options.updateRecordingProgressTime - Callback to update the formatted recording time.
 * @returns {void}
 *
 * @example
 * ```typescript
 * recordUpdateTimer({
 *   recordElapsedTime: 0,
 *   recordStartTime: Date.now(),
 *   updateRecordElapsedTime: (elapsedTime) => console.log("Elapsed Time:", elapsedTime),
 *   updateRecordingProgressTime: (formattedTime) => console.log("Recording Progress:", formattedTime),
 * });
 * ```
 */
export declare function recordUpdateTimer({ recordElapsedTime, recordStartTime, updateRecordElapsedTime, updateRecordingProgressTime, }: RecordUpdateTimerOptions): void;
//# sourceMappingURL=recordUpdateTimer.d.ts.map