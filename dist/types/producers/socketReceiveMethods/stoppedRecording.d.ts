import { ShowAlert } from "../../@types/types";
export interface StoppedRecordingOptions {
    state: string;
    reason: string;
    showAlert?: ShowAlert;
}
export type StoppedRecordingType = (options: StoppedRecordingOptions) => Promise<void>;
/**
 * Displays an alert message when the recording has stopped.
 *
 * @param {Object} options - The options for displaying the alert message.
 * @param {string} options.state - The state of the recording.
 * @param {string} options.reason - The reason for stopping the recording.
 * @param {Function} options.showAlert - Function to show alerts.
 * @returns {Promise<void>} A promise that resolves when the alert message is displayed.
 */
export declare const stoppedRecording: ({ state, reason, showAlert }: StoppedRecordingOptions) => Promise<void>;
//# sourceMappingURL=stoppedRecording.d.ts.map