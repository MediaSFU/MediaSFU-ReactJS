
import React, { useState, useEffect } from "react";
import { getOverlayPosition } from "../../methods/utils/getOverlayPosition";

export interface MiniAudioOptions {
  visible?: boolean;
  customStyle?: React.CSSProperties;
  name: string;
  showWaveform?: boolean;
  overlayPosition?: string;
  barColor?: string;
  textColor?: string;
  nameTextStyling?: React.CSSProperties;
  imageSource: string;
  roundedImage?: boolean;
  imageStyle?: React.CSSProperties;
}

export type MiniAudioType = (options: MiniAudioOptions) => JSX.Element;

/**
 * MiniAudio component displays an audio player with optional waveform animation and draggable functionality.
 *
 * @component
 * @param {MiniAudioOptions} props - The properties for the MiniAudio component.
 * @param {boolean} [props.visible=true] - Determines if the component is visible.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles for the component.
 * @param {string} props.name - The name to display on the audio player.
 * @param {boolean} [props.showWaveform=false] - Flag to show or hide the waveform animation.
 * @param {string} [props.barColor='red'] - The color of the waveform bars.
 * @param {string} [props.textColor='white'] - The color of the text.
 * @param {React.CSSProperties} [props.nameTextStyling] - Custom styles for the name text.
 * @param {string} [props.imageSource] - The source URL for the background image.
 * @param {boolean} [props.roundedImage=false] - Flag to determine if the background image should be rounded.
 * @param {React.CSSProperties} [props.imageStyle] - Custom styles for the background image.
 * @param {string} [props.overlayPosition] - The position of the overlay.
 *
 * @returns {JSX.Element} The rendered MiniAudio component.
 *
 * @example
 * <MiniAudio
 *   visible={true}
 *   customStyle={{ backgroundColor: 'blue' }}
 *   name="Sample Audio"
 *   showWaveform={true}
 *   barColor="green"
 *   textColor="black"
 *   nameTextStyling={{ fontSize: '20px' }}
 *   imageSource="path/to/image.jpg"
 *   roundedImage={true}
 *   imageStyle={{ width: '100px' }}
 *   overlayPosition="top"
 * />
 */
const MiniAudio: React.FC<MiniAudioOptions> = ({
  visible = true,
  customStyle,
  name,
  showWaveform = false,
  overlayPosition,
  barColor = "red",
  textColor = "white",
  nameTextStyling,
  imageSource,
  roundedImage = false,
  imageStyle,
}) => {
  const [waveformAnimations, setWaveformAnimations] = useState<number[]>(
    Array.from({ length: 9 }, () => 0)
  );

  const animateWaveform = () => {
    const animations = waveformAnimations.map((_, index) =>
      window.setInterval(
        () => animateBar(index),
        getAnimationDuration(index) * 2
      )
    );
    setWaveformAnimations(animations);
  };

  useEffect(() => {
    if (showWaveform) {
      animateWaveform();
    } else {
      resetWaveform();
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

  const resetWaveform = () => {
    setWaveformAnimations(Array.from({ length: 9 }, () => 0));
  };

  const getAnimationDuration = (index: number): number => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 0;
  };

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseUpOutside = () => {
      setIsDragging(false);
      document.removeEventListener("mouseup", handleMouseUpOutside);
    };

    document.addEventListener("mouseup", handleMouseUpOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUpOutside);
    };
  }, [isDragging]);

  return (
    <div style={{ display: visible ? "block" : "none" }}>
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          ...styles.modalContainer,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <div style={{ ...styles.card, ...customStyle }}>
          {imageSource && (
            <img
              src={imageSource}
              style={{
                ...styles.backgroundImage,
                ...(roundedImage && styles.roundedImage),
                ...imageStyle,
              }}
              alt="Background"
            />
          )}
          <div>
            <span
              style={{
                ...styles.nameText,
                color: textColor,
                ...nameTextStyling,
              }}
            >
              {name}
            </span>
          </div>
          <div
            style={{
              ...getOverlayPosition({ position: overlayPosition! }),
              ...styles.overlayWeb,
            }}
          >
            <div style={{ ...styles.waveformWeb }}>
              {waveformAnimations.map((animation, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.bar,
                    height: animation === 0 ? 1 : 30,
                    width: 10,
                    backgroundColor: barColor,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 0,
    margin: 0,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 45, 33, 0.5)",
    zIndex: 8,
    elevation: 8,
  } as React.CSSProperties,
  card: {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    backgroundColor: "#2c678f",
  } as React.CSSProperties,
  overlayWeb: {
    position: "absolute",
    minWidth: "100%",
    height: "100%",
    maxHeight: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 12fr 1fr",
    gridGap: "3px",
  } as React.CSSProperties,
  nameText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    display: "flex",
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: "center",
  } as React.CSSProperties,
  waveformWeb: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: 0,
    flexDirection: "row",
  } as React.CSSProperties,
  bar: {
    flex: 1,
    opacity: 0.35,
    marginRight: "0.5px",
  } as React.CSSProperties,
  backgroundImage: {
    position: "absolute",
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    top: "40%",
    left: "50%",
    transform: "translate(-35px, -10px)",
  } as React.CSSProperties,
  roundedImage: {
    borderRadius: 20,
  } as React.CSSProperties,
};

export default MiniAudio;
