/**
 * Utility to inject critical MediaSFU styles that must be present for proper component rendering.
 * 
 * This auto-injects the essential button container styles so consumers don't need to 
 * manually import the CSS file. The full main.css is still available for optional import
 * if users want additional styling.
 */

let injected = false;

/**
 * Critical CSS styles for MediaSFU control buttons and containers.
 * These are the minimal styles required for proper button rendering in SubAspect.
 */
const CRITICAL_STYLES = `
/* MediaSFU Critical Styles - Auto-injected */

/* Main container - full viewport */
.mediasfu-main-container {
  position: relative;
  overflow: hidden;
}

/* Sub-aspect container - fixed at bottom for control buttons */
.mediasfu-sub-aspect {
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100% !important;
  margin: 0 !important;
  z-index: 10;
}

.mediasfu-sub-aspect--visible {
  display: flex !important;
}

.mediasfu-sub-aspect--hidden {
  display: none !important;
}

/* Control buttons container */
.mediasfu-container {
  display: flex;
  width: 100%;
  flex-direction: row;
  margin-top: 0px;
}

.mediasfu-container .buttonContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 5px;
  margin-right: 4px;
  font-size: medium;
  border: none;
}

.mediasfu-container .buttonContainer:hover {
  cursor: pointer;
}

.mediasfu-container .verticalButton {
  flex-direction: column;
}

.mediasfu-container .buttonText {
  font-size: 12px;
  margin-top: 5px;
}

.mediasfu-customButtonsContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: left;
}

.mediasfu-customButtonsContainer .customButton {
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  background-color: transparent;
  align-items: left;
  justify-content: left;
  border: none;
}

.mediasfu-customButtonsContainer .buttonContent {
  display: flex;
  align-items: left;
  justify-content: left;
}

.mediasfu-customButtonsContainer .customButtonIcon {
  font-size: 20px;
  color: #000000;
  margin-right: 4px;
}

.mediasfu-customButtonsContainer .customButtonText {
  color: #000000;
}
`;

/**
 * Injects critical MediaSFU styles into the document head.
 * This function is idempotent - calling it multiple times will only inject styles once.
 */
export function injectCriticalStyles(): void {
  if (injected || typeof document === 'undefined') {
    return;
  }

  const styleId = 'mediasfu-critical-styles';

  // Check if already injected
  if (document.getElementById(styleId)) {
    injected = true;
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = CRITICAL_STYLES;

  document.head.appendChild(styleElement);
  injected = true;
}

/**
 * Hook to inject critical styles on module load.
 */
export function useInjectCriticalStyles(): void {
  if (typeof window !== 'undefined') {
    injectCriticalStyles();
  }
}

// Auto-inject when this module is imported
if (typeof window !== 'undefined') {
  injectCriticalStyles();
}

export default injectCriticalStyles;
