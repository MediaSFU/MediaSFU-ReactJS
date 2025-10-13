
import React, {
  useState,
  useEffect,
  CSSProperties,
  useMemo,
  useCallback,
} from "react";
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
  cardProps?: React.HTMLAttributes<HTMLDivElement>;
  infoOverlayProps?: React.HTMLAttributes<HTMLDivElement>;
  nameContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  nameTextProps?: React.HTMLAttributes<HTMLParagraphElement>;
  waveformContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  waveformBarStyle?: React.CSSProperties;
  waveformBarProps?: React.HTMLAttributes<HTMLDivElement>;
  waveformHeights?: {
    silent?: number;
    active?: number;
  };
  waveformDurations?: number[];
  waveformBarCount?: number;
  renderWaveformBar?: (options: {
    index: number;
    isActive: boolean;
    height: number;
    style: React.CSSProperties;
    props: React.HTMLAttributes<HTMLDivElement>;
  }) => React.ReactNode;
  controlsOverlayProps?: React.HTMLAttributes<HTMLDivElement>;
  controlButtonProps?: {
    audio?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    video?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  };
  audioEnabledIcon?: React.ReactNode;
  audioDisabledIcon?: React.ReactNode;
  videoEnabledIcon?: React.ReactNode;
  videoDisabledIcon?: React.ReactNode;
  fallbackMiniCardProps?: Partial<React.ComponentProps<typeof MiniCard>>;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  showWaveformWhenMuted?: boolean;
}

export type AudioCardType = (options: AudioCardOptions) => React.JSX.Element;

/**
 * AudioCard component displays an interactive audio card with participant information, media controls,
 * and a real-time animated waveform representing audio levels.
 *
 * This component is highly customizable and supports:
 * - Real-time audio level visualization via animated waveform bars
 * - Media control overlays (audio/video toggle)
 * - Participant info display with flexible positioning
 * - Custom render hooks for waveform bars, controls, and info
 * - Extensive styling via props and HTML attributes
 * - Override patterns for use in MediaSFU UI components
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
 * **Basic Usage**
 * ```tsx
 * import React from 'react';
 * import { AudioCard } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const participant = { name: "Alice", id: "123", muted: false, videoOn: true };
 *   const parameters = {
 *     audioDecibels: [{ name: "Alice", averageLoudness: 128 }],
 *     participants: [participant],
 *     socket: mySocket,
 *     coHostResponsibility: [],
 *     roomName: "Room1",
 *     coHost: "Host123",
 *     islevel: "1",
 *     member: "Alice",
 *     eventType: "meeting",
 *     getUpdatedAllParams: () => parameters,
 *   };
 *
 *   return (
 *     <AudioCard
 *       name="Alice"
 *       participant={participant}
 *       parameters={parameters}
 *       audioDecibels={parameters.audioDecibels[0]}
 *       backgroundColor="black"
 *       barColor="cyan"
 *       textColor="white"
 *       imageSource="https://example.com/alice.jpg"
 *       roundedImage={true}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * **Using in uiOverrides (MediasfuGeneric)**
 * ```tsx
 * import React from 'react';
 * import { MediasfuGeneric, AudioCard } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const CustomAudioCard = (props: any) => (
 *     <AudioCard
 *       {...props}
 *       barColor="purple"
 *       textColor="yellow"
 *       waveformBarCount={15}
 *       renderWaveformBar={({ index, isActive, height, style, props }) => (
 *         <div
 *           key={index}
 *           {...props}
 *           style={{
 *             ...style,
 *             height: `${height}px`,
 *             backgroundColor: isActive ? 'purple' : 'rgba(255,255,255,0.2)',
 *             boxShadow: isActive ? '0 0 8px purple' : 'none',
 *             borderRadius: 2,
 *           }}
 *         />
 *       )}
 *     />
 *   );
 *
 *   return (
 *     <MediasfuGeneric
 *       useLocalUIMode={true}
 *       useSeed={true}
 *       seedData={mySeedData}
 *       uiOverrides={{
 *         AudioCard: CustomAudioCard
 *       }}
 *     />
 *   );
 * }
 * ```
 */

const DEFAULT_WAVEFORM_DURATIONS = [474, 433, 407, 458, 400, 427, 441, 419, 487];

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
  parameters,
  cardProps,
  infoOverlayProps,
  nameContainerProps,
  nameTextProps,
  waveformContainerProps,
  waveformBarStyle,
  waveformBarProps,
  waveformHeights,
  waveformDurations,
  waveformBarCount,
  renderWaveformBar,
  controlsOverlayProps,
  controlButtonProps,
  audioEnabledIcon,
  audioDisabledIcon,
  videoEnabledIcon,
  videoDisabledIcon,
  fallbackMiniCardProps,
  imageProps,
  showWaveformWhenMuted = false,
}) => {
  const durations = useMemo(() => {
    if (waveformDurations && waveformDurations.length > 0) {
      return waveformDurations;
    }
    return DEFAULT_WAVEFORM_DURATIONS;
  }, [waveformDurations]);

  const barCount = waveformBarCount ?? durations.length;
  const [waveformAnimations, setWaveformAnimations] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 0)
  );
  const [showWaveform, setShowWaveform] = useState(true);

  const latestParametersSnapshot = useMemo(
    () => parameters.getUpdatedAllParams(),
    [parameters]
  );

  useEffect(() => {
    setWaveformAnimations(Array.from({ length: barCount }, () => 0));
  }, [barCount]);

  const getLatestParameters = useCallback(
    () => parameters.getUpdatedAllParams(),
    [parameters]
  );

  const getAnimationDuration = useCallback(
    (index: number): number => {
      const fallback = durations[durations.length - 1] ?? 0;
      if (durations.length === 0) {
        return 0;
      }
      return durations[index] ?? fallback;
    },
    [durations]
  );

  const resetWaveform = useCallback(() => {
    setWaveformAnimations(Array.from({ length: barCount }, () => 0));
  }, [barCount]);

  const animateBar = useCallback(
    (index: number) => {
      setWaveformAnimations((prevAnimations) => {
        const newAnimations = [...prevAnimations];
        if (index < newAnimations.length) {
          newAnimations[index] = 1;
        }
        return newAnimations;
      });

      const duration = getAnimationDuration(index);

      if (duration <= 0) {
        setWaveformAnimations((prevAnimations) => {
          const newAnimations = [...prevAnimations];
          if (index < newAnimations.length) {
            newAnimations[index] = 0;
          }
          return newAnimations;
        });
        return;
      }

      setTimeout(() => {
        setWaveformAnimations((prevAnimations) => {
          const newAnimations = [...prevAnimations];
          if (index < newAnimations.length) {
            newAnimations[index] = 0;
          }
          return newAnimations;
        });
      }, duration);
    },
    [getAnimationDuration]
  );

  const animateWaveform = useCallback(() => {
    for (let index = 0; index < barCount; index += 1) {
      animateBar(index);
    }
  }, [animateBar, barCount]);

  useEffect(() => {
    if (!showWaveform) {
      resetWaveform();
      return;
    }

    animateWaveform();
    const animationInterval = setInterval(animateWaveform, 1000);

    return () => clearInterval(animationInterval);
  }, [animateWaveform, resetWaveform, showWaveform]);

  useEffect(() => {
    if (participant?.muted && !showWaveformWhenMuted) {
      setShowWaveform(false);
      resetWaveform();
    } else {
      setShowWaveform(true);
    }
  }, [participant?.muted, resetWaveform, showWaveformWhenMuted]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { audioDecibels: latestAudioDecibels, participants } =
        getLatestParameters();

      const existingEntry =
        latestAudioDecibels?.find((entry: AudioDecibels) => entry.name === name) ??
        null;
      const updatedParticipant =
        participants?.find((p: Participant) => p.name === name) ?? null;

      if (
        existingEntry &&
        existingEntry.averageLoudness > 127.5 &&
        updatedParticipant &&
        !updatedParticipant.muted
      ) {
        if (!showWaveform) {
          setShowWaveform(true);
        }
      } else if (!showWaveformWhenMuted) {
        setShowWaveform(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getLatestParameters, name, showWaveform, showWaveformWhenMuted]);

  const toggleAudio = useCallback(async () => {
    if (!participant?.muted) {
      const latestParameters = getLatestParameters();
      await controlUserMedia({
        participantId: participant.id || "",
        participantName: participant.name,
        type: "audio",
        socket: latestParameters.socket,
        coHostResponsibility: latestParameters.coHostResponsibility,
        roomName: latestParameters.roomName,
        showAlert: latestParameters.showAlert,
        coHost: latestParameters.coHost,
        islevel: latestParameters.islevel,
        member: latestParameters.member,
        participants: latestParameters.participants,
      });
    }
  }, [controlUserMedia, getLatestParameters, participant?.id, participant?.muted, participant?.name]);

  const toggleVideo = useCallback(async () => {
    if (participant?.videoOn) {
      const latestParameters = getLatestParameters();
      await controlUserMedia({
        participantId: participant.id || "",
        participantName: participant.name,
        type: "video",
        socket: latestParameters.socket,
        coHostResponsibility: latestParameters.coHostResponsibility,
        roomName: latestParameters.roomName,
        showAlert: latestParameters.showAlert,
        coHost: latestParameters.coHost,
        islevel: latestParameters.islevel,
        member: latestParameters.member,
        participants: latestParameters.participants,
      });
    }
  }, [controlUserMedia, getLatestParameters, participant?.id, participant?.name, participant?.videoOn]);

  const {
    style: cardStyle,
    ...restCardProps
  } = cardProps ?? {};

  const {
    style: infoOverlayStyle,
    ...restInfoOverlayProps
  } = infoOverlayProps ?? {};

  const {
    style: nameContainerStyle,
    ...restNameContainerProps
  } = nameContainerProps ?? {};

  const {
    style: nameTextStyle,
    ...restNameTextProps
  } = nameTextProps ?? {};

  const {
    style: waveformContainerStyle,
    ...restWaveformContainerProps
  } = waveformContainerProps ?? {};

  const {
    style: waveformBarCustomStyle,
    ...restWaveformBarProps
  } = waveformBarProps ?? {};

  const {
    style: controlsOverlayStyle,
    ...restControlsOverlayProps
  } = controlsOverlayProps ?? {};

  const imagePropsResolved = imageProps ?? {};
  const {
    style: imagePropsStyle,
    ...restImageProps
  } = imagePropsResolved;

  const audioButtonOptions = controlButtonProps?.audio ?? {};
  const {
    style: audioButtonStyle,
    onClick: audioExternalOnClick,
    type: audioButtonType,
    ...restAudioButtonProps
  } = audioButtonOptions;

  const videoButtonOptions = controlButtonProps?.video ?? {};
  const {
    style: videoButtonStyle,
    onClick: videoExternalOnClick,
    type: videoButtonType,
    ...restVideoButtonProps
  } = videoButtonOptions;

  const { silent = 1, active = 12 } = waveformHeights || {};

  const handleAudioButtonClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      audioExternalOnClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      await toggleAudio();
    },
    [audioExternalOnClick, toggleAudio]
  );

  const handleVideoButtonClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      videoExternalOnClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      await toggleVideo();
    },
    [toggleVideo, videoExternalOnClick]
  );

  const resolvedAudioIcon = participant?.muted
    ? audioDisabledIcon ?? (
        <FontAwesomeIcon icon={faMicrophoneSlash} size="sm" color="red" />
      )
    : audioEnabledIcon ?? (
        <FontAwesomeIcon icon={faMicrophone} size="sm" color="green" />
      );

  const resolvedVideoIcon = participant?.videoOn
    ? videoEnabledIcon ?? (
        <FontAwesomeIcon icon={faVideo} size="sm" color="green" />
      )
    : videoDisabledIcon ?? (
        <FontAwesomeIcon icon={faVideoSlash} size="sm" color="red" />
      );

  const defaultControls = (
    <>
      <button
        {...restAudioButtonProps}
        type={audioButtonType ?? "button"}
        onClick={handleAudioButtonClick}
        style={{
          ...styles.controlButton,
          ...(audioButtonStyle ?? {}),
        }}
      >
        {resolvedAudioIcon}
      </button>
      <button
        {...restVideoButtonProps}
        type={videoButtonType ?? "button"}
        onClick={handleVideoButtonClick}
        style={{
          ...styles.controlButton,
          ...(videoButtonStyle ?? {}),
        }}
      >
        {resolvedVideoIcon}
      </button>
    </>
  );

  const miniCardBaseProps: React.ComponentProps<typeof MiniCard> = {
    initials: name,
    fontSize: 20,
    customStyle: {
      border:
        latestParametersSnapshot.eventType !== "broadcast"
          ? "2px solid black"
          : "0px solid black",
    },
  };

  const mergedMiniCardProps: React.ComponentProps<typeof MiniCard> = {
    ...miniCardBaseProps,
    ...fallbackMiniCardProps,
    customStyle: {
      ...miniCardBaseProps.customStyle,
      ...fallbackMiniCardProps?.customStyle,
    },
  };

  const waveformBars = Array.from({ length: barCount }).map((_, index) => {
    const isActive = waveformAnimations[index] === 1;
    const barHeight = isActive ? active : silent;
    const barStyle: CSSProperties = {
      ...styles.bar,
      ...(waveformBarStyle ?? {}),
      ...(waveformBarCustomStyle ?? {}),
      height: barHeight,
      backgroundColor: barColor,
    };

    if (renderWaveformBar) {
      const customBar = renderWaveformBar({
        index,
        isActive,
        height: barHeight,
        style: barStyle,
        props: restWaveformBarProps,
      });

      if (React.isValidElement(customBar)) {
        return React.cloneElement(customBar, { key: index });
      }

      return (
        <React.Fragment key={index}>{customBar}</React.Fragment>
      );
    }

    return (
      <div
        key={index}
        {...restWaveformBarProps}
        style={barStyle}
      />
    );
  });

  return (
    <div
      {...restCardProps}
      style={{
        ...styles.card,
        ...customStyle,
        ...(cardStyle ?? {}),
        ...(backgroundColor ? { backgroundColor } : {}),
      }}
    >
      {imageSource ? (
        <div style={styles.imageContainer}>
          <img
            src={imageSource}
            alt="Participant"
            {...restImageProps}
            style={{
              ...styles.backgroundImage,
              ...(roundedImage ? { borderRadius: "20%" } : {}),
              ...imageStyle,
              ...(imagePropsStyle ?? {}),
            }}
          />
        </div>
      ) : (
        <MiniCard {...mergedMiniCardProps} />
      )}

      {videoInfoComponent
        ? videoInfoComponent
        : showInfo && (
            <div
              {...restInfoOverlayProps}
              style={{
                ...getOverlayPosition({ position: infoPosition }),
                ...(showControls ? styles.overlayWeb : styles.overlayWebAlt),
                ...(infoOverlayStyle ?? {}),
              }}
            >
              <div
                {...restNameContainerProps}
                style={{
                  ...styles.nameColumn,
                  ...(nameContainerStyle ?? {}),
                }}
              >
                <p
                  {...restNameTextProps}
                  style={{
                    color: textColor,
                    ...styles.nameText,
                    ...(nameTextStyle ?? {}),
                  }}
                >
                  {name}
                </p>
              </div>
              {showWaveform && (
                <div
                  {...restWaveformContainerProps}
                  style={{
                    ...styles.waveformWeb,
                    ...(waveformContainerStyle ?? {}),
                  }}
                >
                  {waveformBars}
                </div>
              )}
            </div>
          )}

      {videoControlsComponent
        ? videoControlsComponent
        : showControls && (
            <div
              {...restControlsOverlayProps}
              style={{
                ...styles.overlayControls,
                ...getOverlayPosition({ position: controlsPosition }),
                ...(controlsOverlayStyle ?? {}),
              }}
            >
              {defaultControls}
            </div>
          )}
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
