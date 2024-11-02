import { Socket } from "socket.io-client";
import { CheckPermissionType, CheckScreenShareParameters, CheckScreenShareType, ShowAlert, StopShareScreenParameters, StopShareScreenType } from "../../@types/types";
export interface ClickScreenShareParameters extends CheckScreenShareParameters, StopShareScreenParameters {
    showAlert?: ShowAlert;
    roomName: string;
    member: string;
    socket: Socket;
    islevel: string;
    youAreCoHost: boolean;
    adminRestrictSetting: boolean;
    audioSetting: string;
    videoSetting: string;
    screenshareSetting: string;
    chatSetting: string;
    screenAction: boolean;
    screenAlreadyOn: boolean;
    screenRequestState: string | null;
    screenRequestTime: number;
    audioOnlyRoom: boolean;
    updateRequestIntervalSeconds: number;
    updateScreenRequestState: (state: string | null) => void;
    updateScreenAlreadyOn: (status: boolean) => void;
    checkPermission: CheckPermissionType;
    checkScreenShare: CheckScreenShareType;
    stopShareScreen: StopShareScreenType;
    getUpdatedAllParams: () => ClickScreenShareParameters;
    [key: string]: any;
}
export interface ClickScreenShareOptions {
    parameters: ClickScreenShareParameters;
}
export type ClickScreenShareType = (options: ClickScreenShareOptions) => Promise<void>;
/**
 * Handles the action for the screen button, including starting and stopping screen sharing.
 *
 * @param {ClickScreenShareOptions} options - Options for handling the screen button action.
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * clickScreenShare({
 *   parameters: {
 *     showAlert: showAlertFunction,
 *     roomName: "room123",
 *     member: "John Doe",
 *     socket: socketInstance,
 *     islevel: "1",
 *     youAreCoHost: false,
 *     adminRestrictSetting: false,
 *     audioSetting: "allow",
 *     videoSetting: "allow",
 *     screenshareSetting: "allow",
 *     chatSetting: "allow",
 *     screenAction: false,
 *     screenAlreadyOn: false,
 *     screenRequestState: null,
 *     screenRequestTime: Date.now(),
 *     audioOnlyRoom: false,
 *     updateRequestIntervalSeconds: 60,
 *     updateScreenRequestState: setScreenRequestState,
 *     updateScreenAlreadyOn: setScreenAlreadyOn,
 *     checkPermission: checkPermissionFunction,
 *     checkScreenShare: checkScreenShareFunction,
 *     stopShareScreen: stopShareScreenFunction,
 *     getUpdatedAllParams: getUpdatedParamsFunction
 *   }
 * });
 * ```
 */
export declare const clickScreenShare: ({ parameters }: ClickScreenShareOptions) => Promise<void>;
//# sourceMappingURL=clickScreenShare.d.ts.map