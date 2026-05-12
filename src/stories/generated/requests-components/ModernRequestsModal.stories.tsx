// @ts-nocheck

import { createPreviewMeetingParameters, previewRequestList, previewRoomName, previewMeetingSocket } from '../../generated-support/modernStorybookFixtures';

import { ModernRequestsModal } from '../../../components_modern/requests_components';

const meta = {
	title: 'Generated/Requests Components/Modern Requests Modal',
	component: ModernRequestsModal,
	tags: ['autodocs', 'generated'],
	args: {
		isRequestsModalVisible: true,
		onRequestClose: () => undefined,
		requestCounter: previewRequestList.length,
		onRequestFilterChange: () => undefined,
		requestList: previewRequestList,
		updateRequestList: () => undefined,
		roomName: previewRoomName,
		socket: previewMeetingSocket,
		parameters: createPreviewMeetingParameters(),
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
