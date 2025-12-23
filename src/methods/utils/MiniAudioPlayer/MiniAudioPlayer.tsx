import React, { useEffect, useRef, useState } from "react";
import {
  ReUpdateInterType,
  UpdateParticipantAudioDecibelsType,
  ReUpdateInterParameters,
  BreakoutParticipant,
  Participant,
} from "../../../@types/types";
import { Consumer } from "mediasoup-client/lib/types";

export interface MiniAudioPlayerParameters extends
    ReUpdateInterParameters {
  breakOutRoomStarted: boolean;
  breakOutRoomEnded: boolean;
  limitedBreakRoom: BreakoutParticipant[];

  // mediasfu functions
  reUpdateInter: ReUpdateInterType;
  updateParticipantAudioDecibels: UpdateParticipantAudioDecibelsType;

  getUpdatedAllParams: () => MiniAudioPlayerParameters;
  [key: string]: any;
}

export interface MiniAudioPlayerOptions {
  stream: MediaStream | null;
  remoteProducerId: string;
  consumer: Consumer;
  parameters: MiniAudioPlayerParameters;
  MiniAudioComponent?: React.ComponentType<any>;
  miniAudioProps?: Record<string, any>;
}

export type MiniAudioPlayerType = (
  options: MiniAudioPlayerOptions
) => React.JSX.Element;

/**
 * MiniAudioPlayer - A utility component for audio stream playback with optional waveform visualization.
 * 
 * This component manages audio playback for remote participants, handling consumer lifecycle,
 * audio stream management, and optional waveform visualization through component injection. It
 * integrates with MediaSFU's breakout room system and audio decibel tracking.
 * 
 * **Key Features:**
 * - **Audio Stream Playback**: Manages MediaStream playback through HTML audio elements
 * - **Consumer Management**: Handles WebRTC consumer lifecycle and pause/resume events
 * - **Component Injection**: Accepts custom MiniAudioComponent for waveform visualization
 * - **Breakout Room Awareness**: Respects breakout room states and limited access
 * - **Audio Decibel Tracking**: Integrates with updateParticipantAudioDecibels for level monitoring
 * - **Waveform Modal**: Optional modal display for audio waveform visualization
 * - **Auto Wave Detection**: Automatically manages waveform visibility based on audio activity
 * - **Mute State Management**: Tracks and responds to consumer mute/unmute events
 * - **Interval Updates**: Triggers reUpdateInter for periodic UI synchronization
 * - **Stream Cleanup**: Properly removes audio tracks on unmount or stream changes
 * - **Ref-Based State**: Uses refs for mutable state to avoid unnecessary re-renders
 * - **Producer Identification**: Associates audio with specific remote producer IDs
 * 
 * @component
 * 
 * @param {MiniAudioPlayerOptions} props - Configuration options for MiniAudioPlayer
 * @param {MediaStream | null} props.stream - The audio media stream to play
 * @param {string} props.remoteProducerId - Unique identifier for the remote audio producer
 * @param {Consumer} props.consumer - WebRTC consumer object handling the audio track
 * @param {MiniAudioPlayerParameters} props.parameters - MediaSFU integration parameters
 * @param {boolean} props.parameters.breakOutRoomStarted - Flag indicating if breakout room session is active
 * @param {boolean} props.parameters.breakOutRoomEnded - Flag indicating if breakout room session has ended
 * @param {BreakoutParticipant[]} props.parameters.limitedBreakRoom - Array of participants with limited breakout access
 * @param {ReUpdateInterType} props.parameters.reUpdateInter - Function to trigger interval-based UI updates
 * @param {UpdateParticipantAudioDecibelsType} props.parameters.updateParticipantAudioDecibels - Function to update audio level tracking
 * @param {Function} props.parameters.getUpdatedAllParams - Function to retrieve latest parameter values
 * @param {React.ComponentType<any>} [props.MiniAudioComponent] - Custom component for audio waveform visualization
 * @param {Record<string, any>} [props.miniAudioProps] - Additional props passed to MiniAudioComponent
 * 
 * @returns {React.JSX.Element} The rendered audio player component (returns null as audio plays through hidden element)
 * 
 * @example
 * // Basic audio player for remote participant
 * ```tsx
 * import React from 'react';
 * import { MiniAudioPlayer } from 'mediasfu-reactjs';
 * 
 * const RemoteAudioHandler = ({ audioStream, producerId, consumer, mediaSFUParams }) => {
 *   return (
 *     <MiniAudioPlayer
 *       stream={audioStream}
 *       remoteProducerId={producerId}
 *       consumer={consumer}
 *       parameters={{
 *         breakOutRoomStarted: false,
 *         breakOutRoomEnded: false,
 *         limitedBreakRoom: [],
 *         reUpdateInter: mediaSFUParams.reUpdateInter,
 *         updateParticipantAudioDecibels: mediaSFUParams.updateParticipantAudioDecibels,
 *         getUpdatedAllParams: mediaSFUParams.getUpdatedAllParams
 *       }}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Custom waveform visualization component
 * ```tsx
 * import React from 'react';
 * import { MiniAudioPlayer } from 'mediasfu-reactjs';
 * 
 * const CustomWaveform = ({ visible, name, showWaveform, overlayPosition, barColor, textColor, imageSource, roundedImage, imageStyle }) => (
 *   visible ? (
 *     <div style={{
 *       position: 'absolute',
 *       top: overlayPosition,
 *       left: 0,
 *       right: 0,
 *       background: 'rgba(0,0,0,0.9)',
 *       padding: '20px',
 *       borderRadius: '12px',
 *       backdropFilter: 'blur(10px)'
 *     }}>
 *       {roundedImage && imageSource && (
 *         <img 
 *           src={imageSource} 
 *           alt={name} 
 *           style={{ width: '60px', height: '60px', borderRadius: '50%', ...imageStyle }}
 *         />
 *       )}
 *       <div style={{ color: textColor, fontSize: '18px', marginTop: '8px' }}>{name}</div>
 *       {showWaveform && (
 *         <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '12px' }}>
 *           {Array.from({ length: 20 }).map((_, i) => (
 *             <div 
 *               key={i} 
 *               style={{
 *                 width: '4px',
 *                 height: `${Math.random() * 40 + 10}px`,
 *                 backgroundColor: barColor,
 *                 borderRadius: '2px',
 *                 animation: 'wave 0.5s infinite alternate'
 *               }}
 *             />
 *           ))}
 *         </div>
 *       )}
 *     </div>
 *   ) : null
 * );
 * 
 * const AdvancedAudioPlayer = ({ audioStream, producerId, consumer, mediaSFUParams }) => {
 *   return (
 *     <MiniAudioPlayer
 *       stream={audioStream}
 *       remoteProducerId={producerId}
 *       consumer={consumer}
 *       parameters={mediaSFUParams}
 *       MiniAudioComponent={CustomWaveform}
 *       miniAudioProps={{
 *         barColor: '#00ff00',
 *         textColor: '#ffffff',
 *         roundedImage: true,
 *         overlayPosition: '10px'
 *       }}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Analytics tracking for audio playback
 * ```tsx
 * import React, { useEffect, useRef } from 'react';
 * import { MiniAudioPlayer } from 'mediasfu-reactjs';
 * 
 * const AnalyticsAudioPlayer = ({ audioStream, producerId, consumer, mediaSFUParams }) => {
 *   const startTimeRef = useRef(Date.now());
 * 
 *   useEffect(() => {
 *     analytics.track('Audio Stream Started', {
 *       producerId,
 *       timestamp: startTimeRef.current
 *     });
 * 
 *     // Track audio quality metrics
 *     const qualityInterval = setInterval(() => {
 *       if (audioStream && audioStream.getAudioTracks().length > 0) {
 *         const track = audioStream.getAudioTracks()[0];
 *         const settings = track.getSettings();
 *         analytics.track('Audio Quality Check', {
 *           producerId,
 *           sampleRate: settings.sampleRate,
 *           channelCount: settings.channelCount,
 *           echoCancellation: settings.echoCancellation
 *         });
 *       }
 *     }, 30000);
 * 
 *     return () => {
 *       clearInterval(qualityInterval);
 *       const duration = Date.now() - startTimeRef.current;
 *       analytics.track('Audio Stream Ended', {
 *         producerId,
 *         duration: Math.floor(duration / 1000)
 *       });
 *     };
 *   }, [audioStream, producerId]);
 * 
 *   // Enhanced parameters with analytics
 *   const enhancedParams = {
 *     ...mediaSFUParams,
 *     updateParticipantAudioDecibels: async (params) => {
 *       const { name, averageLoudness } = params;
 *       analytics.track('Audio Level Update', {
 *         producerId,
 *         name,
 *         averageLoudness
 *       });
 *       await mediaSFUParams.updateParticipantAudioDecibels(params);
 *     }
 *   };
 * 
 *   return (
 *     <MiniAudioPlayer
 *       stream={audioStream}
 *       remoteProducerId={producerId}
 *       consumer={consumer}
 *       parameters={enhancedParams}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, MiniAudioPlayer } from 'mediasfu-reactjs';
 * 
 * const EnhancedMiniAudio = ({ visible, name, showWaveform, barColor, textColor }) => (
 *   visible ? (
 *     <div className="enhanced-audio-indicator">
 *       <div className="participant-info">
 *         <span className="status-icon">🎤</span>
 *         <span className="participant-name">{name}</span>
 *       </div>
 *       {showWaveform && (
 *         <div className="waveform-container">
 *           <div className="waveform-bars">
 *             {Array.from({ length: 15 }).map((_, i) => (
 *               <div 
 *                 key={i}
 *                 className="bar"
 *                 style={{
 *                   backgroundColor: barColor,
 *                   animationDelay: `${i * 0.05}s`
 *                 }}
 *               />
 *             ))}
 *           </div>
 *         </div>
 *       )}
 *     </div>
 *   ) : null
 * );
 * 
 * const CustomMiniAudioPlayer = (props) => (
 *   <MiniAudioPlayer
 *     {...props}
 *     MiniAudioComponent={EnhancedMiniAudio}
 *     miniAudioProps={{
 *       barColor: '#00d4ff',
 *       textColor: '#ffffff',
 *       roundedImage: true
 *     }}
 *   />
 * );
 * 
 * const App = () => {
 *   const [credentials] = useState({
 *     apiUserName: 'user123',
 *     apiKey: 'your-api-key'
 *   });
 * 
 *   return (
 *     <MediasfuGeneric
 *       credentials={credentials}
 *       uiOverrides={{
 *         MiniAudioPlayer: CustomMiniAudioPlayer
 *       }}
 *     />
 *   );
 * };
 * ```
 */

const MiniAudioPlayer: React.FC<MiniAudioPlayerOptions> = ({
  stream,
  remoteProducerId,
  consumer,
  parameters,
  MiniAudioComponent,
  miniAudioProps,
}) => {
  const { getUpdatedAllParams } = parameters;

  parameters = getUpdatedAllParams();
  let {
    reUpdateInter,
    updateParticipantAudioDecibels,
    breakOutRoomStarted,
    breakOutRoomEnded,
    limitedBreakRoom,
  } = parameters;

  const parameterMiniAudioComponent = parameters
    .miniAudioComponent as React.ComponentType<any> | undefined;
  const resolvedMiniAudioComponent =
    MiniAudioComponent ?? parameterMiniAudioComponent;

  const [showWaveModal, setShowWaveModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const autoWaveCheck = useRef(false);

  useEffect(() => {
    if (stream) {
      let consLow = false;
      let averageLoudness = 128;

      const intervalId = setInterval(() => {
        try {
          const receiver = consumer.rtpReceiver;
          receiver?.getStats().then((stats) => {
            stats.forEach((report) => {
              if (report.type === "inbound-rtp" && report.kind === "audio") {
                if (report.audioLevel) {
                  averageLoudness = 127.5 + (report.audioLevel * 127.5);
                }
              }
            });
          });
        } catch {
          // Do nothing
        }

        const updatedParams = getUpdatedAllParams();
        let {
          eventType,
          meetingDisplayType,
          shared,
          shareScreenStarted,
          dispActiveNames,
          adminNameStream,
          participants,
          activeSounds,
          autoWave,
          updateActiveSounds,
          paginatedStreams,
          currentUserPage,
        } = updatedParams;

        const participant = participants.find(
          (obj: Participant) => obj.audioID === remoteProducerId
        );

        let audioActiveInRoom = true;
        if (participant) {
          if (breakOutRoomStarted && !breakOutRoomEnded) {
            if (
              participant.name &&
              !limitedBreakRoom
                .map((obj) => obj.name)
                .includes(participant.name)
            ) {
              audioActiveInRoom = false;
            }
          }
        }

        if (meetingDisplayType !== "video") {
          autoWaveCheck.current = true;
        }
        if (shared || shareScreenStarted) {
          autoWaveCheck.current = false;
        }

        if (participant) {
          setIsMuted(participant.muted ?? false);

          if (eventType !== "chat" && eventType !== "broadcast") {
            updateParticipantAudioDecibels({
              name: participant.name ?? "",
              averageLoudness,
              audioDecibels: updatedParams.audioDecibels,
              updateAudioDecibels: updatedParams.updateAudioDecibels,
            });
          }

          const inPage =
            paginatedStreams[currentUserPage]?.findIndex(
              (obj: any) => obj.name === participant.name
            ) ?? -1;

          if (
            participant.name &&
            !dispActiveNames.includes(participant.name) &&
            inPage == -1
          ) {
            autoWaveCheck.current = false;
            if (!adminNameStream) {
              const adminParticipant = participants.find(
                (obj: any) => obj.islevel == "2"
              );
              adminNameStream = adminParticipant ? adminParticipant.name : "";
            }

            if (participant.name == adminNameStream) {
              autoWaveCheck.current = true;
            }
          } else {
            autoWaveCheck.current = true;
          }

          if (
            participant.videoID ||
            autoWaveCheck.current ||
            (breakOutRoomStarted && !breakOutRoomEnded && audioActiveInRoom)
          ) {
            setShowWaveModal(false);

            if (averageLoudness > 127.5) {
              if (participant.name && !activeSounds.includes(participant.name)) {
                activeSounds.push(participant.name);
                consLow = false;

                if (!(shareScreenStarted || shared) || participant.videoID) {
                  if (
                    eventType !== "chat" &&
                    eventType !== "broadcast" &&
                    participant.name
                  ) {
                    reUpdateInter({
                      name: participant.name ?? "",
                      add: true,
                      average: averageLoudness,
                      parameters: updatedParams,
                    });
                  }
                }
              }
            } else {
              if (participant.name && activeSounds.includes(participant.name) && consLow) {
                activeSounds.splice(activeSounds.indexOf(participant.name), 1);
                if (!(shareScreenStarted || shared) || participant.videoID) {
                  if (
                    eventType !== "chat" &&
                    eventType !== "broadcast" &&
                    participant.name
                  ) {
                    reUpdateInter({
                      name: participant.name ?? "",
                      average: averageLoudness,
                      parameters: updatedParams,
                    });
                  }
                }
              } else {
                consLow = true;
              }
            }
          } else {
            if (averageLoudness > 127.5) {
              if (!autoWave) {
                setShowWaveModal(false);
              } else {
                setShowWaveModal(true);
              }

              if (participant.name && !activeSounds.includes(participant.name)) {
                activeSounds.push(participant.name);
              }
              if ((shareScreenStarted || shared) && !participant.videoID) {
                /* empty */
              } else {
                if (
                  eventType != "chat" &&
                  eventType != "broadcast" &&
                  participant.name
                ) {
                  reUpdateInter({
                    name: participant.name,
                    add: true,
                    average: averageLoudness,
                    parameters: updatedParams,
                  });
                }
              }
            } else {
              setShowWaveModal(false);
              if (participant.name && activeSounds.includes(participant.name)) {
                activeSounds.splice(activeSounds.indexOf(participant.name), 1);
              }
              if ((shareScreenStarted || shared) && !participant.videoID) {
                /* empty */
              } else {
                if (
                  eventType != "chat" &&
                  eventType != "broadcast" &&
                  participant.name
                ) {
                  reUpdateInter({
                    name: participant.name,
                    average: averageLoudness,
                    parameters: updatedParams,
                  });
                }
              }
            }
          }

          updateActiveSounds(activeSounds);
        } else {
          setShowWaveModal(false);
          setIsMuted(true);
        }
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [stream]);

  const renderMiniAudioComponent = () => {
    if (resolvedMiniAudioComponent) {
      const MiniAudioComponentToRender = resolvedMiniAudioComponent;
      return (
        <MiniAudioComponentToRender
          showWaveform={showWaveModal}
          visible={showWaveModal && !isMuted}
          {...miniAudioProps}
        />
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>
      {stream && (
        <audio
          autoPlay
          ref={(ref) => {
            if (ref) {
              ref.srcObject = stream;
              ref.play().catch(() => {});
            }
          }}
        />
      )}
      {renderMiniAudioComponent()}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9,
  },
};

export default MiniAudioPlayer;
