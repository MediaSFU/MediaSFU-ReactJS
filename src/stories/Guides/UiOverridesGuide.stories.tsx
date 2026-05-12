import type { Meta, StoryObj } from '@storybook/react';

import UiOverridesGuide from '../../examples/UiOverridesGuide';

const meta = {
	title: 'Guides/UI Overrides Guide',
	component: UiOverridesGuide,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		backgrounds: {
			default: 'midnight',
		},
		docs: {
			description: {
				component:
					'Use this guide to compare MediaSFU UI customization paths: targeted wrappers, uiOverrides, customComponent, and headless mode.',
			},
		},
	},
} satisfies Meta<typeof UiOverridesGuide>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};