import { ShowAlert } from "../../@types/types";
export interface DisconnectOptions {
    showAlert?: ShowAlert;
    redirectURL?: string;
    onWeb: boolean;
    updateValidated?: (isValidated: boolean) => void;
}
export type DisconnectType = (options: DisconnectOptions) => Promise<void>;
/**
 * Handles the disconnection logic by either redirecting to a specified URL or showing an alert.
 *
 * @param {DisconnectOptions} options - The options for handling disconnection.
 * @param {Function} options.showAlert - Function to display an alert message.
 * @param {string} options.redirectURL - URL to redirect to if on the web.
 * @param {boolean} options.onWeb - Flag indicating if the operation is on the web.
 * @returns {Promise<void>} A promise that resolves when the disconnection handling is complete.
 */
export declare const disconnect: ({ showAlert, redirectURL, onWeb }: DisconnectOptions) => Promise<void>;
//# sourceMappingURL=disconnect.d.ts.map