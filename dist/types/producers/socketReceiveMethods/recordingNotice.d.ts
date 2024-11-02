import { EventType, UserRecordingParams } from "../../@types/types";
export interface RecordingNoticeParameters {
    islevel: string;
    userRecordingParams: UserRecordingParams;
    recordElapsedTime: number;
    recordStartTime: number;
    recordStarted: boolean;
    recordPaused: boolean;
    canLaunchRecord: boolean;
    stopLaunchRecord: boolean;
    recordStopped: boolean;
    isTimerRunning: boolean;
    canPauseResume: boolean;
    eventType: EventType;
    updateRecordingProgressTime: (time: string) => void;
    updateShowRecordButtons: (show: boolean) => void;
    updateUserRecordingParams: (params: UserRecordingParams) => void;
    updateRecordingMediaOptions: (options: string) => void;
    updateRecordingAudioOptions: (options: string) => void;
    updateRecordingVideoOptions: (options: string) => void;
    updateRecordingVideoType: (type: string) => void;
    updateRecordingVideoOptimized: (optimized: boolean) => void;
    updateRecordingDisplayType: (type: "video" | "media" | "all") => void;
    updateRecordingAddHLS: (addHLS: boolean) => void;
    updateRecordingNameTags: (nameTags: boolean) => void;
    updateRecordingBackgroundColor: (color: string) => void;
    updateRecordingNameTagsColor: (color: string) => void;
    updateRecordingOrientationVideo: (orientation: string) => void;
    updateRecordingAddText: (addText: boolean) => void;
    updateRecordingCustomText: (text: string) => void;
    updateRecordingCustomTextPosition: (position: string) => void;
    updateRecordingCustomTextColor: (color: string) => void;
    updatePauseRecordCount: (count: number) => void;
    updateRecordElapsedTime: (time: number) => void;
    updateRecordStarted: (started: boolean) => void;
    updateRecordPaused: (paused: boolean) => void;
    updateCanLaunchRecord: (canLaunch: boolean) => void;
    updateStopLaunchRecord: (stop: boolean) => void;
    updateRecordStopped: (stopped: boolean) => void;
    updateIsTimerRunning: (running: boolean) => void;
    updateCanPauseResume: (canPause: boolean) => void;
    updateRecordStartTime: (startTime: number) => void;
    updateRecordState: (state: string) => void;
    [key: string]: any;
}
export interface RecordingNoticeOptions {
    state: string;
    userRecordingParam: UserRecordingParams | null;
    pauseCount: number;
    timeDone: number;
    parameters: RecordingNoticeParameters;
}
export type RecordingNoticeType = (options: RecordingNoticeOptions) => Promise<void>;
/**
 * Handles the recording notice state and updates various recording parameters accordingly.
 *
 * @param {RecordingNoticeOptions} options - The options object.
 * @param {string} options.state - The current state of the recording (e.g., "pause", "stop").
 * @param {UserRecordingParams | null} options.userRecordingParam - The user recording parameters.
 * @param {number} options.pauseCount - The count of pauses during the recording.
 * @param {number} options.timeDone - The elapsed time of the recording.
 * @param {Object} options.parameters - The parameters object containing various update functions and state variables.
 * @param {string} options.parameters.islevel - The level of the recording.
 * @param {Object} options.parameters.userRecordingParams - The user recording parameters.
 * @param {number} options.parameters.pauseRecordCount - The count of pauses during the recording.
 * @param {number} options.parameters.recordElapsedTime - The elapsed time of the recording.
 * @param {number} options.parameters.recordStartTime - The start time of the recording.
 * @param {boolean} options.parameters.recordStarted - Indicates if the recording has started.
 * @param {boolean} options.parameters.recordPaused - Indicates if the recording is paused.
 * @param {boolean} options.parameters.canLaunchRecord - Indicates if the recording can be launched.
 * @param {boolean} options.parameters.stopLaunchRecord - Indicates if the recording launch should be stopped.
 * @param {boolean} options.parameters.recordStopped - Indicates if the recording is stopped.
 * @param {boolean} options.parameters.isTimerRunning - Indicates if the timer is running.
 * @param {boolean} options.parameters.canPauseResume - Indicates if the recording can be paused or resumed.
 * @param {string} options.parameters.eventType - The type of event triggering the recording notice.
 * @param {Function} options.parameters.updateRecordingProgressTime - Function to update the recording progress time.
 * @param {Function} options.parameters.updateShowRecordButtons - Function to update the visibility of record buttons.
 * @param {Function} options.parameters.updateUserRecordingParams - Function to update user recording parameters.
 * @param {Function} options.parameters.updateRecordingMediaOptions - Function to update recording media options.
 * @param {Function} options.parameters.updateRecordingAudioOptions - Function to update recording audio options.
 * @param {Function} options.parameters.updateRecordingVideoOptions - Function to update recording video options.
 * @param {Function} options.parameters.updateRecordingVideoType - Function to update recording video type.
 * @param {Function} options.parameters.updateRecordingVideoOptimized - Function to update recording video optimization.
 * @param {Function} options.parameters.updateRecordingDisplayType - Function to update recording display type.
 * @param {Function} options.parameters.updateRecordingAddHLS - Function to update HLS addition in recording.
 * @param {Function} options.parameters.updateRecordingNameTags - Function to update recording name tags.
 * @param {Function} options.parameters.updateRecordingBackgroundColor - Function to update recording background color.
 * @param {Function} options.parameters.updateRecordingNameTagsColor - Function to update recording name tags color.
 * @param {Function} options.parameters.updateRecordingOrientationVideo - Function to update recording orientation video.
 * @param {Function} options.parameters.updateRecordingAddText - Function to update recording text addition.
 * @param {Function} options.parameters.updateRecordingCustomText - Function to update custom text in recording.
 * @param {Function} options.parameters.updateRecordingCustomTextPosition - Function to update custom text position.
 * @param {Function} options.parameters.updateRecordingCustomTextColor - Function to update custom text color.
 * @param {Function} options.parameters.updatePauseRecordCount - Function to update pause record count.
 * @param {Function} options.parameters.updateRecordElapsedTime - Function to update record elapsed time.
 * @param {Function} options.parameters.updateRecordStartTime - Function to update record start time.
 * @param {Function} options.parameters.updateRecordStarted - Function to update record started status.
 * @param {Function} options.parameters.updateRecordPaused - Function to update record paused status.
 * @param {Function} options.parameters.updateCanLaunchRecord - Function to update can launch record status.
 * @param {Function} options.parameters.updateStopLaunchRecord - Function to update stop launch record status.
 * @param {Function} options.parameters.updateRecordStopped - Function to update record stopped status.
 * @param {Function} options.parameters.updateIsTimerRunning - Function to update timer running status.
 * @param {Function} options.parameters.updateCanPauseResume - Function to update can pause/resume status.
 * @param {Function} options.parameters.updateRecordState - Function to update the record state.
 *
 * @returns {Promise<void>} A promise that resolves when the recording notice handling is complete.
 *
 * @example
 * ```typescript
 * const options = {
 *   state: "pause",
 *   userRecordingParam: {
 *     mainSpecs: { mediaOptions: "option1", audioOptions: "option2", videoOptions: "option3", videoType: "HD" },
 *     dispSpecs: { nameTags: true, backgroundColor: "blue", orientationVideo: "landscape" },
 *     textSpecs: { addText: true, customText: "Sample", customTextPosition: "top-right", customTextColor: "white" },
 *   },
 *   pauseCount: 2,
 *   timeDone: 3600,
 *   parameters: {
 *     islevel: "2",
 *     userRecordingParams: { },
 *     recordElapsedTime: 0,
 *     recordStartTime: 0,
 *     // various other parameters and update functions here...
 *   },
 * };
 * await recordingNotice(options);
 * ```
 */
export declare const recordingNotice: ({ state, userRecordingParam, pauseCount, timeDone, parameters, }: RecordingNoticeOptions) => Promise<void>;
//# sourceMappingURL=recordingNotice.d.ts.map