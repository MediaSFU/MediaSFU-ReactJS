import React, { useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import MainAspectComponent from '../../components/displayComponents/MainAspectComponent';

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

function MainAspectPreview() {
	const [isWideScreen, setIsWideScreen] = useState(false);
	const [isMediumScreen, setIsMediumScreen] = useState(false);
	const [isSmallScreen, setIsSmallScreen] = useState(false);

	const currentMode = isWideScreen ? 'Wide' : isMediumScreen ? 'Medium' : isSmallScreen ? 'Small' : 'Unknown';

	return (
		<MainAspectComponent
			backgroundColor="rgba(15, 23, 42, 0.92)"
			showControls
			containerWidthFraction={0.82}
			containerHeightFraction={0.72}
			updateIsWideScreen={setIsWideScreen}
			updateIsMediumScreen={setIsMediumScreen}
			updateIsSmallScreen={setIsSmallScreen}
		>
			<div
				style={{
					height: '100%',
					padding: 24,
					boxSizing: 'border-box',
					background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.46), rgba(15, 23, 42, 0.96))',
					color: '#f8fafc',
				}}
			>
				<div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 18 }}>
					<h3 style={{ margin: 0 }}>Main aspect container</h3>
					<span style={{ padding: '8px 12px', borderRadius: 999, background: 'rgba(15, 23, 42, 0.58)' }}>
						Viewport mode: {currentMode}
					</span>
				</div>
				<p style={{ marginTop: 0 }}>This layout primitive reports screen breakpoints and maintains the main presentation surface.</p>
			</div>
		</MainAspectComponent>
	);
}

const meta = {
	title: 'Display Components/Main Aspect Component',
	component: MainAspectComponent,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		children: null,
		updateIsWideScreen: () => undefined,
		updateIsMediumScreen: () => undefined,
		updateIsSmallScreen: () => undefined,
	},
} satisfies Meta<typeof MainAspectComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <MainAspectPreview />,
};
