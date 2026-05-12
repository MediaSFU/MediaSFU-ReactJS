// @ts-nocheck

import { createPreviewMeetingParameters } from '../../generated-support/modernStorybookFixtures';

import { ModernBreakoutRoomsModal } from '../../../components_modern/breakout_components';

const meta = {
	title: 'Generated/Breakout Components/Modern Breakout Rooms Modal',
	component: ModernBreakoutRoomsModal,
	tags: ['autodocs', 'generated'],
	args: {
		isVisible: true,
		onBreakoutRoomsClose: () => undefined,
		parameters: createPreviewMeetingParameters(),
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
