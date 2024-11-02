export interface LaunchSettingsOptions {
    updateIsSettingsModalVisible: (isVisible: boolean) => void;
    isSettingsModalVisible: boolean;
}
export type LaunchSettingsType = (options: LaunchSettingsOptions) => void;
/**
 * Toggles the visibility state of the settings modal.
 *
 * @param {LaunchSettingsOptions} options - The options for launching settings.
 * @param {Function} options.updateIsSettingsModalVisible - Function to update the visibility state of the settings modal.
 * @param {boolean} options.isSettingsModalVisible - Current visibility state of the settings modal.
 * @returns {void}
 *
 * @example
 * ```typescript
 * launchSettings({
 *   isSettingsModalVisible: false,
 *   updateIsSettingsModalVisible: (visible) => setSettingsModalVisible(visible)
 * });
 * ```
 */
export declare const launchSettings: ({ updateIsSettingsModalVisible, isSettingsModalVisible }: LaunchSettingsOptions) => void;
//# sourceMappingURL=launchSettings.d.ts.map