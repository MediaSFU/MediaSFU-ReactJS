import React, { useMemo, useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import Whiteboard from '../../components/whiteboardComponents/Whiteboard';
import {
	buildWhiteboardParameters,
	previewWhiteboardShapes,
	previewWhiteboardParticipants,
	previewWhiteboardParticipantUsers,
} from '../generated-support/manualDisplayStoryFixtures';

const stageDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', padding: 24, background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)' }}>
		<Story />
	</div>
);

function WhiteboardPreview() {
	const [shapes, setShapes] = useState(previewWhiteboardShapes as any[]);
	const [useImageBackground, setUseImageBackground] = useState(false);
	const [redoStack, setRedoStack] = useState<any[]>([]);
	const [undoStack, setUndoStack] = useState<string[]>([]);
	const [whiteboardStarted, setWhiteboardStarted] = useState(true);
	const [whiteboardEnded, setWhiteboardEnded] = useState(false);
	const [whiteboardUsers, setWhiteboardUsers] = useState(previewWhiteboardParticipantUsers as any[]);
	const [participants, setParticipants] = useState(previewWhiteboardParticipants as any[]);
	const [screenId, setScreenId] = useState('storybook-screen');
	const [shareScreenStarted, setShareScreenStarted] = useState(false);
	const [, setCanvasWhiteboard] = useState<HTMLCanvasElement | null>(null);

	const parameters = useMemo(
		() =>
			buildWhiteboardParameters({
				shapes,
				setShapes,
				useImageBackground,
				setUseImageBackground,
				redoStack,
				setRedoStack,
				undoStack,
				setUndoStack,
				whiteboardStarted,
				setWhiteboardStarted,
				whiteboardEnded,
				setWhiteboardEnded,
				whiteboardUsers,
				setWhiteboardUsers,
				participants,
				setParticipants,
				screenId,
				setScreenId,
				shareScreenStarted,
				setShareScreenStarted,
				setCanvasWhiteboard,
			}),
		[shapes, useImageBackground, redoStack, undoStack, whiteboardStarted, whiteboardEnded, whiteboardUsers, participants, screenId, shareScreenStarted]
	);

	return <Whiteboard customWidth={1280} customHeight={720} parameters={parameters as any} showAspect isDarkModeValue />;
	}

const meta = {
	title: 'Whiteboard Components/Whiteboard Canvas',
	component: Whiteboard,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
} satisfies Meta<typeof Whiteboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		customWidth: 1280,
		customHeight: 720,
		parameters: {} as any,
		showAspect: true,
	},
	render: () => <WhiteboardPreview />,
};
