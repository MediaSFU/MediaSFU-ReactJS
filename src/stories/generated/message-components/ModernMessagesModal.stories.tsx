// @ts-nocheck

import { previewMessages, previewMember, previewCoHost, previewCoHostResponsibilities, previewRoomName, previewMeetingSocket } from '../../generated-support/modernStorybookFixtures';

import { ModernMessagesModal } from '../../../components_modern/message_components';

const meta = {
	title: 'Generated/Message Components/Modern Messages Modal',
	component: ModernMessagesModal,
	tags: ['autodocs', 'generated'],
	args: {
		isMessagesModalVisible: true,
		onMessagesClose: () => undefined,
		messages: previewMessages,
		eventType: "conference",
		member: previewMember,
		islevel: "2",
		coHostResponsibility: previewCoHostResponsibilities,
		coHost: previewCoHost,
		startDirectMessage: false,
		directMessageDetails: null,
		updateStartDirectMessage: () => undefined,
		updateDirectMessageDetails: () => undefined,
		showAlert: () => undefined,
		roomName: previewRoomName,
		socket: previewMeetingSocket,
		chatSetting: "allow",
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
