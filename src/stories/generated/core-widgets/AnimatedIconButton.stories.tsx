// @ts-nocheck

import { AnimatedIconButton } from '../../../components_modern/core/widgets';

const meta = {
	title: 'Generated/Core Widgets/Animated Icon Button',
	component: AnimatedIconButton,
	tags: ['autodocs', 'generated'],
	args: {
		icon: <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>+</span>,
		onPress: () => undefined,
		tooltip: "Generated control",
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
