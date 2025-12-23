/**
 * ModalRenderMode - Render modes for modal components.
 *
 * Defines how modal content should be rendered based on context:
 * - `modal`: Traditional overlay modal with positioning, header, and close button
 * - `sidebar`: Inline content for desktop sidebar (no overlay, no header, full width)
 * - `inline`: Embedded content without modal wrapper (no positioning)
 *
 * @module ModalRenderMode
 */

/**
 * Render mode for modal components.
 */
export type ModalRenderMode = 'modal' | 'sidebar' | 'inline';

/**
 * Enum to track which content is displayed in the desktop sidebar
 */
export type SidebarContent =
  | 'none'
  | 'menu'
  | 'participants'
  | 'messages'
  | 'requests'
  | 'waiting'
  | 'coHost'
  | 'mediaSettings'
  | 'displaySettings'
  | 'eventSettings'
  | 'recording'
  | 'polls'
  | 'breakoutRooms'
  | 'shareEvent'
  | 'configureWhiteboard'
  | 'background';

/**
 * Default render mode constants
 */
export const DEFAULT_RENDER_MODE: ModalRenderMode = 'modal';
export const SIDEBAR_RENDER_MODE: ModalRenderMode = 'sidebar';
export const INLINE_RENDER_MODE: ModalRenderMode = 'inline';

/**
 * Hook to determine render mode based on screen size
 * @param isDesktopSidebar - Whether sidebar mode should be used on desktop
 * @returns The appropriate render mode
 */
export const getRenderModeForContext = (
  isDesktopSidebar: boolean
): ModalRenderMode => {
  return isDesktopSidebar ? 'sidebar' : 'modal';
};
