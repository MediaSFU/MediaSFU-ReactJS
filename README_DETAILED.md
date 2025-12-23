<p align="center">
  <img src="https://www.mediasfu.com/logo192.png" width="100" alt="MediaSFU Logo">
</p>

<p align="center">
  <a href="https://twitter.com/media_sfu">
    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" />
  </a>
  <a href="https://www.mediasfu.com/forums">
    <img src="https://img.shields.io/badge/Community-Forum-blue?style=for-the-badge&logo=discourse&logoColor=white" alt="Community Forum" />
  </a>
  <a href="https://github.com/MediaSFU">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="Github" />
  </a>
  <a href="https://www.mediasfu.com/">
    <img src="https://img.shields.io/badge/Website-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" />
  </a>
  <a href="https://www.youtube.com/channel/UCELghZRPKMgjih5qrmXLtqw">
    <img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Youtube" />
  </a>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT" />
  </a>
  <a href="https://mediasfu.com">
    <img src="https://img.shields.io/badge/Built%20with-MediaSFU-blue?style=flat-square" alt="Built with MediaSFU" />
  </a>
  <a href="https://reactjs.org">
    <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
</p>

---

## 🚨 **BREAKING: AI Phone Agents at $0.10 per 1,000 minutes**

📞 **Call our live AI demos right now:**
- 🇺🇸 **+1 (785) 369-1724** - Mixed Support Demo  
- 🇬🇧 **+44 7445 146575** - AI Conversation Demo  
- 🇨🇦 **+1 (587) 407-1990** - Technical Support Demo  
- 🇨🇦 **+1 (647) 558-6650** - Friendly AI Chat Demo  

**Traditional providers charge $0.05 per minute. We charge $0.10 per 1,000 minutes. That's 500x cheaper.**

✅ **Deploy AI phone agents in 30 minutes**  
✅ **Works with ANY SIP provider** (Twilio, Telnyx, Zadarma, etc.)  
✅ **Seamless AI-to-human handoffs**  
✅ **Real-time call analytics & transcription**  

📖 **[Complete SIP/PSTN Documentation →](https://mediasfu.com/telephony)**

---

## Quick Reference: Component Props & UI Overrides

> **New:** UI override parity now extends across Webinar and Chat layouts, unifying customization for every MediaSFU interface.

Every primary MediaSFU UI export—`MediasfuGeneric`, `MediasfuBroadcast`, `MediasfuConference`, `MediasfuWebinar`, and `MediasfuChat`—now ships with a consistent prop surface and a powerful `uiOverrides` map, so you can bend the bundled experience to match your product without losing MediaSFU’s hardened real-time logic.

### Shared component props (applies to every MediaSFU UI component)

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `PrejoinPage` | `(options) => React.ReactNode` | `WelcomePage` | Swap in a custom pre-join experience. Receives unified pre-join options so you can add branding, legal copy, or warm-up flows. |
| `localLink` | `string` | `""` | Point the SDK at your self-hosted MediaSFU server. Leave empty when using MediaSFU Cloud. |
| `connectMediaSFU` | `boolean` | `true` | Toggle automatic socket/WebRTC connections. Set to `false` when you only need the UI shell. |
| `credentials` | `{ apiUserName: string; apiKey: string }` | `{ apiUserName: "", apiKey: "" }` | Supply cloud credentials without hard-coding them elsewhere. |
| `useLocalUIMode` | `boolean` | `false` | Run the interface in local/demo mode with no remote signaling. |
| `seedData`, `useSeed` | `SeedData`, `boolean` | `{}`, `false` | Pre-populate the UI for demos, snapshot tests, or onboarding tours. |
| `imgSrc` | `string` | `https://mediasfu.com/images/logo192.png` | Default artwork used across pre-join and modal flows. |
| `sourceParameters` | `Record<string, unknown>` | `undefined` | Shared helper bag (media devices, participant helpers, layout handlers). Pair with `updateSourceParameters` to mirror the SDK’s internal utilities. |
| `updateSourceParameters` | `(helpers) => void` | `undefined` | Receive the latest helper bundle so you can bridge MediaSFU logic into your own components. |
| `returnUI` | `boolean` | `true` | When `false`, mount the logic only—a perfect stepping stone to a fully bespoke interface. |
| `noUIPreJoinOptions` | `CreateMediaSFURoomOptions \| JoinMediaSFURoomOptions` | `undefined` | Feed pre-join data when `returnUI` is `false` and you want to bypass the on-screen wizard. |
| `joinMediaSFURoom`, `createMediaSFURoom` | Functions | `undefined` | Inject your own networking layers for joining or creating rooms. |
| `customComponent` | `CustomComponentType` | `undefined` | Replace the entire UI while retaining transports, sockets, and helpers. |
| `customVideoCard`, `customAudioCard`, `customMiniCard` | Factories | `undefined` | Override participant card renders to add metadata, CTAs, or badges. |
| `containerStyle` | `React.CSSProperties` | `undefined` | Apply inline styles to the root wrapper (dashboards, split views, etc.). |
| `uiOverrides` | `MediasfuUICustomOverrides` | `undefined` | Targeted component/function overrides described below. |

> **Power combo:** Set `returnUI={false}` to run MediaSFU logic headless, capture helpers via `updateSourceParameters`, and selectively bring UI pieces back with `uiOverrides`. That gives you progressive migration with minimal code churn.

```ts
import type { MediasfuUICustomOverrides } from "mediasfu-reactjs";

const overrides: MediasfuUICustomOverrides = { /* ... */ };
```

Bring the types into your project to unlock full IntelliSense for every override slot.

### Custom UI Playbook

Use a toggle-driven "playbook" component to experiment with MediaSFU’s customization layers. Flip a couple of booleans and you can watch the SDK jump between prebuilt layouts, headless logic, or a fully bespoke workspace driven by `customComponent`.

#### What the playbook demonstrates

- **Connection presets**: toggle `connectionScenario` between `cloud`, `hybrid`, or `ce` to swap credentials, local links, and connection modes in one place.
- **Experience selector**: the `selectedExperience` switch renders `MediasfuGeneric`, `MediasfuBroadcast`, `MediasfuWebinar`, `MediasfuConference`, or `MediasfuChat` without touching the rest of your stack.
- **UI strategy flags**: booleans like `showPrebuiltUI`, `enableFullCustomUI`, and `enableNoUIPreJoin` demonstrate how to run the MediaSFU logic with or without the bundled UI.
- **Layered overrides**: toggles enable the custom video/audio/mini cards, drop-in `uiOverrides` for layout and modal surfaces, container styling, and backend proxy helpers.
- **Custom workspace demo**: a `customComponent` receives live MediaSFU helpers so you can build dashboards, CRM surfaces, or any bespoke host interface.
- **Debug panel & helpers**: optional JSON panel exposes the `updateSourceParameters` payload so you can see exactly what to wire into your own components.

#### Try it quickly

```tsx
const connectionScenario: "cloud" | "hybrid" | "ce" = "cloud";
const selectedExperience = "generic" as const;
const showPrebuiltUI = true;
const enableFullCustomUI = false;

const connectionPresets = {
  cloud: { credentials: { apiUserName: "demo", apiKey: "demo" }, localLink: "", connectMediaSFU: true },
  hybrid: { credentials: { apiUserName: "demo", apiKey: "demo" }, localLink: "http://localhost:3000", connectMediaSFU: true },
  ce: { credentials: undefined, localLink: "http://localhost:3000", connectMediaSFU: false },
};

const Experience = {
  generic: MediasfuGeneric,
  broadcast: MediasfuBroadcast,
  webinar: MediasfuWebinar,
  conference: MediasfuConference,
  chat: MediasfuChat,
}[selectedExperience];

export const CustomUIPlaybook = () => {
  const overrides = useMemo(() => ({
    mainContainer: enableFullCustomUI
      ? {
          render: (props) => (
            <div style={{ border: "4px dashed purple", borderRadius: 24, padding: 16 }}>
              <MainContainerComponent {...props} />
            </div>
          ),
        }
      : undefined,
  }), [enableFullCustomUI]);

  const current = connectionPresets[connectionScenario];

  return (
    <Experience
      {...current}
      showPrebuiltUI={showPrebuiltUI}
      uiOverrides={overrides}
      containerStyle={{ background: "linear-gradient(135deg, #0f172a, #1e3a8a)", minHeight: "100vh" }}
    />
  );
};
```

Toggle the configuration values at the top of the playbook and watch the UI reconfigure instantly. It’s the fastest path to understand MediaSFU’s override surface before you fold the patterns into your production entrypoint.

#### Passing custom props and UI overrides

Use the same playbook to validate bespoke cards, override bundles, and fully custom workspaces before you move them into production code:

```tsx
const videoCard: CustomVideoCardType = (props) => (
  <VideoCard
    {...props}
    customStyle={{
      borderRadius: 20,
      border: "3px solid #4c1d95",
      boxShadow: "0 28px 65px rgba(76,29,149,0.35)",
      background: "linear-gradient(140deg, rgba(15,23,42,0.78), rgba(30,64,175,0.45))",
      ...(props.customStyle ?? {}),
    }}
  />
);

const audioCard: CustomAudioCardType = (props) => (
  <AudioCard
    {...props}
    barColor="#22c55e"
    customStyle={{ borderRadius: 22, background: "rgba(34,197,94,0.1)" }}
  />
);

const miniCard: CustomMiniCardType = (props) => (
  <MiniCard
    {...props}
    renderContainer={({ defaultContainer }) => (
      <div style={{ display: "grid", placeItems: "center", height: "100%" }}>{defaultContainer}</div>
    )}
  />
);

const uiOverrides = useMemo<MediasfuUICustomOverrides>(() => ({
  mainContainer: {
    render: (props) => (
      <div style={{ border: "4px dashed rgba(139,92,246,0.8)", borderRadius: 28, padding: 16 }}>
        <MainContainerComponent {...props} />
      </div>
    ),
  },
  menuModal: {
    component: (modalProps) => <MenuModal {...modalProps} variant="glass" />,
  },
  consumerResume: {
    wrap: (original) => async (params) => {
      const startedAt = performance.now();
      const result = await original(params);
      analytics.track("consumer_resume", {
        durationMs: performance.now() - startedAt,
        consumerId: params?.consumer?.id,
      });
      return result;
    },
  },
}), []);

return (
  <Experience
    {...current}
    customVideoCard={videoCard}
    customAudioCard={audioCard}
    customMiniCard={miniCard}
    customComponent={enableFullCustomUI ? CustomWorkspace : undefined}
    containerStyle={{ background: "#0f172a", borderRadius: 32, overflow: "hidden" }}
    uiOverrides={uiOverrides}
  />
);
```

Because the playbook surfaces `updateSourceParameters`, you can also log or snapshot the helper bundle (`getParticipantMedia`, `toggleMenuModal`, `showAlert`, and more) to ensure your custom UI always receives the hooks it expects.

### `uiOverrides` map — override keys at a glance

Each key accepts a `CustomComponentOverride<Props>` object with optional `component` and `render` fields. You can fully replace the default implementation or wrap it while forwarding props.

#### Layout & control surfaces

| Key | Default component | Typical use |
| --- | --- | --- |
| `mainContainer` | `MainContainerComponent` | Inject theming providers or dashboard layouts. |
| `mainAspect` | `MainAspectComponent` | Tune how the main region splits space. |
| `mainScreen` | `MainScreenComponent` | Orchestrate hero video + gallery interplay. |
| `mainGrid` | `MainGridComponent` | Modify layout or layering of primary participants. |
| `subAspect` | `SubAspectComponent` | Restyle fixed control strips in webinar/conference modes. |
| `otherGrid` | `OtherGridComponent` | Change presentation of off-stage attendees. |
| `flexibleGrid`, `flexibleGridAlt` | `FlexibleGrid` | Implement AI-driven or branded array layouts. |
| `flexibleVideo` | `FlexibleVideo` | Add captions, watermarks, or overlays to highlighted speakers. |
| `audioGrid` | `AudioGrid` | Customise audio-only attendee presentation. |
| `pagination` | `Pagination` | Introduce infinite scroll or auto-cycling carousels. |
| `controlButtons` | `ControlButtonsComponent` | Rebrand the primary action bar. |
| `controlButtonsAlt` | `ControlButtonsAltComponent` | Control secondary button clusters. |
| `controlButtonsTouch` | `ControlButtonsComponentTouch` | Deliver mobile-first controls (used heavily by `MediasfuChat`). |

#### Participant cards & widgets

| Key | Default component | Typical use |
| --- | --- | --- |
| `videoCard` | `VideoCard` | Add host badges, reactions, or CRM overlays. |
| `audioCard` | `AudioCard` | Swap avatars or expose spoken-language info. |
| `miniCard` | `MiniCard` | Customize thumbnails in picture-in-picture modes. |
| `miniAudio` | `MiniAudio` | Re-style the audio-only mini indicators. |
| `meetingProgressTimer` | `MeetingProgressTimer` | Replace the elapsed-time widget with countdowns or milestones. |
| `miniAudioPlayer` | `MiniAudioPlayer` | Provide alternative UI for recorded clip playback. |

#### Modals, dialogs, and collaboration surfaces

| Key | Default component | Typical use |
| --- | --- | --- |
| `loadingModal` | `LoadingModal` | Show branded skeletons while connecting. |
| `alert` | `AlertComponent` | Route alerts through your notification system. |
| `menuModal` | `MenuModal` | Redesign quick-action trays. |
| `eventSettingsModal` | `EventSettingsModal` | Extend host tools with your own settings. |
| `requestsModal` | `RequestsModal` | Build moderation queues tailored to your workflows. |
| `waitingRoomModal` | `WaitingRoomModal` | Deliver custom waiting-room experiences. |
| `coHostModal` | `CoHostModal` | Manage co-hosts with bespoke UX. |
| `mediaSettingsModal` | `MediaSettingsModal` | Embed device tests or instructions. |
| `participantsModal` | `ParticipantsModal` | Introduce advanced filters, search, or notes. |
| `messagesModal` | `MessagesModal` | Drop in your full-featured chat module. |
| `displaySettingsModal` | `DisplaySettingsModal` | Let users pick layouts, themes, or captions. |
| `confirmExitModal` | `ConfirmExitModal` | Meet compliance wording requirements. |
| `confirmHereModal` | `ConfirmHereModal` | Customize attendance confirmations for webinars. |
| `shareEventModal` | `ShareEventModal` | Add referral codes or QR sharing. |
| `recordingModal` | `RecordingModal` | Tailor recording confirmation flows. |
| `pollModal` | `PollModal` | Integrate your polling/quiz engine. |
| `backgroundModal` | `BackgroundModal` | Hook AI background replacement or brand presets. |
| `breakoutRoomsModal` | `BreakoutRoomsModal` | Implement drag-and-drop or AI room suggestions. |
| `configureWhiteboardModal` | `ConfigureWhiteboardModal` | Adjust collaboration permissions before launch. |
| `whiteboard` | `Whiteboard` | Replace with your whiteboard provider. |
| `screenboard` | `Screenboard` | Modify shared-screen annotation layers. |
| `screenboardModal` | `ScreenboardModal` | Reimagine how users enable shared annotations. |

#### Entry flows & custom renderers

| Key | Default component | Typical use |
| --- | --- | --- |
| `welcomePage` | `WelcomePage` | Provide a fully branded welcome/marketing splash. |
| `preJoinPage` | `PrejoinPage` | Override the wizard used before joining live sessions. |
| `customMenuButtonsRenderer` | `ControlButtonsAltComponent` | Supply a bespoke renderer for menu button groups without overriding each button. |

#### Function overrides

| Key | Default function | Typical use |
| --- | --- | --- |
| `consumerResume` | `consumerResume` | Wrap errors, capture analytics, or rate-limit consumer resume behavior. |
| `addVideosGrid` | `addVideosGrid` | Replace participant ordering or layout heuristics on the fly. |

> Function overrides support `{ implementation, wrap }`. Provide `implementation` for a full replacement, or `wrap` to intercept the default behavior before/after it runs.

### Example: swap the chat modal and theme the controls

```tsx
import { MediasfuGeneric } from "mediasfu-reactjs";
import { MyChatModal } from "./ui/MyChatModal";
import { MyControls } from "./ui/MyControls";

const uiOverrides = {
  messagesModal: {
    component: MyChatModal,
  },
  controlButtons: {
    render: (props) => <MyControls {...props} variant="glass" />,
  },
};

export const MyMeeting = () => (
  <MediasfuGeneric credentials={credentials} uiOverrides={uiOverrides} />
);
```

### Example: wrap a MediaSFU helper instead of replacing it

```tsx
const uiOverrides = {
  consumerResume: {
    wrap: (original) => async (params) => {
      const startedAt = performance.now();
      const result = await original(params);
      analytics.track("consumer_resume", {
        durationMs: performance.now() - startedAt,
        consumerId: params?.consumer?.id,
      });
      return result;
    },
  },
};

<MediasfuConference uiOverrides={uiOverrides} />;
```

The same override hooks power the newly refreshed `MediasfuWebinar` and `MediasfuChat` layouts, so you can guarantee a unified experience across events, webinars, or chat-first rooms.

---

MediaSFU offers a cutting-edge streaming experience that empowers users to customize their recordings and engage their audience with high-quality streams. Whether you're a content creator, educator, or business professional, MediaSFU provides the tools you need to elevate your streaming game.

<div style="text-align: center;">

<img src="https://mediasfu.com/images/header_1.jpg" alt="Preview Page" title="Preview Page" style="max-height: 600px;">

</div>

---

# MediaSFU ReactJS Module Documentation

## Unlock the Power of MediaSFU Community Edition  

**MediaSFU Community Edition is free and open-source**—perfect for developers who want to run their own media server without upfront costs. With robust features and simple setup, you can launch your media solution in minutes. **Ready to scale?** Upgrade seamlessly to **MediaSFU Cloud** for enterprise-grade performance and global scalability.  

**[Get started now on GitHub!](https://github.com/MediaSFU/MediaSFUOpen)** 

### ✅ ReactJS SDK Setup Guide  
[![Watch the ReactJS SDK Setup Guide](http://i.ytimg.com/vi/VvulSNB_AYg/hqdefault.jpg)](https://www.youtube.com/watch?v=VvulSNB_AYg)  
🎥 [**Watch the ReactJS SDK Setup Guide**](https://youtu.be/VvulSNB_AYg)

---

## Table of Contents

- [Quick Reference: Component Props & UI Overrides](#quick-reference-component-props--ui-overrides)
- [Custom UI Playbook](#custom-ui-playbook)
- [Features](#features)
- [Getting Started](#getting-started)
- [📘 ReactJS SDK Guide](#reactjs-sdk-guide)
  - [Quick Start](#quick-start-5-minutes)
  - [Understanding the Architecture](#understanding-mediasfu-architecture)
  - [Core Concepts & Components](#core-concepts--components)
  - [Working with Methods](#working-with-methods)
  - [Media Streams & Participants](#media-streams--participants)
  - [Customization & Styling](#customization--styling)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

# Features <a name="features"></a>

MediaSFU's React SDK comes with a host of powerful features out of the box:

1. **Screen Sharing with Annotation Support**: Share your screen with participants and annotate in real-time for enhanced presentations and collaborations.
2. **Collaborative Whiteboards**: Create and share whiteboards for real-time collaborative drawing and brainstorming sessions.
3. **Breakout Rooms**: Create multiple sub-meetings within a single session to enhance collaboration and focus.
4. **Pagination**: Efficiently handle large participant lists with seamless pagination.
5. **Polls**: Conduct real-time polls to gather instant feedback from participants.
6. **Media Access Requests Management**: Manage media access requests with ease to ensure smooth operations.
7. **Video Effects**: Apply various video effects, including virtual backgrounds, to enhance the visual experience.
8. **Chat (Direct & Group)**: Facilitate communication with direct and group chat options.
9. **Cloud Recording (track-based)**: Customize recordings with track-based options, including watermarks, name tags, background colors, and more.
10. **Managed Events**: Manage events with features to handle abandoned and inactive participants, as well as enforce time and capacity limits.

## 🆕 **New Advanced Media Access**

**Interested in getting just the media stream of a specific participant?** You can now easily retrieve individual participant streams using `sourceParameters.getParticipantMedia()` [Learn more →](#media-device-and-stream-utility-methods)

**Need to access available cameras and microphones?** Use `sourceParameters.getMediaDevicesList()` to enumerate all available media devices on the user's system programmatically.

# Getting Started <a name="getting-started"></a>

This section will guide users through the initial setup and installation of the npm module.

### Documentation Reference

For comprehensive documentation on the available methods, components, and functions, please visit [mediasfu.com](https://www.mediasfu.com/reactjs/). This resource provides detailed information for this guide and additional documentation.


## Installation

Instructions on how to install the module using npm.

### 1. Add the Package to Your Project

    ```bash
    npm install mediasfu-reactjs
    ```

#### **1.1 Important Installation Notes**

#### 🚫 **Avoid Using `--force` or `--legacy-peer-deps`**

Using these flags can override important dependency checks, potentially causing **unstable builds** or **unexpected behavior**.

- **Why Avoid Them?**  
  They bypass compatibility checks, which can introduce **bugs** or **conflicts** within your project.

---

#### ⚙️ **Use Package Overrides (Recommended)**
If you encounter **peer dependency conflicts**, use the `overrides` field in your `package.json` instead of forcing installations.

##### ✅ **Example of Safe Overrides:**

```json
{
  "overrides": {
    "some-package": {
      "dependency-name": "^1.2.3"
    }
  }
}
```

- **Why This Works:**  
  Overrides let you resolve conflicts **safely** without compromising the integrity of your project.

---

#### 🚩 **If You Absolutely Need to Use `--force` or `--legacy-peer-deps`**

- Some peer dependencies **might be skipped**.  
- You’ll need to **manually install** them to avoid runtime errors.

##### 🔑 **Install the Required Peer Dependencies:**

```bash
npm install \
"@fortawesome/fontawesome-svg-core@^6.6.0" \
"@fortawesome/free-brands-svg-icons@^6.6.0" \
"@fortawesome/free-solid-svg-icons@^6.6.0" \
"@fortawesome/react-fontawesome@^0.2.2" \
"@mediapipe/selfie_segmentation@0.1.1675465747" \
"bootstrap@^5.3.3" \
"mediasoup-client@^3.16.0" \
"react@^19.0.0" \
"react-dom@^19.0.0" \
"socket.io-client@4.8.0" \
"universal-cookie@^7.2.0"
```

- **Why This Is Important:**  
  These peer dependencies are critical for `mediasfu-reactjs` to function correctly.

---

#### 🔍 **How to Check for Peer Dependencies**

1. **Open your `package.json`.**
2. Look for the `peerDependencies` section:
   ```json
   "peerDependencies": {
   "@fortawesome/fontawesome-svg-core": "^6.6.0",
    "@fortawesome/free-brands-svg-icons": "^6.6.0",
    "@fortawesome/free-solid-svg-icons": "^6.6.0",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@mediapipe/selfie_segmentation": "0.1.1675465747",
    "bootstrap": "^5.3.3",
    "mediasoup-client": "^3.16.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "socket.io-client": "4.8.0",
    "universal-cookie": "^7.2.0"
   }
   ```

3. **Ensure all are installed.** If not, run the install command above.

---

#### ✅ **Final Recommendations:**

- Always try to resolve conflicts using **overrides** first.
- Only use `--force` or `--legacy-peer-deps` as a **last resort**.

---

### 2. Obtain an API Key (If Required) 
   You can get your API key by signing up or logging into your account at [mediasfu.com](https://www.mediasfu.com/).

  <div style="background-color:#f0f0f0; padding: 10px; border-radius: 5px;">
      <h4 style="color:#d9534f;">Important:</h4>
      <p style="font-size: 1.2em; color: black;">You must obtain an API key from <a href="https://www.mediasfu.com/">mediasfu.com</a> to use this package with MediaSFU Cloud. You do not need the API Key if self-hosting.</p>
    </div>

## **Self-Hosting MediaSFU**  

If you plan to self-host MediaSFU or use it without MediaSFU Cloud services, you don't need an API key. You can access the open-source version of MediaSFU from the [MediaSFU Open Repository](https://github.com/MediaSFU/MediaSFUOpen).  

This setup allows full flexibility and customization while bypassing the need for cloud-dependent credentials.  

---

# 📘 ReactJS SDK Guide <a name="reactjs-sdk-guide"></a>

This comprehensive guide will walk you through everything you need to know about building real-time communication apps with MediaSFU's ReactJS SDK. Whether you're a beginner or an experienced developer, you'll find clear explanations, practical examples, and best practices.

---

## Quick Start (5 Minutes) <a name="quick-start-5-minutes"></a>

Get your first MediaSFU app running in just a few minutes.

### Step 1: Install the Package

```bash
npm install mediasfu-reactjs
```

### Step 2: Import and Use

```javascript
import React from 'react';
import { MediasfuGeneric } from 'mediasfu-reactjs';

function App() {
  // Option 1: Use without credentials (for testing)
  return <MediasfuGeneric />;

  // Option 2: Use with MediaSFU Cloud credentials
  // const credentials = { apiUserName: 'your_username', apiKey: 'your_api_key' };
  // return <MediasfuGeneric credentials={credentials} />;
}

export default App;
```

### Step 3: Run Your App

```bash
npm start
```

**That's it!** You now have a fully functional video conferencing app with:
- ✅ Video and audio streaming
- ✅ Screen sharing  
- ✅ Chat messaging
- ✅ Participant management
- ✅ Recording capabilities
- ✅ Breakout rooms
- ✅ Polls and whiteboards

---

## Understanding MediaSFU Architecture <a name="understanding-mediasfu-architecture"></a>

Before diving deeper, let's understand how MediaSFU is structured.

### The Three-Layer Architecture

```
┌─────────────────────────────────────────────┐
│         Your React Application              │
│   (App.js, components, business logic)      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│        MediaSFU Components Layer            │
│  (MediasfuGeneric, MediasfuBroadcast, etc.) │
│        - Pre-built UI components             │
│        - Event handling                      │
│        - State management                    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│        MediaSFU Core Methods Layer          │
│   (Stream control, room management,         │
│    WebRTC handling, socket communication)   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│        MediaSFU Backend Services            │
│ (MediaSFU Cloud or Community Edition)       │
└─────────────────────────────────────────────┘
```

### Key Concepts

#### 1. **Event Room Types**

MediaSFU provides 5 specialized room types, each optimized for specific use cases:

| Room Type | Best For | Key Features |
|-----------|----------|--------------|
| **MediasfuGeneric** | General purpose meetings | Flexible layout, all features enabled |
| **MediasfuBroadcast** | Live streaming events | Optimized for one-to-many communication |
| **MediasfuWebinar** | Educational sessions | Presenter focus, Q&A features |
| **MediasfuConference** | Business meetings | Equal participant layout, collaboration tools |
| **MediasfuChat** | Interactive discussions | Chat-first interface, quick connections |

```javascript
// Choose the right room type for your use case
import { MediasfuWebinar, MediasfuBroadcast, MediasfuConference } from 'mediasfu-reactjs';

// For a webinar
<MediasfuWebinar credentials={credentials} />

// For a broadcast  
<MediasfuBroadcast credentials={credentials} />

// For a conference
<MediasfuConference credentials={credentials} />
```

#### 2. **The Three Usage Modes**

MediaSFU offers three progressive levels of customization:

##### Mode 1: Default UI (Simplest)
Use MediaSFU's complete pre-built interface - perfect for rapid development.

```javascript
import { MediasfuGeneric } from 'mediasfu-reactjs';

function App() {
  return <MediasfuGeneric credentials={credentials} />;
}
```

**When to use:**
- ✅ Prototyping or MVP development
- ✅ Need a production-ready UI quickly
- ✅ Standard video conferencing features are sufficient

##### Mode 2: Custom UI with MediaSFU Backend (Most Flexible)
Build your own UI while using MediaSFU's powerful backend infrastructure.

```javascript
import { MediasfuGeneric } from 'mediasfu-reactjs';
import { useState } from 'react';

function App() {
  const [sourceParameters, setSourceParameters] = useState(null);
  
  const handleUpdateSourceParameters = (params) => {
    setSourceParameters(params);
  };

  return (
    <div>
      <MediasfuGeneric 
        returnUI={false}
        sourceParameters={sourceParameters}
        updateSourceParameters={handleUpdateSourceParameters}
        credentials={credentials}
        noUIPreJoinOptions={{ 
          action: 'create',
          userName: 'Your Name',
          capacity: 50,
          duration: 30,
          eventType: 'conference'
        }}
      />
      
      {/* Your custom UI */}
      {sourceParameters && (
        <div className="custom-controls">
          <button onClick={() => sourceParameters.clickVideo({ parameters: sourceParameters })}>
            Toggle Video
          </button>
          <button onClick={() => sourceParameters.clickAudio({ parameters: sourceParameters })}>
            Toggle Audio
          </button>
        </div>
      )}
    </div>
  );
}
```

**When to use:**
- ✅ Need complete control over UI/UX
- ✅ Building a custom branded experience
- ✅ Integrating into existing app design

##### Mode 3: Component Replacement (Balanced)
Replace specific MediaSFU components while keeping the rest of the infrastructure.

```javascript
import { MediasfuGeneric, FlexibleVideo, FlexibleGrid } from 'mediasfu-reactjs';

function CustomMainScreen({ parameters }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Custom header */}
      <div className="custom-header">
        <h1>{parameters.roomName}</h1>
        <span>{parameters.participants.length} participants</span>
      </div>
      
      {/* Use MediaSFU's components in your layout */}
      <FlexibleVideo 
        customWidth={window.innerWidth}
        customHeight={600}
        parameters={parameters}
      />
      
      <FlexibleGrid 
        customWidth={window.innerWidth}
        customHeight={400}
        parameters={parameters}
      />
      
      {/* Custom footer */}
      <div className="custom-footer">
        <button onClick={() => parameters.clickVideo({ parameters })}>
          {parameters.videoAlreadyOn ? 'Stop Video' : 'Start Video'}
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <MediasfuGeneric 
      credentials={credentials}
      PrejoinPage={WelcomePage}
      customComponent={CustomMainScreen}
    />
  );
}
```

**When to use:**
- ✅ Need custom main interface but want to keep MediaSFU's components
- ✅ Partial customization with minimal effort
- ✅ Want to maintain MediaSFU's functionality while customizing layout

#### 3. **Parameters: Your Control Center**

The `sourceParameters` object (or `parameters` in custom components) is your gateway to all MediaSFU functionality:

```javascript
// Available in sourceParameters or parameters object
{
  // Media Controls
  clickVideo: (options) => {},
  clickAudio: (options) => {},
  clickScreenShare: (options) => {},
  
  // Room State
  roomName: 'meeting-123',
  participants: [...],
  allVideoStreams: [...],
  allAudioStreams: [...],
  
  // UI State
  videoAlreadyOn: false,
  audioAlreadyOn: false,
  screenAlreadyOn: false,
  
  // Update Functions
  updateVideoAlreadyOn: (value) => {},
  updateAudioAlreadyOn: (value) => {},
  
  // And 200+ more properties and methods...
}
```

**Access patterns:**

```javascript
// In Mode 1 (Default UI): Parameters are managed internally
// You don't need to access them directly

// In Mode 2 (Custom UI): Access via sourceParameters state
const [sourceParameters, setSourceParameters] = useState(null);
sourceParameters?.clickVideo({ parameters: sourceParameters });

// In Mode 3 (Component Replacement): Passed to your custom component
function CustomComponent({ parameters }) {
  parameters.clickVideo({ parameters });
}
```

---

## Core Concepts & Components <a name="core-concepts--components"></a>

Now that you understand the architecture, let's explore the building blocks.

### 1. Display Components: Building Your Video Layout

MediaSFU provides powerful components for organizing and displaying media streams.

#### Primary Layout Components

**FlexibleVideo** - Main video display area
```javascript
import { FlexibleVideo } from 'mediasfu-reactjs';

<FlexibleVideo
  customWidth={window.innerWidth}
  customHeight={600}
  parameters={parameters}
/>
```
- Automatically handles main presenter or screen share
- Smooth transitions between different video sources
- Responsive sizing

**FlexibleGrid** - Participant grid layout
```javascript
import { FlexibleGrid } from 'mediasfu-reactjs';

<FlexibleGrid
  customWidth={window.innerWidth}
  customHeight={800}
  parameters={parameters}
/>
```
- Intelligent grid sizing (2x2, 3x3, 4x4, etc.)
- Pagination for large participant lists
- Automatic reflow on window resize

**AudioGrid** - Audio-only participants
```javascript
import { AudioGrid } from 'mediasfu-reactjs';

<AudioGrid parameters={parameters} />
```
- Displays participants without video
- Audio level indicators
- Compact layout for efficiency

#### Container Components

| Component | Purpose | Use Case |
|-----------|---------|----------|
| **MainContainerComponent** | Primary content wrapper | Wraps all main content areas |
| **MainAspectComponent** | Aspect ratio container | Maintains proper video proportions |
| **MainScreenComponent** | Screen layout manager | Organizes screen regions |
| **SubAspectComponent** | Secondary content container | For picture-in-picture, sidebars |

**Example: Building a custom layout**

```javascript
import {
  MainContainerComponent,
  FlexibleVideo,
  FlexibleGrid,
  AudioGrid
} from 'mediasfu-reactjs';

function CustomLayout({ parameters }) {
  return (
    <MainContainerComponent>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Main video area */}
        <div style={{ flex: 3 }}>
          <FlexibleVideo
            customWidth={window.innerWidth}
            customHeight={window.innerHeight * 0.6}
            parameters={parameters}
          />
        </div>
        
        {/* Participant grid */}
        <div style={{ flex: 2 }}>
          <FlexibleGrid
            customWidth={window.innerWidth}
            customHeight={window.innerHeight * 0.3}
            parameters={parameters}
          />
        </div>
        
        {/* Audio-only participants */}
        <div style={{ height: 80 }}>
          <AudioGrid parameters={parameters} />
        </div>
      </div>
    </MainContainerComponent>
  );
}
```

### 2. Control Components: User Interactions

**ControlButtonsComponent** - Standard control bar
```javascript
import { ControlButtonsComponent } from 'mediasfu-reactjs';

<ControlButtonsComponent
  parameters={parameters}
  position="bottom" // or 'top', 'left', 'right'
/>
```
Includes: mute, video, screenshare, participants, chat, settings, etc.

**ControlButtonsAltComponent** - Alternative layout
```javascript
import { ControlButtonsAltComponent } from 'mediasfu-reactjs';

<ControlButtonsAltComponent
  parameters={parameters}
  position="top"
/>
```
Different button arrangement optimized for specific layouts.

**ControlButtonsComponentTouch** - Touch-optimized controls
```javascript
import { ControlButtonsComponentTouch } from 'mediasfu-reactjs';

<ControlButtonsComponentTouch parameters={parameters} />
```
Floating action buttons optimized for mobile/tablet interfaces.

### 3. Modal Components: Feature Interfaces

MediaSFU includes modals for various features:

```javascript
import {
  ParticipantsModal,
  MessagesModal,
  SettingsModal,
  DisplaySettingsModal,
  RecordingModal,
  PollModal,
  BreakoutRoomsModal
} from 'mediasfu-reactjs';

// These are automatically rendered when enabled
// Control their visibility via parameters
parameters.updateIsParticipantsModalVisible(true);
parameters.updateIsMessagesModalVisible(true);
parameters.updateIsSettingsModalVisible(true);
```

Available modals:
- **ParticipantsModal** - Participant list management
- **MessagesModal** - Chat interface
- **SettingsModal** - Event and room settings
- **DisplaySettingsModal** - Layout and display options
- **RecordingModal** - Recording controls and settings
- **PollModal** - Create and manage polls
- **BreakoutRoomsModal** - Breakout room management
- **MediaSettingsModal** - Camera/microphone selection
- **BackgroundModal** - Virtual background settings
- **ConfigureWhiteboardModal** - Whiteboard configuration

**Example: Programmatically showing modals**

```javascript
function CustomControls({ parameters }) {
  return (
    <div className="custom-toolbar">
      <button onClick={() => parameters.updateIsParticipantsModalVisible(true)}>
        Show Participants ({parameters.participants.length})
      </button>
      
      <button onClick={() => parameters.updateIsMessagesModalVisible(true)}>
        Open Chat
      </button>
      
      <button onClick={() => parameters.launchPoll.launchPoll({ parameters })}>
        Create Poll
      </button>
    </div>
  );
}
```

### 4. Video Cards: Individual Participant Display

**VideoCard** - Individual participant video element
```javascript
import { VideoCard } from 'mediasfu-reactjs';

<VideoCard
  videoStream={participantStream}
  remoteProducerId="producer-id"
  eventType="conference"
  forceFullDisplay={false}
  participant={participantObject}
  backgroundColor="#000000"
  showControls={true}
  showInfo={true}
  name="Participant Name"
  parameters={parameters}
/>
```

**AudioCard** - Individual audio-only participant
```javascript
import { AudioCard } from 'mediasfu-reactjs';

<AudioCard
  name="Participant Name"
  barColor="#4CAF50"
  textColor="#FFFFFF"
  customStyle={{ borderRadius: '10px' }}
  controlsPosition="topLeft"
  infoPosition="topRight"
  participant={participantObject}
  parameters={parameters}
/>
```

**MiniCard** - Compact participant display (for grids)
```javascript
import { MiniCard } from 'mediasfu-reactjs';

<MiniCard
  participant={participantObject}
  showControls={false}
  parameters={parameters}
/>
```

**Example: Custom Video Card**

```javascript
function MyCustomVideoCard({ stream, participant, parameters }) {
  return (
    <div style={{
      border: '3px solid #00ff88',
      borderRadius: '15px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <video 
        ref={videoRef => {
          if (videoRef && stream) {
            videoRef.srcObject = stream;
            videoRef.play();
          }
        }}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        autoPlay
        muted
      />
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 255, 136, 0.8)',
        color: 'black',
        padding: '8px',
        fontWeight: 'bold'
      }}>
        {participant.name} {participant.muted && '🔇'}
      </div>
    </div>
  );
}

// Use it
<MediasfuGeneric 
  credentials={credentials}
  customVideoCard={MyCustomVideoCard}
/>
```

---

## Working with Methods <a name="working-with-methods"></a>

MediaSFU provides 200+ methods for controlling every aspect of your real-time communication experience. Let's explore the most important categories.

### Media Control Methods

#### Video Control

```javascript
// Toggle video on/off
parameters.clickVideo({ parameters });

// Switch camera (front/back on mobile)
parameters.switchVideoAlt({ parameters });

// Switch to specific camera by ID
const cameras = await parameters.getMediaDevicesList('videoinput');
parameters.switchUserVideo({
  videoPreference: cameras[1].deviceId,
  parameters
});

// Get current video state
const isVideoOn = parameters.videoAlreadyOn;

// Update video state programmatically
parameters.updateVideoAlreadyOn(true);
```

#### Audio Control

```javascript
// Toggle audio on/off
parameters.clickAudio({ parameters });

// Switch microphone
const microphones = await parameters.getMediaDevicesList('audioinput');
parameters.switchUserAudio({
  audioPreference: microphones[1].deviceId,
  parameters
});

// Get current audio state
const isAudioOn = parameters.audioAlreadyOn;
const hasHostPermission = parameters.micAction; // Host approval status

// Mute/unmute specific participant (host only)
parameters.controlMedia({
  participantId: 'participant-id',
  participantName: 'John Doe',
  type: 'audio',
  socket: parameters.socket,
  roomName: parameters.roomName
});
```

#### Screen Sharing

```javascript
// Start screen sharing
parameters.clickScreenShare({ parameters });

// Stop screen sharing
parameters.stopShareScreen({ parameters });

// Check if screen sharing is available
const canShare = await parameters.checkScreenShare({ parameters });

// Get screen share state
const isSharing = parameters.screenAlreadyOn;
const shareAudio = parameters.shareScreenStarted; // Sharing with audio
```

### Device Management Methods

```javascript
// Get available cameras
const cameras = await parameters.getMediaDevicesList('videoinput');
cameras.forEach(camera => {
  console.log(`Camera: ${camera.label} (${camera.deviceId})`);
});

// Get available microphones
const microphones = await parameters.getMediaDevicesList('audioinput');
microphones.forEach(mic => {
  console.log(`Microphone: ${mic.label} (${mic.deviceId})`);
});

// Building a device selector UI
function DeviceSelector({ parameters }) {
  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);

  useEffect(() => {
    const loadDevices = async () => {
      const cams = await parameters.getMediaDevicesList('videoinput');
      const mics = await parameters.getMediaDevicesList('audioinput');
      setCameras(cams);
      setMicrophones(mics);
    };
    loadDevices();
  }, []);

  return (
    <div>
      <select onChange={(e) => {
        parameters.switchUserVideo({
          videoPreference: e.target.value,
          parameters
        });
      }}>
        {cameras.map(camera => (
          <option key={camera.deviceId} value={camera.deviceId}>
            {camera.label}
          </option>
        ))}
      </select>

      <select onChange={(e) => {
        parameters.switchUserAudio({
          audioPreference: e.target.value,
          parameters
        });
      }}>
        {microphones.map(mic => (
          <option key={mic.deviceId} value={mic.deviceId}>
            {mic.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Participant Management Methods

```javascript
// Get all participants
const participants = parameters.participants;
const participantCount = parameters.participantsCounter;

// Filter participants
const videoParticipants = participants.filter(p => p.videoOn);
const audioOnlyParticipants = participants.filter(p => !p.videoOn);
const mutedParticipants = participants.filter(p => p.muted);

// Find specific participant
const participant = participants.find(p => p.name === 'John Doe');

// Remove participant from room (host only)
parameters.disconnectUserInitiate({
  member: participantId,
  roomName: parameters.roomName,
  socket: parameters.socket
});

// Change participant role (host only)
parameters.updateParticipant({
  participantId: 'participant-id',
  islevel: '2', // '2' = host, '1' = co-host, '0' = participant
  parameters
});

// Request to unmute participant (sends request)
parameters.requestScreenShare({ parameters });
```

### Chat & Messaging Methods

```javascript
// Send a group message
parameters.sendMessage({
  message: 'Hello everyone!',
  type: 'group',
  parameters
});

// Send direct message
parameters.sendMessage({
  message: 'Private message',
  type: 'direct',
  receivers: ['participant-id'],
  parameters
});

// Access message history
const messages = parameters.messages;

// Listen for new messages (via update function)
parameters.updateMessages = (newMessages) => {
  console.log('New messages:', newMessages);
};

// Example: Custom chat component
function CustomChat({ parameters }) {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    parameters.sendMessage({
      message,
      type: 'group',
      parameters
    });
    setMessage('');
  };

  return (
    <div>
      <div className="messages">
        {parameters.messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

### Recording Methods

```javascript
// Start recording
parameters.startRecording({ parameters });

// Stop recording
parameters.stopRecording({ parameters });

// Pause recording
parameters.pauseRecording({ parameters });

// Resume recording
parameters.resumeRecording({ parameters });

// Configure recording settings
parameters.updateRecording({
  recordingMediaOptions: 'video', // or 'audio'
  recordingAudioOptions: 'all', // or 'host'
  recordingVideoOptions: 'all', // or 'host'
  recordingVideoType: 'fullDisplay', // or 'bestDisplay', 'all'
  recordingDisplayType: 'video', // 'media', 'video', 'all'
  recordingBackgroundColor: '#000000',
  recordingNameTagsColor: '#ffffff',
  recordingOrientationVideo: 'landscape', // or 'portrait'
  recordingNameTags: true,
  recordingAddHLS: false,
  parameters
});

// Check recording state
const isRecording = parameters.recordStarted;
const isPaused = parameters.recordPaused;
const recordingTime = parameters.recordElapsedTime;
```

### Polls & Surveys Methods

```javascript
// Create a poll
parameters.handleCreatePoll({
  poll: {
    question: 'What time works best?',
    type: 'multiple', // or 'single'
    options: ['10 AM', '2 PM', '5 PM']
  },
  parameters
});

// Vote on a poll
parameters.handleVotePoll({
  pollId: 'poll-id',
  optionIndex: 1,
  parameters
});

// End a poll
parameters.handleEndPoll({
  pollId: 'poll-id',
  parameters
});

// Access poll data
const polls = parameters.polls;
const activePoll = polls.find(p => p.status === 'active');

// Example: Custom poll component
function CustomPoll({ parameters }) {
  const activePoll = parameters.polls.find(p => p.status === 'active');

  if (!activePoll) return null;

  return (
    <div className="poll">
      <h3>{activePoll.question}</h3>
      {activePoll.options.map((option, index) => (
        <button 
          key={index}
          onClick={() => {
            parameters.handleVotePoll({
              pollId: activePoll.id,
              optionIndex: index,
              parameters
            });
          }}
        >
          {option} ({activePoll.votes?.[index] || 0} votes)
        </button>
      ))}
    </div>
  );
}
```

### Breakout Rooms Methods

```javascript
// Create breakout rooms
parameters.createBreakoutRooms({
  numberOfRooms: 3,
  participants: parameters.participants,
  parameters
});

// Assign participant to room
parameters.assignParticipantToRoom({
  participantId: 'participant-id',
  roomIndex: 0,
  parameters
});

// Start breakout rooms
parameters.startBreakoutRooms({ parameters });

// Stop breakout rooms
parameters.stopBreakoutRooms({ parameters });

// Access breakout room data
const breakoutRooms = parameters.breakoutRooms;
const currentRoom = parameters.currentBreakoutRoom;
```

### Whiteboard Methods

```javascript
// Show/hide whiteboard
parameters.updateWhiteboardStarted(true);
parameters.updateWhiteboardEnded(false);

// Configure whiteboard
parameters.launchConfigureWhiteboard.launchConfigureWhiteboard({ parameters });

// Access whiteboard state
const isWhiteboardActive = parameters.whiteboardStarted;
const whiteboardData = parameters.whiteboardUsers;
```

### Utility Methods

```javascript
// Check permissions
const hasPermission = await parameters.checkPermission({
  permissionType: 'video', // or 'audio'
  parameters
});

// Format large numbers
const formatted = parameters.formatNumber(1250000); // Returns "1.25M"

// Sleep/delay
await parameters.sleep({ ms: 1000 });

// Update display settings
parameters.updateMainWindow(true); // Show/hide main window

// Trigger layout recalculation
parameters.onScreenChanges({ changed: true, parameters });

// Get room information
const roomInfo = {
  name: parameters.roomName,
  host: parameters.host,
  capacity: parameters.capacity,
  eventType: parameters.eventType,
  duration: parameters.duration
};
```

**Complete method documentation:** Visit [mediasfu.com/reactjs](https://www.mediasfu.com/reactjs/) for detailed documentation on all 200+ methods.

---

## Media Streams & Participants <a name="media-streams--participants"></a>

Understanding how to work with media streams and participant data is crucial for building custom features.

### Understanding Participants

```javascript
// Participant object structure
{
  id: string;              // Unique identifier
  name: string;            // Display name
  muted: boolean;          // Audio state
  videoOn: boolean;        // Video state
  audioID: string | null;  // Audio producer ID
  videoID: string | null;  // Video producer ID
  islevel: string;         // '2' = host, '1' = co-host, '0' = participant
  // ... more properties
}

// Accessing participants
const participants = parameters.participants;

// Filter participants by criteria
const videoParticipants = participants.filter(p => p.videoOn);
const hosts = participants.filter(p => p.islevel === '2');

// Find specific participant
const participant = participants.find(p => p.id === 'participant-id');
```

### Working with Streams

```javascript
// Stream object structure
{
  producerId: string;      // Producer identifier
  stream: MediaStream;     // Actual media stream
  kind: string;           // 'video' or 'audio'
  producerId: string;     // Associated producer ID
  // ... more properties
}

// Get all video streams
const videoStreams = parameters.allVideoStreams;

// Get all audio streams
const audioStreams = parameters.allAudioStreams;

// Find stream by producer ID
const stream = videoStreams.find(s => s.producerId === 'producer-id');
```

### Using the New Utility Methods

```javascript
// Get specific participant's video stream
const videoStream = await parameters.getParticipantMedia({
  id: 'participant-id',
  name: 'John Doe',
  kind: 'video'
});

// Get specific participant's audio stream
const audioStream = await parameters.getParticipantMedia({
  name: 'Alice Smith',
  kind: 'audio'
});

// Example: Display specific participant's video
function ParticipantSpotlight({ participantName, parameters }) {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const loadStream = async () => {
      const mediaStream = await parameters.getParticipantMedia({
        name: participantName,
        kind: 'video'
      });
      setStream(mediaStream);
    };
    loadStream();
  }, [participantName]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      <h3>{participantName}'s Video</h3>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%' }} />
    </div>
  );
}
```

### Monitoring Participant State Changes

```javascript
// Listen for participant updates
parameters.updateParticipants = (updatedParticipants) => {
  console.log('Participants updated:', updatedParticipants);
  // Handle participant changes
};

// Example: Participant counter
function ParticipantCounter({ parameters }) {
  return (
    <div>
      <span>👥 {parameters.participantsCounter} participants</span>
      <span>🎥 {parameters.participants.filter(p => p.videoOn).length} with video</span>
      <span>🔇 {parameters.participants.filter(p => p.muted).length} muted</span>
    </div>
  );
}
```

### Advanced Stream Management

```javascript
// Custom grid with specific participants
function CustomParticipantGrid({ parameters }) {
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const renderParticipantVideo = (participant) => {
    if (!participant.videoID) return null;

    const stream = parameters.allVideoStreams.find(
      s => s.producerId === participant.videoID
    );

    return (
      <video
        key={participant.id}
        ref={videoRef => {
          if (videoRef && stream?.stream) {
            videoRef.srcObject = stream.stream;
            videoRef.play();
          }
        }}
        autoPlay
        playsInline
        muted
        style={{ width: '200px', height: '150px' }}
      />
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
      {selectedParticipants.map(participant => (
        <div key={participant.id}>
          {renderParticipantVideo(participant)}
          <p>{participant.name}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Customization & Styling <a name="customization--styling"></a>

Make MediaSFU match your brand and design requirements.

### 1. Customizing the Pre-Join Page

Replace the default pre-join page with your own:

```javascript
import { MediasfuGeneric } from 'mediasfu-reactjs';

function CustomPreJoinPage({ parameters, credentials }) {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');

  const joinRoom = async () => {
    // Your validation logic
    if (!name || !roomId) {
      alert('Please enter your name and room ID');
      return;
    }

    // Join the room
    parameters.updateMember(name);
    parameters.updateRoomName(roomId);
    parameters.updateValidated(true);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <img src="/your-logo.png" alt="Logo" style={{ width: 150, marginBottom: 40 }} />
      
      <h1 style={{ color: 'white', marginBottom: 30 }}>Welcome to Our Meeting</h1>
      
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: '12px 20px',
          marginBottom: 15,
          width: 300,
          borderRadius: 8,
          border: 'none'
        }}
      />
      
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{
          padding: '12px 20px',
          marginBottom: 20,
          width: 300,
          borderRadius: 8,
          border: 'none'
        }}
      />
      
      <button
        onClick={joinRoom}
        style={{
          padding: '14px 40px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: 18,
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Join Meeting
      </button>
    </div>
  );
}

// Use it
function App() {
  return (
    <MediasfuGeneric 
      credentials={credentials}
      PrejoinPage={CustomPreJoinPage}
    />
  );
}
```

### 2. Custom Control Buttons

Create your own control bar:

```javascript
function CustomControls({ parameters }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 15,
      background: 'rgba(0, 0, 0, 0.8)',
      padding: 20,
      borderRadius: 15,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      {/* Video button */}
      <button
        onClick={() => parameters.clickVideo({ parameters })}
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: 'none',
          background: parameters.videoAlreadyOn ? '#4CAF50' : '#f44336',
          color: 'white',
          fontSize: 24,
          cursor: 'pointer'
        }}
      >
        📹
      </button>
      
      {/* Audio button */}
      <button
        onClick={() => parameters.clickAudio({ parameters })}
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: 'none',
          background: parameters.audioAlreadyOn ? '#4CAF50' : '#f44336',
          color: 'white',
          fontSize: 24,
          cursor: 'pointer'
        }}
      >
        {parameters.audioAlreadyOn ? '🎤' : '🔇'}
      </button>
      
      {/* Screen share button */}
      <button
        onClick={() => parameters.clickScreenShare({ parameters })}
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: 'none',
          background: parameters.screenAlreadyOn ? '#2196F3' : '#666',
          color: 'white',
          fontSize: 24,
          cursor: 'pointer'
        }}
      >
        🖥️
      </button>
      
      {/* Leave button */}
      <button
        onClick={() => parameters.launchConfirmExit({ parameters })}
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: 'none',
          background: '#f44336',
          color: 'white',
          fontSize: 24,
          cursor: 'pointer'
        }}
      >
        📞
      </button>
    </div>
  );
}
```

### 3. Themed Application

Apply your app's theme to MediaSFU:

```javascript
import { MediasfuGeneric } from 'mediasfu-reactjs';
import './custom-theme.css';

function App() {
  return (
    <div className="themed-app">
      <MediasfuGeneric 
        credentials={credentials}
        // Custom styles for container
        containerStyle={{
          backgroundColor: '#1a1a2e',
          borderRadius: '15px',
          overflow: 'hidden'
        }}
        
        // Custom card components
        customVideoCard={CustomVideoCard}
        customAudioCard={CustomAudioCard}
        customMiniCard={CustomMiniCard}
      />
    </div>
  );
}

// custom-theme.css
/*
.themed-app {
  --primary-color: #6c5ce7;
  --secondary-color: #a29bfe;
  --background-color: #1a1a2e;
  --text-color: #ffffff;
}

.themed-app button {
  background: var(--primary-color);
  color: var(--text-color);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.themed-app button:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}
*/
```

### 4. Complete Custom UI Example

Here's a complete example combining everything:

```javascript
import React, { useState } from 'react';
import {
  MediasfuGeneric,
  FlexibleVideo,
  FlexibleGrid,
  AudioGrid
} from 'mediasfu-reactjs';

function CompleteCustomInterface({ parameters }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#0f0f1e'
    }}>
      {/* Custom Header */}
      <header style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>{parameters.roomName}</h1>
        <div>
          <span>👥 {parameters.participantsCounter} participants</span>
          <span style={{ marginLeft: 20 }}>
            ⏱️ {Math.floor(parameters.recordElapsedTime / 60)}:{(parameters.recordElapsedTime % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Video Area */}
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column', padding: 20 }}>
          <FlexibleVideo
            customWidth={window.innerWidth * 0.7}
            customHeight={window.innerHeight * 0.5}
            parameters={parameters}
          />
          
          <div style={{ marginTop: 20 }}>
            <FlexibleGrid
              customWidth={window.innerWidth * 0.7}
              customHeight={window.innerHeight * 0.3}
              parameters={parameters}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{
          flex: 1,
          background: '#1a1a2e',
          padding: 20,
          overflowY: 'auto'
        }}>
          <h3 style={{ color: 'white' }}>Participants</h3>
          {parameters.participants.map(participant => (
            <div key={participant.id} style={{
              padding: 10,
              margin: '10px 0',
              background: '#2a2a3e',
              borderRadius: 8,
              color: 'white'
            }}>
              {participant.name}
              {participant.muted && ' 🔇'}
              {participant.videoOn && ' 📹'}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Controls */}
      <div style={{
        padding: 20,
        background: '#1a1a2e',
        display: 'flex',
        justifyContent: 'center',
        gap: 15
      }}>
        <button onClick={() => parameters.clickVideo({ parameters })}>
          {parameters.videoAlreadyOn ? '📹 Stop Video' : '📹 Start Video'}
        </button>
        <button onClick={() => parameters.clickAudio({ parameters })}>
          {parameters.audioAlreadyOn ? '🎤 Mute' : '🎤 Unmute'}
        </button>
        <button onClick={() => parameters.clickScreenShare({ parameters })}>
          🖥️ Share Screen
        </button>
        <button onClick={() => parameters.updateIsMessagesModalVisible(true)}>
          💬 Chat
        </button>
        <button onClick={() => parameters.launchConfirmExit({ parameters })} style={{ background: '#f44336' }}>
          📞 Leave
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <MediasfuGeneric 
      credentials={credentials}
      customComponent={CompleteCustomInterface}
    />
  );
}

export default App;
```

---

# Basic Usage Guide <a name="basic-usage-guide"></a>

A basic guide on how to use the module for common tasks.

This section will guide users through the initial setup and installation of the npm module.

## Introduction

MediaSFU is a 2-page application consisting of a prejoin/welcome page and the main events room page. This guide will walk you through the basic usage of the module for setting up these pages.

### Documentation Reference

For comprehensive documentation on the available methods, components, and functions, please visit [mediasfu.com](https://www.mediasfu.com/reactjs/). This resource provides detailed information for this guide and additional documentation.

## Prebuilt Event Rooms

MediaSFU provides prebuilt event rooms for various purposes. These rooms are rendered as full pages and can be easily imported and used in your application. Here are the available prebuilt event rooms:

1. **MediasfuGeneric**: A generic event room suitable for various types of events.
2. **MediasfuBroadcast**: A room optimized for broadcasting events.
3. **MediasfuWebinar**: Specifically designed for hosting webinars.
4. **MediasfuConference**: Ideal for hosting conferences.
5. **MediasfuChat**: A room tailored for interactive chat sessions.

Users can easily pick an interface and render it in their app.

If no API credentials are provided, a default home page will be displayed where users can scan or manually enter the event details.

To use these prebuilt event rooms, simply import them into your application:

```javascript
import { MediasfuGeneric, MediasfuBroadcast, MediasfuWebinar, MediasfuConference, MediasfuChat } from 'mediasfu-reactjs';
```

## Simplest Usage

The simplest way to use MediaSFU is by directly rendering a prebuilt event room component, such as MediasfuGeneric:

```javascript
import { MediasfuGeneric } from 'mediasfu-reactjs';

const App = () => {
  return (
    <MediasfuGeneric />
  );
}

export default App;
```

## Quick Customization (Dead Simple!)

Want to customize your MediaSFU experience? Here are three **super easy** approaches:

### 🎨 **Custom Styling (2 lines of code)**
```javascript
<MediasfuGeneric 
  containerStyle={{ backgroundColor: '#1a1a2e', borderRadius: '15px' }} 
/>
```

### 🖼️ **Custom Video Cards (Replace how videos look)**
```javascript
const MyVideoCard = ({ stream, name }) => (
  <div style={{ border: '3px solid #00ff88', borderRadius: '10px' }}>
    <video ref={video => {
      if (video && stream) {
        video.srcObject = stream;
        video.play();
      }
    }} style={{ width: '100%' }} autoPlay muted />
    <div style={{ background: '#00ff88', color: 'black', padding: '5px' }}>
      {name} ✨
    </div>
  </div>
);

<MediasfuGeneric customVideoCard={MyVideoCard} />
```

### 🔧 **Complete Custom UI (Your own interface)**
```javascript
const App = () => {
  const [mediasfuFunctions, setMediasfuFunctions] = useState({});
  
  return (
    <div>
      <MediasfuGeneric 
        returnUI={false}
        noUIPreJoinOptions={{ action: 'create', userName: 'Me', capacity: 10, duration: 30, eventType: 'conference' }}
        updateSourceParameters={setMediasfuFunctions}
      />
      
      {/* Your completely custom UI */}
      <button onClick={() => mediasfuFunctions.clickVideo?.(mediasfuFunctions)}>
        Toggle My Video
      </button>
      <button onClick={() => mediasfuFunctions.clickAudio?.(mediasfuFunctions)}>
        Toggle My Audio  
      </button>
    </div>
  );
};
```

That's it! **No complex setup, no config files** - just pass a prop and customize away. 🚀

---

### Programmatically Fetching Tokens  

If you want to fetch the required tokens programmatically without visiting MediaSFU's website, you can use the `PreJoinPage` component and pass your credentials as props:  

```javascript
import { MediasfuGeneric, PreJoinPage } from 'mediasfu-reactjs';

const App = () => {
  const credentials = { apiUserName: "yourAPIUserName", apiKey: "yourAPIKey" };

  return (
    <MediasfuGeneric PrejoinPage={PreJoinPage} credentials={credentials} />
  );
}

export default App;
```

### When to Use an API Key  

- **Using MediaSFU Cloud as the Main Server**:  
  If you're relying on MediaSFU Cloud as your primary server or require its services for egress like recording, you **must provide an API key**. This key authenticates your application and ensures proper integration with MediaSFU Cloud services.  

- **Not Using MediaSFU Cloud**:  
  If you're hosting your own server or are working in local development without MediaSFU Cloud services, **an API key is not required**. In such cases, you can still use the `PreJoinPage` component, but the integration will be limited to your self-hosted setup.  

This flexibility allows developers to adapt the setup based on their infrastructure, whether leveraging MediaSFU's cloud capabilities or opting for a self-managed approach.

<div style="text-align: center;">

### Preview of Welcome Page

<img src="https://mediasfu.com/images/prejoin.png" alt="Preview of Welcome Page" title="Welcome Page" style="max-height: 500px;">

<!-- Add a blank line for spacing -->
&nbsp;

### Preview of Prejoin Page

<img src="https://mediasfu.com/images/prejoin3.png" alt="Preview of Prejoin Page" title="Prejoin Page" style="max-height: 500px;">

</div>




## Custom Welcome/Prejoin Page

Alternatively, you can design your own welcome/prejoin page. The core function of this page is to fetch user tokens from MediaSFU's API and establish a connection with the returned link if valid.

### Parameters Passed to Custom Page

MediaSFU passes relevant parameters to the custom welcome/prejoin page:

```javascript
let { showAlert, updateIsLoadingModalVisible, connectSocket, updateSocket, updateValidated,
     updateApiUserName, updateApiToken, updateLink, updateRoomName, updateMember } = parameters;
```

Ensure that your custom page implements the following updates:

```javascript
updateSocket(socket);
updateLocalSocket(socket);
updateApiUserName(apiUserName);
updateApiToken(apiToken);
updateLink(link);
updateRoomName(apiUserName);
updateMember(userName);
updateValidated(true);
```

See the following code for the PreJoinPage page logic:

```typescript
import React, { useState, useRef, useEffect } from "react";
import {
  ConnectSocketType,
  ShowAlert,
  ConnectLocalSocketType,
  ResponseLocalConnection,
  ResponseLocalConnectionData,
  RecordingParams,
  MeetingRoomParams,
  CreateMediaSFURoomOptions,
  JoinMediaSFURoomOptions,
} from "../../@types/types";
import { checkLimitsAndMakeRequest } from "../../methods/utils/checkLimitsAndMakeRequest";
import { createRoomOnMediaSFU } from '../../methods/utils/createRoomOnMediaSFU';
import { CreateRoomOnMediaSFUType, JoinRoomOnMediaSFUType, joinRoomOnMediaSFU } from "../../methods/utils/joinRoomOnMediaSFU";
import { Socket } from "socket.io-client";
import { CSSProperties } from "react";

const apiKey = "yourAPIKEY";
const apiUserName = "yourAPIUSERNAME";
const user_credentials = { apiUserName, apiKey };

export interface JoinLocalEventRoomParameters {
  eventID: string;
  userName: string;
  secureCode?: string;
  videoPreference?: string | null;
  audioPreference?: string | null;
  audioOutputPreference?: string | null;
}

export interface JoinLocalEventRoomOptions {
  joinData: JoinLocalEventRoomParameters;
  link?: string;
}

export interface CreateLocalRoomParameters {
  eventID: string;
  duration: number;
  capacity: number;
  userName: string;
  scheduledDate: Date;
  secureCode: string;
  waitRoom?: boolean;
  recordingParams?: RecordingParams;
  eventRoomParams?: MeetingRoomParams;
  videoPreference?: string | null;
  audioPreference?: string | null;
  audioOutputPreference?: string | null;
  mediasfuURL?: string;
}
export interface CreateLocalRoomOptions {
  createData: CreateLocalRoomParameters;
  link?: string;
}

export interface CreateJoinLocalRoomResponse {
  success: boolean;
  secret: string;
  reason?: string;
  url?: string;
}

// Type definitions for parameters and credentials
export interface PreJoinPageParameters {
  imgSrc?: string;
  showAlert?: ShowAlert;
  updateIsLoadingModalVisible: (visible: boolean) => void;
  connectSocket: ConnectSocketType;
  connectLocalSocket?: ConnectLocalSocketType;
  updateSocket: (socket: Socket) => void;
  updateLocalSocket?: (socket: Socket) => void;
  updateValidated: (validated: boolean) => void;
  updateApiUserName: (userName: string) => void;
  updateApiToken: (token: string) => void;
  updateLink: (link: string) => void;
  updateRoomName: (roomName: string) => void;
  updateMember: (member: string) => void;
}

export interface Credentials {
  apiUserName: string;
  apiKey: string;
}

export interface PreJoinPageOptions {
  localLink?: string;
  connectMediaSFU?: boolean;
  parameters: PreJoinPageParameters;
  credentials?: Credentials;
  returnUI?: boolean;
  noUIPreJoinOptions?: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
  createMediaSFURoom?: CreateRoomOnMediaSFUType;
  joinMediaSFURoom?: JoinRoomOnMediaSFUType;
}

export type PreJoinPageType = (options: PreJoinPageOptions) => React.JSX.Element;

/**
 * PreJoinPage component allows users to either create a new room or join an existing one.
 *
 * @component
 * @param {PreJoinPageOptions} props - The properties for the PreJoinPage component.
 * @param {PreJoinPageParameters} props.parameters - Various parameters required for the component.
 * @param {ShowAlert} [props.parameters.showAlert] - Function to show alert messages.
 * @param {() => void} props.parameters.updateIsLoadingModalVisible - Function to update the loading modal visibility.
 * @param {ConnectSocketType} props.parameters.connectSocket - Function to connect to the socket.
 * @param {Socket} props.parameters.updateSocket - Function to update the socket.
 * @param {() => void} props.parameters.updateValidated - Function to update the validation status.
 * @param {string} [props.parameters.imgSrc] - The source URL for the logo image.
 * @param {Credentials} [props.credentials=user_credentials] - The user credentials containing the API username and API key.
 * @param {boolean} [props.returnUI=false] - Flag to determine if the component should return the UI.
 * @param {CreateMediaSFURoomOptions | JoinMediaSFURoomOptions} [props.noUIPreJoinOptions] - The options for creating/joining a room without UI.
 * @param {string} [props.localLink=""] - The link to the local server.
 * @param {boolean} [props.connectMediaSFU=true] - Flag to determine if the component should connect to MediaSFU.
 * @param {CreateRoomOnMediaSFUType} [props.createMediaSFURoom] - Function to create a room on MediaSFU.
 * @param {JoinRoomOnMediaSFUType} [props.joinMediaSFURoom] - Function to join a room on MediaSFU.
 *
 * @returns {React.JSX.Element} The rendered PreJoinPage component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { PreJoinPage } from 'mediasfu-reactjs';
 * import { JoinLocalRoomOptions } from 'mediasfu-reactjs';
 *
 * const App = () => {
 *   const showAlertFunction = (message: string) => console.log(message);
 *   const updateLoadingFunction = (visible: boolean) => console.log(`Loading: ${visible}`);
 *   const connectSocketFunction = () => {}; // Connect socket function
 *   const updateSocketFunction = (socket: Socket) => {}; // Update socket function
 *   const updateValidatedFunction = (validated: boolean) => {}; // Update validated function
 *   const updateApiUserNameFunction = (userName: string) => {}; // Update API username function
 *   const updateApiTokenFunction = (token: string) => {}; // Update API token function
 *   const updateLinkFunction = (link: string) => {}; // Update link function
 *   const updateRoomNameFunction = (roomName: string) => {}; // Update room name function
 *   const updateMemberFunction = (member: string) => {}; // Update member function
 *
 *   return (
 *     <PreJoinPage
 *       parameters={{
 *         showAlert: showAlertFunction,
 *         updateIsLoadingModalVisible: updateLoadingFunction,
 *         connectSocket: connectSocketFunction,
 *         updateSocket: updateSocketFunction,
 *         updateValidated: updateValidatedFunction,
 *         updateApiUserName: updateApiUserNameFunction,
 *         updateApiToken: updateApiTokenFunction,
 *         updateLink: updateLinkFunction,
 *         updateRoomName: updateRoomNameFunction,
 *         updateMember: updateMemberFunction,
 *         imgSrc: "https://example.com/logo.png"
 *       }}
 *       credentials={{
 *         apiUserName: "user123",
 *         apiKey: "apikey123"
 *       }}
 *      returnUI={true} 
 *      noUIPreJoinOptions={{
 *      action: "create",
 *      capacity: 10,
 *      duration: 15,
 *      eventType: "broadcast",
 *      userName: "Prince",
 *      }}
 *      connectMediaSFU={true}
 *      localLink="http://localhost:3000"
 *     />
 *   );
 * };
 *
 *
 * export default App;
 * ```
 */

const PreJoinPage: React.FC<PreJoinPageOptions> = ({
  localLink = "",
  connectMediaSFU = true,
  parameters,
  credentials = user_credentials,
  returnUI = false,
  noUIPreJoinOptions,
  createMediaSFURoom = createRoomOnMediaSFU,
  joinMediaSFURoom = joinRoomOnMediaSFU,
}) => {
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [eventID, setEventID] = useState<string>("");
  const [error, setError] = useState<string>("");
  const pending = useRef(false);

  const localConnected = useRef(false);
  const localData = useRef<ResponseLocalConnectionData | undefined>(undefined);
  const initSocket = useRef<Socket | undefined>(undefined);

  const {
    showAlert,
    updateIsLoadingModalVisible,
    connectLocalSocket,
    updateSocket,
    updateValidated,
    updateApiUserName,
    updateApiToken,
    updateLink,
    updateRoomName,
    updateMember,
  } = parameters;

  const handleCreateRoom = async () => {
    if (pending.current) {
      return;
    }
    pending.current = true;
    let payload = {} as CreateMediaSFURoomOptions;
    if (returnUI) {
      if (!name || !duration || !eventType || !capacity) {
        setError("Please fill all the fields.");
        return;
      }
      payload = {
        action: "create",
        duration: parseInt(duration),
        capacity: parseInt(capacity),
        eventType: eventType as "chat" | "broadcast" | "webinar" | "conference",
        userName: name,
        recordOnly: false,
      };
    } else {
      if (
        noUIPreJoinOptions &&
        "action" in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === "create"
      ) {
        payload = noUIPreJoinOptions as CreateMediaSFURoomOptions;
      } else {
        pending.current = false;
        throw new Error(
          "Invalid options provided for creating a room without UI."
        );
      }
    }

    updateIsLoadingModalVisible(true);

    if (localLink.length > 0) {
      const secureCode =
        Math.random().toString(30).substring(2, 14) +
        Math.random().toString(30).substring(2, 14);
      let eventID =
        new Date().getTime().toString(30) +
        new Date().getUTCMilliseconds() +
        Math.floor(10 + Math.random() * 99).toString();
      eventID = "m" + eventID;
      const eventRoomParams = localData.current?.meetingRoomParams_;
      eventRoomParams!.type = eventType as
        | "chat"
        | "broadcast"
        | "webinar"
        | "conference";

      const createData: CreateLocalRoomParameters = {
        eventID: eventID,
        duration: parseInt(duration),
        capacity: parseInt(capacity),
        userName: payload.userName,
        scheduledDate: new Date(),
        secureCode: secureCode,
        waitRoom: false,
        recordingParams: localData.current?.recordingParams_,
        eventRoomParams: eventRoomParams,
        videoPreference: null,
        audioPreference: null,
        audioOutputPreference: null,
        mediasfuURL: "",
      };

      // socket in main window is required and for no local room, no use of initSocket
      // for local room, initSocket becomes the local socket, and localSocket is the connection to MediaSFU (if connectMediaSFU is true)
      // else localSocket is the same as initSocket

      if (
        connectMediaSFU &&
        initSocket.current &&
        localData.current &&
        localData.current.apiUserName &&
        localData.current.apiKey
      ) {
        payload.recordOnly = true; // allow production to mediasfu only; no consumption
        const response = await roomCreator({
          payload,
          apiUserName: localData.current.apiUserName,
          apiKey: localData.current.apiKey,
          validate: false,
        });
        if (
          response &&
          response.success &&
          response.data &&
          "roomName" in response.data
        ) {
          createData.eventID = response.data.roomName;
          createData.secureCode = response.data.secureCode || "";
          createData.mediasfuURL = response.data.publicURL;
          await createLocalRoom({
            createData: createData,
            link: response.data.link,
          });
        } else {
          pending.current = false;
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room on MediaSFU.`);
          try {
            updateSocket(initSocket.current);
            await createLocalRoom({ createData: createData });
            pending.current = false;
          } catch (error) {
            pending.current = false;
            updateIsLoadingModalVisible(false);
            setError(`Unable to create room. ${error}`);
          }
        }
      } else {
        try {
          updateSocket(initSocket.current!);
          await createLocalRoom({ createData: createData });
          pending.current = false;
        } catch (error) {
          pending.current = false;
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room. ${error}`);
        }
      }
    } else {
      await roomCreator({
        payload,
        apiUserName: credentials.apiUserName,
        apiKey: credentials.apiKey,
        validate: true,
      });
      pending.current = false;
    }
  };

  const handleJoinRoom = async () => {
    if (pending.current) {
      return;
    }
    pending.current = true;
    let payload = {} as JoinMediaSFURoomOptions;
    if (returnUI) {
      if (!name || !eventID) {
        setError("Please fill all the fields.");
        return;
      }

      payload = {
        action: "join",
        meetingID: eventID,
        userName: name,
      };
    } else {
      if (
        noUIPreJoinOptions &&
        "action" in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === "join"
      ) {
        payload = noUIPreJoinOptions as JoinMediaSFURoomOptions;
      } else {
        throw new Error(
          "Invalid options provided for joining a room without UI."
        );
      }
    }
  
    if (localLink.length > 0 && !localLink.includes("mediasfu.com")) {
      const joinData: JoinLocalEventRoomParameters = {
        eventID: eventID,
        userName: payload.userName,
        secureCode: "",
        videoPreference: null,
        audioPreference: null,
        audioOutputPreference: null,
      };

      await joinLocalRoom({ joinData: joinData });
      pending.current = false;
      return;
    }

    updateIsLoadingModalVisible(true);

    const response = await joinMediaSFURoom({
      payload,
      apiUserName: credentials.apiUserName,
      apiKey: credentials.apiKey,
      localLink: localLink,
    });
    if (response.success && response.data && "roomName" in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response.data.link,
        userName: payload.userName,
        parameters: parameters,
      });
      pending.current = false;
    } else {
      pending.current = false;
      updateIsLoadingModalVisible(false);
      setError(
        `Unable to join room. ${
          response.data
            ? "error" in response.data
              ? response.data.error
              : ""
            : ""
        }`
      );
    }
  };

  const joinLocalRoom = async ({
    joinData,
    link = localLink,
  }: JoinLocalEventRoomOptions) => {
    initSocket.current?.emit(
      "joinEventRoom",
      joinData,
      (response: CreateJoinLocalRoomResponse) => {
        if (response.success) {
          updateSocket(initSocket.current!);
          updateApiUserName(localData.current?.apiUserName || "");
          updateApiToken(response.secret);
          updateLink(link);
          updateRoomName(joinData.eventID);
          updateMember(joinData.userName);
          updateIsLoadingModalVisible(false);
          updateValidated(true);
        } else {
          updateIsLoadingModalVisible(false);
          setError(`Unable to join room. ${response.reason}`);
        }
      }
    );
  };

  const createLocalRoom = async ({
    createData,
    link = localLink,
  }: CreateLocalRoomOptions) => {
    initSocket.current?.emit(
      "createRoom",
      createData,
      (response: CreateJoinLocalRoomResponse) => {
        if (response.success) {
          updateSocket(initSocket.current!);
          updateApiUserName(localData.current?.apiUserName || "");
          updateApiToken(response.secret);
          updateLink(link);
          updateRoomName(createData.eventID);
          // local needs islevel updated from here
          // we update member as `userName` + "_2" and split it in the room
          updateMember(createData.userName + "_2");
          updateIsLoadingModalVisible(false);
          updateValidated(true);
        } else {
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room. ${response.reason}`);
        }
      }
    );
  };

  const roomCreator = async ({
    payload,
    apiUserName,
    apiKey,
    validate = true,
  }: {
    payload: any;
    apiUserName: string;
    apiKey: string;
    validate?: boolean;
  }) => {
    const response = await createMediaSFURoom({
      payload,
      apiUserName: apiUserName,
      apiKey: apiKey,
      localLink: localLink,
    });
    if (response.success && response.data && "roomName" in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response!.data.link,
        userName: payload.userName,
        parameters: parameters,
        validate: validate,
      });
      return response;
    } else {
      updateIsLoadingModalVisible(false);
      setError(
        `Unable to create room. ${
          response.data
            ? "error" in response.data
              ? response.data.error
              : ""
            : ""
        }`
      );
    }
  };

  const checkProceed = async ({
    returnUI,
    noUIPreJoinOptions,
  }: {
    returnUI: boolean;
    noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
  }) => {
    if (!returnUI && noUIPreJoinOptions) {
      if (
        "action" in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === "create"
      ) {
        // update all the required parameters and call
        const createOptions: CreateMediaSFURoomOptions =
          noUIPreJoinOptions as CreateMediaSFURoomOptions;
        if (
          !createOptions.userName ||
          !createOptions.duration ||
          !createOptions.eventType ||
          !createOptions.capacity
        ) {
          throw new Error(
            "Please provide all the required parameters: userName, duration, eventType, capacity"
          );
        }

        await handleCreateRoom();
      } else if (
        "action" in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === "join"
      ) {
        // update all the required parameters and call
        const joinOptions: JoinMediaSFURoomOptions =
          noUIPreJoinOptions as JoinMediaSFURoomOptions;
        if (!joinOptions.userName || !joinOptions.meetingID) {
          throw new Error(
            "Please provide all the required parameters: userName, meetingID"
          );
        }

        await handleJoinRoom();
      } else {
        throw new Error(
          "Invalid options provided for creating/joining a room without UI."
        );
      }
    }
  };

  useEffect(() => {
    if (
      localLink.length > 0 &&
      !localConnected.current &&
      !initSocket.current
    ) {
      try {
        connectLocalSocket?.({ link: localLink })
          .then((response: ResponseLocalConnection | undefined) => {
            localData.current = response!.data;
            initSocket.current = response!.socket;
            localConnected.current = true;

            if (!returnUI && noUIPreJoinOptions) {
              checkProceed({ returnUI, noUIPreJoinOptions });
            }
          })
          .catch((error) => {
            showAlert?.({
              message: `Unable to connect to ${localLink}. ${error}`,
              type: "danger",
              duration: 3000,
            });
          });
      } catch {
        showAlert?.({
          message: `Unable to connect to ${localLink}. Something went wrong.`,
          type: "danger",
          duration: 3000,
        });
      }
    } else if (localLink.length === 0 && !initSocket.current) {
      if (!returnUI && noUIPreJoinOptions) {
        checkProceed({ returnUI, noUIPreJoinOptions });
      }
    }
  }, []);

  const handleToggleMode = () => {
    setIsCreateMode(!isCreateMode);
    setError("");
  };

  if (!returnUI) {
    return <></>;
  }

  return (
    // your JSX Element
  );

export default PreJoinPage;

  ```


### IP Blockage Warning And Local UI Development

Entering the event room without the correct credentials may result in IP blockage, as the page automatically attempts to connect with MediaSFU servers, which rate limit bad requests based on IP address.

If users attempt to enter the event room without valid credentials or tokens, it may lead to IP blockage due to MediaSFU servers' rate limiting mechanism. To avoid unintentional connections to MediaSFU servers during UI development, users can pass the `useLocalUIMode` parameter as `true`.

In this mode, the module will operate locally without making requests to MediaSFU servers. However, to render certain UI elements such as messages, participants, requests, etc., users may need to provide seed data. They can achieve this by importing random data generators and passing the generated data to the event room component.

### Example for Broadcast Room

```typescript
import { MediasfuBroadcast, generateRandomParticipants, generateRandomMessages } from 'mediasfu-reactjs';

/**
 * App Component
 *
 * This component demonstrates how to:
 * - Configure credentials for MediaSFU Cloud and/or Community Edition (CE).
 * - Use MediaSFU with or without a custom server.
 * - Integrate a pre-join page.
 * - Return no UI and manage state through sourceParameters, allowing a fully custom frontend.
 *
 * Basic instructions:
 * 1. Set `localLink` to your CE server if you have one, or leave it blank to use MediaSFU Cloud.
 * 2. Set `connectMediaSFU` to determine whether you're connecting to MediaSFU Cloud services.
 * 3. Provide credentials if using MediaSFU Cloud (dummy credentials are acceptable in certain scenarios).
 * 4. If you prefer a custom UI, set `returnUI` to false and handle all interactions via `sourceParameters` and `updateSourceParameters`.
 * 5. For secure production usage, consider using custom `createMediaSFURoom` and `joinMediaSFURoom` functions to forward requests through your backend.
 */

const App = () => {
  // =========================================================
  //                API CREDENTIALS CONFIGURATION
  // =========================================================
  //
  // Scenario A: Not using MediaSFU Cloud at all.
  // - No credentials needed. Just set localLink to your CE server.
  // Example:
  /*
  const credentials = {};
  const localLink = 'http://your-ce-server.com'; // http://localhost:3000 for local testing
  const connectMediaSFU = localLink.trim() !== '';
  */

  // Scenario B: Using MediaSFU CE + MediaSFU Cloud for Egress only.
  // - Use dummy credentials (8 chars for userName, 64 chars for apiKey).
  // - Your CE backend will forward requests with your real credentials.
  /*
  const credentials = {
    apiUserName: 'dummyUsr',
    apiKey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  };
  const localLink = 'http://your-ce-server.com'; // http://localhost:3000 for local testing
  const connectMediaSFU = localLink.trim() !== '';
  */

  // Scenario C: Using MediaSFU Cloud without your own server.
  // - For development, use your actual or dummy credentials.
  // - In production, securely handle credentials server-side and use custom room functions.
  const credentials = {
    apiUserName: 'yourDevUser', // 8 chars recommended for dummy
    apiKey: 'yourDevApiKey1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // 64 chars
  };
  const localLink = ''; // Leave empty if not using your own server
  const connectMediaSFU = true; // Set to true if using MediaSFU Cloud since localLink is empty

  // =========================================================
  //                    UI RENDERING OPTIONS
  // =========================================================
  //
  // If you want a fully custom UI (e.g., a custom layout inspired by WhatsApp):
  // 1. Set `returnUI = false` to prevent the default MediaSFU UI from rendering.
  // 2. Provide `noUIPreJoinOptions` to simulate what would have been entered on a pre-join page.
  // 3. Use `sourceParameters` and `updateSourceParameters` to access and update state/actions.
  // 4. No need for any of the above if you're using the default MediaSFU UI.
  //
  // Example noUIPreJoinOptions:
  const noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions = {
    action: 'create',
    capacity: 10,
    duration: 15,
    eventType: 'broadcast',
    userName: 'Prince',
  };

  // Example for joining a room:
  // const noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions = {
  //   action: 'join',
  //   userName: 'Prince',
  //   meetingID: 'yourMeetingID'
  // };

  const [sourceParameters, setSourceParameters] = useState<{ [key: string]: any }>({});
  const updateSourceParameters = (data: { [key: string]: any }) => {
    setSourceParameters(data);
  };

  // =========================================================
  //                CUSTOM ROOM FUNCTIONS (OPTIONAL)
  // =========================================================
  //
  // To securely forward requests to MediaSFU:
  // - Implement custom `createMediaSFURoom` and `joinMediaSFURoom` functions.
  // - These functions send requests to your server, which then communicates with MediaSFU Cloud.
  //
  // Already imported `createRoomOnMediaSFU` and `joinRoomOnMediaSFU` are examples.
  //
  // If using MediaSFU CE backend, ensure your server endpoints:
  // - Validate dummy credentials.
  // - Forward requests to mediasfu.com with real credentials.

  // =========================================================
  //              DEPRECATED FEATURES (SEED DATA)
  // =========================================================
  //
  // Deprecated Feature: useLocalUIMode
  // This feature is deprecated due to updates for strong typing.
  // It is no longer required and should not be used in new implementations.
  //
  // Uncomment and configure the following section if you intend to use seed data
  // for generating random participants and messages.
  //
  // Note: This is deprecated and maintained only for legacy purposes.
  /*
  const useSeed = false;
  let seedData = {};

  if (useSeed) {
    const memberName = 'Prince';
    const hostName = 'Fred';

    const participants_ = generateRandomParticipants({
      member: memberName,
      coHost: '',
      host: hostName,
      forChatBroadcast: eventType === 'broadcast' || eventType === 'chat',
    });

    const messages_ = generateRandomMessages({
      participants: participants_,
      member: memberName,
      host: hostName,
      forChatBroadcast: eventType === 'broadcast' || eventType === 'chat',
    });

    const requests_ = generateRandomRequestList({
      participants: participants_,
      hostName: memberName,
      coHostName: '',
      numberOfRequests: 3,
    });

    const waitingList_ = generateRandomWaitingRoomList();

    seedData = {
      participants: participants_,
      messages: messages_,
      requests: requests_,
      waitingList: waitingList_,
      member: memberName,
      host: hostName,
      eventType: eventType,
    };
  }
  */

  // =========================================================
  //              CHOOSE A USE CASE / COMPONENT
  // =========================================================
  //
  // Multiple components are available depending on your event type:
  // MediasfuBroadcast, MediasfuChat, MediasfuWebinar, MediasfuConference
  //
  // By default, we'll use MediasfuBroadcast with custom settings.

  /**
   * **MediasfuBroadcast Component**
   *
   * Uncomment to use the broadcast event type.
   */
  /*
  return (
    <MediasfuBroadcast
      credentials={credentials}
      localLink={localLink}
      connectMediaSFU={connectMediaSFU}
      // seedData={useSeed ? seedData : {}}
    />
  );
  */

  // =========================================================
  //                    RENDER COMPONENT
  // =========================================================
  //
  // The MediasfuBroadcast component is used by default.
  // You can replace it with any other component based on your event type.
  // Example: <MediasfuBroadcast ... />
  //
  // The PreJoinPage component is displayed if `returnUI` is true.
  // If `returnUI` is false, `noUIPreJoinOptions` is used as a substitute.
  // You can also use `sourceParameters` to interact with MediaSFU functionalities directly.
  // Avoid using `useLocalUIMode` or `useSeed` in new implementations.
  // Ensure that real credentials are not exposed in the frontend.
  // Use HTTPS and secure backend endpoints for production.

  return (
    <MediasfuBroadcast
      // This pre-join page can be displayed if `returnUI` is true.
      // If `returnUI` is false, `noUIPreJoinOptions` is used as a substitute.
      PrejoinPage={PreJoinPage}
      credentials={credentials}
      localLink={localLink}
      connectMediaSFU={connectMediaSFU}
      returnUI={false}
      noUIPreJoinOptions={noUIPreJoinOptions}
      sourceParameters={sourceParameters}
      updateSourceParameters={updateSourceParameters}
      createMediaSFURoom={createRoomOnMediaSFU}
      joinMediaSFURoom={joinRoomOnMediaSFU}
    />
  );
};

export default App;
```

### Example for Generic View

```typescript
// Import specific Mediasfu view components
// Import the PreJoinPage component for the Pre-Join Page use case
import { MediasfuGeneric,
    MediasfuBroadcast, MediasfuChat, MediasfuWebinar, MediasfuConference, PreJoinPage
 } from 'mediasfu-reactjs'


// Import methods for generating random participants, messages, requests, and waiting room lists if using seed data
import { generateRandomParticipants, generateRandomMessages, generateRandomRequestList, generateRandomWaitingRoomList,
} from 'mediasfu-reactjs';



/**
 * App Component
 *
 * This component demonstrates how to:
 * - Configure credentials for MediaSFU Cloud and/or Community Edition (CE).
 * - Use MediaSFU with or without a custom server.
 * - Integrate a pre-join page.
 * - Return no UI and manage state through sourceParameters, allowing a fully custom frontend.
 *
 * Basic instructions:
 * 1. Set `localLink` to your CE server if you have one, or leave it blank to use MediaSFU Cloud.
 * 2. Set `connectMediaSFU` to determine whether you're connecting to MediaSFU Cloud services.
 * 3. Provide credentials if using MediaSFU Cloud (dummy credentials are acceptable in certain scenarios).
 * 4. If you prefer a custom UI, set `returnUI` to false and handle all interactions via `sourceParameters` and `updateSourceParameters`.
 * 5. For secure production usage, consider using custom `createMediaSFURoom` and `joinMediaSFURoom` functions to forward requests through your backend.
 */

const App = () => {
  // =========================================================
  //                API CREDENTIALS CONFIGURATION
  // =========================================================
  //
  // Scenario A: Not using MediaSFU Cloud at all.
  // - No credentials needed. Just set localLink to your CE server.
  // Example:
  /*
  const credentials = {};
  const localLink = 'http://your-ce-server.com'; //http://localhost:3000
  const connectMediaSFU = localLink.trim() !== '';
  */

  // Scenario B: Using MediaSFU CE + MediaSFU Cloud for Egress only.
  // - Use dummy credentials (8 chars for userName, 64 chars for apiKey).
  // - Your CE backend will forward requests with your real credentials.
  /*
  const credentials = {
    apiUserName: 'dummyUsr',
    apiKey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  };
  const localLink = 'http://your-ce-server.com'; //http://localhost:3000
  const connectMediaSFU = localLink.trim() !== '';
  */

  // Scenario C: Using MediaSFU Cloud without your own server.
  // - For development, use your actual or dummy credentials.
  // - In production, securely handle credentials server-side and use custom room functions.
  const credentials = {
    apiUserName: 'yourDevUser', // 8 chars recommended for dummy
    apiKey: 'yourDevApiKey1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // 64 chars
  };
  const localLink = ''; // Leave empty if not using your own server
  const connectMediaSFU = true; // Set to true if using MediaSFU Cloud since localLink is empty

  // =========================================================
  //                    UI RENDERING OPTIONS
  // =========================================================
  //
  // If you want a fully custom UI (e.g., a custom layout inspired by WhatsApp):
  // 1. Set `returnUI = false` to prevent the default MediaSFU UI from rendering.
  // 2. Provide `noUIPreJoinOptions` to simulate what would have been entered on a pre-join page.
  // 3. Use `sourceParameters` and `updateSourceParameters` to access and update state/actions.
  // 4. No need for any of the above if you're using the default MediaSFU UI.
  //
  // Example noUIPreJoinOptions:
  const noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions = {
    action: 'create',
    capacity: 10,
    duration: 15,
    eventType: 'broadcast',
    userName: 'Prince',
  };

  // Example for joining a room:
  // const noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions = {
  //   action: 'join',
  //   userName: 'Prince',
  //   meetingID: 'yourMeetingID'
  // };

  const returnUI = true; // Set to false for custom UI, true for default MediaSFU UI

  const [sourceParameters, setSourceParameters] = useState<{ [key: string]: any }>({});
  const updateSourceParameters = (data: { [key: string]: any }) => {
    setSourceParameters(data);
  };

  // =========================================================
  //                CUSTOM ROOM FUNCTIONS (OPTIONAL)
  // =========================================================
  //
  // To securely forward requests to MediaSFU:
  // - Implement custom `createMediaSFURoom` and `joinMediaSFURoom` functions.
  // - These functions send requests to your server, which then communicates with MediaSFU Cloud.
  //
  // Already imported `createRoomOnMediaSFU` and `joinRoomOnMediaSFU` are examples.
  //
  // If using MediaSFU CE backend, ensure your server endpoints:
  // - Validate dummy credentials.
  // - Forward requests to mediasfu.com with real credentials.

  // =========================================================
  //              CHOOSE A USE CASE / COMPONENT
  // =========================================================
  //
  // Multiple components are available depending on your event type:
  // MediasfuBroadcast, MediasfuChat, MediasfuWebinar, MediasfuConference
  //
  // By default, we'll use MediasfuGeneric with custom settings.



  // =========================================================
  //                    RENDER COMPONENT
  // =========================================================
  //
  // The MediasfuGeneric component is used by default.
  // You can replace it with any other component based on your event type.
  // Example: <MediasfuBroadcast ... />
  // Example: <MediasfuChat ... />
  // Example: <MediasfuWebinar ... />
  // Example: <MediasfuConference ... />
  //
  // The PreJoinPage component is displayed if `returnUI` is true.
  // If `returnUI` is false, `noUIPreJoinOptions` is used as a substitute.
  // You can also use `sourceParameters` to interact with MediaSFU functionalities directly.
  // Avoid using `useLocalUIMode` or `useSeed` in new implementations.
  // Ensure that real credentials are not exposed in the frontend.
  // Use HTTPS and secure backend endpoints for production.

  // Example of MediaSFU CE with no MediaSFU Cloud
  // return (
  //   <MediasfuGeneric
  //     PrejoinPage={PreJoinPage}
  //     localLink={localLink}
  //     />
  // );

  // Example of MediaSFU CE + MediaSFU Cloud for Egress only
  // return (
  //   <MediasfuGeneric
  //     PrejoinPage={PreJoinPage}
  //     credentials={credentials}
  //     localLink={localLink}
  //     connectMediaSFU={connectMediaSFU}
  //     />
  // );

  // Example of MediaSFU Cloud only
  // return (
  //   <MediasfuGeneric
  //     PrejoinPage={PreJoinPage}
  //     credentials={credentials}
  //     connectMediaSFU={connectMediaSFU}
  //     />
  // );

  // Example of MediaSFU CE + MediaSFU Cloud for Egress only with custom UI
  // return (
  //   <MediasfuGeneric
  //     PrejoinPage={PreJoinPage}
  //     credentials={credentials}
  //     localLink={localLink}
  //     connectMediaSFU={connectMediaSFU}
  //     returnUI={false}
  //     noUIPreJoinOptions={noUIPreJoinOptions}
  //     sourceParameters={sourceParameters}
  //     updateSourceParameters={updateSourceParameters}
  //     createMediaSFURoom={createRoomOnMediaSFU}
  //     joinMediaSFURoom={joinRoomOnMediaSFU}
  //   />

  // Example of MediaSFU Cloud only with custom UI
  // return (
  //   <MediasfuGeneric
  //     PrejoinPage={PreJoinPage}
  //     credentials={credentials}
  //     connectMediaSFU={connectMediaSFU}
  //     returnUI={false}
  //     noUIPreJoinOptions={noUIPreJoinOptions}
  //     sourceParameters={sourceParameters}
  //     updateSourceParameters={updateSourceParameters}
  //     createMediaSFURoom={createRoomOnMediaSFU}
  //     joinMediaSFURoom={joinRoomOnMediaSFU}
  //   />

  // Example of using MediaSFU CE only with custom UI
  // return (
  //   <MediasfuGeneric
  //     PrejoinPage={PreJoinPage}
  //     localLink={localLink}
  //     connectMediaSFU={false}
  //     returnUI={false}
  //     noUIPreJoinOptions={noUIPreJoinOptions}
  //     sourceParameters={sourceParameters}
  //     updateSourceParameters={updateSourceParameters}
  //   />


  return (
    <MediasfuGeneric
      // This pre-join page can be displayed if `returnUI` is true.
      // If `returnUI` is false, `noUIPreJoinOptions` is used as a substitute.
      PrejoinPage={PreJoinPage}
      credentials={credentials}
      localLink={localLink}
      connectMediaSFU={connectMediaSFU}
      returnUI={returnUI}
      noUIPreJoinOptions={!returnUI ? noUIPreJoinOptions : undefined}
      sourceParameters={!returnUI ? sourceParameters : undefined}
      updateSourceParameters={!returnUI ? updateSourceParameters : undefined}
      createMediaSFURoom={createRoomOnMediaSFU} // no need to specify if not using custom functions
      joinMediaSFURoom={joinRoomOnMediaSFU} // no need to specify if not using custom functions
    />
  );
};

export default App;

/**
 * =========================================================
 *                     ADDITIONAL NOTES
 * =========================================================
 *
 * Handling Core Methods:
 * Once `sourceParameters` is populated, you can call core methods like `clickVideo` or `clickAudio` directly:
 * Example:
 * sourceParameters.clickVideo({ ...sourceParameters });
 * sourceParameters.clickAudio({ ...sourceParameters });
 *
 * This allows your custom UI to directly interact with MediaSFU functionalities.
 *
 * Deprecated Features (Seed Data):
 * The seed data generation feature is deprecated. Avoid using `useLocalUIMode` or `useSeed` in new implementations.
 *
 * Security Considerations:
 * - Do not expose real credentials in your frontend code in production.
 * - Use HTTPS and secure backend endpoints.
 * - Validate inputs and handle errors gracefully.
 *
 * Example CE Backend Setup:
 * If using MediaSFU CE + MediaSFU Cloud, your backend might look like this:
 *
 * app.post("/createRoom", async (req, res) => {
 *   // Validate incoming dummy credentials
 *   // Forward request to mediasfu.com with real credentials
 * });
 *
 * app.post("/joinRoom", async (req, res) => {
 *   // Validate incoming dummy credentials
 *   // Forward request to mediasfu.com with real credentials
 * });
 *
 * By doing so, you keep real credentials secure on your server.
 *
 * End of Guide.
 */



/**
 * =======================
 * ====== EXTRA NOTES ======
 * =======================
 *
 * ### Handling Core Methods
 * With `sourceParameters`, you can access core methods such as `clickVideo` and `clickAudio`:
 *
 * ```typescript
 * sourceParameters.clickVideo({ ...sourceParameters });
 * sourceParameters.clickAudio({ ...sourceParameters });
 * ```
 *
 * This allows your custom UI to interact with MediaSFU's functionalities seamlessly.
 *
 * ### Seed Data (Deprecated)
 * The seed data functionality is deprecated and maintained only for legacy purposes.
 * It is recommended to avoid using it in new implementations.
 *
 * ### Security Considerations
 * - **Protect API Credentials:** Ensure that API credentials are not exposed in the frontend. Use environment variables and secure backend services to handle sensitive information.
 * - **Use HTTPS:** Always use HTTPS to secure data transmission between the client and server.
 * - **Validate Inputs:** Implement proper validation and error handling on both client and server sides to prevent malicious inputs.
 *
 * ### Custom Backend Example for MediaSFU CE
 * Below is an example of how to set up custom backend endpoints for creating and joining rooms using MediaSFU CE:
 *
 * ```javascript
 * // Endpoint for `createRoom`
 * app.post("/createRoom", async (req, res) => {
 *   try {
 *     const payload = req.body;
 *     const [apiUserName, apiKey] = req.headers.authorization
 *       .replace("Bearer ", "")
 *       .split(":");
 *
 *     // Verify temporary credentials
 *     if (!apiUserName || !apiKey || !verifyCredentials(apiUserName, apiKey)) {
 *       return res.status(401).json({ error: "Invalid or expired credentials" });
 *     }
 *
 *     const response = await fetch("https://mediasfu.com/v1/rooms/", {
 *       method: "POST",
 *       headers: {
 *         "Content-Type": "application/json",
 *         Authorization: `Bearer ${actualApiUserName}:${actualApiKey}`,
 *       },
 *       body: JSON.stringify(payload),
 *     });
 *
 *     const result = await response.json();
 *     res.status(response.status).json(result);
 *   } catch (error) {
 *     console.error("Error creating room:", error);
 *     res.status(500).json({ error: "Internal server error" });
 *   }
 * });
 *
 * // Endpoint for `joinRoom`
 * app.post("/joinRoom", async (req, res) => {
 *   try {
 *     const payload = req.body;
 *     const [apiUserName, apiKey] = req.headers.authorization
 *       .replace("Bearer ", "")
 *       .split(":");
 *
 *     // Verify temporary credentials
 *     if (!apiUserName || !apiKey || !verifyCredentials(apiUserName, apiKey)) {
 *       return res.status(401).json({ error: "Invalid or expired credentials" });
 *     }
 *
 *     const response = await fetch("https://mediasfu.com/v1/rooms", {
 *       method: "POST",
 *       headers: {
 *         "Content-Type": "application/json",
 *         Authorization: `Bearer ${actualApiUserName}:${actualApiKey}`,
 *       },
 *       body: JSON.stringify(payload),
 *     });
 *
 *     const result = await response.json();
 *     res.status(response.status).json(result);
 *   } catch (error) {
 *     console.error("Error joining room:", error);
 *     res.status(500).json({ error: "Internal server error" });
 *   }
 * });
 * ```
 *
 * ### Custom Room Function Implementation
 * Below are examples of how to implement custom functions for creating and joining rooms securely:
 *
 * ```typescript
 * import { CreateJoinRoomError, CreateJoinRoomResponse, CreateJoinRoomType, CreateMediaSFURoomOptions, JoinMediaSFURoomOptions } from '../../@types/types';
 *
 *
 * Async function to create a room on MediaSFU.
 *
 * @param {object} options - The options for creating a room.
 * @param {CreateMediaSFURoomOptions} options.payload - The payload for the API request.
 * @param {string} options.apiUserName - The API username.
 * @param {string} options.apiKey - The API key.
 * @param {string} options.localLink - The local link.
 * @returns {Promise<{ data: CreateJoinRoomResponse | CreateJoinRoomError | null; success: boolean; }>} The response from the API.
 * export const createRoomOnMediaSFU: CreateJoinRoomType = async ({
 *     payload,
 *     apiUserName,
 *     apiKey,
 *     localLink = '',
 * }) => {
 *     try {
 *         let finalLink = 'https://mediasfu.com/v1/rooms/';
 *
 *         // Update finalLink if using a local server
 *         if (localLink) {
 *             finalLink = `${localLink}/createRoom`;
 *         }
 *
 *         const response = await fetch(finalLink, {
 *             method: 'POST',
 *             headers: {
 *                 'Content-Type': 'application/json',
 *                 Authorization: `Bearer ${apiUserName}:${apiKey}`,
 *             },
 *             body: JSON.stringify(payload),
 *         });
 *
 *         if (!response.ok) {
 *             throw new Error(`HTTP error! Status: ${response.status}`);
 *         }
 *
 *         const data: CreateJoinRoomResponse = await response.json();
 *         return { data, success: true };
 *     } catch (error) {
 *         const errorMessage = (error as Error).message || 'unknown error';
 *         return {
 *             data: { error: `Unable to create room, ${errorMessage}` },
 *             success: false,
 *         };
 *     }
 * };
 *
*
*  Async function to join a room on MediaSFU.
*
*  @param {object} options - The options for joining a room.
*  @param {JoinMediaSFURoomOptions} options.payload - The payload for the API request.
*  @param {string} options.apiUserName - The API username.
*  @param {string} options.apiKey - The API key.
*  @param {string} options.localLink - The local link.
*  @returns {Promise<{ data: CreateJoinRoomResponse | CreateJoinRoomError | null; success: boolean; }>} The response from the API.
*
* export const joinRoomOnMediaSFU: JoinRoomOnMediaSFUType = async ({
*     payload,
*     apiUserName,
*     apiKey,
*     localLink = '',
* }) => {
*     try {
*         let finalLink = 'https://mediasfu.com/v1/rooms/join';
*
*         // Update finalLink if using a local server
*         if (localLink) {
*             finalLink = `${localLink}/joinRoom`;
*         }
*
*         const response = await fetch(finalLink, {
*             method: 'POST',
*             headers: {
*                 'Content-Type': 'application/json',
*                 Authorization: `Bearer ${apiUserName}:${apiKey}`,
*             },
*             body: JSON.stringify(payload),
*         });
*
*         if (!response.ok) {
*             throw new Error(`HTTP error! Status: ${response.status}`);
*         }
*
*         const data: CreateJoinRoomResponse = await response.json();
*         return { data, success: true };
*     } catch (error) {
*         const errorMessage = (error as Error).message || 'unknown error';
*         return {
*             data: { error: `Unable to join room, ${errorMessage}` },
*             success: false,
*         };
*     }
* };
* ```
*
* ### Example Usage of Core Methods
* Core methods like `clickVideo` and `clickAudio` can now be accessed through `sourceParameters`:
*
* ```typescript
* // Example of toggling video
* sourceParameters.clickVideo({ ...sourceParameters });
*
* // Example of toggling audio
* sourceParameters.clickAudio({ ...sourceParameters });
* ```
*
* These methods allow your custom UI to interact with MediaSFU's functionalities seamlessly.
*
* ========================
* ====== END OF GUIDE ======
* ========================
*/
```

In the provided examples, users can set `useLocalUIMode` to `true` during UI development to prevent unwanted connections to MediaSFU servers. Additionally, they can generate seed data for rendering UI components locally by using random data generators provided by the module.

### Local UI Development in MediaSFU ReactJS Module

During local UI development, the MediaSFU view is designed to be responsive to changes in screen size and orientation, adapting its layout accordingly. However, since UI changes are typically linked to communication with servers, developing the UI locally might result in less responsiveness due to the lack of real-time data updates. To mitigate this, users can force trigger changes in the UI by rotating the device, resizing the window, or simulating server responses by clicking on buttons within the page.

While developing locally, users may encounter occasional error warnings as the UI attempts to communicate with the server. These warnings can be safely ignored, as they are simply indicative of unsuccessful server requests in the local development environment.

If users experience responsiveness issues, whether during local development or in production, they can optimize their HTML configuration to ensure proper scaling and viewport settings. By adding the following meta tag to the HTML `<head>` section, users can specify viewport settings for optimal display:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
```




# UI Customization Guide <a name="ui-customization-guide"></a>

MediaSFU provides **three simple approaches** for customizing your event room UI. Choose the level of customization that fits your needs:

## 🎨 **Dead Simple UI Customization**

### **1. No UI Mode (`returnUI: false`)**
**Perfect for:** Complete custom interfaces, dashboard integration, or when you want total control.

```javascript
import { MediasfuGeneric } from 'mediasfu-reactjs';

const App = () => {
  const [sourceParameters, setSourceParameters] = useState({});
  
  const updateSourceParameters = (data) => {
    setSourceParameters(data);
  };

  return (
    <div>
      <MediasfuGeneric
        returnUI={false}
        noUIPreJoinOptions={{
          action: 'create',
          capacity: 10,
          duration: 15,
          eventType: 'broadcast',
          userName: 'YourName'
        }}
        sourceParameters={sourceParameters}
        updateSourceParameters={updateSourceParameters}
      />
      
      {/* Your completely custom UI */}
      <div className="my-custom-interface">
        <button onClick={() => sourceParameters.clickVideo?.(sourceParameters)}>
          Toggle Video
        </button>
        <button onClick={() => sourceParameters.clickAudio?.(sourceParameters)}>
          Toggle Audio
        </button>
        {/* Access any MediaSFU function through sourceParameters */}
      </div>
    </div>
  );
};
```

### **2. Custom Card Components**
**Perfect for:** Keeping MediaSFU's layout but styling individual video/audio cards your way.

```javascript
import { MediasfuGeneric } from 'mediasfu-reactjs';

const CustomVideoCard = (options) => {
  const { participant, stream, width, height, name } = options;
  
  return (
    <div style={{
      borderRadius: '15px',
      border: '3px solid #00ff88',
      overflow: 'hidden',
      background: 'linear-gradient(45deg, #1a1a1a, #2d2d2d)'
    }}>
      {stream && (
        <video
          ref={(video) => {
            if (video && stream) {
              video.srcObject = stream;
              video.play().catch(() => {});
            }
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          autoPlay
          muted={participant?.muted}
          playsInline
        />
      )}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,255,136,0.8)',
        padding: '5px 10px',
        borderRadius: '20px',
        color: 'black',
        fontWeight: 'bold'
      }}>
        {name} ✨
      </div>
    </div>
  );
};

const App = () => {
  return (
    <MediasfuGeneric
      customVideoCard={CustomVideoCard}
      // Optional: also customize audio cards and mini cards
      // customAudioCard={YourCustomAudioCard}
      // customMiniCard={YourCustomMiniCard}
    />
  );
};
```

### **3. Container Styling**
**Perfect for:** Quick theming and brand colors without touching individual components.

```javascript
import { MediasfuGeneric } from 'mediasfu-reactjs';

const App = () => {
  return (
    <MediasfuGeneric
      containerStyle={{
        backgroundColor: '#1a0033',  // Dark purple background
        borderRadius: '20px',
        border: '2px solid #00ff88',
        boxShadow: '0 8px 32px rgba(0,255,136,0.3)'
      }}
    />
  );
};
```

## 🚀 **Why This Is Dead Simple**

- **Option 1 (No UI)**: One prop (`returnUI: false`) gives you complete control
- **Option 2 (Custom Cards)**: Just pass your component to `customVideoCard` - no complex setup
- **Option 3 (Container Style)**: Standard React CSS properties - style like any div

No configuration files, no build steps, no complex APIs. Just React components working exactly how you'd expect.

## 📱 **Real-World Example: WhatsApp-Style Video Call**

```javascript
const WhatsAppStyleCall = () => {
  const [sourceParameters, setSourceParameters] = useState({});
  
  const WhatsAppVideoCard = (options) => {
    const { stream, name } = options;
    return (
      <div style={{
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#202c33',
        position: 'relative'
      }}>
        {stream && (
          <video
            ref={(video) => {
              if (video && stream) {
                video.srcObject = stream;
                video.play().catch(() => {});
              }
            }}
            style={{ width: '100%', height: '100%' }}
            autoPlay
            muted
            playsInline
          />
        )}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          {name}
        </div>
      </div>
    );
  };

  return (
    <MediasfuGeneric
      customVideoCard={WhatsAppVideoCard}
      containerStyle={{
        backgroundColor: '#0b141a',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
      updateSourceParameters={setSourceParameters}
    />
  );
};
```

That's it! MediaSFU handles all the complex WebRTC, room management, and real-time features while you focus on making it look exactly how you want.




# Intermediate Usage Guide <a name="intermediate-usage-guide"></a>

Expands on the basic usage, covering more advanced features and scenarios.

### Intermediate Usage Guide

In the Intermediate Usage Guide, we'll explore the core components and functionalities of the MediaSFU ReactJS module, focusing on media display, controls, and modal interactions. **Click on any listed component/method to open the full documentation.**

#### Core Components Overview

The main items displayed on an event page are media components (such as video, audio, and blank cards) and control components (for pagination, navigation, etc.).

> ##### **Media Display Components**

| Component Name           | Description                                                                                     |
|--------------------------|-------------------------------------------------------------------------------------------------|
| **[MainAspectComponent](https://www.mediasfu.com/reactjs/functions/MainAspectComponent)** | Serves as a container for the primary aspect of the user interface, typically containing the main content or focus of the application. |
| **[MainScreenComponent](https://www.mediasfu.com/reactjs/functions/MainScreenComponent)** | Responsible for rendering the main screen layout of the application, providing the foundation for displaying various elements and content. |
| **[MainGridComponent](https://www.mediasfu.com/reactjs/functions/MainGridComponent)**  | Crucial part of the user interface, organizing and displaying primary content or elements in a grid layout format. |
| **[SubAspectComponent](https://www.mediasfu.com/reactjs/functions/SubAspectComponent)** | Acts as a secondary container within the user interface, often housing additional elements or controls related to the main aspect. |
| **[MainContainerComponent](https://www.mediasfu.com/reactjs/functions/MainContainerComponent)** | Primary container for the application's content, encapsulating all major components and providing structural organization. |
| **[OtherGridComponent](https://www.mediasfu.com/reactjs/functions/OtherGridComponent)** | Complements the Main Grid Component by offering additional grid layouts, typically used for displaying secondary or auxiliary content. |

> ##### **Control Components**

| Component Name                | Description                                                                                     |
|-------------------------------|-------------------------------------------------------------------------------------------------|
| **[ControlButtonsComponent](https://www.mediasfu.com/reactjs/functions/ControlButtonsComponent)** | Comprises a set of buttons or controls used for navigating, interacting, or managing various aspects of the application's functionality. |
| **[ControlButtonsAltComponent](https://www.mediasfu.com/reactjs/functions/ControlButtonsAltComponent)** | Provides alternative button configurations or styles for controlling different aspects of the application. |
| **[ControlButtonsComponentTouch](https://www.mediasfu.com/reactjs/functions/ControlButtonsComponentTouch)** | Specialized component designed for touch-enabled devices, offering floating buttons or controls for intuitive interaction with the application's features. |


These components collectively contribute to the overall user interface, facilitating navigation, interaction, and content display within the application.

> ##### **Modal Components**

| Modal Component | Description |
|-----------------|-------------|
| **[LoadingModal](https://www.mediasfu.com/reactjs/functions/LoadingModal)** | Modal for displaying loading indicator during data fetching or processing. |
| **[MainAspectComponent](https://www.mediasfu.com/reactjs/functions/MainAspectComponent)** | Component responsible for displaying the main aspect of the event page. |
| **[ControlButtonsComponent](https://www.mediasfu.com/reactjs/functions/ControlButtonsComponent)** | Component for displaying control buttons such as pagination controls. |
| **[ControlButtonsAltComponent](https://www.mediasfu.com/reactjs/functions/ControlButtonsAltComponent)** | Alternate control buttons component for specific use cases. |
| **[ControlButtonsComponentTouch](https://www.mediasfu.com/reactjs/functions/ControlButtonsComponentTouch)** | Touch-enabled control buttons component for mobile devices. |
| **[OtherGridComponent](https://www.mediasfu.com/reactjs/functions/OtherGridComponent)** | Component for displaying additional grid elements on the event page. |
| **[MainScreenComponent](https://www.mediasfu.com/reactjs/functions/MainScreenComponent)** | Component for rendering the main screen content of the event. |
| **[MainGridComponent](https://www.mediasfu.com/reactjs/functions/MainGridComponent)** | Main grid component for displaying primary event content. |
| **[SubAspectComponent](https://www.mediasfu.com/reactjs/functions/SubAspectComponent)** | Component for displaying secondary aspects of the event page. |
| **[MainContainerComponent](https://www.mediasfu.com/reactjs/functions/MainContainerComponent)** | Main container component for the event page content. |
| **[AlertComponent](https://www.mediasfu.com/reactjs/functions/AlertComponent)** | Modal for displaying alert messages to the user. |
| **[MenuModal](https://www.mediasfu.com/reactjs/functions/MenuModal)** | Modal for displaying a menu with various options. |
| **[RecordingModal](https://www.mediasfu.com/reactjs/functions/RecordingModal)** | Modal for managing recording functionality during the event. |
| **[RequestsModal](https://www.mediasfu.com/reactjs/functions/RequestsModal)** | Modal for handling requests from participants during the event. |
| **[WaitingRoomModal](https://www.mediasfu.com/reactjs/functions/WaitingRoomModal)** | Modal for managing waiting room functionality during the event. |
| **[DisplaySettingsModal](https://www.mediasfu.com/reactjs/functions/DisplaySettingsModal)** | Modal for adjusting display settings during the event. |
| **[EventSettingsModal](https://www.mediasfu.com/reactjs/functions/EventSettingsModal)** | Modal for configuring event settings. |
| **[CoHostModal](https://www.mediasfu.com/reactjs/functions/CoHostModal)** | Modal for managing co-host functionality during the event. |
| **[ParticipantsModal](https://www.mediasfu.com/reactjs/functions/ParticipantsModal)** | Modal for displaying participant information and controls. |
| **[MessagesModal](https://www.mediasfu.com/reactjs/functions/MessagesModal)** | Modal for managing messages and chat functionality during the event. |
| **[MediaSettingsModal](https://www.mediasfu.com/reactjs/functions/MediaSettingsModal)** | Modal for adjusting media settings during the event. |
| **[ConfirmExitModal](https://www.mediasfu.com/reactjs/functions/ConfirmExitModal)** | Modal for confirming exit from the event. |
| **[ConfirmHereModal](https://www.mediasfu.com/reactjs/functions/ConfirmHereModal)** | Modal for confirming certain actions or selections. |
| **[ShareEventModal](https://www.mediasfu.com/reactjs/functions/ShareEventModal)** | Modal for sharing the event with others. |
| **[WelcomePage](https://www.mediasfu.com/reactjs/functions/WelcomePage)** | Welcome page modal for the event. |
| **[PreJoinPage](https://www.mediasfu.com/reactjs/functions/PreJoinPage)** | Prejoin page modal for the event. |
| **[PollModal](https://www.mediasfu.com/reactjs/functions/PollModal)** | Modal for conducting polls or surveys during the event. |
| **[BreakoutRoomsModal](https://www.mediasfu.com/reactjs/functions/BreakoutRoomsModal)** | Modal for managing breakout rooms during the event. |
| **[ConfigureWhiteboardModal](https://www.mediasfu.com/reactjs/functions/ConfigureWhiteboardModal)** | Modal for configuring whiteboard settings during the event. |                      
| **[BackgroundModal](https://www.mediasfu.com/reactjs/functions/BackgroundModal)**  | Modal for managing background settings during the event. |
| **[ScreenboardModal](https://www.mediasfu.com/reactjs/functions/ScreenboardModal)** | Modal for managing screen share annotations during the event. |

#### Modal Interactions

Each modal has corresponding functions to trigger its usage:

1. [`launchMenuModal`](https://www.mediasfu.com/reactjs/functions/launchMenuModal): Launches the menu modal for settings and configurations.
2. [`launchRecording`](https://www.mediasfu.com/reactjs/functions/launchRecording): Initiates the recording modal for recording functionalities.
3. [`startRecording`](https://www.mediasfu.com/reactjs/functions/startRecording): Starts the recording process.
4. [`confirmRecording`](https://www.mediasfu.com/reactjs/functions/confirmRecording): Confirms and finalizes the recording.
5. [`launchWaiting`](https://www.mediasfu.com/reactjs/functions/launchWaiting): Opens the waiting room modal for managing waiting room interactions.
6. [`launchCoHost`](https://www.mediasfu.com/reactjs/functions/launchCoHost): Opens the co-host modal for managing co-host functionalities.
7. [`launchMediaSettings`](https://www.mediasfu.com/reactjs/functions/launchMediaSettings): Launches the media settings modal for adjusting media-related configurations.
8. [`launchDisplaySettings`](https://www.mediasfu.com/reactjs/functions/launchDisplaySettings): Opens the display settings modal for adjusting display configurations.
9. [`launchSettings`](https://www.mediasfu.com/reactjs/functions/launchSettings): Initiates the settings modal for general event settings and configurations.
10. [`launchRequests`](https://www.mediasfu.com/reactjs/functions/launchRequests): Opens the requests modal for managing user requests.
11. [`launchParticipants`](https://www.mediasfu.com/reactjs/functions/launchParticipants): Displays the participants modal for viewing and managing event participants.
12. [`launchMessages`](https://www.mediasfu.com/reactjs/functions/launchMessages): Opens the messages modal for communication through chat messages.
13. [`launchConfirmExit`](https://www.mediasfu.com/reactjs/functions/launchConfirmExit): Prompts users to confirm before exiting the event.

#### Media Display and Controls

These components facilitate media display and control functionalities:

1. **[Pagination](https://www.mediasfu.com/reactjs/functions/Pagination)**: Handles pagination and page switching.
2. **[FlexibleGrid](https://www.mediasfu.com/reactjs/functions/FlexibleGrid)**: Renders flexible grid layouts for media display.
3. **[FlexibleVideo](https://www.mediasfu.com/reactjs/functions/FlexibleVideo)**: Displays videos in a flexible manner within the grid.
4. **[AudioGrid](https://www.mediasfu.com/reactjs/functions/AudioGrid)**: Renders audio components within the grid layout.
5. **[Whiteboard](https://www.mediasfu.com/reactjs/functions/Whiteboard)**: Manages whiteboard functionalities for collaborative drawing.
6. **[Screenboard](https://www.mediasfu.com/reactjs/functions/Screenboard)**: Controls screen share annotations and interactions.

These components enable seamless media presentation and interaction within the event environment, providing users with a rich and immersive experience.

| UI Media Component | Description |
|--------------|-------------|
| **[MeetingProgressTimer](https://www.mediasfu.com/reactjs/functions/MeetingProgressTimer)** | Component for displaying a timer indicating the progress of a meeting or event. |
| **[MiniAudio](https://www.mediasfu.com/reactjs/functions/MiniAudio)** | Component for rendering a compact audio player with basic controls. |
| **[MiniCard](https://www.mediasfu.com/reactjs/functions/MiniCard)** | Component for displaying a minimized card view with essential information. |
| **[AudioCard](https://www.mediasfu.com/reactjs/functions/AudioCard)** | Component for displaying audio content with control elements, details, and audio decibels. |
| **[VideoCard](https://www.mediasfu.com/reactjs/functions/VideoCard)** | Component for displaying video content with control elements, details, and audio decibels. |
| **[CardVideoDisplay](https://www.mediasfu.com/reactjs/functions/CardVideoDisplay)** | Video player component for displaying embedded videos with controls and details. |
| **[MiniCardAudio](https://www.mediasfu.com/reactjs/functions/MiniCardAudio)** | Component for rendering a compact card view with audio content and controls. |
| **[MiniAudioPlayer](https://www.mediasfu.com/reactjs/functions/MiniAudioPlayer)** | Utility method for playing audio and rendering a mini audio modal when the user is not actively displayed on the page. |

---
With the Intermediate Usage Guide, users can explore and leverage the core components and functionalities of the MediaSFU ReactJS module to enhance their event hosting and participation experiences.

Here's a sample import and usage code for a Broadcast screen:

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { PrejoinPage, MainContainerComponent, MainAspectComponent, MainScreenComponent, MainGridComponent, FlexibleVideo, ControlButtonsComponentTouch, AudioGrid } from 'mediasfu-reactjs';

const BroadcastScreen = () => {
    // State variables and constants
    const [validated, setValidated] = useState<boolean>(useLocalUIMode); // Validated state as boolean
    const confirmedToRecord = useRef<boolean>(false); // True if the user has confirmed to record as boolean
    const meetingDisplayType = useRef<string>("media"); // Meeting display type as string

    // Sample control button configurations
    const controlBroadcastButtons = [/* define your control buttons here */];
    const recordButton = [/* define your record button here */];
    const recordButtons = [/* define your record buttons here */];

    // Sample component sizes
    const componentSizes = useRef<ComponentSizes>({
        // Component sizes as ComponentSizes
        mainHeight: 0,
        otherHeight: 0,
        mainWidth: 0,
        otherWidth: 0,
    }); // Component sizes

    // Sample function to update component sizes
    const updateComponentSizes = (sizes: ComponentSizes) => {
        componentSizes.current = sizes;
    };


    // Sample function to update validation state
    const updateValidated = (value: boolean) => {
        setValidated(value);
    };

    // Sample credentials
    const credentials = {
        apiUserName: "yourAPIUserName",
        apiKey: "yourAPIKey"
    };

    // Sample socket
    const socket = useRef<Socket>({} as Socket); // Socket for the media server, type Socket 

    // Sample meeting progress time
    const [meetingProgressTime, setMeetingProgressTime] =
    useState<string>("00:00:00"); // Meeting progress time as string

    // Sample record state
    const [recordState, setRecordState] = useState<string>("green"); // Recording state with specific values

    // Sample main grid and other grid elements
    const mainGridStream = useRef<React.JSX.Element[]>([]); // Array of main grid streams as React.JSX.Element[]
    const [otherGridStreams, setOtherGridStreams] = useState<React.JSX.Element[][]>([
        [],
        [],
    ]); // Other grid streams as 2D array of React.JSX.Element[]
  

    // Sample audio only streams
    const audioOnlyStreams = useRef<React.JSX.Element[]>([]); // Array of audio-only streams

    // Sample main height and width
    const [mainHeightWidth, setMainHeightWidth] = useState<number>(100); // Main height and width as number

    // Render the PrejoinPage if not validated, otherwise render the main components
    return (
        <div
        className="MediaSFU"
        style={{
            height: "100vh",
            width: "100vw",
            maxWidth: "100vw",
            maxHeight: "100vh",
            overflow: "hidden",
        }}
        >
        {!validated ? (
            <PrejoinPage
            parameters={{
                imgSrc,
                showAlert,
                updateIsLoadingModalVisible,
                connectSocket,
                updateSocket,
                updateValidated,
                updateApiUserName,
                updateApiToken,
                updateLink,
                updateRoomName,
                updateMember,
            }}
            credentials={credentials}
            />
        ) : (
            <MainContainerComponent>
            {/* Main aspect component containsa ll but the control buttons (as used for webinar and conference) */}
            <MainAspectComponent
                backgroundColor="rgba(217, 227, 234, 0.99)"
                defaultFraction={1 - controlHeight}
                updateIsWideScreen={updateIsWideScreen}
                updateIsMediumScreen={updateIsMediumScreen}
                updateIsSmallScreen={updateIsSmallScreen}
                showControls={
                eventType.current == "webinar" ||
                eventType.current == "conference"
                }
            >
                {/* MainScreenComponent contains the main grid view and the minor grid view */}
                <MainScreenComponent
                doStack={true}
                mainSize={mainHeightWidth}
                updateComponentSizes={updateComponentSizes}
                defaultFraction={1 - controlHeight}
                componentSizes={componentSizes.current}
                showControls={
                    eventType.current == "webinar" ||
                    eventType.current == "conference"
                }
                >
                {/* MainGridComponent shows the main grid view - not used at all in chat event type  and conference event type when screenshare is not active*/}
                {/* MainGridComponent becomes the dominant grid view in broadcast and webinar event types */}
                {/* MainGridComponent becomes the dominant grid view in conference event type when screenshare is active */}

                <MainGridComponent
                    height={componentSizes.current.mainHeight}
                    width={componentSizes.current.mainWidth}
                    backgroundColor="rgba(217, 227, 234, 0.99)"
                    mainSize={mainHeightWidth}
                    showAspect={mainHeightWidth > 0 ? true : false}
                    timeBackgroundColor={recordState}
                    meetingProgressTime={meetingProgressTime}
                >
                    <FlexibleVideo
                    customWidth={componentSizes.current.mainWidth}
                    customHeight={componentSizes.current.mainHeight}
                    rows={1}
                    columns={1}
                    componentsToRender={
                        mainGridStream.current ? mainGridStream.current : []
                    }
                    showAspect={
                        mainGridStream.current.length > 0 &&
                        !(whiteboardStarted.current && !whiteboardEnded.current)
                    }
                    />

                    <ControlButtonsComponentTouch
                    buttons={controlBroadcastButtons}
                    position={"right"}
                    location={"bottom"}
                    direction={"vertical"}
                    showAspect={eventType.current == "broadcast"}
                    />

                    {/* Button to launch recording modal */}
                    <ControlButtonsComponentTouch
                    buttons={recordButton}
                    direction={"horizontal"}
                    showAspect={
                        eventType.current == "broadcast" &&
                        !showRecordButtons &&
                        islevel.current == "2"
                    }
                    location="bottom"
                    position="middle"
                    />

                    {/* Buttons to control recording */}
                    <ControlButtonsComponentTouch
                    buttons={recordButtons}
                    direction={"horizontal"}
                    showAspect={
                        eventType.current == "broadcast" &&
                        showRecordButtons &&
                        islevel.current == "2"
                    }
                    location="bottom"
                    position="middle"
                    />
                    <AudioGrid
                    componentsToRender={
                        audioOnlyStreams.current ? audioOnlyStreams.current : []
                    }
                    />
                </MainGridComponent>
                </MainScreenComponent>
            </MainAspectComponent>
            </MainContainerComponent>
        )}

        <ParticipantsModal
            backgroundColor="rgba(217, 227, 234, 0.99)"
            isParticipantsModalVisible={isParticipantsModalVisible}
            onParticipantsClose={() => updateIsParticipantsModalVisible(false)}
            participantsCounter={participantsCounter.current}
            onParticipantsFilterChange={onParticipantsFilterChange}
            parameters={{
            updateParticipants: updateParticipants,
            updateIsParticipantsModalVisible: updateIsParticipantsModalVisible,

            updateDirectMessageDetails,
            updateStartDirectMessage,
            updateIsMessagesModalVisible,

            showAlert: showAlert,

            filteredParticipants: filteredParticipants.current,
            participants: filteredParticipants.current,
            roomName: roomName.current,
            islevel: islevel.current,
            member: member.current,
            coHostResponsibility: coHostResponsibility.current,
            coHost: coHost.current,
            eventType: eventType.current,

            startDirectMessage: startDirectMessage.current,
            directMessageDetails: directMessageDetails.current,
            socket: socket.current,

            getUpdatedAllParams: getAllParams,
            }}
        />

        <RecordingModal
            backgroundColor="rgba(217, 227, 234, 0.99)"
            isRecordingModalVisible={isRecordingModalVisible}
            onClose={() => updateIsRecordingModalVisible(false)}
            startRecording={startRecording}
            confirmRecording={confirmRecording}
            parameters={{
            ...getAllParams(),
            ...mediaSFUFunctions(),
            }}
        />

        <MessagesModal
            backgroundColor={
            eventType.current == "webinar" || eventType.current == "conference"
                ? "#f5f5f5"
                : "rgba(255, 255, 255, 0.25)"
            }
            isMessagesModalVisible={isMessagesModalVisible}
            onMessagesClose={() => updateIsMessagesModalVisible(false)}
            messages={messages.current}
            eventType={eventType.current}
            member={member.current}
            islevel={islevel.current}
            coHostResponsibility={coHostResponsibility.current}
            coHost={coHost.current}
            startDirectMessage={startDirectMessage.current}
            directMessageDetails={directMessageDetails.current}
            updateStartDirectMessage={updateStartDirectMessage}
            updateDirectMessageDetails={updateDirectMessageDetails}
            showAlert={showAlert}
            roomName={roomName.current}
            socket={socket.current}
            chatSetting={chatSetting.current}
        />

        <ConfirmExitModal
            backgroundColor="rgba(181, 233, 229, 0.97)"
            isConfirmExitModalVisible={isConfirmExitModalVisible}
            onConfirmExitClose={() => updateIsConfirmExitModalVisible(false)}
            member={member.current}
            roomName={roomName.current}
            socket={socket.current}
            islevel={islevel.current}
        />

        <ConfirmHereModal
            backgroundColor="rgba(181, 233, 229, 0.97)"
            isConfirmHereModalVisible={isConfirmHereModalVisible}
            onConfirmHereClose={() => updateIsConfirmHereModalVisible(false)}
            member={member.current}
            roomName={roomName.current}
            socket={socket.current}
        />

        <ShareEventModal
            isShareEventModalVisible={isShareEventModalVisible}
            onShareEventClose={() => updateIsShareEventModalVisible(false)}
            roomName={roomName.current}
            islevel={islevel.current}
            adminPasscode={adminPasscode.current}
            eventType={eventType.current}
        />

        <AlertComponent
            visible={alertVisible}
            message={alertMessage}
            type={alertType}
            duration={alertDuration}
            onHide={() => setAlertVisible(false)}
            textColor={"#ffffff"}
        />

        <LoadingModal
            isVisible={isLoadingModalVisible}
            backgroundColor="rgba(217, 227, 234, 0.99)"
            displayColor="black"
        />
        </div>
    );
};

export default BroadcastScreen;
```

This sample code demonstrates the import and usage of various components and features for a Broadcast screen, including rendering different UI components based on the validation state, handling socket connections, displaying video streams, controlling recording, and managing component sizes.

Here's a sample usage of the control button components as used above:

```jsx
    const recordButton = [
        {
        icon: faRecordVinyl,
        text: "Record",
        onPress: () => {
            // Action for the Record button
            launchRecording({
            updateIsRecordingModalVisible: updateIsRecordingModalVisible,
            isRecordingModalVisible: isRecordingModalVisible,
            showAlert: showAlert,
            stopLaunchRecord: stopLaunchRecord.current,
            canLaunchRecord: canLaunchRecord.current,
            recordingAudioSupport: recordingAudioSupport.current,
            recordingVideoSupport: recordingVideoSupport.current,
            updateCanRecord: updateCanRecord,
            updateClearedToRecord: updateClearedToRecord,
            recordStarted: recordStarted.current,
            recordPaused: recordPaused.current,
            localUIMode: localUIMode.current,
            });
        },
        activeColor: "black",
        inActiveColor: "black",
        show: true,
        },
    ];
    
     const recordButtons = [
        //recording state control and recording timer buttons
        //Replace or remove any of the buttons as you wish

        //Refer to ControlButtonsAltComponent.js for more details on how to add custom buttons

        {
        icon: faPlayCircle,
        active: recordPaused.current === false,
        onPress: () => {
            updateRecording({
            parameters: { ...getAllParams(), ...mediaSFUFunctions() },
            });
        },
        activeColor: "black",
        inActiveColor: "black",
        alternateIcon: faPauseCircle,
        show: true,
        },
        {
        icon: faStopCircle,
        active: false,
        onPress: () => {
            stopRecording({
            parameters: { ...getAllParams(), ...mediaSFUFunctions() },
            });
        },
        activeColor: "green",
        inActiveColor: "black",
        show: true,
        },
        {
        customComponent: (
            <div
            style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                margin: 2,
            }}
            >
            <span
                style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                margin: 0,
                }}
            >
                {recordingProgressTime}
            </span>
            </div>
        ),
        show: true,
        },
        {
        icon: faDotCircle,
        active: false,
        onPress: () => console.log("Status pressed"),
        activeColor: "black",
        inActiveColor: recordPaused.current === false ? "red" : "yellow",
        show: true,
        },
        {
        icon: faCog,
        active: false,
        onPress: () => {
            launchRecording({
            updateIsRecordingModalVisible: updateIsRecordingModalVisible,
            isRecordingModalVisible: isRecordingModalVisible,
            showAlert: showAlert,
            stopLaunchRecord: stopLaunchRecord.current,
            canLaunchRecord: canLaunchRecord.current,
            recordingAudioSupport: recordingAudioSupport.current,
            recordingVideoSupport: recordingVideoSupport.current,
            updateCanRecord: updateCanRecord,
            updateClearedToRecord: updateClearedToRecord,
            recordStarted: recordStarted.current,
            recordPaused: recordPaused.current,
            localUIMode: localUIMode.current,
            });
        },
        activeColor: "green",
        inActiveColor: "black",
        show: true,
        },
    ];

    const controlBroadcastButtons: ButtonTouch[] = [
        // control buttons for broadcast
        //Replace or remove any of the buttons as you wish

        //Refer to ControlButtonsComponentTouch for more details on how to add custom buttons

        {
        icon: faUsers,
        active: true,
        alternateIcon: faUsers,
        onPress: () => {
            launchParticipants({
            updateIsParticipantsModalVisible: updateIsParticipantsModalVisible,
            isParticipantsModalVisible: isParticipantsModalVisible,
            });
        },
        activeColor: "black",
        inActiveColor: "black",
        show: islevel.current === "2",
        },
        {
        icon: faShareAlt,
        active: true,
        alternateIcon: faShareAlt,
        onPress: () => updateIsShareEventModalVisible(!isShareEventModalVisible),
        activeColor: "black",
        inActiveColor: "black",
        show: true,
        },
        {
        customComponent: (
            <div style={{ position: "relative" }}>
            {/* Your icon */}
            <FontAwesomeIcon icon={faComments} size={"lg"} color="black" />
            {/* Conditionally render a badge */}
            {showMessagesBadge && (
                <div
                style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                >
                <div
                    style={{
                    backgroundColor: "red",
                    borderRadius: 12,
                    paddingLeft: 4,
                    paddingRight: 4,
                    paddingTop: 4,
                    paddingBottom: 4,
                    }}
                >
                    <span
                    style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
                    ></span>
                </div>
                </div>
            )}
            </div>
        ),
        onPress: () =>
            launchMessages({
            updateIsMessagesModalVisible: updateIsMessagesModalVisible,
            isMessagesModalVisible: isMessagesModalVisible,
            }),
        show: true,
        },
        {
        icon: faSync,
        active: true,
        alternateIcon: faSync,
        onPress: () =>
            switchVideoAlt({
            parameters: {
                ...getAllParams(),
                ...mediaSFUFunctions(),
            },
            }),
        activeColor: "black",
        inActiveColor: "black",
        show: islevel.current === "2",
        },
        {
        icon: faVideoSlash,
        alternateIcon: faVideo,
        active: videoActive,
        onPress: () =>
            clickVideo({
            parameters: {
                ...getAllParams(),
                ...mediaSFUFunctions(),
            },
            }),
        show: islevel.current === "2",
        activeColor: "green",
        inActiveColor: "red",
        },
        {
        icon: faMicrophoneSlash,
        alternateIcon: faMicrophone,
        active: micActive,
        onPress: () =>
            clickAudio({
            parameters: {
                ...getAllParams(),
                ...mediaSFUFunctions(),
            },
            }),
        activeColor: "green",
        inActiveColor: "red",
        show: islevel.current === "2",
        },
        {
        customComponent: (
            <div
            style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                margin: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
            }}
            >
            <FontAwesomeIcon icon={faChartBar} size={"lg"} color="black" />
            <span
                style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                margin: 0,
                }}
            >
                {participantsCounter.current}
            </span>
            </div>
        ),
        show: true,
        },
        {
        icon: faPhone,
        active: endCallActive,
        onPress: () =>
            launchConfirmExit({
            updateIsConfirmExitModalVisible: updateIsConfirmExitModalVisible,
            isConfirmExitModalVisible: isConfirmExitModalVisible,
            }),
        activeColor: "green",
        inActiveColor: "red",
        show: true,
        },
        {
        icon: faPhone,
        active: endCallActive,
        onPress: () => console.log("End Call pressed"), //not in use
        activeColor: "transparent",
        inActiveColor: "transparent",
        backgroundColor: { default: "transparent" },
        show: false,
        },
    ];
```

This sample code defines arrays `recordButtons` and `controlBroadcastButtons`, each containing configuration objects for different control buttons. These configurations include properties such as icon, active state, onPress function, activeColor, inActiveColor, and show flag to control the visibility of each button.

You can customize these configurations according to your requirements, adding, removing, or modifying buttons as needed. Additionally, you can refer to the relevant component files (`ControlButtonsAltComponent` and `ControlButtonsComponentTouch`) for more details on how to add custom buttons.

<div style="text-align: center;">
  Preview of Broadcast Page

<img src="https://mediasfu.com/images/broadcast.png" alt="Preview of Welcome Page" title="Welcome Page" style="max-height: 500px;">

<!-- Add a blank line for spacing -->
&nbsp;
  
  Preview of Conference Page

<img src="https://mediasfu.com/images/conference1.png" alt="Preview of Prejoin Page" title="Prejoin Page" style="max-height: 500px;">


### Preview of Conference Page's Mini Grids

<img src="https://mediasfu.com/images/conference2.png" alt="Preview of Prejoin Page" title="Prejoin Page" style="max-height: 500px;">

</div>
<br />


# Advanced Usage Guide <a name="advanced-usage-guide"></a>

In-depth documentation for advanced users, covering complex functionalities and customization options.

**Introduction to Advanced Media Control Functions:**

In advanced usage scenarios, users often encounter complex tasks related to media control, connectivity, and streaming management within their applications. To facilitate these tasks, a comprehensive set of functions is provided, offering granular control over various aspects of media handling and communication with servers.

These advanced media control functions encompass a wide range of functionalities, including connecting to and disconnecting from WebSocket servers, joining and updating room parameters, managing device creation, switching between different media streams, handling permissions, processing consumer transports, managing screen sharing, adjusting layouts dynamically, and much more.

This robust collection of functions empowers developers to tailor their applications to specific requirements, whether it involves intricate media streaming setups, real-time communication protocols, or sophisticated user interface interactions. With these tools at their disposal, developers can create rich and responsive media experiences that meet the demands of their users and applications.

Here's a tabulated list of advanced control functions along with brief explanations (click the function(link) for full usage guide):

| Function                         | Explanation                                                                                             |
|----------------------------------|---------------------------------------------------------------------------------------------------------|
| [`connectSocket`](https://www.mediasfu.com/reactjs/functions/connectSocket)                  | Connects to the WebSocket server.                                                                       |
| [`disconnectSocket`](https://www.mediasfu.com/reactjs/functions/disconnectSocket)               | Disconnects from the WebSocket server.                                                                  |
| [`joinRoomClient`](https://www.mediasfu.com/reactjs/functions/joinRoomClient)                 | Joins a room as a client.                                                                               |
| [`updateRoomParametersClient`](https://www.mediasfu.com/reactjs/functions/updateRoomParametersClient)     | Updates room parameters as a client.                                                                    |
| [`createDeviceClient`](https://www.mediasfu.com/reactjs/functions/createDeviceClient)             | Creates a device as a client.                                                                           |
| [`switchVideoAlt`](https://www.mediasfu.com/reactjs/functions/switchVideoAlt)                 | Switches video/camera streams.                                                                          |
| [`clickVideo`](https://www.mediasfu.com/reactjs/functions/clickVideo)                     | Handles clicking on video controls.                                                                     |
| [`clickAudio`](https://www.mediasfu.com/reactjs/functions/clickAudio)                     | Handles clicking on audio controls.                                                                     |
| [`clickScreenShare`](https://www.mediasfu.com/reactjs/functions/clickScreenShare)               | Handles clicking on screen share controls.                                                              |
| [`streamSuccessVideo`](https://www.mediasfu.com/reactjs/functions/streamSuccessVideo)             | Handles successful video streaming.                                                                     |
| [`streamSuccessAudio`](https://www.mediasfu.com/reactjs/functions/streamSuccessAudio)             | Handles successful audio streaming.                                                                     |
| [`streamSuccessScreen`](https://www.mediasfu.com/reactjs/functions/streamSuccessScreen)            | Handles successful screen sharing.                                                                      |
| [`streamSuccessAudioSwitch`](https://www.mediasfu.com/reactjs/functions/streamSuccessAudioSwitch)       | Handles successful audio switching.                                                                     |
| [`checkPermission`](https://www.mediasfu.com/reactjs/functions/checkPermission)                | Checks for media access permissions.                                                                    |
| [`producerClosed`](https://www.mediasfu.com/reactjs/functions/producerClosed)                 | Handles the closure of a producer.                                                                      |
| [`newPipeProducer`](https://www.mediasfu.com/reactjs/functions/newPipeProducer)                | Creates receive transport for a new piped producer.                                                     |
| [`updateMiniCardsGrid`](https://www.mediasfu.com/reactjs/functions/updateMiniCardsGrid)            | Updates the mini-grids (mini cards) grid.                                                               |
| [`mixStreams`](https://www.mediasfu.com/reactjs/functions/mixStreams)                     | Mixes streams and prioritizes interesting ones together.                                                |
| [`dispStreams`](https://www.mediasfu.com/reactjs/functions/dispStreams)                    | Displays streams (media).                                                                              |
| [`stopShareScreen`](https://www.mediasfu.com/reactjs/functions/stopShareScreen)                | Stops screen sharing.                                                                                  |
| [`checkScreenShare`](https://www.mediasfu.com/reactjs/functions/checkScreenShare)               | Checks for screen sharing availability.                                                                |
| [`startShareScreen`](https://www.mediasfu.com/reactjs/functions/startShareScreen)               | Starts screen sharing.                                                                                 |
| [`requestScreenShare`](https://www.mediasfu.com/reactjs/functions/requestScreenShare)             | Requests permission for screen sharing.                                                                |
| [`reorderStreams`](https://www.mediasfu.com/reactjs/functions/reorderStreams)                 | Reorders streams (based on interest level).                                                            |
| [`prepopulateUserMedia`](https://www.mediasfu.com/reactjs/functions/prepopulateUserMedia)           | Populates user media (for main grid).                                                                  |
| [`getVideos`](https://www.mediasfu.com/reactjs/functions/getVideos)                      | Retrieves videos that are pending.                                                                     |
| [`rePort`](https://www.mediasfu.com/reactjs/functions/rePort)                         | Handles re-porting (updates of changes in UI when recording).                                           |
| [`trigger`](https://www.mediasfu.com/reactjs/functions/trigger)                        | Triggers actions (reports changes in UI to backend for recording).                                      |
| [`consumerResume`](https://www.mediasfu.com/reactjs/functions/consumerResume)                 | Resumes consumers.                                                                                     |
| [`connectSendTransportAudio`](https://www.mediasfu.com/reactjs/functions/connectSendTransportAudio)      | Connects send transport for audio.                                                                     |
| [`connectSendTransportVideo`](https://www.mediasfu.com/reactjs/functions/connectSendTransportVideo)      | Connects send transport for video.                                                                     |
| [`connectSendTransportScreen`](https://www.mediasfu.com/reactjs/functions/connectSendTransportScreen)    | Connects send transport for screen sharing.                                                            |
| [`processConsumerTransports`](https://www.mediasfu.com/reactjs/functions/processConsumerTransports)      | Processes consumer transports to pause/resume based on the current active page.                         |
| [`resumePauseStreams`](https://www.mediasfu.com/reactjs/functions/resumePauseStreams)             | Resumes or pauses streams.                                                                             |
| [`readjust`](https://www.mediasfu.com/reactjs/functions/readjust)                       | Readjusts display elements.                                                                            |
| [`checkGrid`](https://www.mediasfu.com/reactjs/functions/checkGrid)                      | Checks the grid sizes to display.                                                                      |
| [`getEstimate`](https://www.mediasfu.com/reactjs/functions/getEstimate)                    | Gets an estimate of grids to add.                                                                      |
| [`calculateRowsAndColumns`](https://www.mediasfu.com/reactjs/functions/calculateRowsAndColumns)        | Calculates rows and columns for the grid.                                                              |
| [`addVideosGrid`](https://www.mediasfu.com/reactjs/functions/addVideosGrid)                  | Adds videos to the grid.                                                                               |
| [`onScreenChanges`](https://www.mediasfu.com/reactjs/functions/onScreenChanges)                | Handles screen changes (orientation and resize).                                                        |
| [`sleep`](https://www.mediasfu.com/reactjs/functions/sleep)                          | Pauses execution for a specified duration.                                                             |
| [`changeVids`](https://www.mediasfu.com/reactjs/functions/changeVids)                     | Changes videos.                                                                                        |
| [`compareActiveNames`](https://www.mediasfu.com/reactjs/functions/compareActiveNames)             | Compares active names (for recording UI changes reporting).                                             |
| [`compareScreenStates`](https://www.mediasfu.com/reactjs/functions/compareScreenStates)           | Compares screen states (for recording changes in grid sizes reporting).                                 |
| [`createSendTransport`](https://www.mediasfu.com/reactjs/functions/createSendTransport)            | Creates a send transport.                                                                              |
| [`resumeSendTransportAudio`](https://www.mediasfu.com/reactjs/functions/resumeSendTransportAudio)       | Resumes a send transport for audio.                                                                    |
| [`receiveAllPipedTransports`](https://www.mediasfu.com/reactjs/functions/receiveAllPipedTransports)      | Receives all piped transports.                                                                         |
| [`disconnectSendTransportVideo`](https://www.mediasfu.com/reactjs/functions/disconnectSendTransportVideo)   | Disconnects send transport for video.                                                                  |
| [`disconnectSendTransportAudio`](https://www.mediasfu.com/reactjs/functions/disconnectSendTransportAudio)   | Disconnects send transport for audio.                                                                  |
| [`disconnectSendTransportScreen`](https://www.mediasfu.com/reactjs/functions/disconnectSendTransportScreen)  | Disconnects send transport for screen sharing.                                                         |
| [`connectSendTransport`](https://www.mediasfu.com/reactjs/functions/connectSendTransport)           | Connects a send transport.                                                                             |
| [`getPipedProducersAlt`](https://www.mediasfu.com/reactjs/functions/getPipedProducersAlt)           | Gets piped producers.                                                                                  |
| [`signalNewConsumerTransport`](https://www.mediasfu.com/reactjs/functions/signalNewConsumerTransport)     | Signals a new consumer transport.                                                                      |
| [`connectRecvTransport`](https://www.mediasfu.com/reactjs/functions/connectRecvTransport)           | Connects a receive transport.                                                                          |
| [`reUpdateInter`](https://www.mediasfu.com/reactjs/functions/reUpdateInter)                   | Re-updates the interface based on audio decibels.                                                      |
| [`updateParticipantAudioDecibels`](https://www.mediasfu.com/reactjs/functions/updateParticipantAudioDecibels) | Updates participant audio decibels.                                                                    |
| [`closeAndResize`](https://www.mediasfu.com/reactjs/functions/closeAndResize)                 | Closes and resizes the media elements.                                                                 |
| [`autoAdjust`](https://www.mediasfu.com/reactjs/functions/autoAdjust)                     | Automatically adjusts display elements.                                                                 |
| [`switchUserVideoAlt`](https://www.mediasfu.com/reactjs/functions/switchUserVideoAlt)             | Switches user video (alternate) (back/front).                                                          |
| [`switchUserVideo`](https://www.mediasfu.com/reactjs/functions/switchUserVideo)                | Switches user video (specific video id).                                                               |
| [`switchUserAudio`](https://www.mediasfu.com/reactjs/functions/switchUserAudio)                | Switches user audio.                                                                                   |
| [`receiveRoomMessages`](https://www.mediasfu.com/reactjs/functions/receiveRoomMessages)            | Receives room messages.                                                                                |
| [`formatNumber`](https://www.mediasfu.com/reactjs/functions/formatNumber)                   | Formats a number (for broadcast viewers).                                                              |
| [`connectIps`](https://www.mediasfu.com/reactjs/functions/connectIps)                     | Connects IPs (connect to consuming servers)                                                            |
| [`startMeetingProgressTimer`](https://www.mediasfu.com/reactjs/functions/startMeetingProgressTimer)      | Starts the meeting progress timer.       |
| [`stopRecording`](https://www.mediasfu.com/reactjs/functions/stopRecording)                  | Stops the recording process. |
| [`pollUpdated`](https://www.mediasfu.com/reactjs/functions/pollUpdated)                    | Handles updated poll data. |
| [`handleVotePoll`](https://www.mediasfu.com/reactjs/functions/handleVotePoll)                 | Handles voting in a poll. |
| [`handleCreatePoll`](https://www.mediasfu.com/reactjs/functions/handleCreatePoll)               | Handles creating a poll. |
| [`handleEndPoll`](https://www.mediasfu.com/reactjs/functions/handleEndPoll)                 | Handles ending a poll. |
| [`breakoutRoomUpdated`](https://www.mediasfu.com/reactjs/functions/breakoutRoomUpdated)           | Handles updated breakout room data. |
| [`captureCanvasStream`](https://www.mediasfu.com/reactjs/functions/captureCanvasStream)            | Captures a canvas stream. |
| [`resumePauseAudioStreams`](https://www.mediasfu.com/reactjs/functions/resumePauseAudioStreams)        | Resumes or pauses audio streams. |
| [`processConsumerTransportsAudio`](https://www.mediasfu.com/reactjs/functions/processConsumerTransportsAudio)  | Processes consumer transports for audio. |


### Room Socket Events

In the context of a room's real-time communication, various events occur, such as user actions, room management updates, media controls, and meeting status changes. To effectively handle these events and synchronize the application's state with the server, specific functions are provided. These functions act as listeners for socket events, allowing the application to react accordingly.

#### Provided Socket Event Handling Functions:

| Function                      | Explanation                                                                                             |
|-------------------------------|---------------------------------------------------------------------------------------------------------|
| [`userWaiting`](https://www.mediasfu.com/reactjs/functions/userWaiting)                 | Triggered when a user is waiting.                                                                       |
| [`personJoined`](https://www.mediasfu.com/reactjs/functions/personJoined)                | Triggered when a person joins the room.                                                                 |
| [`allWaitingRoomMembers`](https://www.mediasfu.com/reactjs/functions/allWaitingRoomMembers)       | Triggered when information about all waiting room members is received.                                  |
| [`roomRecordParams`](https://www.mediasfu.com/reactjs/functions/roomRecordParams)            | Triggered when room recording parameters are received.                                                  |
| [`banParticipant`](https://www.mediasfu.com/reactjs/functions/banParticipant)              | Triggered when a participant is banned.                                                                 |
| [`updatedCoHost`](https://www.mediasfu.com/reactjs/functions/updatedCoHost)               | Triggered when the co-host information is updated.                                                      |
| [`participantRequested`](https://www.mediasfu.com/reactjs/functions/participantRequested)        | Triggered when a participant requests access.                                                            |
| [`screenProducerId`](https://www.mediasfu.com/reactjs/functions/screenProducerId)            | Triggered when the screen producer ID is received.                                                       |
| [`updateMediaSettings`](https://www.mediasfu.com/reactjs/functions/updateMediaSettings)         | Triggered when media settings are updated.                                                               |
| [`producerMediaPaused`](https://www.mediasfu.com/reactjs/functions/producerMediaPaused)         | Triggered when producer media is paused.                                                                 |
| [`producerMediaResumed`](https://www.mediasfu.com/reactjs/functions/producerMediaResumed)        | Triggered when producer media is resumed.                                                                |
| [`producerMediaClosed`](https://www.mediasfu.com/reactjs/functions/producerMediaClosed)         | Triggered when producer media is closed.                                                                 |
| [`controlMediaHost`](https://www.mediasfu.com/reactjs/functions/controlMediaHost)            | Triggered when media control is hosted.                                                                  |
| [`meetingEnded`](https://www.mediasfu.com/reactjs/functions/meetingEnded)                | Triggered when the meeting ends.                                                                         |
| [`disconnectUserSelf`](https://www.mediasfu.com/reactjs/functions/disconnectUserSelf)          | Triggered when a user disconnects.                                                                       |
| [`receiveMessage`](https://www.mediasfu.com/reactjs/functions/receiveMessage)              | Triggered when a message is received.                                                                    |
| [`meetingTimeRemaining`](https://www.mediasfu.com/reactjs/functions/meetingTimeRemaining)        | Triggered when meeting time remaining is received.                                                        |
| [`meetingStillThere`](https://www.mediasfu.com/reactjs/functions/meetingStillThere)           | Triggered when the meeting is still active.                                                              |
| [`startRecords`](https://www.mediasfu.com/reactjs/functions/startRecords)                | Triggered when recording starts.                                                                         |
| [`reInitiateRecording`](https://www.mediasfu.com/reactjs/functions/reInitiateRecording)         | Triggered when recording needs to be re-initiated.                                                       |
| [`getDomains`](https://www.mediasfu.com/reactjs/functions/getDomains)                  | Triggered when domains are received.                                                                     |
| [`updateConsumingDomains`](https://www.mediasfu.com/reactjs/functions/updateConsumingDomains)      | Triggered when consuming domains are updated.                                                            |
| [`recordingNotice`](https://www.mediasfu.com/reactjs/functions/recordingNotice)             | Triggered when a recording notice is received.                                                           |
| [`timeLeftRecording`](https://www.mediasfu.com/reactjs/functions/timeLeftRecording)           | Triggered when time left for recording is received.                                                       |
| [`stoppedRecording`](https://www.mediasfu.com/reactjs/functions/stoppedRecording)           | Triggered when recording stops.                                                                          |
| [`hostRequestResponse`](https://www.mediasfu.com/reactjs/functions/hostRequestResponse)         | Triggered when the host request response is received.                                                    |
| [`allMembers`](https://www.mediasfu.com/reactjs/functions/allMembers)                  | Triggered when information about all members is received.                                                 |
| [`allMembersRest`](https://www.mediasfu.com/reactjs/functions/allMembersRest)              | Triggered when information about all members is received (rest of the members).                           |
| [`disconnect`](https://www.mediasfu.com/reactjs/functions/disconnect)                  | Triggered when a disconnect event occurs.                                                                |
| [`pollUpdated`](https://www.mediasfu.com/reactjs/functions/pollUpdated)                 | Triggered when a poll is updated.                                                                        |
| [`breakoutRoomUpdated`](https://www.mediasfu.com/reactjs/functions/breakoutRoomUpdated)         | Triggered when a breakout room is updated.  
| [`whiteboardUpdated`](https://www.mediasfu.com/reactjs/functions/whiteboardUpdated)            | Handles updated whiteboard data. 
| [`whiteboardAction`](https://www.mediasfu.com/reactjs/functions/whiteboardAction)              | Handles whiteboard actions. |       

#### Sample Usage

```javascript
// Example usage of provided socket event handling functions

import { participantRequested, screenProducerId, updateMediaSettings } from 'mediasfu-reactjs'

socket.current.on(
"participantRequested",
async ({ userRequest }: { userRequest: Request }) => {
    await participantRequested({
    userRequest,
    requestList: requestList.current,
    waitingRoomList: waitingRoomList.current,
    updateTotalReqWait,
    updateRequestList,
    });
}
);

socket.current.on(
"screenProducerId",
async ({ producerId }: { producerId: string }) => {
    screenProducerId({
    producerId,
    screenId: screenId.current,
    membersReceived: membersReceived.current,
    shareScreenStarted: shareScreenStarted.current,
    deferScreenReceived: deferScreenReceived.current,
    participants: participants.current,
    updateScreenId,
    updateShareScreenStarted,
    updateDeferScreenReceived,
    });
}
);

socket.current.on(
"updateMediaSettings",
async ({ settings }: { settings: Settings }) => {
    updateMediaSettings({
    settings,
    updateAudioSetting,
    updateVideoSetting,
    updateScreenshareSetting,
    updateChatSetting,
    });
}
);
```

These functions enable seamless interaction with the server and ensure that the application stays synchronized with the real-time events occurring within the room.

### Customizing Media Display in MediaSFU

By default, media display in MediaSFU is handled by the following key functions:

- **`prepopulateUserMedia`**: This function controls the main media grid, such as the host's video in webinar or broadcast views (MainGrid).
- **`addVideosGrid`**: This function manages the mini grid's media, such as participants' media in MiniGrid views (MiniCards, AudioCards, VideoCards).

#### Customizing the Media Display

If you want to modify the default content displayed by MediaSFU components, such as the `MiniCard`, `AudioCard`, or `VideoCard`, you can replace the default UI with your own custom components.

To implement your custom UI for media display:

1. **Custom MainGrid (Host's Video)**: 
   - Modify the UI in the `prepopulateUserMedia` function. 
   - Example link to MediaSFU's default implementation: [`prepopulateUserMedia`](https://github.com/MediaSFU/MediaSFU-ReactJS/blob/main/src/consumers/prepopulateUserMedia.tsx).

2. **Custom MiniGrid (Participants' Media)**:
   - Modify the UI in the `addVideosGrid` function.
   - Example link to MediaSFU's default implementation: [`addVideosGrid`](https://github.com/MediaSFU/MediaSFU-ReactJS/blob/main/src/consumers/addVideosGrid.tsx).

To create a custom UI, you can refer to existing MediaSFU implementations like:

- [MediasfuGeneric](https://github.com/MediaSFU/MediaSFU-ReactJS/blob/main/src/components/mediasfuComponents/MediasfuGeneric.tsx)
- [MediasfuBroadcast](https://github.com/MediaSFU/MediaSFU-ReactJS/blob/main/src/components/mediasfuComponents/MediasfuBroadcast.tsx)

Once your custom components are built, modify the imports of `prepopulateUserMedia` and `addVideosGrid` to point to your custom implementations instead of the default MediaSFU ones.

This allows for full flexibility in how media is displayed in both the main and mini grids, giving you the ability to tailor the user experience to your specific needs.


# API Reference <a name="api-reference"></a>

For detailed information on the API methods and usage, please refer to the [MediaSFU API Documentation](https://mediasfu.com/developers).

If you need further assistance or have any questions, feel free to ask!

For sample codes and practical implementations, visit the [MediaSFU Sandbox](https://www.mediasfu.com/sandbox).

## Media Device and Stream Utility Methods <a name="media-device-and-stream-utility-methods"></a>

MediaSFU provides utility methods for accessing media devices and participant streams programmatically. These methods are especially useful when building custom UI components or implementing advanced media management features.

### Available Utility Methods

| Method | Description |
|--------|-------------|
| `getMediaDevicesList` | Retrieves available media devices (cameras/microphones) on the user's system. |
| `getParticipantMedia` | Gets the media stream of a specific participant by ID or name. |

### Usage Examples

#### 1. Get Available Media Devices

Use `getMediaDevicesList` to enumerate available video or audio input devices:

```typescript
// Access the method from sourceParameters
const { getMediaDevicesList } = sourceParameters;

// Get available video input devices (cameras)
const videoDevices = await getMediaDevicesList("videoinput");
console.log("Available cameras:", videoDevices);

// Get available audio input devices (microphones)  
const audioDevices = await getMediaDevicesList("audioinput");
console.log("Available microphones:", audioDevices);

// Example response format:
// [
//   { deviceId: "abc123", kind: "videoinput", label: "FaceTime HD Camera" },
//   { deviceId: "def456", kind: "videoinput", label: "External USB Camera" }
// ]
```

#### 2. Get Participant Media Streams

Use `getParticipantMedia` to retrieve a participant's video or audio stream:

```typescript
// Access the method from sourceParameters
const { getParticipantMedia } = sourceParameters;

// Get participant's video stream by ID
const participantVideoStream = await getParticipantMedia({
  id: "participant123",
  name: "John Doe",
  kind: "video"
});

if (participantVideoStream) {
  // Use the stream (e.g., attach to video element)
  const videoElement = document.getElementById("participant-video");
  videoElement.srcObject = participantVideoStream;
  console.log("Got participant video stream:", participantVideoStream);
}

// Get participant's audio stream by name
const participantAudioStream = await getParticipantMedia({
  name: "Alice Smith",
  kind: "audio"
});

if (participantAudioStream) {
  // Use the audio stream
  console.log("Got participant audio stream:", participantAudioStream);
}
```

### Method Parameters

**`getMediaDevicesList(kind: "videoinput" | "audioinput"): Promise<MediaDeviceInfo[]>`**

Returns a list of available media devices filtered by type.

- **Parameters:**
  - `kind`: `"videoinput"` | `"audioinput"` - Type of media device to enumerate
- **Returns:** `Promise<MediaDeviceInfo[]>` - Array of media device information objects

**`getParticipantMedia({ id?, name, kind }: { id?: string, name: string, kind: "video" | "audio" }): Promise<MediaStream | null>`**

Retrieves the media stream of a specific participant.

- **Parameters:**
  - `id` (optional): `string` - Participant ID to search by (takes priority over name)
  - `name`: `string` - Participant's display name (used if ID not provided or not found)
  - `kind`: `"video"` | `"audio"` - Type of media stream to retrieve
- **Returns:** `Promise<MediaStream | null>` - The participant's media stream or null if not found

### Common Use Cases

1. **Device Selection UI**: Build custom device picker components that allow users to switch between cameras and microphones
2. **Advanced UI Components**: Create sophisticated media display components with direct stream access
3. **Media Processing**: Implement custom audio/video processing pipelines
4. **Accessibility Features**: Build features that enhance accessibility with custom media handling
5. **Analytics & Monitoring**: Track and analyze media streams for quality monitoring

### Example: Custom Device Selector Component

```typescript
import React, { useState, useEffect } from 'react';

function DeviceSelector({ sourceParameters }) {
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const { getMediaDevicesList } = sourceParameters;

  useEffect(() => {
    const loadDevices = async () => {
      const cameras = await getMediaDevicesList("videoinput");
      const microphones = await getMediaDevicesList("audioinput");
      setVideoDevices(cameras);
      setAudioDevices(microphones);
    };

    loadDevices();
  }, []);

  return (
    <div>
      <h3>Select Camera</h3>
      <select>
        {videoDevices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
          </option>
        ))}
      </select>

      <h3>Select Microphone</h3>
      <select>
        {audioDevices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Example: Display Specific Participant Stream

```typescript
import React, { useEffect, useRef } from 'react';

function ParticipantVideo({ participantName, sourceParameters }) {
  const videoRef = useRef(null);
  const { getParticipantMedia } = sourceParameters;

  useEffect(() => {
    const loadStream = async () => {
      const stream = await getParticipantMedia({
        name: participantName,
        kind: "video"
      });

      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };

    loadStream();
  }, [participantName]);

  return (
    <div>
      <h3>{participantName}'s Video</h3>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%' }} />
    </div>
  );
}
```

These utility methods provide low-level access to MediaSFU's media management system, enabling advanced customizations while maintaining compatibility with the core MediaSFU functionality.

# Troubleshooting <a name="troubleshooting"></a>

1. **Optimizing HTML Configuration**:
   If users experience responsiveness issues, whether during local development or in production, they can optimize their HTML configuration to ensure proper scaling and viewport settings. By adding the following meta tag to the HTML `<head>` section, users can specify viewport settings for optimal display:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
   ```

2. **Issues with Starting User Media (Audio/Video)**:
   If users encounter issues with starting user media (audio/video), they should try running in HTTPS mode. To enable HTTPS mode, users can modify their start script in the package.json file as follows:
   ```json
   "start": "set HTTPS=true && react-scripts start",
   ```

3. **Interactive Testing with MediaSFU's Frontend**:
   Users can interactively join MediaSFU's frontend in the same room to analyze if various events or media transmissions are happening as expected. For example, adding a user there to check changes made by the host and vice versa.

These troubleshooting steps should help users address common issues and optimize their experience with MediaSFU. If the issues persist or additional assistance is needed, users can refer to the [documentation](https://mediasfu.com/docs) or reach out to the support team for further assistance.


https://github.com/user-attachments/assets/310cb87c-dade-445d-aee7-dea1889d6dc4

# Contributing <a name="contributing"></a>

We welcome contributions from the community to improve the project! If you'd like to contribute, please check out our [GitHub repository](https://github.com/MediaSFU-ReactJS) and follow the guidelines outlined in the README.

If you encounter any issues or have suggestions for improvement, please feel free to open an issue on GitHub.

We appreciate your interest in contributing to the project!

If you need further assistance or have any questions, feel free to ask!
```



