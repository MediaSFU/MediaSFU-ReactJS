export interface LaunchPollOptions {
    updateIsPollModalVisible: (isVisible: boolean) => void;
    isPollModalVisible: boolean;
}
export type LaunchPollType = (options: LaunchPollOptions) => void;
/**
 * Toggles the visibility of the poll modal.
 * @function
 * @param {Object} options - The options object containing necessary variables and functions.
 * @param {Function} options.updateIsPollModalVisible - Function to update the visibility state of the poll modal.
 * @param {boolean} options.isPollModalVisible - Current visibility state of the poll modal.
 */
export declare const launchPoll: ({ updateIsPollModalVisible, isPollModalVisible, }: LaunchPollOptions) => void;
//# sourceMappingURL=launchPoll.d.ts.map