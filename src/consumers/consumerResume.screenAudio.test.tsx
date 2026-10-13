import { consumerResume } from "./consumerResume";
import ScreenAudioPlayer from "../methods/utils/ScreenAudioPlayer/ScreenAudioPlayer";
import { forgetScreenAudioProducer, markScreenAudioProducer } from "./screenAudio";

class FakeMediaStream {
  tracks: unknown[];
  constructor(tracks: unknown[] = []) {
    this.tracks = tracks;
  }
}

const buildParameters = (participants: any[]) => {
  const state: any = {
    nStream: null,
    allAudioStreams: [],
    allVideoStreams: [],
    streamNames: [],
    audStreamNames: [],
    updateMainWindow: false,
    shared: false,
    shareScreenStarted: true,
    screenId: "screen-video-1",
    participants,
    eventType: "conference",
    meetingDisplayType: "video",
    mainScreenFilled: false,
    first_round: false,
    lock_screen: false,
    oldAllStreams: [],
    adminVidID: "",
    mainHeightWidth: 0,
    member: "bob",
    audioOnlyStreams: [],
    gotAllVids: false,
    defer_receive: false,
    firstAll: false,
    remoteScreenStream: [],
    hostLabel: "alice",
    whiteboardStarted: false,
    whiteboardEnded: false,
  };
  const updates = [
    "UpdateMainWindow", "AllAudioStreams", "AllVideoStreams", "StreamNames", "AudStreamNames", "NStream",
    "MainHeightWidth", "Lock_screen", "FirstAll", "RemoteScreenStream", "OldAllStreams", "AudioOnlyStreams",
    "ShareScreenStarted", "GotAllVids", "ScreenId", "Defer_receive",
  ];
  for (const name of updates) {
    const key = name.charAt(0).toLowerCase() + name.slice(1);
    state[`update${name}`] = jest.fn((value: unknown) => {
      state[key] = value;
    });
  }
  state.reorderStreams = jest.fn();
  state.prepopulateUserMedia = jest.fn();
  state.getUpdatedAllParams = () => state;
  return state;
};

describe("consumerResume with screen audio", () => {
  const OriginalMediaStream = (global as any).MediaStream;
  beforeAll(() => {
    (global as any).MediaStream = FakeMediaStream;
  });
  afterAll(() => {
    (global as any).MediaStream = OriginalMediaStream;
  });

  const alice = { name: "alice", islevel: "2", audioID: "mic-a", videoID: "", ScreenID: "screen-video-1", ScreenOn: true };

  it("plays screen audio through a hidden player without speaker or name state", async () => {
    const parameters = buildParameters([{ ...alice, ScreenAudioID: "screen-audio-1" }]);
    await consumerResume({
      track: { kind: "audio" } as any,
      remoteProducerId: "screen-audio-1",
      params: { id: "c1", producerId: "screen-audio-1", kind: "audio", rtpParameters: {} } as any,
      parameters,
      nsock: {} as any,
      consumer: { appData: {} } as any,
      kind: "audio",
    } as any);

    expect(parameters.audioOnlyStreams).toHaveLength(1);
    expect(parameters.audioOnlyStreams[0].type).toBe(ScreenAudioPlayer);
    expect(String(parameters.audioOnlyStreams[0].key)).toBe("screen-audio-1");
    expect(parameters.allAudioStreams.map((item: any) => item.producerId)).toEqual(["screen-audio-1"]);
    expect(parameters.audStreamNames).toEqual([]);
    expect(parameters.prepopulateUserMedia).not.toHaveBeenCalled();
    expect(parameters.reorderStreams).not.toHaveBeenCalled();
  });

  it("recognises screen audio from the server tag before the roster has ScreenAudioID", async () => {
    markScreenAudioProducer("screen-audio-2", "screen-audio");
    const parameters = buildParameters([alice]);
    await consumerResume({
      track: { kind: "audio" } as any,
      remoteProducerId: "screen-audio-2",
      params: { id: "c2", producerId: "screen-audio-2", kind: "audio", rtpParameters: {} } as any,
      parameters,
      nsock: {} as any,
      consumer: { appData: {} } as any,
      kind: "audio",
    } as any);
    forgetScreenAudioProducer("screen-audio-2");

    expect(parameters.audioOnlyStreams[0].type).toBe(ScreenAudioPlayer);
    expect(parameters.prepopulateUserMedia).not.toHaveBeenCalled();
  });
});
