import React, { useEffect, useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { ModernFlexibleVideo } from '../../components_modern/display_components/ModernFlexibleVideo';
import { createPreviewCanvasStream } from '../generated-support/manualDisplayStoryFixtures';

const stageDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', padding: 24, background: 'linear-gradient(135deg, #020617, #0f172a 52%, #111827)' }}>
		<Story />
	</div>
);

function FlexibleVideoPreview() {
	const [screenStream, setScreenStream] = useState<MediaStream | undefined>(undefined);

	useEffect(() => {
		const preview = createPreviewCanvasStream({ title: 'Screenboard', width: 1280, height: 720 });
		setScreenStream(preview.stream);

		return () => preview.dispose();
	}, []);

	const tiles = ['Camera 1', 'Camera 2', 'Camera 3', 'Camera 4'].map((label) => (
		<div key={label} style={{ width: '100%', height: '100%', minHeight: 180, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, rgba(37,99,235,0.7), rgba(14,165,233,0.5))', color: '#f8fafc', fontWeight: 700 }}>
			{label}
		</div>
	));

	return (
		<ModernFlexibleVideo
			customWidth={320}
			customHeight={180}
			rows={2}
			columns={2}
			componentsToRender={tiles}
			showAspect
			Screenboard={<div style={{ width: '100%', height: 160, display: 'grid', placeItems: 'center', borderRadius: 12, background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.86))', color: '#e2e8f0' }}>Shared Screenboard</div>}
			annotateScreenStream={false}
			localStreamScreen={screenStream}
			isDarkMode
			enableGlassmorphism
			cellBorderRadius={12}
			enableGlow
		/>
	);
	}

const meta = {
	title: 'Display Components/Modern Flexible Video',
	component: ModernFlexibleVideo,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	decorators: [stageDecorator],
} satisfies Meta<typeof ModernFlexibleVideo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		customWidth: 320,
		customHeight: 180,
		rows: 2,
		columns: 2,
		componentsToRender: [],
		showAspect: true,
	},
	render: () => <FlexibleVideoPreview />,
};
