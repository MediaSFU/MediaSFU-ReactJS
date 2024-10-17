export interface LaunchWaitingOptions {
    updateIsWaitingModalVisible: (visible: boolean) => void;
    isWaitingModalVisible: boolean;
}
export type LaunchWaitingType = (options: LaunchWaitingOptions) => void;
/**
 * Toggles the visibility of the waiting modal.
 *
 * @param updateIsWaitingModalVisible - Function to update the visibility state of the waiting modal.
 * @param isWaitingModalVisible - Current visibility state of the waiting modal.
 */
export declare const launchWaiting: ({ updateIsWaitingModalVisible, isWaitingModalVisible, }: LaunchWaitingOptions) => void;
//# sourceMappingURL=launchWaiting.d.ts.map