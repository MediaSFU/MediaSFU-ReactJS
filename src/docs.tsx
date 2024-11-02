export * from './@types/types';

// Utility and initial state
export * from './methods/utils/initialValuesState';

// Display Components
export * from './components/displayComponents/LoadingModal';
export * from './components/displayComponents/MainAspectComponent';
export * from './components/displayComponents/ControlButtonsComponent';
export * from './components/displayComponents/ControlButtonsAltComponent';
export * from './components/displayComponents/ControlButtonsComponentTouch';
export * from './components/displayComponents/OtherGridComponent';
export * from './components/displayComponents/MainScreenComponent';
export * from './components/displayComponents/MainGridComponent';
export * from './components/displayComponents/SubAspectComponent';
export * from './components/displayComponents/MainContainerComponent';
export * from './components/displayComponents/AlertComponent';
export * from './components/menuComponents/MenuModal';
export * from './components/recordingComponents/RecordingModal';
export * from './components/requestsComponents/RequestsModal';
export * from './components/waitingComponents/WaitingModal';
export * from './components/displaySettingsComponents/DisplaySettingsModal';
export * from './components/eventSettingsComponents/EventSettingsModal';
export * from './components/coHostComponents/CoHostModal';
export * from './components/participantsComponents/ParticipantsModal';
export * from './components/messageComponents/MessagesModal';
export * from './components/mediaSettingsComponents/MediaSettingsModal';
export * from './components/exitComponents/ConfirmExitModal';
export * from './components/miscComponents/ConfirmHereModal';
export * from './components/miscComponents/ShareEventModal';
export * from './components/miscComponents/WelcomePage';
export * from './components/miscComponents/PreJoinPage';

// Polls and Background
export * from './components/pollsComponents/PollModal';
export * from './components/backgroundComponents/BackgroundModal';
export * from './components/breakoutComponents/BreakoutRoomsModal';
export * from './components/whiteboardComponents/ConfigureWhiteboardModal';
export * from './components/whiteboardComponents/Whiteboard';
export * from './components/screenboardComponents/Screenboard';
export * from './components/screenboardComponents/ScreenboardModal';

// Pagination and Media Display
export * from './components/displayComponents/Pagination';
export * from './components/displayComponents/FlexibleGrid';
export * from './components/displayComponents/FlexibleVideo';
export * from './components/displayComponents/AudioGrid';

// Methods for Control
export * from './methods/menuMethods/launchMenuModal';
export * from './methods/recordingMethods/launchRecording';
export * from './methods/recordingMethods/startRecording';
export * from './methods/recordingMethods/confirmRecording';
export * from './methods/waitingMethods/launchWaiting';
export * from './methods/coHostMethods/launchCoHost';
export * from './methods/mediaSettingsMethods/launchMediaSettings';
export * from './methods/displaySettingsMethods/launchDisplaySettings';
export * from './methods/settingsMethods/launchSettings';
export * from './methods/requestsMethods/launchRequests';
export * from './methods/participantsMethods/launchParticipants';
export * from './methods/messageMethods/launchMessages';
export * from './methods/exitMethods/launchConfirmExit';

// Polls and Background Methods
export * from './methods/pollsMethods/launchPoll';
export * from './methods/backgroundMethods/launchBackground';
export * from './methods/breakoutRoomsMethods/launchBreakoutRooms';
export * from './methods/whiteboardMethods/launchConfigureWhiteboard';

// Socket and Media Functions
export * from './sockets/SocketManager';
export * from './ProducerClient/producerClientEmits/joinRoomClient';
export * from './ProducerClient/producerClientEmits/updateRoomParametersClient';
export * from './ProducerClient/producerClientEmits/createDeviceClient';

// Stream and Consumer Methods
export * from './methods/streamMethods/switchVideoAlt';
export * from './methods/streamMethods/clickVideo';
export * from './methods/streamMethods/clickAudio';
export * from './methods/streamMethods/clickScreenShare';
export * from './consumers/streamSuccessVideo';
export * from './consumers/streamSuccessAudio';
export * from './consumers/streamSuccessScreen';
export * from './consumers/streamSuccessAudioSwitch';
export * from './consumers/checkPermission';
export * from './consumers/socketReceiveMethods/producerClosed';
export * from './consumers/socketReceiveMethods/newPipeProducer';
export * from './consumers/updateMiniCardsGrid';
export * from './consumers/mixStreams';
export * from './consumers/dispStreams';
export * from './consumers/stopShareScreen';
export * from './consumers/checkScreenShare';
export * from './consumers/startShareScreen';
export * from './consumers/requestScreenShare';
export * from './consumers/reorderStreams';
export * from './consumers/prepopulateUserMedia';
export * from './consumers/getVideos';
export * from './consumers/rePort';
export * from './consumers/trigger';
export * from './consumers/consumerResume';
export * from './consumers/connectSendTransportAudio';
export * from './consumers/connectSendTransportVideo';
export * from './consumers/connectSendTransportScreen';
export * from './consumers/processConsumerTransports';
export * from './consumers/resumePauseStreams';
export * from './consumers/readjust';
export * from './consumers/checkGrid';
export * from './consumers/getEstimate';
export * from './consumers/calculateRowsAndColumns';
export * from './consumers/addVideosGrid';
export * from './consumers/onScreenChanges';
export * from './consumers/changeVids';
export * from './consumers/compareActiveNames';
export * from './consumers/compareScreenStates';
export * from './consumers/createSendTransport';
export * from './consumers/resumeSendTransportAudio';
export * from './consumers/receiveAllPipedTransports';
export * from './consumers/disconnectSendTransportVideo';
export * from './consumers/disconnectSendTransportAudio';
export * from './consumers/disconnectSendTransportScreen';
export * from './consumers/connectSendTransport';
export * from './consumers/getPipedProducersAlt';
export * from './consumers/signalNewConsumerTransport';
export * from './consumers/connectRecvTransport';
export * from './consumers/reUpdateInter';
export * from './consumers/updateParticipantAudioDecibels';
export * from './consumers/closeAndResize';
export * from './consumers/autoAdjust';
export * from './consumers/switchUserVideoAlt';
export * from './consumers/switchUserVideo';
export * from './consumers/switchUserAudio';
export * from './consumers/receiveRoomMessages';
export * from './methods/utils/formatNumber';
export * from './consumers/connectIps';

// Poll and Meeting Methods
export * from './methods/pollsMethods/pollUpdated';
export * from './methods/pollsMethods/handleCreatePoll';
export * from './methods/pollsMethods/handleVotePoll';
export * from './methods/pollsMethods/handleEndPoll';

// Breakout Rooms
export * from './methods/breakoutRoomsMethods/breakoutRoomUpdated';

// Meeting Timer, Recording, and Waiting Room
export * from './methods/utils/meetingTimer/startMeetingProgressTimer';
export * from './methods/recordingMethods/updateRecording';
export * from './methods/recordingMethods/stopRecording';
export * from './producers/socketReceiveMethods/userWaiting';
export * from './producers/socketReceiveMethods/personJoined';
export * from './producers/socketReceiveMethods/allWaitingRoomMembers';

// Prebuilt Event Rooms
export * from './components/mediasfuComponents/MediasfuGeneric';
export * from './components/mediasfuComponents/MediasfuBroadcast';
export * from './components/mediasfuComponents/MediasfuWebinar';
export * from './components/mediasfuComponents/MediasfuConference';
export * from './components/mediasfuComponents/MediasfuChat';

// Random Data
export * from './methods/utils/generateRandomParticipants';
export * from './methods/utils/generateRandomMessages';
export * from './methods/utils/generateRandomRequestList';
export * from './methods/utils/generateRandomWaitingRoomList';
export * from './methods/utils/generateRandomPolls';

// Key UI Components
export * from './components/displayComponents/MeetingProgressTimer';
export * from './components/displayComponents/MiniAudio';
export * from './components/displayComponents/MiniCard';
export * from './components/displayComponents/AudioCard';
export * from './components/displayComponents/VideoCard';
export * from './components/displayComponents/CardVideoDisplay';
export * from './components/displayComponents/MiniCardAudio';
export * from './methods/utils/MiniAudioPlayer/MiniAudioPlayer';
export * from './methods/utils/SoundPlayer';


//initial values
import { initialValuesState } from './methods/utils/initialValuesState';

//import components for display (samples)
import LoadingModal from './components/displayComponents/LoadingModal';
import MainAspectComponent from './components/displayComponents/MainAspectComponent';
import ControlButtonsComponent from './components/displayComponents/ControlButtonsComponent';
import ControlButtonsAltComponent from './components/displayComponents/ControlButtonsAltComponent';
import ControlButtonsComponentTouch from './components/displayComponents/ControlButtonsComponentTouch';
import OthergridComponent from './components/displayComponents/OtherGridComponent';
import MainScreenComponent from './components/displayComponents/MainScreenComponent';
import MainGridComponent from './components/displayComponents/MainGridComponent';
import SubAspectComponent from './components/displayComponents/SubAspectComponent';
import MainContainerComponent from './components/displayComponents/MainContainerComponent';
import AlertComponent from './components/displayComponents/AlertComponent';
import MenuModal from './components/menuComponents/MenuModal';
import RecordingModal from './components/recordingComponents/RecordingModal';
import RequestsModal from './components/requestsComponents/RequestsModal';
import WaitingRoomModal from './components/waitingComponents/WaitingModal';
import DisplaySettingsModal from './components/displaySettingsComponents/DisplaySettingsModal';
import EventSettingsModal from './components/eventSettingsComponents/EventSettingsModal';
import CoHostModal from './components/coHostComponents/CoHostModal';
import ParticipantsModal from './components/participantsComponents/ParticipantsModal';
import MessagesModal from './components/messageComponents/MessagesModal';
import MediaSettingsModal from './components/mediaSettingsComponents/MediaSettingsModal';
import ConfirmExitModal from './components/exitComponents/ConfirmExitModal';
import ConfirmHereModal from './components/miscComponents/ConfirmHereModal';
import ShareEventModal from './components/miscComponents/ShareEventModal';
import WelcomePage from './components/miscComponents/WelcomePage';
import PreJoinPage from './components/miscComponents/PreJoinPage';

import PollModal from './components/pollsComponents/PollModal';
import BackgroundModal from './components/backgroundComponents/BackgroundModal';
import BreakoutRoomsModal from './components/breakoutComponents/BreakoutRoomsModal';
import ConfigureWhiteboardModal from './components/whiteboardComponents/ConfigureWhiteboardModal';
import Whiteboard from './components/whiteboardComponents/Whiteboard';
import Screenboard from './components/screenboardComponents/Screenboard';
import ScreenboardModal from './components/screenboardComponents/ScreenboardModal';

//pagination and display of media (samples)
import Pagination from './components/displayComponents/Pagination';
import FlexibleGrid from './components/displayComponents/FlexibleGrid';
import FlexibleVideo from './components/displayComponents/FlexibleVideo';
import AudioGrid from './components/displayComponents/AudioGrid';

//import methods for control (samples)
import { launchMenuModal } from './methods/menuMethods/launchMenuModal';
import { launchRecording } from './methods/recordingMethods/launchRecording';
import { startRecording } from './methods/recordingMethods/startRecording';
import { confirmRecording } from './methods/recordingMethods/confirmRecording';
import { launchWaiting } from './methods/waitingMethods/launchWaiting';
import { launchCoHost } from './methods/coHostMethods/launchCoHost';
import { launchMediaSettings } from './methods/mediaSettingsMethods/launchMediaSettings';
import { launchDisplaySettings } from './methods/displaySettingsMethods/launchDisplaySettings';
import { launchSettings } from './methods/settingsMethods/launchSettings';
import { launchRequests } from './methods/requestsMethods/launchRequests';
import { launchParticipants } from './methods/participantsMethods/launchParticipants';
import { launchMessages } from './methods/messageMethods/launchMessages';
import { launchConfirmExit } from './methods/exitMethods/launchConfirmExit';

import { launchPoll } from './methods/pollsMethods/launchPoll';
import { launchBackground } from './methods/backgroundMethods/launchBackground';
import { launchBreakoutRooms } from './methods/breakoutRoomsMethods/launchBreakoutRooms';
import { launchConfigureWhiteboard } from './methods/whiteboardMethods/launchConfigureWhiteboard';


// mediasfu functions -- examples
import { connectSocket, disconnectSocket } from './sockets/SocketManager';
import { joinRoomClient } from './ProducerClient/producerClientEmits/joinRoomClient';
import { updateRoomParametersClient } from './ProducerClient/producerClientEmits/updateRoomParametersClient';
import { createDeviceClient } from './ProducerClient/producerClientEmits/createDeviceClient';

import { switchVideoAlt } from './methods/streamMethods/switchVideoAlt';
import { clickVideo } from './methods/streamMethods/clickVideo';
import { clickAudio } from './methods/streamMethods/clickAudio';
import { clickScreenShare } from './methods/streamMethods/clickScreenShare';
import { streamSuccessVideo } from './consumers/streamSuccessVideo';
import { streamSuccessAudio } from './consumers/streamSuccessAudio';
import { streamSuccessScreen } from './consumers/streamSuccessScreen';
import { streamSuccessAudioSwitch } from './consumers/streamSuccessAudioSwitch';
import { checkPermission } from './consumers/checkPermission';
import { producerClosed } from './consumers/socketReceiveMethods/producerClosed';
import { newPipeProducer } from './consumers/socketReceiveMethods/newPipeProducer';


//mediasfu functions
import { updateMiniCardsGrid } from './consumers/updateMiniCardsGrid';
import { mixStreams } from './consumers/mixStreams';
import { dispStreams } from './consumers/dispStreams';
import { stopShareScreen } from './consumers/stopShareScreen';
import { checkScreenShare } from './consumers/checkScreenShare';
import { startShareScreen } from './consumers/startShareScreen';
import { requestScreenShare } from './consumers/requestScreenShare';
import { reorderStreams } from './consumers/reorderStreams';
import { prepopulateUserMedia } from './consumers/prepopulateUserMedia';
import { getVideos } from './consumers/getVideos';
import { rePort } from './consumers/rePort';
import { trigger } from './consumers/trigger';
import { consumerResume } from './consumers/consumerResume';
import { connectSendTransportAudio } from './consumers/connectSendTransportAudio';
import { connectSendTransportVideo } from './consumers/connectSendTransportVideo';
import { connectSendTransportScreen } from './consumers/connectSendTransportScreen';
import { processConsumerTransports } from './consumers/processConsumerTransports';
import { resumePauseStreams } from './consumers/resumePauseStreams';
import { readjust } from './consumers/readjust';
import { checkGrid } from './consumers/checkGrid';
import { getEstimate } from './consumers/getEstimate';
import { calculateRowsAndColumns } from './consumers/calculateRowsAndColumns';
import { addVideosGrid } from './consumers/addVideosGrid';
import { onScreenChanges } from './consumers/onScreenChanges';
import { sleep } from './methods/utils/sleep';
import { changeVids } from './consumers/changeVids';
import { compareActiveNames } from './consumers/compareActiveNames';
import { compareScreenStates } from './consumers/compareScreenStates';
import { createSendTransport } from './consumers/createSendTransport';
import { resumeSendTransportAudio } from './consumers/resumeSendTransportAudio';
import { receiveAllPipedTransports } from './consumers/receiveAllPipedTransports';
import { disconnectSendTransportVideo } from './consumers/disconnectSendTransportVideo';
import { disconnectSendTransportAudio } from './consumers/disconnectSendTransportAudio';
import { disconnectSendTransportScreen } from './consumers/disconnectSendTransportScreen';
import { connectSendTransport } from './consumers/connectSendTransport';
import { getPipedProducersAlt } from './consumers/getPipedProducersAlt';
import { signalNewConsumerTransport } from './consumers/signalNewConsumerTransport';
import { connectRecvTransport } from './consumers/connectRecvTransport';
import { reUpdateInter } from './consumers/reUpdateInter';
import { updateParticipantAudioDecibels } from './consumers/updateParticipantAudioDecibels';
import { closeAndResize } from './consumers/closeAndResize';
import { autoAdjust } from './consumers/autoAdjust';
import { switchUserVideoAlt } from './consumers/switchUserVideoAlt';
import { switchUserVideo } from './consumers/switchUserVideo';
import { switchUserAudio } from './consumers/switchUserAudio';
import { receiveRoomMessages } from './consumers/receiveRoomMessages';
import { formatNumber } from './methods/utils/formatNumber';
import { connectIps } from './consumers/connectIps';

import { pollUpdated } from './methods/pollsMethods/pollUpdated';
import { handleCreatePoll } from './methods/pollsMethods/handleCreatePoll';
import { handleVotePoll } from './methods/pollsMethods/handleVotePoll';
import { handleEndPoll } from './methods/pollsMethods/handleEndPoll';

import { breakoutRoomUpdated } from './methods/breakoutRoomsMethods/breakoutRoomUpdated';


import { startMeetingProgressTimer } from './methods/utils/meetingTimer/startMeetingProgressTimer';
import { updateRecording } from './methods/recordingMethods/updateRecording';
import { stopRecording } from './methods/recordingMethods/stopRecording';

import { userWaiting } from './producers/socketReceiveMethods/userWaiting';
import { personJoined } from './producers/socketReceiveMethods/personJoined';
import { allWaitingRoomMembers } from './producers/socketReceiveMethods/allWaitingRoomMembers';
import { roomRecordParams } from './producers/socketReceiveMethods/roomRecordParams';
import { banParticipant } from './producers/socketReceiveMethods/banParticipant';
import { updatedCoHost } from './producers/socketReceiveMethods/updatedCoHost';
import { participantRequested } from './producers/socketReceiveMethods/participantRequested';
import { screenProducerId } from './producers/socketReceiveMethods/screenProducerId';
import { updateMediaSettings } from './producers/socketReceiveMethods/updateMediaSettings';
import { producerMediaPaused } from './producers/socketReceiveMethods/producerMediaPaused';
import { producerMediaResumed } from './producers/socketReceiveMethods/producerMediaResumed';
import { producerMediaClosed } from './producers/socketReceiveMethods/producerMediaClosed';
import { controlMediaHost } from './producers/socketReceiveMethods/controlMediaHost';
import { meetingEnded } from './producers/socketReceiveMethods/meetingEnded';
import { disconnectUserSelf } from './producers/socketReceiveMethods/disconnectUserSelf';
import { receiveMessage } from './producers/socketReceiveMethods/receiveMessage';
import { meetingTimeRemaining } from './producers/socketReceiveMethods/meetingTimeRemaining';
import { meetingStillThere } from './producers/socketReceiveMethods/meetingStillThere';
import { startRecords } from './producers/socketReceiveMethods/startRecords';
import { reInitiateRecording } from './producers/socketReceiveMethods/reInitiateRecording';
import { getDomains } from './producers/socketReceiveMethods/getDomains';
import { updateConsumingDomains } from './producers/socketReceiveMethods/updateConsumingDomains';
import { recordingNotice } from './producers/socketReceiveMethods/recordingNotice';
import { timeLeftRecording } from './producers/socketReceiveMethods/timeLeftRecording';
import { stoppedRecording } from './producers/socketReceiveMethods/stoppedRecording';
import { hostRequestResponse } from './producers/socketReceiveMethods/hostRequestResponse';
import { allMembers } from './producers/socketReceiveMethods/allMembers';
import { allMembersRest } from './producers/socketReceiveMethods/allMembersRest';
import { disconnect } from './producers/socketReceiveMethods/disconnect';

import {captureCanvasStream} from './methods/whiteboardMethods/captureCanvasStream';
import {resumePauseAudioStreams} from './consumers/resumePauseAudioStreams';
import { processConsumerTransportsAudio } from './consumers/processConsumerTransportsAudio';


//Prebuilt Event Rooms
import MediasfuGeneric from './components/mediasfuComponents/MediasfuGeneric';
import MediasfuBroadcast from './components/mediasfuComponents/MediasfuBroadcast';
import MediasfuWebinar from './components/mediasfuComponents/MediasfuWebinar';
import MediasfuConference from './components/mediasfuComponents/MediasfuConference';
import MediasfuChat from './components/mediasfuComponents/MediasfuChat';

//Random Data
import { generateRandomParticipants } from './methods/utils/generateRandomParticipants';
import { generateRandomMessages } from './methods/utils/generateRandomMessages';
import { generateRandomRequestList } from './methods/utils/generateRandomRequestList';
import { generateRandomWaitingRoomList } from './methods/utils/generateRandomWaitingRoomList';
import { generateRandomPolls } from './methods/utils/generateRandomPolls';

//Key UI Components
import MeetingProgressTimer  from './components/displayComponents/MeetingProgressTimer';
import MiniAudio from './components/displayComponents/MiniAudio';
import MiniCard from './components/displayComponents/MiniCard';
import AudioCard from './components/displayComponents/AudioCard';
import VideoCard from './components/displayComponents/VideoCard';
import CardVideoDisplay from './components/displayComponents/CardVideoDisplay';
import MiniCardAudio from './components/displayComponents/MiniCardAudio';
import MiniAudioPlayer from './methods/utils/MiniAudioPlayer/MiniAudioPlayer';
import { SoundPlayer } from './methods/utils/SoundPlayer';


export { 
    initialValuesState,
    LoadingModal, MainAspectComponent, ControlButtonsComponent, ControlButtonsAltComponent, ControlButtonsComponentTouch, OthergridComponent, MainScreenComponent, MainGridComponent, SubAspectComponent, MainContainerComponent, AlertComponent, MenuModal, RecordingModal, RequestsModal, WaitingRoomModal, DisplaySettingsModal, EventSettingsModal, CoHostModal, ParticipantsModal, MessagesModal, MediaSettingsModal, ConfirmExitModal, ConfirmHereModal, ShareEventModal, WelcomePage, PreJoinPage,
    Pagination, FlexibleGrid, FlexibleVideo, AudioGrid,
    launchMenuModal, launchRecording, startRecording, confirmRecording, launchWaiting, launchCoHost, launchMediaSettings, launchDisplaySettings, launchSettings, launchRequests, launchParticipants, launchMessages, launchConfirmExit,
    connectSocket, disconnectSocket, joinRoomClient, updateRoomParametersClient, createDeviceClient,
    switchVideoAlt, clickVideo, clickAudio, clickScreenShare, streamSuccessVideo, streamSuccessAudio, streamSuccessScreen, streamSuccessAudioSwitch, checkPermission, producerClosed, newPipeProducer,
    updateMiniCardsGrid, mixStreams, dispStreams, stopShareScreen, checkScreenShare, startShareScreen, requestScreenShare, reorderStreams, prepopulateUserMedia, getVideos, rePort, trigger, consumerResume, connectSendTransportAudio, connectSendTransportVideo, connectSendTransportScreen, processConsumerTransports, resumePauseStreams, readjust, checkGrid, getEstimate, 
    calculateRowsAndColumns, addVideosGrid, onScreenChanges, sleep, changeVids, compareActiveNames, compareScreenStates, createSendTransport, resumeSendTransportAudio, receiveAllPipedTransports, disconnectSendTransportVideo, disconnectSendTransportAudio, disconnectSendTransportScreen, connectSendTransport, getPipedProducersAlt, signalNewConsumerTransport, connectRecvTransport, reUpdateInter, updateParticipantAudioDecibels, closeAndResize, autoAdjust, switchUserVideoAlt, switchUserVideo, switchUserAudio, receiveRoomMessages, formatNumber, connectIps,
    startMeetingProgressTimer, updateRecording, stopRecording,
    
    userWaiting, personJoined, allWaitingRoomMembers, roomRecordParams, banParticipant, updatedCoHost, participantRequested, screenProducerId, updateMediaSettings, producerMediaPaused, producerMediaResumed, producerMediaClosed, controlMediaHost, meetingEnded, disconnectUserSelf, receiveMessage, meetingTimeRemaining, meetingStillThere, startRecords, reInitiateRecording, getDomains, updateConsumingDomains, recordingNotice, timeLeftRecording, stoppedRecording, hostRequestResponse, allMembers, allMembersRest, disconnect,
    MediasfuGeneric, MediasfuBroadcast, MediasfuWebinar, MediasfuConference, MediasfuChat, generateRandomParticipants, generateRandomMessages, generateRandomRequestList, generateRandomWaitingRoomList, generateRandomPolls,

    MeetingProgressTimer, MiniAudio, MiniCard, AudioCard, VideoCard, CardVideoDisplay, MiniCardAudio, MiniAudioPlayer, SoundPlayer,

    captureCanvasStream, resumePauseAudioStreams, processConsumerTransportsAudio,
    pollUpdated, handleCreatePoll, handleVotePoll, handleEndPoll, breakoutRoomUpdated,

    launchPoll, launchBackground, launchBreakoutRooms, launchConfigureWhiteboard,

    PollModal, BackgroundModal, BreakoutRoomsModal, ConfigureWhiteboardModal, Whiteboard, Screenboard, ScreenboardModal
};
