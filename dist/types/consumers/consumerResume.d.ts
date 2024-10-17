import { Socket } from "socket.io-client";
import { ReorderStreamsType, ReorderStreamsParameters, Participant, PrepopulateUserMediaType, PrepopulateUserMediaParameters, Stream, MiniAudioPlayerParameters, EventType } from "../@types/types";
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
    audioOnlyStreams: JSX.Element[];
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
    updateAudioOnlyStreams: (value: JSX.Element[]) => void;
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
}
export type ConsumerResumeType = (options: ConsumerResumeOptions) => Promise<void>;
export declare const consumerResume: ({ track, remoteProducerId, params, parameters, nsock, }: ConsumerResumeOptions) => Promise<void>;
export {};
//# sourceMappingURL=consumerResume.d.ts.map