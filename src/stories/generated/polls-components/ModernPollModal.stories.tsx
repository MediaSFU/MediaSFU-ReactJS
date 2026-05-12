// @ts-nocheck

import { previewPolls, previewActivePoll, previewMember, previewRoomName, previewMeetingSocket } from '../../generated-support/modernStorybookFixtures';

import { ModernPollModal } from '../../../components_modern/polls_components';

const meta = {
	title: 'Generated/Polls Components/Modern Poll Modal',
	component: ModernPollModal,
	tags: ['autodocs', 'generated'],
	args: {
		isPollModalVisible: true,
		onClose: () => undefined,
		member: previewMember,
		islevel: "2",
		polls: previewPolls,
		poll: previewActivePoll,
		socket: previewMeetingSocket,
		roomName: previewRoomName,
		showAlert: () => undefined,
		updateIsPollModalVisible: () => undefined,
		handleCreatePoll: async () => undefined,
		handleEndPoll: async () => undefined,
		handleVotePoll: async () => undefined,
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
