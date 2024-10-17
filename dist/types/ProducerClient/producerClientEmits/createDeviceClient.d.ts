import { RtpCapabilities, Device } from "mediasoup-client/lib/types";
export interface CreateDeviceClientOptions {
    rtpCapabilities: RtpCapabilities | null;
}
export type CreateDeviceClientType = (options: CreateDeviceClientOptions) => Promise<Device | null>;
/**
 * Creates a mediasoup client device with the provided RTP capabilities.
 *
 * @param {CreateDeviceClientOptions} options - The options for creating the device client.
 * @param {RTPCapabilities} options.rtpCapabilities - The RTP capabilities required for the device.
 * @returns {Promise<Device | null>} A promise that resolves to the created Device or null if creation fails.
 * @throws {Error} Throws an error if the required parameters are not provided or if device creation is not supported.
 *
 * @example
 * const device = await createDeviceClient({ rtpCapabilities });
 * if (device) {
 *   console.log("Device created successfully");
 * } else {
 *   console.log("Failed to create device");
 * }
 */
export declare const createDeviceClient: ({ rtpCapabilities }: CreateDeviceClientOptions) => Promise<Device | null>;
//# sourceMappingURL=createDeviceClient.d.ts.map