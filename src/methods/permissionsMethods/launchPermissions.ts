/**
 * launchPermissions - Toggles the visibility of the permissions modal.
 *
 * @param {LaunchPermissionsOptions} options - Options for launching the permissions modal.
 * @param {Function} options.updateIsPermissionsModalVisible - Callback to update modal visibility.
 * @param {boolean} options.isPermissionsModalVisible - Current modal visibility state.
 *
 * @example
 * ```typescript
 * launchPermissions({
 *   updateIsPermissionsModalVisible: (visible) => setPermissionsModalVisible(visible),
 *   isPermissionsModalVisible: false,
 * });
 * ```
 */

export interface LaunchPermissionsOptions {
  updateIsPermissionsModalVisible: (visible: boolean) => void;
  isPermissionsModalVisible: boolean;
}

export type LaunchPermissionsType = (options: LaunchPermissionsOptions) => void;

export const launchPermissions = ({
  updateIsPermissionsModalVisible,
  isPermissionsModalVisible,
}: LaunchPermissionsOptions): void => {
  updateIsPermissionsModalVisible(!isPermissionsModalVisible);
};
