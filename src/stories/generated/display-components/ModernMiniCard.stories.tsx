// @ts-nocheck

import { ModernMiniCard } from '../../../components_modern/display_components';

const meta = {
	title: 'Generated/Display Components/Modern Mini Card',
	component: ModernMiniCard,
	tags: ['autodocs', 'generated'],
	args: {
		initials: "MS",
		isDarkMode: true,
		size: 120,
	},

	decorators: [
		(Story) => (
			<div style={{ width: 220, height: 220, padding: 24, background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Story />
			</div>
		),
	],
};

export default meta;

export const Default = {};
