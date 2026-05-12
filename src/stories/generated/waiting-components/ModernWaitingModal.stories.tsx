// @ts-nocheck

import { createPreviewMeetingParameters, previewWaitingRoomList, previewRoomName, previewMeetingSocket } from '../../generated-support/modernStorybookFixtures';

import { ModernWaitingModal } from '../../../components_modern/waiting_components';

const meta = {
	title: 'Generated/Waiting Components/Modern Waiting Modal',
	component: ModernWaitingModal,
	tags: ['autodocs', 'generated'],
	args: {
		isWaitingModalVisible: true,
		onWaitingRoomClose: () => undefined,
		waitingRoomCounter: previewWaitingRoomList.length,
		onWaitingRoomFilterChange: () => undefined,
		waitingRoomList: previewWaitingRoomList,
		updateWaitingList: () => undefined,
		roomName: previewRoomName,
		socket: previewMeetingSocket,
		parameters: createPreviewMeetingParameters(),
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
