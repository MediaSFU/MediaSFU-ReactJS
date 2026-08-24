# Build a custom React video experience with MediaSFU headless mode

Use MediaSFU headless mode when your application should own the room layout,
controls, navigation, and visual identity while the SDK manages signaling,
WebRTC media, participants, moderation, and room lifecycle.

This guide covers `mediasfu-reactjs`. For a maintained prebuilt interface,
start with `ModernMediasfuGeneric`. For a custom interface, mount the same room
engine with `returnUI={false}` and read its state through
`useMediasfuHeadless()`.

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

```tsx
import {
  AudioGrid,
  ModernMediasfuGeneric,
  PreJoinPage,
  useMediasfuHeadless,
} from 'mediasfu-reactjs';

export function Call() {
  const room = useMediasfuHeadless();
  const primary =
    room.screenShare.stream ?? room.remoteVideos[0]?.stream ?? room.localVideo;

  return (
    <main>
      <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
        <ModernMediasfuGeneric
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
and clear the element when the stream changes.

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
