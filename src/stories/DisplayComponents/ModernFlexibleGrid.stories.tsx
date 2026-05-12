import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { ModernFlexibleGrid } from '../../components_modern/display_components/ModernFlexibleGrid';

const stageDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', padding: 24, background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)' }}>
		<Story />
	</div>
);

const gridTiles = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'].map((label, index) => (
	<div
		key={label}
		style={{
			width: '100%',
			height: '100%',
			minHeight: 120,
			display: 'grid',
			placeItems: 'center',
			borderRadius: 12,
			background: index % 2 === 0 ? 'linear-gradient(135deg, rgba(37,99,235,0.72), rgba(14,165,233,0.56))' : 'linear-gradient(135deg, rgba(16,185,129,0.72), rgba(59,130,246,0.48))',
			color: '#f8fafc',
			fontWeight: 700,
			letterSpacing: '0.04em',
		}}
	>
		{label}
	</div>
));

const meta = {
	title: 'Display Components/Modern Flexible Grid',
	component: ModernFlexibleGrid,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		customWidth: 280,
		customHeight: 160,
		rows: 2,
		columns: 3,
		componentsToRender: gridTiles,
		isDarkMode: true,
	},
} satisfies Meta<typeof ModernFlexibleGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
