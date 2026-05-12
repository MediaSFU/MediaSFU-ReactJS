// @ts-nocheck

import { ModernTooltip } from '../../../components_modern/core/widgets';

const meta = {
	title: 'Generated/Core Widgets/Modern Tooltip',
	component: ModernTooltip,
	tags: ['autodocs', 'generated'],
	args: {
		message: "Generated tooltip preview",
		isDarkMode: true,
		children: <button type="button" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#F8FAFC', cursor: 'pointer' }}>Hover target</button>,
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
