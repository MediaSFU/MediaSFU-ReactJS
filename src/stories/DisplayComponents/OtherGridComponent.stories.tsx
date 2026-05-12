import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import OtherGridComponent from '../../components/displayComponents/OtherGridComponent';

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
	title: 'Display Components/Other Grid Component',
	component: OtherGridComponent,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		backgroundColor: '#020617',
		width: 880,
		height: 320,
		showAspect: true,
		timeBackgroundColor: 'rgba(34, 197, 94, 0.82)',
		showTimer: true,
		meetingProgressTime: '00:24:18',
		children: (
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
					gap: 14,
					height: '100%',
					padding: 20,
					boxSizing: 'border-box',
				}}
			>
				{['Chat', 'Queue', 'Spotlight backlog'].map((title) => (
					<div key={title} style={{ borderRadius: 18, background: 'rgba(15, 23, 42, 0.88)', color: '#e2e8f0', padding: 18 }}>
						<h4 style={{ marginTop: 0 }}>{title}</h4>
						<p style={{ marginBottom: 0 }}>Secondary content can be tiled here without displacing the main stage.</p>
					</div>
				))}
			</div>
		),
	},
} satisfies Meta<typeof OtherGridComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
