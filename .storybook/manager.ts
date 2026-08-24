import { addons } from '@storybook/manager-api';

import mediaSFUTheme from './theme';

addons.setConfig({
	theme: mediaSFUTheme,
	panelPosition: 'right',
	sidebar: {
		showRoots: true,
	},
	toolbar: {
		zoom: { hidden: false },
	},
});
