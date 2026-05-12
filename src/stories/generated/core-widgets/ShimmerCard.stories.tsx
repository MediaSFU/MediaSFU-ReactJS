// @ts-nocheck

import { ShimmerCard } from '../../../components_modern/core/widgets';

const meta = {
	title: 'Generated/Core Widgets/Shimmer Card',
	component: ShimmerCard,
	tags: ['autodocs', 'generated'],
	args: {
		isDarkMode: true,
		imageHeight: 140,
	},

	decorators: [
		(Story) => (
			<div style={{ width: 320, maxWidth: '100%', padding: 24, background: '#020617' }}>
				<Story />
			</div>
		),
	],
};

export default meta;

export const Default = {};
