/**
 * useSidebarState - Hook for managing desktop sidebar state
 *
 * Provides state management for the desktop sidebar, including:
 * - Active content tracking
 * - Navigation stack for back navigation
 * - Toggle and close functionality
 * - Screen size detection for sidebar availability
 *
 * @module useSidebarState
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { SidebarContent } from '../types/ModalRenderMode';

export interface UseSidebarStateOptions {
  /** Minimum screen width for sidebar (default: 1200) */
  minWidth?: number;
  /** Initial active content */
  initialContent?: SidebarContent;
}

export interface UseSidebarStateReturn {
  /** Current active sidebar content */
  activeSidebarContent: SidebarContent;
  /** Navigation stack for back navigation */
  sidebarNavigationStack: SidebarContent[];
  /** Update active sidebar content */
  updateActiveSidebarContent: (content: SidebarContent, pushToStack?: boolean) => void;
  /** Navigate back in sidebar stack */
  sidebarNavigateBack: () => void;
  /** Close sidebar completely */
  closeSidebar: () => void;
  /** Check if sidebar should be used */
  shouldUseSidebar: boolean;
  /** Get sidebar width based on screen size */
  getSidebarWidth: (screenWidth: number) => number;
  /** Get effective content width accounting for sidebar */
  getEffectiveContentWidth: (screenWidth: number) => number;
  /** Check if sidebar is open */
  isSidebarOpen: boolean;
}

/**
 * Custom hook for managing desktop sidebar state
 *
 * @example
 * ```tsx
 * const {
 *   activeSidebarContent,
 *   updateActiveSidebarContent,
 *   shouldUseSidebar,
 *   getSidebarWidth,
 * } = useSidebarState({ minWidth: 1200 });
 *
 * // Open participants in sidebar
 * updateActiveSidebarContent('participants');
 *
 * // Navigate from menu to sub-content with back support
 * updateActiveSidebarContent('messages', true);
 * ```
 */
export const useSidebarState = (
  options: UseSidebarStateOptions = {}
): UseSidebarStateReturn => {
  const { minWidth = 1200, initialContent = 'none' } = options;

  const [activeSidebarContent, setActiveSidebarContent] = useState<SidebarContent>(initialContent);
  const [sidebarNavigationStack, setSidebarNavigationStack] = useState<SidebarContent[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  // Track window width for sidebar availability
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine if sidebar should be used based on screen size
  const shouldUseSidebar = useMemo(() => {
    return windowWidth >= minWidth;
  }, [windowWidth, minWidth]);

  // Check if sidebar is currently open
  const isSidebarOpen = useMemo(() => {
    return activeSidebarContent !== 'none';
  }, [activeSidebarContent]);

  // Update active sidebar content with optional stack management
  const updateActiveSidebarContent = useCallback(
    (content: SidebarContent, pushToStack = false) => {
      // Toggle off if same content is selected
      if (activeSidebarContent === content) {
        setActiveSidebarContent('none');
        setSidebarNavigationStack([]);
      } else {
        // If pushing to stack (navigating from menu to sub-content), save current
        if (pushToStack && activeSidebarContent !== 'none') {
          setSidebarNavigationStack((prev) => [...prev, activeSidebarContent]);
        } else if (!pushToStack) {
          // Direct navigation - clear stack
          setSidebarNavigationStack([]);
        }
        setActiveSidebarContent(content);
      }
    },
    [activeSidebarContent]
  );

  // Navigate back in sidebar stack
  const sidebarNavigateBack = useCallback(() => {
    if (sidebarNavigationStack.length > 0) {
      const stack = [...sidebarNavigationStack];
      const previousContent = stack.pop()!;
      setSidebarNavigationStack(stack);
      setActiveSidebarContent(previousContent);
    } else {
      setActiveSidebarContent('none');
    }
  }, [sidebarNavigationStack]);

  // Close sidebar completely
  const closeSidebar = useCallback(() => {
    setActiveSidebarContent('none');
    setSidebarNavigationStack([]);
  }, []);

  // Calculate sidebar width based on screen size
  const getSidebarWidth = useCallback(
    (screenWidth: number): number => {
      if (!shouldUseSidebar || activeSidebarContent === 'none') {
        return 0;
      }
      const calculatedWidth = screenWidth * 0.2;
      if (calculatedWidth < 280) return 280;
      if (calculatedWidth > 420) return 420;
      return calculatedWidth;
    },
    [shouldUseSidebar, activeSidebarContent]
  );

  // Get effective content width accounting for sidebar
  const getEffectiveContentWidth = useCallback(
    (screenWidth: number): number => {
      return screenWidth - getSidebarWidth(screenWidth);
    },
    [getSidebarWidth]
  );

  return {
    activeSidebarContent,
    sidebarNavigationStack,
    updateActiveSidebarContent,
    sidebarNavigateBack,
    closeSidebar,
    shouldUseSidebar,
    getSidebarWidth,
    getEffectiveContentWidth,
    isSidebarOpen,
  };
};

export default useSidebarState;
