/**
 * Override Helpers for MediaSFU UI Customization
 *
 * Provides utilities to selectively replace or wrap MediaSFU components and functions
 * without touching core logic. These helpers power the uiOverrides system.
 *
 * @module overrideHelpers
 *
 * @example
 * // Override a component via render function
 * ```tsx
 * const mainContainerOverride: CustomComponentOverride<MainContainerProps> = {
 *   render: (props) => (
 *     <div style={{ border: "4px dashed purple", borderRadius: 28, padding: 16 }}>
 *       <MainContainerComponent {...props} />
 *     </div>
 *   ),
 * };
 * const EnhancedMainContainer = withOverride(mainContainerOverride, MainContainerComponent);
 * ```
 *
 * @example
 * // Override a function to add analytics
 * ```tsx
 * const resumeOverride: CustomFunctionOverride<typeof consumerResume> = {
 *   wrap: (original) => async (params) => {
 *     const start = performance.now();
 *     const result = await original(params);
 *     analytics.track("consumer_resume", { durationMs: performance.now() - start });
 *     return result;
 *   },
 * };
 * const wrappedResume = withFunctionOverride(resumeOverride, consumerResume);
 * ```
 */

import React from 'react';
import type { CustomComponentOverride, CustomFunctionOverride } from '../../@types/types';

/**
 * Renders a component with optional override.
 *
 * @template Props - Component props type
 * @param {CustomComponentOverride<Props>} override - Override definition (render or component)
 * @param {React.ComponentType<Props>} DefaultComponent - Fallback component
 * @param {Props} props - Props to forward
 * @returns {React.ReactNode} - Rendered component
 */
export const renderWithOverride = <Props extends object>(
  override: CustomComponentOverride<Props> | undefined,
  DefaultComponent: React.ComponentType<Props>,
  props: Props
): React.ReactNode => {
  if (!override) {
    return <DefaultComponent {...props} />;
  }

  if (override.render) {
    return override.render(props);
  }

  if (override.component) {
    const OverrideComponent = override.component;
    return <OverrideComponent {...props} />;
  }

  return <DefaultComponent {...props} />;
};

/**
 * Wraps a component with override support for use in useMemo.
 *
 * @template Props - Component props type
 * @param {CustomComponentOverride<Props>} override - Override definition
 * @param {React.ComponentType<Props>} DefaultComponent - Default component
 * @returns {React.ComponentType<Props>} - Wrapped component
 *
 * @example
 * ```tsx
 * const MainContainer = useMemo(
 *   () => withOverride(uiOverrides?.mainContainer, MainContainerComponent),
 *   [uiOverrides?.mainContainer]
 * );
 * ```
 */
export const withOverride = <Props extends object>(
  override: CustomComponentOverride<Props> | undefined,
  DefaultComponent: React.ComponentType<Props>
): React.ComponentType<Props> => {
  const OverrideWrapper: React.FC<Props> = (props) => {
    return <>{renderWithOverride(override, DefaultComponent, props)}</>;
  };

  OverrideWrapper.displayName = `WithOverride(${DefaultComponent.displayName || DefaultComponent.name || 'Component'})`;

  return OverrideWrapper;
};

/**
 * Wraps a function with override support (replacement or interception).
 *
 * @template Fn - Function signature
 * @param {CustomFunctionOverride<Fn>} override - Override definition (wrap or implementation)
 * @param {Fn} defaultImplementation - Default function
 * @returns {Fn} - Wrapped or replaced function
 *
 * @example
 * ```tsx
 * const consumerResumeFn = useMemo(
 *   () => withFunctionOverride(uiOverrides?.consumerResume, consumerResume),
 *   [uiOverrides?.consumerResume]
 * );
 * ```
 */
export const withFunctionOverride = <Fn extends (...args: any[]) => any>(
  override: CustomFunctionOverride<Fn> | undefined,
  defaultImplementation: Fn
): Fn => {
  if (!override) {
    return defaultImplementation;
  }

  if (override.wrap) {
    return override.wrap(defaultImplementation);
  }

  if (override.implementation) {
    return override.implementation;
  }

  return defaultImplementation;
};
