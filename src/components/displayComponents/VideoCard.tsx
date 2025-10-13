
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
import CardVideoDisplay, { CardVideoDisplayOptions } from "./CardVideoDisplay";
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
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  infoOverlayProps?: React.HTMLAttributes<HTMLDivElement>;
  controlsOverlayProps?: React.HTMLAttributes<HTMLDivElement>;
  waveformContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  waveformBarStyle?: React.CSSProperties;
  waveformBarClassName?: string;
  videoDisplayProps?: Partial<CardVideoDisplayOptions>;
  extraWidgets?: React.ReactNode;
  children?: React.ReactNode;
}

export type VideoCardType = (options: VideoCardOptions) => React.JSX.Element;  // Define the type for the function

/**
 * VideoCard component displays participant video with optional controls, info overlay, and animated waveform.
 *
 * This component is commonly overridden via `uiOverrides.videoCard` or replaced with a custom builder
 * passed to `customVideoCard`. Use this to add host badges, reactions, CRM overlays, or analytics.
 *
 * @component
 * @param {VideoCardOptions} props - The properties for the VideoCard component.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles for the card wrapper.
 * @param {string} props.name - Participant display name.
 * @param {string} [props.barColor="red"] - Waveform bar color (audio activity visualization).
 * @param {string} [props.textColor="white"] - Text color for participant name overlay.
 * @param {string} props.remoteProducerId - Remote producer ID for the video track.
 * @param {EventType} props.eventType - Event context (conference, webinar, broadcast, chat).
 * @param {boolean} props.forceFullDisplay - Force full display mode (no cropping).
 * @param {MediaStream | null} props.videoStream - Video MediaStream to render.
 * @param {boolean} [props.showControls=true] - Display control buttons (mute, stop video).
 * @param {boolean} [props.showInfo=true] - Display participant info overlay.
 * @param {React.ReactNode} [props.videoInfoComponent] - Custom info component (replaces default name badge).
 * @param {React.ReactNode} [props.videoControlsComponent] - Custom controls component (replaces default buttons).
 * @param {"topLeft" | "topRight" | "bottomLeft" | "bottomRight"} [props.controlsPosition="topLeft"] - Control overlay position.
 * @param {"topLeft" | "topRight" | "bottomLeft" | "bottomRight"} [props.infoPosition="topRight"] - Info overlay position.
 * @param {Participant} props.participant - Full participant object (includes mute state, level, etc.).
 * @param {string} [props.backgroundColor] - Background color behind video.
 * @param {AudioDecibels[]} [props.audioDecibels] - Audio level data for waveform animation.
 * @param {boolean} [props.doMirror=false] - Mirror the video horizontally (for self-view).
 * @param {VideoCardParameters} props.parameters - Additional parameters including socket, room context, and callbacks.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - Props for outer container div.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.infoOverlayProps] - Props for info overlay wrapper.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.controlsOverlayProps] - Props for controls overlay wrapper.
 * @param {React.ReactNode} [props.extraWidgets] - Additional UI elements rendered inside the card.
 *
 * @returns {React.JSX.Element} The rendered VideoCard component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <VideoCard
 *   name="John Doe"
 *   remoteProducerId="producer-123"
 *   eventType="conference"
 *   forceFullDisplay={false}
 *   videoStream={mediaStream}
 *   participant={participant}
 *   backgroundColor="#0f172a"
 *   parameters={parameters}
 * />
 * ```
 *
 * @example
 * // Custom styled video card via customVideoCard prop
 * ```tsx
 * const customVideoCard: CustomVideoCardType = (props) => (
 *   <VideoCard
 *     {...props}
 *     customStyle={{
 *       borderRadius: 20,
 *       border: "3px solid #4c1d95",
 *       boxShadow: "0 28px 65px rgba(76,29,149,0.35)",
 *     }}
 *     infoOverlayProps={{
 *       style: {
 *         background: "rgba(79,70,229,0.9)",
 *         color: "#f8fafc",
 *         fontWeight: 600,
 *       },
 *     }}
 *   />
 * );
 *
 * <MediasfuGeneric customVideoCard={customVideoCard} />
 * ```
 *
 * @example
 * // Override via uiOverrides
 * ```tsx
 * const uiOverrides: MediasfuUICustomOverrides = {
 *   videoCard: {
 *     render: (props) => (
 *       <div style={{ position: "relative" }}>
 *         <VideoCard {...props} />
 *         {props.participant.islevel === "2" && (
 *           <div style={{ position: "absolute", top: 8, right: 8, background: "gold", padding: 4, borderRadius: 4 }}>
 *             HOST
 *           </div>
 *         )}
 *       </div>
 *     ),
 *   },
 * };
 * ```
 *
 * @example
 * // Full configuration example
 * ```tsx
 * <VideoCard
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
  containerProps,
  infoOverlayProps,
  controlsOverlayProps,
  waveformContainerProps,
  waveformBarStyle,
  waveformBarClassName,
  videoDisplayProps,
  extraWidgets,
  children,
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

  const { style: containerStyleProp, ...restContainerProps } = containerProps ?? {};
  const combinedContainerStyle: React.CSSProperties = {
    ...styles.card,
    ...containerStyleProp,
    ...customStyle,
    backgroundColor,
  };

  const { style: infoOverlayStyleProp, ...restInfoOverlayProps } =
    infoOverlayProps ?? {};
  const { style: controlsOverlayStyleProp, ...restControlsOverlayProps } =
    controlsOverlayProps ?? {};
  const { style: waveformContainerStyleProp, ...restWaveformContainerProps } =
    waveformContainerProps ?? {};

  return (
    <div {...restContainerProps} style={combinedContainerStyle}>
      {extraWidgets}
      <CardVideoDisplay
        remoteProducerId={remoteProducerId}
        eventType={eventType}
        forceFullDisplay={forceFullDisplay}
        videoStream={videoStream}
        backgroundColor={backgroundColor}
        doMirror={doMirror}
        {...videoDisplayProps}
      />

      {videoInfoComponent ||
        (showInfo && (
          <div
            style={{
              ...getOverlayPosition({ position: infoPosition }),
              ...(showControls ? styles.overlayWeb : styles.overlayWebAlt),
              ...infoOverlayStyleProp,
            }}
            {...restInfoOverlayProps}
          >
            <div style={styles.nameColumn}>
              <span style={{ ...styles.nameText, color: textColor }}>
                {participant?.name}
              </span>
            </div>
            {showWaveform && (
              <div
                style={{ ...styles.waveformWeb, ...waveformContainerStyleProp }}
                {...restWaveformContainerProps}
              >
                {waveformAnimations.map((animation, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.bar,
                      height: animation === 0 ? 1 : 16,
                      backgroundColor: barColor,
                      ...waveformBarStyle,
                    }}
                    className={waveformBarClassName}
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
              ...controlsOverlayStyleProp,
            }}
            {...restControlsOverlayProps}
          >
            {renderControls()}
          </div>
        ))}
      {children}
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
