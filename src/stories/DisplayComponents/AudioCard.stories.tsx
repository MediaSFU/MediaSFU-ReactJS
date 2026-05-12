import React, { useMemo } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import AudioCard from '../../components/displayComponents/AudioCard';
import {
	createPreviewDisplayParameters,
	previewSecondaryParticipant,
	previewDisplayAudioLevels,
} from '../generated-support/manualDisplayStoryFixtures';

const stageDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', padding: 24, background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)' }}>
		<div style={{ width: 340, height: 340 }}>
			<Story />
		</div>
	</div>
);

function AudioCardPreview() {
	const parameters = useMemo(() => createPreviewDisplayParameters(), []);

	return (
		<AudioCard
			name={previewSecondaryParticipant.name}
			participant={previewSecondaryParticipant as any}
			parameters={parameters as any}
			audioDecibels={previewDisplayAudioLevels[1] as any}
			barColor="#38bdf8"
			backgroundColor="#020617"
			showSubtitles
		/>
	);
	}

const meta = {
	title: 'Display Components/Audio Card',
	component: AudioCard,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
} satisfies Meta<typeof AudioCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		name: previewSecondaryParticipant.name,
		participant: previewSecondaryParticipant as any,
		parameters: {} as any,
	},
	render: () => <AudioCardPreview />,
};
