import { ShowAlert } from "../../@types/types";
export interface PersonJoinedOptions {
    showAlert?: ShowAlert;
    name: string;
}
export type PersonJoinedType = (options: PersonJoinedOptions) => Promise<void>;
/**
 * Handles the event when a person joins.
 *
 * @param {PersonJoinedOptions} options - The options for the person joined event.
 * @param {string} options.name - The name of the person who joined.
 * @param {Function} [options.showAlert] - Optional function to display an alert/notification.
 * @returns {Promise<void>} A promise that resolves when the alert has been shown.
 *
 * @example
 * ```typescript
 * const options = {
 *   name: "Alice",
 *   showAlert: ({ message, type, duration }) => console.log(message, type, duration),
 * };
 *
 * await personJoined(options);
 * // Output: "Alice joined the event." (Displayed as a success alert for 3000 ms)
 * ```
 */
export declare const personJoined: ({ name, showAlert }: PersonJoinedOptions) => Promise<void>;
//# sourceMappingURL=personJoined.d.ts.map