export interface LaunchMenuModalOptions {
    updateIsMenuModalVisible: (isVisible: boolean) => void;
    isMenuModalVisible: boolean;
}
export type LaunchMenuModalType = (options: LaunchMenuModalOptions) => void;
/**
 * Toggles the visibility of the menu modal.
 *
 * @param updateIsMenuModalVisible - Function to update the visibility state of the menu modal.
 * @param isMenuModalVisible - Current visibility state of the menu modal.
 */
export declare const launchMenuModal: ({ updateIsMenuModalVisible, isMenuModalVisible, }: LaunchMenuModalOptions) => void;
//# sourceMappingURL=launchMenuModal.d.ts.map