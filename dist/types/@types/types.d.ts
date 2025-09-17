import { Socket } from 'socket.io-client';
import { Consumer, DtlsParameters, IceCandidate, IceParameters, RtpCapabilities } from 'mediasoup-client/lib/types';
export * from '../consumers/socketReceiveMethods/joinConsumeRoom';
export * from '../consumers/socketReceiveMethods/producerClosed';
export * from '../consumers/socketReceiveMethods/newPipeProducer';
export * from '../consumers/addVideosGrid';
export * from '../consumers/autoAdjust';
export * from '../consumers/calculateRowsAndColumns';
export * from '../consumers/changeVids';
export * from '../consumers/checkGrid';
export * from '../consumers/checkPermission';
export * from '../consumers/checkScreenShare';
export * from '../consumers/closeAndResize';
export * from '../consumers/compareActiveNames';
export * from '../consumers/compareScreenStates';
export * from '../consumers/connectIps';
export * from '../consumers/connectLocalIps';
export * from '../consumers/connectRecvTransport';
export * from '../consumers/connectSendTransport';
export * from '../consumers/connectSendTransportAudio';
export * from '../consumers/connectSendTransportScreen';
export * from '../consumers/connectSendTransportVideo';
export * from '../consumers/consumerResume';
export * from '../consumers/controlMedia';
export * from '../consumers/createSendTransport';
export * from '../consumers/disconnectSendTransportAudio';
export * from '../consumers/disconnectSendTransportVideo';
export * from '../consumers/disconnectSendTransportScreen';
export * from '../consumers/dispStreams';
export * from '../consumers/generatePageContent';
export * from '../consumers/getEstimate';
export * from '../consumers/getPipedProducersAlt';
export * from '../consumers/getProducersPiped';
export * from '../consumers/getVideos';
export * from '../consumers/mixStreams';
export * from '../consumers/onScreenChanges';
export * from '../consumers/prepopulateUserMedia';
export * from '../consumers/processConsumerTransports';
export * from '../consumers/processConsumerTransportsAudio';
export * from '../consumers/readjust';
export * from '../consumers/receiveAllPipedTransports';
export * from '../consumers/reorderStreams';
export * from '../consumers/rePort';
export * from '../consumers/requestScreenShare';
export * from '../consumers/resumePauseAudioStreams';
export * from '../consumers/resumePauseStreams';
export * from '../consumers/resumeSendTransportAudio';
export * from '../consumers/reUpdateInter';
export * from '../consumers/signalNewConsumerTransport';
export * from '../consumers/startShareScreen';
export * from '../consumers/stopShareScreen';
export * from '../consumers/streamSuccessAudio';
export * from '../consumers/streamSuccessAudioSwitch';
export * from '../consumers/streamSuccessScreen';
export * from '../consumers/streamSuccessVideo';
export * from '../consumers/switchUserAudio';
export * from '../consumers/switchUserVideo';
export * from '../consumers/switchUserVideoAlt';
export * from '../consumers/trigger';
export * from '../consumers/updateMiniCardsGrid';
export * from '../consumers/updateParticipantAudioDecibels';
export * from '../methods/utils/producer/aParams';
export * from '../methods/utils/producer/hParams';
export * from '../methods/utils/producer/screenParams';
export * from '../methods/utils/producer/vParams';
export * from '../methods/utils/joinRoomOnMediaSFU';
export * from '../methods/utils/meetingTimer/startMeetingProgressTimer';
export * from '../methods/utils/MiniAudioPlayer/MiniAudioPlayer';
export * from '../methods/utils/formatNumber';
export * from '../methods/utils/generateRandomMessages';
export * from '../methods/utils/generateRandomParticipants';
export * from '../methods/utils/generateRandomPolls';
export * from '../methods/utils/generateRandomRequestList';
export * from '../methods/utils/generateRandomWaitingRoomList';
export * from '../methods/utils/getModalPosition';
export * from '../methods/utils/getOverlayPosition';
export * from '../methods/utils/sleep';
export * from '../methods/utils/validateAlphanumeric';
export * from '../methods/backgroundMethods/launchBackground';
export * from '../methods/breakoutRoomsMethods/launchBreakoutRooms';
export * from '../methods/breakoutRoomsMethods/breakoutRoomUpdated';
export * from '../methods/coHostMethods/launchCoHost';
export * from '../methods/coHostMethods/modifyCoHostSettings';
export * from '../methods/displaySettingsMethods/launchDisplaySettings';
export * from '../methods/displaySettingsMethods/modifyDisplaySettings';
export * from '../methods/exitMethods/launchConfirmExit';
export * from '../methods/exitMethods/confirmExit';
export * from '../methods/mediaSettingsMethods/launchMediaSettings';
export * from '../methods/menuMethods/launchMenuModal';
export * from '../methods/messageMethods/launchMessages';
export * from '../methods/messageMethods/sendMessage';
export * from '../methods/participantsMethods/launchParticipants';
export * from '../methods/participantsMethods/messageParticipants';
export * from '../methods/participantsMethods/muteParticipants';
export * from '../methods/participantsMethods/removeParticipants';
export * from '../methods/pollsMethods/handleCreatePoll';
export * from '../methods/pollsMethods/handleEndPoll';
export * from '../methods/pollsMethods/handleVotePoll';
export * from '../methods/pollsMethods/launchPoll';
export * from '../methods/pollsMethods/pollUpdated';
export * from '../methods/recordingMethods/checkPauseState';
export * from '../methods/recordingMethods/checkResumeState';
export * from '../methods/recordingMethods/confirmRecording';
export * from '../methods/recordingMethods/launchRecording';
export * from '../methods/recordingMethods/recordPauseTimer';
export * from '../methods/recordingMethods/recordResumeTimer';
export * from '../methods/recordingMethods/recordStartTimer';
export * from '../methods/recordingMethods/recordUpdateTimer';
export * from '../methods/recordingMethods/startRecording';
export * from '../methods/recordingMethods/stopRecording';
export * from '../methods/recordingMethods/updateRecording';
export * from '../methods/requestsMethods/launchRequests';
export * from '../methods/requestsMethods/respondToRequests';
export * from '../methods/settingsMethods/launchSettings';
export * from '../methods/settingsMethods/modifySettings';
export * from '../methods/streamMethods/clickAudio';
export * from '../methods/streamMethods/clickChat';
export * from '../methods/streamMethods/clickScreenShare';
export * from '../methods/streamMethods/clickVideo';
export * from '../methods/streamMethods/switchAudio';
export * from '../methods/streamMethods/switchVideo';
export * from '../methods/streamMethods/switchVideoAlt';
export * from '../methods/utils/meetingTimer/startMeetingProgressTimer';
export * from '../methods/utils/MiniAudioPlayer/MiniAudioPlayer';
export * from '../methods/utils/formatNumber';
export * from '../methods/utils/generateRandomMessages';
export * from '../methods/utils/generateRandomParticipants';
export * from '../methods/utils/generateRandomPolls';
export * from '../methods/utils/generateRandomRequestList';
export * from '../methods/utils/generateRandomWaitingRoomList';
export * from '../methods/utils/getModalPosition';
export * from '../methods/utils/getOverlayPosition';
export * from '../methods/utils/sleep';
export * from '../methods/utils/validateAlphanumeric';
export * from '../methods/waitingMethods/launchWaiting';
export * from '../methods/waitingMethods/respondToWaiting';
export * from '../methods/whiteboardMethods/launchConfigureWhiteboard';
export * from '../methods/whiteboardMethods/captureCanvasStream';
export * from '../ProducerClient/producerClientEmits/createDeviceClient';
export * from '../ProducerClient/producerClientEmits/joinRoomClient';
export * from '../ProducerClient/producerClientEmits/updateRoomParametersClient';
export * from '../producers/producerEmits/joinConRoom';
export * from '../producers/producerEmits/joinRoom';
export * from '../producers/producerEmits/joinLocalRoom';
export * from '../producers/socketReceiveMethods/allMembers';
export * from '../producers/socketReceiveMethods/allMembersRest';
export * from '../producers/socketReceiveMethods/allWaitingRoomMembers';
export * from '../producers/socketReceiveMethods/banParticipant';
export * from '../producers/socketReceiveMethods/controlMediaHost';
export * from '../producers/socketReceiveMethods/disconnect';
export * from '../producers/socketReceiveMethods/disconnectUserSelf';
export * from '../producers/socketReceiveMethods/getDomains';
export * from '../producers/socketReceiveMethods/hostRequestResponse';
export * from '../producers/socketReceiveMethods/meetingEnded';
export * from '../producers/socketReceiveMethods/meetingStillThere';
export * from '../producers/socketReceiveMethods/meetingTimeRemaining';
export * from '../producers/socketReceiveMethods/participantRequested';
export * from '../producers/socketReceiveMethods/personJoined';
export * from '../producers/socketReceiveMethods/producerMediaClosed';
export * from '../producers/socketReceiveMethods/producerMediaPaused';
export * from '../producers/socketReceiveMethods/producerMediaResumed';
export * from '../producers/socketReceiveMethods/reInitiateRecording';
export * from '../producers/socketReceiveMethods/receiveMessage';
export * from '../producers/socketReceiveMethods/recordingNotice';
export * from '../producers/socketReceiveMethods/roomRecordParams';
export * from '../producers/socketReceiveMethods/screenProducerId';
export * from '../producers/socketReceiveMethods/startRecords';
export * from '../producers/socketReceiveMethods/stoppedRecording';
export * from '../producers/socketReceiveMethods/timeLeftRecording';
export * from '../producers/socketReceiveMethods/updateConsumingDomains';
export * from '../producers/socketReceiveMethods/updateMediaSettings';
export * from '../producers/socketReceiveMethods/updatedCoHost';
export * from '../producers/socketReceiveMethods/userWaiting';
export * from '../sockets/SocketManager';
export * from '../components/backgroundComponents/BackgroundModal';
export * from '../components/breakoutComponents/BreakoutRoomsModal';
export * from '../components/coHostComponents/CoHostModal';
export * from '../components/displayComponents/AlertComponent';
export * from '../components/displayComponents/AudioCard';
export * from '../components/displayComponents/AudioGrid';
export * from '../components/displayComponents/CardVideoDisplay';
export * from '../components/displayComponents/ControlButtonsComponent';
export * from '../components/displayComponents/ControlButtonsAltComponent';
export * from '../components/displayComponents/ControlButtonsComponentTouch';
export * from '../components/displayComponents/FlexibleGrid';
export * from '../components/displayComponents/FlexibleVideo';
export * from '../components/displayComponents/LoadingModal';
export * from '../components/displayComponents/MainAspectComponent';
export * from '../components/displayComponents/MainContainerComponent';
export * from '../components/displayComponents/MainGridComponent';
export * from '../components/displayComponents/MainScreenComponent';
export * from '../components/displayComponents/MeetingProgressTimer';
export * from '../components/displayComponents/MiniAudio';
export * from '../components/displayComponents/MiniCard';
export * from '../components/displayComponents/MiniCardAudio';
export * from '../components/displayComponents/OtherGridComponent';
export * from '../components/displayComponents/Pagination';
export * from '../components/displayComponents/SubAspectComponent';
export * from '../components/displayComponents/VideoCard';
export * from '../components/displaySettingsComponents/DisplaySettingsModal';
export * from '../components/eventSettingsComponents/EventSettingsModal';
export * from '../components/exitComponents/ConfirmExitModal';
export * from '../components/mediaSettingsComponents/MediaSettingsModal';
export * from '../components/menuComponents/MenuModal';
export * from '../components/messageComponents/MessagesModal';
export * from '../components/miscComponents/ConfirmHereModal';
export * from '../components/miscComponents/PreJoinPage';
export * from '../components/miscComponents/ShareEventModal';
export * from '../components/miscComponents/WelcomePage';
export * from '../components/participantsComponents/ParticipantsModal';
export * from '../components/pollsComponents/PollModal';
export * from '../components/recordingComponents/RecordingModal';
export * from '../components/requestsComponents/RequestsModal';
export * from '../components/screenboardComponents/Screenboard';
export * from '../components/screenboardComponents/ScreenboardModal';
export * from '../components/waitingComponents/WaitingModal';
export * from '../components/whiteboardComponents/ConfigureWhiteboardModal';
export * from '../components/whiteboardComponents/Whiteboard';
export * from '../components/menuComponents/CustomButtons';
export interface Participant {
    id?: string;
    audioID: string;
    videoID: string;
    ScreenID?: string;
    ScreenOn?: boolean;
    islevel?: string;
    isAdmin?: boolean;
    isHost?: boolean;
    name: string;
    muted?: boolean;
    isBanned?: boolean;
    isSuspended?: boolean;
    useBoard?: boolean;
    breakRoom?: number | null;
    [key: string]: any;
}
export interface Stream {
    producerId: string;
    muted?: boolean;
    stream?: MediaStream;
    socket_?: Socket;
    name?: string;
    [key: string]: any;
}
export interface Request {
    id: string;
    icon: string;
    name?: string;
    username?: string;
    [key: string]: any;
}
export interface RequestResponse {
    id: string;
    icon?: string;
    name?: string;
    username?: string;
    action?: string;
    type?: string;
    [key: string]: any;
}
export interface Transport {
    producerId: string;
    consumer: Consumer;
    socket_: Socket;
    serverConsumerTransportId: string;
    [key: string]: any;
}
export interface ScreenState {
    mainScreenPerson?: string;
    mainScreenProducerId?: string;
    mainScreenFilled: boolean;
    adminOnMainScreen: boolean;
}
export interface GridSizes {
    gridWidth?: number;
    gridHeight?: number;
    altGridWidth?: number;
    altGridHeight?: number;
}
export interface ComponentSizes {
    mainWidth: number;
    mainHeight: number;
    otherWidth: number;
    otherHeight: number;
}
export interface AudioDecibels {
    name: string;
    averageLoudness: number;
}
export type ShowAlert = (options: {
    message: string;
    type: "success" | "danger";
    duration?: number;
}) => void;
export interface CoHostResponsibility {
    name: string;
    value: boolean;
    dedicated: boolean;
}
export interface VidCons {
    width: number | {
        ideal?: number;
        max?: number;
        min?: number;
    };
    height: number | {
        ideal?: number;
        max?: number;
        min?: number;
    };
}
export type Settings = [string, string, string, string];
export interface Message {
    sender: string;
    receivers: string[];
    message: string;
    timestamp: string;
    group: boolean;
}
export type MainSpecs = {
    mediaOptions: string;
    audioOptions: string;
    videoOptions: string;
    videoType: string;
    videoOptimized: boolean;
    recordingDisplayType: "video" | "media" | "all";
    addHLS: boolean;
};
export type DispSpecs = {
    nameTags: boolean;
    backgroundColor: string;
    nameTagsColor: string;
    orientationVideo: string;
};
export type TextSpecs = {
    addText: boolean;
    customText?: string;
    customTextPosition?: string;
    customTextColor?: string;
};
export interface UserRecordingParams {
    mainSpecs: MainSpecs;
    dispSpecs: DispSpecs;
    textSpecs?: TextSpecs;
}
export type AltDomains = {
    [key: string]: string;
};
export type RequestPermissionAudioType = () => Promise<string>;
export type RequestPermissionCameraType = () => Promise<string>;
export type ControlsPosition = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
export type InfoPosition = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
export interface Poll {
    id: string;
    question: string;
    type: string;
    options: string[];
    votes: number[];
    status: string;
    voters?: Record<string, number>;
    [key: string]: any;
}
export interface WaitingRoomParticipant {
    name: string;
    id: string;
}
export interface ModalPositionStyle {
    justifyContent: string;
    alignItems: string;
}
export interface OverlayPositionStyle {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}
export type EventType = 'conference' | 'webinar' | 'chat' | 'broadcast' | 'none';
export interface PollUpdatedData {
    polls?: Poll[];
    poll: Poll;
    status: string;
}
export interface BreakoutParticipant {
    name: string;
    breakRoom?: number | null;
}
export interface BreakoutRoomUpdatedData {
    forHost?: boolean;
    newRoom?: number;
    members?: Participant[];
    breakoutRooms?: BreakoutParticipant[][];
    status?: string;
}
export interface ConsumeSocket {
    [ip: string]: Socket;
}
export interface WhiteboardUser {
    name: string;
    useBoard: boolean;
}
export interface ShapePayload {
    type: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    thickness: number;
    lineType: string;
    [key: string]: any;
}
export interface Shapes {
    action: string;
    payload: ShapePayload;
}
export interface WhiteboardData {
    shapes: Shapes[];
    redoStack: Shapes[];
    undoStack: Shapes[];
    useImageBackground: boolean;
}
export type SeedData = {
    member?: string;
    host?: string;
    eventType?: EventType;
    participants?: Participant[];
    messages?: Message[];
    polls?: Poll[];
    breakoutRooms?: BreakoutParticipant[][];
    requests?: Request[];
    waitingList?: WaitingRoomParticipant[];
    whiteboardUsers?: WhiteboardUser[];
};
export interface MeetingRoomParams {
    itemPageLimit: number;
    mediaType: 'audio' | 'video';
    addCoHost: boolean;
    targetOrientation: 'landscape' | 'neutral' | 'portrait';
    targetOrientationHost: 'landscape' | 'neutral' | 'portrait';
    targetResolution: 'qhd' | 'fhd' | 'hd' | 'sd' | 'QnHD';
    targetResolutionHost: 'qhd' | 'fhd' | 'hd' | 'sd' | 'QnHD';
    type: EventType;
    audioSetting: 'allow' | 'approval' | 'disallow';
    videoSetting: 'allow' | 'approval' | 'disallow';
    screenshareSetting: 'allow' | 'approval' | 'disallow';
    chatSetting: 'allow' | 'disallow';
}
export interface RecordingParams {
    recordingAudioPausesLimit: number;
    recordingAudioSupport: boolean;
    recordingAudioPeopleLimit: number;
    recordingAudioParticipantsTimeLimit: number;
    recordingVideoPausesLimit: number;
    recordingVideoSupport: boolean;
    recordingVideoPeopleLimit: number;
    recordingVideoParticipantsTimeLimit: number;
    recordingAllParticipantsSupport: boolean;
    recordingVideoParticipantsSupport: boolean;
    recordingAllParticipantsFullRoomSupport: boolean;
    recordingVideoParticipantsFullRoomSupport: boolean;
    recordingPreferredOrientation: 'landscape' | 'portrait';
    recordingSupportForOtherOrientation: boolean;
    recordingMultiFormatsSupport: boolean;
    recordingHLSSupport: boolean;
    recordingAudioPausesCount?: number;
    recordingVideoPausesCount?: number;
}
export interface CreateRoomOptions {
    action: 'create' | 'join';
    meetingID: string;
    duration: number;
    capacity: number;
    userName: string;
    scheduledDate: number;
    secureCode: string;
    eventType: 'conference' | 'webinar' | 'chat' | 'broadcast';
    recordOnly: boolean;
    eventStatus: 'active' | 'inactive';
    startIndex: number;
    pageSize: number;
    safeRoom: boolean;
    autoStartSafeRoom: boolean;
    safeRoomAction: 'warn' | 'kick' | 'ban';
    dataBuffer: boolean;
    bufferType: 'images' | 'audio' | 'all';
    supportSIP: boolean;
    directionSIP: 'inbound' | 'outbound' | 'both';
    preferPCMA: boolean;
}
export interface CreateMediaSFURoomOptions {
    action: 'create';
    duration: number;
    capacity: number;
    userName: string;
    scheduledDate?: number;
    secureCode?: string;
    eventType?: 'conference' | 'webinar' | 'chat' | 'broadcast';
    meetingRoomParams?: MeetingRoomParams;
    recordingParams?: RecordingParams;
    recordOnly?: boolean;
    safeRoom?: boolean;
    autoStartSafeRoom?: boolean;
    safeRoomAction?: 'warn' | 'kick' | 'ban';
    dataBuffer?: boolean;
    bufferType?: 'images' | 'audio' | 'all';
    supportSIP?: boolean;
    directionSIP?: 'inbound' | 'outbound' | 'both';
    preferPCMA?: boolean;
}
export interface JoinMediaSFURoomOptions {
    action: 'join';
    meetingID: string;
    userName: string;
    secureCode?: string;
}
export interface ResponseJoinLocalRoom {
    rtpCapabilities?: RtpCapabilities | null;
    isHost: boolean;
    eventStarted: boolean;
    isBanned: boolean;
    hostNotJoined: boolean;
    eventRoomParams: MeetingRoomParams;
    recordingParams: RecordingParams;
    secureCode: string;
    mediasfuURL: string;
    apiKey: string;
    apiUserName: string;
    allowRecord: boolean;
}
export interface ResponseJoinRoom {
    rtpCapabilities?: RtpCapabilities | null;
    success: boolean;
    roomRecvIPs: string[];
    meetingRoomParams: MeetingRoomParams;
    recordingParams: RecordingParams;
    secureCode: string;
    recordOnly: boolean;
    isHost: boolean;
    safeRoom: boolean;
    autoStartSafeRoom: boolean;
    safeRoomStarted: boolean;
    safeRoomEnded: boolean;
    reason?: string;
    banned?: boolean;
    suspended?: boolean;
    noAdmin?: boolean;
}
export interface AllMembersData {
    members: Participant[];
    requests: Request[];
    coHost?: string;
    coHostResponsibilities: CoHostResponsibility[];
}
export interface AllMembersRestData {
    members: Participant[];
    settings: Settings;
    coHost?: string;
    coHostResponsibilities: CoHostResponsibility[];
}
export interface UserWaitingData {
    name: string;
}
export interface AllWaitingRoomMembersData {
    waitingParticipants?: WaitingRoomParticipant[];
    waitingParticipantss?: WaitingRoomParticipant[];
}
export interface BanData {
    name: string;
}
export interface UpdatedCoHostData {
    coHost: string;
    coHostResponsibilities: CoHostResponsibility[];
}
export interface ParticipantRequestedData {
    userRequest: Request;
}
export interface ScreenProducerIdData {
    producerId: string;
}
export interface UpdateMediaSettingsData {
    settings: Settings;
}
export interface ProducerMediaPausedData {
    producerId: string;
    kind: "audio";
    name: string;
}
export interface ProducerMediaResumedData {
    kind: "audio";
    name: string;
}
export interface ProducerMediaClosedData {
    producerId: string;
    kind: "audio" | "video" | "screenshare";
    name: string;
}
export interface ControlMediaHostData {
    type: "all" | "audio" | "video" | "screenshare";
}
export interface ReceiveMessageData {
    message: Message;
}
export interface MeetingTimeRemainingData {
    timeRemaining: number;
}
export interface MeetingStillThereData {
    timeRemaining: number;
}
export interface UpdateConsumingDomainsData {
    domains: string[];
    alt_domains: AltDomains;
}
export interface RecordingNoticeData {
    state: string;
    userRecordingParam: UserRecordingParams;
    pauseCount: number;
    timeDone: number;
}
export interface TimeLeftRecordingData {
    timeLeft: number;
}
export interface StoppedRecordingData {
    state: string;
    reason?: string;
}
export interface HostRequestResponseData {
    requestResponse: RequestResponse;
}
export interface SafeRoomNoticeData {
    state: string;
}
export interface UnSafeData {
    time: number;
    evidence: ImageData;
}
export interface UnsafeAlertData {
    name: string;
}
export interface DataBufferNotice {
    state: string;
}
export interface AudioData {
    audioBuffer: AudioBuffer;
}
export interface ImageData {
    jpegBuffer: ImageData;
}
export interface WhiteboardUpdatedData {
    status: "started" | "ended";
    whiteboardUsers: WhiteboardUser[];
    members: Participant[];
    whiteboardData: WhiteboardData;
}
export interface WhiteboardActionData {
    action: string;
    payload: ShapePayload;
}
export type CreateWebRTCTransportResponse = {
    id: string;
    dtlsParameters: DtlsParameters;
    iceCandidates: IceCandidate[];
    iceParameters: IceParameters;
    error?: string;
};
export interface CustomVideoCardOptions {
    participant: Participant;
    stream: MediaStream | null;
    width: number;
    height: number;
    imageSize?: number;
    doMirror?: string;
    showControls?: boolean;
    showInfo?: boolean;
    name?: string;
    backgroundColor?: string;
    onVideoPress?: () => void;
    parameters?: any;
}
export interface CustomAudioCardOptions {
    name: string;
    barColor: boolean;
    textColor: string;
    imageSource: string;
    roundedImage: boolean;
    imageStyle: React.CSSProperties;
    parameters?: any;
}
export interface CustomMiniCardOptions {
    initials: string;
    fontSize: string;
    customStyle?: boolean;
    name: string;
    showVideoIcon: boolean;
    showAudioIcon: boolean;
    imageSource: string;
    roundedImage: boolean;
    imageStyle: React.CSSProperties;
    parameters?: any;
}
export interface CustomPreJoinPageOptions {
    localLink?: string;
    connectMediaSFU?: boolean;
    parameters: any;
    credentials?: {
        apiUserName: string;
        apiKey: string;
    };
    returnUI?: boolean;
    noUIPreJoinOptions?: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
    createMediaSFURoom?: any;
    joinMediaSFURoom?: any;
}
export type CustomVideoCardType = (options: CustomVideoCardOptions) => React.JSX.Element;
export type CustomAudioCardType = (options: CustomAudioCardOptions) => React.JSX.Element;
export type CustomMiniCardType = (options: CustomMiniCardOptions) => React.JSX.Element;
export type CustomPreJoinPageType = (options: CustomPreJoinPageOptions) => React.JSX.Element;
export type CustomComponentType = React.FC<{
    parameters: any;
}>;
//# sourceMappingURL=types.d.ts.map