import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import AudioGrid from '../../components/displayComponents/AudioGrid';
import MiniCardAudio from '../../components/displayComponents/MiniCardAudio';

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

const audioTiles = ['Host', 'Rachel', 'Ivy', 'Tariq', 'Mina', 'Noah'].map((name, index) => (
	<div key={name} style={{ width: '100%', minHeight: 168, aspectRatio: '1 / 1' }}>
		<MiniCardAudio
			name={name}
			showWaveform={index % 2 === 0}
			overlayPosition="bottomRight"
			barColor={index % 2 === 0 ? '#22c55e' : '#38bdf8'}
			textColor="#f8fafc"
			imageSource="https://mediasfu.com/images/logo192.png"
			roundedImage
			customStyle={{
				width: '100%',
				height: '100%',
				borderRadius: 18,
				overflow: 'hidden',
				background: 'linear-gradient(135deg, #1d4ed8, #0f172a)',
			}}
		/>
	</div>
));

const meta = {
	title: 'Display Components/Audio Grid',
	component: AudioGrid,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		componentsToRender: [],
	},
} satisfies Meta<typeof AudioGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div style={{ width: 'min(94vw, 960px)' }}>
			<AudioGrid
				componentsToRender={audioTiles}
				containerProps={{
					style: {
						display: 'grid',
						gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
						gap: 16,
					},
				}}
			/>
		</div>
	),
};
