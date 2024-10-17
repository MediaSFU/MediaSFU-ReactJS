export interface LaunchBackgroundOptions {
    updateIsBackgroundModalVisible: (isVisible: boolean) => void;
    isBackgroundModalVisible: boolean;
}
export type LaunchBackgroundType = (options: LaunchBackgroundOptions) => void;
/**
 * Toggles the visibility of the background modal.
 * @function
 * @param {Object} options - The options object containing necessary variables and functions.
 * @param {Function} options.updateIsBackgroundModalVisible - Function to update the visibility state of the background modal.
 * @param {boolean} options.isBackgroundModalVisible - Current visibility state of the background modal.
 */
export declare const launchBackground: ({ updateIsBackgroundModalVisible, isBackgroundModalVisible }: LaunchBackgroundOptions) => void;
//# sourceMappingURL=launchBackground.d.ts.map