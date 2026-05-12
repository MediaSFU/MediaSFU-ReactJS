import React, { useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import type { ComponentSizes } from '../../@types/types';
import MainScreenComponent from '../../components/displayComponents/MainScreenComponent';

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

const initialComponentSizes: ComponentSizes = {
	mainWidth: 0,
	mainHeight: 0,
	otherWidth: 0,
	otherHeight: 0,
};

function MainScreenPreview() {
	const [componentSizes, setComponentSizes] = useState<ComponentSizes>(initialComponentSizes);

	return (
		<MainScreenComponent
			mainSize={68}
			doStack={false}
			containerWidthFraction={0.84}
			containerHeightFraction={0.72}
			showControls
			componentSizes={componentSizes}
			updateComponentSizes={setComponentSizes}
		>
			<div
				style={{
					height: '100%',
					borderRadius: 24,
					background: 'linear-gradient(135deg, #1d4ed8, #0f172a)',
					color: '#f8fafc',
					padding: 24,
					boxSizing: 'border-box',
				}}
			>
				<h3 style={{ marginTop: 0 }}>Primary workspace</h3>
				<p style={{ marginBottom: 0 }}>This area tracks the main screen dimensions and adapts with the viewport.</p>
			</div>
			<div
				style={{
					height: '100%',
					borderRadius: 24,
					background: 'rgba(15, 23, 42, 0.9)',
					color: '#cbd5e1',
					padding: 24,
					boxSizing: 'border-box',
				}}
			>
				<h4 style={{ marginTop: 0 }}>Secondary lane</h4>
				<p style={{ marginBottom: 0 }}>Useful for chat, participants, or a supporting visual surface.</p>
			</div>
		</MainScreenComponent>
	);
}

const meta = {
	title: 'Display Components/Main Screen Component',
	component: MainScreenComponent,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
	args: {
		children: null,
		mainSize: 68,
		doStack: false,
		showControls: true,
		componentSizes: initialComponentSizes,
		updateComponentSizes: () => undefined,
	},
} satisfies Meta<typeof MainScreenComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <MainScreenPreview />,
};
