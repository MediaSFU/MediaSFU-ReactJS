import React, { useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import {
	faDesktop,
	faMicrophone,
	faMicrophoneSlash,
	faPhone,
	faUsers,
	faVideo,
	faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';

import ControlButtonsComponent from '../../components/displayComponents/ControlButtonsComponent';

const stageDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)' }}>
		<Story />
	</div>
);

function ControlButtonsPreview() {
	const [micOn, setMicOn] = useState(true);
	const [cameraOn, setCameraOn] = useState(true);

	return (
		<ControlButtonsComponent
			alignment="center"
			buttonBackgroundColor={{ default: '#111827', pressed: '#1d4ed8' }}
			buttons={[
				{ name: 'Mic', icon: faMicrophone, alternateIcon: faMicrophoneSlash, active: micOn, onPress: () => setMicOn((value) => !value), activeColor: '#f8fafc', inActiveColor: '#f87171' },
				{ name: 'Camera', icon: faVideo, alternateIcon: faVideoSlash, active: cameraOn, onPress: () => setCameraOn((value) => !value), activeColor: '#f8fafc', inActiveColor: '#f87171' },
				{ name: 'Share', icon: faDesktop, active: false },
				{ name: 'People', icon: faUsers, active: false },
				{ name: 'Leave', icon: faPhone, active: true, backgroundColor: { default: '#b91c1c', pressed: '#7f1d1d' } },
			]}
			buttonsContainerStyle={{ padding: 14, borderRadius: 18, background: 'rgba(2,6,23,0.75)' }}
			gap={14}
		/>
	);
	}

const meta = {
	title: 'Display Components/Control Buttons Component',
	component: ControlButtonsComponent,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
} satisfies Meta<typeof ControlButtonsComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		buttons: [],
	},
	render: () => <ControlButtonsPreview />,
};
