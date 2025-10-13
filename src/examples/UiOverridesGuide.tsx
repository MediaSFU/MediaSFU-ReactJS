import React from 'react';

/**
 * UiOverridesGuide
 *
 * This component renders a documentation-style page that explains how to work with
 * MediaSFU's UI override system, custom cards, and utility hooks. It is meant to
 * live alongside the demo apps (`App.tsx`, `AppUnique.tsx`) so that developers can
 * quickly copy snippets into their projects.
 */
const UiOverridesGuide: React.FC = () => {
  const cardOverridesSnippet = `// src/App.tsx (excerpt)
const customCards = {
  customVideoCard: ShowcaseVideoCard,
  customAudioCard: ShowcaseAudioCard,
  customMiniCard: ShowcaseMiniCard,
};

<MediasfuGeneric
  credentials={credentials}
  {...customCards}
/>;`;

  const videoCardWrapperSnippet = `const ShowcaseVideoCard: CustomVideoCardType = ({
  eventType,
  customStyle,
  ...props
}) => (
  <VideoCard
    {...props}
    eventType={eventType}
    customStyle={{
      borderRadius: 20,
      border: eventType === 'broadcast' ? '0 solid transparent' : '3px solid #4f46e5',
      boxShadow: '0 28px 65px rgba(76, 29, 149, 0.35)',
      ...customStyle,
    }}
  />
);`;

  const uiOverridesSnippet = `const uiOverrides: MediasfuUICustomOverrides = {
  mainContainer: { component: EnhancedMainContainer },
  pagination: { component: EnhancedPagination },
  alert: { component: EnhancedAlert },
  menuModal: { component: FrostedMenuModal },
  participantsModal: { component: NeonParticipantsModal },
};

<MediasfuGeneric uiOverrides={uiOverrides} />;`;

  const functionOverrideSnippet = `// Example: overriding addVideosGrid behaviour
const uiOverrides: MediasfuUICustomOverrides = {
  functions: {
    addVideosGrid: async (overrideOptions, next) => {
      const { parameters } = overrideOptions;

      // Call the default implementation first
      await next(overrideOptions);

      // Then decorate the grid
      const updated = parameters.getUpdatedAllParams();
      console.log('Grid updated with', updated.otherGridStreams.length, 'rows');
    },
  },
};`;

  const tips = [
    'Flip the booleans in `AppUnique.tsx` (e.g. `enableCardBuilders`, `enableUICoreOverrides`) to see overrides in action.',
    'Wrapper components should always pass `parameters` through to the base MediaSFU component so built-in logic remains intact.',
    'Use `customStyle`, `containerProps`, and overlay props to layer on gradients, borders, or layout tweaks without reimplementing MediaSFU internals.',
    'Function overrides receive a `next` callback—always call it unless you intend to replace the default logic entirely.',
    'When you need full control, provide a `customComponent` and drive the session with `parameters`, as illustrated in `CustomMediaSFUExample.tsx`.',
  ];

  const sections: Array<{ title: string; description: React.ReactNode; code?: string }> = [
    {
      title: '1. Quick-start: drop-in cards',
      description: (
        <>
          <p>
            Both <code>App.tsx</code> and <code>AppUnique.tsx</code> export ready-to-use card wrappers that
            demonstrate how to re-skin the stock <code>VideoCard</code>, <code>AudioCard</code>, and <code>MiniCard</code>.
            Import them or copy the pattern into your own project, then spread them into any
            <code>MediasfuGeneric</code>-derived experience.
          </p>
        </>
      ),
      code: cardOverridesSnippet,
    },
    {
      title: '2. Card wrapper essentials',
      description: (
        <>
          <p>
            Wrappers receive the exact same options as the base components. Keep the defaults working by
            forwarding <code>parameters</code>, <code>eventType</code>, and stream props. From there, lean on CSS
            props (gradients, border radii, overlays) instead of rewriting controls or info bars.
          </p>
          <p>
            <code>App.tsx</code> focuses on gradient and glassmorphism tweaks, whereas <code>AppUnique.tsx</code>
            shows how to combine wrappers with override toggles for multiple experiences.
          </p>
        </>
      ),
      code: videoCardWrapperSnippet,
    },
    {
      title: '3. Layout & modal overrides',
      description: (
        <>
          <p>
            The <code>uiOverrides</code> prop wires replacement components into MediaSFU&apos;s shell. Supply React
            components under keys such as <code>mainContainer</code>, <code>pagination</code>, or modal names to
            replace the visuals while retaining internal behaviour.
          </p>
          <p>
            See <code>AppUnique.tsx</code> for variants like <code>EnhancedMainContainer</code> and
            <code>FrostedMenuModal</code>. Each override receives the same props as the original component,
            so you can wrap the stock implementation or render something new.
          </p>
        </>
      ),
      code: uiOverridesSnippet,
    },
    {
      title: '4. Function overrides & pipelines',
      description: (
        <>
          <p>
            Advanced scenarios can hook into the UI pipeline via the <code>functions</code> namespace inside
            <code>uiOverrides</code>. This mirrors how <code>addVideosGrid</code> and <code>prepopulateUserMedia</code>
            now respect custom cards: call <code>next</code> to run the default logic, then mutate or inspect the
            result using <code>parameters.getUpdatedAllParams()</code>.
          </p>
        </>
      ),
      code: functionOverrideSnippet,
    },
    {
      title: '5. Full custom workspaces',
      description: (
        <>
          <p>
            When you need an entirely bespoke interface, set <code>returnUI</code> to <code>false</code> and
            pass a <code>customComponent</code>. The <code>CustomMediaSFUExample.tsx</code> file illustrates how to
            create a tabbed dashboard that drives MediaSFU via <code>parameters.clickVideo</code>,
            <code>parameters.clickAudio</code>, and friends.
          </p>
        </>
      ),
    },
  ];

  return (
    <div
      style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '48px 32px 96px',
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
        lineHeight: 1.6,
        color: '#0f172a',
      }}
    >
      <header style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>MediaSFU UI Overrides &amp; Customization Guide</h1>
        <p style={{ margin: 0, maxWidth: 720 }}>
          Use this page as a living reference for the override patterns showcased in <code>App.tsx</code> and
          <code>AppUnique.tsx</code>. Copy snippets, flip the toggles, and combine overrides to deliver branded
          MediaSFU experiences without forking the SDK.
        </p>
      </header>

      {sections.map(({ title, description, code }) => (
        <section key={title} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>{title}</h2>
          {description}
          {code && (
            <pre
              style={{
                marginTop: 16,
                background: '#0f172a',
                color: '#e2e8f0',
                padding: 20,
                borderRadius: 16,
                overflowX: 'auto',
              }}
            >
              <code>{code}</code>
            </pre>
          )}
        </section>
      ))}

      <section style={{ marginTop: 56 }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Practical tips</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {tips.map((tip) => (
            <li key={tip} style={{ marginBottom: 8 }}>{tip}</li>
          ))}
        </ul>
      </section>

      <footer style={{ marginTop: 64, fontSize: 14, opacity: 0.7 }}>
        <p>
          Looking for a starting point? Run <code>AppUnique.tsx</code> and experiment with the toggle constants
          at the top of the file. Every override in this guide can be mixed-and-matched from that playground.
        </p>
      </footer>
    </div>
  );
};

export default UiOverridesGuide;
