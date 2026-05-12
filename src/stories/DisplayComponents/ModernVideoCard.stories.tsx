import React, { useEffect, useMemo, useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { ModernVideoCard } from '../../components_modern/display_components/ModernVideoCard';
import {
	createPreviewCanvasStream,
	createPreviewDisplayParameters,
	previewPrimaryParticipant,
	previewDisplayAudioLevels,
} from '../generated-support/manualDisplayStoryFixtures';

const stageDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', padding: 24, background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)' }}>
		<div style={{ maxWidth: 520 }}>
			<Story />
		</div>
	</div>
);

function VideoCardPreview() {
	const [stream, setStream] = useState<MediaStream | null>(null);

	useEffect(() => {
		const preview = createPreviewCanvasStream({ title: 'ModernVideoCard' });
		setStream(preview.stream);

		return () => {
			preview.dispose();
		};
	}, []);

	const parameters = useMemo(
		() => createPreviewDisplayParameters({ audioDecibels: previewDisplayAudioLevels }),
		[]
	);

	return (
		<ModernVideoCard
			name={previewPrimaryParticipant.name}
			remoteProducerId="storybook-video-producer"
			eventType="conference"
			forceFullDisplay={false}
			videoStream={stream}
			participant={previewPrimaryParticipant as any}
			parameters={parameters as any}
			isDarkMode
			showSubtitles
		/>
	);
}

const meta = {
	title: 'Display Components/Modern Video Card',
	component: ModernVideoCard,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
} satisfies Meta<typeof ModernVideoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		name: previewPrimaryParticipant.name,
		remoteProducerId: 'storybook-video-producer',
		eventType: 'conference',
		forceFullDisplay: false,
		videoStream: null,
		participant: previewPrimaryParticipant as any,
		parameters: {} as any,
	},
	render: () => <VideoCardPreview />,
};
