export interface LaunchMessagesOptions {
    updateIsMessagesModalVisible: (visible: boolean) => void;
    isMessagesModalVisible: boolean;
}
export type LaunchMessagesType = (options: LaunchMessagesOptions) => void;
/**
 * Toggles the visibility state of the messages modal.
 * If the modal is currently visible, it will be closed. If it's hidden, it will be opened.
 *
 * @param updateIsMessagesModalVisible - Function to update the visibility state of the messages modal.
 * @param isMessagesModalVisible - Current visibility state of the messages modal.
 */
export declare const launchMessages: ({ updateIsMessagesModalVisible, isMessagesModalVisible, }: LaunchMessagesOptions) => void;
//# sourceMappingURL=launchMessages.d.ts.map