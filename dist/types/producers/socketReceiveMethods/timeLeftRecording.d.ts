import { ShowAlert } from "../../@types/types";
export interface TimeLeftRecordingOptions {
    timeLeft: number;
    showAlert?: ShowAlert;
}
export type TimeLeftRecordingType = (options: TimeLeftRecordingOptions) => void;
/**
 * Displays an alert message indicating the remaining time left for recording.
 *
 * @param {TimeLeftRecordingOptions} options - The options for the time left recording.
 * @param {number} options.timeLeft - The amount of time left in seconds.
 * @param {Function} options.showAlert - The function to display the alert message.
 *
 * @throws {Error} If there is an issue displaying the alert message.
 */
export declare const timeLeftRecording: ({ timeLeft, showAlert }: TimeLeftRecordingOptions) => void;
//# sourceMappingURL=timeLeftRecording.d.ts.map