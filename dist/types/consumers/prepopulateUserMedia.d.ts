import React from "react";
import { Participant, Stream, AudioCardParameters, EventType, CustomVideoCardType, CustomAudioCardType, CustomMiniCardType } from "../@types/types";
export interface PrepopulateUserMediaParameters extends AudioCardParameters {
    participants: Participant[];
    allVideoStreams: (Stream | Participant)[];
    islevel: string;
    member: string;
    shared: boolean;
    shareScreenStarted: boolean;
    eventType: EventType;
    screenId?: string;
    forceFullDisplay: boolean;
    updateMainWindow: boolean;
    mainScreenFilled: boolean;
    adminOnMainScreen: boolean;
    mainScreenPerson: string;
    videoAlreadyOn: boolean;
    audioAlreadyOn: boolean;
    oldAllStreams: (Stream | Participant)[];
    checkOrientation: () => string;
    screenForceFullDisplay: boolean;
    localStreamScreen: MediaStream | null;
    remoteScreenStream: Stream[];
    localStreamVideo: MediaStream | null;
    mainHeightWidth: number;
    isWideScreen: boolean;
    localUIMode: boolean;
    whiteboardStarted: boolean;
    whiteboardEnded: boolean;
    virtualStream: MediaStream | null;
    keepBackground: boolean;
    annotateScreenStream: boolean;
    updateMainScreenPerson: (person: string) => void;
    updateMainScreenFilled: (filled: boolean) => void;
    updateAdminOnMainScreen: (admin: boolean) => void;
    updateMainHeightWidth: (heightWidth: number) => void;
    updateScreenForceFullDisplay: (force: boolean) => void;
    updateUpdateMainWindow: (update: boolean) => void;
    updateMainGridStream: (components: React.JSX.Element[]) => void;
    customVideoCard?: CustomVideoCardType;
    customAudioCard?: CustomAudioCardType;
    customMiniCard?: CustomMiniCardType;
    getUpdatedAllParams: () => PrepopulateUserMediaParameters;
    [key: string]: any;
}
export interface PrepopulateUserMediaOptions {
    name: string;
    parameters: PrepopulateUserMediaParameters;
}
export type PrepopulateUserMediaType = (options: PrepopulateUserMediaOptions) => Promise<React.JSX.Element[] | void>;
/**
 * Prepopulates the user media based on the provided options.
 *
 * @param {PrepopulateUserMediaOptions} options - The options for prepopulating user media.
 * @param {string} options.name - The name of the user.
 * @param {Parameters} options.parameters - The parameters for prepopulating user media.
 * @param {Function} options.parameters.getUpdatedAllParams - Function to get updated parameters.
 * @param {Array<Participant>} options.parameters.participants - List of participants.
 * @param {Array<Stream>} options.parameters.allVideoStreams - List of all video streams.
 * @param {string} options.parameters.islevel - The level of the user.
 * @param {string} options.parameters.member - The member name.
 * @param {boolean} options.parameters.shared - Indicates if the screen is shared.
 * @param {boolean} options.parameters.shareScreenStarted - Indicates if screen sharing has started.
 * @param {string} options.parameters.eventType - The type of event.
 * @param {string} options.parameters.screenId - The screen ID.
 * @param {boolean} options.parameters.forceFullDisplay - Indicates if full display is forced.
 * @param {Function} options.parameters.updateMainWindow - Function to update the main window.
 * @param {boolean} options.parameters.mainScreenFilled - Indicates if the main screen is filled.
 * @param {boolean} options.parameters.adminOnMainScreen - Indicates if admin is on the main screen.
 * @param {string} options.parameters.mainScreenPerson - The person on the main screen.
 * @param {boolean} options.parameters.videoAlreadyOn - Indicates if the video is already on.
 * @param {boolean} options.parameters.audioAlreadyOn - Indicates if the audio is already on.
 * @param {Array<Stream>} options.parameters.oldAllStreams - List of old all streams.
 * @param {Function} options.parameters.checkOrientation - Function to check orientation.
 * @param {boolean} options.parameters.screenForceFullDisplay - Indicates if screen force full display is enabled.
 * @param {Stream} options.parameters.localStreamScreen - The local screen stream.
 * @param {Array<Stream>} options.parameters.remoteScreenStream - List of remote screen streams.
 * @param {Stream} options.parameters.localStreamVideo - The local video stream.
 * @param {number} options.parameters.mainHeightWidth - The main height and width.
 * @param {boolean} options.parameters.isWideScreen - Indicates if the screen is wide.
 * @param {boolean} options.parameters.localUIMode - Indicates if local UI mode is enabled.
 * @param {boolean} options.parameters.whiteboardStarted - Indicates if whiteboard has started.
 * @param {boolean} options.parameters.whiteboardEnded - Indicates if whiteboard has ended.
 * @param {Stream} options.parameters.virtualStream - The virtual stream.
 * @param {boolean} options.parameters.keepBackground - Indicates if background should be kept.
 * @param {boolean} options.parameters.annotateScreenStream - The annotate screen stream.
 * @param {Function} options.parameters.updateMainScreenPerson - Function to update the main screen person.
 * @param {Function} options.parameters.updateMainScreenFilled - Function to update if the main screen is filled.
 * @param {Function} options.parameters.updateAdminOnMainScreen - Function to update if admin is on the main screen.
 * @param {Function} options.parameters.updateMainHeightWidth - Function to update the main height and width.
 * @param {Function} options.parameters.updateScreenForceFullDisplay - Function to update screen force full display.
 * @param {Function} options.parameters.updateUpdateMainWindow - Function to update the main window update status.
 * @param {Function} options.parameters.updateMainGridStream - Function to update the main grid stream.
 *
 * @returns {Promise<React.JSX.Element[] | void>} A promise that resolves to an array of JSX elements or void.
 *
 * @example
 * ```typescript
 * const elements = await prepopulateUserMedia({
 *   name: "John Doe",
 *   parameters: {
 *     participants: [],
 *     allVideoStreams: [],
 *     islevel: "1",
 *     member: "John",
 *     shared: false,
 *     shareScreenStarted: false,
 *     eventType: "conference",
 *     screenId: "screen1",
 *     forceFullDisplay: true,
 *     updateMainWindow: true,
 *     mainScreenFilled: false,
 *     adminOnMainScreen: false,
 *     mainScreenPerson: "Jane",
 *     videoAlreadyOn: false,
 *     audioAlreadyOn: false,
 *     oldAllStreams: [],
 *     checkOrientation: () => "portrait",
 *     screenForceFullDisplay: false,
 *     localStreamScreen: null,
 *     remoteScreenStream: [],
 *     localStreamVideo: null,
 *     mainHeightWidth: 800,
 *     isWideScreen: true,
 *     localUIMode: false,
 *     whiteboardStarted: false,
 *     whiteboardEnded: false,
 *     virtualStream: null,
 *     keepBackground: false,
 *     annotateScreenStream: false,
 *     updateMainScreenPerson: (person) => console.log(person),
 *     updateMainScreenFilled: (filled) => console.log(filled),
 *     updateAdminOnMainScreen: (admin) => console.log(admin),
 *     updateMainHeightWidth: (heightWidth) => console.log(heightWidth),
 *     updateScreenForceFullDisplay: (force) => console.log(force),
 *     updateUpdateMainWindow: (update) => console.log(update),
 *     updateMainGridStream: (components) => console.log(components),
 *   },
 * });
 * ```
 */
export declare function prepopulateUserMedia({ name, parameters, }: PrepopulateUserMediaOptions): Promise<React.JSX.Element[] | void>;
//# sourceMappingURL=prepopulateUserMedia.d.ts.map