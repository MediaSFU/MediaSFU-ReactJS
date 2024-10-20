import { Participant, CoHostResponsibility, OnScreenChangesType, OnScreenChangesParameters, Request, ConnectIpsParameters, ReorderStreamsParameters, ConnectIpsType, SleepType, ReorderStreamsType, Settings, ConsumeSocket } from "../../@types/types";
export interface AllMembersRestParameters extends OnScreenChangesParameters, ConnectIpsParameters, ReorderStreamsParameters {
    participantsAll: Participant[];
    participants: Participant[];
    dispActiveNames: string[];
    requestList: Request[];
    coHost: string;
    coHostResponsibility: CoHostResponsibility[];
    lock_screen: boolean;
    firstAll: boolean;
    membersReceived: boolean;
    roomRecvIPs: string[];
    deferScreenReceived: boolean;
    screenId?: string;
    shareScreenStarted: boolean;
    meetingDisplayType: string;
    audioSetting: string;
    videoSetting: string;
    screenshareSetting: string;
    chatSetting: string;
    updateParticipantsAll: (participantsAll: Participant[]) => void;
    updateParticipants: (participants: Participant[]) => void;
    updateRequestList: (requestList: Request[]) => void;
    updateCoHost: (coHost: string) => void;
    updateCoHostResponsibility: (coHostResponsibility: CoHostResponsibility[]) => void;
    updateFirstAll: (firstAll: boolean) => void;
    updateMembersReceived: (membersReceived: boolean) => void;
    updateDeferScreenReceived: (deferScreenReceived: boolean) => void;
    updateShareScreenStarted: (shareScreenStarted: boolean) => void;
    updateAudioSetting: (audioSetting: string) => void;
    updateVideoSetting: (videoSetting: string) => void;
    updateScreenshareSetting: (screenshareSetting: string) => void;
    updateChatSetting: (chatSetting: string) => void;
    updateConsume_sockets: (consume_sockets: ConsumeSocket[]) => void;
    updateRoomRecvIPs: (ips: string[]) => void;
    updateIsLoadingModalVisible: (visible: boolean) => void;
    onScreenChanges: OnScreenChangesType;
    connectIps: ConnectIpsType;
    sleep: SleepType;
    reorderStreams: ReorderStreamsType;
    getUpdatedAllParams: () => AllMembersRestParameters;
    [key: string]: any;
}
export interface AllMembersRestOptions {
    members: Participant[];
    settings: Settings;
    coHoste?: string;
    coHostRes?: CoHostResponsibility[];
    parameters: AllMembersRestParameters;
    consume_sockets: ConsumeSocket[];
    apiUserName: string;
    apiKey: string;
    apiToken: string;
}
export type AllMembersRestType = (options: AllMembersRestOptions) => Promise<void>;
/**
 * Handles the reception and processing of all members' data.
 *
 * @param {Object} options - The options for the function.
 * @param {Array} options.members - The list of members.
 * @param {Array} options.settings - The settings for audio, video, screenshare, and chat.
 * @param {any} options.coHoste - The co-host information.
 * @param {any} options.coHostRes - The co-host responsibility information.
 * @param {Object} options.parameters - The parameters for the function.
 * @param {Array} options.consume_sockets - The sockets to consume.
 * @param {string} options.apiUserName - The API username.
 * @param {string} options.apiKey - The API key.
 * @param {string} options.apiToken - The API token.
 *
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @typedef {Object} AllMembersRestOptions
 * @property {Array} members - The list of members.
 * @property {Array} settings - The settings for audio, video, screenshare, and chat.
 * @property {any} coHoste - The co-host information.
 * @property {any} coHostRes - The co-host responsibility information.
 * @property {Object} parameters - The parameters for the function.
 * @property {Array} consume_sockets - The sockets to consume.
 * @property {string} apiUserName - The API username.
 * @property {string} apiKey - The API key.
 * @property {string} apiToken - The API token.
 */
export declare const allMembersRest: ({ members, settings, coHoste, coHostRes, parameters, consume_sockets, apiUserName, apiKey, apiToken, }: AllMembersRestOptions) => Promise<void>;
//# sourceMappingURL=allMembersRest.d.ts.map