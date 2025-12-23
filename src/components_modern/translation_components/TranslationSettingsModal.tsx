/**
 * Modern Translation Settings Modal with premium styling.
 *
 * Allows users to configure their spoken language and listening preferences
 * for real-time translation during meetings.
 *
 * Features:
 * - Set spoken language (what language the user speaks)
 * - Set listening preferences (per-speaker or global default)
 * - Visual indicators for active translation channels
 * - Room-level configuration enforcement (allowlist/blocklist)
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faGlobe,
  faMicrophone,
  faHeadphones,
  faCheck,
  faChevronDown,
  faChevronUp,
  faSpinner,
  faUsers,
  faUser,
  faLanguage,
  faWandMagicSparkles,
  faSliders,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

import type { Participant, ShowAlert } from '../../@types/types';
import type { Socket } from 'socket.io-client';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import { MediasfuColors } from '../../components_modern/core/theme/MediasfuColors';
import { MediasfuSpacing } from '../../components_modern/core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../../components_modern/core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../../components_modern/core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../../components_modern/core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../../components_modern/core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../../components_modern/core/widgets/PremiumButton';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchVoicesViaSocket,
  fetchLanguagesViaSocket,
  getLanguageName,
  type VoiceOption,
  type LanguageOption,
  type VoiceGender,
  type TTSProvider,
} from '../../utils/translationLanguages';

// ============================================================================
// Types
// ============================================================================

export type VoiceSelectionMode = 'basic' | 'advanced' | 'clone';

export interface VoiceCloneConfig {
  provider: 'elevenlabs' | 'playht' | 'coqui';
  voiceId: string;
  stability?: number;   // 0-1, ElevenLabs
  similarity?: number;  // 0-1, ElevenLabs
}

export type LanguageMode = 'allowlist' | 'blocklist' | 'any';

/**
 * Voice config for per-language credential/param overrides
 */
export interface TranslationVoiceConfig {
  sttNickName?: string;
  llmNickName?: string;
  ttsNickName?: string;
  sttParams?: Record<string, string | number | boolean>;
  llmParams?: Record<string, string | number | boolean>;
  ttsParams?: Record<string, string | number | boolean>;
}

/**
 * Language entry with optional per-language voice config
 */
export interface LanguageEntry {
  code: string;
  nickname?: string;
  voiceConfig?: TranslationVoiceConfig;
}

export interface TranslationRoomConfig {
  supportTranslation: boolean;
  
  // Speaking configuration (mode-based filtering)
  spokenLanguageMode: LanguageMode;
  allowedSpokenLanguages?: LanguageEntry[];
  blockedSpokenLanguages?: string[];
  
  // Listening configuration (mode-based filtering)
  listenLanguageMode: LanguageMode;
  allowedListenLanguages?: LanguageEntry[];
  blockedListenLanguages?: string[];
  
  // Advanced
  maxActiveChannelsPerSpeaker: number;
  autoDetectSpokenLanguage: boolean;
  
  // Permission controls
  allowSpokenLanguageChange?: boolean;
  allowListenLanguageChange?: boolean;
  
  // Global fallback voice config
  translationVoiceConfig?: TranslationVoiceConfig | null;
  
  // Provider groups for language-based TTS/STT routing
  providerGroups?: {
    groupA?: {
      languages: string[];
      sttNickName?: string;
      llmNickName?: string;
      ttsNickName?: string;
    };
    groupB?: {
      languages: string[];
      sttNickName?: string;
      llmNickName?: string;
      ttsNickName?: string;
    };
    default?: {
      sttNickName?: string;
      llmNickName?: string;
      ttsNickName?: string;
    };
  } | null;
}

export interface ListenPreference {
  speakerId: string;
  speakerName: string;
  language: string | null; // null = original audio
}

export interface TranslationSettingsModalOptions {
  isVisible: boolean;
  onClose: () => void;
  
  // Room config
  translationConfig: TranslationRoomConfig | null;
  
  // Current user
  member: string;
  islevel: string;
  audioProducerId: string | null;
  
  // Participants
  participants: Participant[];
  
  // Current settings
  mySpokenLanguage: string;
  mySpokenLanguageEnabled: boolean;
  myDefaultOutputLanguage: string | null; // Output language different from spoken (e.g., speak French, output German)
  myDefaultListenLanguage: string | null;
  listenPreferences: Map<string, string>;
  
  // Updaters
  updateMySpokenLanguage: (lang: string) => void;
  updateMySpokenLanguageEnabled: (enabled: boolean) => void;
  updateMyDefaultOutputLanguage: (lang: string | null) => void;
  updateMyDefaultListenLanguage: (lang: string | null) => void;
  updateListenPreferences: (prefs: Map<string, string>) => void;
  
  // Socket
  socket: Socket;
  roomName: string;
  showAlert?: ShowAlert;
}

export interface TranslationSettingsModalProps extends TranslationSettingsModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Modal position when in modal mode */
  position?: 'center' | 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
  renderMode?: ModalRenderMode;
  /** Custom title */
  title?: string;
  /** Render props for customization */
  renderHeader?: (options: { defaultHeader: React.ReactNode; onClose: () => void }) => React.ReactNode;
  renderBody?: (options: { defaultBody: React.ReactNode }) => React.ReactNode;
  renderContent?: (options: { defaultContent: React.ReactNode }) => React.ReactNode;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the TTS provider nickname for a language based on providerGroups config
 * Falls back to default provider if language not in any group
 */
function getTTSNickNameForLanguage(
  langCode: string,
  providerGroups: TranslationRoomConfig['providerGroups'],
  defaultTTSNickName?: string
): string | null {
  if (!langCode) return defaultTTSNickName || null;
  
  const normalizedLang = langCode.toLowerCase();
  
  // Check groupA
  if (providerGroups?.groupA?.languages?.some(l => l.toLowerCase() === normalizedLang)) {
    return providerGroups.groupA.ttsNickName || providerGroups.default?.ttsNickName || defaultTTSNickName || null;
  }
  
  // Check groupB
  if (providerGroups?.groupB?.languages?.some(l => l.toLowerCase() === normalizedLang)) {
    return providerGroups.groupB.ttsNickName || providerGroups.default?.ttsNickName || defaultTTSNickName || null;
  }
  
  // Fallback to default
  return providerGroups?.default?.ttsNickName || defaultTTSNickName || null;
}

// ============================================================================
// Language Data
// ============================================================================

const COMMON_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'sw', name: 'Swahili' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ha', name: 'Hausa' },
  { code: 'ig', name: 'Igbo' },
  { code: 'zu', name: 'Zulu' },
  { code: 'am', name: 'Amharic' },
  { code: 'tw', name: 'Twi' },
  { code: 'he', name: 'Hebrew' },
  { code: 'fa', name: 'Persian' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'el', name: 'Greek' },
  { code: 'cs', name: 'Czech' },
  { code: 'ro', name: 'Romanian' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
];

// ============================================================================
// Sub-Components
// ============================================================================

interface LanguageDropdownProps {
  value: string;
  onChange: (value: string) => void;
  languages: Array<{ code: string; name: string }>;
  placeholder?: string;
  disabled?: boolean;
  isDarkMode?: boolean;
  includeOriginal?: boolean;
  includeAuto?: boolean;
  /** Show "Speaker's Output" option to go back to default (for listeners) */
  includeSpeakerOutput?: boolean;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  value,
  onChange,
  languages,
  placeholder = 'Select language',
  disabled = false,
  isDarkMode = true,
  includeOriginal = false,
  includeAuto = false,
  includeSpeakerOutput = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedLabel = useMemo(() => {
    if (value === 'speakerOutput') return "Speaker's Output";
    if (!value && includeSpeakerOutput) return "Speaker's Output";
    if (!value) return placeholder;
    if (value === 'original') return 'Raw Microphone Audio';
    if (value === 'auto') return 'Auto-Detect';
    return getLanguageName(value);
  }, [value, placeholder, includeSpeakerOutput]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
          background: isDarkMode
            ? MediasfuColors.surfaceElevatedDark
            : MediasfuColors.surfaceElevated,
          border: `1px solid ${isDarkMode ? MediasfuColors.glassBorder(true) : MediasfuColors.divider}`,
          borderRadius: MediasfuBorders.md,
          color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
          fontSize: MediasfuTypography.bodyMedium.fontSize,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: disabled ? 0.5 : 1,
          transition: `all ${MediasfuAnimations.fast}ms ease`,
        }}
      >
        <span>{selectedLabel}</span>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} size="sm" />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: 250,
            overflowY: 'auto',
            background: isDarkMode ? MediasfuColors.surfaceDark : MediasfuColors.surface,
            border: `1px solid ${isDarkMode ? MediasfuColors.glassBorder(true) : MediasfuColors.divider}`,
            borderRadius: MediasfuBorders.md,
            marginTop: 4,
            zIndex: 100,
            boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {/* Speaker's Output option - for listeners to go back to default */}
          {includeSpeakerOutput && (
            <button
              onClick={() => { onChange('speakerOutput'); setIsOpen(false); }}
              style={{
                width: '100%',
                padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
                background: (value === 'speakerOutput' || !value)
                  ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
                  : 'transparent',
                color: (value === 'speakerOutput' || !value)
                  ? '#FFFFFF'
                  : (isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary),
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: MediasfuTypography.bodyMedium.fontSize,
              }}
            >
              Speaker&apos;s Output (Default)
            </button>
          )}

          {/* Raw Microphone Audio - host only */}
          {includeOriginal && (
            <button
              onClick={() => { onChange('original'); setIsOpen(false); }}
              style={{
                width: '100%',
                padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
                background: value === 'original'
                  ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
                  : 'transparent',
                color: value === 'original'
                  ? '#FFFFFF'
                  : (isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary),
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: MediasfuTypography.bodyMedium.fontSize,
              }}
            >
              Raw Microphone Audio (Host Only)
            </button>
          )}
          
          {includeAuto && (
            <button
              onClick={() => { onChange('auto'); setIsOpen(false); }}
              style={{
                width: '100%',
                padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
                background: value === 'auto'
                  ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
                  : 'transparent',
                color: value === 'auto'
                  ? '#FFFFFF'
                  : (isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary),
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: MediasfuTypography.bodyMedium.fontSize,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <FontAwesomeIcon icon={faWandMagicSparkles} size="sm" />
              Auto-Detect
            </button>
          )}
          
          {(includeSpeakerOutput || includeOriginal || includeAuto) && languages.length > 0 && (
            <div style={{
              height: 1,
              background: isDarkMode ? MediasfuColors.glassBorder(true) : MediasfuColors.divider,
              margin: `${MediasfuSpacing.xs}px 0`,
            }} />
          )}

          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { onChange(lang.code); setIsOpen(false); }}
              style={{
                width: '100%',
                padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
                background: value === lang.code
                  ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
                  : 'transparent',
                color: value === lang.code
                  ? '#FFFFFF'
                  : (isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary),
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: MediasfuTypography.bodyMedium.fontSize,
              }}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface SpeakerLanguageRowProps {
  speaker: Participant;
  selectedLanguage: string | null;
  onChange: (speakerId: string, language: string) => void;
  availableLanguages: Array<{ code: string; name: string }>;
  isDarkMode?: boolean;
  /** Only hosts can see "Raw Microphone Audio" option */
  isHost?: boolean;
}

const SpeakerLanguageRow: React.FC<SpeakerLanguageRowProps> = ({
  speaker,
  selectedLanguage,
  onChange,
  availableLanguages,
  isDarkMode = true,
  isHost = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: `${MediasfuSpacing.sm}px`,
        background: isDarkMode
          ? MediasfuColors.hexToRgba(MediasfuColors.surfaceElevatedDark, 0.5)
          : MediasfuColors.hexToRgba(MediasfuColors.surfaceElevated, 0.5),
        borderRadius: MediasfuBorders.sm,
        marginBottom: MediasfuSpacing.sm,
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm }}>
        <FontAwesomeIcon
          icon={faUser}
          style={{
            color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
          }}
        />
        <span
          style={{
            color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
            fontSize: MediasfuTypography.bodyMedium.fontSize,
          }}
        >
          {speaker.name}
        </span>
      </div>
      <div style={{ width: 180 }}>
        <LanguageDropdown
          value={selectedLanguage || (isHost ? 'original' : 'speakerOutput')}
          onChange={(lang) => onChange(speaker.id || speaker.name, lang)}
          languages={availableLanguages}
          isDarkMode={isDarkMode}
          includeOriginal={isHost}
          includeSpeakerOutput={true}
          placeholder="Speaker's Output"
        />
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const TranslationSettingsModal: React.FC<TranslationSettingsModalProps> = ({
  isVisible,
  onClose,
  translationConfig,
  member,
  islevel,
  audioProducerId,
  participants,
  mySpokenLanguage,
  mySpokenLanguageEnabled,
  myDefaultOutputLanguage,
  myDefaultListenLanguage,
  listenPreferences,
  updateMySpokenLanguage,
  updateMySpokenLanguageEnabled,
  updateMyDefaultOutputLanguage,
  updateMyDefaultListenLanguage,
  updateListenPreferences,
  socket,
  roomName,
  showAlert,
  // Theme
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  position = 'center',
  renderMode = 'modal',
  title,
  // Render props
  renderHeader,
  renderBody,
  renderContent,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'speaking' | 'listening'>('speaking');
  const [perSpeakerMode, setPerSpeakerMode] = useState(false);
  
  // Local state for editing
  const [localSpokenLanguage, setLocalSpokenLanguage] = useState(mySpokenLanguage);
  const [localSpokenEnabled, setLocalSpokenEnabled] = useState(mySpokenLanguageEnabled);
  const [localDefaultOutputLang, setLocalDefaultOutputLang] = useState(myDefaultOutputLanguage);
  const [localDefaultListen, setLocalDefaultListen] = useState(myDefaultListenLanguage);
  const [localListenPrefs, setLocalListenPrefs] = useState<Map<string, string>>(new Map(listenPreferences));
  
  // Rate limiting state (30 second cooldown)
  const RATE_LIMIT_MS = 30000;
  const [lastSpokenChange, setLastSpokenChange] = useState<number>(0);
  const [lastListenChange, setLastListenChange] = useState<number>(0);
  const [spokenCooldown, setSpokenCooldown] = useState<number>(0);
  const [listenCooldown, setListenCooldown] = useState<number>(0);
  
  // Voice selection state
  const [voiceSelectionMode, setVoiceSelectionMode] = useState<VoiceSelectionMode>('basic');
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<VoiceGender>('female');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [selectedTTSProvider, setSelectedTTSProvider] = useState<TTSProvider>(
    (translationConfig?.translationVoiceConfig?.ttsNickName as TTSProvider) || 'deepgram'
  );
  
  // Voice cloning state
  const [voiceCloneConfig, setVoiceCloneConfig] = useState<VoiceCloneConfig | null>(null);
  const [cloneVoiceId, setCloneVoiceId] = useState<string>('');
  const [cloneProvider, setCloneProvider] = useState<'elevenlabs' | 'playht' | 'coqui'>('elevenlabs');
  const [cloneStability, setCloneStability] = useState<number>(0.5);
  const [cloneSimilarity, setCloneSimilarity] = useState<number>(0.75);
  
  // Voice state (fetched from server on first modal open)
  const [availableVoices, setAvailableVoices] = useState<{ male: VoiceOption[]; female: VoiceOption[] } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dynamicLanguages, setDynamicLanguages] = useState<LanguageOption[] | null>(null);
  const [voicesFetched, setVoicesFetched] = useState(false);
  const [voicesLoading, setVoicesLoading] = useState(false);
  
  // Track the current language for which voices are fetched
  const [voicesFetchedForLang, setVoicesFetchedForLang] = useState<string | null>(null);
  
  // Single consolidated effect for fetching voices
  // Handles both initial fetch and language changes
  useEffect(() => {
    if (!isVisible || !socket || !roomName || voicesLoading) return;
    
    // Target language for TTS is the speaker's OUTPUT language (what they want to sound in)
    // NOT the spoken language (what they speak) or listen language (for listeners)
    const targetLanguage = localDefaultOutputLang || null;
    
    // Don't fetch until speaker has selected an output language
    if (!targetLanguage) {
      return;
    }
    
    // Skip if we already fetched for this exact language
    if (voicesFetchedForLang === targetLanguage) {
      return;
    }
    
    setVoicesLoading(true);
    setVoicesFetchedForLang(targetLanguage);
    
    // Fetch voices for the target language
    socket.emit('translation:getVoices', { 
      roomName,
      language: targetLanguage 
    }, (response: { voices?: { male: VoiceOption[]; female: VoiceOption[] }; provider?: string }) => {
      if (response.voices) {
        setAvailableVoices(response.voices);
      }
      if (response.provider && response.provider !== selectedTTSProvider) {
        setSelectedTTSProvider(response.provider as TTSProvider);
      }
      
      setVoicesFetched(true);
      setVoicesLoading(false);
    });
    
    // Also fetch languages on first load
    if (!voicesFetched) {
      fetchLanguagesViaSocket(socket, 'en')
        .then((languages) => {
          if (languages && languages.length > 0) {
            setDynamicLanguages(languages);
          }
        })
        .catch((err) => {
          console.error('[TranslationSettingsModal] Failed to fetch languages:', err);
        });
    }
  }, [isVisible, socket, roomName, localDefaultOutputLang, voicesFetchedForLang, voicesLoading, translationConfig, selectedTTSProvider, voicesFetched]);

  // Mount animation
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    }
    setIsMounted(false);
  }, [isVisible]);

  // Sync local state when props change
  useEffect(() => {
    setLocalSpokenLanguage(mySpokenLanguage);
    setLocalSpokenEnabled(mySpokenLanguageEnabled);
    setLocalDefaultOutputLang(myDefaultOutputLanguage);
    setLocalDefaultListen(myDefaultListenLanguage);
    setLocalListenPrefs(new Map(listenPreferences));
    setPerSpeakerMode(listenPreferences.size > 0);
  }, [mySpokenLanguage, mySpokenLanguageEnabled, myDefaultOutputLanguage, myDefaultListenLanguage, listenPreferences]);

  // Rate limiting countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      if (lastSpokenChange > 0) {
        const elapsed = now - lastSpokenChange;
        const remaining = Math.max(0, Math.ceil((RATE_LIMIT_MS - elapsed) / 1000));
        setSpokenCooldown(remaining);
      }
      
      if (lastListenChange > 0) {
        const elapsed = now - lastListenChange;
        const remaining = Math.max(0, Math.ceil((RATE_LIMIT_MS - elapsed) / 1000));
        setListenCooldown(remaining);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lastSpokenChange, lastListenChange]);

  // Get available languages based on room config
  // Use dynamicLanguages from socket if available, otherwise fall back to COMMON_LANGUAGES
  const baseLanguages = useMemo(() => {
    return dynamicLanguages || COMMON_LANGUAGES;
  }, [dynamicLanguages]);

  const availableSpokenLanguages = useMemo(() => {
    if (!translationConfig) return baseLanguages;
    
    if (translationConfig.spokenLanguageMode === 'allowlist') {
      // allowedSpokenLanguages is LanguageEntry[], need to extract codes
      const allowedCodes = translationConfig.allowedSpokenLanguages?.map(e => e.code) || [];
      return baseLanguages.filter(l => allowedCodes.includes(l.code));
    }
    
    if (translationConfig.spokenLanguageMode === 'blocklist') {
      // blockedSpokenLanguages is string[]
      return baseLanguages.filter(l => 
        !translationConfig.blockedSpokenLanguages?.includes(l.code)
      );
    }
    
    return baseLanguages;
  }, [translationConfig, baseLanguages]);

  const availableListenLanguages = useMemo(() => {
    if (!translationConfig) return baseLanguages;
    
    if (translationConfig.listenLanguageMode === 'allowlist') {
      // allowedListenLanguages is LanguageEntry[], need to extract codes
      const allowedCodes = translationConfig.allowedListenLanguages?.map(e => e.code) || [];
      return baseLanguages.filter(l => allowedCodes.includes(l.code));
    }
    
    if (translationConfig.listenLanguageMode === 'blocklist') {
      // blockedListenLanguages is string[]
      return baseLanguages.filter(l => 
        !translationConfig.blockedListenLanguages?.includes(l.code)
      );
    }
    
    return baseLanguages;
  }, [translationConfig, baseLanguages]);

  // Other participants (excluding self)
  const otherParticipants = useMemo(() => {
    return participants.filter(p => p.name !== member);
  }, [participants, member]);

  // Handlers
  const handleSpeakerPreferenceChange = useCallback((speakerId: string, language: string) => {
    setLocalListenPrefs(prev => {
      const next = new Map(prev);
      if (language === 'original') {
        next.delete(speakerId);
      } else {
        next.set(speakerId, language);
      }
      return next;
    });
  }, []);

  const handleApply = useCallback(async () => {
    const now = Date.now();
    const spokenChanged = localSpokenLanguage !== mySpokenLanguage 
      || localSpokenEnabled !== mySpokenLanguageEnabled
      || localDefaultOutputLang !== myDefaultOutputLanguage;
    const listenChanged = !perSpeakerMode 
      ? localDefaultListen !== myDefaultListenLanguage
      : !areMapsEqual(localListenPrefs, listenPreferences);
    
    // Check rate limits before proceeding
    if (spokenChanged && lastSpokenChange > 0) {
      const elapsed = now - lastSpokenChange;
      if (elapsed < RATE_LIMIT_MS) {
        const remaining = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
        showAlert?.({ 
          message: `Please wait ${remaining} seconds before changing spoken language`, 
          type: 'danger', 
          duration: 3000 
        });
        return;
      }
    }
    
    if (listenChanged && lastListenChange > 0) {
      const elapsed = now - lastListenChange;
      if (elapsed < RATE_LIMIT_MS) {
        const remaining = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
        showAlert?.({ 
          message: `Please wait ${remaining} seconds before changing listen language`, 
          type: 'danger', 
          duration: 3000 
        });
        return;
      }
    }
    
    setIsSaving(true);
    
    try {
      // Build voice configuration based on selection mode
      const voiceConfig: {
        voiceGender?: VoiceGender;
        voiceId?: string;
        voiceClone?: VoiceCloneConfig;
        ttsProvider?: string;
      } = {};
      
      if (voiceSelectionMode === 'clone' && voiceCloneConfig) {
        voiceConfig.voiceClone = voiceCloneConfig;
      } else if (voiceSelectionMode === 'advanced' && selectedVoiceId) {
        voiceConfig.voiceId = selectedVoiceId;
        voiceConfig.ttsProvider = selectedTTSProvider;
      } else {
        voiceConfig.voiceGender = selectedVoiceGender;
      }
      
      // Update spoken language and default output language
      if (spokenChanged || localSpokenEnabled) {
        socket.emit('translation:setMyLanguage', {
          roomName,
          language: localSpokenLanguage,
          defaultOutputLanguage: localDefaultOutputLang, // null means same as spoken language
          enabled: localSpokenEnabled,
          producerId: audioProducerId,
          // Include voice configuration
          voiceConfig: localSpokenEnabled ? voiceConfig : undefined,
        });
        updateMySpokenLanguage(localSpokenLanguage);
        updateMyDefaultOutputLanguage(localDefaultOutputLang);
        updateMySpokenLanguageEnabled(localSpokenEnabled);
        setLastSpokenChange(now);
        setSpokenCooldown(30);
      }
      
      // Update listening preferences
      if (!perSpeakerMode) {
        // Apply default to all
        if (localDefaultListen !== myDefaultListenLanguage) {
          socket.emit('translation:setDefaultListenLanguage', {
            roomName,
            language: localDefaultListen,
          });
          updateMyDefaultListenLanguage(localDefaultListen);
          updateListenPreferences(new Map()); // Clear per-speaker when using default
          setLastListenChange(now);
          setListenCooldown(30);
        }
      } else {
        // Apply per-speaker preferences
        updateMyDefaultListenLanguage(null);
        updateListenPreferences(localListenPrefs);
        
        // Emit individual subscription changes
        for (const [speakerId, language] of localListenPrefs) {
          const prevLang = listenPreferences.get(speakerId);
          if (prevLang !== language) {
            if (prevLang) {
              socket.emit('translation:unsubscribe', { roomName, speakerId, language: prevLang });
            }
            socket.emit('translation:subscribe', { roomName, speakerId, language });
          }
        }
        
        // Unsubscribe from removed preferences
        for (const [speakerId, language] of listenPreferences) {
          if (!localListenPrefs.has(speakerId)) {
            socket.emit('translation:unsubscribe', { roomName, speakerId, language });
          }
        }
        
        if (listenChanged) {
          setLastListenChange(now);
          setListenCooldown(30);
        }
      }
      
      showAlert?.({ message: 'Translation settings saved', type: 'success', duration: 2000 });
      onClose();
    } catch (error) {
      console.error('Failed to save translation settings:', error);
      showAlert?.({ message: 'Failed to save settings', type: 'danger', duration: 3000 });
    } finally {
      setIsSaving(false);
    }
  }, [
    localSpokenLanguage, localSpokenEnabled, localDefaultListen, localListenPrefs,
    mySpokenLanguage, mySpokenLanguageEnabled, myDefaultListenLanguage, listenPreferences,
    perSpeakerMode, socket, roomName, audioProducerId,
    updateMySpokenLanguage, updateMySpokenLanguageEnabled, updateMyDefaultListenLanguage, updateListenPreferences,
    showAlert, onClose, lastSpokenChange, lastListenChange,
  ]);

  // Helper to compare maps
  function areMapsEqual(map1: Map<string, string>, map2: Map<string, string>): boolean {
    if (map1.size !== map2.size) return false;
    for (const [key, val] of map1) {
      if (map2.get(key) !== val) return false;
    }
    return true;
  }

  // Position styles for modal mode
  const getPositionStyles = (): React.CSSProperties => {
    const positions: Record<string, React.CSSProperties> = {
      topRight: { top: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      topLeft: { top: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      bottomRight: { bottom: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      bottomLeft: { bottom: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    };
    return positions[position] || positions.center;
  };

  // ============================================================================
  // Shared Styles
  // ============================================================================

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.md}px`,
    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  const titleStyle: React.CSSProperties = {
    ...MediasfuTypography.getTitleMedium(isDarkMode),
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
    margin: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 300,
    transition: `all ${MediasfuAnimations.fast}ms ease`,
  };

  const bodyStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.md}px`,
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.md}px`,
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: MediasfuSpacing.md,
    padding: `${MediasfuSpacing.md}px`,
    borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  // ============================================================================
  // Default Header
  // ============================================================================

  const defaultHeader = (
    <div style={headerStyle}>
      <h2 style={titleStyle}>
        <FontAwesomeIcon
          icon={faGlobe}
          style={{ color: isDarkMode ? MediasfuColors.accentDark : MediasfuColors.accent }}
        />
        {title || 'Translation Settings'}
      </h2>
      <button
        style={closeButtonStyle}
        onClick={onClose}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode
            ? 'rgba(255,255,255,0.15)'
            : 'rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.08)';
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );

  // ============================================================================
  // Tab Navigation
  // ============================================================================

  // ============================================================================
  // Tab Navigation
  // ============================================================================

  const tabNavigation = (
    <div
      style={{
        display: 'flex',
        borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
      }}
    >
      <button
        onClick={() => setActiveTab('speaking')}
        style={{
          flex: 1,
          padding: `${MediasfuSpacing.md}px`,
          background: activeTab === 'speaking'
            ? (isDarkMode ? MediasfuColors.hexToRgba(MediasfuColors.primaryDark, 0.2) : MediasfuColors.hexToRgba(MediasfuColors.primary, 0.1))
            : 'transparent',
          border: 'none',
          borderBottom: activeTab === 'speaking'
            ? `2px solid ${isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary}`
            : '2px solid transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: MediasfuSpacing.sm,
          color: activeTab === 'speaking'
            ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
            : (isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted),
          fontSize: MediasfuTypography.bodyMedium.fontSize,
          fontWeight: activeTab === 'speaking' ? 600 : 400,
          transition: `all ${MediasfuAnimations.fast}ms ease`,
        }}
      >
        <FontAwesomeIcon icon={faMicrophone} />
        My Voice Output
      </button>
      <button
        onClick={() => setActiveTab('listening')}
        style={{
          flex: 1,
          padding: `${MediasfuSpacing.md}px`,
          background: activeTab === 'listening'
            ? (isDarkMode ? MediasfuColors.hexToRgba(MediasfuColors.primaryDark, 0.2) : MediasfuColors.hexToRgba(MediasfuColors.primary, 0.1))
            : 'transparent',
          border: 'none',
          borderBottom: activeTab === 'listening'
            ? `2px solid ${isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary}`
            : '2px solid transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: MediasfuSpacing.sm,
          color: activeTab === 'listening'
            ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
            : (isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted),
          fontSize: MediasfuTypography.bodyMedium.fontSize,
          fontWeight: activeTab === 'listening' ? 600 : 400,
          transition: `all ${MediasfuAnimations.fast}ms ease`,
        }}
      >
        <FontAwesomeIcon icon={faHeadphones} />
        Listen To
      </button>
    </div>
  );

  // ============================================================================
  // Speaking Tab Content
  // ============================================================================

  const speakingTabContent = (
    <div>
      <p
        style={{
          margin: `0 0 ${MediasfuSpacing.md}px`,
          color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
          fontSize: MediasfuTypography.bodySmall.fontSize,
        }}
      >
        Optionally specify your spoken language (helps auto-detection). Then choose an output language to have your voice translated for everyone.
      </p>

      {spokenCooldown > 0 && (
        <div
          style={{
            marginBottom: MediasfuSpacing.md,
            padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
            background: isDarkMode
              ? MediasfuColors.hexToRgba(MediasfuColors.warning, 0.15)
              : MediasfuColors.hexToRgba(MediasfuColors.warning, 0.1),
            borderRadius: MediasfuBorders.sm,
            color: MediasfuColors.warning,
            fontSize: MediasfuTypography.bodySmall.fontSize,
            display: 'flex',
            alignItems: 'center',
            gap: MediasfuSpacing.sm,
          }}
        >
          <FontAwesomeIcon icon={faClock} />
          <span>Wait {spokenCooldown}s before changing spoken language</span>
        </div>
      )}

      <div style={{ marginBottom: MediasfuSpacing.lg }}>
        <label
          style={{
            display: 'block',
            marginBottom: MediasfuSpacing.sm,
            color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
            fontSize: MediasfuTypography.bodyMedium.fontSize,
            fontWeight: 500,
          }}
        >
          <FontAwesomeIcon icon={faLanguage} style={{ marginRight: 8 }} />
          Spoken Language
        </label>
        <LanguageDropdown
          value={localSpokenLanguage}
          onChange={setLocalSpokenLanguage}
          languages={availableSpokenLanguages}
          isDarkMode={isDarkMode}
          includeAuto={translationConfig?.autoDetectSpokenLanguage}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: MediasfuSpacing.sm,
          padding: MediasfuSpacing.md,
          background: isDarkMode
            ? MediasfuColors.hexToRgba(MediasfuColors.surfaceElevatedDark, 0.5)
            : MediasfuColors.hexToRgba(MediasfuColors.surfaceElevated, 0.5),
          borderRadius: MediasfuBorders.md,
        }}
      >
        <input
          type="checkbox"
          id="enableTranslation"
          checked={localSpokenEnabled}
          onChange={(e) => setLocalSpokenEnabled(e.target.checked)}
          style={{
            width: 20,
            height: 20,
            accentColor: isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary,
          }}
        />
        <label
          htmlFor="enableTranslation"
          style={{
            color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
            fontSize: MediasfuTypography.bodyMedium.fontSize,
            cursor: 'pointer',
          }}
        >
          Speak in a different language (translate my voice)
        </label>
      </div>

      {localSpokenEnabled && (
        <>
          {/* Default Output Language - what others hear by default */}
          <div style={{ marginTop: MediasfuSpacing.lg, marginBottom: MediasfuSpacing.lg }}>
            <label
              style={{
                display: 'block',
                marginBottom: MediasfuSpacing.sm,
                color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
                fontSize: MediasfuTypography.bodyMedium.fontSize,
                fontWeight: 500,
              }}
            >
              <FontAwesomeIcon icon={faLanguage} style={{ marginRight: 8 }} />
              Output Language (Everyone Hears)
            </label>
            <p
              style={{
                margin: `0 0 ${MediasfuSpacing.sm}px`,
                color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
                fontSize: MediasfuTypography.bodySmall.fontSize,
              }}
            >
              Choose the language everyone will hear you speak in. Your original audio will be replaced with the translated version.
            </p>
            <select
              value={localDefaultOutputLang || ''}
              onChange={(e) => setLocalDefaultOutputLang(e.target.value || null)}
              style={{
                width: '100%',
                padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
                borderRadius: MediasfuBorders.md,
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                background: isDarkMode
                  ? MediasfuColors.hexToRgba(MediasfuColors.surfaceElevatedDark, 0.8)
                  : MediasfuColors.hexToRgba(MediasfuColors.surfaceElevated, 0.8),
                color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
                fontSize: MediasfuTypography.bodyMedium.fontSize,
                cursor: 'pointer',
              }}
            >
              <option value="">No translation (speak in my original language)</option>
              {availableSpokenLanguages
                .filter(lang => lang.code !== localSpokenLanguage) // Don't show current spoken language
                .map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
            </select>
          </div>

          {localDefaultOutputLang && localDefaultOutputLang !== localSpokenLanguage && (
            <p
              style={{
                marginTop: MediasfuSpacing.md,
                padding: MediasfuSpacing.md,
                background: isDarkMode
                  ? MediasfuColors.hexToRgba(MediasfuColors.info, 0.15)
                  : MediasfuColors.hexToRgba(MediasfuColors.info, 0.1),
                borderRadius: MediasfuBorders.sm,
                color: isDarkMode ? '#60a5fa' : '#2563eb',
                fontSize: MediasfuTypography.bodySmall.fontSize,
              }}
            >
              <FontAwesomeIcon icon={faLanguage} style={{ marginRight: 8 }} />
              <strong>Voice Translation Active:</strong> You speak {availableSpokenLanguages.find(l => l.code === localSpokenLanguage)?.name || localSpokenLanguage}, 
              but everyone will hear you in {availableSpokenLanguages.find(l => l.code === localDefaultOutputLang)?.name || localDefaultOutputLang}.
              <br />
              <span style={{ opacity: 0.8, fontSize: '12px' }}>
                Your original audio is automatically replaced. Only the host can access your original voice.
              </span>
            </p>
          )}

          {!localDefaultOutputLang && (
            <p
              style={{
                marginTop: MediasfuSpacing.md,
                padding: MediasfuSpacing.md,
                background: isDarkMode
                  ? MediasfuColors.hexToRgba(MediasfuColors.success, 0.1)
                  : MediasfuColors.hexToRgba(MediasfuColors.success, 0.05),
                borderRadius: MediasfuBorders.sm,
                color: MediasfuColors.success,
                fontSize: MediasfuTypography.bodySmall.fontSize,
              }}
            >
              <FontAwesomeIcon icon={faCheck} style={{ marginRight: 8 }} />
              Select an output language above to have your voice automatically translated for everyone.
            </p>
          )}

          {/* ================================================================ */}
          {/* Voice Selection Section */}
          {/* ================================================================ */}
          {localDefaultOutputLang && (
            <div
              style={{
                marginTop: MediasfuSpacing.xl,
                padding: MediasfuSpacing.md,
                background: isDarkMode
                  ? MediasfuColors.hexToRgba(MediasfuColors.surfaceElevatedDark, 0.5)
                  : MediasfuColors.hexToRgba(MediasfuColors.surfaceElevated, 0.5),
                borderRadius: MediasfuBorders.lg,
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: MediasfuSpacing.sm, marginBottom: MediasfuSpacing.md }}>
                <FontAwesomeIcon 
                  icon={faWandMagicSparkles} 
                  style={{ color: isDarkMode ? MediasfuColors.accentDark : MediasfuColors.accent }}
                />
                <h3 style={{ 
                  margin: 0, 
                  color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
                  fontSize: MediasfuTypography.bodyLarge.fontSize,
                  fontWeight: 600,
                }}>
                  Voice Settings
                </h3>
              </div>

              {/* Voice Mode Selection */}
              <div style={{ marginBottom: MediasfuSpacing.md }}>
                <div style={{ display: 'flex', gap: MediasfuSpacing.xs, marginBottom: MediasfuSpacing.sm }}>
                  {(['basic', 'advanced', 'clone'] as VoiceSelectionMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        if (mode === 'clone') {
                          showAlert?.({ message: '🎤 Voice Cloning - Coming Soon!', type: 'info', duration: 3000 });
                          return;
                        }
                        setVoiceSelectionMode(mode);
                      }}
                      style={{
                        flex: 1,
                        padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
                        background: voiceSelectionMode === mode
                          ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
                          : (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                        color: voiceSelectionMode === mode
                          ? '#FFFFFF'
                          : (isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted),
                        border: 'none',
                        borderRadius: MediasfuBorders.sm,
                        cursor: 'pointer',
                        fontSize: MediasfuTypography.bodySmall.fontSize,
                        fontWeight: voiceSelectionMode === mode ? 600 : 400,
                        transition: `all ${MediasfuAnimations.fast}ms ease`,
                        textTransform: 'capitalize',
                      }}
                    >
                      {mode === 'clone' ? '🎤 Clone' : mode === 'advanced' ? '⚙️ Advanced' : '✨ Basic'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Mode: Gender Selection */}
              {voiceSelectionMode === 'basic' && (
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: MediasfuSpacing.sm,
                    color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
                    fontSize: MediasfuTypography.bodySmall.fontSize,
                  }}>
                    Voice Gender Preference
                  </label>
                  <div style={{ display: 'flex', gap: MediasfuSpacing.sm }}>
                    {(['female', 'male', 'neutral'] as VoiceGender[]).map((gender) => (
                      <button
                        key={gender}
                        onClick={() => {
                          setSelectedVoiceGender(gender);
                          setSelectedVoiceId(null); // Clear specific voice when using basic mode
                        }}
                        style={{
                          flex: 1,
                          padding: MediasfuSpacing.md,
                          background: selectedVoiceGender === gender
                            ? (isDarkMode ? MediasfuColors.hexToRgba(MediasfuColors.primaryDark, 0.3) : MediasfuColors.hexToRgba(MediasfuColors.primary, 0.15))
                            : (isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                          border: selectedVoiceGender === gender
                            ? `2px solid ${isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary}`
                            : `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                          borderRadius: MediasfuBorders.md,
                          cursor: 'pointer',
                          color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
                          fontSize: MediasfuTypography.bodyMedium.fontSize,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: MediasfuSpacing.xs,
                          transition: `all ${MediasfuAnimations.fast}ms ease`,
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>
                          {gender === 'female' ? '👩' : gender === 'male' ? '👨' : '🧑'}
                        </span>
                        <span style={{ textTransform: 'capitalize' }}>{gender}</span>
                        {selectedVoiceGender === gender && (
                          <FontAwesomeIcon icon={faCheck} style={{ color: MediasfuColors.success, fontSize: '12px' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Mode: Specific Voice Selection */}
              {voiceSelectionMode === 'advanced' && (
                <div>
                    <label style={{
                      display: 'block',
                      marginBottom: MediasfuSpacing.sm,
                      color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
                      fontSize: MediasfuTypography.bodySmall.fontSize,
                    }}>
                      Select Voice {voicesLoading && <FontAwesomeIcon icon={faSpinner} spin style={{ marginLeft: 6 }} />}
                    </label>
                    
                    {availableVoices && !voicesLoading ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: MediasfuSpacing.sm }}>
                        {/* Female Voices */}
                        {availableVoices.female.length > 0 && (
                          <div>
                            <span style={{ 
                              fontSize: '12px', 
                              color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
                              display: 'block',
                              marginBottom: MediasfuSpacing.xs,
                            }}>
                              👩 Female Voices
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: MediasfuSpacing.xs }}>
                              {availableVoices.female.slice(0, 6).map((voice) => (
                                <button
                                  key={voice.id}
                                  onClick={() => setSelectedVoiceId(voice.id)}
                                  style={{
                                    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
                                    background: selectedVoiceId === voice.id
                                      ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
                                      : (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                                    color: selectedVoiceId === voice.id
                                      ? '#FFFFFF'
                                      : (isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary),
                                    border: 'none',
                                    borderRadius: MediasfuBorders.sm,
                                    cursor: 'pointer',
                                    fontSize: MediasfuTypography.bodySmall.fontSize,
                                    transition: `all ${MediasfuAnimations.fast}ms ease`,
                                  }}
                                >
                                  {voice.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Male Voices */}
                        {availableVoices.male.length > 0 && (
                          <div>
                            <span style={{ 
                              fontSize: '12px', 
                              color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
                              display: 'block',
                              marginBottom: MediasfuSpacing.xs,
                            }}>
                              👨 Male Voices
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: MediasfuSpacing.xs }}>
                              {availableVoices.male.slice(0, 6).map((voice) => (
                                <button
                                  key={voice.id}
                                  onClick={() => setSelectedVoiceId(voice.id)}
                                  style={{
                                    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
                                    background: selectedVoiceId === voice.id
                                      ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
                                      : (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                                    color: selectedVoiceId === voice.id
                                      ? '#FFFFFF'
                                      : (isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary),
                                    border: 'none',
                                    borderRadius: MediasfuBorders.sm,
                                    cursor: 'pointer',
                                    fontSize: MediasfuTypography.bodySmall.fontSize,
                                    transition: `all ${MediasfuAnimations.fast}ms ease`,
                                  }}
                                >
                                  {voice.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ 
                        padding: MediasfuSpacing.md, 
                        textAlign: 'center',
                        color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
                      }}>
                        {voicesLoading ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: 8 }} />
                            Loading voices...
                          </>
                        ) : (
'No voices available'
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Clone Mode: Voice Cloning */}
              {voiceSelectionMode === 'clone' && (
                <div>
                  <div style={{
                    padding: MediasfuSpacing.sm,
                    marginBottom: MediasfuSpacing.md,
                    background: isDarkMode
                      ? MediasfuColors.hexToRgba(MediasfuColors.warning, 0.1)
                      : MediasfuColors.hexToRgba(MediasfuColors.warning, 0.05),
                    borderRadius: MediasfuBorders.sm,
                    color: MediasfuColors.warning,
                    fontSize: MediasfuTypography.bodySmall.fontSize,
                  }}>
                    ⚠️ Voice cloning requires a pre-created cloned voice from your TTS provider.
                  </div>

                  {/* Clone Provider */}
                  <div style={{ marginBottom: MediasfuSpacing.md }}>
                    <label style={{
                      display: 'block',
                      marginBottom: MediasfuSpacing.sm,
                      color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
                      fontSize: MediasfuTypography.bodySmall.fontSize,
                    }}>
                      Voice Clone Provider
                    </label>
                    <select
                      value={cloneProvider}
                      onChange={(e) => setCloneProvider(e.target.value as 'elevenlabs' | 'playht' | 'coqui')}
                      style={{
                        width: '100%',
                        padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
                        borderRadius: MediasfuBorders.md,
                        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                        background: isDarkMode
                          ? MediasfuColors.hexToRgba(MediasfuColors.surfaceElevatedDark, 0.8)
                          : MediasfuColors.hexToRgba(MediasfuColors.surfaceElevated, 0.8),
                        color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
                        fontSize: MediasfuTypography.bodyMedium.fontSize,
                        cursor: 'pointer',
                      }}
                    >
                      <option value="elevenlabs">ElevenLabs (Recommended)</option>
                      <option value="playht">PlayHT</option>
                      <option value="coqui">Coqui TTS</option>
                    </select>
                  </div>

                  {/* Clone Voice ID */}
                  <div style={{ marginBottom: MediasfuSpacing.md }}>
                    <label style={{
                      display: 'block',
                      marginBottom: MediasfuSpacing.sm,
                      color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
                      fontSize: MediasfuTypography.bodySmall.fontSize,
                    }}>
                      Cloned Voice ID
                    </label>
                    <input
                      type="text"
                      value={cloneVoiceId}
                      onChange={(e) => setCloneVoiceId(e.target.value)}
                      placeholder="Enter your cloned voice ID"
                      style={{
                        width: '100%',
                        padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
                        borderRadius: MediasfuBorders.md,
                        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                        background: isDarkMode
                          ? MediasfuColors.hexToRgba(MediasfuColors.surfaceElevatedDark, 0.8)
                          : MediasfuColors.hexToRgba(MediasfuColors.surfaceElevated, 0.8),
                        color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
                        fontSize: MediasfuTypography.bodyMedium.fontSize,
                      }}
                    />
                  </div>

                  {/* ElevenLabs-specific settings */}
                  {cloneProvider === 'elevenlabs' && (
                    <>
                      <div style={{ marginBottom: MediasfuSpacing.md }}>
                        <label style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: MediasfuSpacing.xs,
                          color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
                          fontSize: MediasfuTypography.bodySmall.fontSize,
                        }}>
                          <span>Stability</span>
                          <span>{Math.round(cloneStability * 100)}%</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={cloneStability}
                          onChange={(e) => setCloneStability(parseFloat(e.target.value))}
                          style={{
                            width: '100%',
                            accentColor: isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary,
                          }}
                        />
                        <p style={{ 
                          margin: `${MediasfuSpacing.xs}px 0 0`, 
                          fontSize: '11px',
                          color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                        }}>
                          Higher = more consistent, Lower = more expressive
                        </p>
                      </div>

                      <div style={{ marginBottom: MediasfuSpacing.md }}>
                        <label style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: MediasfuSpacing.xs,
                          color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
                          fontSize: MediasfuTypography.bodySmall.fontSize,
                        }}>
                          <span>Similarity Boost</span>
                          <span>{Math.round(cloneSimilarity * 100)}%</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={cloneSimilarity}
                          onChange={(e) => setCloneSimilarity(parseFloat(e.target.value))}
                          style={{
                            width: '100%',
                            accentColor: isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary,
                          }}
                        />
                        <p style={{ 
                          margin: `${MediasfuSpacing.xs}px 0 0`, 
                          fontSize: '11px',
                          color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                        }}>
                          Higher = closer to original voice
                        </p>
                      </div>
                    </>
                  )}

                  {/* Apply Clone Config */}
                  <button
                    onClick={() => {
                      if (cloneVoiceId.trim()) {
                        setVoiceCloneConfig({
                          provider: cloneProvider,
                          voiceId: cloneVoiceId.trim(),
                          stability: cloneProvider === 'elevenlabs' ? cloneStability : undefined,
                          similarity: cloneProvider === 'elevenlabs' ? cloneSimilarity : undefined,
                        });
                        showAlert?.({ message: 'Voice clone configured!', type: 'success', duration: 2000 });
                      } else {
                        showAlert?.({ message: 'Please enter a cloned voice ID', type: 'danger', duration: 2000 });
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: MediasfuSpacing.md,
                      background: isDarkMode ? MediasfuColors.accentDark : MediasfuColors.accent,
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: MediasfuBorders.md,
                      cursor: 'pointer',
                      fontSize: MediasfuTypography.bodyMedium.fontSize,
                      fontWeight: 600,
                      transition: `all ${MediasfuAnimations.fast}ms ease`,
                    }}
                  >
                    🎤 Apply Voice Clone
                  </button>
                </div>
              )}

              {/* Current Selection Summary */}
              <div style={{
                marginTop: MediasfuSpacing.md,
                padding: MediasfuSpacing.sm,
                background: isDarkMode
                  ? MediasfuColors.hexToRgba(MediasfuColors.info, 0.1)
                  : MediasfuColors.hexToRgba(MediasfuColors.info, 0.05),
                borderRadius: MediasfuBorders.sm,
                fontSize: MediasfuTypography.bodySmall.fontSize,
                color: isDarkMode ? '#60a5fa' : '#2563eb',
              }}>
                <strong>Current Voice:</strong>{' '}
                {voiceSelectionMode === 'clone' && voiceCloneConfig
                  ? `🎤 Cloned voice`
                  : voiceSelectionMode === 'advanced' && selectedVoiceId
                    ? selectedVoiceId
                    : `${selectedVoiceGender} voice (auto-selected)`
                }
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ============================================================================
  // Listening Tab Content
  // ============================================================================

  const listeningTabContent = (
    <div>
      <p
        style={{
          margin: `0 0 ${MediasfuSpacing.md}px`,
          color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
          fontSize: MediasfuTypography.bodySmall.fontSize,
        }}
      >
        Choose which language to hear translations in. You can set a default or configure per speaker.
      </p>

      {listenCooldown > 0 && (
        <div
          style={{
            marginBottom: MediasfuSpacing.md,
            padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
            background: isDarkMode
              ? MediasfuColors.hexToRgba(MediasfuColors.warning, 0.15)
              : MediasfuColors.hexToRgba(MediasfuColors.warning, 0.1),
            borderRadius: MediasfuBorders.sm,
            color: MediasfuColors.warning,
            fontSize: MediasfuTypography.bodySmall.fontSize,
            display: 'flex',
            alignItems: 'center',
            gap: MediasfuSpacing.sm,
          }}
        >
          <FontAwesomeIcon icon={faClock} />
          <span>Wait {listenCooldown}s before changing listen language</span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: MediasfuSpacing.sm,
          marginBottom: MediasfuSpacing.lg,
        }}
      >
        <button
          onClick={() => setPerSpeakerMode(false)}
          style={{
            flex: 1,
            padding: MediasfuSpacing.md,
            background: !perSpeakerMode
              ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
              : (isDarkMode ? MediasfuColors.surfaceElevatedDark : MediasfuColors.surfaceElevated),
            color: !perSpeakerMode
              ? '#FFFFFF'
              : (isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary),
            border: 'none',
            borderRadius: MediasfuBorders.md,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: MediasfuSpacing.sm,
            fontSize: MediasfuTypography.bodyMedium.fontSize,
            transition: `all ${MediasfuAnimations.fast}ms ease`,
          }}
        >
          <FontAwesomeIcon icon={faUsers} />
          Same for All
        </button>
        <button
          onClick={() => setPerSpeakerMode(true)}
          style={{
            flex: 1,
            padding: MediasfuSpacing.md,
            background: perSpeakerMode
              ? (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary)
              : (isDarkMode ? MediasfuColors.surfaceElevatedDark : MediasfuColors.surfaceElevated),
            color: perSpeakerMode
              ? '#FFFFFF'
              : (isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary),
            border: 'none',
            borderRadius: MediasfuBorders.md,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: MediasfuSpacing.sm,
            fontSize: MediasfuTypography.bodyMedium.fontSize,
            transition: `all ${MediasfuAnimations.fast}ms ease`,
          }}
        >
          <FontAwesomeIcon icon={faSliders} />
          Per Speaker
        </button>
      </div>

      {!perSpeakerMode && (
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: MediasfuSpacing.sm,
              color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
              fontSize: MediasfuTypography.bodyMedium.fontSize,
              fontWeight: 500,
            }}
          >
            Default Language for All Speakers
          </label>
          <LanguageDropdown
            value={localDefaultListen || (islevel === '2' ? 'original' : 'speakerOutput')}
            onChange={(lang) => setLocalDefaultListen(lang === 'original' || lang === 'speakerOutput' ? null : lang)}
            languages={availableListenLanguages}
            isDarkMode={isDarkMode}
            includeOriginal={islevel === '2'}
            includeSpeakerOutput={true}
            placeholder="Speaker's Output"
          />
        </div>
      )}

      {perSpeakerMode && (
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: MediasfuSpacing.md,
              color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
              fontSize: MediasfuTypography.bodyMedium.fontSize,
              fontWeight: 500,
            }}
          >
            Configure Per Speaker
          </label>
          
          {otherParticipants.length === 0 ? (
            <p
              style={{
                textAlign: 'center',
                padding: MediasfuSpacing.lg,
                color: isDarkMode ? MediasfuColors.textMutedDark : MediasfuColors.textMuted,
              }}
            >
              No other participants in the meeting yet.
            </p>
          ) : (
            otherParticipants.map((p) => (
              <SpeakerLanguageRow
                key={p.id || p.name}
                speaker={p}
                selectedLanguage={localListenPrefs.get(p.id || p.name) || null}
                onChange={handleSpeakerPreferenceChange}
                availableLanguages={availableListenLanguages}
                isDarkMode={isDarkMode}
                isHost={islevel === '2'}
              />
            ))
          )}
        </div>
      )}
    </div>
  );

  // ============================================================================
  // Footer Content
  // ============================================================================

  const footerContent = (
    <div style={footerStyle}>
      <PremiumButton variant="outlined" onPress={onClose} isDarkMode={isDarkMode}>
        Cancel
      </PremiumButton>
      <PremiumButton variant="filled" onPress={handleApply} disabled={isSaving} isDarkMode={isDarkMode}>
        {isSaving ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: 8 }} />
            Saving...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faCheck} style={{ marginRight: 8 }} />
            Apply Changes
          </>
        )}
      </PremiumButton>
    </div>
  );

  // ============================================================================
  // Default Body
  // ============================================================================

  const defaultBody = (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {tabNavigation}
      <div style={bodyStyle}>
        {activeTab === 'speaking' ? speakingTabContent : listeningTabContent}
      </div>
      {footerContent}
    </div>
  );

  // ============================================================================
  // Sidebar / Inline Mode
  // ============================================================================

  // DEBUG: Log renderMode to verify it's being passed correctly

  if (renderMode === 'sidebar' || renderMode === 'inline') {
    const sidebarContent = (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {renderHeader ? renderHeader({ defaultHeader, onClose }) : defaultHeader}
        {renderBody ? renderBody({ defaultBody }) : defaultBody}
      </div>
    );

    return renderContent
      ? <>{renderContent({ defaultContent: sidebarContent })}</>
      : sidebarContent;
  }

  // ============================================================================
  // Modal Mode
  // ============================================================================

  // For modal mode, check visibility
  if (!isVisible) return null;

  // Modal overlay style
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: MediasfuColors.alertBackdrop(isDarkMode),
    backdropFilter: enableGlassmorphism ? 'blur(4px)' : undefined,
    WebkitBackdropFilter: enableGlassmorphism ? 'blur(4px)' : undefined,
    opacity: isMounted ? 1 : 0,
    transition: `opacity ${MediasfuAnimations.normal}ms ease`,
    zIndex: 1000,
  };

  // Modal container style
  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    ...getPositionStyles(),
    width: 'min(500px, calc(100vw - 32px))',
    maxHeight: 'calc(100vh - 100px)',
    opacity: isMounted ? 1 : 0,
    transform: isMounted
      ? position === 'center'
        ? 'translate(-50%, -50%) scale(1)'
        : 'scale(1) translateY(0)'
      : position === 'center'
        ? 'translate(-50%, -50%) scale(0.95)'
        : 'scale(0.95) translateY(-10px)',
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.snappy}`,
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
  };

  const defaultContent = (
    <GlassmorphicContainer
      isDarkMode={isDarkMode}
      borderRadius={MediasfuBorders.xl}
      blur={enableGlassmorphism ? 20 : 0}
      padding={0}
      elevation={4}
      style={{
        ...modalStyle,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
        boxShadow: enableGlow
          ? `${MediasfuColors.elevation(4, isDarkMode)}, ${MediasfuColors.glowPrimary}`
          : MediasfuColors.elevation(4, isDarkMode),
      }}
    >
      {renderHeader ? renderHeader({ defaultHeader, onClose }) : defaultHeader}
      {renderBody ? renderBody({ defaultBody }) : defaultBody}
    </GlassmorphicContainer>
  );

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      {renderContent ? renderContent({ defaultContent }) : defaultContent}
    </>
  );
};

export default TranslationSettingsModal;
