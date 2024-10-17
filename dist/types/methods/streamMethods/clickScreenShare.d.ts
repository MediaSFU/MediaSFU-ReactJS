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
 * @param {ClickScreenShareParams} options - Options for handling the screen button action.
 * @returns {Promise<void>}
 */
export declare const clickScreenShare: ({ parameters }: ClickScreenShareOptions) => Promise<void>;
//# sourceMappingURL=clickScreenShare.d.ts.map