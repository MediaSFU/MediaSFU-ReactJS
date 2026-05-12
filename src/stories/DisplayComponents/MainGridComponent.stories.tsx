import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import MainGridComponent from '../../components/displayComponents/MainGridComponent';

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
	title: 'Display Components/Main Grid Component',
	component: MainGridComponent,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		backgroundColor: '#020617',
		mainSize: 68,
		height: 420,
		width: 980,
		showAspect: true,
		timeBackgroundColor: 'rgba(59, 130, 246, 0.85)',
		showTimer: true,
		meetingProgressTime: '00:24:18',
		children: (
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '2fr 1fr',
					gap: 16,
					height: '100%',
					padding: 24,
					boxSizing: 'border-box',
				}}
			>
				<div style={{ borderRadius: 20, background: 'linear-gradient(135deg, #1d4ed8, #0f172a)', padding: 20, color: '#f8fafc' }}>
					<h3 style={{ marginTop: 0 }}>Primary stage</h3>
					<p style={{ marginBottom: 0 }}>Spotlight video, screenboard, or host canvas lives here.</p>
				</div>
				<div style={{ borderRadius: 20, background: 'rgba(15, 23, 42, 0.9)', padding: 20, color: '#cbd5e1' }}>
					<h4 style={{ marginTop: 0 }}>Context panel</h4>
					<p style={{ marginBottom: 0 }}>Pinned notes, chat snippets, or room metadata.</p>
				</div>
			</div>
		),
	},
} satisfies Meta<typeof MainGridComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
