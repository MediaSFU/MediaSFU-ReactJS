import React, { useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faMicrophone,
	faMicrophoneSlash,
	faVideo,
	faVideoSlash,
	faDesktop,
	faMessage,
	faUsers,
	faPhone,
} from '@fortawesome/free-solid-svg-icons';

import { ModernControlButtonsComponent } from '../../components_modern/display_components/ModernControlButtonsComponent';

const stageDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)' }}>
		<Story />
	</div>
);

function ControlButtonsPreview() {
	const [micOn, setMicOn] = useState(true);
	const [videoOn, setVideoOn] = useState(true);

	return (
		<ModernControlButtonsComponent
			isDarkMode
			buttons={[
				{ name: 'mic', tooltip: 'Microphone', icon: <FontAwesomeIcon icon={faMicrophone} />, alternateIcon: <FontAwesomeIcon icon={faMicrophoneSlash} />, active: micOn, onPress: () => setMicOn((value) => !value) },
				{ name: 'camera', tooltip: 'Camera', icon: <FontAwesomeIcon icon={faVideo} />, alternateIcon: <FontAwesomeIcon icon={faVideoSlash} />, active: videoOn, onPress: () => setVideoOn((value) => !value) },
				{ name: 'screen', tooltip: 'Share screen', icon: <FontAwesomeIcon icon={faDesktop} />, active: false },
				{ name: 'chat', tooltip: 'Open chat', icon: <FontAwesomeIcon icon={faMessage} />, active: false },
				{ name: 'participants', tooltip: 'View participants', icon: <FontAwesomeIcon icon={faUsers} />, active: false },
				{ name: 'leave', tooltip: 'Leave meeting', icon: <FontAwesomeIcon icon={faPhone} />, active: true, activeColor: '#dc2626' },
			]}
		/>
	);
}

const meta = {
	title: 'Display Components/Modern Control Buttons Component',
	component: ModernControlButtonsComponent,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
} satisfies Meta<typeof ModernControlButtonsComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
	render: () => <ControlButtonsPreview />,
};
