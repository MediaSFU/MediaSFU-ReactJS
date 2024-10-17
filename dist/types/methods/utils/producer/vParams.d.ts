export type VParamsType = {
    encodings: RtpEncodingParameters[];
    codecOptions?: ProducerCodecOptions;
};
import { ProducerCodecOptions, RtpEncodingParameters } from "mediasoup-client/lib/types";
/**
 * Video parameters configuration object.
 *
 * @type {VParamsType}
 * @property {Array<Object>} encodings - Array of encoding settings.
 * @property {string} encodings[].rid - The RTP stream identifier.
 * @property {number} encodings[].maxBitrate - Maximum bitrate for the encoding.
 * @property {string} encodings[].scalabilityMode - Scalability mode for the encoding.
 * @property {string} encodings[].networkPriority - Network priority for the encoding.
 * @property {string} encodings[].priority - Priority for the encoding.
 * @property {number} [encodings[].scaleResolutionDownBy] - Factor by which to scale down the resolution.
 * @property {Object} codecOptions - Codec options for the video.
 * @property {number} codecOptions.videoGoogleStartBitrate - Initial bitrate for the video codec.
 */
export declare const vParams: VParamsType;
//# sourceMappingURL=vParams.d.ts.map