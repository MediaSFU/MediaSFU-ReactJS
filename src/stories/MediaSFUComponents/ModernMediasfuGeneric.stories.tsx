import type { Decorator, Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';

import type { SeedData } from '../../@types/types';
import { ModernMediasfuGeneric } from '../../components_modern/mediasfu_components';
import {
	previewHostSeedData,
	previewListenPreferences,
	previewTranslationConfig,
	previewVoiceClones,
} from '../generated-support/modernStorybookFixtures';

const fullscreenDecorator: Decorator = (Story) => (
	<div style={{ minHeight: '100vh', background: '#020617' }}>
		<Story />
	</div>
);

const translationPreviewState: NonNullable<
	ComponentProps<typeof ModernMediasfuGeneric>['initialTranslationState']
> = {
	config:
		previewTranslationConfig as NonNullable<
			ComponentProps<typeof ModernMediasfuGeneric>['initialTranslationState']
		>['config'],
	spokenLanguage: 'en',
	spokenLanguageEnabled: true,
	defaultOutputLanguage: 'fr',
	defaultListenLanguage: 'es',
	listenPreferences: Array.from(previewListenPreferences.entries()),
	isPersonalTranslation: true,
};

const meta = {
	title: 'MediaSFU Components/Modern MediaSFU Generic',
	component: ModernMediasfuGeneric,
	tags: ['autodocs'],
	args: {
		useLocalUIMode: true,
		useSeed: true,
		connectMediaSFU: false,
		seedData: previewHostSeedData as SeedData,
		credentials: {
			apiUserName: 'demo-user',
			apiKey: 'demo-key',
		},
		initialTranslationState: translationPreviewState,
		canUsePersonalTranslation: true,
		personalTranslationUsername: 'preview-translation-credits',
		userVoiceClones: previewVoiceClones,
		containerStyle: {
			minHeight: '100vh',
			backgroundColor: '#020617',
		},
	},
	argTypes: {
		seedData: {
			control: false,
			table: {
				disable: true,
			},
		},
		credentials: {
			control: false,
		},
		containerStyle: {
			control: false,
		},
		sourceParameters: {
			table: {
				disable: true,
			},
		},
		updateSourceParameters: {
			table: {
				disable: true,
			},
		},
		noUIPreJoinOptions: {
			table: {
				disable: true,
			},
		},
		joinMediaSFURoom: {
			table: {
				disable: true,
			},
		},
		createMediaSFURoom: {
			table: {
				disable: true,
			},
		},
		customVideoCard: {
			table: {
				disable: true,
			},
		},
		customAudioCard: {
			table: {
				disable: true,
			},
		},
		customMiniCard: {
			table: {
				disable: true,
			},
		},
		customPreJoinPage: {
			table: {
				disable: true,
			},
		},
		customComponent: {
			table: {
				disable: true,
			},
		},
		initialTranslationState: {
			control: false,
		},
		uiOverrides: {
			table: {
				disable: true,
			},
		},
		personalTranslationUsername: {
			table: {
				disable: true,
			},
		},
		userVoiceClones: {
			table: {
				disable: true,
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
		backgrounds: {
			default: 'midnight',
		},
		controls: {
			include: ['useLocalUIMode', 'useSeed', 'connectMediaSFU', 'returnUI', 'optimizeVideoRecord'],
		},
		actions: {
			disable: true,
		},
		docs: {
			description: {
				component:
					'Seeded local-UI showcase of the flagship modern MediaSFU room shell. This story is intentionally backend-free so teams can inspect the full themed meeting surface, including translation controls, without exposing cloud credentials or requiring a live room.',
			},
		},
	},
	decorators: [fullscreenDecorator],
} satisfies Meta<typeof ModernMediasfuGeneric>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Regression surface for a 1294px webinar embedded in a 1500px viewport.
 * Keep this host width and the matching fractions explicit so visual and DOM
 * acceptance can detect any child that falls back to viewport sizing.
 */
export const EmbeddedWebinar1294: Story = {
	args: {
		seedData: {
			...previewHostSeedData,
			eventType: 'webinar',
		} as SeedData,
		containerWidthFraction: 1294 / 1500,
		containerHeightFraction: 760 / 900,
		containerStyle: {
			backgroundColor: '#020617',
		},
	},
	decorators: [
		(Story) => (
			<div
				data-testid="embedded-room-host"
				style={{
					width: 1294,
					height: 760,
					maxWidth: '100%',
					overflow: 'hidden',
					background: '#020617',
				}}
			>
				<Story />
			</div>
		),
	],
};
