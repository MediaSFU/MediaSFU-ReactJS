// @ts-nocheck

import { ModernAlertComponent } from '../../../components_modern/display_components';

const meta = {
	title: 'Generated/Display Components/Modern Alert Component',
	component: ModernAlertComponent,
	tags: ['autodocs', 'generated'],
	args: {
		visible: true,
		message: "Generated alert preview",
		type: "success",
		duration: 0,
		isDarkMode: true,
	},
	parameters: { layout: 'fullscreen' },

	decorators: [
		(Story) => (
			<div style={{ minHeight: '100vh', padding: 24, background: '#020617', position: 'relative' }}>
				<Story />
			</div>
		),
	],
};

export default meta;

export const Default = {};
