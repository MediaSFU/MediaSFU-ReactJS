import React, { useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import {
	faMicrophone,
	faMicrophoneSlash,
	faPhoneSlash,
	faVideo,
	faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';

import ControlButtonsComponentTouch from '../../components/displayComponents/ControlButtonsComponentTouch';

const stageDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'end center', padding: 24, background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)' }}>
		<Story />
	</div>
);

function TouchButtonsPreview() {
	const [micOn, setMicOn] = useState(true);
	const [cameraOn, setCameraOn] = useState(true);

	return (
		<ControlButtonsComponentTouch
			showAspect
			position="middle"
			location="bottom"
			direction="horizontal"
			gap={18}
			buttonsContainerStyle={{ padding: 16, borderRadius: 22, background: 'rgba(15,23,42,0.82)' }}
			buttons={[
				{ name: 'Mic', icon: faMicrophone, alternateIcon: faMicrophoneSlash, active: micOn, onPress: () => setMicOn((value) => !value), activeColor: '#22c55e', inActiveColor: '#f87171', show: true, style: { minWidth: 68, minHeight: 68 } },
				{ name: 'Camera', icon: faVideo, alternateIcon: faVideoSlash, active: cameraOn, onPress: () => setCameraOn((value) => !value), activeColor: '#38bdf8', inActiveColor: '#f87171', show: true, style: { minWidth: 68, minHeight: 68 } },
				{ name: 'End', icon: faPhoneSlash, color: '#f8fafc', show: true, style: { minWidth: 68, minHeight: 68, background: '#b91c1c' } },
			]}
		/>
	);
	}

const meta = {
	title: 'Display Components/Control Buttons Touch Component',
	component: ControlButtonsComponentTouch,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
} satisfies Meta<typeof ControlButtonsComponentTouch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		buttons: [],
	},
	render: () => <TouchButtonsPreview />,
};
