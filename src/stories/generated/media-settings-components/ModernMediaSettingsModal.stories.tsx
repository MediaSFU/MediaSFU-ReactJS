// @ts-nocheck

import { createPreviewMeetingParameters } from '../../generated-support/modernStorybookFixtures';

import { ModernMediaSettingsModal } from '../../../components_modern/media_settings_components';

const meta = {
	title: 'Generated/Media Settings Components/Modern Media Settings Modal',
	component: ModernMediaSettingsModal,
	tags: ['autodocs', 'generated'],
	args: {
		isMediaSettingsModalVisible: true,
		onMediaSettingsClose: () => undefined,
		parameters: createPreviewMeetingParameters(),
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
