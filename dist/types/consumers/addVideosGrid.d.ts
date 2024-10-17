import { Participant, Stream, UpdateMiniCardsGridType, UpdateMiniCardsGridParameters, AudioCardParameters, EventType } from "../@types/types";
export interface AddVideosGridParameters extends UpdateMiniCardsGridParameters, AudioCardParameters {
    eventType: EventType;
    updateAddAltGrid: (addAltGrid: boolean) => void;
    ref_participants: Participant[];
    islevel: string;
    videoAlreadyOn: boolean;
    localStreamVideo: MediaStream | null;
    keepBackground: boolean;
    virtualStream: MediaStream | null;
    forceFullDisplay: boolean;
    otherGridStreams: JSX.Element[][];
    updateOtherGridStreams: (otherGridStreams: JSX.Element[][]) => void;
    updateMiniCardsGrid: UpdateMiniCardsGridType;
    getUpdatedAllParams: () => AddVideosGridParameters;
    [key: string]: any;
}
export interface AddVideosGridOptions {
    mainGridStreams: (Stream | Participant)[];
    altGridStreams: (Stream | Participant)[];
    numtoadd: number;
    numRows: number;
    numCols: number;
    actualRows: number;
    lastrowcols: number;
    removeAltGrid: boolean;
    parameters: AddVideosGridParameters;
}
export type AddVideosGridType = (options: AddVideosGridOptions) => Promise<void>;
export declare function addVideosGrid({ mainGridStreams, altGridStreams, numtoadd, numRows, numCols, actualRows, lastrowcols, removeAltGrid, parameters, }: AddVideosGridOptions): Promise<void>;
//# sourceMappingURL=addVideosGrid.d.ts.map