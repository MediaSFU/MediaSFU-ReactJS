import React, { useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { TranslationSettingsModal } from '../../components_modern/translation_components/TranslationSettingsModal';
import type { TranslationSettingsModalProps } from '../../components_modern/translation_components/TranslationSettingsModal';
import {
	previewParticipants,
	previewMember,
	previewRoomName,
	previewTranslationConfig,
	previewListenPreferences,
	previewVoiceClones,
	createPreviewTranslationSocket,
} from '../generated-support/modernStorybookFixtures';

const sidebarDecorator: Decorator = (Story) => (
	<div
		style={{
			minHeight: '100vh',
			padding: 24,
			background:
				'radial-gradient(circle at top left, rgba(244, 114, 182, 0.18), transparent 28%), linear-gradient(135deg, #020617, #0f172a 52%, #111827)',
		}}
	>
		<div style={{ marginLeft: 'auto', width: 'min(500px, 100%)', minHeight: 'calc(100vh - 48px)' }}>
			<Story />
		</div>
	</div>
);

function TranslationSettingsModalPreview() {
	const [socket] = useState(() => createPreviewTranslationSocket());
	const [spokenLanguage, setSpokenLanguage] = useState('en');
	const [spokenLanguageEnabled, setSpokenLanguageEnabled] = useState(true);
	const [defaultOutputLanguage, setDefaultOutputLanguage] = useState<string | null>('fr');
	const [defaultListenLanguage, setDefaultListenLanguage] = useState<string | null>('es');
	const [listenPreferences, setListenPreferences] = useState(() => new Map(previewListenPreferences));
	const [showSubtitlesOnCards, setShowSubtitlesOnCards] = useState(true);

	return (
		<TranslationSettingsModal
			isVisible
			onClose={() => undefined}
			translationConfig={previewTranslationConfig as TranslationSettingsModalProps['translationConfig']}
			member={previewMember}
			islevel="2"
			audioProducerId="storybook-audio-producer"
			participants={previewParticipants}
			mySpokenLanguage={spokenLanguage}
			mySpokenLanguageEnabled={spokenLanguageEnabled}
			myDefaultOutputLanguage={defaultOutputLanguage}
			myDefaultListenLanguage={defaultListenLanguage}
			listenPreferences={listenPreferences}
			updateMySpokenLanguage={setSpokenLanguage}
			updateMySpokenLanguageEnabled={setSpokenLanguageEnabled}
			updateMyDefaultOutputLanguage={setDefaultOutputLanguage}
			updateMyDefaultListenLanguage={setDefaultListenLanguage}
			updateListenPreferences={setListenPreferences}
			socket={socket as any}
			roomName={previewRoomName}
			showAlert={(alert) => {
				if (alert?.message) {
					console.info(`Translation Storybook Alert (${alert.type || 'info'}): ${alert.message}`);
				}
			}}
			showSubtitlesOnCards={showSubtitlesOnCards}
			updateShowSubtitlesOnCards={setShowSubtitlesOnCards}
			isPersonalTranslation={false}
			userVoiceClones={previewVoiceClones}
			isDarkMode
			renderMode="sidebar"
		/>
	);
}

const meta = {
	title: 'Internal Components/Translation Settings Modal',
	component: TranslationSettingsModal,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [sidebarDecorator],
} satisfies Meta<typeof TranslationSettingsModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		isVisible: true,
		onClose: () => undefined,
		translationConfig: null,
		member: previewMember,
		islevel: '2',
		audioProducerId: 'storybook-audio-producer',
		participants: previewParticipants,
		mySpokenLanguage: 'en',
		mySpokenLanguageEnabled: true,
		myDefaultOutputLanguage: 'fr',
		myDefaultListenLanguage: 'es',
		listenPreferences: new Map(),
		updateMySpokenLanguage: () => undefined,
		updateMySpokenLanguageEnabled: () => undefined,
		updateMyDefaultOutputLanguage: () => undefined,
		updateMyDefaultListenLanguage: () => undefined,
		updateListenPreferences: () => undefined,
		socket: {} as any,
		roomName: previewRoomName,
	},
	render: () => <TranslationSettingsModalPreview />,
};