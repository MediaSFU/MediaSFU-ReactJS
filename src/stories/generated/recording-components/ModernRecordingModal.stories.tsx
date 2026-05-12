// @ts-nocheck

import { createPreviewMeetingParameters } from '../../generated-support/modernStorybookFixtures';

import { ModernRecordingModal } from '../../../components_modern/recording_components';

const meta = {
	title: 'Generated/Recording Components/Modern Recording Modal',
	component: ModernRecordingModal,
	tags: ['autodocs', 'generated'],
	args: {
		isRecordingModalVisible: true,
		onClose: () => undefined,
		confirmRecording: async () => undefined,
		startRecording: async () => undefined,
		parameters: createPreviewMeetingParameters(),
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
