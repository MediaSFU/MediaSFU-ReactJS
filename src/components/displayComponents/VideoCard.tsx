
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { controlMedia } from "../../consumers/controlMedia";
import { getOverlayPosition } from "../../methods/utils/getOverlayPosition";
import CardVideoDisplay from "./CardVideoDisplay";
import { EventType } from '../../@types/types';

export interface VideoCardParameters {
  socket: Socket;
  roomName: string;
  coHostResponsibility: CoHostResponsibility[];
  showAlert?: ShowAlert;
  coHost: string;
  participants: Participant[];
  member: string;
  islevel: string;
  audioDecibels: AudioDecibels[];

  // mediasfu functions
  getUpdatedAllParams: () => VideoCardParameters;
  [key: string]: any;
}

export interface VideoCardOptions {
  customStyle?: React.CSSProperties;
  name: string;
  barColor?: string;
  textColor?: string;
  imageSource?: string;
  roundedImage?: boolean;
  imageStyle?: React.CSSProperties;
  remoteProducerId: string;
  eventType: EventType;
  forceFullDisplay: boolean;
  videoStream: MediaStream | null;
  showControls?: boolean;
  showInfo?: boolean;
  videoInfoComponent?: React.ReactNode;
  videoControlsComponent?: React.ReactNode;
  controlsPosition?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  infoPosition?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  participant: Participant;
  backgroundColor?: string;
  audioDecibels?: AudioDecibels[];
  doMirror?: boolean;
  parameters: VideoCardParameters;
}

export type VideoCardType = (options: VideoCardOptions) => React.JSX.Element;  // Define the type for the function

/**
 * VideoCard component displays a video with optional control buttons, participant information, and an animated waveform.
 * 
 * @component
 * @param {VideoCardOptions} props - The properties for the VideoCard component.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles for the card.
 * @param {string} props.name - Name of the participant.
 * @param {string} [props.barColor="red"] - Waveform bar color.
 * @param {string} [props.textColor="white"] - Text color for participant name.
 * @param {string} props.remoteProducerId - ID for the remote video producer.
 * @param {EventType} props.eventType - Event type for the video.
 * @param {boolean} props.forceFullDisplay - Flag to force full display of the video.
 * @param {MediaStream} props.videoStream - Video stream for display.
 * @param {boolean} [props.showControls=true] - Flag to display control buttons.
 * @param {boolean} [props.showInfo=true] - Flag to display participant information.
 * @param {React.ReactNode} [props.videoInfoComponent] - Custom video information component.
 * @param {React.ReactNode} [props.videoControlsComponent] - Custom video controls component.
 * @param {string} [props.controlsPosition="topLeft"] - Position of the control buttons overlay.
 * @param {string} [props.infoPosition="topRight"] - Position of the information overlay.
 * @param {Participant} props.participant - Participant details.
 * @param {string} props.backgroundColor - Background color of the video card.
 * @param {Array<AudioDecibels>} props.audioDecibels - Audio decibel data for the waveform.
 * @param {boolean} [props.doMirror=false] - Flag to mirror the video.
 * @param {VideoCardParameters} props.parameters - Additional parameters for video card settings.
 *
 * @returns {React.JSX.Element} The rendered VideoCard component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { VideoCard } from 'mediasfu-reactjs';
 * 
 * function App() {
 *   return (
 *     <VideoCard
 *       customStyle={{ border: '1px solid black' }}
 *       name="John Doe"
 *       barColor="blue"
 *       textColor="yellow"
 *       remoteProducerId="12345"
 *       eventType="video"
 *       forceFullDisplay={true}
 *       videoStream={mediaStream}
 *       showControls={true}
 *       showInfo={true}
 *       controlsPosition="topLeft"
 *       infoPosition="topRight"
 *       participant={participant}
 *       backgroundColor="black"
 *       audioDecibels={audioDecibels}
 *       doMirror={true}
 *       parameters={parameters}
 *     />
 *   );
 * }
 * 
 * 
 * export default App;
 * ```
 */


const VideoCard: React.FC<VideoCardOptions> = ({
  customStyle,
  name,
  barColor = "red",
  textColor = "white",
  remoteProducerId,
  eventType,
  forceFullDisplay,
  videoStream,
  showControls = true,
  showInfo = true,
  videoInfoComponent,
  videoControlsComponent,
  controlsPosition = "topLeft",
  infoPosition = "topRight",
  participant,
  backgroundColor,
  audioDecibels,
  doMirror,
  parameters,
}) => {
  const [waveformAnimations, setWaveformAnimations] = useState<number[]>(
    Array.from({ length: 9 }, () => 0)
  );
  const [showWaveform, setShowWaveform] = useState<boolean>(true);

  const animateWaveform = () => {
    const animations = waveformAnimations.map((_, index) =>
      window.setInterval(
        () => animateBar(index),
        getAnimationDuration(index) * 2
      )
    );
    setWaveformAnimations(animations);
  };

  const animateBar = (index: number) => {
    setWaveformAnimations((prevAnimations) => {
      const newAnimations = [...prevAnimations];
      newAnimations[index] = 1;
      return newAnimations;
    });

    setTimeout(() => {
      setWaveformAnimations((prevAnimations) => {
        const newAnimations = [...prevAnimations];
        newAnimations[index] = 0;
        return newAnimations;
      });
    }, getAnimationDuration(index));
  };

  const resetWaveform = () => {
    setWaveformAnimations(Array.from({ length: 9 }, () => 0));
  };

  const getAnimationDuration = (index: number): number => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 0;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const { getUpdatedAllParams } = parameters;
      const updatedParams = getUpdatedAllParams();
      const { audioDecibels, participants } = updatedParams;

      const existingEntry =
        audioDecibels &&
        audioDecibels.find((entry: AudioDecibels) => entry.name === name);
      const participantEntry =
        participants && participants.find((p: Participant) => p.name === name);

      if (
        existingEntry &&
        existingEntry.averageLoudness > 127.5 &&
        participantEntry &&
        !participantEntry.muted
      ) {
        animateWaveform();
      } else {
        resetWaveform();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [audioDecibels, name, parameters]);

  useEffect(() => {
    if (participant?.muted) {
      setShowWaveform(false);
    } else {
      setShowWaveform(true);
    }
  }, [participant?.muted]);

  const toggleAudio = async () => {
    if (!participant?.muted) {
      const { getUpdatedAllParams } = parameters;
      const updatedParams = getUpdatedAllParams();
      await controlMedia({
        participantId: participant.id || "",
        participantName: participant.name,
        type: "audio",
        socket: updatedParams.socket,
        roomName: updatedParams.roomName,
        coHostResponsibility: updatedParams.coHostResponsibility,
        showAlert: updatedParams.showAlert,
        coHost: updatedParams.coHost,
        participants: updatedParams.participants,
        member: updatedParams.member,
        islevel: updatedParams.islevel,
      });
    }
  };

  const toggleVideo = async () => {
    if (participant?.videoOn) {
      const { getUpdatedAllParams } = parameters;
      const updatedParams = getUpdatedAllParams();
      await controlMedia({
        participantId: participant.id || "",
        participantName: participant.name,
        type: "video",
        socket: updatedParams.socket,
        roomName: updatedParams.roomName,
        coHostResponsibility: updatedParams.coHostResponsibility,
        showAlert: updatedParams.showAlert,
        coHost: updatedParams.coHost,
        participants: updatedParams.participants,
        member: updatedParams.member,
        islevel: updatedParams.islevel,
      });
    }
  };

  const renderControls = () => {
    if (!showControls) return null;

    const ControlsComponent = videoControlsComponent || (
      <div style={styles.overlayControls}>
        <button style={styles.controlButton} onClick={toggleAudio}>
          <FontAwesomeIcon
            icon={participant?.muted ? faMicrophoneSlash : faMicrophone}
            size={"sm"}
            color={participant?.muted ? "red" : "green"}
          />
        </button>
        <button style={styles.controlButton} onClick={toggleVideo}>
          <FontAwesomeIcon
            icon={participant?.videoOn ? faVideo : faVideoSlash}
            size={"sm"}
            color={participant?.videoOn ? "green" : "red"}
          />
        </button>
      </div>
    );

    return ControlsComponent;
  };

  return (
    <div style={{ ...styles.card, ...customStyle, backgroundColor }}>
      <CardVideoDisplay
        remoteProducerId={remoteProducerId}
        eventType={eventType}
        forceFullDisplay={forceFullDisplay}
        videoStream={videoStream}
        backgroundColor={backgroundColor}
        doMirror={doMirror}
      />

      {videoInfoComponent ||
        (showInfo && (
          <div
            style={{
              ...getOverlayPosition({ position: infoPosition }),
              ...(showControls ? styles.overlayWeb : styles.overlayWebAlt),
            }}
          >
            <div style={styles.nameColumn}>
              <span style={{ ...styles.nameText, color: textColor }}>
                {participant?.name}
              </span>
            </div>
            {showWaveform && (
              <div style={styles.waveformWeb}>
                {waveformAnimations.map((animation, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.bar,
                      height: animation === 0 ? 1 : 16,
                      backgroundColor: barColor,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

      {videoControlsComponent ||
        (showControls && (
          <div
            style={{
              ...styles.overlayControls,
              ...getOverlayPosition({ position: controlsPosition }),
            }}
          >
            {renderControls()}
          </div>
        ))}
    </div>
  );
};

import { CSSProperties } from "react";
import {
  AudioDecibels,
  CoHostResponsibility,
  Participant,
  ShowAlert,
} from "../../@types/types";
import { Socket } from "socket.io-client";

const styles: { [key: string]: CSSProperties } = {
  card: {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    backgroundColor: "#2c678f",
    position: "relative",
  },
  overlayWeb: {
    position: "absolute",
    minWidth: "40%",
    minHeight: "5%",
    maxHeight: "100%",
    display: "grid",
    gridTemplateColumns: "4fr 2fr",
    gridGap: "3px",
  },
  overlayWebAlt: {
    position: "absolute",
    minWidth: "50%",
    minHeight: "5%",
    maxHeight: "100%",
    display: "grid",
    gridTemplateColumns: "4fr",
    gridGap: "0px",
    top: 0,
    right: 0,
  },
  overlayControls: {
    display: "flex",
    flexDirection: "row",
    padding: 0,
    position: "absolute",
    top: 0,
    left: 0,
  },
  controlButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: "2px 4px",
    marginRight: "2px",
    fontSize: "medium",
    border: "none",
    cursor: "pointer",
  },
  nameColumn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "5px",
    marginRight: "2px",
    fontSize: "small",
    textAlign: "center",
  },
  nameText: {
    fontSize: "small",
    fontWeight: "bolder",
  },
  waveformWeb: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: 0,
    flexDirection: "row",
  },
  waveformMobile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: "5px",
    marginLeft: "5px",
    maxWidth: "25%",
  },
  bar: {
    flex: 1,
    opacity: 0.35,
    margin: "0 1px",
    transition: "height 0.5s ease",
  },
};

export default VideoCard;
