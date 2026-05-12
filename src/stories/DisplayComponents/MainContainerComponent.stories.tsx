import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import MainContainerComponent from '../../components/displayComponents/MainContainerComponent';

const stageDecorator: Decorator = (Story) => (
	<div
		style={{
			minHeight: '100vh',
			padding: 24,
			background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)',
			position: 'relative',
		}}
	>
		<Story />
	</div>
);

const meta = {
	title: 'Display Components/Main Container Component',
	component: MainContainerComponent,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		backgroundColor: 'rgba(15, 23, 42, 0.92)',
		containerWidthFraction: 0.86,
		containerHeightFraction: 0.74,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		marginBottom: 0,
		padding: 24,
		children: (
			<div style={{ color: '#e2e8f0' }}>
				<h3 style={{ marginTop: 0, color: '#f8fafc' }}>Classic main container</h3>
				<p>This classic container is useful when you want the older layout primitive rather than the modern glassmorphic shell.</p>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
						gap: 16,
					}}
				>
					<div style={{ borderRadius: 18, background: 'rgba(29, 78, 216, 0.36)', padding: 18 }}>Primary content column</div>
					<div style={{ borderRadius: 18, background: 'rgba(15, 23, 42, 0.82)', padding: 18 }}>Support content column</div>
				</div>
			</div>
		),
	},
} satisfies Meta<typeof MainContainerComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
