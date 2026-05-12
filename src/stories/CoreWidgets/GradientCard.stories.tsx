import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { GradientCard } from '../../components_modern/core/widgets/GradientCard';

const cardDecorator: Decorator = (Story) => (
	<div style={{ width: 420, maxWidth: '100%', padding: 24 }}>
		<Story />
	</div>
);

const meta = {
	title: 'Core Widgets/Gradient Card',
	component: GradientCard,
	tags: ['autodocs'],
	args: {
		title: 'UI Override Surface',
		subtitle: 'Highlight a branded card, modal, or onboarding step before shipping it.',
		isDarkMode: true,
		hoverEffect: true,
		elevation: 2,
	},
	argTypes: {
		onClick: { action: 'clicked' },
	},
	parameters: {
		layout: 'centered',
	},
	decorators: [cardDecorator],
} satisfies Meta<typeof GradientCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<GradientCard {...args}>
			<div style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
				Use this surface for premium calls to action, upgrade notices, or guide checkpoints.
			</div>
		</GradientCard>
	),
};

export const Interactive: Story = {
	args: {
		title: 'Open Component Demo',
		subtitle: 'Storybook is intended to sit beside the main docs portal, not replace it.',
		onClick: () => undefined,
	},
	render: (args) => (
		<GradientCard {...args}>
			<div style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
				Click interactions, hover elevation, and text balance can all be reviewed here before docs linking.
			</div>
		</GradientCard>
	),
};