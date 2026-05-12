// @ts-nocheck

import { PremiumTextField } from '../../../components_modern/core/widgets';

const meta = {
	title: 'Generated/Core Widgets/Premium Text Field',
	component: PremiumTextField,
	tags: ['autodocs', 'generated'],
	args: {
		value: "preview@example.com",
		label: "Email Address",
		placeholder: "Enter your email",
		variant: "glass",
		isDarkMode: true,
		fullWidth: true,
	},

	decorators: [
		(Story) => (
			<div style={{ width: 360, maxWidth: '100%', padding: 24, background: '#020617' }}>
				<Story />
			</div>
		),
	],
};

export default meta;

export const Default = {};
