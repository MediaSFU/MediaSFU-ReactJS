import { ShowAlert } from "../../@types/types";
export interface StoppedRecordingOptions {
    state: string;
    reason: string;
    showAlert?: ShowAlert;
}
export type StoppedRecordingType = (options: StoppedRecordingOptions) => Promise<void>;
/**
 * Displays an alert message when the recording has stopped, indicating the reason.
 *
 * @param {StoppedRecordingOptions} options - Options for showing the recording stopped alert.
 * @param {string} options.state - The state of the recording, should be "stop" to trigger the alert.
 * @param {string} options.reason - Reason why the recording stopped.
 * @param {ShowAlert} [options.showAlert] - Optional function to display the alert message.
 *
 * @returns {Promise<void>} A promise that resolves once the alert is shown, if applicable.
 *
 * @example
 * ```typescript
 * const options = {
 *   state: "stop",
 *   reason: "The session ended.",
 *   showAlert: (alert) => console.log(alert.message),
 * };
 *
 * stoppedRecording(options);
 * // Output: "The recording has stopped - The session ended."
 * ```
 */
export declare const stoppedRecording: ({ state, reason, showAlert }: StoppedRecordingOptions) => Promise<void>;
//# sourceMappingURL=stoppedRecording.d.ts.map