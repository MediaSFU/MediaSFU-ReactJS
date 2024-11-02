import React from 'react';

export interface MiniCardOptions {
  initials?: string;
  fontSize?: number;
  customStyle?: React.CSSProperties;
  imageSource?: string;
  roundedImage?: boolean;
  imageStyle?: React.CSSProperties;
}

export type MiniCardType = (options: MiniCardOptions) => JSX.Element;

/**
 * MiniAudio component displays an audio player with an optional waveform animation and draggable functionality.
 *
 * This component provides a customizable audio display card that includes an animated waveform (optional) and a background image. The card can be dragged around the screen.
 *
 * @component
 * @param {MiniAudioOptions} props - The properties for the MiniAudio component.
 * @param {boolean} [props.visible=true] - Flag to control component visibility.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles to apply to the card.
 * @param {string} props.name - The name displayed on the audio player.
 * @param {boolean} [props.showWaveform=false] - Flag to display the animated waveform.
 * @param {string} [props.barColor='red'] - Color of the waveform bars.
 * @param {string} [props.textColor='white'] - Color of the displayed name text.
 * @param {React.CSSProperties} [props.nameTextStyling] - Custom styles for the name text.
 * @param {string} props.imageSource - URL of the background image for the card.
 * @param {boolean} [props.roundedImage=false] - If true, applies rounded styling to the background image.
 * @param {React.CSSProperties} [props.imageStyle] - Additional styles for the background image.
 * @param {string} [props.overlayPosition] - Position of the overlay containing the waveform.
 *
 * @returns {JSX.Element} The rendered MiniAudio component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MiniAudio } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MiniAudio
 *       visible={true}
 *       customStyle={{ backgroundColor: 'blue' }}
 *       name="Sample Audio"
 *       showWaveform={true}
 *       barColor="green"
 *       textColor="black"
 *       nameTextStyling={{ fontSize: '20px' }}
 *       imageSource="path/to/image.jpg"
 *       roundedImage={true}
 *       imageStyle={{ width: '100px' }}
 *       overlayPosition="top"
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */

const MiniCard: React.FC<MiniCardOptions> = ({
  initials,
  fontSize = 14,
  customStyle,
  imageSource,
  roundedImage = true,
  imageStyle,
}) => {
  // Define the style for the MiniCard
  const cardStyle: React.CSSProperties = {
    ...styles.miniCard,
    fontSize: fontSize || 14,
    ...customStyle,
  };

  // Render the MiniCard with either an image or initials
  return (
    <div style={cardStyle}>
      {imageSource ? (
        <div style={styles.imageContainer}>
          <img
            src={imageSource}
            alt="Profile"
            style={{
              ...styles.backgroundImage,
              ...(roundedImage && styles.roundedImage),
              ...imageStyle,
            }}
          />
        </div>
      ) : (
        <div style={{ ...styles.initials, fontSize }}>{initials}</div>
      )}
    </div>
  );
};

const styles = {
  miniCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0px',
    width: '100%',
    height: '100%',
    color: 'black',
    fontFamily: 'Nunito', 
    overflow: 'hidden',
  } as React.CSSProperties,
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  } as React.CSSProperties,
  backgroundImage: {
    width: '60%',
    height: '60%',
    objectFit: 'cover',
  } as React.CSSProperties,
  roundedImage: {
    borderRadius: '50%', 
  } as React.CSSProperties,
  initials: {
    textAlign: 'center', 
  } as React.CSSProperties,
};

export default MiniCard;
