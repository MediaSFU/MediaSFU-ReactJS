import React, { useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { ModernPermissionsModal } from '../../components_modern/permissions_components/ModernPermissionsModal';
import {
	previewParticipants,
	previewMember,
	previewRoomName,
	previewMeetingSocket,
	previewPermissionConfig,
} from '../generated-support/modernStorybookFixtures';

const sidebarDecorator: Decorator = (Story) => (
	<div
		style={{
			minHeight: '100vh',
			padding: 24,
			background:
				'radial-gradient(circle at top left, rgba(14, 165, 233, 0.2), transparent 30%), linear-gradient(135deg, #020617, #0f172a 52%, #111827)',
		}}
	>
		<div style={{ marginLeft: 'auto', width: 'min(460px, 100%)', minHeight: 'calc(100vh - 48px)' }}>
			<Story />
		</div>
	</div>
);

function PermissionsModalPreview() {
	const [permissionConfig, setPermissionConfig] = useState(previewPermissionConfig);

	const parameters: any = {
		participants: previewParticipants,
		member: previewMember,
		islevel: '2',
		socket: previewMeetingSocket,
		roomName: previewRoomName,
		showAlert: (alert: { message?: string; type?: string }) => {
			if (alert?.message) {
				console.info(`Permissions Storybook Alert (${alert.type || 'info'}): ${alert.message}`);
			}
		},
		permissionConfig,
		updatePermissionConfig: setPermissionConfig,
		audioSetting: 'approval',
		videoSetting: 'approval',
		screenshareSetting: 'disallow',
		chatSetting: 'allow',
	};

	parameters.getUpdatedAllParams = () => parameters;

	return (
		<ModernPermissionsModal
			isPermissionsModalVisible
			onPermissionsClose={() => undefined}
			parameters={parameters}
			renderMode="sidebar"
			isDarkMode
		/>
	);
}

const meta = {
	title: 'Internal Components/Modern Permissions Modal',
	component: ModernPermissionsModal,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [sidebarDecorator],
} satisfies Meta<typeof ModernPermissionsModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		isPermissionsModalVisible: true,
		onPermissionsClose: () => undefined,
		parameters: {} as any,
	},
	render: () => <PermissionsModalPreview />,
};