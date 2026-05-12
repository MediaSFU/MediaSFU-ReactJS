// @ts-nocheck

import { createPreviewMeetingParameters, previewParticipantCount } from '../../generated-support/modernStorybookFixtures';

import { ModernParticipantsModal } from '../../../components_modern/participants_components';

const meta = {
	title: 'Generated/Participants Components/Modern Participants Modal',
	component: ModernParticipantsModal,
	tags: ['autodocs', 'generated'],
	args: {
		isParticipantsModalVisible: true,
		onParticipantsClose: () => undefined,
		onParticipantsFilterChange: () => undefined,
		participantsCounter: previewParticipantCount,
		parameters: createPreviewMeetingParameters(),
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
