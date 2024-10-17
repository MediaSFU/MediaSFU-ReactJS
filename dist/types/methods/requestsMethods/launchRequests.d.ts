export interface LaunchRequestsOptions {
    updateIsRequestsModalVisible: (isVisible: boolean) => void;
    isRequestsModalVisible: boolean;
}
export type LaunchRequestsType = (options: LaunchRequestsOptions) => void;
/**
 * Toggles the visibility state of the requests modal.
 *
 * @param {LaunchRequestsOptions} options - The options for launching requests.
 * @param {Function} options.updateIsRequestsModalVisible - Function to update the visibility state of the requests modal.
 * @param {boolean} options.isRequestsModalVisible - Current visibility state of the requests modal.
 * @returns {void}
 */
export declare const launchRequests: ({ updateIsRequestsModalVisible, isRequestsModalVisible }: LaunchRequestsOptions) => void;
//# sourceMappingURL=launchRequests.d.ts.map