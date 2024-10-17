export interface LaunchConfirmExitOptions {
    updateIsConfirmExitModalVisible: (isVisible: boolean) => void;
    isConfirmExitModalVisible: boolean;
}
export type LaunchConfirmExitType = (options: LaunchConfirmExitOptions) => void;
/**
 * Toggles the visibility of the confirmation exit modal.
 *
 * @param updateIsConfirmExitModalVisible - Function to update the visibility state of the confirmation exit modal.
 * @param isConfirmExitModalVisible - Current visibility state of the confirmation exit modal.
 */
export declare const launchConfirmExit: ({ updateIsConfirmExitModalVisible, isConfirmExitModalVisible, }: LaunchConfirmExitOptions) => void;
//# sourceMappingURL=launchConfirmExit.d.ts.map