import React, { useEffect, useRef, useState } from "react";
import MiniAudio, { MiniAudioOptions } from "../../../components/displayComponents/MiniAudio";

export interface ScreenAudioPlayerOptions {
  /** Stream holding the screen-share audio track. */
  stream: MediaStream | null;
  /** Producer id of the screen-share audio (used to remove the player when the share stops). */
  remoteProducerId: string;
  /** The consumer, used for its audio level (the card shows while sound plays, like other audio cards). */
  consumer?: { rtpReceiver?: { getStats: () => Promise<RTCStatsReport> } } | null;
  /** Name of the participant sharing the screen. */
  ownerName?: string;
  /** Listening volume, 0..1 (default 1). */
  volume?: number;
  /** Card component (default MiniAudio, or the app's miniAudioComponent). */
  MiniAudioComponent?: React.ComponentType<MiniAudioOptions>;
  /** Extra props for the card. */
  miniAudioProps?: Partial<MiniAudioOptions>;
  /** Hide the card entirely (audio still plays). */
  hideCard?: boolean;
}

export type ScreenAudioPlayerType = (options: ScreenAudioPlayerOptions) => React.JSX.Element;

const LEVEL_THRESHOLD = 0.01;

/**
 * Plays audio shared with a screen share. While it plays, it shows an audio card ("<name> · Screen audio") with a
 * waveform, like other audio-only sources; it never marks the sharer as speaking. Clicking the card mutes or unmutes it
 * for this listener. `audio[data-screen-audio="true"]` (or `setScreenAudioVolume`) sets the listening volume.
 *
 * @example
 * ```tsx
 * <ScreenAudioPlayer stream={stream} remoteProducerId={producerId} consumer={consumer} ownerName="Alice" />
 * ```
 */
const ScreenAudioPlayer: React.FC<ScreenAudioPlayerOptions> = ({
  stream,
  remoteProducerId,
  consumer,
  ownerName,
  volume = 1,
  MiniAudioComponent,
  miniAudioProps,
  hideCard = false,
}) => {
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(false);

  // Browsers reject play() before the first user gesture; retry on the next gesture, as MiniAudioPlayer does.
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio || !stream) return;
    audio.srcObject = stream;

    const removeUnlockListeners = () => {
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
      document.removeEventListener("touchend", unlock, true);
    };
    const unlock = () => {
      void audio.play().then(removeUnlockListeners).catch(() => {});
    };

    void audio.play().then(removeUnlockListeners).catch(() => {
      document.addEventListener("pointerdown", unlock, true);
      document.addEventListener("keydown", unlock, true);
      document.addEventListener("touchend", unlock, true);
    });

    return removeUnlockListeners;
  }, [stream]);

  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = Math.min(1, Math.max(0, volume));
    }
  }, [volume]);

  useEffect(() => {
    if (audioElementRef.current) audioElementRef.current.muted = muted;
  }, [muted]);

  // Audio level from the receiver's stats; never fed to the speaking or audio-decibel logic.
  useEffect(() => {
    const receiver = consumer?.rtpReceiver;
    if (!stream || !receiver) return;
    const id = setInterval(() => {
      receiver
        .getStats()
        .then((stats) => {
          let level = 0;
          stats.forEach((report: any) => {
            if (report.type === "inbound-rtp" && report.kind === "audio" && typeof report.audioLevel === "number") {
              level = report.audioLevel;
            }
          });
          setActive(level > LEVEL_THRESHOLD);
        })
        .catch(() => {});
    }, 1000);
    return () => clearInterval(id);
  }, [stream, consumer]);

  const Card = MiniAudioComponent ?? MiniAudio;
  const label = `${ownerName ? `${ownerName} · ` : ""}Screen audio${muted ? " (muted)" : ""}`;

  return (
    <div data-screen-audio-player="true" data-producer-id={remoteProducerId}>
      <audio
        autoPlay
        data-screen-audio="true"
        data-producer-id={remoteProducerId}
        ref={audioElementRef}
        style={{ display: "none" }}
      />
      {!hideCard && (
        <Card
          name={label}
          visible={active || muted}
          showWaveform={active && !muted}
          imageSource="https://mediasfu.com/images/logo192.png"
          roundedImage
          customStyle={{ backgroundColor: "gray" }}
          barColor="white"
          textColor="white"
          overlayPosition="topRight"
          {...miniAudioProps}
          cardProps={{
            role: "button",
            title: muted ? "Unmute screen audio" : "Mute screen audio",
            "aria-pressed": muted,
            onClick: () => setMuted((value) => !value),
            ...(miniAudioProps?.cardProps || {}),
          }}
        />
      )}
    </div>
  );
};

export default ScreenAudioPlayer;
