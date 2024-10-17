
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

export type VideoCardType = (options: VideoCardOptions) => JSX.Element;  // Define the type for the function

/**
 * VideoCard component displays a video stream with optional controls and information.
 * It also includes an animated waveform based on audio decibels.
 *
 * @component
 * @param {object} props - The properties object.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles for the card.
 * @param {string} props.name - The name of the participant.
 * @param {string} [props.barColor="red"] - The color of the waveform bars.
 * @param {string} [props.textColor="white"] - The color of the text.
 * @param {string} props.remoteProducerId - The ID of the remote producer.
 * @param {string} props.eventType - The type of event.
 * @param {boolean} props.forceFullDisplay - Whether to force full display of the video.
 * @param {MediaStream} props.videoStream - The video stream to display.
 * @param {boolean} [props.showControls=true] - Whether to show video controls.
 * @param {boolean} [props.showInfo=true] - Whether to show participant information.
 * @param {React.ReactNode} [props.videoInfoComponent] - Custom component for video information.
 * @param {React.ReactNode} [props.videoControlsComponent] - Custom component for video controls.
 * @param {string} [props.controlsPosition="topLeft"] - Position of the controls overlay.
 * @param {string} [props.infoPosition="topRight"] - Position of the information overlay.
 * @param {object} props.participant - The participant object.
 * @param {string} props.backgroundColor - Background color of the card.
 * @param {Array} props.audioDecibels - Array of audio decibel levels.
 * @param {boolean} props.doMirror - Whether to mirror the video.
 * @param {object} props.parameters - Additional parameters for the component.
 *
 * @returns {JSX.Element} The rendered VideoCard component.
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
