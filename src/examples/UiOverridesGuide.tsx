import React, { type CSSProperties } from 'react';

/**
 * UiOverridesGuide
 *
 * This component renders a documentation-style page that explains how to work with
 * MediaSFU's UI override system, custom cards, and utility hooks. It is meant to
 * live alongside the demo apps (`App.tsx`, `AppUnique.tsx`) so that developers can
 * quickly copy snippets into their projects.
 */
const docsLinks = {
  overview: 'https://mediasfu.com/docs/',
  chooseUiMode: 'https://mediasfu.com/docs/usage/choose-ui-mode',
  uiOverrides: 'https://mediasfu.com/docs/usage/ui-overrides',
  customComponent: 'https://mediasfu.com/docs/usage/custom-component',
  reactGuide: 'https://mediasfu.com/docs/sdks/reactjs',
};

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  background: 'linear-gradient(180deg, #03111d 0%, #082033 38%, #0a2f40 100%)',
  color: '#e6f2fb',
};

const shellStyle: CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto',
  padding: '48px 32px 96px',
  fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
  lineHeight: 1.6,
};

const badgeRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  marginBottom: 18,
};

const badgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 12px',
  borderRadius: 999,
  background: 'rgba(113, 212, 255, 0.12)',
  border: '1px solid rgba(113, 212, 255, 0.28)',
  color: '#aee8ff',
  fontSize: 12,
  letterSpacing: 0.8,
  textTransform: 'uppercase',
  fontWeight: 700,
};

const heroStyle: CSSProperties = {
  display: 'grid',
  gap: 18,
  marginBottom: 28,
};

const summaryGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16,
  marginBottom: 36,
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  padding: 20,
  borderRadius: 20,
  border: '1px solid rgba(113, 212, 255, 0.22)',
  background: 'rgba(7, 22, 35, 0.86)',
  boxShadow: '0 22px 45px rgba(2, 6, 23, 0.18)',
};

const actionsStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  marginBottom: 44,
};

const primaryLinkStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 18px',
  borderRadius: 999,
  background: '#1ec0b8',
  color: '#06202f',
  fontWeight: 800,
  textDecoration: 'none',
};

const secondaryLinkStyle: CSSProperties = {
  ...primaryLinkStyle,
  background: 'transparent',
  color: '#d9edf7',
  border: '1px solid rgba(113, 212, 255, 0.32)',
};

const sectionStyle: CSSProperties = {
  marginBottom: 28,
  padding: 24,
  borderRadius: 22,
  border: '1px solid rgba(113, 212, 255, 0.18)',
  background: 'rgba(5, 18, 30, 0.78)',
};

const codeStyle: CSSProperties = {
  marginTop: 16,
  background: '#0f172a',
  color: '#e2e8f0',
  padding: 20,
  borderRadius: 16,
  overflowX: 'auto',
  border: '1px solid rgba(148, 163, 184, 0.18)',
};

const noteStyle: CSSProperties = {
  padding: 18,
  borderRadius: 18,
  border: '1px solid rgba(30, 192, 184, 0.28)',
  background: 'rgba(30, 192, 184, 0.09)',
  marginBottom: 28,
};

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: 20,
};

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
    'Flip the booleans in AppUnique.tsx such as enableCardBuilders and enableUICoreOverrides to validate one override layer at a time.',
    'Wrapper components should always pass parameters through to the base MediaSFU component so built-in logic stays intact.',
    'Use customStyle, containerProps, and overlay props first; rebuild behavior only when styling is no longer enough.',
    'Function overrides receive a next callback. Call it unless you mean to replace the default workflow entirely.',
    'Move to customComponent or returnUI=false only after you know which room surfaces are actually blocking product progress.',
  ];

  const summaryCards = [
    {
      title: 'What this guide is for',
      body:
        'Use Storybook as the visual companion for override planning. The docs portal remains the narrative source of truth for how and when to use each override layer.',
    },
    {
      title: 'What is complete',
      body:
        'Card wrappers, component-level uiOverrides, function pipelines, and the customComponent escape hatch are all covered here with runnable patterns.',
    },
    {
      title: 'What to do first',
      body:
        'Start with a branded wrapper or modal override, validate the runtime, then widen into customComponent or headless only if the visible shell becomes the blocker.',
    },
    {
      title: 'Best companion pages',
      body:
        'Pair this with Choose Your UI Mode, UI Overrides, Custom Component Replacement, and the ReactJS SDK page for exact types and prop surfaces.',
    },
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
    <div style={pageStyle}>
      <div style={shellStyle}>
        <header style={heroStyle}>
          <div style={badgeRowStyle}>
            <span style={badgeStyle}>Storybook Guide</span>
            <span style={badgeStyle}>UI Overrides</span>
            <span style={badgeStyle}>Visual Companion</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', margin: 0 }}>
            MediaSFU UI overrides should feel like a finished playbook, with clear ownership boundaries and predictable runtime behavior.
          </h1>
          <p style={{ margin: 0, maxWidth: 820, color: '#c7d8e8', fontSize: 18 }}>
            Use this story to plan how far you want to push branding before you move into customComponent or
            full headless mode. The Storybook page is for visual inspection and quick copy patterns. The docs
            portal remains the source of truth for the integration narrative.
          </p>
        </header>

        <div style={actionsStyle}>
          <a href={docsLinks.uiOverrides} style={primaryLinkStyle} target="_blank" rel="noreferrer">
            Open UI overrides docs
          </a>
          <a href={docsLinks.chooseUiMode} style={secondaryLinkStyle} target="_blank" rel="noreferrer">
            Choose true vs false
          </a>
          <a href={docsLinks.reactGuide} style={secondaryLinkStyle} target="_blank" rel="noreferrer">
            ReactJS SDK reference
          </a>
        </div>

        <div style={summaryGridStyle}>
          {summaryCards.map((card) => (
            <section key={card.title} style={cardStyle}>
              <h2 style={{ margin: 0, fontSize: 21 }}>{card.title}</h2>
              <p style={{ margin: 0, color: '#c7d8e8' }}>{card.body}</p>
            </section>
          ))}
        </div>

        <div style={noteStyle}>
          <strong style={{ display: 'block', marginBottom: 8 }}>How to use this guide</strong>
          <p style={{ margin: 0, color: '#d8ecf5' }}>
            Use this Storybook view to inspect overrideable React surfaces, compare the available customization
            paths, and then return to the docs portal for framework setup, secure room creation, and production
            integration guidance.
          </p>
        </div>

        {sections.map(({ title, description, code }) => (
          <section key={title} style={sectionStyle}>
            <h2 style={{ fontSize: 24, marginTop: 0, marginBottom: 12 }}>{title}</h2>
            <div style={{ color: '#d8ecf5' }}>{description}</div>
            {code && (
              <pre style={codeStyle}>
                <code>{code}</code>
              </pre>
            )}
          </section>
        ))}

        <section style={sectionStyle}>
          <h2 style={{ fontSize: 24, marginTop: 0, marginBottom: 12 }}>Practical tips</h2>
          <ul style={listStyle}>
            {tips.map((tip) => (
              <li key={tip} style={{ marginBottom: 8, color: '#d8ecf5' }}>{tip}</li>
            ))}
          </ul>
        </section>

        <footer style={{ marginTop: 40, fontSize: 14, color: '#b7cada' }}>
          <p style={{ marginBottom: 8 }}>
            Start with AppUnique.tsx when you want a local override playground, then move back to the docs
            portal for the broader integration sequence.
          </p>
          <a href={docsLinks.overview} style={secondaryLinkStyle} target="_blank" rel="noreferrer">
            Open docs overview
          </a>
        </footer>
      </div>
    </div>
  );
};

export default UiOverridesGuide;
