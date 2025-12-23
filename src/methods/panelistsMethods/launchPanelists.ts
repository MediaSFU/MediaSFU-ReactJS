/**
 * launchPanelists - Toggles the visibility of the panelists modal.
 *
 * @param {LaunchPanelistsOptions} options - Options for launching the panelists modal.
 * @param {Function} options.updateIsPanelistsModalVisible - Callback to update modal visibility.
 * @param {boolean} options.isPanelistsModalVisible - Current modal visibility state.
 *
 * @example
 * ```typescript
 * launchPanelists({
 *   updateIsPanelistsModalVisible: (visible) => setPanelistsModalVisible(visible),
 *   isPanelistsModalVisible: false,
 * });
 * ```
 */

export interface LaunchPanelistsOptions {
  updateIsPanelistsModalVisible: (visible: boolean) => void;
  isPanelistsModalVisible: boolean;
}

export type LaunchPanelistsType = (options: LaunchPanelistsOptions) => void;

export const launchPanelists = ({
  updateIsPanelistsModalVisible,
  isPanelistsModalVisible,
}: LaunchPanelistsOptions): void => {
  updateIsPanelistsModalVisible(!isPanelistsModalVisible);
};
