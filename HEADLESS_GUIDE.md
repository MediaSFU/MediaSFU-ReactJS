# Build a custom React video experience with MediaSFU headless mode

Use MediaSFU headless mode when your application should own the room layout,
controls, navigation, and visual identity while the SDK manages signaling,
WebRTC media, participants, moderation, and room lifecycle.

This guide covers `mediasfu-reactjs`. For a maintained prebuilt interface,
start with `ModernMediasfuGeneric`. For a custom interface, mount the same room
engine with `returnUI={false}` and read its state through
`useMediasfuHeadless()`.

## Start from a GitHub application

For a classroom with teacher and learner views, begin with
[Interactive Classroom](https://github.com/MediaSFU/mediasfu-interactive-classroom).
It demonstrates a fully custom UI, a hybrid UI using SDK components, and the
standard room UI. [Try the classroom](https://mediasfu.com/showcases/interactive-classroom)
to compare the interaction patterns before changing your layout.

For other products, choose [Familiar Calls](https://github.com/MediaSFU/mediasfu-familiar-calls),
[Live Auction](https://github.com/MediaSFU/mediasfu-live-auction),
[Watch Together](https://github.com/MediaSFU/mediasfu-watch-together),
[Agents](https://github.com/MediaSFU/Agents),
[VOIP](https://github.com/MediaSFU/VOIP), or
[SpacesTek Advanced](https://github.com/MediaSFU/SpacesTekAdvanced).
See the [starter comparison](README.md#choose-a-starter-project) for widgets,
custom recording, and smaller SDK examples. Follow the selected repository's
backend setup and platform-specific instructions rather than mixing room
engines or copying another application's credentials.

## Before you start

- Install React 18 or 19 and `mediasfu-reactjs`.
- Obtain API access from [MediaSFU](https://mediasfu.com/documentation/).
- Explore room request and response shapes in the
  [MediaSFU Sandbox](https://mediasfu.com/sandbox/).
- Keep reusable MediaSFU Cloud credentials on an authenticated backend.

MediaSFU Cloud is the managed service. [MediaSFU Open](https://github.com/MediaSFU/MediaSFUOpen)
is a media server that you deploy, secure, and operate on your own
infrastructure. A client-side `localLink` points to an existing MediaSFU Open
deployment; it does not install or start the server.

## Secure room authority

Browser code cannot keep an API key secret. In a released application, send an
authenticated create or join request to your backend. The backend validates the
user and requested room role, adds the MediaSFU credential, calls the room API,
and returns only the room-scoped result the SDK needs.

A direct API key may be convenient for an isolated local experiment, but it is
visible to anyone who can inspect the application. Use restricted, revocable
development credentials and never commit them or include them in screenshots.

See the [secure backend proxy guide](https://mediasfu.com/docs/usage/secure-backend-proxy/)
for a complete architecture.

## Minimal headless room

Pass your authenticated create/join adapters to this component. They must follow
the SDK callback contracts and call your backend, not expose a reusable key.

```tsx
import type { ComponentProps } from 'react';
import {
  AudioGrid,
  ModernMediasfuGeneric,
  PreJoinPage,
  useMediasfuHeadless,
} from 'mediasfu-reactjs';

type ProxyProps = Required<Pick<ComponentProps<typeof ModernMediasfuGeneric>,
  'createMediaSFURoom' | 'joinMediaSFURoom'
>>;

export function Call(proxy: ProxyProps) {
  const room = useMediasfuHeadless();
  const primary =
    room.screenShare.stream ?? room.remoteVideos[0]?.stream ?? room.localVideo;

  return (
    <main>
      <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
        <ModernMediasfuGeneric
          {...proxy}
          credentials={{ apiUserName: 'client00', apiKey: '0'.repeat(64) }}
          PrejoinPage={PreJoinPage}
          returnUI={false}
          noUIPreJoinOptions={{
            action: 'create',
            userName: 'Ava',
            duration: 15,
            capacity: 4,
            eventType: 'conference',
          }}
          sourceParameters={room.sourceParameters}
          updateSourceParameters={room.updateSourceParameters}
          onMediaChanged={room.onMediaChanged}
        />
      </div>

      {primary ? <VideoSurface stream={primary} /> : <p>{room.readiness.reason}</p>}

      <button disabled={!room.ready} onClick={room.controls.toggleMic}>
        {room.micOn ? 'Mute' : 'Unmute'}
      </button>
      <button disabled={!room.ready} onClick={room.controls.toggleCamera}>
        {room.cameraOn ? 'Camera off' : 'Camera on'}
      </button>
      <button disabled={!room.ready} onClick={room.controls.toggleScreenShare}>
        Share screen
      </button>

      {/* Keep every prepared audio renderer mounted, even when it is hidden. */}
      <div style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}>
        <AudioGrid componentsToRender={room.audioComponents} />
      </div>
    </main>
  );
}
```

`VideoSurface` is your application component. Assign the supplied
`MediaStream` to a video element's `srcObject`, call `play()` after attachment,
and clear the element when the stream changes. Mute the video because
`AudioGrid` owns remote audio playback. See the
[complete room component](README.md#-building-your-own-ui) for a video-element
implementation, room-owned modals, and explicit leave/unmount handling.

## The parameter publication contract

Headless state is published as snapshots. A retained parameter bag can become
stale because the SDK replaces media and participant references as the room
changes.

Follow these rules:

1. Accept every `updateSourceParameters` publication.
2. Keep the `sourceParameters` seed stable across React renders.
3. Use `getCurrentParams()` when you only need to read the latest parameters.
4. Do not call `getUpdatedAllParams()` as a getter. It republishes the shared
   parameter bag and can trigger a render-feedback loop.
5. Do not deep-compare or deduplicate publications before updating your UI.

`useMediasfuHeadless()` manages the stable seed and current snapshot for the
common case.

## Render the standard UI from an existing headless engine

`ModernMediasfuGenericHead` restores the same standard component tree without
starting a second room engine. Keep one stable seed, enable external UI routing
on that engine, and pass each published snapshot to the renderer:

```tsx
import { useRef, useState } from 'react';
import {
  ModernMediasfuGeneric,
  ModernMediasfuGenericHead,
} from 'mediasfu-reactjs';

export function RoomWithStandardRenderer() {
  const seed = useRef<Record<string, unknown>>({}).current;
  const [room, setRoom] = useState<Record<string, unknown>>(seed);

  return (
    <>
      <ModernMediasfuGeneric
        returnUI={false}
        renderUIExternally
        sourceParameters={seed}
        updateSourceParameters={setRoom}
        noUIPreJoinOptions={/* your create or join result */}
      />
      <ModernMediasfuGenericHead parameters={room} />
    </>
  );
}
```

Do not mount a second `ModernMediasfuGeneric` for the visible UI. The Head
renderer calls the engine's pure `getCurrentParams()` reader and preserves the
engine-owned modal and sidebar visibility lifecycle.

When you build a completely custom interface instead, `showAlert` remains an
available callback/state contract, but `returnUI={false}` does not mount an
`AlertComponent`. Render an inline notice, toast, or your own alert component
so validation failures—such as starting breakout rooms before saving—are
visible to the user.

## Reuse SDK modals in a custom layout

Use exported components such as `ModernBackgroundModal`,
`ModernRecordingModal`, and `ModernMediaSettingsModal` with the current room
parameters. Your app chooses placement and styling; the room owns visibility,
permissions, processing, and recording lifecycle.

- Read the latest publication, not the initial `sourceParameters` seed.
- Open through the matching room updater and bind visibility to the matching
  room flag. Close through the same updater with `false`.
- Keep the background component mounted while the room is mounted. Hiding it
  must not discard its processing canvas or automatic restoration lifecycle.
- Do not call `getUpdatedAllParams()` from render to refresh a modal.
- In headless mode, supply your own visible surface. An unrendered SDK sidebar
  is not a destination for your controls.

See [standalone modal examples](README.md#-using-modals-standalone) for the
exact background, recording, and device-settings prop mappings. React's
`SidebarPanel` is also available as a presentation shell; its children and
navigation are supplied by your application.

## Virtual backgrounds: headless and hybrid

Choose **one processing owner** for a room:

- **Hybrid:** run the room with `returnUI={false}` and mount
  `ModernBackgroundModal` in your own layout. Hybrid here means mixing your
  interface with SDK components, not mixing Cloud and self-hosted servers.
- **Fully custom:** use `applyVirtualBackground` and `clearVirtualBackground`
  from your own controls; do not also run the background modal's pipeline.

### Hybrid: reuse the modal lifecycle

Use the [background modal example](README.md#virtual-background-modal) with the
same parameters as `ModernMediasfuGeneric`. Bind `isVisible` to
`isBackgroundModalVisible`, and `onClose` to
`updateIsBackgroundModalVisible(false)`. Do not create a competing visibility
flag or conditionally unmount the component when that flag becomes false.
The room can open it for automatic restoration as well as from a button.

With the camera initially off, the modal can acquire a temporary camera for
preview and save the choice for camera start. Saving a choice is not the same
as publishing video. Let the modal and room own preview cleanup, application,
and restoration; do not turn the camera on or close the modal on an arbitrary
timer. Keep publishing fresh parameters, including the engine's
`selfieSegmentation` value and update functions.

### Fully custom: apply to a running camera

The helper requires a live camera. Call it after the camera control has
succeeded and a fresh room snapshot reports video on. Serve background images
from your application or a CORS-enabled origin. Install the optional
`@mediapipe/selfie_segmentation` dependency when using this feature; model/WASM
assets must be reachable and permitted by your Content Security Policy. The
helper's `assetPath` option supports hosting those assets yourself.

<!-- checked-example: background-actions -->

```tsx
import { useState } from 'react';
import {
  applyBackgroundBlur, applyVirtualBackground, clearVirtualBackground, getCurrentParams,
  type HeadlessParameters,
} from 'mediasfu-reactjs';

export function BackgroundActions({ parameters, imageUrl }: {
  parameters: HeadlessParameters; imageUrl: string;
}) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const apply = async (remove: boolean) => {
    if (busy) return;
    const live = getCurrentParams({ parameters });
    if (!remove && !live.videoAlreadyOn) {
      setNotice('Turn your camera on before applying a background.');
      return;
    }
    setBusy(true);
    setNotice('Updating your background…');
    try {
      const result = remove
        ? await clearVirtualBackground({ parameters: live })
        : await applyVirtualBackground({ parameters: live, image: imageUrl, publish: true });
      setNotice(result.ok ? 'Background updated.' : result.error);
    } finally { setBusy(false); }
  };
  return <section>
    <button disabled={busy} onClick={() => apply(false)}>Apply background</button>
    <button disabled={busy} onClick={() => apply(true)}>Use camera without background</button>
    <p role="status">{notice}</p>
  </section>;
}
```

For person-aware blur, use the same lifecycle without supplying an image:

```ts
await applyBackgroundBlur({ parameters: live, blurPixels: 16, publish: true });
```

`blurPixels` defaults to `16`. Image replacement and blur are mutually
exclusive within one background pipeline, so switching effects replaces the
existing processed track instead of stacking processors.

`publish: true` replaces an existing video producer's track. `publish: false`
is a local processing/preview operation, not evidence that remote users see
the result. The helper does not acquire a camera or create a room for you.
Serialize background actions; clear the helper-owned pipeline before switching
cameras, stopping the camera, or leaving, then reapply after a new camera is
ready if your product keeps the selection. Keep one helper pipeline per tab.
The modal path manages its own restoration; do not use the headless clear
helper to tear down a modal-owned pipeline.

### Make local and remote views agree

Read `room.localVideo` from `useMediasfuHeadless()`, or call
`getLocalVideoStream({ parameters: latestParameters })`. When `keepBackground`
is true and `virtualStream` contains a live enabled video track, that is the
self-view; otherwise the resolver uses the camera stream. Do not always render
`localStreamVideo` first, select an arbitrary canvas stream, or feed the
processed output back into segmentation.

The SDK composites each frame by drawing the segmentation mask, retaining the
camera image with `source-in`, and painting the background behind it with
`destination-over`. Reversing those layers can show only the background.
Reuse the helper or modal instead of duplicating this pipeline. A sample feed
without a recognizable person does not establish person-segmentation quality.

Accept every parameter publication and wire `onMediaChanged` to
`room.onMediaChanged`. Reattach a replaced stream to the video element, keep
the self-view muted, and check both the self-view and a second participant's
received video. Confirm camera-off, camera restart, background removal, and
leave as well as the initial Apply action.

## Breakout rooms in a custom classroom

Breakout membership and media visibility belong to the room engine and server.
Drawing only the cards for a group is not a room transition. Use
[Interactive Classroom](https://github.com/MediaSFU/mediasfu-interactive-classroom)
for the complete teacher/learner flow.

### Hybrid: preserve Save, Start, and visible feedback

`ModernBreakoutRoomsModal` owns a local plan. **Save** validates that plan and
sets `canStartBreakout`; **Start** submits it, or updates running groups.
Save again after changing assignments. Do not label a saved plan as active
until the room confirms the start. Stop screen sharing before starting groups.

Keep the footer reachable: avoid fixed-height wrappers with `overflow: hidden`
that cut off Save/Start. Inline instructions should be visible before users
press a button. Headless mode publishes alert state but renders no built-in
alert surface; display that state as well as persistent guidance:

<!-- checked-example: breakout-panel -->

```tsx
import type { ComponentProps } from 'react';
import { ModernBreakoutRoomsModal, type HeadlessParameters } from 'mediasfu-reactjs';

type BreakoutRoom = ComponentProps<typeof ModernBreakoutRoomsModal>['parameters'];

export function BreakoutPanel({ parameters }: { parameters: HeadlessParameters }) {
  if (!parameters.getUpdatedAllParams || String(parameters.islevel) !== '2') return null;
  return <section>
    <p>Assign learners, select Save, then Start. After editing, save again.</p>
    {!parameters.canStartBreakout && <p role="status">Save your room assignments before starting.</p>}
    {parameters.alertVisible && <p role="status">{parameters.alertMessage}</p>}
    <button onClick={() => parameters.updateIsBreakoutRoomsModalVisible(true)}>
      Open breakout planner
    </button>
    <ModernBreakoutRoomsModal
      isVisible={parameters.isBreakoutRoomsModalVisible === true}
      onBreakoutRoomsClose={() => parameters.updateIsBreakoutRoomsModalVisible(false)}
      parameters={parameters as BreakoutRoom}
      renderMode="inline"
    />
  </section>;
}
```

Pass `room.parameters` (the latest publication), not `room.sourceParameters`
(the stable seed). If supplying a custom `showAlert`, preserve it in the
parameter readers the component uses too; overriding only an outer object can
lose the callback when the modal reads fresh parameters. Do not suppress SDK
validation failures or infer success from a click.

### Fully custom: submit a reviewed composition

`setBreakoutRooms` is **not a draft-save function**: it immediately sends
`startBreakout`, or `updateBreakout` when groups are already active. Own your
draft/review UI, validate current participants, reject duplicates and empty
groups, respect the room's participant limit, and submit only on explicit
confirmation. Use zero-based indices in both the outer array and `breakRoom`.

<!-- checked-example: breakout-actions -->

```ts
import {
  getCurrentParams, setBreakoutRooms, stopBreakoutRooms,
  type BreakoutParticipantRef, type HeadlessParameters,
} from 'mediasfu-reactjs';

export async function startReviewedGroups(
  parameters: HeadlessParameters, rooms: BreakoutParticipantRef[][],
) {
  const live = getCurrentParams({ parameters });
  if (String(live.islevel) !== '2') return { ok: false, error: 'Only the host can change groups.' };
  if (live.shareScreenStarted || live.shared) return { ok: false, error: 'Stop screen sharing first.' };
  const learners = new Set((live.participants || [])
    .filter(p => String(p.islevel) !== '2').map(p => p.name));
  const seen = new Set<string>();
  const limit = Number(live.itemPageLimit);
  if (!Number.isInteger(limit) || limit < 1) return { ok: false, error: 'Wait for room limits to load.' };
  if (!rooms.length || rooms.some((group, index) => !group.length || group.length > limit
    || group.some(person => {
      if (!learners.has(person.name) || seen.has(person.name) || person.breakRoom !== index) return true;
      seen.add(person.name);
      return false;
    }))) return { ok: false, error: 'Review participant assignments and group sizes.' };
  return setBreakoutRooms({ parameters: live, rooms });
}

export function endGroups(parameters: HeadlessParameters) {
  return stopBreakoutRooms({ parameters: getCurrentParams({ parameters }) });
}
```

Render the returned `error`, disable repeat submissions while pending, and use
room publications for active/ended state. To move a learner, the host updates
the full composition or calls `assignParticipantToBreakoutRoom({ parameters,
name, room })`, which submits an updated composition. Learners cannot join a
different group by selecting a local tab.

### Follow membership before selecting media

Use `Pagination` with the room's current pagination parameters when reusing
the SDK's breakout navigation. With fully custom navigation, preserve these rules:

1. A host visit follows the `updateHostBreakout` flow with `roomName`, `newRoom`,
   and `prevRoom` when leaving a breakout. `-1` represents the main room.
   Wait for the room engine's updated `hostNewRoom`; an emitted request alone
   is not confirmation of membership.
2. A learner follows server-assigned `memberRoom`, consistent with the current
   `breakoutRooms` composition. Do not follow the host's visit on every learner.
3. After membership is accepted and pagination exists, select the appropriate
   page through `generatePageContent({ page, breakRoom, inBreakRoom, parameters })`.
   A breakout page is `mainRoomsLength + roomIndex`; the main-room page is `0`.
   This uses the normal SDK display/pause/resume path, not direct consumer
   manipulation or broad forced resumes.
4. A page may be selected before its consumer arrives. On the corresponding
   media update, re-run that page selection only if a target-page video consumer
   is still paused. Serialize transitions; do not repeatedly switch a settled
   page. Use one pagination owner, not custom paging alongside returned SDK UI.
5. Attach eligible remote tracks even when `track.muted` is temporarily true.
   Keep remote audio renderers mounted and let room playback rules select what
   is audible. Do not stop or resume all consumers to make one tile visible.

Test a learner with a peer in the same group, a host visit to each group,
late-arriving consumers, reassignment, and return to the main room. Never use
one host screenshot as proof that every learner can receive their group's media.

## Render media predictably

Use one deterministic priority for the main stage:

1. active screen share;
2. selected or first remote camera;
3. local camera;
4. an explicit camera-off or waiting state.

The headless helpers merge current and recently retained remote streams,
remove the local self marker, and deduplicate producer IDs. This prevents a
participant from disappearing during a layout transition.

Mirror only a normal local front-facing camera. Do not mirror remote video or
screen share. Use `object-fit: contain` for screen content and `cover` for a
camera card unless your product requires another crop.

### Attach remote tracks before relying on `muted`

A newly consumed remote track can report `muted: true` until its first frame is
decoded. That first frame may not arrive until the track is attached to a video
element. Do not block attachment based on `track.muted`, or the UI can wait
forever. The local `enabled` flag can still be used to represent an intentionally
disabled track.

### Mount all remote audio

The visible video grid is not the complete audio participant list. Always mount
every component in `room.audioComponents`, including components for
participants who are off-screen. The container may be visually hidden, but the
audio renderers must remain mounted for reliable playout.

## Controls and production

`room.controls` provides user-triggered microphone, camera, screen-share, chat,
device-selection, and leave actions. Media permission prompts should always
follow a clear user action.

```tsx
<button onClick={() => room.controls.selectMic(microphoneId)}>Use microphone</button>
<button onClick={() => room.controls.selectCamera(cameraId)}>Use camera</button>
<button onClick={() => room.controls.sendChat('Hello')}>Send</button>
```

For canvas, media-element, display, or processed-track publication, use
`room.produce`:

```tsx
await room.produce.canvas(canvasElement, 15);
await room.produce.element(videoElement);
await room.produce.display(true); // call from a user gesture
await room.produce.replaceTrack(processedTrack);
await room.produce.stop('video');
```

If a virtual background is active, the local-video helper resolves the
processed stream rather than showing an unpublished raw camera preview.

## Host leave and end behavior

Existing behavior is preserved: `room.controls.leave()` ends the room when the
host exits. A host who should disconnect without ending the room can pass
`false` for `endRoomOnHostExit`:

```ts
await room.controls.leave(false, false);
//                          ban   endRoomOnHostExit
```

Present **Leave room** and **End for everyone** as separate host choices so the
consequence is clear. Participants use the normal leave action.

## Moderation and session features

Use the capability flags exposed by `room.moderation.permissions`; do not infer
authority from a visual host badge. Co-host responsibilities can grant a subset
of moderation actions.

```ts
if (room.moderation.permissions.canControlMedia) {
  await room.moderation.muteParticipant('Paul');
}

await room.moderation.setParticipantMedia('Paul', 'all');
await room.moderation.admitWaiting(waitingId);
```

Recording, whiteboard, polls, and breakout state are exposed through
`room.session`. The helper validates recording settings before starting.

```ts
await room.session.startRecording();
await room.session.pauseRecording();
await room.session.resumeRecording();
await room.session.stopRecording();
```

## Cleanup and recovery

On leave, navigation away, or an unrecoverable error:

- call the room leave action once;
- stop app-owned tracks and media elements;
- remove socket and DOM listeners;
- clear timers, object URLs, and pending UI state;
- revoke short-lived backend authority; and
- let the backend apply its room cleanup policy.

Show a recoverable error state when room creation, joining, or media permission
fails. Never work around a proxy error by moving a reusable credential into the
browser.

## Release checklist

- Create and join through an authenticated backend proxy.
- Verify two independent users in a real room.
- Produce and consume microphone and camera media in both directions.
- Verify screen share priority and restoration after sharing stops.
- Confirm every remote participant remains audible outside the visible grid.
- Exercise device switching, reconnect behavior, leave, host leave-without-end,
  and end-for-everyone.
- Confirm room and temporary-authority cleanup.
- Scan bundles, logs, screenshots, and source maps for credentials and private
  room data.

## More resources

- [MediaSFU headless documentation](https://mediasfu.com/docs/usage/headless/)
- [Modern room Storybook preview](https://mediasfu.com/storybook/?path=/story/mediasfu-components-modern-mediasfu-generic--default)
- [MediaSFU React SDK](https://github.com/MediaSFU/MediaSFU-ReactJS)
- [SpacesTek Advanced](https://github.com/MediaSFU/SpacesTekAdvanced)
- [MediaSFU Agents](https://github.com/MediaSFU/Agents)
