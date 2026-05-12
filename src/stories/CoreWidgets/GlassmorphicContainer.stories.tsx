import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { GlassmorphicContainer } from '../../components_modern/core/widgets/GlassmorphicContainer';

const fullscreenDecorator: Decorator = (Story) => (
	<div
		style={{
			minHeight: '100vh',
			padding: 48,
			background:
				'radial-gradient(circle at top left, rgba(56, 189, 248, 0.25), transparent 35%), linear-gradient(135deg, #020617, #111827 50%, #0f172a)',
		}}
	>
		<div style={{ maxWidth: 520 }}>
			<Story />
		</div>
	</div>
);

const meta = {
	title: 'Core Widgets/Glassmorphic Container',
	component: GlassmorphicContainer,
	tags: ['autodocs'],
	args: {
		children: null,
		isDarkMode: true,
		blur: 16,
		borderRadius: 24,
		elevation: 2,
		hoverEffect: true,
	},
	argTypes: {
		onClick: { action: 'clicked' },
	},
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [fullscreenDecorator],
} satisfies Meta<typeof GlassmorphicContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<GlassmorphicContainer {...args}>
			<div style={{ color: '#f8fafc' }}>
				<h2 style={{ marginTop: 0, marginBottom: 12 }}>Floating Overlay Surface</h2>
				<p style={{ margin: 0, lineHeight: 1.7, color: 'rgba(248,250,252,0.82)' }}>
					This is a good fit for menus, settings drawers, or transient overlays that should feel layered but not opaque.
				</p>
			</div>
		</GlassmorphicContainer>
	),
};

export const Clickable: Story = {
	args: {
		onClick: () => undefined,
	},
	render: (args) => (
		<GlassmorphicContainer {...args}>
			<div style={{ color: '#f8fafc' }}>
				<h2 style={{ marginTop: 0, marginBottom: 12 }}>Clickable Demo Surface</h2>
				<p style={{ margin: 0, lineHeight: 1.7, color: 'rgba(248,250,252,0.82)' }}>
					Use this state to inspect hover feedback before promoting the component into a real modal or command surface.
				</p>
			</div>
		</GlassmorphicContainer>
	),
};