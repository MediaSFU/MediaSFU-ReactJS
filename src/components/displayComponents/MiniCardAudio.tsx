 import React, { useState, useEffect } from "react";
import { getOverlayPosition } from "../../methods/utils/getOverlayPosition";

export interface MiniCardAudioOptions {
  customStyle?: React.CSSProperties;
  name: string;
  showWaveform: boolean;
  overlayPosition?: string;
  barColor?: string;
  textColor?: string;
  imageSource?: string;
  roundedImage?: boolean;
  imageStyle?: React.CSSProperties;
}

export type MiniCardAudioType = (options: MiniCardAudioOptions) => JSX.Element;

/**
 * MiniCardAudio component displays an audio card with an optional animated waveform and background image.
 * 
 * This component is designed to render an interactive audio card with customizable styling, optional waveform animation, and a background image. The waveform animation is responsive and changes based on the audio levels.
 * 
 * @component
 * @param {MiniCardAudioOptions} props - The properties for the MiniCardAudio component.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles to apply to the card container.
 * @param {string} props.name - The name displayed on the card.
 * @param {boolean} props.showWaveform - Determines whether the waveform animation is visible.
 * @param {string} [props.overlayPosition] - Position for the overlay containing the waveform.
 * @param {string} [props.barColor="white"] - Color of the animated waveform bars.
 * @param {string} [props.textColor="white"] - Color of the displayed name text.
 * @param {string} props.imageSource - URL for the background image on the card.
 * @param {boolean} [props.roundedImage=false] - If true, applies rounded corners to the background image.
 * @param {React.CSSProperties} [props.imageStyle] - Additional styles for customizing the background image.
 * 
 * @returns {JSX.Element} The rendered MiniCardAudio component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { MiniCardAudio } from 'mediasfu-reactjs';
 * 
 * function App() {
 *   return (
 *     <MiniCardAudio
 *       customStyle={{ backgroundColor: 'black' }}
 *       name="Sample Audio"
 *       showWaveform={true}
 *       overlayPosition="bottom"
 *       barColor="blue"
 *       textColor="yellow"
 *       imageSource="path/to/image.jpg"
 *       roundedImage={true}
 *       imageStyle={{ borderRadius: '10px' }}
 *     />
 *   );
 * }
 * 
 * export default App;
 * ```
 */

const MiniCardAudio: React.FC<MiniCardAudioOptions> = ({
  customStyle,
  name,
  showWaveform,
  overlayPosition,
  barColor = "white",
  textColor = "white",
  imageSource,
  roundedImage = false,
  imageStyle,
}) => {
  const [waveformAnimations, setWaveformAnimations] = useState<number[]>(
    Array.from({ length: 9 }, () => 0)
  );

  const animateWaveform = () => {
    waveformAnimations.map((_, index) => {
      const interval = setInterval(() => {
        setWaveformAnimations((prev) => {
          const newAnimations = [...prev];
          newAnimations[index] = (newAnimations[index] + 1) % 2;
          return newAnimations;
        });
      }, getAnimationDuration(index));
      return interval;
    });
  };

  const resetWaveform = () => {
    setWaveformAnimations(waveformAnimations.map(() => 0));
  };

  useEffect(() => {
    if (showWaveform) {
      animateWaveform();
    } else {
      resetWaveform();
    }
    // Cleanup intervals when the component unmounts or showWaveform changes
    return () => resetWaveform();
  }, [showWaveform]);

  const getAnimationDuration = (index: number): number => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 0;
  };

  return (
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
      <div
        style={{
          ...getOverlayPosition({ position: overlayPosition! }),
          ...styles.overlayWeb
        }}
      >
        <div style={styles.nameColumn}>
          <span style={{ ...styles.nameText, color: textColor }}>{name}</span>
        </div>
        <div
          style={{
            ...styles.waveformWeb 
          }}
        >
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
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    backgroundColor: "#2c678f",
  } as React.CSSProperties,
  overlayMobile: {
    position: "absolute",
    width: "auto",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  } as React.CSSProperties,
  overlayWeb: {
    position: "absolute",
    minWidth: "50%",
    minHeight: "5%",
    maxHeight: "100%",
    display: "grid",
    gridTemplateColumns: "4fr 2fr",
    gridGap: "3px",
  } as React.CSSProperties,
  nameColumn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginEnd: 2,
    fontSize: 14,
  } as React.CSSProperties,
  nameText: {
    fontSize: 14,
    color: "white",
  } as React.CSSProperties,
  waveformWeb: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: 0,
    flexDirection: "row",
  } as React.CSSProperties,
  waveformMobile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingVertical: 5,
    marginLeft: 5,
    maxWidth: "25%",
  } as React.CSSProperties,
  bar: {
    flex: 1,
    opacity: 0.35,
    marginHorizontal: 1,
  } as React.CSSProperties,
  backgroundImage: {
    position: "absolute",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-40px, -40px)",
  } as React.CSSProperties,
  roundedImage: {
    borderRadius: 20, // Adjust the border radius as needed
  } as React.CSSProperties,
};

export default MiniCardAudio;
