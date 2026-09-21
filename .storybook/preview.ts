import type { Preview } from '@storybook/react';

import '../src/utils/injectCriticalStyles';
import mediaSFUTheme from './theme';

const preview: Preview = {
	parameters: {
		layout: 'centered',
		docs: {
			theme: mediaSFUTheme,
			toc: true,
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: 'slate',
			values: [
				{ name: 'slate', value: '#0f172a' },
				{ name: 'paper', value: '#f8fafc' },
				{ name: 'midnight', value: '#020617' },
			],
		},
		options: {
			storySort: (a, b) => {
				const sectionOrder = ['Guides', 'MediaSFU Components', 'Core Widgets', 'Display Components', 'Background Components', 'Whiteboard Components', 'Internal Components', 'Generated'];
				const sectionA = a.title.split('/')[0];
				const sectionB = b.title.split('/')[0];
				const sectionIndexA = sectionOrder.indexOf(sectionA);
				const sectionIndexB = sectionOrder.indexOf(sectionB);

				if (sectionIndexA !== -1 || sectionIndexB !== -1) {
					if (sectionIndexA === -1) {
						return 1;
					}

					if (sectionIndexB === -1) {
						return -1;
					}

					if (sectionIndexA !== sectionIndexB) {
						return sectionIndexA - sectionIndexB;
					}
				} else {
					const sectionComparison = sectionA.localeCompare(sectionB);

					if (sectionComparison !== 0) {
						return sectionComparison;
					}
				}

				if (a.title !== b.title) {
					return a.title.localeCompare(b.title);
				}

				if (a.type !== b.type) {
					return a.type === 'docs' ? 1 : -1;
				}

				if (a.type === 'story' && b.type === 'story') {
					if (a.name === 'Default' && b.name !== 'Default') {
						return -1;
					}

					if (b.name === 'Default' && a.name !== 'Default') {
						return 1;
					}
				}

				return a.name.localeCompare(b.name);
			},
		},
	},
};

export default preview;
