import React, { act } from "react";
import { createRoot } from "react-dom/client";
import ScreenAudioPlayer from "./ScreenAudioPlayer";

const Card = (props: any) =>
  props.visible ? (
    <div data-testid="card" {...props.cardProps} data-wave={String(props.showWaveform)}>
      {props.name}
    </div>
  ) : null;

describe("ScreenAudioPlayer", () => {
  beforeAll(() => {
    Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: () => Promise.resolve() });
  });

  it("shows a screen-audio card while sound plays and mutes it for this listener on click", async () => {
    jest.useFakeTimers();
    let level = 0.4;
    const consumer = {
      rtpReceiver: {
        getStats: () => Promise.resolve(new Map([["a", { type: "inbound-rtp", kind: "audio", audioLevel: level }]]) as any),
      },
    };
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => {
      root.render(
        <ScreenAudioPlayer stream={{} as MediaStream} remoteProducerId="sa-1" consumer={consumer} ownerName="Alice" MiniAudioComponent={Card} />
      );
    });
    expect(host.querySelector('[data-testid="card"]')).toBeNull();
    const audio = host.querySelector('audio[data-screen-audio="true"]') as HTMLAudioElement;
    expect(audio).not.toBeNull();

    await act(async () => { jest.advanceTimersByTime(1000); await Promise.resolve(); });
    const card = host.querySelector('[data-testid="card"]') as HTMLElement;
    expect(card.textContent).toBe("Alice · Screen audio");
    expect(card.getAttribute("data-wave")).toBe("true");

    await act(async () => { card.click(); });
    expect(audio.muted).toBe(true);
    expect(host.querySelector('[data-testid="card"]')!.textContent).toBe("Alice · Screen audio (muted)");

    level = 0;
    await act(async () => { jest.advanceTimersByTime(1000); await Promise.resolve(); });
    // still shown while muted, so the listener can unmute
    expect(host.querySelector('[data-testid="card"]')).not.toBeNull();
    await act(async () => { (host.querySelector('[data-testid="card"]') as HTMLElement).click(); });
    expect(audio.muted).toBe(false);
    expect(host.querySelector('[data-testid="card"]')).toBeNull();

    await act(async () => root.unmount());
    host.remove();
    jest.useRealTimers();
  });
});
