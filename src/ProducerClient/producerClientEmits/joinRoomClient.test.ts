import { joinRoomClient } from "./joinRoomClient";

const validJoin = {
  roomName: "p12345678",
  islevel: "1",
  member: "Zenup",
  sec: "a".repeat(64),
  apiUserName: "zenuphealth",
};

describe("joinRoomClient failure propagation", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("preserves a producer server rejection reason", async () => {
    const socket = {
      emit: jest.fn((_event, _payload, acknowledge) =>
        acknowledge({ success: false, rtpCapabilities: null, reason: "No primary found for team 1" })
      ),
    } as any;

    await expect(joinRoomClient({ socket, ...validJoin })).resolves.toMatchObject({
      success: false,
      reason: "No primary found for team 1",
    });
  });

  it("preserves a consuming-edge server rejection reason", async () => {
    const socket = {
      emit: jest.fn((_event, _payload, acknowledge) =>
        acknowledge({ success: false, rtpCapabilities: null, reason: "Room is full" })
      ),
    } as any;

    await expect(
      joinRoomClient({ socket, consume: true, ...validJoin })
    ).resolves.toMatchObject({ success: false, reason: "Room is full" });
  });

  it("turns a missing acknowledgement into a bounded visible failure", async () => {
    jest.useFakeTimers();
    const socket = { emit: jest.fn() } as any;

    const result = joinRoomClient({ socket, ...validJoin });
    jest.advanceTimersByTime(15000);

    await expect(result).resolves.toMatchObject({
      success: false,
      reason: "Room server did not respond to the join request.",
    });
  });
});
