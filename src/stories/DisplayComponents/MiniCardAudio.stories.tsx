import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import MiniCardAudio from '../../components/displayComponents/MiniCardAudio';

const stageDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', padding: 24, background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)' }}>
		<div style={{ width: 220, height: 220, position: 'relative' }}>
			<Story />
		</div>
	</div>
);

const meta = {
	title: 'Display Components/Mini Card Audio',
	component: MiniCardAudio,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		name: 'Panelist Audio Card',
		showWaveform: true,
		overlayPosition: 'bottomRight',
		barColor: '#38bdf8',
		textColor: '#f8fafc',
		imageSource: 'https://mediasfu.com/images/logo192.png',
		roundedImage: true,
		customStyle: {
			borderRadius: 16,
			overflow: 'hidden',
			background: 'linear-gradient(135deg, #1d4ed8, #0f172a)',
		},
	},
} satisfies Meta<typeof MiniCardAudio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
