import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import SubAspectComponent from '../../components/displayComponents/SubAspectComponent';

const stageDecorator: Decorator = (Story) => (
	<div
		style={{
			minHeight: '100vh',
			padding: 24,
			background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)',
			position: 'relative',
		}}
	>
		<Story />
	</div>
);

const meta = {
	title: 'Display Components/Sub Aspect Component',
	component: SubAspectComponent,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		backgroundColor: 'rgba(15, 23, 42, 0.9)',
		showControls: true,
		containerWidthFraction: 0.34,
		containerHeightFraction: 0.46,
		defaultFractionSub: 0.32,
		children: (
			<div style={{ padding: 20, color: '#e2e8f0' }}>
				<h4 style={{ marginTop: 0 }}>Sub aspect lane</h4>
				<p>This surface is useful for helper content, smaller participant stacks, or lightweight room tools.</p>
			</div>
		),
	},
} satisfies Meta<typeof SubAspectComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
