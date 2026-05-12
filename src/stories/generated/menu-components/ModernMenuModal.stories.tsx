// @ts-nocheck

import { previewRoomName, previewMeetingLink } from '../../generated-support/modernStorybookFixtures';

import { ModernMenuModal } from '../../../components_modern/menu_components';

const meta = {
	title: 'Generated/Menu Components/Modern Menu Modal',
	component: ModernMenuModal,
	tags: ['autodocs', 'generated'],
	args: {
		isVisible: true,
		onClose: () => undefined,
		roomName: previewRoomName,
		adminPasscode: "1234",
		islevel: "2",
		localLink: previewMeetingLink,
		eventType: "conference",
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
