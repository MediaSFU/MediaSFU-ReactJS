import { Socket } from 'socket.io-client';
import { Consumer, DtlsParameters, IceCandidate, IceParameters, RtpCapabilities } from 'mediasoup-client/lib/types';
export type { JoinConsumeRoomOptions, JoinConsumeRoomType, JoinConsumeRoomParameters } from '../consumers/socketReceiveMethods/joinConsumeRoom';
export type { ProducerClosedOptions, ProducerClosedType, ProducerClosedParameters } from '../consumers/socketReceiveMethods/producerClosed';
export type { NewPipeProducerOptions, NewPipeProducerType, NewPipeProducerParameters } from '../consumers/socketReceiveMethods/newPipeProducer';
export type { AddVideosGridOptions, AddVideosGridType, AddVideosGridParameters } from '../consumers/addVideosGrid';
export type { AutoAdjustOptions, AutoAdjustType } from '../consumers/autoAdjust';
export type { CalculateRowsAndColumnsOptions, CalculateRowsAndColumnsType } from '../consumers/calculateRowsAndColumns';
export type { ChangeVidsOptions, ChangeVidsType, ChangeVidsParameters } from '../consumers/changeVids';
export type { CheckGridOptions, CheckGridType } from '../consumers/checkGrid';
export type { CheckPermissionOptions, CheckPermissionType } from '../consumers/checkPermission';
export type { CheckScreenShareOptions, CheckScreenShareType, CheckScreenShareParameters } from '../consumers/checkScreenShare';
export type { CloseAndResizeOptions, CloseAndResizeType, CloseAndResizeParameters } from '../consumers/closeAndResize';
export type { CompareActiveNamesOptions, CompareActiveNamesType, CompareActiveNamesParameters } from '../consumers/compareActiveNames';
export type { CompareScreenStatesOptions, CompareScreenStatesType, CompareScreenStatesParameters } from '../consumers/compareScreenStates';
export type { ConnectIpsOptions, ConnectIpsType, ConnectIpsParameters } from '../consumers/connectIps';
export type { ConnectLocalIpsOptions, ConnectLocalIpsType, ConnectLocalIpsParameters } from '../consumers/connectLocalIps';
export type { ConnectRecvTransportOptions, ConnectRecvTransportType, ConnectRecvTransportParameters } from '../consumers/connectRecvTransport';
export type { ConnectSendTransportOptions, ConnectSendTransportType, ConnectSendTransportParameters } from '../consumers/connectSendTransport';
export type { ConnectSendTransportAudioOptions, ConnectSendTransportAudioType, ConnectSendTransportAudioParameters } from '../consumers/connectSendTransportAudio';
export type { ConnectSendTransportScreenOptions, ConnectSendTransportScreenType, ConnectSendTransportScreenParameters } from '../consumers/connectSendTransportScreen';
export type { ConnectSendTransportVideoOptions, ConnectSendTransportVideoType, ConnectSendTransportVideoParameters } from '../consumers/connectSendTransportVideo';
export type { ConsumerResumeOptions, ConsumerResumeType, ConsumerResumeParameters } from '../consumers/consumerResume';
export type { ControlMediaOptions, ControlMediaType } from '../consumers/controlMedia';
export type { CreateSendTransportOptions, CreateSendTransportType, CreateSendTransportParameters } from '../consumers/createSendTransport';
export type { DisconnectSendTransportAudioOptions, DisconnectSendTransportAudioType, DisconnectSendTransportAudioParameters } from '../consumers/disconnectSendTransportAudio';
export type { DisconnectSendTransportVideoOptions, DisconnectSendTransportVideoType, DisconnectSendTransportVideoParameters } from '../consumers/disconnectSendTransportVideo';
export type { DisconnectSendTransportScreenOptions, DisconnectSendTransportScreenType, DisconnectSendTransportScreenParameters } from '../consumers/disconnectSendTransportScreen';
export type { DispStreamsOptions, DispStreamsType, DispStreamsParameters } from '../consumers/dispStreams';
export type { GeneratePageContentOptions, GeneratePageContentType } from '../consumers/generatePageContent';
export type { GetEstimateOptions, GetEstimateType, GetEstimateParameters } from '../consumers/getEstimate';
export type { GetPipedProducersAltOptions, GetPipedProducersAltType, GetPipedProducersAltParameters } from '../consumers/getPipedProducersAlt';
export type { GetProducersPipedOptions, GetProducersPipedType, GetProducersPipedParameters } from '../consumers/getProducersPiped';
export type { GetVideosOptions, GetVideosType } from '../consumers/getVideos';
export type { MixStreamsOptions, MixStreamsType } from '../consumers/mixStreams';
export type { OnScreenChangesOptions, OnScreenChangesType, OnScreenChangesParameters } from '../consumers/onScreenChanges';
export type { PrepopulateUserMediaOptions, PrepopulateUserMediaType, PrepopulateUserMediaParameters } from '../consumers/prepopulateUserMedia';
export type { ProcessConsumerTransportsOptions, ProcessConsumerTransportsType, ProcessConsumerTransportsParameters } from '../consumers/processConsumerTransports';
export type { ProcessConsumerTransportsAudioOptions, ProcessConsumerTransportsAudioType, ProcessConsumerTransportsAudioParameters } from '../consumers/processConsumerTransportsAudio';
export type { ReadjustOptions, ReadjustType, ReadjustParameters } from '../consumers/readjust';
export type { ReceiveAllPipedTransportsOptions, ReceiveAllPipedTransportsType, ReceiveAllPipedTransportsParameters } from '../consumers/receiveAllPipedTransports';
export type { ReorderStreamsOptions, ReorderStreamsType, ReorderStreamsParameters } from '../consumers/reorderStreams';
export type { RePortOptions, RePortType, RePortParameters } from '../consumers/rePort';
export type { RequestScreenShareOptions, RequestScreenShareType, RequestScreenShareParameters } from '../consumers/requestScreenShare';
export type { ResumePauseAudioStreamsOptions, ResumePauseAudioStreamsType, ResumePauseAudioStreamsParameters } from '../consumers/resumePauseAudioStreams';
export type { ResumePauseStreamsOptions, ResumePauseStreamsType, ResumePauseStreamsParameters } from '../consumers/resumePauseStreams';
export type { ResumeSendTransportAudioOptions, ResumeSendTransportAudioType, ResumeSendTransportAudioParameters } from '../consumers/resumeSendTransportAudio';
export type { ReUpdateInterOptions, ReUpdateInterType, ReUpdateInterParameters } from '../consumers/reUpdateInter';
export type { SignalNewConsumerTransportOptions, SignalNewConsumerTransportType, SignalNewConsumerTransportParameters } from '../consumers/signalNewConsumerTransport';
export type { StartShareScreenOptions, StartShareScreenType, StartShareScreenParameters } from '../consumers/startShareScreen';
export type { StopShareScreenOptions, StopShareScreenType, StopShareScreenParameters } from '../consumers/stopShareScreen';
export type { StreamSuccessAudioOptions, StreamSuccessAudioType, StreamSuccessAudioParameters } from '../consumers/streamSuccessAudio';
export type { StreamSuccessAudioSwitchOptions, StreamSuccessAudioSwitchType, StreamSuccessAudioSwitchParameters } from '../consumers/streamSuccessAudioSwitch';
export type { StreamSuccessScreenOptions, StreamSuccessScreenType, StreamSuccessScreenParameters } from '../consumers/streamSuccessScreen';
export type { StreamSuccessVideoOptions, StreamSuccessVideoType, StreamSuccessVideoParameters } from '../consumers/streamSuccessVideo';
export type { SwitchUserAudioOptions, SwitchUserAudioType, SwitchUserAudioParameters } from '../consumers/switchUserAudio';
export type { SwitchUserVideoOptions, SwitchUserVideoType, SwitchUserVideoParameters } from '../consumers/switchUserVideo';
export type { SwitchUserVideoAltOptions, SwitchUserVideoAltType, SwitchUserVideoAltParameters } from '../consumers/switchUserVideoAlt';
export type { TriggerOptions, TriggerType, TriggerParameters } from '../consumers/trigger';
export type { UpdateMiniCardsGridOptions, UpdateMiniCardsGridType, UpdateMiniCardsGridParameters } from '../consumers/updateMiniCardsGrid';
export type { UpdateParticipantAudioDecibelsOptions, UpdateParticipantAudioDecibelsType } from '../consumers/updateParticipantAudioDecibels';
export type { AParamsType } from '../methods/utils/producer/aParams';
export type { HParamsType } from '../methods/utils/producer/hParams';
export type { ScreenParamsType } from '../methods/utils/producer/screenParams';
export type { VParamsType } from '../methods/utils/producer/vParams';
export type { LaunchBackgroundOptions, LaunchBackgroundType } from '../methods/backgroundMethods/launchBackground';
export type { LaunchBreakoutRoomsOptions, LaunchBreakoutRoomsType } from '../methods/breakoutRoomsMethods/launchBreakoutRooms';
export type { BreakoutRoomUpdatedOptions, BreakoutRoomUpdatedType, BreakoutRoomUpdatedParameters } from '../methods/breakoutRoomsMethods/breakoutRoomUpdated';
export type { LaunchCoHostOptions, LaunchCoHostType } from '../methods/coHostMethods/launchCoHost';
export type { ModifyCoHostSettingsOptions, ModifyCoHostSettingsType } from '../methods/coHostMethods/modifyCoHostSettings';
export type { LaunchDisplaySettingsOptions, LaunchDisplaySettingsType } from '../methods/displaySettingsMethods/launchDisplaySettings';
export type { ModifyDisplaySettingsOptions, ModifyDisplaySettingsType, ModifyDisplaySettingsParameters } from '../methods/displaySettingsMethods/modifyDisplaySettings';
export type { LaunchConfirmExitOptions, LaunchConfirmExitType } from '../methods/exitMethods/launchConfirmExit';
export type { ConfirmExitOptions, ConfirmExitType } from '../methods/exitMethods/confirmExit';
export type { LaunchMediaSettingsOptions, LaunchMediaSettingsType } from '../methods/mediaSettingsMethods/launchMediaSettings';
export type { LaunchMenuModalOptions, LaunchMenuModalType } from '../methods/menuMethods/launchMenuModal';
export type { LaunchMessagesOptions, LaunchMessagesType } from '../methods/messageMethods/launchMessages';
export type { SendMessageOptions, SendMessageType } from '../methods/messageMethods/sendMessage';
export type { LaunchParticipantsOptions, LaunchParticipantsType } from '../methods/participantsMethods/launchParticipants';
export type { MessageParticipantsOptions, MessageParticipantsType } from '../methods/participantsMethods/messageParticipants';
export type { MuteParticipantsOptions, MuteParticipantsType } from '../methods/participantsMethods/muteParticipants';
export type { RemoveParticipantsOptions, RemoveParticipantsType } from '../methods/participantsMethods/removeParticipants';
export type { HandleCreatePollOptions, HandleCreatePollType } from '../methods/pollsMethods/handleCreatePoll';
export type { HandleEndPollOptions, HandleEndPollType } from '../methods/pollsMethods/handleEndPoll';
export type { HandleVotePollOptions, HandleVotePollType } from '../methods/pollsMethods/handleVotePoll';
export type { LaunchPollOptions, LaunchPollType } from '../methods/pollsMethods/launchPoll';
export type { PollUpdatedOptions, PollUpdatedType } from '../methods/pollsMethods/pollUpdated';
export type { CheckPauseStateOptions, CheckPauseStateType } from '../methods/recordingMethods/checkPauseState';
export type { CheckResumeStateOptions, CheckResumeStateType } from '../methods/recordingMethods/checkResumeState';
export type { ConfirmRecordingOptions, ConfirmRecordingType, ConfirmRecordingParameters } from '../methods/recordingMethods/confirmRecording';
export type { LaunchRecordingOptions, LaunchRecordingType } from '../methods/recordingMethods/launchRecording';
export type { RecordPauseTimerOptions, RecordPauseTimerType } from '../methods/recordingMethods/recordPauseTimer';
export type { RecordResumeTimerOptions, RecordResumeTimerType } from '../methods/recordingMethods/recordResumeTimer';
export type { RecordStartTimerOptions, RecordStartTimerType } from '../methods/recordingMethods/recordStartTimer';
export type { RecordUpdateTimerOptions, RecordUpdateTimerType } from '../methods/recordingMethods/recordUpdateTimer';
export type { StartRecordingOptions, StartRecordingType, StartRecordingParameters } from '../methods/recordingMethods/startRecording';
export type { StopRecordingOptions, StopRecordingType, StopRecordingParameters } from '../methods/recordingMethods/stopRecording';
export type { UpdateRecordingOptions, UpdateRecordingType, UpdateRecordingParameters } from '../methods/recordingMethods/updateRecording';
export type { LaunchRequestsOptions, LaunchRequestsType } from '../methods/requestsMethods/launchRequests';
export type { RespondToRequestsOptions, RespondToRequestsType } from '../methods/requestsMethods/respondToRequests';
export type { LaunchSettingsOptions, LaunchSettingsType } from '../methods/settingsMethods/launchSettings';
export type { ModifySettingsOptions, ModifySettingsType } from '../methods/settingsMethods/modifySettings';
export type { ClickAudioOptions, ClickAudioType, ClickAudioParameters } from '../methods/streamMethods/clickAudio';
export type { ClickChatOptions, ClickChatType } from '../methods/streamMethods/clickChat';
export type { ClickScreenShareOptions, ClickScreenShareType, ClickScreenShareParameters } from '../methods/streamMethods/clickScreenShare';
export type { ClickVideoOptions, ClickVideoType, ClickVideoParameters } from '../methods/streamMethods/clickVideo';
export type { SwitchAudioOptions, SwitchAudioType, SwitchAudioParameters } from '../methods/streamMethods/switchAudio';
export type { SwitchVideoOptions, SwitchVideoType, SwitchVideoParameters } from '../methods/streamMethods/switchVideo';
export type { SwitchVideoAltOptions, SwitchVideoAltType } from '../methods/streamMethods/switchVideoAlt';
export type { StartMeetingProgressTimerOptions, StartMeetingProgressTimerType, StartMeetingProgressTimerParameters } from '../methods/utils/meetingTimer/startMeetingProgressTimer';
export type { MiniAudioPlayerOptions, MiniAudioPlayerType, MiniAudioPlayerParameters } from '../methods/utils/MiniAudioPlayer/MiniAudioPlayer';
export type { FormatNumberOptions, FormatNumberType } from '../methods/utils/formatNumber';
export type { GenerateRandomMessagesOptions, GenerateRandomMessagesType } from '../methods/utils/generateRandomMessages';
export type { GenerateRandomParticipantsOptions, GenerateRandomParticipantsType } from '../methods/utils/generateRandomParticipants';
export type { GenerateRandomPollsOptions, GenerateRandomPollsType } from '../methods/utils/generateRandomPolls';
export type { GenerateRandomRequestListOptions, GenerateRandomRequestListType } from '../methods/utils/generateRandomRequestList';
export type { GenerateRandomWaitingRoomListType } from '../methods/utils/generateRandomWaitingRoomList';
export type { GetModalPositionOptions, GetModalPositionType } from '../methods/utils/getModalPosition';
export type { GetOverlayPositionOptions, GetOverlayPositionType } from '../methods/utils/getOverlayPosition';
export type { SleepOptions, SleepType } from '../methods/utils/sleep';
export type { ValidateAlphanumericOptions, ValidateAlphanumericType } from '../methods/utils/validateAlphanumeric';
export type { LaunchWaitingOptions, LaunchWaitingType } from '../methods/waitingMethods/launchWaiting';
export type { RespondToWaitingOptions, RespondToWaitingType } from '../methods/waitingMethods/respondToWaiting';
export type { LaunchConfigureWhiteboardOptions, LaunchConfigureWhiteboardType } from '../methods/whiteboardMethods/launchConfigureWhiteboard';
export type { CaptureCanvasStreamOptions, CaptureCanvasStreamType, CaptureCanvasStreamParameters } from '../methods/whiteboardMethods/captureCanvasStream';
export type { CreateDeviceClientOptions, CreateDeviceClientType } from '../ProducerClient/producerClientEmits/createDeviceClient';
export type { JoinRoomClientOptions, JoinRoomClientType } from '../ProducerClient/producerClientEmits/joinRoomClient';
export type { UpdateRoomParametersClientOptions, UpdateRoomParametersClientType, UpdateRoomParametersClientParameters } from '../ProducerClient/producerClientEmits/updateRoomParametersClient';
export type { JoinConRoomOptions, JoinConRoomType } from '../producers/producerEmits/joinConRoom';
export type { JoinRoomOptions, JoinRoomType } from '../producers/producerEmits/joinRoom';
export type { JoinLocalRoomOptions, JoinLocalRoomType } from '../producers/producerEmits/joinLocalRoom';
export type { AllMembersOptions, AllMembersType, AllMembersParameters } from '../producers/socketReceiveMethods/allMembers';
export type { AllMembersRestOptions, AllMembersRestType, AllMembersRestParameters } from '../producers/socketReceiveMethods/allMembersRest';
export type { AllWaitingRoomMembersOptions, AllWaitingRoomMembersType } from '../producers/socketReceiveMethods/allWaitingRoomMembers';
export type { BanParticipantOptions, BanParticipantType, BanParticipantParameters } from '../producers/socketReceiveMethods/banParticipant';
export type { ControlMediaHostOptions, ControlMediaHostType, ControlMediaHostParameters } from '../producers/socketReceiveMethods/controlMediaHost';
export type { DisconnectOptions, DisconnectType } from '../producers/socketReceiveMethods/disconnect';
export type { DisconnectUserSelfOptions, DisconnectUserSelfType } from '../producers/socketReceiveMethods/disconnectUserSelf';
export type { GetDomainsOptions, GetDomainsType, GetDomainsParameters } from '../producers/socketReceiveMethods/getDomains';
export type { HostRequestResponseOptions, HostRequestResponseType } from '../producers/socketReceiveMethods/hostRequestResponse';
export type { MeetingEndedOptions, MeetingEndedType } from '../producers/socketReceiveMethods/meetingEnded';
export type { MeetingStillThereOptions, MeetingStillThereType } from '../producers/socketReceiveMethods/meetingStillThere';
export type { MeetingTimeRemainingOptions, MeetingTimeRemainingType } from '../producers/socketReceiveMethods/meetingTimeRemaining';
export type { ParticipantRequestedOptions, ParticipantRequestedType } from '../producers/socketReceiveMethods/participantRequested';
export type { PersonJoinedOptions, PersonJoinedType } from '../producers/socketReceiveMethods/personJoined';
export type { ProducerMediaClosedOptions, ProducerMediaClosedType, ProducerMediaClosedParameters } from '../producers/socketReceiveMethods/producerMediaClosed';
export type { ProducerMediaPausedOptions, ProducerMediaPausedType, ProducerMediaPausedParameters } from '../producers/socketReceiveMethods/producerMediaPaused';
export type { ProducerMediaResumedOptions, ProducerMediaResumedType, ProducerMediaResumedParameters } from '../producers/socketReceiveMethods/producerMediaResumed';
export type { ReInitiateRecordingOptions, ReInitiateRecordingType } from '../producers/socketReceiveMethods/reInitiateRecording';
export type { ReceiveMessageOptions, ReceiveMessageType } from '../producers/socketReceiveMethods/receiveMessage';
export type { RecordingNoticeOptions, RecordingNoticeType, RecordingNoticeParameters } from '../producers/socketReceiveMethods/recordingNotice';
export type { RoomRecordParamsOptions, RoomRecordParamsType, RoomRecordParamsParameters, RecordParams } from '../producers/socketReceiveMethods/roomRecordParams';
export type { ScreenProducerIdOptions, ScreenProducerIdType } from '../producers/socketReceiveMethods/screenProducerId';
export type { StartRecordsOptions, StartRecordsType } from '../producers/socketReceiveMethods/startRecords';
export type { StoppedRecordingOptions, StoppedRecordingType } from '../producers/socketReceiveMethods/stoppedRecording';
export type { TimeLeftRecordingOptions, TimeLeftRecordingType } from '../producers/socketReceiveMethods/timeLeftRecording';
export type { UpdateConsumingDomainsOptions, UpdateConsumingDomainsType, UpdateConsumingDomainsParameters } from '../producers/socketReceiveMethods/updateConsumingDomains';
export type { UpdateMediaSettingsOptions, UpdateMediaSettingsType } from '../producers/socketReceiveMethods/updateMediaSettings';
export type { UpdatedCoHostOptions, UpdatedCoHostType } from '../producers/socketReceiveMethods/updatedCoHost';
export type { UserWaitingOptions, UserWaitingType } from '../producers/socketReceiveMethods/userWaiting';
export type { ConnectSocketOptions, ConnectSocketType, DisconnectSocketType, DisconnectSocketOptions, ConnectLocalSocketOptions, ConnectLocalSocketType, ResponseLocalConnection, ResponseLocalConnectionData } from '../sockets/SocketManager';
export type { BackgroundModalOptions, BackgroundModalType, BackgroundModalParameters } from '../components/backgroundComponents/BackgroundModal';
export type { BreakoutRoomsModalOptions, BreakoutRoomsModalType, BreakoutRoomsModalParameters } from '../components/breakoutComponents/BreakoutRoomsModal';
export type { CoHostModalOptions, CoHostModalType } from '../components/coHostComponents/CoHostModal';
export type { AlertComponentOptions, AlertComponentType } from '../components/displayComponents/AlertComponent';
export type { AudioCardOptions, AudioCardType, AudioCardParameters } from '../components/displayComponents/AudioCard';
export type { AudioGridOptions, AudioGridType } from '../components/displayComponents/AudioGrid';
export type { CardVideoDisplayOptions, CardVideoDisplayType } from '../components/displayComponents/CardVideoDisplay';
export type { ControlButtonsComponentOptions, ControlButtonsComponentType, Button } from '../components/displayComponents/ControlButtonsComponent';
export type { ControlButtonsAltComponentOptions, ControlButtonsAltComponentType, AltButton } from '../components/displayComponents/ControlButtonsAltComponent';
export type { ControlButtonsComponentTouchOptions, ControlButtonsComponentTouchType, ButtonTouch } from '../components/displayComponents/ControlButtonsComponentTouch';
export type { FlexibleGridOptions, FlexibleGridType } from '../components/displayComponents/FlexibleGrid';
export type { FlexibleVideoOptions, FlexibleVideoType } from '../components/displayComponents/FlexibleVideo';
export type { LoadingModalOptions, LoadingModalType } from '../components/displayComponents/LoadingModal';
export type { MainAspectComponentOptions, MainAspectComponentType } from '../components/displayComponents/MainAspectComponent';
export type { MainContainerComponentOptions, MainContainerComponentType } from '../components/displayComponents/MainContainerComponent';
export type { MainGridComponentOptions, MainGridComponentType } from '../components/displayComponents/MainGridComponent';
export type { MainScreenComponentOptions, MainScreenComponentType } from '../components/displayComponents/MainScreenComponent';
export type { MeetingProgressTimerOptions, MeetingProgressTimerType } from '../components/displayComponents/MeetingProgressTimer';
export type { MiniAudioOptions, MiniAudioType } from '../components/displayComponents/MiniAudio';
export type { MiniCardOptions, MiniCardType } from '../components/displayComponents/MiniCard';
export type { MiniCardAudioOptions, MiniCardAudioType } from '../components/displayComponents/MiniCardAudio';
export type { OtherGridComponentOptions, OtherGridComponentType } from '../components/displayComponents/OtherGridComponent';
export type { PaginationOptions, PaginationType } from '../components/displayComponents/Pagination';
export type { SubAspectComponentOptions, SubAspectComponentType } from '../components/displayComponents/SubAspectComponent';
export type { VideoCardOptions, VideoCardType, VideoCardParameters } from '../components/displayComponents/VideoCard';
export type { DisplaySettingsModalOptions, DisplaySettingsModalType, DisplaySettingsModalParameters } from '../components/displaySettingsComponents/DisplaySettingsModal';
export type { EventSettingsModalOptions, EventSettingsModalType } from '../components/eventSettingsComponents/EventSettingsModal';
export type { ConfirmExitModalOptions, ConfirmExitModalType } from '../components/exitComponents/ConfirmExitModal';
export type { MediaSettingsModalOptions, MediaSettingsModalType, MediaSettingsModalParameters } from '../components/mediaSettingsComponents/MediaSettingsModal';
export type { MenuModalOptions, MenuModalType } from '../components/menuComponents/MenuModal';
export type { MessagesModalOptions, MessagesModalType } from '../components/messageComponents/MessagesModal';
export type { ConfirmHereModalOptions, ConfirmHereModalType } from '../components/miscComponents/ConfirmHereModal';
export type { PreJoinPageOptions, PreJoinPageType, PreJoinPageParameters } from '../components/miscComponents/PreJoinPage';
export type { ShareEventModalOptions, ShareEventModalType } from '../components/miscComponents/ShareEventModal';
export type { WelcomePageOptions, WelcomePageType, WelcomePageParameters } from '../components/miscComponents/WelcomePage';
export type { ParticipantsModalOptions, ParticipantsModalType, ParticipantsModalParameters } from '../components/participantsComponents/ParticipantsModal';
export type { PollModalOptions, PollModalType } from '../components/pollsComponents/PollModal';
export type { RecordingModalOptions, RecordingModalType, RecordingModalParameters } from '../components/recordingComponents/RecordingModal';
export type { RequestsModalOptions, RequestsModalType } from '../components/requestsComponents/RequestsModal';
export type { ScreenboardOptions, ScreenboardType, ScreenboardParameters } from '../components/screenboardComponents/Screenboard';
export type { ScreenboardModalOptions, ScreenboardModalType } from '../components/screenboardComponents/ScreenboardModal';
export type { WaitingRoomModalOptions, WaitingRoomModalType, WaitingRoomModalParameters } from '../components/waitingComponents/WaitingModal';
export type { ConfigureWhiteboardModalOptions, ConfigureWhiteboardModalType } from '../components/whiteboardComponents/ConfigureWhiteboardModal';
export type { WhiteboardOptions, WhiteboardType, WhiteboardParameters, Shape } from '../components/whiteboardComponents/Whiteboard';
export type { CustomButtonsOptions, CustomButtonsType, CustomButton } from '../components/menuComponents/CustomButtons';
export type { CreateJoinRoomType, CreateRoomOnMediaSFUType, CreateJoinRoomResponse, CreateJoinRoomError, JoinRoomOnMediaSFUType } from '../methods/utils/joinRoomOnMediaSFU';
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
}
export interface JoinMediaSFURoomOptions {
    action: 'join';
    meetingID: string;
    userName: string;
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
//# sourceMappingURL=types.d.ts.map