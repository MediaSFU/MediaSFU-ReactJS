import { EventEmitter } from "events";
import {
  SCREEN_AUDIO_MEDIA_TAG,
  buildDisplayMediaOptions,
  forgetScreenAudioProducer,
  isScreenAudioProducer,
  markScreenAudioProducer,
  recallScreenAudioProducer,
  setScreenAudioVolume,
  shouldShareScreenAudio,
} from "./screenAudio";
import {
  connectSendTransportScreenAudio,
  disconnectSendTransportScreenAudio,
} from "./connectSendTransportScreenAudio";
import { startShareScreen } from "./startShareScreen";
import { canCaptureDisplayAudio } from "./screenAudio";
import { promptScreenAudioChoice } from "../components/miscComponents/ScreenAudioPrompt";
import { act } from "react";
import { toggleScreenAudio } from "./connectSendTransportScreenAudio";

const fakeProducer = (id: string | undefined) => {
  const observer = new EventEmitter();
  const producer: any = {
    id,
    closed: false,
    paused: false,
    observer,
    close: jest.fn(() => {
      producer.closed = true;
      observer.emit("close");
    }),
    pause: jest.fn(() => {
      producer.paused = true;
      observer.emit("pause");
    }),
    resume: jest.fn(() => {
      producer.paused = false;
      observer.emit("resume");
    }),
  };
  return producer;
};

const fakeTrack = () => {
  const listeners: Record<string, () => void> = {};
  return {
    kind: "audio",
    readyState: "live",
    addEventListener: jest.fn((event: string, handler: () => void) => {
      listeners[event] = handler;
    }),
    end: () => listeners.ended?.(),
  };
};

const screenStream = (track: any) => ({ getAudioTracks: () => (track ? [track] : []) }) as unknown as MediaStream;

const makeParameters = (overrides: Record<string, any> = {}) => {
  const params: any = {
    socket: { emit: jest.fn() },
    producerTransport: { closed: false, produce: jest.fn() },
    screenProducer: fakeProducer("screen-video-1"),
    supportsScreenAudio: true,
    screenAudioEnabled: true,
    screenAudioProducer: null,
    updateScreenAudioProducer: jest.fn((producer) => {
      params.screenAudioProducer = producer;
    }),
    ...overrides,
  };
  params.getUpdatedAllParams = () => params;
  return params;
};

describe("screen audio identification", () => {
  it("recognises a producer by server tag, consumer appData or the sharer's ScreenAudioID", () => {
    expect(isScreenAudioProducer({ producerId: "p1" })).toBe(false);
    markScreenAudioProducer("p1", "audio");
    expect(isScreenAudioProducer({ producerId: "p1" })).toBe(false);
    markScreenAudioProducer("p1", SCREEN_AUDIO_MEDIA_TAG);
    expect(isScreenAudioProducer({ producerId: "p1" })).toBe(true);
    forgetScreenAudioProducer("p1");
    expect(isScreenAudioProducer({ producerId: "p1" })).toBe(false);

    expect(isScreenAudioProducer({ producerId: "p2", appData: { mediaTag: "screen-audio" } })).toBe(true);
    const participants: any[] = [
      { name: "alice", audioID: "mic-a", videoID: "", ScreenAudioID: "p3" },
      { name: "bob", audioID: "mic-b", videoID: "" },
    ];
    expect(isScreenAudioProducer({ producerId: "p3", participants })).toBe(true);
    expect(isScreenAudioProducer({ producerId: "mic-a", participants })).toBe(false);
  });
});

describe("screen audio capture options", () => {
  it("asks for audio only when the server supports it and the app allows it", () => {
    expect(shouldShareScreenAudio({ supportsScreenAudio: true })).toBe(true);
    expect(shouldShareScreenAudio({ supportsScreenAudio: true, screenAudioEnabled: false })).toBe(false);
    expect(shouldShareScreenAudio({ supportsScreenAudio: false })).toBe(false);
    expect(shouldShareScreenAudio({})).toBe(false);
  });

  it("requests unprocessed audio and keeps local playback for the sharer", () => {
    const withAudio: any = buildDisplayMediaOptions({ targetWidth: 1280, targetHeight: 720, withAudio: true });
    expect(withAudio.audio).toEqual({ echoCancellation: false, noiseSuppression: false, autoGainControl: false });
    expect(withAudio.systemAudio).toBe("include");
    expect(withAudio.suppressLocalAudioPlayback).toBe(false);
    const videoOnly: any = buildDisplayMediaOptions({ targetWidth: 1280, targetHeight: 720, withAudio: false });
    expect(videoOnly).toEqual({ video: { width: 1280, height: 720, frameRate: 30 }, audio: false });
  });

  it("startShareScreen keeps the video-only request on servers or browsers without screen audio", async () => {
    const getDisplayMedia = jest.fn().mockResolvedValue({});
    const parameters: any = {
      shared: false,
      onWeb: true,
      mediaDevices: { getDisplayMedia },
      updateShared: jest.fn(),
      streamSuccessScreen: jest.fn().mockResolvedValue(undefined),
      screenAudioPrompt: jest.fn().mockResolvedValue("audio"),
    };
    await startShareScreen({ parameters });
    expect(getDisplayMedia.mock.calls[0][0].audio).toBe(false);
    // jsdom is not a Chromium desktop browser: no display audio, no question.
    await startShareScreen({ parameters: { ...parameters, supportsScreenAudio: true } });
    expect(getDisplayMedia.mock.calls[1][0].audio).toBe(false);
    expect(parameters.screenAudioPrompt).not.toHaveBeenCalled();
  });

  it("asks before sharing and follows the answer", async () => {
    const base = () => {
      const getDisplayMedia = jest.fn().mockResolvedValue({});
      return {
        getDisplayMedia,
        parameters: {
          shared: false,
          onWeb: true,
          mediaDevices: { getDisplayMedia },
          updateShared: jest.fn(),
          streamSuccessScreen: jest.fn().mockResolvedValue(undefined),
          supportsScreenAudio: true,
          displayAudioCapable: true,
        } as any,
      };
    };
    const withAudio = base();
    withAudio.parameters.screenAudioPrompt = jest.fn().mockResolvedValue("audio");
    await startShareScreen({ parameters: withAudio.parameters });
    expect(withAudio.parameters.screenAudioPrompt).toHaveBeenCalledTimes(1);
    expect(withAudio.getDisplayMedia.mock.calls[0][0].audio).toEqual(expect.objectContaining({ echoCancellation: false }));

    const screenOnly = base();
    screenOnly.parameters.screenAudioPrompt = jest.fn().mockResolvedValue("video");
    await startShareScreen({ parameters: screenOnly.parameters });
    expect(screenOnly.getDisplayMedia.mock.calls[0][0].audio).toBe(false);

    const cancelled = base();
    cancelled.parameters.screenAudioPrompt = jest.fn().mockResolvedValue(null);
    await startShareScreen({ parameters: cancelled.parameters });
    expect(cancelled.getDisplayMedia).not.toHaveBeenCalled();
    expect(cancelled.parameters.updateShared).toHaveBeenCalledWith(false);

    const always = base();
    always.parameters.screenAudioMode = "always";
    always.parameters.screenAudioPrompt = jest.fn();
    await startShareScreen({ parameters: always.parameters });
    expect(always.parameters.screenAudioPrompt).not.toHaveBeenCalled();
    expect(always.getDisplayMedia.mock.calls[0][0].audio).not.toBe(false);

    const never = base();
    never.parameters.screenAudioMode = "never";
    never.parameters.screenAudioPrompt = jest.fn();
    await startShareScreen({ parameters: never.parameters });
    expect(never.parameters.screenAudioPrompt).not.toHaveBeenCalled();
    expect(never.getDisplayMedia.mock.calls[0][0].audio).toBe(false);
  });

  it("detects browsers that can capture display audio", () => {
    const chrome = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
    const edge = chrome + " Edg/141.0.0.0";
    const firefox = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0";
    const safari = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15";
    const android = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36";
    expect(canCaptureDisplayAudio({ userAgent: chrome })).toBe(true);
    expect(canCaptureDisplayAudio({ userAgent: edge })).toBe(true);
    expect(canCaptureDisplayAudio({ userAgent: firefox })).toBe(false);
    expect(canCaptureDisplayAudio({ userAgent: safari })).toBe(false);
    expect(canCaptureDisplayAudio({ userAgent: android })).toBe(false);
    expect(canCaptureDisplayAudio({ userAgent: "x", userAgentData: { brands: [{ brand: "Chromium" }] } } as any)).toBe(true);
  });

  it("the default prompt resolves with the button the user clicks", async () => {
    const pending = promptScreenAudioChoice({ isDarkMode: true });
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
    const choice = (name: string) =>
      document.querySelector(`[data-screen-audio-prompt="true"] [data-choice="${name}"]`) as HTMLButtonElement;
    expect(choice("audio").textContent).toContain("Screen + audio");
    expect(choice("video").textContent).toContain("Screen only");
    expect(choice("cancel").textContent).toBe("Cancel");
    expect((document.activeElement as HTMLElement)?.dataset.choice).toBe("audio");
    await act(async () => { choice("audio").click(); });
    await expect(pending).resolves.toBe("audio");
    await act(async () => { await new Promise((r) => setTimeout(r, 5)); });
    expect(document.querySelector('[data-screen-audio-prompt="true"]')).toBeNull();
  });

  it("the default prompt's close button cancels the share", async () => {
    const pending = promptScreenAudioChoice({ isDarkMode: false });
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
    const close = document.querySelector('[data-screen-audio-prompt="true"] [data-close="true"]') as HTMLButtonElement;
    expect(close.getAttribute("aria-label")).toBe("Cancel");
    await act(async () => { close.click(); });
    await expect(pending).resolves.toBeNull();
    await act(async () => { await new Promise((r) => setTimeout(r, 5)); });
  });
});

describe("connectSendTransportScreenAudio", () => {
  it("publishes the stream's audio as a screen-audio producer with music-grade Opus", async () => {
    const track = fakeTrack();
    const producer = fakeProducer("sa-1");
    const parameters = makeParameters();
    parameters.producerTransport.produce.mockResolvedValue(producer);

    const result = await connectSendTransportScreenAudio({ stream: screenStream(track), parameters });

    expect(result).toBe(producer);
    const options = parameters.producerTransport.produce.mock.calls[0][0];
    expect(options.track).toBe(track);
    expect(options.appData).toEqual({ mediaTag: "screen-audio" });
    expect(options.stopTracks).toBe(false);
    expect(options.codecOptions).toEqual(
      expect.objectContaining({ opusStereo: true, opusDtx: false, opusMaxAverageBitrate: 128000 })
    );
    expect(parameters.updateScreenAudioProducer).toHaveBeenCalledWith(producer);
    expect(recallScreenAudioProducer(parameters.socket)).toBe(producer);
  });

  it("does nothing without audio, without server support or when turned off", async () => {
    for (const overrides of [{ supportsScreenAudio: false }, { screenAudioEnabled: false }, {}]) {
      const parameters = makeParameters(overrides);
      const stream = screenStream(Object.keys(overrides).length ? fakeTrack() : null);
      expect(await connectSendTransportScreenAudio({ stream, parameters })).toBeNull();
      expect(parameters.producerTransport.produce).not.toHaveBeenCalled();
    }
  });

  it("drops a producer the server rejected and retries once", async () => {
    const rejected = fakeProducer(undefined);
    const accepted = fakeProducer("sa-2");
    const parameters = makeParameters();
    parameters.producerTransport.produce.mockResolvedValueOnce(rejected).mockResolvedValueOnce(accepted);

    const result = await connectSendTransportScreenAudio({
      stream: screenStream(fakeTrack()),
      parameters,
      retryDelayMs: 1,
    });

    expect(rejected.close).toHaveBeenCalled();
    expect(result).toBe(accepted);
  });

  it("pauses, resumes and closes with the screen producer", async () => {
    const producer = fakeProducer("sa-3");
    const parameters = makeParameters();
    parameters.producerTransport.produce.mockResolvedValue(producer);
    await connectSendTransportScreenAudio({ stream: screenStream(fakeTrack()), parameters });

    parameters.screenProducer.pause();
    expect(producer.pause).toHaveBeenCalled();
    parameters.screenProducer.resume();
    expect(producer.resume).toHaveBeenCalled();
    parameters.screenProducer.close();
    await Promise.resolve();
    expect(producer.close).toHaveBeenCalled();
    expect(parameters.screenAudioProducer).toBeNull();
    // The whole screen share stopping is reported by closeScreenProducer, not by screen audio.
    expect(parameters.socket.emit).not.toHaveBeenCalledWith("closeScreenAudioProducer");
  });

  it("closes alone and tells the server when only its track ends", async () => {
    const track = fakeTrack();
    const producer = fakeProducer("sa-4");
    const parameters = makeParameters();
    parameters.producerTransport.produce.mockResolvedValue(producer);
    await connectSendTransportScreenAudio({ stream: screenStream(track), parameters });

    track.end();
    await Promise.resolve();

    expect(producer.close).toHaveBeenCalled();
    expect(parameters.screenProducer.closed).toBe(false);
    expect(parameters.socket.emit).toHaveBeenCalledWith("closeScreenAudioProducer");
  });

  it("the sharer can mute and unmute screen audio without stopping the share", async () => {
    const producer = fakeProducer("sa-5");
    const parameters = makeParameters();
    parameters.producerTransport.produce.mockResolvedValue(producer);
    await connectSendTransportScreenAudio({ stream: screenStream(fakeTrack()), parameters });
    expect(toggleScreenAudio({ parameters })).toBe(true);
    expect(producer.pause).toHaveBeenCalled();
    expect(toggleScreenAudio({ parameters })).toBe(false);
    expect(toggleScreenAudio({ parameters, paused: true })).toBe(true);
    expect(parameters.screenProducer.paused).toBe(false);
    expect(toggleScreenAudio({ parameters: makeParameters({ socket: { emit: jest.fn() } }) })).toBeNull();
  });

  it("disconnect is safe when no screen audio exists", async () => {
    const parameters = makeParameters();
    await expect(disconnectSendTransportScreenAudio({ parameters, notifyServer: true })).resolves.toBeUndefined();
    expect(parameters.socket.emit).not.toHaveBeenCalled();
  });
});

describe("setScreenAudioVolume", () => {
  it("sets the volume of screen-audio players only, clamped to 0..1", () => {
    const screen = document.createElement("audio");
    screen.setAttribute("data-screen-audio", "true");
    const voice = document.createElement("audio");
    document.body.append(screen, voice);
    setScreenAudioVolume(0.25);
    expect(screen.volume).toBe(0.25);
    expect(voice.volume).toBe(1);
    setScreenAudioVolume(4);
    expect(screen.volume).toBe(1);
    screen.remove();
    voice.remove();
  });
});
