/**
 * MediaSFU Modern Components
 *
 * This module exports all modern UI components for the MediaSFU SDK.
 * Modern components provide a premium, polished look with:
 * - Glassmorphism effects
 * - Gradient backgrounds
 * - Smooth animations
 * - Light and dark mode support
 *
 * ## Quick Start
 *
 * Import modern components:
 * ```tsx
 * import { ModernMediasfuGeneric } from 'mediasfu-reactjs';
 * // or
 * import { MediasfuColors, GlassmorphicContainer, PremiumButton } from 'mediasfu-reactjs/components_modern';
 * ```
 *
 * ## Choosing Classic vs Modern
 *
 * ### Classic Components (default)
 * - Simpler, flat design
 * - Lighter resource usage
 * - Maximum compatibility
 *
 * ### Modern Components
 * - Premium glassmorphism effects
 * - Animated gradients
 * - Enhanced visual feedback
 * - Dark/light mode optimized
 *
 * ## Usage
 *
 * ```tsx
 * // Use modern entry point
 * import { ModernMediasfuGeneric } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <ModernMediasfuGeneric
 *       PrejoinPage={WelcomePage}
 *       credentials={{ apiUserName: "user", apiKey: "key" }}
 *     />
 *   );
 * }
 * ```
 */

// Export core theme system
export * from './core';

// Export display components
export * from './display_components';

// Export participants components
export * from './participants_components';

// Export message components
export * from './message_components';

// Export recording components
export * from './recording_components';

// Export menu components
export * from './menu_components';

// Export media settings components
export * from './media_settings_components';

// Export display settings components
export * from './display_settings_components';

// Export event settings components
export * from './event_settings_components';

// Export requests components
export * from './requests_components';

// Export waiting components
export * from './waiting_components';

// Export co-host components
export * from './co_host_components';

// Export exit components
export * from './exit_components';

// Export polls components
export * from './polls_components';

// Export breakout components
export * from './breakout_components';

// Export background components
export * from './background_components';

// Export whiteboard components
export * from './whiteboard_components';

// Export misc components
export * from './misc_components';

// Export mediasfu main components
export * from './mediasfu_components';

// Export animation keyframes CSS injection utility
export { injectModernAnimations } from './utils/injectAnimations';


