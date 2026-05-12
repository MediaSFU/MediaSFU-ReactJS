// @ts-nocheck

import { createPreviewMeetingParameters } from '../../generated-support/modernStorybookFixtures';

import { ModernConfigureWhiteboardModal } from '../../../components_modern/whiteboard_components';

const meta = {
	title: 'Generated/Whiteboard Components/Modern Configure Whiteboard Modal',
	component: ModernConfigureWhiteboardModal,
	tags: ['autodocs', 'generated'],
	args: {
		isVisible: true,
		onConfigureWhiteboardClose: () => undefined,
		parameters: createPreviewMeetingParameters(),
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
