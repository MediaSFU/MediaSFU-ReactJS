# Changelog

## 4.3.5 — 2026-09-21

- Added person-aware background blur to the classic and modern background modals.
- Added `applyBackgroundBlur` for fully custom/headless interfaces. Blur uses the existing virtual-background stream, producer replacement, restoration, and cleanup lifecycle.
- Fixed consume-socket lifecycle cleanup across modern and legacy rooms: failed joins are disposed, dead endpoint entries no longer block reconnects, and handshake failures cannot leave auto-reconnecting orphan sockets.

## 4.3.4 — 2026-09-16

- **Recording settings in light mode.** The Standard and Advanced recording panels now follow the room theme. In light mode their labels and selected values were previously close to invisible.
- **Live recording indicator.** In the control bar, the recording indicator now responds only to its Pause/Resume and Stop buttons. Tapping elsewhere on the indicator no longer opens recording settings during a recording.
- **Easier recording controls.** Pause/Resume and Stop have larger touch targets and accessible labels.
- **Recording layout from the start.** The room layout is reported to the recording service as soon as a recording starts, instead of waiting for the next participant or screen change.
