import React from "react";
import { ModifyDisplaySettingsOptions, ModifyDisplaySettingsParameters } from "../../methods/displaySettingsMethods/modifyDisplaySettings";
export interface DisplaySettingsModalParameters extends ModifyDisplaySettingsParameters {
    meetingDisplayType: string;
    autoWave: boolean;
    forceFullDisplay: boolean;
    meetingVideoOptimized: boolean;
}
export interface DisplaySettingsModalOptions {
    isDisplaySettingsModalVisible: boolean;
    onDisplaySettingsClose: () => void;
    onModifyDisplaySettings?: (options: ModifyDisplaySettingsOptions) => Promise<void>;
    parameters: DisplaySettingsModalParameters;
    position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft";
    backgroundColor?: string;
}
export type DisplaySettingsModalType = (options: DisplaySettingsModalOptions) => JSX.Element;
/**
 * DisplaySettingsModal component renders a modal for adjusting display settings.
 *
 * @param {boolean} isDisplaySettingsModalVisible - Determines if the modal is visible.
 * @param {() => void} onDisplaySettingsClose - Callback function to close the modal.
 * @param {Function} [onModifyDisplaySettings=modifyDisplaySettings] - Callback function to modify display settings.
 * @param {Object} parameters - Object containing the display settings parameters.
 * @param {string} [position='topRight'] - Position of the modal on the screen.
 * @param {string} [backgroundColor='#83c0e9'] - Background color of the modal.
 *
 * @returns {JSX.Element} The rendered DisplaySettingsModal component.
 */
declare const DisplaySettingsModal: React.FC<DisplaySettingsModalOptions>;
export default DisplaySettingsModal;
//# sourceMappingURL=DisplaySettingsModal.d.ts.map