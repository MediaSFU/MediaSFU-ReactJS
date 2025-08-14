
import React, { useState, useEffect, CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faVideoSlash,
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { getOverlayPosition } from "../../methods/utils/getOverlayPosition";
import MiniCard from "./MiniCard";
import { controlMedia } from "../../consumers/controlMedia";
import { ControlsPosition, InfoPosition, Participant, ControlMediaOptions, AudioDecibels, CoHostResponsibility, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";

export interface AudioCardParameters {
  audioDecibels: AudioDecibels[];
  participants: Participant[];
  socket: Socket;
  coHostResponsibility: CoHostResponsibility[];
  roomName: string;
  showAlert?: ShowAlert;
  coHost: string;
  islevel: string;
  member: string;
  eventType: string;
  
  // mediasfu functions
  getUpdatedAllParams(): AudioCardParameters;
}

export interface AudioCardOptions {
  controlUserMedia?: (options: ControlMediaOptions) => Promise<void>;
  customStyle?: React.CSSProperties;
  name: string;
  barColor?: string;
  textColor?: string;
  imageSource?: string;
  roundedImage?: boolean;
  imageStyle?: React.CSSProperties;
  showControls?: boolean;
  showInfo?: boolean;
  videoInfoComponent?: React.ReactNode;
  videoControlsComponent?: React.ReactNode;
  controlsPosition?: ControlsPosition;
  infoPosition?: InfoPosition;
  participant: Participant;
  backgroundColor?: string;
  audioDecibels?: AudioDecibels;
  parameters: AudioCardParameters;
}

export type AudioCardType = (options: AudioCardOptions) => React.JSX.Element;

/**
 * AudioCard component displays an audio card with various controls, participant information, and a visual waveform.
 * 
 * This component renders an interactive card with customizable styles, an image, and control buttons for audio and video functionality. The waveform reacts to audio levels, and the component manages real-time states through parameters like `audioDecibels`, `participant` information, and `coHost` responsibilities.
 * 
 * @component
 * @param {AudioCardOptions} props - The properties for the AudioCard component.
 * @param {Function} [props.controlUserMedia=controlMedia] - Function to control user media actions.
 * @param {React.CSSProperties} [props.customStyle] - Optional custom styles for the card.
 * @param {string} props.name - The name of the participant displayed on the card.
 * @param {string} [props.barColor="red"] - Color of the waveform bars representing audio levels.
 * @param {string} [props.textColor="white"] - Text color for participant details.
 * @param {string} [props.imageSource] - Source URL for the participant’s image.
 * @param {boolean} [props.roundedImage=false] - Whether to round the participant’s image.
 * @param {React.CSSProperties} [props.imageStyle] - Optional styles for the image.
 * @param {boolean} [props.showControls=true] - Flag to show control buttons for media.
 * @param {boolean} [props.showInfo=true] - Flag to display participant information.
 * @param {React.ReactNode} [props.videoInfoComponent] - Custom component for showing video information.
 * @param {React.ReactNode} [props.videoControlsComponent] - Custom component for media controls.
 * @param {ControlsPosition} [props.controlsPosition="topLeft"] - Position of the control buttons.
 * @param {InfoPosition} [props.infoPosition="topRight"] - Position of participant information.
 * @param {Participant} props.participant - The participant object with relevant details.
 * @param {string} [props.backgroundColor] - Background color of the card.
 * @param {AudioDecibels} [props.audioDecibels] - Audio decibel levels for waveform display.
 * @param {AudioCardParameters} props.parameters - Parameters object with various settings and states for the card.
 * 
 * @returns {React.JSX.Element} The rendered AudioCard component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { AudioCard } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const participant = { name: "John Doe", id: "123", muted: false, videoOn: true };
 *   const parameters = {
 *     audioDecibels: [{ name: "John Doe", averageLoudness: 128 }],
 *     participants: [participant],
 *     socket: {}, // Add actual socket instance here
 *     coHostResponsibility: [],
 *     roomName: "Main Room",
 *     coHost: "Host123",
 *     islevel: "1",
 *     member: "member",
 *     eventType: "meeting",
 *     getUpdatedAllParams: () => parameters,
 *   };
 *
 *   return (
 *     <AudioCard
 *       name="John Doe"
 *       participant={participant}
 *       parameters={parameters}
 *       audioDecibels={parameters.audioDecibels[0]}
 *       showControls={true}
 *       showInfo={true}
 *       controlsPosition="topLeft"
 *       infoPosition="topRight"
 *       backgroundColor="black"
 *       barColor="red"
 *       textColor="white"
 *       imageSource="https://example.com/image.jpg"
 *       roundedImage={true}
 *       imageStyle={{ width: "100px", height: "100px" }}
 *       customStyle={{ width: "200px", height: "200px" }}
 *       controlUserMedia={() => console.log("Control media invoked")}
 *       videoInfoComponent={<CustomVideoInfoComponent />}
 *       videoControlsComponent={<CustomVideoControlsComponent />}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */


const AudioCard: React.FC<AudioCardOptions> = ({
  controlUserMedia = controlMedia,
  customStyle,
  name,
  barColor = "red",
  textColor = "white",
  imageSource,
  roundedImage = false,
  imageStyle,
  showControls = true,
  showInfo = true,
  videoInfoComponent,
  videoControlsComponent,
  controlsPosition = "topLeft",
  infoPosition = "topRight",
  participant,
  backgroundColor,
  audioDecibels,
  parameters,
}) => {
  const [waveformAnimations, setWaveformAnimations] = useState<number[]>(
    Array.from({ length: 9 }, () => 0)
  );
  const [showWaveform, setShowWaveform] = useState(true);
  parameters = parameters.getUpdatedAllParams();


  useEffect(() => {
    const interval = setInterval(() => {
      const { audioDecibels, participants } = parameters;
      const existingEntry =
        audioDecibels && audioDecibels.find((entry: AudioDecibels) => entry.name === name);
      const updatedParticipant =
        participants && participants.find((p: Participant) => p.name === name);

      if (
        existingEntry &&
        existingEntry.averageLoudness > 127.5 &&
        updatedParticipant &&
        !updatedParticipant.muted
      ) {
        animateWaveform();
      } else {
        resetWaveform();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [audioDecibels]);

  useEffect(() => {
    if (participant?.muted) {
      setShowWaveform(false);
    } else {
      setShowWaveform(true);
    }
  }, [participant?.muted]);

  useEffect(() => {
    if (showWaveform) {
      const animationInterval = setInterval(animateWaveform, 1000);
      return () => clearInterval(animationInterval);
    }
  }, [showWaveform]);

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

  const animateWaveform = () => {
    waveformAnimations.forEach((_, index) => {
      setInterval(() => animateBar(index), getAnimationDuration(index) * 2);
    });
  };

  const resetWaveform = () => {
    setWaveformAnimations(Array.from({ length: 9 }, () => 0));
  };

  const getAnimationDuration = (index: number): number => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 0;
  };

  const toggleAudio = async () => {
    if (!participant?.muted) {
      parameters = parameters.getUpdatedAllParams();
      await controlUserMedia({
        participantId: participant.id || "",
        participantName: participant.name,
        type: "audio",
        socket: parameters.socket,
        coHostResponsibility: parameters.coHostResponsibility,
        roomName: parameters.roomName,
        showAlert: parameters.showAlert,
        coHost: parameters.coHost,
        islevel: parameters.islevel,
        member: parameters.member,
        participants: parameters.participants,
      });
    }
  };

  const toggleVideo = async () => {
    if (participant?.videoOn) {
      parameters = parameters.getUpdatedAllParams();
      await controlUserMedia({
        participantId: participant.id || "",
        participantName: participant.name,
        type: "video",
        socket: parameters.socket,
        coHostResponsibility: parameters.coHostResponsibility,
        roomName: parameters.roomName,
        showAlert: parameters.showAlert,
        coHost: parameters.coHost,
        islevel: parameters.islevel,
        member: parameters.member,
        participants: parameters.participants,
      });
    }
  };

  const renderControls = () => {
    if (!showControls) {
      return null;
    }

    return videoControlsComponent || (
      <div style={styles.overlayControls}>
        <button style={styles.controlButton} onClick={toggleAudio}>
          <FontAwesomeIcon
            icon={participant?.muted ? faMicrophoneSlash : faMicrophone}
            size="sm"
            color={participant?.muted ? "red" : "green"}
          />
        </button>
        <button style={styles.controlButton} onClick={toggleVideo}>
          <FontAwesomeIcon
            icon={participant?.videoOn ? faVideo : faVideoSlash}
            size="sm"
            color={participant?.videoOn ? "green" : "red"}
          />
        </button>
      </div>
    );
  };

  return (
    <div
      style={{
        ...styles.card,
        ...customStyle,
        backgroundColor: backgroundColor,
      }}
    >
      {imageSource ? (
        <div style={styles.imageContainer}>
          <img
            src={imageSource}
            alt="Participant"
            style={{
              ...imageStyle,
              borderRadius: roundedImage ? "20%" : "0",
              ...styles.backgroundImage,
            }}
          />
        </div>
      ) : (
        <MiniCard initials={name} fontSize={20} customStyle={{
          border: parameters.eventType !== 'broadcast' ? '2px solid black' : '0px solid black',
        }} />
      )}

      {videoInfoComponent ? (
        videoInfoComponent
      ) : showInfo ? (
        <div
          style={{
            ...getOverlayPosition({ position: infoPosition }),
            ...(showControls ? styles.overlayWeb : styles.overlayWebAlt),
          }}
        >
          <div style={styles.nameColumn}>
            <p style={{ color: textColor, ...styles.nameText }}>{name}</p>
          </div>
          {showWaveform && (
            <div style={styles.waveformWeb}>
              {waveformAnimations.map((animation, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.bar,
                    height: animation === 0 ? 1 : 12,
                    backgroundColor: barColor,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {videoControlsComponent ? (
        videoControlsComponent
      ) : showControls ? (
        <div
          style={{
            ...styles.overlayControls,
            ...getOverlayPosition({ position: controlsPosition }),
          }}
        >
      {renderControls()}
        </div>
      ) : null}
    </div>
  );
};



const styles: { [key: string]: CSSProperties } = {
  card: {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    backgroundColor: "transparent",
    position: "relative",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    width: "80px",
    height: "80px",
  },
  overlayWeb: {
    position: "absolute",
    minWidth: "50%",
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
    padding: "0px 5px",
    marginRight: "2px",
    fontSize: "medium",
    border: "none",
    cursor: "pointer",
  },
  nameColumn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "0px",
    paddingTop: "5px",
    marginRight: "2px",
    fontSize: "small",
    textAlign: "center",
    minHeight: "4%",
    maxHeight: "70%",
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
    padding: "0px",
    flexDirection: "row",
    minHeight: "4%",
    maxHeight: "70%",
  },
  waveformMobile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: "0px",
    marginLeft: "5px",
    maxWidth: "25%",
    margin: "0px",
  },
  bar: {
    flex: 1,
    opacity: 0.75,
    margin: "0 1px",
    transition: "height 0.5s ease",
  },
};

export default AudioCard;
