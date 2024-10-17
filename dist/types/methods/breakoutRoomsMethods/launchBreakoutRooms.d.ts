export interface LaunchBreakoutRoomsOptions {
    updateIsBreakoutRoomsModalVisible: (isVisible: boolean) => void;
    isBreakoutRoomsModalVisible: boolean;
}
export type LaunchBreakoutRoomsType = (options: LaunchBreakoutRoomsOptions) => void;
/**
 * Launches the breakout rooms by toggling the visibility of the breakout rooms modal.
 *
 * @param updateIsBreakoutRoomsModalVisible - Function to update the visibility state of the breakout rooms modal.
 * @param isBreakoutRoomsModalVisible - Current visibility state of the breakout rooms modal.
 */
export declare const launchBreakoutRooms: ({ updateIsBreakoutRoomsModalVisible, isBreakoutRoomsModalVisible, }: LaunchBreakoutRoomsOptions) => void;
//# sourceMappingURL=launchBreakoutRooms.d.ts.map