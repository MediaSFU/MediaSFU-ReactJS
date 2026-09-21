import { create } from '@storybook/theming/create';

import { mediaSFUDocsUrl } from './links';

const mediaSFUTheme = create({
	base: 'dark',
	brandTitle: 'MediaSFU React SDK',
	brandUrl: mediaSFUDocsUrl,
	// The production MediaSFU wordmark is copied from the main frontend and
	// served locally so the catalog remains branded offline.
	brandImage: './mediasfu-logo.png',
	appBg: '#04131f',
	appContentBg: '#0b1f2f',
	appPreviewBg: '#020617',
	appBorderColor: '#1f465f',
	appBorderRadius: 12,
	colorPrimary: '#1ec0b8',
	colorSecondary: '#71d4ff',
	barBg: '#081725',
	barTextColor: '#d7e5f2',
	barSelectedColor: '#1ec0b8',
	barHoverColor: '#71d4ff',
	inputBg: '#0f2435',
	inputBorder: '#1f465f',
	inputTextColor: '#e6f2fb',
	textColor: '#e6f2fb',
	textInverseColor: '#081725',
	textMutedColor: '#94a7bb',
});

export default mediaSFUTheme;
