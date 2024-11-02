export interface LaunchParticipantsOptions {
    updateIsParticipantsModalVisible: (isVisible: boolean) => void;
    isParticipantsModalVisible: boolean;
}
export type LaunchParticipantsType = (options: LaunchParticipantsOptions) => void;
/**
 * Toggles the visibility of the participants modal.
 *
 * @param {LaunchParticipantsOptions} options - The options for toggling the participants modal.
 * @param {Function} options.updateIsParticipantsModalVisible - Function to update the visibility state of the participants modal.
 * @param {boolean} options.isParticipantsModalVisible - Current visibility state of the participants modal.
 *
 * @example
 * ```typescript
 * launchParticipants({
 *   updateIsParticipantsModalVisible: (isVisible) => setParticipantsModalVisible(isVisible),
 *   isParticipantsModalVisible: true,
 * });
 * ```
 */
export declare const launchParticipants: ({ updateIsParticipantsModalVisible, isParticipantsModalVisible, }: LaunchParticipantsOptions) => void;
//# sourceMappingURL=launchParticipants.d.ts.map