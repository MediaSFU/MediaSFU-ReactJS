import React, { useMemo, useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { ModernPagination } from '../../components_modern/display_components/ModernPagination';
import { previewMeetingSocket, previewRoomName } from '../generated-support/modernStorybookFixtures';

const stageDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', padding: 24, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)' }}>
		<Story />
	</div>
);

function PaginationPreview() {
	const [currentPage, setCurrentPage] = useState(0);

	const parameters = useMemo(() => {
		const params: Record<string, unknown> = {
			mainRoomsLength: 3,
			memberRoom: 1,
			breakOutRoomStarted: true,
			breakOutRoomEnded: false,
			member: 'PreviewUser',
			breakoutRooms: [[{ name: 'A', breakRoom: 0 }], [{ name: 'B', breakRoom: 1 }]],
			hostNewRoom: 0,
			roomName: previewRoomName,
			islevel: '2',
			showAlert: () => undefined,
			socket: previewMeetingSocket,
			paginatedStreams: [[], [], [], [], []],
			currentUserPage: currentPage,
			updateMainWindow: false,
			updateCurrentUserPage: setCurrentPage,
			updateUpdateMainWindow: () => undefined,
			dispStreams: async () => undefined,
		};

		params.getUpdatedAllParams = () => ({ ...params, currentUserPage: currentPage });

		return params;
	}, [currentPage]);

	return (
		<ModernPagination
			totalPages={5}
			currentUserPage={currentPage}
			parameters={parameters as any}
			showAspect
			isDarkMode
		/>
	);
	}

const meta = {
	title: 'Display Components/Modern Pagination',
	component: ModernPagination,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
} satisfies Meta<typeof ModernPagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		totalPages: 5,
		currentUserPage: 0,
		parameters: {} as any,
	},
	render: () => <PaginationPreview />,
};
