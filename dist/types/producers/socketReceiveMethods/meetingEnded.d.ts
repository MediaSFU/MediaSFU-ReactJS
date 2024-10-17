import { EventType, ShowAlert } from "../../@types/types";
export interface MeetingEndedOptions {
    showAlert?: ShowAlert;
    redirectURL?: string;
    onWeb: boolean;
    eventType: EventType;
    updateValidated?: (isValid: boolean) => void;
}
export type MeetingEndedType = (options: MeetingEndedOptions) => Promise<void>;
/**
 * Handles the end of a meeting by showing an alert and redirecting the user.
 *
 * @param {MeetingEndedOptions} options - The options for handling the meeting end.
 * @param {Function} options.showAlert - Function to show an alert message.
 * @param {string} options.redirectURL - URL to redirect to after the meeting ends.
 * @param {boolean} options.onWeb - Flag indicating if the application is running on the web.
 * @param {string} options.eventType - Type of the event that triggered the meeting end.
 *
 * @returns {Promise<void>} A promise that resolves when the meeting end handling is complete.
 */
export declare const meetingEnded: ({ showAlert, redirectURL, onWeb, eventType }: MeetingEndedOptions) => Promise<void>;
//# sourceMappingURL=meetingEnded.d.ts.map