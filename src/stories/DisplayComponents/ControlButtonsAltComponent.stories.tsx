import React, { useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import {
	faComments,
	faHand,
	faMicrophone,
	faMicrophoneSlash,
	faVideo,
	faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';

import ControlButtonsAltComponent from '../../components/displayComponents/ControlButtonsAltComponent';

const stageDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', padding: 24, background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)', position: 'relative' }}>
		<Story />
	</div>
);

function AltButtonsPreview() {
	const [micOn, setMicOn] = useState(true);
	const [cameraOn, setCameraOn] = useState(true);

	return (
		<ControlButtonsAltComponent
			showAspect
			position="right"
			location="center"
			direction="vertical"
			gap={10}
			buttonsContainerStyle={{ padding: 12, borderRadius: 18, background: 'rgba(15,23,42,0.72)' }}
			buttons={[
				{ name: 'Mic', icon: faMicrophone, alternateIcon: faMicrophoneSlash, active: micOn, onPress: () => setMicOn((value) => !value), activeColor: '#22c55e', inActiveColor: '#f87171', show: true },
				{ name: 'Camera', icon: faVideo, alternateIcon: faVideoSlash, active: cameraOn, onPress: () => setCameraOn((value) => !value), activeColor: '#38bdf8', inActiveColor: '#f87171', show: true },
				{ name: 'Chat', icon: faComments, show: true },
				{ name: 'Raise Hand', icon: faHand, show: true },
			]}
		/>
	);
	}

const meta = {
	title: 'Display Components/Control Buttons Alt Component',
	component: ControlButtonsAltComponent,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
} satisfies Meta<typeof ControlButtonsAltComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		buttons: [],
	},
	render: () => <AltButtonsPreview />,
};
