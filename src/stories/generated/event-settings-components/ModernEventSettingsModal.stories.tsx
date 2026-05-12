// @ts-nocheck

import { previewRoomName, previewMeetingSocket } from '../../generated-support/modernStorybookFixtures';

import { ModernEventSettingsModal } from '../../../components_modern/event_settings_components';

const meta = {
	title: 'Generated/Event Settings Components/Modern Event Settings Modal',
	component: ModernEventSettingsModal,
	tags: ['autodocs', 'generated'],
	args: {
		isEventSettingsModalVisible: true,
		onEventSettingsClose: () => undefined,
		audioSetting: "approval",
		videoSetting: "approval",
		screenshareSetting: "approval",
		chatSetting: "allow",
		updateAudioSetting: () => undefined,
		updateVideoSetting: () => undefined,
		updateScreenshareSetting: () => undefined,
		updateChatSetting: () => undefined,
		updateIsSettingsModalVisible: () => undefined,
		roomName: previewRoomName,
		socket: previewMeetingSocket,
		showAlert: () => undefined,
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
