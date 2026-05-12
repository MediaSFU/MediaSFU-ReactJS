// @ts-nocheck

import { ModernMeetingProgressTimer } from '../../../components_modern/display_components';

const meta = {
	title: 'Generated/Display Components/Modern Meeting Progress Timer',
	component: ModernMeetingProgressTimer,
	tags: ['autodocs', 'generated'],
	args: {
		meetingProgressTime: "10:24",
		isDarkMode: true,
		isRecording: true,
		position: "topRight",
	},
	parameters: { layout: 'fullscreen' },

	decorators: [
		(Story) => (
			<div style={{ minHeight: 220, padding: 24, background: '#020617', position: 'relative' }}>
				<Story />
			</div>
		),
	],
};

export default meta;

export const Default = {};
