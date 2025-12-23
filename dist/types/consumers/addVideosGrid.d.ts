import React from "react";
import MiniCard from "../components/displayComponents/MiniCard";
import VideoCard from "../components/displayComponents/VideoCard";
import AudioCard from "../components/displayComponents/AudioCard";
import { Participant, Stream, UpdateMiniCardsGridType, UpdateMiniCardsGridParameters, AudioCardParameters, EventType, CustomVideoCardType, CustomAudioCardType, CustomMiniCardType } from "../@types/types";
export interface AddVideosGridParameters extends UpdateMiniCardsGridParameters, Omit<AudioCardParameters, "getUpdatedAllParams"> {
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
    selfViewForceFull?: boolean;
    updateSelfViewForceFull?: (value: boolean) => Promise<void>;
    isDarkModeValue?: boolean;
    customVideoCard?: CustomVideoCardType;
    customAudioCard?: CustomAudioCardType;
    customMiniCard?: CustomMiniCardType;
    videoCardComponent?: React.ComponentType<React.ComponentProps<typeof VideoCard>>;
    audioCardComponent?: React.ComponentType<React.ComponentProps<typeof AudioCard>>;
    miniCardComponent?: React.ComponentType<React.ComponentProps<typeof MiniCard>>;
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
 * Adds participants to the video grid layout with support for custom participant cards
 * and override-aware rendering. This function is commonly overridden via
 * `uiOverrides.addVideosGrid` to implement AI-driven layouts or custom ordering logic.
 *
 * @param {AddVideosGridOptions} options - The options for adding videos to the grid.
 * @param {(Stream | Participant)[]} options.mainGridStreams - Participants for the main grid.
 * @param {(Stream | Participant)[]} options.altGridStreams - Participants for the alternate grid.
 * @param {number} options.numtoadd - The number of participants to add to the grid.
 * @param {number} options.numRows - The number of rows in the grid layout.
 * @param {number} options.numCols - The number of columns in the grid layout.
 * @param {number} options.actualRows - The actual number of rows currently filled in the grid.
 * @param {number} options.lastrowcols - The number of columns in the last row of the grid.
 * @param {boolean} options.removeAltGrid - Flag indicating whether to remove the alternate grid.
 * @param {AddVideosGridParameters} options.parameters - Additional parameters including custom cards, event context, and update callbacks.
 *
 * @returns {Promise<void>} Resolves when the grid update is complete.
 *
 * @example
 * // Direct usage
 * ```tsx
 * await addVideosGrid({
 *   mainGridStreams: participants,
 *   altGridStreams: [],
 *   numtoadd: 4,
 *   numRows: 2,
 *   numCols: 2,
 *   actualRows: 2,
 *   lastrowcols: 2,
 *   removeAltGrid: false,
 *   parameters: { eventType: 'conference', ...allParams },
 * });
 * ```
 *
 * @example
 * // Override via uiOverrides (custom participant ordering)
 * ```tsx
 * const uiOverrides: MediasfuUICustomOverrides = {
 *   addVideosGrid: {
 *     wrap: (original) => async (options) => {
 *       // Sort streams by speaking activity before rendering
 *       const sortedMain = options.mainGridStreams.sort((a, b) =>
 *         (b.audioLevel ?? 0) - (a.audioLevel ?? 0)
 *       );
 *       await original({ ...options, mainGridStreams: sortedMain });
 *     },
 *   },
 * };
 * ```
 *
 * @param {AddVideosGridParameters} options.parameters - Detailed parameter definitions:
 * @param {EventType} options.parameters.eventType - The type of event (e.g., 'conference', 'webinar').
 * @param {Function} options.parameters.updateAddAltGrid - Callback to update the status of the alternate grid.
 * @param {Participant[]} options.parameters.ref_participants - A reference list of all participants.
 * @param {string} options.parameters.islevel - The participation level of the user.
 * @param {boolean} options.parameters.videoAlreadyOn - Indicates if video streaming is already active.
 * @param {MediaStream | null} options.parameters.localStreamVideo - The user's local video stream.
 * @param {boolean} options.parameters.keepBackground - Flag to determine if the background should be retained.
 * @param {MediaStream | null} options.parameters.virtualStream - The virtual stream to use.
 * @param {boolean} options.parameters.forceFullDisplay - Flag to enforce full display mode.
 * @param {React.JSX.Element[][]} options.parameters.otherGridStreams - Additional streams for the grid.
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