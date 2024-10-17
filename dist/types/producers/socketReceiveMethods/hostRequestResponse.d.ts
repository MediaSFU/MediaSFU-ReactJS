import { ShowAlert, Request, RequestResponse } from "../../@types/types";
export interface HostRequestResponseOptions {
    requestResponse: RequestResponse;
    showAlert?: ShowAlert;
    requestList: Request[];
    updateRequestList: (requestList: Request[]) => void;
    updateMicAction: (action: boolean) => void;
    updateVideoAction: (action: boolean) => void;
    updateScreenAction: (action: boolean) => void;
    updateChatAction: (action: boolean) => void;
    updateAudioRequestState: (state: string | null) => void;
    updateVideoRequestState: (state: string | null) => void;
    updateScreenRequestState: (state: string | null) => void;
    updateChatRequestState: (state: string | null) => void;
    updateAudioRequestTime: (time: number) => void;
    updateVideoRequestTime: (time: number) => void;
    updateScreenRequestTime: (time: number) => void;
    updateChatRequestTime: (time: number) => void;
    updateRequestIntervalSeconds: number;
}
export type HostRequestResponseType = (options: HostRequestResponseOptions) => Promise<void>;
/**
 * Handles the response to a host request, updating the request list and performing actions based on the response.
 *
 * @param {Object} options - The options for handling the host request response.
 * @param {Object} options.requestResponse - The response to the request.
 * @param {Function} [options.showAlert] - Optional function to show alerts.
 * @param {Array} options.requestList - The current list of requests.
 * @param {Function} options.updateRequestList - Function to update the request list.
 * @param {Function} options.updateMicAction - Function to update the microphone action state.
 * @param {Function} options.updateVideoAction - Function to update the video action state.
 * @param {Function} options.updateScreenAction - Function to update the screen action state.
 * @param {Function} options.updateChatAction - Function to update the chat action state.
 * @param {Function} options.updateAudioRequestState - Function to update the audio request state.
 * @param {Function} options.updateVideoRequestState - Function to update the video request state.
 * @param {Function} options.updateScreenRequestState - Function to update the screen request state.
 * @param {Function} options.updateChatRequestState - Function to update the chat request state.
 * @param {Function} options.updateAudioRequestTime - Function to update the audio request time.
 * @param {Function} options.updateVideoRequestTime - Function to update the video request time.
 * @param {Function} options.updateScreenRequestTime - Function to update the screen request time.
 * @param {Function} options.updateChatRequestTime - Function to update the chat request time.
 * @param {number} options.updateRequestIntervalSeconds - The interval in seconds to wait before allowing another request.
 * @returns {Promise<void>} A promise that resolves when the request response has been handled.
 */
export declare const hostRequestResponse: ({ requestResponse, showAlert, requestList, updateRequestList, updateMicAction, updateVideoAction, updateScreenAction, updateChatAction, updateAudioRequestState, updateVideoRequestState, updateScreenRequestState, updateChatRequestState, updateAudioRequestTime, updateVideoRequestTime, updateScreenRequestTime, updateChatRequestTime, updateRequestIntervalSeconds, }: HostRequestResponseOptions) => Promise<void>;
//# sourceMappingURL=hostRequestResponse.d.ts.map