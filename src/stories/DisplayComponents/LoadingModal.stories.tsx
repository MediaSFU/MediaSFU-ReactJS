import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import LoadingModal from '../../components/displayComponents/LoadingModal';

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
				maxWidth: 1040,
				margin: '0 auto',
				padding: 32,
				borderRadius: 24,
				background: 'rgba(15, 23, 42, 0.64)',
				color: '#e2e8f0',
			}}
		>
			<h2 style={{ marginTop: 0 }}>Broadcast setup</h2>
			<p style={{ marginBottom: 0 }}>Previewing the loading overlay against a branded page background.</p>
		</div>
		<Story />
	</div>
);

const meta = {
	title: 'Display Components/Loading Modal',
	component: LoadingModal,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		isVisible: true,
		backgroundColor: 'rgba(2, 6, 23, 0.72)',
		displayColor: '#f8fafc',
		loadingText: 'Connecting to the MediaSFU room…',
		showSpinner: true,
	},
} satisfies Meta<typeof LoadingModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
