import { createSendTransport } from "./createSendTransport";
import { connectSendTransportAudio } from "./connectSendTransportAudio";
import { connectSendTransportVideo } from "./connectSendTransportVideo";

// The server keeps one producer transport per socket. Two creations in flight replace each other there and leave the
// client's uplink silent ("connect() already called"), so concurrent callers must share one transport.

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

const sendRig = () => {
  const emits: string[] = [];
  const connects: Array<[string, string | undefined, string | undefined]> = [];
  const socket = {
    id: "sock",
    emit: (event: string, _data: unknown, ack: (response: unknown) => void) => {
      emits.push(event);
      if (event === "createWebRtcTransport") setTimeout(() => ack({ params: { id: "t" + emits.length } }), 20);
    },
  };
  const device = {
    createSendTransport: (params: { id: string }) => ({ id: params.id, closed: false, on: jest.fn() }),
  };
  const params: any = {
    islevel: "1", member: "m", socket, device, transportCreated: false, producerTransport: null,
    audioProducer: null, videoProducer: null, screenProducer: null,
    updateProducerTransport: (t: any) => { params.producerTransport = t; },
    updateTransportCreated: (v: boolean) => { params.transportCreated = v; },
    connectSendTransport: async ({ option, targetOption, parameters }: any) => {
      connects.push([option, targetOption, parameters.producerTransport?.id]);
      await tick();
      if (option === "audio") params.audioProducer = { closed: false };
      if (option === "video") params.videoProducer = { closed: false };
    },
  };
  params.getUpdatedAllParams = () => params;
  return { params, emits, connects };
};

const creates = (emits: string[]) => emits.filter((event) => event === "createWebRtcTransport").length;

describe("send transport serialisation", () => {
  it("creates one transport when microphone and camera start together", async () => {
    const rig = sendRig();
    await Promise.all([
      createSendTransport({ option: "audio", parameters: rig.params }),
      createSendTransport({ option: "video", parameters: { ...rig.params } }),
    ]);
    expect(creates(rig.emits)).toBe(1);
    const id = rig.params.producerTransport.id;
    expect(rig.connects.map(([option, , t]) => `${option}@${t}`).sort()).toEqual([`audio@${id}`, `video@${id}`]);
  });

  it("reuses a live transport for a caller with a stale transportCreated snapshot", async () => {
    const rig = sendRig();
    await createSendTransport({ option: "audio", parameters: rig.params });
    await createSendTransport({ option: "video", parameters: { ...rig.params, transportCreated: false } });
    expect(creates(rig.emits)).toBe(1);
    expect(rig.connects[1]).toEqual(["video", "all", rig.params.producerTransport.id]);
  });

  it("produces the same media once when requested twice at once, and replaces a closed transport", async () => {
    const rig = sendRig();
    await Promise.all([
      createSendTransport({ option: "audio", parameters: rig.params }),
      createSendTransport({ option: "audio", parameters: rig.params }),
    ]);
    expect(creates(rig.emits)).toBe(1);
    expect(rig.connects).toHaveLength(1);

    rig.params.producerTransport.closed = true;
    rig.params.transportCreated = false;
    await createSendTransport({ option: "audio", parameters: rig.params });
    expect(creates(rig.emits)).toBe(2);
  });

  it("shares an in-flight produce of the same kind", async () => {
    let produces = 0;
    const transport: any = {
      closed: false,
      produce: async (options: any) => { produces += 1; const id = "p" + produces; await tick(); return { id, kind: options.kind, rtpSender: null }; },
    };
    const updates: string[] = [];
    const parameters: any = {
      producerTransport: transport, audioProducer: null, videoProducer: null, islevel: "1", updateMainWindow: false,
      updateAudioProducer: (p: any) => updates.push(p?.id), updateVideoProducer: (p: any) => updates.push(p?.id),
      updateProducerTransport: () => {}, updateUpdateMainWindow: () => {}, updateAudioLevel: () => {},
    };
    parameters.getUpdatedAllParams = () => parameters;
    await Promise.all([
      connectSendTransportAudio({ parameters, audioParams: { kind: "audio" } as any, targetOption: "remote" }),
      connectSendTransportAudio({ parameters, audioParams: { kind: "audio" } as any, targetOption: "remote" }),
      connectSendTransportVideo({ parameters, videoParams: { kind: "video" } as any, targetOption: "remote" }),
    ]);
    expect(produces).toBe(2);
    expect(updates.filter((id) => id === "p1")).toHaveLength(2);
  });
});
