// @ts-nocheck

import { ShimmerAvatar } from '../../../components_modern/core/widgets';

const meta = {
	title: 'Generated/Core Widgets/Shimmer Avatar',
	component: ShimmerAvatar,
	tags: ['autodocs', 'generated'],
	args: {
		size: 56,
		isDarkMode: true,
	},

	decorators: [
		(Story) => (
			<div style={{ minWidth: 320, padding: 24, background: '#020617' }}>
				<Story />
			</div>
		),
	],
};

export default meta;

export const Default = {};
