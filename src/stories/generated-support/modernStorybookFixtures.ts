// @ts-nocheck

import { generateRandomParticipants } from '../../methods/utils/generateRandomParticipants';
import { generateRandomMessages } from '../../methods/utils/generateRandomMessages';
import { generateRandomRequestList } from '../../methods/utils/generateRandomRequestList';
import { generateRandomWaitingRoomList } from '../../methods/utils/generateRandomWaitingRoomList';
import { generateRandomPolls } from '../../methods/utils/generateRandomPolls';

const noop = () => undefined;
const asyncNoop = async () => undefined;

export const previewRoomName = 'storybook-room';
export const previewMeetingLink = 'https://mediasfu.com/meeting/storybook-room';
export const previewHost = 'HostUser';
export const previewMember = 'PreviewUser';
export const previewCoHost = 'CoHostUser';

const createPreviewSocket = (id) => ({
	id,
	emit: (...args) => {
		const callback = args[args.length - 1];
		if (typeof callback === 'function') {
			callback({ success: true });
		}
	},
	on: noop,
	off: noop,
});

export const previewMeetingSocket = createPreviewSocket('storybook-socket');
export const previewConfirmHereSocket = previewMeetingSocket;
export const previewLocalConfirmHereSocket = createPreviewSocket('storybook-local-socket');

export const previewParticipants = generateRandomParticipants({
	member: previewMember,
	coHost: previewCoHost,
	host: previewHost,
});

export const previewParticipantCount = previewParticipants.length;

export const previewMessages = generateRandomMessages({
	participants: previewParticipants,
	member: previewMember,
	coHost: previewCoHost,
	host: previewHost,
});

export const previewRequestList = generateRandomRequestList({
	participants: previewParticipants,
	hostName: previewHost,
	coHostName: previewCoHost,
	numberOfRequests: 1,
});

export const previewWaitingRoomList = generateRandomWaitingRoomList();

const seededPolls = generateRandomPolls({ numberOfPolls: 3 });

export const previewPolls = seededPolls.map((poll, index) => {
	if (index !== 0) {
		return poll;
	}

	return {
		...poll,
		status: 'active',
		votes: poll.options.map((_, optionIndex) => (optionIndex === 0 ? 4 : optionIndex === 1 ? 2 : 1)),
	};
});

export const previewActivePoll = previewPolls[0];

export const previewWhiteboardUsers = [
	{ name: previewParticipants[1]?.name || 'Alice', useBoard: true },
	{ name: previewParticipants[2]?.name || 'Bob', useBoard: true },
];

export const previewCoHostResponsibilities = [
	{ name: 'participants', value: true, dedicated: false },
	{ name: 'chat', value: true, dedicated: false },
	{ name: 'media', value: true, dedicated: false },
	{ name: 'screen', value: false, dedicated: false },
	{ name: 'polls', value: true, dedicated: false },
];

const previewVideoInputs = [
	{ deviceId: 'camera-front', label: 'Front Camera' },
	{ deviceId: 'camera-rear', label: 'Rear Camera' },
];

const previewAudioInputs = [
	{ deviceId: 'mic-default', label: 'Default Microphone' },
	{ deviceId: 'mic-usb', label: 'USB Microphone' },
];

const previewBreakoutRooms = [
	[
		{ name: previewParticipants[1]?.name || 'Alice', breakRoom: 0 },
		{ name: previewParticipants[2]?.name || 'Bob', breakRoom: 0 },
	],
	[
		{ name: previewParticipants[3]?.name || 'Charlie', breakRoom: 1 },
		{ name: previewParticipants[4]?.name || 'Dana', breakRoom: 1 },
	],
];

const createCommonParameters = () => ({
	imgSrc: 'https://mediasfu.com/images/logo192.png',
	showAlert: noop,
	updateIsLoadingModalVisible: noop,
	connectSocket: async () => previewMeetingSocket,
	connectLocalSocket: async () => previewLocalConfirmHereSocket,
	updateSocket: noop,
	updateLocalSocket: noop,
	updateValidated: noop,
	updateApiUserName: noop,
	updateApiToken: noop,
	updateLink: noop,
	updateRoomName: noop,
	updateMember: noop,
	updateAudioPreference: noop,
	updateVideoPreference: noop,
	updateAudioOutputPreference: noop,
	updateIsDarkMode: noop,
	updateEventType: noop,
	updateVirtualBackground: noop,
	updateCurrentFacingMode: noop,
	updateKeepBackground: noop,
	updateAppliedBackground: noop,
	updateSelfieSegmentation: noop,
	roomName: previewRoomName,
	member: previewMember,
	coHost: previewCoHost,
	islevel: '2',
	eventType: 'conference',
	socket: previewMeetingSocket,
	localSocket: previewLocalConfirmHereSocket,
	participants: previewParticipants,
	filteredParticipants: previewParticipants,
	coHostResponsibility: previewCoHostResponsibilities,
	updateIsMessagesModalVisible: noop,
	updateDirectMessageDetails: noop,
	updateStartDirectMessage: noop,
	updateParticipants: noop,
	filteredRequestList: previewRequestList,
	updateRequestList: noop,
	filteredWaitingRoomList: previewWaitingRoomList,
	updateWaitingList: noop,
	videoInputs: previewVideoInputs,
	audioInputs: previewAudioInputs,
	userDefaultVideoInputDevice: previewVideoInputs[0].deviceId,
	userDefaultAudioInputDevice: previewAudioInputs[0].deviceId,
	isBackgroundModalVisible: false,
	updateIsBackgroundModalVisible: noop,
	meetingDisplayType: 'video',
	autoWave: false,
	forceFullDisplay: false,
	meetingVideoOptimized: true,
	updateMeetingDisplayType: noop,
	itemPageLimit: 6,
	canStartBreakout: true,
	breakoutRooms: previewBreakoutRooms,
	updateBreakoutRooms: noop,
	updateCanStartBreakout: noop,
	shareScreenStarted: false,
	shared: false,
	newParticipantAction: 'autoAssignNewRoom',
	breakOutRoomStarted: false,
	breakOutRoomEnded: false,
	updateBreakOutRoomStarted: noop,
	updateBreakOutRoomEnded: noop,
	prevMeetingDisplayType: 'video',
	whiteboardStarted: false,
	whiteboardEnded: true,
	whiteboardUsers: previewWhiteboardUsers,
	updateWhiteboardUsers: noop,
	updateWhiteboardStarted: noop,
	updateWhiteboardEnded: noop,
	updateCanStartWhiteboard: noop,
	updateIsConfigureWhiteboardModalVisible: noop,
	onScreenChanges: asyncNoop,
	prepopulateUserMedia: asyncNoop,
	rePort: asyncNoop,
	captureCanvasStream: asyncNoop,
	mainHeightWidth: 100,
	updateMainHeightWidth: noop,
	hostLabel: previewHost,
	recordStarted: false,
	recordResumed: false,
	recordPaused: false,
	recordStopped: false,
	recordingMediaOptions: 'all',
	recordingAudioOptions: 'all',
	recordingVideoOptions: 'all',
	recordingAddHLS: false,
	updateRecordingMediaOptions: noop,
	updateRecordingAudioOptions: noop,
	updateRecordingVideoOptions: noop,
	updateRecordingAddHLS: noop,
	recordingVideoType: 'camera',
	recordingDisplayType: 'all',
	recordingBackgroundColor: '#0f172a',
	recordingNameTagsColor: '#ffffff',
	recordingOrientationVideo: 'landscape',
	recordingNameTags: true,
	recordingAddText: true,
	recordingCustomText: 'MediaSFU Preview',
	recordingCustomTextPosition: 'bottom',
	recordingCustomTextColor: '#ffffff',
	updateRecordingVideoType: noop,
	updateRecordingDisplayType: noop,
	updateRecordingBackgroundColor: noop,
	updateRecordingNameTagsColor: noop,
	updateRecordingOrientationVideo: noop,
	updateRecordingNameTags: noop,
	updateRecordingAddText: noop,
	updateRecordingCustomText: noop,
	updateRecordingCustomTextPosition: noop,
	updateRecordingCustomTextColor: noop,
});

export const createPreviewMeetingParameters = () => {
	const parameters = createCommonParameters();
	parameters.getUpdatedAllParams = () => parameters;
	return parameters;
};

export const previewWelcomeParameters = createCommonParameters();
export const previewPreJoinParameters = createCommonParameters();

export const previewSeedData = {
	member: previewMember,
	host: previewHost,
	coHost: previewCoHost,
	eventType: 'conference',
	participants: previewParticipants,
	messages: previewMessages,
	waitingList: previewWaitingRoomList,
	requests: previewRequestList,
	polls: previewPolls,
	breakoutRooms: previewBreakoutRooms,
	whiteboardUsers: previewWhiteboardUsers,
};

export const previewHostSeedData = {
	...previewSeedData,
	member: previewHost,
};

export const previewPermissionConfig = {
	level0: {
		useMic: 'approval',
		useCamera: 'approval',
		useScreen: 'disallow',
		useChat: 'allow',
	},
	level1: {
		useMic: 'allow',
		useCamera: 'allow',
		useScreen: 'approval',
		useChat: 'allow',
	},
};

export const previewPanelists = previewParticipants
	.filter((participant) => participant?.islevel !== '2' && participant?.name !== previewMember)
	.slice(0, 2);

export const previewTranslationConfig = {
	supportTranslation: true,
	spokenLanguageMode: 'any',
	listenLanguageMode: 'any',
	maxActiveChannelsPerSpeaker: 3,
	autoDetectSpokenLanguage: true,
	allowSpokenLanguageChange: true,
	allowListenLanguageChange: true,
	translationVoiceConfig: {
		ttsNickName: 'deepgram',
	},
	providerGroups: null,
};

export const previewListenPreferences = new Map(
	previewPanelists.map((participant, index) => [participant?.id || participant?.name || `speaker-${index + 1}`, index === 0 ? 'fr' : 'es'])
);

export const previewVoiceClones = [
	{
		id: 'storybook-clone-1',
		providerVoiceId: 'storybook-clone-1',
		name: 'Storybook Default Clone',
		provider: 'elevenlabs',
		isDefault: true,
	},
];

const previewTranslationLanguages = [
	{ code: 'en', name: 'English', nativeName: 'English', ttsSupport: 'excellent', region: 'global' },
	{ code: 'fr', name: 'French', nativeName: 'Français', ttsSupport: 'excellent', region: 'europe' },
	{ code: 'es', name: 'Spanish', nativeName: 'Español', ttsSupport: 'excellent', region: 'global' },
	{ code: 'de', name: 'German', nativeName: 'Deutsch', ttsSupport: 'excellent', region: 'europe' },
];

export const createPreviewTranslationSocket = () => {
	const baseSocket = createPreviewSocket('storybook-translation-socket');

	return {
		...baseSocket,
		emit: (event, data, callback) => {
			const request = data && typeof data === 'object' ? data : {};

			if (event === 'translation:getVoices' && typeof callback === 'function') {
				const language = request.language || 'en';
				const provider = request.provider || 'deepgram';

				callback({
					provider,
					language,
					voices: {
						male: [
							{ id: `${language}-male-1`, name: `Guide ${language.toUpperCase()}`, gender: 'male', provider, language },
						],
						female: [
							{ id: `${language}-female-1`, name: `Clarity ${language.toUpperCase()}`, gender: 'female', provider, language },
						],
					},
				});
				return;
			}

			if (event === 'translation:getLanguages' && typeof callback === 'function') {
				callback({ languages: previewTranslationLanguages });
				return;
			}

			if (typeof callback === 'function') {
				callback({ success: true });
			}
		},
	};
};