# Changelog

## 4.4.2 — 2026-10-13

- Fix screen sharing with React 19 when the default screen-audio choice dialog opens. Both ESM and CommonJS builds now use the application's `react-dom/client` renderer instead of bundling a React 18 compatibility wrapper.

## 4.4.1 — 2026-10-10

- **Rejoin after a reload, one connection per participant.** The SDK remembers the room credential for a room and name and proves it when registering again. When another tab or device takes over, a dialog says "You joined from another tab or device." and offers **Use this one**; the SDK never rejoins on its own. New exports: `sessionReplaced`, `wasSessionReplaced`, `rememberRejoinCredential`, `readRejoinCredential`, `forgetRejoinCredential`. Needs media servers with participant-rejoin support; older servers behave as before.
- **One send transport per connection.** Concurrent callers reuse the transport being created, and simultaneous produces of the same kind share one producer. Fixes devices that sent silence after a quick rejoin or device switch.
- **No reconnect loop after a permanent refusal.** A media server refusing a reconnect for good (credentials replaced, room ended, no meeting minutes) closes the socket instead of retrying indefinitely.

## 4.4.0 — 2026-10-09

- **Screen-share audio.** Sharing a tab or screen in a Chromium desktop browser now offers **Screen + audio** or **Screen only**. The audio is published as its own track, pauses and stops with the share, and never marks the sharer as speaking. Listeners hear it with a "*name* · Screen audio" card they can mute for themselves. Configure with `updateScreenAudioMode` (`ask`, `always`, `never`) and `updateScreenAudioEnabled`; new exports include `ScreenAudioPrompt`, `ScreenAudioPlayer`, `connectSendTransportScreenAudio`, `toggleScreenAudio` and `setScreenAudioVolume`. Media servers without screen-audio support keep video-only sharing.
- **Consumer backup preference.** When a busy consuming node has a connected backup, new streams are taken from the backup when it announces them within 1.5 seconds; otherwise from the busy node as before.
- **Clear connection errors.** Join pages explain why a room could not be joined (credentials refused, no meeting minutes, offline, server unreachable) instead of a generic message. `connectSocket` rejects with `MediaSocketConnectError` (`phase`, `elapsedMs`, `online`, `reason`, `stage`, `retryable`), and `describeMediaSocketError` returns a user-facing sentence. A refused credential is not retried in a loop, and network failures no longer count toward the join attempt limit.
- **No more silent microphones from a send-transport race.** When the microphone and camera start together (or a toggle overlaps a rejoin), only one send transport is created per connection; later requests wait for it and send their media on it. Previously the second request replaced the first on the media server and that participant's audio could be lost. Two produces of the same kind at the same moment now share one producer.
- **Rejoin after a reload, one connection per participant.** A reload or a second tab rejoins as the same participant: the SDK remembers the room credential for this tab and proves it when registering again, and reuses it if the server still refuses the name. When another tab or device takes over, this one shows "You joined from another tab or device." with **Use this one** instead of a generic disconnect, and never rejoins on its own. Apps can show their own UI by cancelling the `mediasfu:session-replaced` window event. New exports: `sessionReplaced`, `wasSessionReplaced`, `rememberRejoinCredential`, `readRejoinCredential`, `forgetRejoinCredential`. Needs media servers with participant-rejoin support; older servers behave as before.
- **A refused reconnect is final.** When a media server refuses a reconnect for good (the room ended, the credentials were replaced, no meeting minutes), the SDK closes that socket instead of letting Socket.IO retry it for as long as the page stays open. Temporary refusals still retry.

## 4.3.8 — 2026-09-30

- Disable camera simulcast automatically for chat and capacity-two rooms, with an explicit `simulcastOff` opt-out for larger rooms and an optional `roomCapacity` hint.
- Preserve full-resolution encoder limits in single-encoding mode and restore the original preset for later room updates.
- Remove the recording-only 20% camera bitrate and initial-bitrate uplift; screen-sharing and audio presets are unchanged.


## 4.3.7 — 2026-09-23

- Keep virtual-background processing active in background tabs at a 200 ms scheduling interval (up to 5 frames per second, subject to browser throttling and processing time).

## 4.3.5 — 2026-09-21

- Added person-aware background blur to the classic and modern background modals.
- Added `applyBackgroundBlur` for fully custom/headless interfaces. Blur uses the existing virtual-background stream, producer replacement, restoration, and cleanup lifecycle.
- Fixed consume-socket lifecycle cleanup across modern and legacy rooms: failed joins are disposed, dead endpoint entries no longer block reconnects, and handshake failures cannot leave auto-reconnecting orphan sockets.

## 4.3.4 — 2026-09-16

- **Recording settings in light mode.** The Standard and Advanced recording panels now follow the room theme. In light mode their labels and selected values were previously close to invisible.
- **Live recording indicator.** In the control bar, the recording indicator now responds only to its Pause/Resume and Stop buttons. Tapping elsewhere on the indicator no longer opens recording settings during a recording.
- **Easier recording controls.** Pause/Resume and Stop have larger touch targets and accessible labels.
- **Recording layout from the start.** The room layout is reported to the recording service as soon as a recording starts, instead of waiting for the next participant or screen change.
