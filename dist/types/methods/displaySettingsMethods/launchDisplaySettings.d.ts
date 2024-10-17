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
 */
export declare const launchDisplaySettings: ({ updateIsDisplaySettingsModalVisible, isDisplaySettingsModalVisible, }: LaunchDisplaySettingsOptions) => void;
//# sourceMappingURL=launchDisplaySettings.d.ts.map