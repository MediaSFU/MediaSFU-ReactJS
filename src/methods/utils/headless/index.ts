/**
 * Headless helpers for `returnUI={false}` integrations.
 *
 * These exist because every headless consumer was re-deriving the same handful
 * of rules from the raw parameter bag, and getting them subtly wrong in ways
 * that only show up on a live call: a host whose video vanishes when the SDK
 * moves their stream to `oldAllStreams`, participants who are silently
 * inaudible because the audio element list was truncated, a self-view showing
 * the unprocessed camera when a virtual background is on, or a tab that locks
 * because `getUpdatedAllParams()` was called from a click handler.
 *
 * Start with {@link useMediasfuHeadless}; reach for the individual helpers when
 * you need finer control.
 */
export * from './headlessTypes';
export * from './getRoomReadiness';
export * from './getMediaStreams';
export * from './getCurrentParams';
export * from './roomActions';
export * from './participantState';
export * from './mediaPermissions';
export * from './moderation';
export * from './sessionFeatures';
export * from './sessionExtras';
export * from './virtualBackground';
export * from './sessionControls';
export * from './playback';
export * from './viewerSession';
export * from './mediaProduction';
export * from './useMediasfuHeadless';
