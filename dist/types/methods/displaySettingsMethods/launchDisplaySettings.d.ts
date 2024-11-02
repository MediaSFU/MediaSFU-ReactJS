export interface LaunchDisplaySettingsOptions {
    updateIsDisplaySettingsModalVisible: (isVisible: boolean) => void;
    isDisplaySettingsModalVisible: boolean;
}
export type LaunchDisplaySettingsType = (options: LaunchDisplaySettingsOptions) => void;
/**
 * Toggles the visibility of the display settings modal.
 *
 * @param updateIsDisplaySettingsModalVisible - Function to update the visibility state of the display settings modal.
 * @param isDisplaySettingsModalVisible - Current visibility state of the display settings modal.
 *
 * @example
 * ```typescript
 * const options: LaunchDisplaySettingsOptions = {
 *   updateIsDisplaySettingsModalVisible: setModalVisibilityFunction,
 *   isDisplaySettingsModalVisible: false,
 * };
 *
 * launchDisplaySettings(options);
 * // This will open the display settings modal if it's currently closed, or close it if it's open.
 * ```
 */
export declare const launchDisplaySettings: ({ updateIsDisplaySettingsModalVisible, isDisplaySettingsModalVisible, }: LaunchDisplaySettingsOptions) => void;
//# sourceMappingURL=launchDisplaySettings.d.ts.map