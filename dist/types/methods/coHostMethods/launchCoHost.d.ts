export interface LaunchCoHostOptions {
    updateIsCoHostModalVisible: (isVisible: boolean) => void;
    isCoHostModalVisible: boolean;
}
export type LaunchCoHostType = (options: LaunchCoHostOptions) => void;
/**
 * Toggles the visibility of the co-host modal.
 *
 * @param updateIsCoHostModalVisible - Function to update the visibility state of the co-host modal.
 * @param isCoHostModalVisible - Current visibility state of the co-host modal.
 */
export declare const launchCoHost: ({ updateIsCoHostModalVisible, isCoHostModalVisible, }: LaunchCoHostOptions) => void;
//# sourceMappingURL=launchCoHost.d.ts.map