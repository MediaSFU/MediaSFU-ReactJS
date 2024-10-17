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
 * MiniCard component displays a small card with either an image or initials.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.initials - The initials to display if no image is provided.
 * @param {number} [props.fontSize=14] - The font size for the initials.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles to apply to the card.
 * @param {string} [props.imageSource] - The source URL of the image to display.
 * @param {boolean} [props.roundedImage=true] - Whether the image should be displayed with rounded corners.
 * @param {React.CSSProperties} [props.imageStyle] - Custom styles to apply to the image.
 * 
 * @returns {JSX.Element} The rendered MiniCard component.
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
