import React from "react";
import MiniCard from "../components/displayComponents/MiniCard";
import VideoCard from "../components/displayComponents/VideoCard";
import AudioCard from "../components/displayComponents/AudioCard";
// import { RTCView } from "../methods/utils/webrtc/webrtc";

import {
  Participant,
  Stream,
  UpdateMiniCardsGridType,
  UpdateMiniCardsGridParameters,
  AudioCardParameters,
  EventType,
  CustomVideoCardType,
  CustomAudioCardType,
  CustomMiniCardType,
} from "../@types/types";

export interface AddVideosGridParameters
  extends UpdateMiniCardsGridParameters,
    Omit<AudioCardParameters, "getUpdatedAllParams"> {
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

  // Custom builder hooks
  customVideoCard?: CustomVideoCardType;
  customAudioCard?: CustomAudioCardType;
  customMiniCard?: CustomMiniCardType;

  // Override-provided components
  videoCardComponent?: React.ComponentType<React.ComponentProps<typeof VideoCard>>;
  audioCardComponent?: React.ComponentType<React.ComponentProps<typeof AudioCard>>;
  miniCardComponent?: React.ComponentType<React.ComponentProps<typeof MiniCard>>;

  // mediasfu functions
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

export async function addVideosGrid({
  mainGridStreams,
  altGridStreams,
  numtoadd,
  numRows,
  numCols,
  actualRows,
  lastrowcols,
  removeAltGrid,
  parameters,
}: AddVideosGridOptions): Promise<void> {
  let { getUpdatedAllParams } = parameters;
  parameters = getUpdatedAllParams();

  let {
    eventType,
    updateAddAltGrid,
    ref_participants,
    islevel,
    videoAlreadyOn,
    localStreamVideo,
    keepBackground,
    virtualStream,
    forceFullDisplay,
    otherGridStreams,
    updateOtherGridStreams,
    updateMiniCardsGrid,
    customVideoCard,
    customAudioCard,
    customMiniCard,
    videoCardComponent,
    audioCardComponent,
    miniCardComponent,
  } = parameters;

  const VideoCardComponentOverride =
    (videoCardComponent ?? VideoCard) as React.ComponentType<React.ComponentProps<typeof VideoCard>>;
  const AudioCardComponentOverride =
    (audioCardComponent ?? AudioCard) as React.ComponentType<React.ComponentProps<typeof AudioCard>>;
  const MiniCardComponentOverride =
    (miniCardComponent ?? MiniCard) as React.ComponentType<React.ComponentProps<typeof MiniCard>>;

  let newComponents: React.JSX.Element[][] = [[], []];
  let participant: any;
  let remoteProducerId: string = "";

  numtoadd = mainGridStreams.length;

  if (removeAltGrid) {
    updateAddAltGrid(false);
  }

  // Add participants to the main grid
  for (let i = 0; i < numtoadd; i++) {
    participant = mainGridStreams[i];
    remoteProducerId = participant.producerId;

    let pseudoName = !remoteProducerId || remoteProducerId === "";

    if (pseudoName) {
      remoteProducerId = participant.name;

      if (participant.audioID) {
        const audioCardComponent = customAudioCard
          ? React.createElement(customAudioCard as any, {
              key: `audio-${participant.id}`,
              name: participant.name || "",
              barColor: "red",
              textColor: "white",
              customStyle: {
                backgroundColor: "transparent",
                border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
              },
              controlsPosition: "topLeft",
              infoPosition: "topRight",
              roundedImage: true,
              parameters: parameters,
              backgroundColor: "transparent",
              showControls: eventType !== "chat",
              participant: participant,
            })
          : (
              <AudioCardComponentOverride
                key={`audio-${participant.id}`}
                name={participant.name || ""}
                barColor="red"
                textColor="white"
                customStyle={{
                  backgroundColor: "transparent",
                  border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                }}
                controlsPosition="topLeft"
                infoPosition="topRight"
                roundedImage={true}
                parameters={parameters}
                backgroundColor="transparent"
                showControls={eventType !== "chat"}
                participant={participant}
              />
            );

        newComponents[0].push(audioCardComponent);
      } else {
        const miniCardComponent = customMiniCard
          ? React.createElement(customMiniCard as any, {
              key: `mini-${participant.id}`,
              initials: participant.name,
              fontSize: 20,
              customStyle: {
                backgroundColor: "transparent",
                border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
              },
            })
          : (
              <MiniCardComponentOverride
                key={`mini-${participant.id}`}
                initials={participant.name}
                fontSize={20}
                customStyle={{
                  backgroundColor: "transparent",
                  border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                }}
              />
            );

        newComponents[0].push(miniCardComponent);
      }
    } else {
      if (remoteProducerId === "youyou" || remoteProducerId === "youyouyou") {
        let name = "You";
        if (islevel === "2" && eventType !== "chat") {
          name = "You (Host)";
        }

        if (!videoAlreadyOn) {
          const miniCardComponent = customMiniCard
            ? React.createElement(customMiniCard as any, {
                key: `mini-you`,
                initials: name,
                fontSize: 20,
                customStyle: {
                  backgroundColor: "transparent",
                  border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                },
              })
            : (
                <MiniCardComponentOverride
                  key={`mini-you`}
                  initials={name}
                  fontSize={20}
                  customStyle={{
                    backgroundColor: "transparent",
                    border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                  }}
                />
              );

          newComponents[0].push(miniCardComponent);
        } else {
          participant = {
            id: "youyouyou",
            stream:
              keepBackground && virtualStream
                ? virtualStream
                : localStreamVideo,
            name: "youyouyou",
          };

          const videoCardComponent = customVideoCard
            ? React.createElement(customVideoCard as any, {
                key: `video-you`,
                videoStream: participant.stream || new MediaStream(),
                remoteProducerId: participant.stream?.id || "",
                eventType: eventType,
                forceFullDisplay: eventType === "webinar" ? false : forceFullDisplay,
                customStyle: {
                  border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                },
                participant: participant,
                backgroundColor: "transparent",
                showControls: false,
                showInfo: false,
                name: participant.name,
                doMirror: true,
                parameters: parameters,
              })
            : (
                <VideoCardComponentOverride
                  key={`video-you`}
                  videoStream={participant.stream || new MediaStream()}
                  remoteProducerId={participant.stream?.id || ""}
                  eventType={eventType}
                  forceFullDisplay={
                    eventType === "webinar" ? false : forceFullDisplay
                  }
                  customStyle={{
                    border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                  }}
                  participant={participant}
                  backgroundColor="transparent"
                  showControls={false}
                  showInfo={false}
                  name={participant.name}
                  doMirror={true}
                  parameters={parameters}
                />
              );

          newComponents[0].push(videoCardComponent);
        }
      } else {
        const participant_ = ref_participants.find(
          (obj: Participant) => obj.videoID === remoteProducerId
        );
        if (participant_) {
          const videoCardComponent = customVideoCard
            ? React.createElement(customVideoCard as any, {
                key: `video-${participant_.id}`,
                videoStream: participant.stream || new MediaStream(),
                remoteProducerId: remoteProducerId || "",
                eventType: eventType,
                forceFullDisplay: forceFullDisplay,
                customStyle: {
                  border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                },
                participant: participant_,
                backgroundColor: "transparent",
                showControls: eventType !== "chat",
                showInfo: true,
                name: participant_.name || "",
                doMirror: false,
                parameters: parameters,
              })
            : (
                <VideoCardComponentOverride
                  key={`video-${participant_.id}`}
                  videoStream={participant.stream || new MediaStream()}
                  remoteProducerId={remoteProducerId || ""}
                  eventType={eventType}
                  forceFullDisplay={forceFullDisplay}
                  customStyle={{
                    border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                  }}
                  participant={participant_}
                  backgroundColor="transparent"
                  showControls={eventType !== "chat"}
                  showInfo={true}
                  name={participant_.name || ""}
                  doMirror={false}
                  parameters={parameters}
                />
              );

          newComponents[0].push(videoCardComponent);
        }
      }
    }

    if (i === numtoadd - 1) {
      const updatedStreams = [...otherGridStreams];
      updatedStreams[0] = newComponents[0];

      await updateMiniCardsGrid({
        rows: numRows,
        cols: numCols,
        defal: true,
        actualRows: actualRows,
        parameters,
      });

      updateOtherGridStreams(updatedStreams);
      otherGridStreams = updatedStreams;

      await updateMiniCardsGrid({
        rows: numRows,
        cols: numCols,
        defal: true,
        actualRows: actualRows,
        parameters,
      });
    }
  }

  // Handle the alternate grid streams
  if (!removeAltGrid) {
    for (let i = 0; i < altGridStreams.length; i++) {
      participant = altGridStreams[i];
      remoteProducerId = participant.producerId;

      let pseudoName = !remoteProducerId || remoteProducerId === "";

      if (pseudoName) {
        if (participant.audioID) {
          const audioCardComponent = customAudioCard
            ? React.createElement(customAudioCard as any, {
                key: `audio-alt-${participant.id}`,
                name: participant.name,
                barColor: "red",
                textColor: "white",
                customStyle: {
                  backgroundColor: "transparent",
                  border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                },
                controlsPosition: "topLeft",
                infoPosition: "topRight",
                roundedImage: true,
                parameters: parameters,
                backgroundColor: "transparent",
                showControls: eventType !== "chat",
                participant: participant,
              })
            : (
                <AudioCardComponentOverride
                  key={`audio-alt-${participant.id}`}
                  name={participant.name}
                  barColor="red"
                  textColor="white"
                  customStyle={{
                    backgroundColor: "transparent",
                    border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                  }}
                  controlsPosition="topLeft"
                  infoPosition="topRight"
                  roundedImage={true}
                  parameters={parameters}
                  backgroundColor="transparent"
                  showControls={eventType !== "chat"}
                  participant={participant}
                />
              );

          newComponents[1].push(audioCardComponent);
        } else {
          const miniCardComponent = customMiniCard
            ? React.createElement(customMiniCard as any, {
                key: `mini-alt-${participant.id}`,
                initials: participant.name,
                fontSize: 20,
                customStyle: {
                  backgroundColor: "transparent",
                  border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                },
              })
            : (
                <MiniCardComponentOverride
                  key={`mini-alt-${participant.id}`}
                  initials={participant.name}
                  fontSize={20}
                  customStyle={{
                    backgroundColor: "transparent",
                    border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                  }}
                />
              );

          newComponents[1].push(miniCardComponent);
        }
      } else {
        const participant_ = ref_participants.find(
          (obj: Participant) => obj.videoID === remoteProducerId
        );
        if (participant_) {
          const videoCardComponent = customVideoCard
            ? React.createElement(customVideoCard as any, {
                key: `video-alt-${participant_.id}`,
                videoStream: participant.stream || new MediaStream(),
                remoteProducerId: remoteProducerId || "",
                eventType: eventType,
                forceFullDisplay: forceFullDisplay,
                customStyle: {
                  border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                },
                participant: participant_,
                backgroundColor: "transparent",
                showControls: eventType !== "chat",
                showInfo: true,
                name: participant.name,
                doMirror: false,
                parameters: parameters,
              })
            : (
                <VideoCardComponentOverride
                  key={`video-alt-${participant_.id}`}
                  videoStream={participant.stream || new MediaStream()}
                  remoteProducerId={remoteProducerId || ""}
                  eventType={eventType}
                  forceFullDisplay={forceFullDisplay}
                  customStyle={{
                    border: eventType !== "broadcast" ? "2px solid black" : "0px solid black",
                  }}
                  participant={participant_}
                  backgroundColor="transparent"
                  showControls={eventType !== "chat"}
                  showInfo={true}
                  name={participant.name}
                  doMirror={false}
                  parameters={parameters}
                />
              );

          newComponents[1].push(videoCardComponent);
        }
      }

      if (i === altGridStreams.length - 1) {
        const updatedStreams = [...otherGridStreams];
        updatedStreams[1] = newComponents[1];

        await updateMiniCardsGrid({
          rows: 1,
          cols: lastrowcols,
          defal: false,
          actualRows: actualRows,
          parameters,
        });

        updateOtherGridStreams(updatedStreams);
        otherGridStreams = updatedStreams;

        await updateMiniCardsGrid({
          rows: numRows,
          cols: numCols,
          defal: true,
          actualRows: actualRows,
          parameters,
        });
      }
    }
  } else {
    updateAddAltGrid(false);
    const updatedStreams = [...otherGridStreams];
    updatedStreams[1] = [];

    await updateMiniCardsGrid({
      rows: 0,
      cols: 0,
      defal: false,
      actualRows: actualRows,
      parameters,
    });

    updateOtherGridStreams(updatedStreams);
    otherGridStreams = updatedStreams;

    await updateMiniCardsGrid({
      rows: numRows,
      cols: numCols,
      defal: true,
      actualRows: actualRows,
      parameters,
    });
  }
}
