// @ts-nocheck

import { previewRoomName, previewMeetingSocket, previewMember } from '../../generated-support/modernStorybookFixtures';

import { ModernConfirmExitModal } from '../../../components_modern/exit_components';

const meta = {
	title: 'Generated/Exit Components/Modern Confirm Exit Modal',
	component: ModernConfirmExitModal,
	tags: ['autodocs', 'generated'],
	args: {
		isConfirmExitModalVisible: true,
		onConfirmExitClose: () => undefined,
		member: previewMember,
		roomName: previewRoomName,
		socket: previewMeetingSocket,
		islevel: "2",
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
