// @ts-nocheck

import { ShimmerText } from '../../../components_modern/core/widgets';

const meta = {
	title: 'Generated/Core Widgets/Shimmer Text',
	component: ShimmerText,
	tags: ['autodocs', 'generated'],
	args: {
		lines: 4,
		isDarkMode: true,
	},

	decorators: [
		(Story) => (
			<div style={{ width: 360, maxWidth: '100%', padding: 24, background: '#020617' }}>
				<Story />
			</div>
		),
	],
};

export default meta;

export const Default = {};
