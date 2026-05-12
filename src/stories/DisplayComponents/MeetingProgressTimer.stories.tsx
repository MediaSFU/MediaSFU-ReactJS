import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import MeetingProgressTimer from '../../components/displayComponents/MeetingProgressTimer';

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
		<div
			style={{
				width: 'min(92vw, 1120px)',
				height: '72vh',
				borderRadius: 24,
				background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.36), rgba(15, 23, 42, 0.96))',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<Story />
		</div>
	</div>
);

const meta = {
	title: 'Display Components/Meeting Progress Timer',
	component: MeetingProgressTimer,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		meetingProgressTime: '01:08:42',
		initialBackgroundColor: '#22c55e',
		position: 'topRight',
		showTimer: true,
		textStyle: {
			fontSize: 18,
			fontWeight: 700,
			letterSpacing: '0.06em',
			color: '#f8fafc',
		},
	},
} satisfies Meta<typeof MeetingProgressTimer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
