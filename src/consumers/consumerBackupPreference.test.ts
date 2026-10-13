import {
  CONSUMER_BACKUP_PREFER_DELAY_MS,
  consumerBackupPreferDelay,
  forgetConsumerBackups,
  preferredConsumerBackup,
  rememberConsumerBackups,
} from "./consumerBackupPreference";
import { getDomains } from "../producers/socketReceiveMethods/getDomains";

describe("consumer backup preference", () => {
  afterEach(() => forgetConsumerBackups());

  it("prefers a connected backup for streams announced by its busy parent", () => {
    rememberConsumerBackups({ sc00901: "sc00902" });
    const connected = [{ sc00901: { connected: true } }, { sc00902: { connected: true } }];
    expect(preferredConsumerBackup("sc00901", connected)).toBe("sc00902");
    expect(consumerBackupPreferDelay("sc00901", connected)).toBe(CONSUMER_BACKUP_PREFER_DELAY_MS);
    // The backup itself and unrelated nodes consume at once.
    expect(consumerBackupPreferDelay("sc00902", connected)).toBe(0);
    expect(consumerBackupPreferDelay("sc00903", connected)).toBe(0);
  });

  it("falls back to today's behaviour when the backup is not connected or unknown", () => {
    rememberConsumerBackups({ sc00901: "sc00902" });
    expect(consumerBackupPreferDelay("sc00901", [{ sc00901: { connected: true } }])).toBe(0);
    expect(consumerBackupPreferDelay("sc00901", [{ sc00902: { connected: false } }])).toBe(0);
    rememberConsumerBackups({ x: "x" });
    expect(consumerBackupPreferDelay("x", [{ x: { connected: true } }])).toBe(0);
  });

  it("learns the map from the server's consuming-domain update", async () => {
    const connectIps = jest.fn().mockResolvedValue([[], []]);
    const parameters: any = {
      roomRecvIPs: ["sc00901"],
      consume_sockets: [{ sc00901: { connected: true } }],
      connectIps,
      getUpdatedAllParams: () => parameters,
    };
    await getDomains({ domains: ["sc00901"], alt_domains: { sc00901: "sc00902" }, parameters } as any);
    expect(connectIps.mock.calls[0][0].remIP).toEqual(["sc00902"]);
    expect(preferredConsumerBackup("sc00901", [{ sc00902: { connected: true } }])).toBe("sc00902");
  });
});
