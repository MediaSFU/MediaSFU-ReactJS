import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { ModernMainContainerComponent } from '../../components_modern/display_components/ModernMainContainerComponent';

const rootDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', padding: 24, background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)' }}>
		<Story />
	</div>
);

const meta = {
	title: 'Display Components/Modern Main Container Component',
	component: ModernMainContainerComponent,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [rootDecorator],
	args: {
		containerWidthFraction: 0.9,
		containerHeightFraction: 0.75,
		isDarkMode: true,
		enableGlassmorphism: true,
		enableGradientBackground: true,
		borderRadius: 24,
		showBorder: true,
		enableShadow: true,
		children: (
			<div style={{ height: '100%', padding: 28, color: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
				<div>
					<h2 style={{ marginTop: 0 }}>Main Meeting Canvas</h2>
					<p style={{ lineHeight: 1.7, color: 'rgba(248,250,252,0.82)' }}>
						Use this container to host participant layouts, screen shares, or branded event shells.
					</p>
				</div>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
					{['Stage', 'Sidebar', 'Dock'].map((label) => (
						<div key={label} style={{ minHeight: 120, borderRadius: 16, background: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
							{label}
						</div>
					))}
				</div>
			</div>
		),
	},
} satisfies Meta<typeof ModernMainContainerComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
