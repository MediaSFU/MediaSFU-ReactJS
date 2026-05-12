// @ts-nocheck

import { previewConfirmHereSocket, previewLocalConfirmHereSocket } from '../../generated-support/modernStorybookFixtures';

import { ModernConfirmHereModal } from '../../../components_modern/misc_components';

const meta = {
	title: 'Generated/Misc Components/Modern Confirm Here Modal',
	component: ModernConfirmHereModal,
	tags: ['autodocs', 'generated'],
	args: {
		isConfirmHereModalVisible: true,
		onConfirmHereClose: () => undefined,
		countdownDuration: 120,
		socket: previewConfirmHereSocket,
		localSocket: previewLocalConfirmHereSocket,
		roomName: "storybook-room",
		member: "PreviewUser",
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
