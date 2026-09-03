import React from "react";

/**
 * The published state contract produced by a ModernMediasfuGeneric room
 * engine. Keep this structural: applications can retain their strongly typed
 * room bag while this renderer only requires the pure reader and UI factory.
 */
export type ModernMediasfuGenericHeadParameters = Record<string, any> & {
  getCurrentParams?: () => ModernMediasfuGenericHeadParameters;
  renderModernMediasfuUI?: () => React.ReactElement;
};

export type ModernMediasfuGenericHeadOptions = {
  /** Latest parameter bag published by the existing headless room engine. */
  parameters: ModernMediasfuGenericHeadParameters;
};

/**
 * Renders the exact ModernMediasfuGeneric component tree from one existing
 * room engine. The engine remains the sole owner of sockets, media, state,
 * modal visibility and sidebar navigation.
 *
 * Mount the engine with `returnUI={false}` and `renderUIExternally`, publish its
 * parameter bag through `updateSourceParameters`, then pass that bag here.
 * This component performs a pure read; it never calls getUpdatedAllParams.
 */
const ModernMediasfuGenericHead: React.FC<ModernMediasfuGenericHeadOptions> = ({
  parameters,
}) => {
  const current = parameters.getCurrentParams?.() ?? parameters;
  const renderUI = current.renderModernMediasfuUI;

  if (typeof renderUI !== "function") {
    return null;
  }

  return renderUI();
};

export default ModernMediasfuGenericHead;
