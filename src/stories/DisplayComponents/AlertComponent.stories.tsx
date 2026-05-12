import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import AlertComponent from '../../components/displayComponents/AlertComponent';

const stageDecorator: Decorator = (Story) => (
	<div
		style={{
			minHeight: '100vh',
			padding: 24,
			background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)',
			position: 'relative',
		}}
	>
		<div
			style={{
				maxWidth: 960,
				margin: '0 auto',
				padding: 32,
				borderRadius: 24,
				background: 'rgba(15, 23, 42, 0.72)',
				color: '#e2e8f0',
			}}
		>
			<h2 style={{ marginTop: 0 }}>Live room shell</h2>
			<p style={{ marginBottom: 0 }}>This stage exists only to show the alert overlay in a realistic meeting surface.</p>
		</div>
		<Story />
	</div>
);

const meta = {
	title: 'Display Components/Alert Component',
	component: AlertComponent,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		visible: true,
		message: 'Media connected. Host controls are ready.',
		type: 'success',
		duration: 600000,
		textColor: '#f8fafc',
		position: 'top-right',
	},
} satisfies Meta<typeof AlertComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
