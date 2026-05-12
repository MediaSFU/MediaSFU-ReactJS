import React, { useMemo } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { ModernAudioCard } from '../../components_modern/display_components/ModernAudioCard';
import {
	createPreviewDisplayParameters,
	previewSecondaryParticipant,
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
		<ModernAudioCard
			name={previewSecondaryParticipant.name}
			participant={previewSecondaryParticipant as any}
			parameters={parameters as any}
			isDarkMode
			showSubtitles
		/>
	);
	}

const meta = {
	title: 'Display Components/Modern Audio Card',
	component: ModernAudioCard,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
} satisfies Meta<typeof ModernAudioCard>;

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
