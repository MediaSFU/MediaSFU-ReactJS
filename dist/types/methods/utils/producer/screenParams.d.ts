export type ScreenParamsType = {
    encodings: RtpEncodingParameters[];
    codecOptions?: ProducerCodecOptions;
};
import { ProducerCodecOptions, RtpEncodingParameters } from "mediasoup-client/lib/types";
/**
 * Screen parameters configuration object.
 *
 * @constant
 * @type {ScreenParamsType}
 *
 * @property {Array<Object>} encodings - Array of encoding settings.
 * @property {string} encodings[].rid - The RTP stream identifier.
 * @property {number} encodings[].maxBitrate - Maximum bitrate for the encoding.
 * @property {string} encodings[].priority - Priority of the encoding.
 * @property {string} encodings[].networkPriority - Network priority of the encoding.
 *
 * @property {Object} codecOptions - Codec options for the screen parameters.
 * @property {number} codecOptions.videoGoogleStartBitrate - Initial bitrate for the video codec.
 */
export declare const screenParams: ScreenParamsType;
//# sourceMappingURL=screenParams.d.ts.map