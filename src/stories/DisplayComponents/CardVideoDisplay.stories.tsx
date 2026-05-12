import React, { useEffect, useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import CardVideoDisplay from '../../components/displayComponents/CardVideoDisplay';
import { createPreviewCanvasStream } from '../generated-support/manualDisplayStoryFixtures';

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

function CardVideoDisplayPreview() {
	const [stream, setStream] = useState<MediaStream | null>(null);

	useEffect(() => {
		const preview = createPreviewCanvasStream({ title: 'CardVideoDisplay' });
		setStream(preview.stream);

		return () => preview.dispose();
	}, []);

	return (
		<div
			style={{
				width: 'min(92vw, 980px)',
				aspectRatio: '16 / 9',
				borderRadius: 24,
				overflow: 'hidden',
				boxShadow: '0 24px 60px rgba(15, 23, 42, 0.45)',
			}}
		>
			<CardVideoDisplay
				remoteProducerId="storybook-remote-producer"
				eventType="conference"
				forceFullDisplay
				videoStream={stream}
				backgroundColor="#020617"
			/>
		</div>
	);
}

const meta = {
	title: 'Display Components/Card Video Display',
	component: CardVideoDisplay,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		remoteProducerId: 'storybook-remote-producer',
		eventType: 'conference',
		forceFullDisplay: true,
		videoStream: null,
	},
} satisfies Meta<typeof CardVideoDisplay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <CardVideoDisplayPreview />,
};
