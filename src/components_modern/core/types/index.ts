/**
 * Core Types Module
 *
 * This module exports core type definitions for the MediaSFU Modern UI system.
 * Note: ModalRenderMode is exported from the classic MenuModal component to avoid
 * duplicate exports. Import it from there or from @types/types.
 *
 * @module types
 */

export type { SidebarContent } from './ModalRenderMode';
export {
  DEFAULT_RENDER_MODE,
  SIDEBAR_RENDER_MODE,
  INLINE_RENDER_MODE,
  getRenderModeForContext,
} from './ModalRenderMode';
