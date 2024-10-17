export type HParamsType = {
    encodings: RtpEncodingParameters[];
    codecOptions?: ProducerCodecOptions;
};
import { ProducerCodecOptions, RtpEncodingParameters } from "mediasoup-client/lib/types";
/**
 * hParams configuration object for encoding and codec options.
 *
 * @type {HParamsType}
 * @property {Array<Object>} encodings - Array of encoding settings.
 * @property {string} encodings[].rid - The RTP stream identifier.
 * @property {number} encodings[].maxBitrate - Maximum bitrate for the encoding.
 * @property {string} encodings[].scalabilityMode - Scalability mode for the encoding.
 * @property {string} encodings[].priority - Priority of the encoding.
 * @property {string} encodings[].networkPriority - Network priority of the encoding.
 * @property {number} [encodings[].scaleResolutionDownBy] - Factor by which to scale down the resolution.
 * @property {Object} codecOptions - Codec options for the encoding.
 * @property {number} codecOptions.videoGoogleStartBitrate - Initial bitrate for Google video codec.
 */
export declare const hParams: HParamsType;
//# sourceMappingURL=hParams.d.ts.map