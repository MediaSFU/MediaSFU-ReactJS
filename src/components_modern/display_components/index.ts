/**
 * Modern Display Components Module
 *
 * This module exports all modern display components for the MediaSFU UI system.
 * These components provide premium styling with glassmorphic effects, animations,
 * and dark mode support.
 *
 * @example
 * ```tsx
 * import {
 *   ModernLoadingModal,
 *   ModernAlertComponent,
 *   ModernMiniCard,
 *   ModernControlButtonsComponent,
 *   ModernVideoCard,
 *   ModernAudioCard,
 *   ModernFlexibleGrid,
 *   ModernPagination,
 * } from './components_modern/display_components';
 * ```
 */

// Loading & Progress
export { ModernLoadingModal } from './ModernLoadingModal';
export type { ModernLoadingModalOptions, ModernLoadingModalProps } from './ModernLoadingModal';

export { ModernMeetingProgressTimer } from './ModernMeetingProgressTimer';
export type { ModernMeetingProgressTimerOptions, ModernMeetingProgressTimerType } from './ModernMeetingProgressTimer';

// Alerts & Notifications
export { ModernAlertComponent } from './ModernAlertComponent';
export type { 
  ModernAlertComponentOptions, 
  ModernAlertComponentProps, 
  AlertType
} from './ModernAlertComponent';

// Cards & Avatars
export { ModernMiniCard } from './ModernMiniCard';
export type { ModernMiniCardOptions, ModernMiniCardType } from './ModernMiniCard';

export { ModernVideoCard } from './ModernVideoCard';
export type { ModernVideoCardOptions, ModernVideoCardType } from './ModernVideoCard';

export { ModernAudioCard } from './ModernAudioCard';
export type { ModernAudioCardOptions, ModernAudioCardType } from './ModernAudioCard';

// Control Components
export { ModernControlButtonsComponent } from './ModernControlButtonsComponent';
export type { 
  ModernControlButtonsComponentOptions, 
  ModernControlButtonsComponentProps,
  ControlButton,
} from './ModernControlButtonsComponent';

// Grid & Layout
export { ModernFlexibleGrid } from './ModernFlexibleGrid';
export type { ModernFlexibleGridOptions, ModernFlexibleGridType } from './ModernFlexibleGrid';

export { ModernFlexibleVideo } from './ModernFlexibleVideo';
export type { ModernFlexibleVideoOptions, ModernFlexibleVideoType } from './ModernFlexibleVideo';

export { ModernMainContainerComponent } from './ModernMainContainerComponent';
export type { ModernMainContainerComponentOptions, ModernMainContainerComponentType } from './ModernMainContainerComponent';

// Navigation
export { ModernPagination } from './ModernPagination';
export type { ModernPaginationOptions, ModernPaginationType } from './ModernPagination';
