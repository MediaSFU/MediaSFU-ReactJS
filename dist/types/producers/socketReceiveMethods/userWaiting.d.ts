import { ShowAlert } from "../../@types/types";
export interface UserWaitingOptions {
    name: string;
    showAlert?: ShowAlert;
    totalReqWait: number;
    updateTotalReqWait: (total: number) => void;
}
export type UserWaitingType = (options: UserWaitingOptions) => Promise<void>;
/**
 * Handles the event when a user joins the waiting room, displaying a notification and updating the count of waiting requests.
 *
 * @param {Object} options - The options for managing the user waiting event.
 * @param {string} options.name - The name of the user joining the waiting room.
 * @param {Function} [options.showAlert] - Optional function to display an alert/notification.
 * @param {number} options.totalReqWait - The current total count of requests waiting.
 * @param {Function} options.updateTotalReqWait - Function to update the total number of requests in the waiting room.
 * @returns {Promise<void>} A promise that resolves when the waiting event is fully handled.
 *
 * @example
 * ```typescript
 * const options = {
 *   name: "John Doe",
 *   showAlert: (alert) => console.log(alert.message),
 *   totalReqWait: 3,
 *   updateTotalReqWait: (total) => console.log("Updated total:", total),
 * };
 *
 * userWaiting(options)
 *   .then(() => console.log("User waiting handled"))
 *   .catch((error) => console.error("Error:", error));
 * ```
 */
export declare const userWaiting: ({ name, showAlert, totalReqWait, updateTotalReqWait }: UserWaitingOptions) => Promise<void>;
//# sourceMappingURL=userWaiting.d.ts.map