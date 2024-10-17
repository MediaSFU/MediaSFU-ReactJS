export interface LaunchConfigureWhiteboardOptions {
    updateIsConfigureWhiteboardModalVisible: (visible: boolean) => void;
    isConfigureWhiteboardModalVisible: boolean;
}
export type LaunchConfigureWhiteboardType = (options: LaunchConfigureWhiteboardOptions) => void;
/**
 * Toggles the visibility of the configure whiteboard modal.
 *
 * @param updateIsConfigureWhiteboardModalVisible - Function to update the visibility state of the configure whiteboard modal.
 * @param isConfigureWhiteboardModalVisible - Current visibility state of the configure whiteboard modal.
 */
export declare const launchConfigureWhiteboard: ({ updateIsConfigureWhiteboardModalVisible, isConfigureWhiteboardModalVisible, }: LaunchConfigureWhiteboardOptions) => void;
//# sourceMappingURL=launchConfigureWhiteboard.d.ts.map