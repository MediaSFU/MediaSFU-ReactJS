// @ts-nocheck

import { previewParticipants, previewCoHost, previewCoHostResponsibilities, previewRoomName, previewMeetingSocket } from '../../generated-support/modernStorybookFixtures';

import { ModernCoHostModal } from '../../../components_modern/co_host_components';

const meta = {
	title: 'Generated/Co-Host Components/Modern Co Host Modal',
	component: ModernCoHostModal,
	tags: ['autodocs', 'generated'],
	args: {
		isCoHostModalVisible: true,
		currentCohost: previewCoHost,
		participants: previewParticipants,
		coHostResponsibility: previewCoHostResponsibilities,
		roomName: previewRoomName,
		showAlert: () => undefined,
		updateCoHostResponsibility: () => undefined,
		updateCoHost: () => undefined,
		updateIsCoHostModalVisible: () => undefined,
		socket: previewMeetingSocket,
		onCoHostClose: () => undefined,
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
