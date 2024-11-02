export interface LaunchPollOptions {
    updateIsPollModalVisible: (isVisible: boolean) => void;
    isPollModalVisible: boolean;
}
export type LaunchPollType = (options: LaunchPollOptions) => void;
/**
 * Toggles the visibility of the poll modal.
 *
 * @param {LaunchPollOptions} options - The options for toggling the poll modal visibility.
 * @param {Function} options.updateIsPollModalVisible - Function to update the visibility state of the poll modal.
 * @param {boolean} options.isPollModalVisible - Current visibility state of the poll modal.
 *
 * @example
 * ```typescript
 * launchPoll({
 *   updateIsPollModalVisible: (visible) => setIsPollModalVisible(visible),
 *   isPollModalVisible: false,
 * });
 * ```
 */
export declare const launchPoll: ({ updateIsPollModalVisible, isPollModalVisible, }: LaunchPollOptions) => void;
//# sourceMappingURL=launchPoll.d.ts.map