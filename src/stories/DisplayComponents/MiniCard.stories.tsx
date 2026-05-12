import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import MiniCard from '../../components/displayComponents/MiniCard';

const stageDecorator: Decorator = (Story) => (
	<div
		style={{
			minHeight: '100vh',
			padding: 24,
			background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)',
			display: 'grid',
			placeItems: 'center',
		}}
	>
		<Story />
	</div>
);

const meta = {
	title: 'Display Components/Mini Card',
	component: MiniCard,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		initials: 'MS',
		fontSize: 26,
		customStyle: {
			width: 120,
			height: 120,
			borderRadius: 28,
			background: 'linear-gradient(135deg, #1d4ed8, #38bdf8)',
			color: '#f8fafc',
			boxShadow: '0 22px 48px rgba(15, 23, 42, 0.35)',
		},
	},
} satisfies Meta<typeof MiniCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
