import React from "react";
import { Participant, Stream, UpdateMiniCardsGridType, UpdateMiniCardsGridParameters, AudioCardParameters, EventType, CustomVideoCardType, CustomAudioCardType, CustomMiniCardType } from "../@types/types";
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
    otherGridStreams: React.JSX.Element[][];
    updateOtherGridStreams: (otherGridStreams: React.JSX.Element[][]) => void;
    customVideoCard?: CustomVideoCardType;
    customAudioCard?: CustomAudioCardType;
    customMiniCard?: CustomMiniCardType;
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
/**
 * Adds participants to the main and alternate video grids based on the provided parameters.
 *
 * @function
 * @async
 * @param {AddVideosGridOptions} options - The options for adding videos to the grid.
 * @param {Array} options.mainGridStreams - The main grid streams containing participant or stream data.
 * @param {Array} options.altGridStreams - The alternate grid streams containing participant or stream data.
 * @param {number} options.numtoadd - The number of participants to add to the grid.
 * @param {number} options.numRows - The number of rows in the grid layout.
 * @param {number} options.numCols - The number of columns in the grid layout.
 * @param {number} options.actualRows - The actual number of rows currently filled in the grid.
 * @param {number} options.lastrowcols - The number of columns in the last row of the grid.
 * @param {boolean} options.removeAltGrid - Flag indicating whether to remove the alternate grid.
 * @param {AddVideosGridParameters} options.parameters - Additional parameters required for the function.
 * @param {string} options.parameters.eventType - The type of event (e.g., meeting, conference).
 * @param {Function} options.parameters.updateAddAltGrid - Callback to update the status of the alternate grid.
 * @param {Array} options.parameters.ref_participants - A reference list of participants.
 * @param {string} options.parameters.islevel - The participation level of the user.
 * @param {boolean} options.parameters.videoAlreadyOn - Indicates if video streaming is already active.
 * @param {MediaStream} options.parameters.localStreamVideo - The user's local video stream.
 * @param {boolean} options.parameters.keepBackground - Flag to determine if the background should be retained.
 * @param {MediaStream} options.parameters.virtualStream - The virtual stream to use.
 * @param {boolean} options.parameters.forceFullDisplay - Flag to enforce full display mode.
 * @param {Array} options.parameters.otherGridStreams - Additional streams for the grid.
 * @param {Function} options.parameters.updateOtherGridStreams - Callback to update other grid streams.
 * @param {Function} options.parameters.updateMiniCardsGrid - Callback to update the mini card display.
 * @param {Function} options.parameters.getUpdatedAllParams - Function to retrieve updated parameters.
 * @returns {Promise<void>} A promise that resolves when the grid has been updated successfully.
 *
 * @example
 * import { addVideosGrid } from 'mediasfu-reactjs';
 *
 * const options = {
 *   mainGridStreams: mainGridStreams,
 *   altGridStreams: altGridStreams,
 *   numtoadd: numtoadd,
 *   numRows: numRows,
 *   numCols: numCols,
 *   actualRows: actualRows,
 *   lastrowcols: lastrowcols,
 *   removeAltGrid: removeAltGrid,
 *   parameters: {
 *     eventType: eventType,
 *     updateAddAltGrid: updateAddAltGrid,
 *     ref_participants: ref_participants,
 *     islevel: islevel,
 *     videoAlreadyOn: videoAlreadyOn,
 *     localStreamVideo: localStreamVideo,
 *     keepBackground: keepBackground,
 *     virtualStream: virtualStream,
 *     forceFullDisplay: forceFullDisplay,
 *     otherGridStreams: otherGridStreams,
 *     updateOtherGridStreams: updateOtherGridStreams,
 *     updateMiniCardsGrid: updateMiniCardsGrid,
 *     getUpdatedAllParams: getUpdatedAllParams,
 *   },
 * };
 *
 * addVideosGrid(options)
 *   .then(() => {
 *     console.log('Videos grid updated successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error updating videos grid:', error);
 *   });
 */
export declare function addVideosGrid({ mainGridStreams, altGridStreams, numtoadd, numRows, numCols, actualRows, lastrowcols, removeAltGrid, parameters, }: AddVideosGridOptions): Promise<void>;
//# sourceMappingURL=addVideosGrid.d.ts.map