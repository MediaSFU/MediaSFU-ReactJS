import { Stream, Participant, Transport, PrepopulateUserMediaParameters, PrepopulateUserMediaType, RePortParameters, RePortType, ProcessConsumerTransportsParameters, ProcessConsumerTransportsType, ResumePauseStreamsParameters, ResumePauseStreamsType, ReadjustParameters, ReadjustType, AddVideosGridType, AddVideosGridParameters, GetEstimateType, CheckGridType, ResumePauseAudioStreamsParameters, ResumePauseAudioStreamsType, GetEstimateParameters, EventType } from "../@types/types";
export interface DispStreamsParameters extends PrepopulateUserMediaParameters, RePortParameters, ProcessConsumerTransportsParameters, ResumePauseStreamsParameters, ReadjustParameters, ResumePauseAudioStreamsParameters, GetEstimateParameters, AddVideosGridParameters {
    consumerTransports: Transport[];
    streamNames: Stream[];
    audStreamNames: Stream[];
    participants: Participant[];
    ref_participants: Participant[];
    recordingDisplayType: 'video' | 'media' | 'all';
    recordingVideoOptimized: boolean;
    meetingDisplayType: string;
    meetingVideoOptimized: boolean;
    currentUserPage: number;
    hostLabel: string;
    mainHeightWidth: number;
    prevMainHeightWidth: number;
    prevDoPaginate: boolean;
    doPaginate: boolean;
    firstAll: boolean;
    shared: boolean;
    shareScreenStarted: boolean;
    shareEnded: boolean;
    oldAllStreams: (Stream | Participant)[];
    updateMainWindow: boolean;
    remoteProducerId?: string;
    activeNames: string[];
    dispActiveNames: string[];
    p_dispActiveNames: string[];
    nForReadjustRecord: number;
    first_round: boolean;
    lock_screen: boolean;
    chatRefStreams: (Stream | Participant)[];
    eventType: EventType;
    islevel: string;
    localStreamVideo: MediaStream | null;
    breakOutRoomStarted: boolean;
    breakOutRoomEnded: boolean;
    keepBackground: boolean;
    virtualStream: MediaStream | null;
    updateActiveNames: (names: string[]) => void;
    updateDispActiveNames: (names: string[]) => void;
    updateLStreams: (streams: (Stream | Participant)[]) => void;
    updateChatRefStreams: (streams: (Stream | Participant)[]) => void;
    updateNForReadjustRecord: (n: number) => void;
    updateUpdateMainWindow: (value: boolean) => void;
    updateShowMiniView: (value: boolean) => void;
    prepopulateUserMedia: PrepopulateUserMediaType;
    rePort: RePortType;
    processConsumerTransports: ProcessConsumerTransportsType;
    resumePauseStreams: ResumePauseStreamsType;
    readjust: ReadjustType;
    addVideosGrid: AddVideosGridType;
    getEstimate: GetEstimateType;
    checkGrid: CheckGridType;
    resumePauseAudioStreams: ResumePauseAudioStreamsType;
    getUpdatedAllParams: () => DispStreamsParameters;
    [key: string]: any;
}
export interface DispStreamsOptions {
    lStreams: (Stream | Participant)[];
    ind: number;
    auto?: boolean;
    ChatSkip?: boolean;
    forChatCard?: any;
    forChatID?: any;
    parameters: DispStreamsParameters;
    breakRoom?: number;
    inBreakRoom?: boolean;
}
export type DispStreamsType = (options: DispStreamsOptions) => Promise<void>;
/**
 * Function to display streams based on various parameters and conditions.
 *
 * @param {DispStreamsOptions} options - The options object.
 * @param {Array} options.lStreams - List of streams to display.
 * @param {number} options.ind - Index of the current stream.
 * @param {boolean} [options.auto=false] - Flag to indicate if the function should run automatically.
 * @param {boolean} [options.ChatSkip=false] - Flag to indicate if chat should be skipped.
 * @param {string|null} [options.forChatID=null] - ID for chat reference.
 * @param {DispStreamsParameters} options.parameters - Parameters object containing various settings and functions.
 * @param {number} [options.breakRoom=-1] - Break room number.
 * @param {boolean} [options.inBreakRoom=false] - Flag to indicate if in break room.
 *
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws Will log an error if an issue occurs during the display of streams.
 *
 * @example
 * const options = {
 *   lStreams: [stream1, stream2],
 *   ind: 0,
 *   auto: true,
 *   ChatSkip: false,
 *   forChatID: 'chat123',
 *   parameters: {
 *     consumerTransports: [],
 *     streamNames: [],
 *     audStreamNames: [],
 *     participants: [],
 *     ref_participants: [],
 *     recordingDisplayType: 'video',
 *     recordingVideoOptimized: false,
 *     meetingDisplayType: 'video',
 *     meetingVideoOptimized: false,
 *     currentUserPage: 1,
 *     hostLabel: 'Host',
 *     mainHeightWidth: 800,
 *     prevMainHeightWidth: 600,
 *     prevDoPaginate: false,
 *     doPaginate: true,
 *     firstAll: true,
 *     shared: false,
 *     shareScreenStarted: false,
 *     shareEnded: false,
 *     oldAllStreams: [],
 *     updateMainWindow: true,
 *     remoteProducerId: null,
 *     activeNames: [],
 *     dispActiveNames: [],
 *     p_dispActiveNames: [],
 *     nForReadjustRecord: 0,
 *     first_round: false,
 *     lock_screen: false,
 *     chatRefStreams: [],
 *     eventType: 'meeting',
 *     islevel: '1',
 *     localStreamVideo: null,
 *     breakOutRoomStarted: false,
 *     breakOutRoomEnded: false,
 *     keepBackground: false,
 *     virtualStream: null,
 *     updateActiveNames: (names) => console.log('Updated active names:', names),
 *     updateDispActiveNames: (names) => console.log('Updated displayed active names:', names),
 *     updateLStreams: (streams) => console.log('Updated limited streams:', streams),
 *     updateChatRefStreams: (streams) => console.log('Updated chat reference streams:', streams),
 *     updateNForReadjustRecord: (n) => console.log('Updated n for readjustment:', n),
 *     updateUpdateMainWindow: (state) => console.log('Main window updated:', state),
 *     updateShowMiniView: (value) => console.log('Mini view updated:', value),
 *     prepopulateUserMedia: async () => { console.log('your logic')},
 *     rePort: async () => { console.log('your logic')},
 *     processConsumerTransports: async () => { console.log('your logic')},
 *     resumePauseStreams: async () => { console.log('your logic')},
 *     readjust: async () => { console.log('your logic')},
 *     addVideosGrid: async () => { console.log('your logic')},
 *     getEstimate: async () => { console.log('your logic')},
 *     checkGrid: async () => { console.log('your logic')},
 *     resumePauseAudioStreams: async () => { console.log('your logic')},
 *     getUpdatedAllParams: () => { console.log('your logic')},
 *   },
 *   breakRoom: 1,
 *   inBreakRoom: false,
 * };
 *
 * dispStreams(options)
 *   .then(() => {
 *     console.log('Streams displayed successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error displaying streams:', error);
 *   });
 */
export declare function dispStreams({ lStreams, ind, auto, ChatSkip, forChatID, parameters, breakRoom, inBreakRoom, }: DispStreamsOptions): Promise<void>;
//# sourceMappingURL=dispStreams.d.ts.map