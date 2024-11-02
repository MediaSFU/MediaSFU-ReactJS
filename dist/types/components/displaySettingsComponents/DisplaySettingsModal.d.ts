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
 * DisplaySettingsModal component provides a modal interface for managing display settings with options for display types, audiograph, and video controls.
 *
 * @component
 * @param {DisplaySettingsModalOptions} props - The properties for DisplaySettingsModal.
 * @param {boolean} props.isDisplaySettingsModalVisible - Controls the modal's visibility.
 * @param {() => void} props.onDisplaySettingsClose - Function to close the modal.
 * @param {Function} [props.onModifyDisplaySettings=modifyDisplaySettings] - Callback for modifying settings.
 * @param {DisplaySettingsModalParameters} props.parameters - Display settings and related options.
 * @param {string} [props.position='topRight'] - Modal positioning on the screen.
 * @param {string} [props.backgroundColor='#83c0e9'] - Modal background color.
 *
 * @returns {JSX.Element} The rendered modal component.
 *
 * @example
 * ```tsx
 * import React, { useState } from 'react';
 * import { DisplaySettingsModal } from 'mediasfu-reactjs';
 *
 * const App = () => {
 *   const [modalVisible, setModalVisible] = useState(true);
 *   const handleModalClose = () => setModalVisible(false);
 *
 *   const parameters = {
 *     meetingDisplayType: "video",
 *     autoWave: true,
 *     forceFullDisplay: false,
 *     meetingVideoOptimized: true,
 *   };
 *
 *   return (
 *     <DisplaySettingsModal
 *       isDisplaySettingsModalVisible={modalVisible}
 *       onDisplaySettingsClose={handleModalClose}
 *       parameters={parameters}
 *       position="topRight"
 *       backgroundColor="#83c0e9"
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const DisplaySettingsModal: React.FC<DisplaySettingsModalOptions>;
export default DisplaySettingsModal;
//# sourceMappingURL=DisplaySettingsModal.d.ts.map