import React, { useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { ModernPanelistsModal } from '../../components_modern/panelists_components/ModernPanelistsModal';
import {
	previewParticipants,
	previewPanelists,
	previewMember,
	previewRoomName,
	previewMeetingSocket,
} from '../generated-support/modernStorybookFixtures';

const sidebarDecorator: Decorator = (Story) => (
	<div
		style={{
			minHeight: '100vh',
			padding: 24,
			background:
				'radial-gradient(circle at top left, rgba(16, 185, 129, 0.16), transparent 28%), linear-gradient(135deg, #020617, #0f172a 52%, #111827)',
		}}
	>
		<div style={{ marginLeft: 'auto', width: 'min(460px, 100%)', minHeight: 'calc(100vh - 48px)' }}>
			<Story />
		</div>
	</div>
);

function PanelistsModalPreview() {
	const [panelists, setPanelists] = useState(previewPanelists);
	const [panelistsFocused, setPanelistsFocused] = useState(true);

	const parameters: any = {
		participants: previewParticipants,
		panelists,
		member: previewMember,
		islevel: '2',
		socket: previewMeetingSocket,
		roomName: previewRoomName,
		showAlert: (alert: { message?: string; type?: string }) => {
			if (alert?.message) {
				console.info(`Panelists Storybook Alert (${alert.type || 'info'}): ${alert.message}`);
			}
		},
		itemPageLimit: 6,
		panelistsFocused,
		updatePanelists: setPanelists,
		updatePanelistsFocused: setPanelistsFocused,
	};

	parameters.getUpdatedAllParams = () => parameters;

	return (
		<ModernPanelistsModal
			isPanelistsModalVisible
			onPanelistsClose={() => undefined}
			parameters={parameters}
			renderMode="sidebar"
			isDarkMode
		/>
	);
}

const meta = {
	title: 'Internal Components/Modern Panelists Modal',
	component: ModernPanelistsModal,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [sidebarDecorator],
} satisfies Meta<typeof ModernPanelistsModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		isPanelistsModalVisible: true,
		onPanelistsClose: () => undefined,
		parameters: {} as any,
	},
	render: () => <PanelistsModalPreview />,
};