import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import MiniAudio from '../../components/displayComponents/MiniAudio';

const stageDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', padding: 24, background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)', position: 'relative' }}>
		<Story />
	</div>
);

const meta = {
	title: 'Display Components/Mini Audio',
	component: MiniAudio,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		visible: true,
		name: 'Host Audio Spotlight',
		showWaveform: true,
		overlayPosition: 'topRight',
		barColor: '#22c55e',
		textColor: '#f8fafc',
		imageSource: 'https://mediasfu.com/images/logo192.png',
		roundedImage: true,
	},
} satisfies Meta<typeof MiniAudio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
