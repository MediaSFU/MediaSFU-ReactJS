// @ts-nocheck

import { previewWelcomeParameters } from '../../generated-support/modernStorybookFixtures';

import { ModernWelcomePage } from '../../../components_modern/misc_components';

const meta = {
	title: 'Generated/Misc Components/Modern Welcome Page',
	component: ModernWelcomePage,
	tags: ['autodocs', 'generated'],
	args: {
		parameters: previewWelcomeParameters,
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default = {};
