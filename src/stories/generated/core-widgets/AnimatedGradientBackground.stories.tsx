// @ts-nocheck

import { AnimatedGradientBackground } from '../../../components_modern/core/widgets';

const meta = {
	title: 'Generated/Core Widgets/Animated Gradient Background',
	component: AnimatedGradientBackground,
	tags: ['autodocs', 'generated'],
	args: {
		children: <div style={{ color: '#F8FAFC', fontWeight: 600, letterSpacing: '0.02em' }}>Animated gradient preview</div>,
		animationType: "rotate",
		isDarkMode: true,
		style: { minWidth: 320, minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
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
