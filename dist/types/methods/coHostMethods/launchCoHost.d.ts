export interface LaunchCoHostOptions {
    updateIsCoHostModalVisible: (isVisible: boolean) => void;
    isCoHostModalVisible: boolean;
}
export type LaunchCoHostType = (options: LaunchCoHostOptions) => void;
/**
 * Toggles the visibility of the co-host modal.
 *
 * @param {Function} updateIsCoHostModalVisible - Function to update the visibility state of the co-host modal.
 * @param {boolean} isCoHostModalVisible - Current visibility state of the co-host modal.
 *
 * @example
 * ```typescript
 * const options: LaunchCoHostOptions = {
 *   updateIsCoHostModalVisible: setModalVisible,
 *   isCoHostModalVisible: false,
 * };
 *
 * launchCoHost(options);
 * // Toggles the co-host modal to visible.
 * ```
 */
export declare const launchCoHost: ({ updateIsCoHostModalVisible, isCoHostModalVisible, }: LaunchCoHostOptions) => void;
//# sourceMappingURL=launchCoHost.d.ts.map