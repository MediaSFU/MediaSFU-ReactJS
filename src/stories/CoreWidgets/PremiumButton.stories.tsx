import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { PremiumButton } from '../../components_modern/core/widgets/PremiumButton';

const paddedDecorator: Decorator = (Story) => (
	<div style={{ minWidth: 280, padding: 24 }}>
		<Story />
	</div>
);

const meta = {
	title: 'Core Widgets/Premium Button',
	component: PremiumButton,
	tags: ['autodocs'],
	args: {
		children: 'Start Session',
		variant: 'gradient',
		size: 'md',
		isDarkMode: true,
		fullWidth: false,
		disabled: false,
		loading: false,
	},
	argTypes: {
		onPress: { action: 'pressed' },
	},
	parameters: {
		layout: 'centered',
	},
	decorators: [paddedDecorator],
} satisfies Meta<typeof PremiumButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gradient: Story = {};

export const Glass: Story = {
	args: {
		variant: 'glass',
		children: 'Review Overrides',
	},
};

export const GlowLoading: Story = {
	args: {
		variant: 'glow',
		children: 'Publishing',
		loading: true,
	},
};