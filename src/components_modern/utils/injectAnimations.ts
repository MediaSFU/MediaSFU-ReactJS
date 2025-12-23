/**
 * Utility to inject modern animation keyframes into the document.
 *
 * This ensures all required CSS keyframe animations are available
 * for the modern components to use.
 */

import { MediasfuAnimations } from '../core/theme';

let injected = false;

/**
 * Injects all required CSS keyframe animations for modern components.
 * This function is idempotent - calling it multiple times will only
 * inject the styles once.
 */
export function injectModernAnimations(): void {
  if (injected || typeof document === 'undefined') {
    return;
  }

  const styleId = 'mediasfu-modern-animations';

  // Check if already injected
  if (document.getElementById(styleId)) {
    injected = true;
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = MediasfuAnimations.getAllKeyframes();

  document.head.appendChild(styleElement);
  injected = true;
}

/**
 * Hook to inject animations on component mount.
 * Can be used in any component that needs animations.
 */
export function useInjectAnimations(): void {
  if (typeof window !== 'undefined') {
    injectModernAnimations();
  }
}

export default injectModernAnimations;
