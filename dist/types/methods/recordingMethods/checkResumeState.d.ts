export interface CheckResumeStateOptions {
    recordingMediaOptions: string;
    recordingVideoPausesLimit: number;
    recordingAudioPausesLimit: number;
    pauseRecordCount: number;
}
export type CheckResumeStateType = (options: CheckResumeStateOptions) => Promise<boolean>;
/**
 * Checks if the recording can be resumed based on the media type and pause limits.
 *
 * @param {Object} options - The options for checking resume state.
 * @param {string} options.recordingMediaOptions - The type of media being recorded ("video" or "audio").
 * @param {number} options.recordingVideoPausesLimit - The maximum number of pauses allowed for video recording.
 * @param {number} options.recordingAudioPausesLimit - The maximum number of pauses allowed for audio recording.
 * @param {number} options.pauseRecordCount - The current number of pauses that have occurred.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the recording can be resumed.
 */
export declare const checkResumeState: ({ recordingMediaOptions, recordingVideoPausesLimit, recordingAudioPausesLimit, pauseRecordCount, }: CheckResumeStateOptions) => Promise<boolean>;
//# sourceMappingURL=checkResumeState.d.ts.map