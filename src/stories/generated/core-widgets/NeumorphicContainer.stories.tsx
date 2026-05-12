// @ts-nocheck

import { NeumorphicContainer } from '../../../components_modern/core/widgets';

const meta = {
	title: 'Generated/Core Widgets/Neumorphic Container',
	component: NeumorphicContainer,
	tags: ['autodocs', 'generated'],
	args: {
		children: <div style={{ color: '#F8FAFC', lineHeight: 1.6 }}>Generated baseline preview</div>,
		isDarkMode: true,
		backgroundColor: "#111827",
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
