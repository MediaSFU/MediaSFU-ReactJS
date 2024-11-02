export interface LaunchWaitingOptions {
    updateIsWaitingModalVisible: (visible: boolean) => void;
    isWaitingModalVisible: boolean;
}
export type LaunchWaitingType = (options: LaunchWaitingOptions) => void;
/**
 * Toggles the visibility of the waiting modal.
 *
 * @param {LaunchWaitingOptions} options - The options for toggling the waiting modal visibility.
 * @param {Function} options.updateIsWaitingModalVisible - Function to update the visibility state of the waiting modal.
 * @param {boolean} options.isWaitingModalVisible - Current visibility state of the waiting modal.
 *
 * @example
 * ```typescript
 * const options = {
 *   updateIsWaitingModalVisible: (visible: boolean) => console.log("Waiting modal visibility updated:", visible),
 *   isWaitingModalVisible: true,
 * };
 * launchWaiting(options); // Toggles the modal visibility
 * ```
 */
export declare const launchWaiting: ({ updateIsWaitingModalVisible, isWaitingModalVisible, }: LaunchWaitingOptions) => void;
//# sourceMappingURL=launchWaiting.d.ts.map