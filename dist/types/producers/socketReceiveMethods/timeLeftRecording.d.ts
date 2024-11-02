import { ShowAlert } from "../../@types/types";
export interface TimeLeftRecordingOptions {
    timeLeft: number;
    showAlert?: ShowAlert;
}
export type TimeLeftRecordingType = (options: TimeLeftRecordingOptions) => void;
/**
 * Displays an alert message indicating the remaining time left for recording.
 *
 * @param {TimeLeftRecordingOptions} options - Options to manage time left for recording.
 * @param {number} options.timeLeft - Time remaining for the recording in seconds.
 * @param {ShowAlert} [options.showAlert] - Optional function to show alert message.
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * const options = {
 *   timeLeft: 30,
 *   showAlert: (alert) => console.log(alert.message),
 * };
 *
 * timeLeftRecording(options);
 * // Output: "The recording will stop in less than 30 seconds."
 * ```
 */
export declare const timeLeftRecording: ({ timeLeft, showAlert }: TimeLeftRecordingOptions) => void;
//# sourceMappingURL=timeLeftRecording.d.ts.map