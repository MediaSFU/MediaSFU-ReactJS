import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const targets = [
	{
		barrelFile: 'src/components_modern/core/widgets/index.ts',
		outputDir: 'src/stories/generated/core-widgets',
		importPath: '../../../components_modern/core/widgets',
		titlePrefix: 'Generated/Core Widgets',
		exclude: new Set(['GlassmorphicContainer', 'GradientCard', 'PremiumButton']),
	},
	{
		barrelFile: 'src/components_modern/display_components/index.ts',
		outputDir: 'src/stories/generated/display-components',
		importPath: '../../../components_modern/display_components',
		titlePrefix: 'Generated/Display Components',
		exclude: new Set([
			'ModernAudioCard',
			'ModernControlButtonsComponent',
			'ModernFlexibleGrid',
			'ModernFlexibleVideo',
			'ModernMainContainerComponent',
			'ModernPagination',
			'ModernVideoCard',
		]),
	},
	{
		barrelFile: 'src/components_modern/misc_components/index.ts',
		outputDir: 'src/stories/generated/misc-components',
		importPath: '../../../components_modern/misc_components',
		titlePrefix: 'Generated/Misc Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/participants_components/index.ts',
		outputDir: 'src/stories/generated/participants-components',
		importPath: '../../../components_modern/participants_components',
		titlePrefix: 'Generated/Participants Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/message_components/index.ts',
		outputDir: 'src/stories/generated/message-components',
		importPath: '../../../components_modern/message_components',
		titlePrefix: 'Generated/Message Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/recording_components/index.ts',
		outputDir: 'src/stories/generated/recording-components',
		importPath: '../../../components_modern/recording_components',
		titlePrefix: 'Generated/Recording Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/menu_components/index.ts',
		outputDir: 'src/stories/generated/menu-components',
		importPath: '../../../components_modern/menu_components',
		titlePrefix: 'Generated/Menu Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/media_settings_components/index.ts',
		outputDir: 'src/stories/generated/media-settings-components',
		importPath: '../../../components_modern/media_settings_components',
		titlePrefix: 'Generated/Media Settings Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/display_settings_components/index.ts',
		outputDir: 'src/stories/generated/display-settings-components',
		importPath: '../../../components_modern/display_settings_components',
		titlePrefix: 'Generated/Display Settings Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/event_settings_components/index.ts',
		outputDir: 'src/stories/generated/event-settings-components',
		importPath: '../../../components_modern/event_settings_components',
		titlePrefix: 'Generated/Event Settings Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/requests_components/index.ts',
		outputDir: 'src/stories/generated/requests-components',
		importPath: '../../../components_modern/requests_components',
		titlePrefix: 'Generated/Requests Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/waiting_components/index.ts',
		outputDir: 'src/stories/generated/waiting-components',
		importPath: '../../../components_modern/waiting_components',
		titlePrefix: 'Generated/Waiting Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/co_host_components/index.ts',
		outputDir: 'src/stories/generated/co-host-components',
		importPath: '../../../components_modern/co_host_components',
		titlePrefix: 'Generated/Co-Host Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/exit_components/index.ts',
		outputDir: 'src/stories/generated/exit-components',
		importPath: '../../../components_modern/exit_components',
		titlePrefix: 'Generated/Exit Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/polls_components/index.ts',
		outputDir: 'src/stories/generated/polls-components',
		importPath: '../../../components_modern/polls_components',
		titlePrefix: 'Generated/Polls Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/breakout_components/index.ts',
		outputDir: 'src/stories/generated/breakout-components',
		importPath: '../../../components_modern/breakout_components',
		titlePrefix: 'Generated/Breakout Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/whiteboard_components/index.ts',
		outputDir: 'src/stories/generated/whiteboard-components',
		importPath: '../../../components_modern/whiteboard_components',
		titlePrefix: 'Generated/Whiteboard Components',
		exclude: new Set(),
	},
	{
		barrelFile: 'src/components_modern/mediasfu_components/index.ts',
		outputDir: 'src/stories/generated/mediasfu-components',
		importPath: '../../../components_modern/mediasfu_components',
		titlePrefix: 'Generated/MediaSFU Components',
		exclude: new Set(['ModernMediasfuGeneric']),
	},
];

const componentConfigs = {
	GlowContainer: {
		args: [
			"children: <div style={{ color: '#F8FAFC', lineHeight: 1.6 }}>Generated baseline preview</div>,",
			'isDarkMode: true,',
		],
	},
	NeumorphicContainer: {
		args: [
			"children: <div style={{ color: '#F8FAFC', lineHeight: 1.6 }}>Generated baseline preview</div>,",
			'isDarkMode: true,',
			'backgroundColor: \"#111827\",',
		],
	},
	PulseBorderContainer: {
		args: [
			"children: <div style={{ color: '#F8FAFC', lineHeight: 1.6 }}>Generated baseline preview</div>,",
			'isDarkMode: true,',
		],
	},
	StyledContainer: {
		args: [
			"children: <div style={{ color: '#F8FAFC', lineHeight: 1.6 }}>Generated baseline preview</div>,",
			'isDarkMode: true,',
			'enableGlow: true,',
			'enableGlassmorphism: true,',
		],
	},
	PremiumTextField: {
		args: [
			'value: \"preview@example.com\",',
			'label: \"Email Address\",',
			'placeholder: \"Enter your email\",',
			'variant: \"glass\",',
			'isDarkMode: true,',
			'fullWidth: true,',
		],
		decorator: 'field',
	},
	AnimatedIconButton: {
		args: [
			"icon: <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>+</span>,",
			'onPress: () => undefined,',
			'tooltip: \"Generated control\",',
			'isDarkMode: true,',
		],
	},
	ShimmerLoading: {
		args: ['width: 260,', 'height: 18,', 'isDarkMode: true,'],
	},
	ShimmerCard: {
		args: ['isDarkMode: true,', 'imageHeight: 140,'],
		decorator: 'card',
	},
	ShimmerText: {
		args: ['lines: 4,', 'isDarkMode: true,'],
		decorator: 'field',
	},
	ShimmerAvatar: {
		args: ['size: 56,', 'isDarkMode: true,'],
	},
	AnimatedGradientBackground: {
		args: [
			"children: <div style={{ color: '#F8FAFC', fontWeight: 600, letterSpacing: '0.02em' }}>Animated gradient preview</div>,",
			'animationType: \"rotate\",',
			'isDarkMode: true,',
			"style: { minWidth: 320, minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },",
		],
	},
	SidebarPanel: {
		args: [
			'activeSidebarContent: \"menu\",',
			'canNavigateBack: true,',
			'onNavigateBack: () => undefined,',
			'onClose: () => undefined,',
			'width: 360,',
			'isDarkMode: true,',
			"children: <div style={{ color: '#F8FAFC', lineHeight: 1.7 }}>Generated sidebar content preview</div>,",
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernTooltip: {
		args: [
			'message: \"Generated tooltip preview\",',
			'isDarkMode: true,',
			"children: <button type=\"button\" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#F8FAFC', cursor: 'pointer' }}>Hover target</button>,",
		],
	},
	ModernLoadingModal: {
		args: [
			'isVisible: true,',
			'loadingText: "Preparing meeting canvas",',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernAlertComponent: {
		args: [
			'visible: true,',
			'message: "Generated alert preview",',
			'type: "success",',
			'duration: 0,',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'stage',
	},
	ModernMiniCard: {
		args: [
			'initials: "MS",',
			'isDarkMode: true,',
			'size: 120,',
		],
		decorator: 'avatar',
	},
	ModernMeetingProgressTimer: {
		args: [
			'meetingProgressTime: "10:24",',
			'isDarkMode: true,',
			'isRecording: true,',
			'position: "topRight",',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'relativeStage',
	},
	ModernConfirmHereModal: {
		imports: [
			"import { previewConfirmHereSocket, previewLocalConfirmHereSocket } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isConfirmHereModalVisible: true,',
			'onConfirmHereClose: () => undefined,',
			'countdownDuration: 120,',
			'socket: previewConfirmHereSocket,',
			'localSocket: previewLocalConfirmHereSocket,',
			'roomName: "storybook-room",',
			'member: "PreviewUser",',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernPreJoinPage: {
		imports: [
			"import { previewPreJoinParameters } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'parameters: previewPreJoinParameters,',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernWelcomePage: {
		imports: [
			"import { previewWelcomeParameters } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'parameters: previewWelcomeParameters,',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernParticipantsModal: {
		imports: [
			"import { createPreviewMeetingParameters, previewParticipantCount } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isParticipantsModalVisible: true,',
			'onParticipantsClose: () => undefined,',
			'onParticipantsFilterChange: () => undefined,',
			'participantsCounter: previewParticipantCount,',
			'parameters: createPreviewMeetingParameters(),',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernMessagesModal: {
		imports: [
			"import { previewMessages, previewMember, previewCoHost, previewCoHostResponsibilities, previewRoomName, previewMeetingSocket } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isMessagesModalVisible: true,',
			'onMessagesClose: () => undefined,',
			'messages: previewMessages,',
			'eventType: \"conference\",',
			'member: previewMember,',
			'islevel: \"2\",',
			'coHostResponsibility: previewCoHostResponsibilities,',
			'coHost: previewCoHost,',
			'startDirectMessage: false,',
			'directMessageDetails: null,',
			'updateStartDirectMessage: () => undefined,',
			'updateDirectMessageDetails: () => undefined,',
			'showAlert: () => undefined,',
			'roomName: previewRoomName,',
			'socket: previewMeetingSocket,',
			'chatSetting: \"allow\",',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernRecordingModal: {
		imports: [
			"import { createPreviewMeetingParameters } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isRecordingModalVisible: true,',
			'onClose: () => undefined,',
			'confirmRecording: async () => undefined,',
			'startRecording: async () => undefined,',
			'parameters: createPreviewMeetingParameters(),',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernMenuModal: {
		imports: [
			"import { previewRoomName, previewMeetingLink } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isVisible: true,',
			'onClose: () => undefined,',
			'roomName: previewRoomName,',
			'adminPasscode: \"1234\",',
			'islevel: \"2\",',
			'localLink: previewMeetingLink,',
			'eventType: \"conference\",',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernMediaSettingsModal: {
		imports: [
			"import { createPreviewMeetingParameters } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isMediaSettingsModalVisible: true,',
			'onMediaSettingsClose: () => undefined,',
			'parameters: createPreviewMeetingParameters(),',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernDisplaySettingsModal: {
		imports: [
			"import { createPreviewMeetingParameters } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isDisplaySettingsModalVisible: true,',
			'onDisplaySettingsClose: () => undefined,',
			'parameters: createPreviewMeetingParameters(),',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernEventSettingsModal: {
		imports: [
			"import { previewRoomName, previewMeetingSocket } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isEventSettingsModalVisible: true,',
			'onEventSettingsClose: () => undefined,',
			'audioSetting: \"approval\",',
			'videoSetting: \"approval\",',
			'screenshareSetting: \"approval\",',
			'chatSetting: \"allow\",',
			'updateAudioSetting: () => undefined,',
			'updateVideoSetting: () => undefined,',
			'updateScreenshareSetting: () => undefined,',
			'updateChatSetting: () => undefined,',
			'updateIsSettingsModalVisible: () => undefined,',
			'roomName: previewRoomName,',
			'socket: previewMeetingSocket,',
			'showAlert: () => undefined,',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernRequestsModal: {
		imports: [
			"import { createPreviewMeetingParameters, previewRequestList, previewRoomName, previewMeetingSocket } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isRequestsModalVisible: true,',
			'onRequestClose: () => undefined,',
			'requestCounter: previewRequestList.length,',
			'onRequestFilterChange: () => undefined,',
			'requestList: previewRequestList,',
			'updateRequestList: () => undefined,',
			'roomName: previewRoomName,',
			'socket: previewMeetingSocket,',
			'parameters: createPreviewMeetingParameters(),',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernWaitingModal: {
		imports: [
			"import { createPreviewMeetingParameters, previewWaitingRoomList, previewRoomName, previewMeetingSocket } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isWaitingModalVisible: true,',
			'onWaitingRoomClose: () => undefined,',
			'waitingRoomCounter: previewWaitingRoomList.length,',
			'onWaitingRoomFilterChange: () => undefined,',
			'waitingRoomList: previewWaitingRoomList,',
			'updateWaitingList: () => undefined,',
			'roomName: previewRoomName,',
			'socket: previewMeetingSocket,',
			'parameters: createPreviewMeetingParameters(),',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernCoHostModal: {
		imports: [
			"import { previewParticipants, previewCoHost, previewCoHostResponsibilities, previewRoomName, previewMeetingSocket } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isCoHostModalVisible: true,',
			'currentCohost: previewCoHost,',
			'participants: previewParticipants,',
			'coHostResponsibility: previewCoHostResponsibilities,',
			'roomName: previewRoomName,',
			'showAlert: () => undefined,',
			'updateCoHostResponsibility: () => undefined,',
			'updateCoHost: () => undefined,',
			'updateIsCoHostModalVisible: () => undefined,',
			'socket: previewMeetingSocket,',
			'onCoHostClose: () => undefined,',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernConfirmExitModal: {
		imports: [
			"import { previewRoomName, previewMeetingSocket, previewMember } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isConfirmExitModalVisible: true,',
			'onConfirmExitClose: () => undefined,',
			'member: previewMember,',
			'roomName: previewRoomName,',
			'socket: previewMeetingSocket,',
			'islevel: \"2\",',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernPollModal: {
		imports: [
			"import { previewPolls, previewActivePoll, previewMember, previewRoomName, previewMeetingSocket } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isPollModalVisible: true,',
			'onClose: () => undefined,',
			'member: previewMember,',
			'islevel: \"2\",',
			'polls: previewPolls,',
			'poll: previewActivePoll,',
			'socket: previewMeetingSocket,',
			'roomName: previewRoomName,',
			'showAlert: () => undefined,',
			'updateIsPollModalVisible: () => undefined,',
			'handleCreatePoll: async () => undefined,',
			'handleEndPoll: async () => undefined,',
			'handleVotePoll: async () => undefined,',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernBreakoutRoomsModal: {
		imports: [
			"import { createPreviewMeetingParameters } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isVisible: true,',
			'onBreakoutRoomsClose: () => undefined,',
			'parameters: createPreviewMeetingParameters(),',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernConfigureWhiteboardModal: {
		imports: [
			"import { createPreviewMeetingParameters } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'isVisible: true,',
			'onConfigureWhiteboardClose: () => undefined,',
			'parameters: createPreviewMeetingParameters(),',
			'isDarkMode: true,',
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
	ModernMediasfuGeneric: {
		imports: [
			"import { previewHostSeedData } from '../../generated-support/modernStorybookFixtures';",
		],
		args: [
			'useLocalUIMode: true,',
			'useSeed: true,',
			'seedData: previewHostSeedData,',
			"credentials: { apiUserName: 'demo-user', apiKey: 'demo-key' },",
			"containerStyle: { minHeight: '100vh' },",
		],
		parameters: "{ layout: 'fullscreen' }",
		decorator: 'none',
	},
};

const decorators = {
	default: `
	decorators: [
		(Story) => (
			<div style={{ minWidth: 320, padding: 24, background: '#020617' }}>
				<Story />
			</div>
		),
	],`,
	field: `
	decorators: [
		(Story) => (
			<div style={{ width: 360, maxWidth: '100%', padding: 24, background: '#020617' }}>
				<Story />
			</div>
		),
	],`,
	card: `
	decorators: [
		(Story) => (
			<div style={{ width: 320, maxWidth: '100%', padding: 24, background: '#020617' }}>
				<Story />
			</div>
		),
	],`,
	avatar: `
	decorators: [
		(Story) => (
			<div style={{ width: 220, height: 220, padding: 24, background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Story />
			</div>
		),
	],`,
	stage: `
	decorators: [
		(Story) => (
			<div style={{ minHeight: '100vh', padding: 24, background: '#020617', position: 'relative' }}>
				<Story />
			</div>
		),
	],`,
	relativeStage: `
	decorators: [
		(Story) => (
			<div style={{ minHeight: 220, padding: 24, background: '#020617', position: 'relative' }}>
				<Story />
			</div>
		),
	],`,
};

function humanizeComponentName(name) {
	return name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim();
}

function parseBarrelExports(contents) {
	const matches = contents.matchAll(/export\s*\{\s*([^}]+)\s*\}\s*from\s*['"][^'"]+['"];?/g);
	const exportAllMatches = contents.matchAll(/export\s*\*\s*from\s*['"]([^'"]+)['"];?/g);
	const exportNames = [];

	for (const match of matches) {
		const names = match[1]
			.split(',')
			.map((entry) => entry.trim())
			.filter(Boolean)
			.map((entry) => {
				const aliasMatch = entry.match(/^(?:type\s+)?(.+?)\s+as\s+(.+)$/);

				if (aliasMatch) {
					return aliasMatch[2].trim();
				}

				return entry.trim();
			});

		for (const name of names) {
			if (!name.startsWith('type ')) {
				exportNames.push(name);
			}
		}
	}

	for (const match of exportAllMatches) {
		const modulePath = match[1].trim();
		const parts = modulePath.split('/').filter(Boolean);
		const moduleName = parts[parts.length - 1];

		if (moduleName) {
			exportNames.push(moduleName);
		}
	}

	return exportNames;
}

function buildStoryFile(componentName, target) {
	const config = componentConfigs[componentName] || {};
	const title = `${target.titlePrefix}/${humanizeComponentName(componentName)}`;
	const importsBlock = config.imports?.length ? `${config.imports.join('\n')}\n\n` : '';
	const argsBlock = config.args?.length
		? `\n\targs: {\n${config.args.map((line) => `\t\t${line}`).join('\n')}\n\t},`
		: '';
	const parametersBlock = config.parameters ? `\n\tparameters: ${config.parameters},` : '';
	const decoratorKey = config.decorator === 'none' ? null : config.decorator || 'default';
	const decoratorBlock = decoratorKey ? `\n${decorators[decoratorKey]}` : '';

	return `// @ts-nocheck

${importsBlock}import { ${componentName} } from '${target.importPath}';

const meta = {
\ttitle: '${title}',
\tcomponent: ${componentName},
\ttags: ['autodocs', 'generated'],${argsBlock}${parametersBlock}${decoratorBlock}
};

export default meta;

export const Default = {};
`;
}

async function ensureCleanDirectory(dirPath) {
	await fs.rm(dirPath, { recursive: true, force: true });
	await fs.mkdir(dirPath, { recursive: true });
}

async function writeGeneratedStories() {
	for (const target of targets) {
		const barrelPath = path.join(projectRoot, target.barrelFile);
		const outputDir = path.join(projectRoot, target.outputDir);
		const barrelContents = await fs.readFile(barrelPath, 'utf8');
		const exportNames = parseBarrelExports(barrelContents)
			.filter((name) => !target.exclude.has(name))
			.filter((name) => componentConfigs[name]);

		await ensureCleanDirectory(outputDir);

		for (const componentName of exportNames) {
			const storyPath = path.join(outputDir, `${componentName}.stories.tsx`);
			await fs.writeFile(storyPath, buildStoryFile(componentName, target), 'utf8');
		}

		console.log(`Generated ${exportNames.length} stories from ${target.barrelFile}`);
	}
}

await writeGeneratedStories();