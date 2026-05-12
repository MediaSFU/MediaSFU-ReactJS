// @ts-nocheck

import { createPreviewMeetingParameters } from '../../generated-support/modernStorybookFixtures';

import { ModernDisplaySettingsModal } from '../../../components_modern/display_settings_components';

const meta = {
	title: 'Generated/Display Settings Components/Modern Display Settings Modal',
	component: ModernDisplaySettingsModal,
	tags: ['autodocs', 'generated'],
	args: {
		isDisplaySettingsModalVisible: true,
		onDisplaySettingsClose: () => undefined,
		parameters: createPreviewMeetingParameters(),
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
