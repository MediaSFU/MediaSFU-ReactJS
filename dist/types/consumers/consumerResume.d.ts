import { Socket } from "socket.io-client";
import { ReorderStreamsType, ReorderStreamsParameters, Participant, PrepopulateUserMediaType, PrepopulateUserMediaParameters, Stream, MiniAudioPlayerParameters, EventType } from "../@types/types";
import { Consumer } from "mediasoup-client/lib/types";
export interface ConsumerResumeParameters extends ReorderStreamsParameters, PrepopulateUserMediaParameters, MiniAudioPlayerParameters {
    nStream: MediaStream | null;
    allAudioStreams: (Stream | Participant)[];
    allVideoStreams: (Stream | Participant)[];
    streamNames: Stream[];
    audStreamNames: Stream[];
    updateMainWindow: boolean;
    shared: boolean;
    shareScreenStarted: boolean;
    screenId?: string;
    participants: Participant[];
    eventType: EventType;
    meetingDisplayType: string;
    mainScreenFilled: boolean;
    first_round: boolean;
    lock_screen: boolean;
    oldAllStreams: (Stream | Participant)[];
    adminVidID?: string;
    mainHeightWidth: number;
    member: string;
    audioOnlyStreams: React.JSX.Element[];
    gotAllVids: boolean;
    defer_receive: boolean;
    firstAll: boolean;
    remoteScreenStream: Stream[];
    hostLabel: string;
    whiteboardStarted: boolean;
    whiteboardEnded: boolean;
    updateUpdateMainWindow: (value: boolean) => void;
    updateAllAudioStreams: (value: (Stream | Participant)[]) => void;
    updateAllVideoStreams: (value: (Stream | Participant)[]) => void;
    updateStreamNames: (value: Stream[]) => void;
    updateAudStreamNames: (value: Stream[]) => void;
    updateNStream: (value: MediaStream) => void;
    updateMainHeightWidth: (value: number) => void;
    updateLock_screen: (value: boolean) => void;
    updateFirstAll: (value: boolean) => void;
    updateRemoteScreenStream: (value: Stream[]) => void;
    updateOldAllStreams: (value: (Stream | Participant)[]) => void;
    updateAudioOnlyStreams: (value: React.JSX.Element[]) => void;
    updateShareScreenStarted: (value: boolean) => void;
    updateGotAllVids: (value: boolean) => void;
    updateScreenId: (value: string) => void;
    updateDefer_receive: (value: boolean) => void;
    reorderStreams: ReorderStreamsType;
    prepopulateUserMedia: PrepopulateUserMediaType;
    getUpdatedAllParams: () => ConsumerResumeParameters;
    [key: string]: any;
}
interface ResumeParams {
    id: string;
    producerId: string;
    kind: string;
    rtpParameters: any;
}
export interface ConsumerResumeOptions {
    track: MediaStreamTrack;
    kind: string;
    remoteProducerId: string;
    params: ResumeParams;
    parameters: ConsumerResumeParameters;
    nsock: Socket;
    consumer: Consumer;
}
export type ConsumerResumeType = (options: ConsumerResumeOptions) => Promise<void>;
/**
 * Resumes the consumer by handling the provided track and updating the relevant parameters.
 *
 * @param {ConsumerResumeOptions} options - The options for resuming the consumer.
 * @param {MediaStreamTrack} options.track - The media stream track to resume.
 * @param {string} options.remoteProducerId - The ID of the remote producer.
 * @param {ResumeParams} options.params - The parameters required for resuming the consumer.
 * @param {ConsumerResumeParameters} options.parameters - The parameters for updating the state.
 * @param {Socket} options.nsock - The socket instance for communication.
 * @param {Consumer} options.consumer - The consumer instance to resume.
 *
 * @returns {Promise<void>} A promise that resolves when the consumer is successfully resumed.
 *
 * @throws Will throw an error if the resumption fails or if there is an issue with the parameters.
 *
 * @example
 * const options = {
 *   track: mediaStreamTrack,
 *   remoteProducerId: 'producer-id',
 *   params: {
 *     id: 'consumer-id',
 *     producerId: 'producer-id',
 *     kind: 'audio', // or 'video'
 *     rtpParameters: {}, // RTP parameters
 *   },
 *   consumer: consumerInstance,
 *   parameters: {
 *     nStream: null,
 *     allAudioStreams: [],
 *     allVideoStreams: [],
 *     streamNames: [],
 *     audStreamNames: [],
 *     updateMainWindow: false,
 *     shared: false,
 *     shareScreenStarted: false,
 *     participants: [],
 *     eventType: 'conference',
 *     meetingDisplayType: 'video',
 *     mainScreenFilled: false,
 *     first_round: false,
 *     lock_screen: false,
 *     oldAllStreams: [],
 *     adminVidID: null,
 *     mainHeightWidth: 0,
 *     member: 'John Doe',
 *     audioOnlyStreams: [],
 *     gotAllVids: false,
 *     defer_receive: false,
 *     firstAll: false,
 *     remoteScreenStream: [],
 *     hostLabel: 'host',
 *     whiteboardStarted: false,
 *     whiteboardEnded: false,
 *     updateUpdateMainWindow: (value) => { console.log('updated')},
 *     updateAllAudioStreams: (streams) => { console.log('updated')},
 *     updateAllVideoStreams: (streams) => { console.log('updated')},
 *     updateStreamNames: (streams) => { console.log('updated')},
 *     updateAudStreamNames: (streams) => { console.log('updated')},
 *     updateNStream: (stream) => { console.log('updated')},
 *     updateMainHeightWidth: (value) => { console.log('updated')},
 *     updateLock_screen: (value) => { console.log('updated')},
 *     updateFirstAll: (value) => { console.log('updated')},
 *     updateRemoteScreenStream: (streams) => { console.log('updated')},
 *     updateOldAllStreams: (streams) => { console.log('updated')},
 *     updateAudioOnlyStreams: (streams) => { console.log('updated')},
 *     updateShareScreenStarted: (value) => { console.log('updated')},
 *     updateGotAllVids: (value) => { console.log('updated')},
 *     updateScreenId: (id) => { console.log('updated')},
 *     updateDefer_receive: (value) => { console.log('updated')},
 *     reorderStreams: (params) => { console.log('reordered') }
 *     prepopulateUserMedia: (params) => { console.log('prepopulated') },
 *   },
 *   nsock: socketInstance,
 * };
 *
 * consumerResume(options)
 *   .then(() => {
 *     console.log('Consumer resumed successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error resuming consumer:', error);
 *   });
 */
export declare const consumerResume: ({ track, remoteProducerId, params, parameters, nsock, consumer, }: ConsumerResumeOptions) => Promise<void>;
export {};
//# sourceMappingURL=consumerResume.d.ts.map