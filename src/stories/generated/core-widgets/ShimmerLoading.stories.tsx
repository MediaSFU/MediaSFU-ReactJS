// @ts-nocheck

import { ShimmerLoading } from '../../../components_modern/core/widgets';

const meta = {
	title: 'Generated/Core Widgets/Shimmer Loading',
	component: ShimmerLoading,
	tags: ['autodocs', 'generated'],
	args: {
		width: 260,
		height: 18,
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
