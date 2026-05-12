import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments,
  faCog,
  faMicrophone,
  faMicrophoneSlash,
  faUsers,
  faVideo,
  faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';
import { GlassmorphicContainer, PremiumButton, PremiumTextField } from '../components_modern/core';
import { ModernAlertComponent } from '../components_modern/display_components/ModernAlertComponent';
import { ModernAudioCard } from '../components_modern/display_components/ModernAudioCard';
import { ModernControlButtonsComponent } from '../components_modern/display_components/ModernControlButtonsComponent';
import { ModernFlexibleGrid } from '../components_modern/display_components/ModernFlexibleGrid';
import { ModernFlexibleVideo } from '../components_modern/display_components/ModernFlexibleVideo';
import { ModernMeetingProgressTimer } from '../components_modern/display_components/ModernMeetingProgressTimer';
import { ModernDisplaySettingsModal } from '../components_modern/display_settings_components/ModernDisplaySettingsModal';
import { ModernLoadingModal } from '../components_modern/display_components/ModernLoadingModal';
import { ModernMainContainerComponent } from '../components_modern/display_components/ModernMainContainerComponent';
import { ModernPagination } from '../components_modern/display_components/ModernPagination';
import { ModernVideoCard } from '../components_modern/display_components/ModernVideoCard';
import MainAspectComponent from '../components/displayComponents/MainAspectComponent';
import MainGridComponent from '../components/displayComponents/MainGridComponent';
import OtherGridComponent from '../components/displayComponents/OtherGridComponent';
import SubAspectComponent from '../components/displayComponents/SubAspectComponent';
import { ModernConfirmExitModal } from '../components_modern/exit_components/ModernConfirmExitModal';
import { ModernEventSettingsModal } from '../components_modern/event_settings_components/ModernEventSettingsModal';
import { ModernMediaSettingsModal } from '../components_modern/media_settings_components/ModernMediaSettingsModal';
import { ModernMenuModal } from '../components_modern/menu_components/ModernMenuModal';
import { ModernMessagesModal } from '../components_modern/message_components/ModernMessagesModal';
import ModernConfirmHereModal from '../components_modern/misc_components/ModernConfirmHereModal';
import ModernPreJoinPage from '../components_modern/misc_components/ModernPreJoinPage';
import ModernWelcomePage from '../components_modern/misc_components/ModernWelcomePage';
import { ModernShareEventModal } from '../components_modern/miscComponents/ModernShareEventModal';
import { ModernPanelistsModal } from '../components_modern/panelists_components/ModernPanelistsModal';
import { ModernParticipantsModal } from '../components_modern/participants_components/ModernParticipantsModal';
import { ModernPermissionsModal } from '../components_modern/permissions_components/ModernPermissionsModal';
import { ModernPollModal } from '../components_modern/polls_components/ModernPollModal';
import { ModernRecordingModal } from '../components_modern/recording_components/ModernRecordingModal';
import { ModernRequestsModal } from '../components_modern/requests_components/ModernRequestsModal';
import { TranslationSettingsModal as ModernTranslationSettingsModal } from '../components_modern/translation_components/TranslationSettingsModal';
import { ModernWaitingModal } from '../components_modern/waiting_components/ModernWaitingModal';
import type { Message, Participant, Request, WaitingRoomParticipant } from '../@types/types';
import type { PreJoinPageParameters } from '../components/miscComponents/PreJoinPage';
import type { WelcomePageParameters } from '../components/miscComponents/WelcomePage';
import type { ParticipantsModalParameters } from '../components/participantsComponents/ParticipantsModal';

type ComponentId =
  | 'button'
  | 'field'
  | 'surface'
  | 'alert'
  | 'loading'
  | 'timer'
  | 'pagination'
  | 'control-buttons'
  | 'main-container'
  | 'main-aspect'
  | 'main-grid'
  | 'other-grid'
  | 'sub-aspect'
  | 'flexible-grid'
  | 'flexible-video'
  | 'video-card'
  | 'audio-card'
  | 'messages'
  | 'participants'
  | 'permissions'
  | 'panelists'
  | 'poll'
  | 'recording'
  | 'translation'
  | 'event-settings'
  | 'media-settings'
  | 'menu'
  | 'display-settings'
  | 'requests'
  | 'waiting'
  | 'share-event'
  | 'confirm-exit'
  | 'confirm-here'
  | 'prejoin'
  | 'welcome';
type ThemeId = 'dark' | 'light';
type ViewportId = 'desktop' | 'mobile';
type GridTone = 'primary' | 'accent' | 'emerald' | 'amber' | 'indigo' | 'slate';

type ScenarioOption = { id: string; label: string };
type AuditParameterBag = Record<string, unknown> & { getUpdatedAllParams?: () => AuditParameterBag };

const resolveGridTilePalette = (tone: GridTone, isDarkMode: boolean) => {
  const palettes: Record<GridTone, { background: string; border: string; kicker: string; label: string; detail: string }> = {
    primary: isDarkMode
      ? {
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.32), rgba(14, 165, 233, 0.18))',
          border: 'rgba(96, 165, 250, 0.42)',
          kicker: '#93c5fd',
          label: '#eff6ff',
          detail: 'rgba(219, 234, 254, 0.78)',
        }
      : {
          background: 'linear-gradient(135deg, rgba(191, 219, 254, 0.96), rgba(224, 242, 254, 0.92))',
          border: 'rgba(96, 165, 250, 0.32)',
          kicker: '#1d4ed8',
          label: '#0f172a',
          detail: 'rgba(30, 41, 59, 0.72)',
        },
    accent: isDarkMode
      ? {
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.28), rgba(34, 197, 94, 0.16))',
          border: 'rgba(45, 212, 191, 0.34)',
          kicker: '#67e8f9',
          label: '#ecfeff',
          detail: 'rgba(204, 251, 241, 0.76)',
        }
      : {
          background: 'linear-gradient(135deg, rgba(207, 250, 254, 0.94), rgba(220, 252, 231, 0.9))',
          border: 'rgba(20, 184, 166, 0.26)',
          kicker: '#0f766e',
          label: '#0f172a',
          detail: 'rgba(15, 23, 42, 0.7)',
        },
    emerald: isDarkMode
      ? {
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.26), rgba(74, 222, 128, 0.14))',
          border: 'rgba(74, 222, 128, 0.34)',
          kicker: '#86efac',
          label: '#f0fdf4',
          detail: 'rgba(220, 252, 231, 0.76)',
        }
      : {
          background: 'linear-gradient(135deg, rgba(220, 252, 231, 0.94), rgba(240, 253, 244, 0.9))',
          border: 'rgba(34, 197, 94, 0.24)',
          kicker: '#166534',
          label: '#0f172a',
          detail: 'rgba(15, 23, 42, 0.68)',
        },
    amber: isDarkMode
      ? {
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.26), rgba(251, 191, 36, 0.14))',
          border: 'rgba(251, 191, 36, 0.34)',
          kicker: '#fcd34d',
          label: '#fffbeb',
          detail: 'rgba(254, 243, 199, 0.76)',
        }
      : {
          background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.96), rgba(255, 251, 235, 0.92))',
          border: 'rgba(245, 158, 11, 0.24)',
          kicker: '#92400e',
          label: '#0f172a',
          detail: 'rgba(15, 23, 42, 0.68)',
        },
    indigo: isDarkMode
      ? {
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.28), rgba(129, 140, 248, 0.16))',
          border: 'rgba(129, 140, 248, 0.34)',
          kicker: '#c7d2fe',
          label: '#eef2ff',
          detail: 'rgba(224, 231, 255, 0.76)',
        }
      : {
          background: 'linear-gradient(135deg, rgba(224, 231, 255, 0.96), rgba(238, 242, 255, 0.92))',
          border: 'rgba(99, 102, 241, 0.24)',
          kicker: '#3730a3',
          label: '#0f172a',
          detail: 'rgba(15, 23, 42, 0.68)',
        },
    slate: isDarkMode
      ? {
          background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.42), rgba(30, 41, 59, 0.3))',
          border: 'rgba(148, 163, 184, 0.2)',
          kicker: '#cbd5e1',
          label: '#f8fafc',
          detail: 'rgba(226, 232, 240, 0.76)',
        }
      : {
          background: 'linear-gradient(135deg, rgba(241, 245, 249, 0.96), rgba(226, 232, 240, 0.92))',
          border: 'rgba(148, 163, 184, 0.24)',
          kicker: '#475569',
          label: '#0f172a',
          detail: 'rgba(30, 41, 59, 0.68)',
        },
  };

  return palettes[tone];
};

const AuditGridTile: React.FC<{ label: string; detail: string; tone: GridTone; isDarkMode: boolean }> = ({
  label,
  detail,
  tone,
  isDarkMode,
}) => {
  const palette = resolveGridTilePalette(tone, isDarkMode);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 16,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: palette.background,
        border: `1px solid ${palette.border}`,
        boxShadow: isDarkMode
          ? '0 18px 36px rgba(2, 8, 23, 0.22)'
          : '0 18px 36px rgba(148, 163, 184, 0.2)',
      }}
    >
      <span
        style={{
          fontSize: '0.68rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: palette.kicker,
          fontWeight: 700,
        }}
      >
        Audit Tile
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <strong style={{ fontSize: '1rem', lineHeight: 1.2, color: palette.label, fontWeight: 700 }}>
          {label}
        </strong>
        <span style={{ fontSize: '0.78rem', lineHeight: 1.35, color: palette.detail }}>
          {detail}
        </span>
      </div>
    </div>
  );
};

const AuditScreenboard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      borderRadius: 18,
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: isDarkMode
        ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.22), rgba(59, 130, 246, 0.1))'
        : 'linear-gradient(135deg, rgba(191, 219, 254, 0.82), rgba(224, 242, 254, 0.74))',
      border: isDarkMode ? '1px solid rgba(125, 211, 252, 0.34)' : '1px solid rgba(59, 130, 246, 0.24)',
      boxShadow: isDarkMode ? '0 18px 36px rgba(2, 8, 23, 0.24)' : '0 18px 36px rgba(148, 163, 184, 0.18)',
    }}
  >
    <span
      style={{
        fontSize: '0.68rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: isDarkMode ? '#bae6fd' : '#1d4ed8',
        fontWeight: 700,
      }}
    >
      Screenboard
    </span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <strong
        style={{
          fontSize: '1.02rem',
          lineHeight: 1.2,
          color: isDarkMode ? '#f8fafc' : '#0f172a',
          fontWeight: 700,
        }}
      >
        Shared Screen Overlay
      </strong>
      <span
        style={{
          fontSize: '0.78rem',
          lineHeight: 1.35,
          color: isDarkMode ? 'rgba(224, 242, 254, 0.78)' : 'rgba(15, 23, 42, 0.68)',
        }}
      >
        Annotation-ready layer for guides, pointers, and highlights.
      </span>
    </div>
    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
      <span
        style={{
          fontSize: '0.68rem',
          fontWeight: 600,
          color: isDarkMode ? '#e0f2fe' : '#1e3a8a',
          opacity: 0.76,
        }}
      >
        Annotation mode
      </span>
    </div>
  </div>
);

const auditGridTiles: Array<{ label: string; detail: string; tone: GridTone }> = [
  { label: 'Host Feed', detail: 'Spotlight-ready primary tile', tone: 'primary' },
  { label: 'Panel A', detail: 'Secondary participant feed', tone: 'accent' },
  { label: 'Panel B', detail: 'Support speaker tile', tone: 'emerald' },
  { label: 'Screen', detail: 'Shared content placeholder', tone: 'amber' },
  { label: 'Guest 1', detail: 'Audience promotion slot', tone: 'indigo' },
  { label: 'Guest 2', detail: 'Reserve participant slot', tone: 'slate' },
];

const componentRegistry: Record<ComponentId, { label: string; scenarios: ScenarioOption[] }> = {
  button: {
    label: 'PremiumButton',
    scenarios: [
      { id: 'primary', label: 'Primary' },
      { id: 'secondary', label: 'Secondary' },
      { id: 'ghost', label: 'Ghost' },
      { id: 'disabled', label: 'Disabled' },
    ],
  },
  field: {
    label: 'PremiumTextField',
    scenarios: [
      { id: 'empty', label: 'Empty' },
      { id: 'filled', label: 'Filled' },
      { id: 'focused', label: 'Focused' },
      { id: 'error', label: 'Error' },
      { id: 'disabled', label: 'Disabled' },
    ],
  },
  surface: {
    label: 'GlassmorphicContainer',
    scenarios: [
      { id: 'base', label: 'Base' },
      { id: 'elevated', label: 'Elevated' },
      { id: 'interactive', label: 'Interactive' },
    ],
  },
  alert: {
    label: 'ModernAlertComponent',
    scenarios: [
      { id: 'success', label: 'Success' },
      { id: 'danger', label: 'Danger' },
    ],
  },
  loading: {
    label: 'ModernLoadingModal',
    scenarios: [
      { id: 'spinner', label: 'Spinner' },
      { id: 'text-only', label: 'Text Only' },
    ],
  },
  timer: {
    label: 'ModernMeetingProgressTimer',
    scenarios: [
      { id: 'default', label: 'Default' },
      { id: 'long', label: 'Long Elapsed' },
      { id: 'compact', label: 'Compact Width' },
    ],
  },
  pagination: {
    label: 'ModernPagination',
    scenarios: [
      { id: 'single', label: 'Single Page' },
      { id: 'multiple', label: 'Multiple Pages' },
      { id: 'narrow', label: 'Narrow Width' },
    ],
  },
  'control-buttons': {
    label: 'ModernControlButtonsComponent',
    scenarios: [
      { id: 'default', label: 'Default' },
      { id: 'compact', label: 'Compact Width' },
      { id: 'disabled', label: 'Disabled Action' },
    ],
  },
  'main-container': {
    label: 'ModernMainContainerComponent',
    scenarios: [
      { id: 'normal', label: 'Normal Room' },
      { id: 'sidebar', label: 'Sidebar Open' },
      { id: 'mobile', label: 'Mobile Stack' },
    ],
  },
  'main-aspect': {
    label: 'MainAspectComponent',
    scenarios: [
      { id: 'non-shared', label: 'Non-shared' },
      { id: 'shared-screen', label: 'Shared Screen' },
      { id: 'sidebar', label: 'Sidebar Open' },
    ],
  },
  'main-grid': {
    label: 'MainGridComponent',
    scenarios: [
      { id: 'host', label: 'Grid With Host' },
      { id: 'shared-screen', label: 'Grid With Shared Screen' },
      { id: 'theme-switch', label: 'Theme Switch' },
    ],
  },
  'other-grid': {
    label: 'OtherGridComponent',
    scenarios: [
      { id: 'multi-user', label: 'Multi-user' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'sidebar', label: 'Sidebar Open' },
    ],
  },
  'sub-aspect': {
    label: 'SubAspectComponent',
    scenarios: [
      { id: 'compact', label: 'Compact' },
      { id: 'shared-screen', label: 'Shared Screen' },
      { id: 'alternate', label: 'Alternate Card Arrangement' },
    ],
  },
  'flexible-grid': {
    label: 'ModernFlexibleGrid',
    scenarios: [
      { id: 'sparse', label: 'Sparse Layout' },
      { id: 'filled', label: 'Filled Layout' },
      { id: 'compact', label: 'Compact Layout' },
    ],
  },
  'flexible-video': {
    label: 'ModernFlexibleVideo',
    scenarios: [
      { id: 'filled', label: 'Filled Cells' },
      { id: 'empty', label: 'Empty Cells' },
      { id: 'screenboard', label: 'Screenboard Overlay' },
    ],
  },
  'video-card': {
    label: 'ModernVideoCard',
    scenarios: [
      { id: 'live', label: 'Live Speaker' },
      { id: 'muted', label: 'Muted Tile' },
      { id: 'subtitle', label: 'Subtitle Overlay' },
    ],
  },
  'audio-card': {
    label: 'ModernAudioCard',
    scenarios: [
      { id: 'speaking', label: 'Speaking Avatar' },
      { id: 'muted', label: 'Muted Avatar' },
      { id: 'subtitle', label: 'Subtitle Overlay' },
    ],
  },
  messages: {
    label: 'ModernMessagesModal',
    scenarios: [
      { id: 'group', label: 'Group Inline' },
      { id: 'direct', label: 'Direct Inline' },
      { id: 'empty', label: 'Empty Inline' },
      { id: 'sidebar', label: 'Sidebar' },
    ],
  },
  participants: {
    label: 'ModernParticipantsModal',
    scenarios: [
      { id: 'populated', label: 'Populated Inline' },
      { id: 'empty', label: 'Empty Inline' },
      { id: 'sidebar', label: 'Sidebar' },
    ],
  },
  permissions: {
    label: 'ModernPermissionsModal',
    scenarios: [
      { id: 'config', label: 'Capability Rules' },
      { id: 'users', label: 'Participant Levels' },
    ],
  },
  panelists: {
    label: 'ModernPanelistsModal',
    scenarios: [
      { id: 'focused', label: 'Focused List' },
      { id: 'available', label: 'Available List' },
    ],
  },
  poll: {
    label: 'ModernPollModal',
    scenarios: [
      { id: 'active', label: 'Active Poll' },
    ],
  },
  recording: {
    label: 'ModernRecordingModal',
    scenarios: [
      { id: 'standard', label: 'Standard Panel' },
    ],
  },
  translation: {
    label: 'ModernTranslationSettingsModal',
    scenarios: [
      { id: 'supported', label: 'Supported' },
      { id: 'unsupported', label: 'Unsupported' },
      { id: 'personal', label: 'Personal Translation' },
      { id: 'pending', label: 'Pending Personal Translation' },
      { id: 'clone', label: 'Clone Enabled' },
      { id: 'sidebar', label: 'Sidebar' },
    ],
  },
  'event-settings': {
    label: 'ModernEventSettingsModal',
    scenarios: [
      { id: 'modal', label: 'Modal' },
    ],
  },
  'media-settings': {
    label: 'ModernMediaSettingsModal',
    scenarios: [
      { id: 'devices', label: 'Devices' },
    ],
  },
  menu: {
    label: 'ModernMenuModal',
    scenarios: [
      { id: 'modal', label: 'Modal' },
      { id: 'sidebar', label: 'Sidebar' },
      { id: 'inline', label: 'Inline' },
    ],
  },
  'display-settings': {
    label: 'ModernDisplaySettingsModal',
    scenarios: [
      { id: 'modal', label: 'Modal' },
      { id: 'sidebar', label: 'Sidebar' },
      { id: 'inline', label: 'Inline' },
    ],
  },
  requests: {
    label: 'ModernRequestsModal',
    scenarios: [
      { id: 'populated', label: 'Populated Modal' },
      { id: 'empty', label: 'Empty Modal' },
      { id: 'sidebar', label: 'Sidebar' },
    ],
  },
  waiting: {
    label: 'ModernWaitingModal',
    scenarios: [
      { id: 'populated', label: 'Populated Modal' },
      { id: 'empty', label: 'Empty Modal' },
      { id: 'sidebar', label: 'Sidebar' },
    ],
  },
  'share-event': {
    label: 'ModernShareEventModal',
    scenarios: [
      { id: 'modal', label: 'Modal' },
      { id: 'sidebar', label: 'Sidebar' },
      { id: 'inline', label: 'Inline' },
    ],
  },
  'confirm-exit': {
    label: 'ModernConfirmExitModal',
    scenarios: [
      { id: 'host', label: 'Host Exit' },
      { id: 'guest', label: 'Guest Exit' },
    ],
  },
  'confirm-here': {
    label: 'ModernConfirmHereModal',
    scenarios: [
      { id: 'default', label: 'Default' },
    ],
  },
  prejoin: {
    label: 'ModernPreJoinPage',
    scenarios: [
      { id: 'join', label: 'Join' },
      { id: 'create', label: 'Create' },
    ],
  },
  welcome: {
    label: 'ModernWelcomePage',
    scenarios: [
      { id: 'default', label: 'Default' },
      { id: 'split', label: 'Split Layout' },
    ],
  },
};

const searchParams = typeof window !== 'undefined'
  ? new URLSearchParams(window.location.search)
  : new URLSearchParams();

const resolveComponentId = (value: string | null): ComponentId => {
  if (value && value in componentRegistry) {
    return value as ComponentId;
  }

  return 'button';
};

const resolveScenarioId = (component: ComponentId, value: string | null): string => {
  const match = componentRegistry[component].scenarios.find((option) => option.id === value);
  return match?.id ?? componentRegistry[component].scenarios[0].id;
};

const noOp = () => undefined;
const noOpAsync = async () => ({ id: 'audit-socket' } as never);
const noOpAsyncVoid = async () => undefined;
const auditSocket = {
  emit: noOp,
  on: noOp,
  off: noOp,
} as never;

const credentials = {
  apiUserName: 'audit-user',
  apiKey: 'audit-key',
};

const auditParticipants = [
  {
    id: 'participant-host',
    name: 'Host',
    islevel: '2',
    muted: false,
  } as Participant,
  {
    id: 'participant-maya',
    name: 'Maya',
    islevel: '1',
    muted: false,
  } as Participant,
  {
    id: 'participant-jordan',
    name: 'Jordan',
    islevel: '0',
    muted: true,
  } as Participant,
] as Participant[];

const auditMessages = [
  {
    sender: 'Host',
    receivers: ['All'],
    timestamp: '10:42',
    group: true,
    message: 'Welcome to the audit room.',
  } as Message,
  {
    sender: 'Maya',
    receivers: ['Host'],
    timestamp: '10:43',
    group: false,
    message: 'Need a quick review on the latest settings panel.',
  } as Message,
] as Message[];

const auditRequests = [
  {
    id: 'request-audio',
    icon: 'fa-microphone',
    name: 'Maya',
  } as Request,
  {
    id: 'request-video',
    icon: 'fa-video',
    name: 'Jordan',
  } as Request,
  {
    id: 'request-screen',
    icon: 'fa-desktop',
    name: 'Taylor',
  } as Request,
] as Request[];

const auditWaitingRoom = [
  {
    id: 'waiting-1',
    name: 'Taylor',
  } as WaitingRoomParticipant,
  {
    id: 'waiting-2',
    name: 'Sam',
  } as WaitingRoomParticipant,
  {
    id: 'waiting-3',
    name: 'Riley',
  } as WaitingRoomParticipant,
] as WaitingRoomParticipant[];

const auditPanelists = auditParticipants.filter((participant) => participant.name !== 'Host').slice(0, 2);

const auditPermissionConfig = {
  level0: {
    useMic: 'approval',
    useCamera: 'approval',
    useScreen: 'disallow',
    useChat: 'allow',
  },
  level1: {
    useMic: 'allow',
    useCamera: 'allow',
    useScreen: 'approval',
    useChat: 'allow',
  },
};

const auditPolls = [
  {
    id: 'poll-1',
    question: 'Should breakout rooms open after the agenda review?',
    type: 'yesNo',
    options: ['Yes', 'No'],
    votes: [4, 1],
    status: 'active',
    voters: {},
  },
  {
    id: 'poll-2',
    question: 'Which Q&A format should we default to?',
    type: 'custom',
    options: ['Chat', 'Live queue', 'Hybrid'],
    votes: [3, 2, 1],
    status: 'inactive',
    voters: {},
  },
];

const auditUserVoiceClones = [
  {
    id: 'clone-elevenlabs-primary',
    providerVoiceId: 'clone-elevenlabs-primary',
    voiceId: 'clone-elevenlabs-primary',
    name: 'Audit Narrator',
    provider: 'elevenlabs',
    isDefault: true,
  },
  {
    id: 'clone-cartesia-secondary',
    providerVoiceId: 'clone-cartesia-secondary',
    voiceId: 'clone-cartesia-secondary',
    name: 'Orbit Cartesia',
    provider: 'cartesia',
    isDefault: false,
  },
];

const auditVideoInputs = [
  { deviceId: 'camera-front', label: 'Front Camera' },
  { deviceId: 'camera-rear', label: 'Rear Camera' },
];

const auditAudioInputs = [
  { deviceId: 'mic-default', label: 'Default Microphone' },
  { deviceId: 'mic-usb', label: 'USB Microphone' },
];

const createMeetingAuditParameters = (): AuditParameterBag => {
  const parameters: AuditParameterBag = {
    imgSrc: 'https://mediasfu.com/images/logo192.png',
    showAlert: noOp,
    updateIsLoadingModalVisible: noOp,
    connectSocket: noOpAsync,
    connectLocalSocket: async () => ({ socket: auditSocket, data: undefined }),
    updateSocket: noOp,
    updateLocalSocket: noOp,
    updateValidated: noOp,
    updateApiUserName: noOp,
    updateApiToken: noOp,
    updateLink: noOp,
    updateRoomName: noOp,
    updateMember: noOp,
    updateAudioPreference: noOp,
    updateVideoPreference: noOp,
    updateAudioOutputPreference: noOp,
    updateIsDarkMode: noOp,
    updateEventType: noOp,
    updateVirtualBackground: noOp,
    updateCurrentFacingMode: noOp,
    updateKeepBackground: noOp,
    updateAppliedBackground: noOp,
    updateSelfieSegmentation: noOp,
    roomName: 'audit-room',
    member: 'Host',
    coHost: 'Maya',
    islevel: '2',
    eventType: 'conference',
    socket: auditSocket,
    localSocket: auditSocket,
    participants: auditParticipants,
    filteredParticipants: auditParticipants,
    coHostResponsibility: [],
    updateIsMessagesModalVisible: noOp,
    updateDirectMessageDetails: noOp,
    updateStartDirectMessage: noOp,
    updateParticipants: noOp,
    filteredRequestList: auditRequests,
    updateRequestList: noOp,
    filteredWaitingRoomList: auditWaitingRoom,
    updateWaitingList: noOp,
    videoInputs: auditVideoInputs,
    audioInputs: auditAudioInputs,
    userDefaultVideoInputDevice: auditVideoInputs[0].deviceId,
    userDefaultAudioInputDevice: auditAudioInputs[0].deviceId,
    isBackgroundModalVisible: false,
    updateIsBackgroundModalVisible: noOp,
    meetingDisplayType: 'video',
    autoWave: false,
    forceFullDisplay: false,
    meetingVideoOptimized: true,
    updateMeetingDisplayType: noOp,
    mainRoomsLength: 1,
    memberRoom: 0,
    hostNewRoom: 0,
    itemPageLimit: 6,
    canStartBreakout: true,
    breakoutRooms: [],
    updateBreakoutRooms: noOp,
    updateCanStartBreakout: noOp,
    shareScreenStarted: false,
    shared: false,
    newParticipantAction: 'autoAssignNewRoom',
    breakOutRoomStarted: false,
    breakOutRoomEnded: false,
    updateBreakOutRoomStarted: noOp,
    updateBreakOutRoomEnded: noOp,
    prevMeetingDisplayType: 'video',
    whiteboardStarted: false,
    whiteboardEnded: true,
    whiteboardUsers: [],
    updateWhiteboardUsers: noOp,
    updateWhiteboardStarted: noOp,
    updateWhiteboardEnded: noOp,
    updateCanStartWhiteboard: noOp,
    updateIsConfigureWhiteboardModalVisible: noOp,
    onScreenChanges: noOpAsyncVoid,
    prepopulateUserMedia: noOpAsyncVoid,
    rePort: noOpAsyncVoid,
    captureCanvasStream: noOpAsyncVoid,
    mainHeightWidth: 100,
    updateMainHeightWidth: noOp,
    hostLabel: 'Host',
    recordStarted: false,
    recordResumed: false,
    recordPaused: false,
    recordStopped: false,
    recordingMediaOptions: 'all',
    recordingAudioOptions: 'all',
    recordingVideoOptions: 'all',
    recordingAddHLS: false,
    updateRecordingMediaOptions: noOp,
    updateRecordingAudioOptions: noOp,
    updateRecordingVideoOptions: noOp,
    updateRecordingAddHLS: noOp,
    recordingVideoType: 'camera',
    recordingDisplayType: 'all',
    recordingBackgroundColor: '#0f172a',
    recordingNameTagsColor: '#ffffff',
    recordingOrientationVideo: 'landscape',
    recordingNameTags: true,
    recordingAddText: true,
    recordingCustomText: 'MediaSFU Audit',
    recordingCustomTextPosition: 'bottom',
    recordingCustomTextColor: '#ffffff',
    updateRecordingVideoType: noOp,
    updateRecordingDisplayType: noOp,
    updateRecordingBackgroundColor: noOp,
    updateRecordingNameTagsColor: noOp,
    updateRecordingOrientationVideo: noOp,
    updateRecordingNameTags: noOp,
    updateRecordingAddText: noOp,
    updateRecordingCustomText: noOp,
    updateRecordingCustomTextPosition: noOp,
    updateRecordingCustomTextColor: noOp,
  };

  parameters.getUpdatedAllParams = () => parameters;
  return parameters;
};

const ModernUIParityAudit: React.FC = () => {
  const [componentId, setComponentId] = useState<ComponentId>(() => resolveComponentId(searchParams.get('component')));
  const [theme, setTheme] = useState<ThemeId>(() => (searchParams.get('theme') === 'light' ? 'light' : 'dark'));
  const [viewport, setViewport] = useState<ViewportId>(() => (searchParams.get('viewport') === 'mobile' ? 'mobile' : 'desktop'));
  const [hideChrome, setHideChrome] = useState(() => searchParams.get('chrome') === '0');
  const [scenarioId, setScenarioId] = useState(() => resolveScenarioId(resolveComponentId(searchParams.get('component')), searchParams.get('scenario')));
  const [fieldValue, setFieldValue] = useState('');
  const previewRef = useRef<HTMLDivElement | null>(null);

  const scenarioOptions = useMemo(() => componentRegistry[componentId].scenarios, [componentId]);
  const activeScenarioLabel = useMemo(
    () => scenarioOptions.find((option) => option.id === scenarioId)?.label ?? scenarioId,
    [scenarioId, scenarioOptions],
  );

  useEffect(() => {
    setScenarioId((current) => resolveScenarioId(componentId, current));
  }, [componentId]);

  useEffect(() => {
    if (scenarioId === 'filled') {
      setFieldValue('Audit runner');
      return;
    }

    if (scenarioId === 'error') {
      setFieldValue('x');
      return;
    }

    setFieldValue('');
  }, [scenarioId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('audit', '1');
    params.set('component', componentId);
    params.set('scenario', scenarioId);
    params.set('theme', theme);
    params.set('viewport', viewport);
    if (hideChrome) {
      params.set('chrome', '0');
    } else {
      params.delete('chrome');
    }
    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', nextUrl);
    document.title = `React Audit • ${componentRegistry[componentId].label} • ${activeScenarioLabel}`;
  }, [activeScenarioLabel, componentId, hideChrome, scenarioId, theme, viewport]);

  useEffect(() => {
    const root = previewRef.current;
    if (!root) {
      return;
    }

    if (componentId === 'messages') {
      const frame = window.requestAnimationFrame(() => {
        const targetLabel = scenarioId === 'direct' ? 'Direct' : 'Group';
        const tab = Array.from(root.querySelectorAll('button')).find((button) => button.textContent?.includes(targetLabel));
        tab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      return () => window.cancelAnimationFrame(frame);
    }

    if (componentId === 'permissions' && scenarioId === 'users') {
      const frame = window.requestAnimationFrame(() => {
        const tab = Array.from(root.querySelectorAll('button')).find((button) => button.textContent?.includes('Participant levels'));
        tab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      return () => window.cancelAnimationFrame(frame);
    }

    if (componentId === 'field' && scenarioId === 'focused') {
      const input = root.querySelector('input, textarea, select') as HTMLElement | null;
      input?.focus();
      return;
    }

    if (componentId === 'prejoin' && scenarioId === 'create') {
      const frame = window.requestAnimationFrame(() => {
        const toggle = Array.from(root.querySelectorAll('button')).find((button) => button.textContent?.includes('Switch to Create Mode'));
        toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      return () => window.cancelAnimationFrame(frame);
    }
  }, [componentId, scenarioId, theme, viewport]);

  const queryPreview = useMemo(() => {
    const params = new URLSearchParams();
    params.set('audit', '1');
    params.set('component', componentId);
    params.set('scenario', scenarioId);
    params.set('theme', theme);
    params.set('viewport', viewport);
    if (hideChrome) {
      params.set('chrome', '0');
    }
    return `?${params.toString()}`;
  }, [componentId, hideChrome, scenarioId, theme, viewport]);

  const isDarkMode = theme === 'dark';
  const alertType = scenarioId === 'danger' ? 'danger' : 'success';
  const timerMeetingProgress = scenarioId === 'long' ? '56:12' : scenarioId === 'compact' ? '03:08' : '12:18';
  const paginationTotalPages = scenarioId === 'single' ? 1 : 8;
  const paginationCurrentPage = scenarioId === 'single' ? 1 : 4;
  const messagesRenderMode = scenarioId === 'sidebar' ? 'sidebar' : 'inline';
  const participantsRenderMode = scenarioId === 'sidebar' ? 'sidebar' : 'inline';
  const translationRenderMode = scenarioId === 'sidebar' ? 'sidebar' : 'modal';
  const controlButtonsWidth = scenarioId === 'compact' ? 360 : 560;
  const flexibleGridRows = scenarioId === 'compact' ? 3 : 2;
  const flexibleGridColumns = scenarioId === 'compact' ? 2 : 3;
  const flexibleGridCount = scenarioId === 'filled' ? 6 : 4;
  const flexibleGridCellWidth = viewport === 'mobile' ? 140 : scenarioId === 'compact' ? 180 : 220;
  const flexibleGridCellHeight = viewport === 'mobile' ? 100 : scenarioId === 'compact' ? 120 : 140;
  const flexibleVideoRows = 2;
  const flexibleVideoColumns = 2;
  const flexibleVideoCount = scenarioId === 'empty' ? 2 : 4;
  const flexibleVideoCellWidth = viewport === 'mobile' ? 150 : 240;
  const flexibleVideoCellHeight = viewport === 'mobile' ? 110 : 160;
  const flexibleGridStageStyle: React.CSSProperties = {
    width: viewport === 'mobile'
      ? 'min(100% - 32px, 340px)'
      : scenarioId === 'compact'
        ? 'min(100% - 48px, 560px)'
        : 'min(100% - 48px, 760px)',
    margin: '72px auto',
    padding: 18,
    borderRadius: 28,
    background: isDarkMode ? 'rgba(15, 23, 42, 0.28)' : 'rgba(255, 255, 255, 0.42)',
    border: isDarkMode ? '1px solid rgba(148, 163, 184, 0.18)' : '1px solid rgba(148, 163, 184, 0.3)',
    boxShadow: isDarkMode ? '0 24px 64px rgba(2, 8, 23, 0.28)' : '0 24px 64px rgba(148, 163, 184, 0.22)',
  };
  const flexibleVideoStageStyle: React.CSSProperties = {
    width: viewport === 'mobile' ? 'min(100% - 32px, 340px)' : 'min(100% - 48px, 620px)',
    margin: '72px auto',
    padding: 18,
    borderRadius: 28,
    background: isDarkMode ? 'rgba(15, 23, 42, 0.28)' : 'rgba(255, 255, 255, 0.42)',
    border: isDarkMode ? '1px solid rgba(148, 163, 184, 0.18)' : '1px solid rgba(148, 163, 184, 0.3)',
    boxShadow: isDarkMode ? '0 24px 64px rgba(2, 8, 23, 0.28)' : '0 24px 64px rgba(148, 163, 184, 0.22)',
  };
  const cardStageStyle: React.CSSProperties = {
    width: viewport === 'mobile' ? 'min(100% - 32px, 320px)' : 'min(100% - 48px, 360px)',
    height: viewport === 'mobile' ? 320 : 360,
    margin: '72px auto',
  };

  const mainContainerLayout = useMemo(() => {
    if (scenarioId === 'sidebar') {
      return {
        widthFraction: viewport === 'mobile' ? 0.94 : 0.82,
        heightFraction: viewport === 'mobile' ? 0.78 : 0.74,
        columns: viewport === 'mobile' ? '1fr' : 'minmax(0, 2.2fr) minmax(260px, 1fr)',
        padding: viewport === 'mobile' ? 16 : 24,
        marginTop: viewport === 'mobile' ? 24 : 32,
      };
    }

    if (scenarioId === 'mobile') {
      return {
        widthFraction: 0.94,
        heightFraction: 0.82,
        columns: '1fr',
        padding: 16,
        marginTop: 20,
      };
    }

    return {
      widthFraction: viewport === 'mobile' ? 0.94 : 0.86,
      heightFraction: viewport === 'mobile' ? 0.8 : 0.74,
      columns: viewport === 'mobile' ? '1fr' : 'repeat(2, minmax(0, 1fr))',
      padding: viewport === 'mobile' ? 16 : 24,
      marginTop: viewport === 'mobile' ? 24 : 32,
    };
  }, [scenarioId, viewport]);

  const mainContainerTiles = useMemo<Array<{ label: string; detail: string; tone: GridTone }>>(() => {
    if (scenarioId === 'sidebar') {
      return [
        {
          label: 'Primary room canvas',
          detail: 'Main stage stays dominant while a docked helper panel remains visible.',
          tone: 'primary',
        },
        {
          label: 'Docked sidebar rail',
          detail: 'Participants, messages, or settings can stay open without covering the stage.',
          tone: 'slate',
        },
      ];
    }

    if (scenarioId === 'mobile') {
      return [
        {
          label: 'Mobile room shell',
          detail: 'Single-column layout keeps the room content readable on narrow viewports.',
          tone: 'primary',
        },
        {
          label: 'Support actions',
          detail: 'Secondary actions and state summaries collapse beneath the main content.',
          tone: 'accent',
        },
      ];
    }

    return [
      {
        label: 'Primary column',
        detail: 'Main presentation content fills the wider room lane.',
        tone: 'primary',
      },
      {
        label: 'Support column',
        detail: 'Room notes, pinned context, or auxiliary tools share the same modern shell.',
        tone: 'accent',
      },
    ];
  }, [scenarioId]);

  const mainContainerContentStyle = useMemo<React.CSSProperties>(() => ({
    display: 'grid',
    gridTemplateColumns: mainContainerLayout.columns,
    gap: viewport === 'mobile' || scenarioId === 'mobile' ? 12 : 16,
    height: '100%',
    minHeight: '100%',
    boxSizing: 'border-box',
    alignContent: 'stretch',
  }), [mainContainerLayout.columns, scenarioId, viewport]);

  const mainAspectLayout = useMemo(() => {
    if (scenarioId === 'shared-screen') {
      return {
        widthFraction: viewport === 'mobile' ? 0.94 : 0.82,
        heightFraction: viewport === 'mobile' ? 0.76 : 0.72,
        columns: viewport === 'mobile' ? '1fr' : 'minmax(0, 2.4fr) minmax(260px, 1fr)',
        gap: viewport === 'mobile' ? 12 : 16,
      };
    }

    if (scenarioId === 'sidebar') {
      return {
        widthFraction: viewport === 'mobile' ? 0.94 : 0.8,
        heightFraction: viewport === 'mobile' ? 0.78 : 0.72,
        columns: viewport === 'mobile' ? '1fr' : 'minmax(0, 2fr) minmax(240px, 1fr)',
        gap: viewport === 'mobile' ? 12 : 16,
      };
    }

    return {
      widthFraction: viewport === 'mobile' ? 0.94 : 0.82,
      heightFraction: viewport === 'mobile' ? 0.78 : 0.72,
      columns: '1fr',
      gap: viewport === 'mobile' ? 12 : 16,
    };
  }, [scenarioId, viewport]);

  const mainAspectTiles = useMemo<Array<{ label: string; detail: string; tone: GridTone }>>(() => {
    if (scenarioId === 'shared-screen') {
      return [
        {
          label: 'Shared screen focus',
          detail: 'Presentation content takes the dominant lane while room context remains adjacent.',
          tone: 'primary',
        },
        {
          label: 'Support stack',
          detail: 'Pinned notes, speaker queue, or room tools stay visible beside the main stage.',
          tone: 'indigo',
        },
      ];
    }

    if (scenarioId === 'sidebar') {
      return [
        {
          label: 'Primary presentation',
          detail: 'The main room canvas preserves width even with a sidebar docked nearby.',
          tone: 'primary',
        },
        {
          label: 'Sidebar context',
          detail: 'Helper content remains visually separated but still inside the shared main area.',
          tone: 'slate',
        },
      ];
    }

    return [
      {
        label: 'Main presentation surface',
        detail: 'Primary room content scales responsively without extra docked panels.',
        tone: 'accent',
      },
    ];
  }, [scenarioId]);

  const mainAspectContentStyle = useMemo<React.CSSProperties>(() => ({
    display: 'grid',
    gridTemplateColumns: mainAspectLayout.columns,
    gap: mainAspectLayout.gap,
    height: '100%',
    minHeight: '100%',
    padding: viewport === 'mobile' ? 16 : 24,
    boxSizing: 'border-box',
  }), [mainAspectLayout.columns, mainAspectLayout.gap, viewport]);

  const mainGridLayout = useMemo(() => {
    if (scenarioId === 'shared-screen') {
      return {
        width: viewport === 'mobile' ? 340 : 980,
        height: viewport === 'mobile' ? 360 : 420,
        columns: viewport === 'mobile' ? '1fr' : 'minmax(0, 2.4fr) minmax(280px, 1fr)',
        tiles: [
          {
            label: 'Shared screen stage',
            detail: 'Screenboard or screen-share content holds the dominant main grid position.',
            tone: 'primary' as GridTone,
          },
          {
            label: 'Host context',
            detail: 'Speaker or room metadata remains anchored in the secondary lane.',
            tone: 'indigo' as GridTone,
          },
        ],
      };
    }

    if (scenarioId === 'theme-switch') {
      return {
        width: viewport === 'mobile' ? 340 : 980,
        height: viewport === 'mobile' ? 360 : 420,
        columns: viewport === 'mobile' ? '1fr' : 'repeat(2, minmax(0, 1fr))',
        tiles: [
          {
            label: 'Theme-aware stage',
            detail: 'Main grid chrome should stay coherent when the room toggles between light and dark.',
            tone: 'emerald' as GridTone,
          },
          {
            label: 'Secondary context',
            detail: 'Auxiliary content keeps the same spacing and framing across theme flips.',
            tone: 'slate' as GridTone,
          },
        ],
      };
    }

    return {
      width: viewport === 'mobile' ? 340 : 980,
      height: viewport === 'mobile' ? 360 : 420,
      columns: viewport === 'mobile' ? '1fr' : 'minmax(0, 2fr) minmax(240px, 1fr)',
      tiles: [
        {
          label: 'Host spotlight',
          detail: 'The host or active speaker remains the dominant first-class grid item.',
          tone: 'primary' as GridTone,
        },
        {
          label: 'Context panel',
          detail: 'Pinned notes, queue state, or room tools sit beside the spotlighted content.',
          tone: 'accent' as GridTone,
        },
      ],
    };
  }, [scenarioId, viewport]);

  const mainGridStageStyle = useMemo<React.CSSProperties>(() => ({
    width: mainGridLayout.width,
    margin: '72px auto 0',
  }), [mainGridLayout.width]);

  const mainGridContentStyle = useMemo<React.CSSProperties>(() => ({
    display: 'grid',
    gridTemplateColumns: mainGridLayout.columns,
    gap: viewport === 'mobile' ? 12 : 16,
    height: '100%',
    padding: viewport === 'mobile' ? 16 : 24,
    boxSizing: 'border-box',
  }), [mainGridLayout.columns, viewport]);

  const otherGridLayout = useMemo(() => {
    if (scenarioId === 'pagination') {
      return {
        width: viewport === 'mobile' ? 340 : 880,
        height: viewport === 'mobile' ? 280 : 320,
        columns: viewport === 'mobile' ? '1fr' : 'repeat(2, minmax(0, 1fr))',
        tiles: [
          {
            label: 'Secondary participants',
            detail: 'Overflow room content can page without collapsing the auxiliary grid shell.',
            tone: 'accent' as GridTone,
          },
          {
            label: 'Pagination state',
            detail: 'Page changes remain framed inside the same docked secondary area.',
            tone: 'amber' as GridTone,
          },
        ],
      };
    }

    if (scenarioId === 'sidebar') {
      return {
        width: viewport === 'mobile' ? 340 : 880,
        height: viewport === 'mobile' ? 280 : 320,
        columns: viewport === 'mobile' ? '1fr' : 'repeat(2, minmax(0, 1fr))',
        tiles: [
          {
            label: 'Docked secondary grid',
            detail: 'Auxiliary room content remains readable when the room shell also opens a sidebar.',
            tone: 'slate' as GridTone,
          },
          {
            label: 'Companion lane',
            detail: 'Secondary grid content still tiles predictably beside the primary room shell.',
            tone: 'indigo' as GridTone,
          },
        ],
      };
    }

    return {
      width: viewport === 'mobile' ? 340 : 880,
      height: viewport === 'mobile' ? 280 : 320,
      columns: viewport === 'mobile' ? '1fr' : 'repeat(3, minmax(0, 1fr))',
      tiles: [
        {
          label: 'Chat lane',
          detail: 'Secondary content tiles can coexist without displacing the main stage.',
          tone: 'accent' as GridTone,
        },
        {
          label: 'Queue lane',
          detail: 'Participant backlog or requests remain visible in the same grid shell.',
          tone: 'emerald' as GridTone,
        },
        {
          label: 'Backlog lane',
          detail: 'Additional room context can live in the overflow grid without layout drift.',
          tone: 'slate' as GridTone,
        },
      ],
    };
  }, [scenarioId, viewport]);

  const otherGridStageStyle = useMemo<React.CSSProperties>(() => ({
    width: otherGridLayout.width,
    margin: '72px auto 0',
  }), [otherGridLayout.width]);

  const otherGridContentStyle = useMemo<React.CSSProperties>(() => ({
    display: 'grid',
    gridTemplateColumns: otherGridLayout.columns,
    gap: viewport === 'mobile' ? 12 : 14,
    height: '100%',
    padding: viewport === 'mobile' ? 14 : 20,
    boxSizing: 'border-box',
  }), [otherGridLayout.columns, viewport]);

  const subAspectLayout = useMemo(() => {
    if (scenarioId === 'compact') {
      return {
        widthFraction: viewport === 'mobile' ? 0.94 : 0.62,
        defaultFractionSub: 0.08,
        columns: viewport === 'mobile' ? '1fr' : 'repeat(2, minmax(0, 1fr))',
        tiles: [
          {
            label: 'Compact controls',
            detail: 'Slimmer control lanes still preserve grouping and emphasis.',
            tone: 'slate' as GridTone,
          },
          {
            label: 'Quick actions',
            detail: 'High-priority room actions remain clustered in the reduced sub-aspect height.',
            tone: 'accent' as GridTone,
          },
        ],
      };
    }

    if (scenarioId === 'shared-screen') {
      return {
        widthFraction: viewport === 'mobile' ? 0.94 : 0.78,
        defaultFractionSub: 0.1,
        columns: viewport === 'mobile' ? '1fr' : 'repeat(3, minmax(0, 1fr))',
        tiles: [
          {
            label: 'Share tools',
            detail: 'Screen-share helpers remain grouped beneath the main presentation surface.',
            tone: 'primary' as GridTone,
          },
          {
            label: 'Annotation mode',
            detail: 'Secondary actions stay aligned when collaborative presentation is active.',
            tone: 'indigo' as GridTone,
          },
          {
            label: 'Context actions',
            detail: 'Room controls keep a predictable lane beneath the shared screen.',
            tone: 'slate' as GridTone,
          },
        ],
      };
    }

    return {
      widthFraction: viewport === 'mobile' ? 0.94 : 0.74,
      defaultFractionSub: 0.1,
      columns: viewport === 'mobile' ? '1fr' : 'repeat(3, minmax(0, 1fr))',
      tiles: [
        {
          label: 'Alternate tool group',
          detail: 'Card arrangements can reorder without leaving the sub-aspect shell.',
          tone: 'accent' as GridTone,
        },
        {
          label: 'Status rail',
          detail: 'Session status or automation chips remain visible in the alternate arrangement.',
          tone: 'emerald' as GridTone,
        },
        {
          label: 'Utility lane',
          detail: 'Supplemental room tools keep the same spacing in the swapped layout.',
          tone: 'slate' as GridTone,
        },
      ],
    };
  }, [scenarioId, viewport]);

  const subAspectStageStyle = useMemo<React.CSSProperties>(() => ({
    marginTop: 72,
  }), []);

  const subAspectContentStyle = useMemo<React.CSSProperties>(() => ({
    display: 'grid',
    gridTemplateColumns: subAspectLayout.columns,
    gap: viewport === 'mobile' ? 10 : 12,
    height: '100%',
    padding: viewport === 'mobile' ? 10 : 12,
    boxSizing: 'border-box',
  }), [subAspectLayout.columns, viewport]);

  const stageBackground = isDarkMode
    ? 'radial-gradient(circle at top left, rgba(99,102,241,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(6,182,212,0.12), transparent 28%), #050b16'
    : 'radial-gradient(circle at top left, rgba(99,102,241,0.12), transparent 24%), radial-gradient(circle at bottom right, rgba(14,165,233,0.12), transparent 30%), #e8eef8';

  const viewportStyle: React.CSSProperties = viewport === 'mobile'
    ? {
        width: 390,
        minHeight: 844,
      }
    : {
        width: 'min(100%, 1440px)',
        minHeight: 900,
      };

  const preJoinParameters = useMemo<PreJoinPageParameters>(() => ({
    imgSrc: 'https://mediasfu.com/images/logo192.png',
    showAlert: noOp,
    updateIsLoadingModalVisible: noOp,
    connectSocket: noOpAsync,
    connectLocalSocket: async () => ({ socket: { id: 'audit-local-socket' } as never, data: undefined }),
    updateSocket: noOp,
    updateLocalSocket: noOp,
    updateValidated: noOp,
    updateApiUserName: noOp,
    updateApiToken: noOp,
    updateLink: noOp,
    updateRoomName: noOp,
    updateMember: noOp,
    updateEventType: noOp,
    updateAudioPreference: noOp,
    updateVideoPreference: noOp,
    updateAudioOutputPreference: noOp,
    updateIsDarkMode: noOp,
    updateVirtualBackground: noOp,
    updateCurrentFacingMode: noOp,
    updateKeepBackground: noOp,
    updateAppliedBackground: noOp,
    updateSelfieSegmentation: noOp,
  }), []);

  const welcomeParameters = useMemo<WelcomePageParameters>(() => ({
    imgSrc: 'https://mediasfu.com/images/logo192.png',
    showAlert: noOp,
    updateIsLoadingModalVisible: noOp,
    connectSocket: noOpAsync,
    connectLocalSocket: undefined,
    updateSocket: noOp,
    updateLocalSocket: undefined,
    updateValidated: noOp,
    updateApiUserName: noOp,
    updateApiToken: noOp,
    updateLink: noOp,
    updateRoomName: noOp,
    updateMember: noOp,
  }), []);

  const messagesFixture = useMemo(
    () => (scenarioId === 'empty' ? [] : scenarioId === 'group' ? [auditMessages[0]] : auditMessages),
    [scenarioId],
  );

  const directTarget = useMemo(
    () => (scenarioId === 'direct' ? auditParticipants[1] : null),
    [scenarioId],
  );

  const participantsFixture = useMemo(
    () => (scenarioId === 'empty' ? [] : auditParticipants),
    [scenarioId],
  );

  const flexibleGridComponents = useMemo(
    () => auditGridTiles.slice(0, flexibleGridCount).map((tile, index) => (
      <AuditGridTile
        key={`audit-grid-${scenarioId}-${index}`}
        label={tile.label}
        detail={tile.detail}
        tone={tile.tone}
        isDarkMode={isDarkMode}
      />
    )),
    [flexibleGridCount, isDarkMode, scenarioId],
  );

  const flexibleVideoComponents = useMemo(
    () => auditGridTiles.slice(0, flexibleVideoCount).map((tile, index) => (
      <AuditGridTile
        key={`audit-video-${scenarioId}-${index}`}
        label={tile.label}
        detail={tile.detail}
        tone={tile.tone}
        isDarkMode={isDarkMode}
      />
    )),
    [flexibleVideoCount, isDarkMode, scenarioId],
  );

  const videoCardParticipant = useMemo(
    () => ({
      id: 'participant-video-card',
      audioID: 'audio-video-card',
      videoID: 'video-video-card',
      name: scenarioId === 'muted' ? 'Jordan' : scenarioId === 'subtitle' ? 'Taylor' : 'Maya',
      islevel: scenarioId === 'muted' ? '0' : '1',
      muted: scenarioId === 'muted',
      videoOn: scenarioId !== 'muted',
    } as Participant),
    [scenarioId],
  );

  const audioCardParticipant = useMemo(
    () => ({
      id: 'participant-audio-card',
      audioID: 'audio-audio-card',
      videoID: 'video-audio-card',
      name: scenarioId === 'muted' ? 'Jordan' : scenarioId === 'subtitle' ? 'Sam' : 'Avery',
      islevel: '1',
      muted: scenarioId === 'muted',
      videoOn: false,
    } as Participant),
    [scenarioId],
  );

  const videoCardLoudness = componentId === 'video-card'
    ? (scenarioId === 'muted' ? 0 : 144)
    : 118;

  const audioCardLoudness = componentId === 'audio-card'
    ? (scenarioId === 'muted' ? 0 : scenarioId === 'speaking' ? 148 : 136)
    : 118;

  const cardParameters = useMemo(() => {
    const parameters = createMeetingAuditParameters();
    const participants = [videoCardParticipant, audioCardParticipant];

    parameters.participants = participants;
    parameters.filteredParticipants = participants;
    parameters.audioDecibels = [
      { name: videoCardParticipant.name, averageLoudness: videoCardLoudness },
      { name: audioCardParticipant.name, averageLoudness: audioCardLoudness },
    ];
    parameters.getUpdatedAllParams = () => parameters;

    return parameters;
  }, [audioCardLoudness, audioCardParticipant, videoCardLoudness, videoCardParticipant]);

  const participantsParameters = useMemo<ParticipantsModalParameters>(() => {
    let parameters: ParticipantsModalParameters;
    parameters = {
      coHostResponsibility: [],
      coHost: 'Maya',
      member: 'Host',
      islevel: '2',
      participants: auditParticipants,
      eventType: 'conference',
      filteredParticipants: participantsFixture,
      socket: auditSocket,
      roomName: 'audit-room',
      updateIsMessagesModalVisible: noOp,
      updateDirectMessageDetails: noOp,
      updateStartDirectMessage: noOp,
      updateParticipants: noOp,
      getUpdatedAllParams: () => parameters,
    } as unknown as ParticipantsModalParameters;

    return parameters;
  }, [participantsFixture]);

  const permissionsParameters = useMemo<NonNullable<React.ComponentProps<typeof ModernPermissionsModal>['parameters']>>(() => {
    let parameters: NonNullable<React.ComponentProps<typeof ModernPermissionsModal>['parameters']>;
    parameters = {
      participants: auditParticipants,
      member: 'Host',
      islevel: '2',
      socket: auditSocket,
      roomName: 'audit-room',
      showAlert: noOp,
      permissionConfig: auditPermissionConfig,
      updatePermissionConfig: noOp,
      audioSetting: 'approval',
      videoSetting: 'approval',
      screenshareSetting: 'disallow',
      chatSetting: 'allow',
      getUpdatedAllParams: () => parameters,
    } as unknown as NonNullable<React.ComponentProps<typeof ModernPermissionsModal>['parameters']>;

    return parameters;
  }, []);

  const panelistsParameters = useMemo<NonNullable<React.ComponentProps<typeof ModernPanelistsModal>['parameters']>>(() => {
    let parameters: NonNullable<React.ComponentProps<typeof ModernPanelistsModal>['parameters']>;
    parameters = {
      participants: auditParticipants,
      panelists: auditPanelists,
      member: 'Host',
      islevel: '2',
      socket: auditSocket,
      roomName: 'audit-room',
      showAlert: noOp,
      itemPageLimit: 6,
      panelistsFocused: scenarioId !== 'available',
      updatePanelists: noOp,
      updatePanelistsFocused: noOp,
      getUpdatedAllParams: () => parameters,
    } as unknown as NonNullable<React.ComponentProps<typeof ModernPanelistsModal>['parameters']>;

    return parameters;
  }, [scenarioId]);

  const requestsFixture = useMemo(
    () => (scenarioId === 'empty' ? [] : auditRequests),
    [scenarioId],
  );

  const waitingFixture = useMemo(
    () => (scenarioId === 'empty' ? [] : auditWaitingRoom),
    [scenarioId],
  );

  const displaySettingsParameters = useMemo<React.ComponentProps<typeof ModernDisplaySettingsModal>['parameters']>(() => ({
    meetingDisplayType: 'video',
    autoWave: true,
    forceFullDisplay: false,
    meetingVideoOptimized: true,
    showSubtitlesOnCards: true,
  } as React.ComponentProps<typeof ModernDisplaySettingsModal>['parameters']), []);

  const paginationParameters = useMemo<React.ComponentProps<typeof ModernPagination>['parameters']>(() => {
    const parameters = createMeetingAuditParameters() as React.ComponentProps<typeof ModernPagination>['parameters'];
    parameters.mainRoomsLength = paginationTotalPages;
    parameters.memberRoom = paginationCurrentPage;
    parameters.hostNewRoom = 0;
    parameters.breakoutRooms = [];
    parameters.getUpdatedAllParams = () => parameters;
    return parameters;
  }, [paginationCurrentPage, paginationTotalPages]);

  const controlButtons = useMemo<React.ComponentProps<typeof ModernControlButtonsComponent>['buttons']>(() => ([
    {
      name: 'Microphone',
      tooltip: 'Microphone',
      icon: <FontAwesomeIcon icon={faMicrophone} />,
      alternateIcon: <FontAwesomeIcon icon={faMicrophoneSlash} />,
      active: true,
    },
    {
      name: 'Camera',
      tooltip: 'Camera',
      icon: <FontAwesomeIcon icon={faVideo} />,
      alternateIcon: <FontAwesomeIcon icon={faVideoSlash} />,
      active: true,
    },
    {
      name: 'Chat',
      tooltip: 'Open chat',
      icon: <FontAwesomeIcon icon={faComments} />,
      active: scenarioId !== 'compact',
    },
    {
      name: 'People',
      tooltip: 'View participants',
      icon: <FontAwesomeIcon icon={faUsers} />,
      active: false,
    },
    {
      name: 'Settings',
      tooltip: 'Open settings',
      icon: <FontAwesomeIcon icon={faCog} />,
      active: false,
      disabled: scenarioId === 'disabled',
    },
  ]), [scenarioId]);

  const requestsParameters = useMemo<NonNullable<React.ComponentProps<typeof ModernRequestsModal>['parameters']>>(() => {
    let parameters: NonNullable<React.ComponentProps<typeof ModernRequestsModal>['parameters']>;
    parameters = {
      filteredRequestList: requestsFixture,
      getUpdatedAllParams: () => parameters,
    } as unknown as NonNullable<React.ComponentProps<typeof ModernRequestsModal>['parameters']>;

    return parameters;
  }, [requestsFixture]);

  const waitingParameters = useMemo<NonNullable<React.ComponentProps<typeof ModernWaitingModal>['parameters']>>(() => {
    let parameters: NonNullable<React.ComponentProps<typeof ModernWaitingModal>['parameters']>;
    parameters = {
      filteredWaitingRoomList: waitingFixture,
      getUpdatedAllParams: () => parameters,
    } as unknown as NonNullable<React.ComponentProps<typeof ModernWaitingModal>['parameters']>;

    return parameters;
  }, [waitingFixture]);

  const recordingParameters = useMemo(
    () => createMeetingAuditParameters() as React.ComponentProps<typeof ModernRecordingModal>['parameters'],
    [],
  );

  const mediaSettingsParameters = useMemo(
    () => createMeetingAuditParameters() as React.ComponentProps<typeof ModernMediaSettingsModal>['parameters'],
    [],
  );

  const translationProps = useMemo<React.ComponentProps<typeof ModernTranslationSettingsModal>>(() => {
    const isUnsupported = scenarioId === 'unsupported';
    const isPending = scenarioId === 'pending';
    const isPersonal = scenarioId === 'personal';

    return {
      isVisible: true,
      onClose: noOp,
      translationConfig: {
        supportTranslation: !isUnsupported && !isPending,
        spokenLanguageMode: 'any',
        listenLanguageMode: 'any',
        maxActiveChannelsPerSpeaker: 2,
        autoDetectSpokenLanguage: true,
        allowSpokenLanguageChange: true,
        allowListenLanguageChange: true,
      },
      member: 'Host',
      islevel: '2',
      audioProducerId: 'producer-host',
      participants: auditParticipants,
      mySpokenLanguage: 'en',
      mySpokenLanguageEnabled: true,
      myDefaultOutputLanguage: isUnsupported || isPending ? null : 'fr',
      myDefaultListenLanguage: 'es',
      listenPreferences: scenarioId === 'sidebar'
        ? new Map([['participant-maya', 'fr']])
        : new Map(),
      updateMySpokenLanguage: noOp,
      updateMySpokenLanguageEnabled: noOp,
      updateMyDefaultOutputLanguage: noOp,
      updateMyDefaultListenLanguage: noOp,
      updateListenPreferences: noOp,
      socket: auditSocket,
      roomName: 'audit-room',
      showSubtitlesOnCards: true,
      updateShowSubtitlesOnCards: noOp,
      isPersonalTranslation: isPersonal,
      canUsePersonalTranslation: isPersonal || isPending,
      personalTranslationUsername: isPersonal || isPending ? 'audit.personal' : undefined,
      userVoiceClones: scenarioId === 'clone' ? auditUserVoiceClones : undefined,
      renderMode: translationRenderMode,
      isDarkMode,
    };
  }, [isDarkMode, scenarioId, translationRenderMode]);

  const renderContent = () => {
    if (componentId === 'button') {
      const variant = scenarioId === 'secondary'
        ? 'outlined'
        : scenarioId === 'ghost'
          ? 'ghost'
          : 'gradient';

      return (
        <div style={exampleCardStyle(isDarkMode)}>
          <p style={kickerStyle(isDarkMode)}>PremiumButton / {activeScenarioLabel}</p>
          <h2 style={titleStyle(isDarkMode)}>Button primitive snapshot</h2>
          <p style={copyStyle(isDarkMode)}>Baseline call-to-action treatment for modern flows.</p>
          <PremiumButton
            variant={variant}
            size="lg"
            disabled={scenarioId === 'disabled'}
            isDarkMode={isDarkMode}
          >
            {scenarioId === 'ghost' ? 'View details' : 'Join room'}
          </PremiumButton>
        </div>
      );
    }

    if (componentId === 'field') {
      return (
        <div style={{ ...exampleCardStyle(isDarkMode), gap: 20 }}>
          <p style={kickerStyle(isDarkMode)}>PremiumTextField / {activeScenarioLabel}</p>
          <h2 style={titleStyle(isDarkMode)}>Input primitive snapshot</h2>
          <PremiumTextField
            label="Display Name"
            helperText={scenarioId === 'error' ? 'Expected error treatment check' : 'Used across entry and settings flows.'}
            placeholder="Enter your display name"
            value={fieldValue}
            onChangeText={setFieldValue}
            hasError={scenarioId === 'error'}
            errorText={scenarioId === 'error' ? 'Display Name must be longer.' : undefined}
            disabled={scenarioId === 'disabled'}
            autoFocus={scenarioId === 'focused'}
            fullWidth
            variant="glass"
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'surface') {
      return (
        <div style={{ width: 'min(100%, 680px)', margin: '72px auto' }}>
          <GlassmorphicContainer
            isDarkMode={isDarkMode}
            elevation={scenarioId === 'elevated' ? 3 : 1}
            hoverEffect={scenarioId === 'interactive'}
            style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 32 }}
          >
            <p style={kickerStyle(isDarkMode)}>GlassmorphicContainer / {activeScenarioLabel}</p>
            <h2 style={titleStyle(isDarkMode)}>Shared shell surface</h2>
            <p style={copyStyle(isDarkMode)}>Closest React floating surface for onboarding and embedded panel parity.</p>
          </GlassmorphicContainer>
        </div>
      );
    }

    if (componentId === 'alert') {
      return (
        <div style={{ position: 'relative', minHeight: '100%' }}>
          <ModernAlertComponent
            visible
            message={alertType === 'danger' ? 'Unable to save request settings.' : 'Request approved successfully.'}
            type={alertType}
            duration={0}
            onHide={noOp}
            position="center"
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'loading') {
      return (
        <div style={{ position: 'relative', minHeight: '100%' }}>
          <ModernLoadingModal
            isVisible
            loadingText={scenarioId === 'text-only' ? 'Preparing room shell...' : 'Syncing participant state...'}
            showSpinner={scenarioId !== 'text-only'}
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'timer') {
      return (
        <div
          style={{
            position: 'relative',
            minHeight: 220,
            width: scenarioId === 'compact' ? 160 : 320,
            margin: '72px auto',
          }}
        >
          <ModernMeetingProgressTimer
            meetingProgressTime={timerMeetingProgress}
            position="topLeft"
            variant={scenarioId === 'compact' ? 'minimal' : 'badge'}
            showIcon={scenarioId !== 'compact'}
            enableGlow={scenarioId === 'long'}
            isDarkMode={isDarkMode}
            showTimer
          />
        </div>
      );
    }

    if (componentId === 'pagination') {
      return (
        <div
          style={{
            width: scenarioId === 'narrow' ? 272 : scenarioId === 'single' ? 220 : 420,
            margin: '120px auto 0',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ModernPagination
            totalPages={paginationTotalPages}
            currentUserPage={paginationCurrentPage}
            parameters={paginationParameters}
            showAspect
            paginationHeight={52}
            direction="horizontal"
            position="middle"
            location="middle"
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'control-buttons') {
      return (
        <div
          style={{
            width: controlButtonsWidth,
            margin: '140px auto 0',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ModernControlButtonsComponent
            buttons={controlButtons}
            isDarkMode={isDarkMode}
            animateOnMount={false}
          />
        </div>
      );
    }

    if (componentId === 'main-container') {
      return (
        <ModernMainContainerComponent
          backgroundColor={isDarkMode ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)'}
          containerWidthFraction={mainContainerLayout.widthFraction}
          containerHeightFraction={mainContainerLayout.heightFraction}
          marginLeft={0}
          marginRight={0}
          marginTop={mainContainerLayout.marginTop}
          marginBottom={0}
          padding={mainContainerLayout.padding}
          isDarkMode={isDarkMode}
        >
          <div style={mainContainerContentStyle}>
            {mainContainerTiles.map((tile, index) => (
              <AuditGridTile
                key={`main-container-${scenarioId}-${index}`}
                label={tile.label}
                detail={tile.detail}
                tone={tile.tone}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </ModernMainContainerComponent>
      );
    }

    if (componentId === 'main-aspect') {
      return (
        <MainAspectComponent
          backgroundColor={isDarkMode ? 'rgba(15, 23, 42, 0.92)' : 'rgba(248, 250, 252, 0.92)'}
          showControls
          containerWidthFraction={mainAspectLayout.widthFraction}
          containerHeightFraction={mainAspectLayout.heightFraction}
          updateIsWideScreen={noOp}
          updateIsMediumScreen={noOp}
          updateIsSmallScreen={noOp}
        >
          <div style={mainAspectContentStyle}>
            {mainAspectTiles.map((tile, index) => (
              <AuditGridTile
                key={`main-aspect-${scenarioId}-${index}`}
                label={tile.label}
                detail={tile.detail}
                tone={tile.tone}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </MainAspectComponent>
      );
    }

    if (componentId === 'main-grid') {
      return (
        <div style={mainGridStageStyle}>
          <MainGridComponent
            backgroundColor={isDarkMode ? '#020617' : '#e2e8f0'}
            mainSize={68}
            height={mainGridLayout.height}
            width={mainGridLayout.width}
            showAspect
            timeBackgroundColor={isDarkMode ? 'rgba(59, 130, 246, 0.85)' : 'rgba(37, 99, 235, 0.78)'}
            showTimer
            meetingProgressTime="00:24:18"
          >
            <div style={mainGridContentStyle}>
              {mainGridLayout.tiles.map((tile, index) => (
                <AuditGridTile
                  key={`main-grid-${scenarioId}-${index}`}
                  label={tile.label}
                  detail={tile.detail}
                  tone={tile.tone}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </MainGridComponent>
        </div>
      );
    }

    if (componentId === 'other-grid') {
      return (
        <div style={otherGridStageStyle}>
          <OtherGridComponent
            backgroundColor={isDarkMode ? '#020617' : '#e2e8f0'}
            width={otherGridLayout.width}
            height={otherGridLayout.height}
            showAspect
            timeBackgroundColor={isDarkMode ? 'rgba(34, 197, 94, 0.82)' : 'rgba(22, 163, 74, 0.78)'}
            showTimer
            meetingProgressTime="00:24:18"
          >
            <div style={otherGridContentStyle}>
              {otherGridLayout.tiles.map((tile, index) => (
                <AuditGridTile
                  key={`other-grid-${scenarioId}-${index}`}
                  label={tile.label}
                  detail={tile.detail}
                  tone={tile.tone}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </OtherGridComponent>
        </div>
      );
    }

    if (componentId === 'sub-aspect') {
      return (
        <div style={subAspectStageStyle}>
          <SubAspectComponent
            backgroundColor={isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(248, 250, 252, 0.92)'}
            showControls
            containerWidthFraction={subAspectLayout.widthFraction}
            defaultFractionSub={subAspectLayout.defaultFractionSub}
          >
            <div style={subAspectContentStyle}>
              {subAspectLayout.tiles.map((tile, index) => (
                <AuditGridTile
                  key={`sub-aspect-${scenarioId}-${index}`}
                  label={tile.label}
                  detail={tile.detail}
                  tone={tile.tone}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </SubAspectComponent>
        </div>
      );
    }

    if (componentId === 'flexible-grid') {
      return (
        <div style={flexibleGridStageStyle}>
          <ModernFlexibleGrid
            customWidth={flexibleGridCellWidth}
            customHeight={flexibleGridCellHeight}
            rows={flexibleGridRows}
            columns={flexibleGridColumns}
            componentsToRender={flexibleGridComponents}
            backgroundColor="transparent"
            isDarkMode={isDarkMode}
            enableGlassmorphism
            cellBorderRadius={18}
          />
        </div>
      );
    }

    if (componentId === 'flexible-video') {
      return (
        <div style={flexibleVideoStageStyle}>
          <ModernFlexibleVideo
            customWidth={flexibleVideoCellWidth}
            customHeight={flexibleVideoCellHeight}
            rows={flexibleVideoRows}
            columns={flexibleVideoColumns}
            componentsToRender={flexibleVideoComponents}
            showAspect
            backgroundColor="transparent"
            Screenboard={scenarioId === 'screenboard' ? <AuditScreenboard isDarkMode={isDarkMode} /> : undefined}
            isDarkMode={isDarkMode}
            enableGlassmorphism
            cellBorderRadius={18}
          />
        </div>
      );
    }

    if (componentId === 'video-card') {
      return (
        <div style={cardStageStyle}>
          <ModernVideoCard
            name={videoCardParticipant.name}
            participant={videoCardParticipant}
            remoteProducerId="audit-video-producer"
            eventType="conference"
            forceFullDisplay={false}
            videoStream={null}
            parameters={cardParameters as React.ComponentProps<typeof ModernVideoCard>['parameters']}
            liveSubtitle={scenarioId === 'subtitle' ? {
              text: 'Quarterly roadmap update in progress.',
              language: 'en',
              timestamp: 1746400000000,
              expiresAt: 1746400060000,
              speakerId: videoCardParticipant.id ?? 'participant-video-card',
              speakerName: videoCardParticipant.name,
            } : null}
            showSubtitles
            backgroundColor={isDarkMode ? '#0f172a' : '#dbeafe'}
          />
        </div>
      );
    }

    if (componentId === 'audio-card') {
      return (
        <div style={cardStageStyle}>
          <ModernAudioCard
            name={audioCardParticipant.name}
            participant={audioCardParticipant}
            parameters={cardParameters as unknown as React.ComponentProps<typeof ModernAudioCard>['parameters']}
            imageSource={scenarioId === 'subtitle' ? 'https://mediasfu.com/images/logo192.png' : undefined}
            liveSubtitle={scenarioId === 'subtitle' ? {
              text: 'Caption stream synced to host audio.',
              language: 'en',
              timestamp: 1746400000000,
              expiresAt: 1746400060000,
              speakerId: audioCardParticipant.id ?? 'participant-audio-card',
              speakerName: audioCardParticipant.name,
            } : null}
            showSubtitles
          />
        </div>
      );
    }

    if (componentId === 'messages') {
      return (
        <div style={modalShellStyle}>
          <ModernMessagesModal
            isMessagesModalVisible
            onMessagesClose={noOp}
            messages={messagesFixture}
            eventType="conference"
            member="Host"
            islevel="2"
            coHostResponsibility={[]}
            coHost="Maya"
            startDirectMessage={scenarioId === 'direct'}
            directMessageDetails={directTarget}
            updateStartDirectMessage={noOp}
            updateDirectMessageDetails={noOp}
            roomName="audit-room"
            socket={auditSocket}
            chatSetting="allow"
            renderMode={messagesRenderMode}
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'participants') {
      return (
        <div style={modalShellStyle}>
          <ModernParticipantsModal
            isParticipantsModalVisible
            onParticipantsClose={noOp}
            onParticipantsFilterChange={noOp}
            participantsCounter={participantsFixture.length}
            parameters={participantsParameters}
            renderMode={participantsRenderMode}
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'permissions') {
      return (
        <div style={modalShellStyle}>
          <ModernPermissionsModal
            isPermissionsModalVisible
            onPermissionsClose={noOp}
            parameters={permissionsParameters}
            renderMode="modal"
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'panelists') {
      return (
        <div style={modalShellStyle}>
          <ModernPanelistsModal
            isPanelistsModalVisible
            onPanelistsClose={noOp}
            parameters={panelistsParameters}
            renderMode="modal"
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'poll') {
      return (
        <div style={modalShellStyle}>
          <ModernPollModal
            isPollModalVisible
            onClose={noOp}
            member="Host"
            islevel="2"
            polls={auditPolls as never}
            poll={auditPolls[0] as never}
            socket={auditSocket}
            roomName="audit-room"
            showAlert={noOp}
            updateIsPollModalVisible={noOp}
            handleCreatePoll={noOpAsyncVoid}
            handleEndPoll={noOpAsyncVoid}
            handleVotePoll={noOpAsyncVoid}
            renderMode="modal"
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'recording') {
      return (
        <div style={modalShellStyle}>
          <ModernRecordingModal
            isRecordingModalVisible
            onClose={noOp}
            confirmRecording={noOpAsyncVoid}
            startRecording={noOpAsyncVoid}
            parameters={recordingParameters}
            renderMode="modal"
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'translation') {
      return (
        <div style={modalShellStyle}>
          <ModernTranslationSettingsModal {...translationProps} />
        </div>
      );
    }

    if (componentId === 'event-settings') {
      return (
        <div style={modalShellStyle}>
          <ModernEventSettingsModal
            isEventSettingsModalVisible
            onEventSettingsClose={noOp}
            audioSetting="approval"
            videoSetting="approval"
            screenshareSetting="approval"
            chatSetting="allow"
            updateAudioSetting={noOp}
            updateVideoSetting={noOp}
            updateScreenshareSetting={noOp}
            updateChatSetting={noOp}
            updateIsSettingsModalVisible={noOp}
            roomName="audit-room"
            socket={auditSocket}
            showAlert={noOp}
            renderMode="modal"
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'media-settings') {
      return (
        <div style={modalShellStyle}>
          <ModernMediaSettingsModal
            isMediaSettingsModalVisible
            onMediaSettingsClose={noOp}
            parameters={mediaSettingsParameters}
            switchVideoOnPress={noOpAsyncVoid as never}
            switchAudioOnPress={noOpAsyncVoid as never}
            switchCameraOnPress={noOpAsyncVoid as never}
            renderMode="modal"
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'menu') {
      return (
        <div style={modalShellStyle}>
          <ModernMenuModal
            isVisible
            onClose={noOp}
            roomName="audit-room"
            adminPasscode="2468"
            islevel="2"
            eventType="conference"
            localLink="https://audits.mediasfu.com/rooms/audit-room"
            renderMode={scenarioId === 'sidebar' ? 'sidebar' : scenarioId === 'inline' ? 'inline' : 'modal'}
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'display-settings') {
      return (
        <div style={modalShellStyle}>
          <ModernDisplaySettingsModal
            isDisplaySettingsModalVisible
            onDisplaySettingsClose={noOp}
            parameters={displaySettingsParameters}
            renderMode={scenarioId === 'sidebar' ? 'sidebar' : scenarioId === 'inline' ? 'inline' : 'modal'}
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'requests') {
      return (
        <div style={modalShellStyle}>
          <ModernRequestsModal
            isRequestsModalVisible
            onRequestClose={noOp}
            requestCounter={requestsFixture.length}
            onRequestFilterChange={noOp}
            requestList={requestsFixture}
            updateRequestList={noOp}
            roomName="audit-room"
            socket={auditSocket}
            parameters={requestsParameters}
            renderMode={scenarioId === 'sidebar' ? 'sidebar' : 'modal'}
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'waiting') {
      return (
        <div style={modalShellStyle}>
          <ModernWaitingModal
            isWaitingModalVisible
            onWaitingRoomClose={noOp}
            waitingRoomCounter={waitingFixture.length}
            onWaitingRoomFilterChange={noOp}
            waitingRoomList={waitingFixture}
            updateWaitingList={noOp}
            roomName="audit-room"
            socket={auditSocket}
            parameters={waitingParameters}
            renderMode={scenarioId === 'sidebar' ? 'sidebar' : 'modal'}
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'share-event') {
      return (
        <div style={modalShellStyle}>
          <ModernShareEventModal
            isShareEventModalVisible
            onShareEventClose={noOp}
            roomName="audit-room"
            adminPasscode="2468"
            islevel="2"
            eventType="conference"
            localLink="https://audits.mediasfu.com/rooms/audit-room"
            shareButtons
            renderMode={scenarioId === 'sidebar' ? 'sidebar' : scenarioId === 'inline' ? 'inline' : 'modal'}
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'confirm-exit') {
      return (
        <div style={modalShellStyle}>
          <ModernConfirmExitModal
            isConfirmExitModalVisible
            onConfirmExitClose={noOp}
            member="Host"
            roomName="audit-room"
            socket={auditSocket}
            islevel={scenarioId === 'guest' ? '0' : '2'}
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'confirm-here') {
      return (
        <div style={modalShellStyle}>
          <ModernConfirmHereModal
            isConfirmHereModalVisible
            onConfirmHereClose={noOp}
            countdownDuration={120}
            socket={auditSocket}
            roomName="audit-room"
            member="Host"
            position="center"
            onTimeout={noOp}
            onSuppressConfirmHere={noOp}
            isDarkMode={isDarkMode}
          />
        </div>
      );
    }

    if (componentId === 'prejoin') {
      return (
        <ModernPreJoinPage
          key={`${componentId}-${scenarioId}-${theme}-${viewport}`}
          parameters={preJoinParameters}
          credentials={credentials}
          returnUI
          isDarkMode={isDarkMode}
        />
      );
    }

    return (
      <ModernWelcomePage
        key={`${componentId}-${scenarioId}-${theme}-${viewport}`}
        parameters={welcomeParameters}
        entryShellLayout={scenarioId === 'split' ? 'split' : 'inline'}
        isDarkMode={isDarkMode}
      />
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: hideChrome ? 'block' : 'grid',
        gridTemplateColumns: hideChrome ? undefined : '320px minmax(0, 1fr)',
        background: stageBackground,
        color: isDarkMode ? '#e2e8f0' : '#0f172a',
      }}
    >
      {!hideChrome && (
        <aside style={controlsStyle(isDarkMode)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(147, 197, 253, 0.9)' }}>
              React Modern UI Audit
            </p>
            <h1 style={{ margin: 0, fontSize: '1.8rem', lineHeight: 1.1 }}>Deterministic parity harness</h1>
            <p style={{ margin: 0, lineHeight: 1.6, color: isDarkMode ? 'rgba(226,232,240,0.74)' : 'rgba(51,65,85,0.82)' }}>
              Use this page to render one modern element at a time with stable query-driven scenarios.
            </p>
          </div>

          <label style={fieldGroupStyle}>
            <span>Component</span>
            <select value={componentId} onChange={(event) => setComponentId(event.target.value as ComponentId)} style={selectStyle(isDarkMode)}>
              {Object.entries(componentRegistry).map(([id, option]) => (
                <option key={id} value={id}>{option.label}</option>
              ))}
            </select>
          </label>

          <label style={fieldGroupStyle}>
            <span>Scenario</span>
            <select value={scenarioId} onChange={(event) => setScenarioId(event.target.value)} style={selectStyle(isDarkMode)}>
              {scenarioOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </label>

          <label style={fieldGroupStyle}>
            <span>Theme</span>
            <select value={theme} onChange={(event) => setTheme(event.target.value as ThemeId)} style={selectStyle(isDarkMode)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>

          <label style={fieldGroupStyle}>
            <span>Viewport</span>
            <select value={viewport} onChange={(event) => setViewport(event.target.value as ViewportId)} style={selectStyle(isDarkMode)}>
              <option value="desktop">Desktop 1440x900</option>
              <option value="mobile">Mobile 390x844</option>
            </select>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem' }}>
            <input type="checkbox" checked={hideChrome} onChange={(event) => setHideChrome(event.target.checked)} />
            <span>Hide controls for capture</span>
          </label>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.78rem' }}>
            <span>Query</span>
            <code style={{ display: 'block', padding: 12, borderRadius: 14, background: isDarkMode ? 'rgba(15,23,42,0.72)' : 'rgba(226,232,240,0.92)', color: isDarkMode ? '#bfdbfe' : '#1d4ed8', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {queryPreview}
            </code>
          </div>
        </aside>
      )}

      <main style={{ padding: 28, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div
          id="audit-preview"
          ref={previewRef}
          style={{
            ...viewportStyle,
            borderRadius: 28,
            overflow: 'hidden',
            background: isDarkMode
              ? 'radial-gradient(circle at top left, rgba(99,102,241,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(6,182,212,0.14), transparent 28%), #081120'
              : 'radial-gradient(circle at top left, rgba(99,102,241,0.12), transparent 24%), radial-gradient(circle at bottom right, rgba(14,165,233,0.1), transparent 30%), #eef4ff',
            boxShadow: '0 28px 80px rgba(2,8,23,0.34)',
            border: isDarkMode ? '1px solid rgba(148,163,184,0.16)' : '1px solid rgba(148,163,184,0.28)',
          }}
        >
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const controlsStyle = (isDarkMode: boolean): React.CSSProperties => ({
  position: 'sticky',
  top: 0,
  height: '100vh',
  padding: '28px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  background: isDarkMode ? 'rgba(3,7,18,0.84)' : 'rgba(255,255,255,0.82)',
  borderRight: `1px solid ${isDarkMode ? 'rgba(148,163,184,0.18)' : 'rgba(148,163,184,0.26)'}`,
  backdropFilter: 'blur(18px)',
});

const fieldGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  fontSize: '0.84rem',
  fontWeight: 700,
};

const selectStyle = (isDarkMode: boolean): React.CSSProperties => ({
  minHeight: 44,
  borderRadius: 14,
  border: '1px solid rgba(148,163,184,0.22)',
  background: isDarkMode ? 'rgba(15,23,42,0.56)' : 'rgba(255,255,255,0.82)',
  color: isDarkMode ? '#e2e8f0' : '#0f172a',
  padding: '0 14px',
});

const exampleCardStyle = (isDarkMode: boolean): React.CSSProperties => ({
  width: 'min(100%, 540px)',
  margin: '72px auto',
  padding: 32,
  borderRadius: 28,
  background: isDarkMode ? 'rgba(15, 27, 49, 0.9)' : 'rgba(255, 255, 255, 0.96)',
  border: `1px solid ${isDarkMode ? 'rgba(96,165,250,0.32)' : 'rgba(59,130,246,0.28)'}`,
  boxShadow: isDarkMode ? '0 24px 60px rgba(2,8,23,0.3)' : '0 28px 64px rgba(148,163,184,0.28)',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

const kickerStyle = (isDarkMode: boolean): React.CSSProperties => ({
  margin: 0,
  fontSize: '0.74rem',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: isDarkMode ? 'rgba(148,163,184,0.9)' : 'rgba(100,116,139,0.9)',
});

const titleStyle = (isDarkMode: boolean): React.CSSProperties => ({
  margin: 0,
  color: isDarkMode ? '#f8fafc' : '#0f172a',
  fontSize: '2rem',
  lineHeight: 1.05,
});

const copyStyle = (isDarkMode: boolean): React.CSSProperties => ({
  margin: 0,
  color: isDarkMode ? 'rgba(226,232,240,0.78)' : 'rgba(51,65,85,0.82)',
  lineHeight: 1.65,
});

const modalShellStyle: React.CSSProperties = {
  minHeight: '100%',
  padding: 32,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'stretch',
};

export default ModernUIParityAudit;