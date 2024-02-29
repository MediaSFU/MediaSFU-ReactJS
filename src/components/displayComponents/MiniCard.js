

/**
 * MiniCard - A React JS component for displaying a mini card with initials or an image.
 * @param {Object} props - The props passed to the MiniCard.
 * @param {string} props.initials - The initials to be displayed if no image source is provided.
 * @param {string} props.fontSize - The font size for the initials (default is 20).
 * @param {Object} props.customStyle - Custom styles to be applied to the MiniCard.
 * @param {string} props.imageSource - The URI of the image to be displayed in the card.
 * @param {boolean} props.roundedImage - Flag indicating whether to use a rounded image (default is false).
 * @param {Object} props.imageStyle - Custom styles to be applied to the image.
 * @returns {React.Component} - The MiniCard component.
 */

import React from 'react';

const MiniCard = ({ initials, fontSize, customStyle, imageSource, roundedImage = false, imageStyle }) => {
  // Define the style for the MiniCard
  const cardStyle = {
    ...styles.miniCard,
    fontSize: fontSize || 14,
    ...customStyle,
  };

  // Render the MiniCard with either an image or initials
  return (
    <div style={cardStyle}>
      {imageSource ? (
        <img
          src={imageSource}
          alt="Profile"
          style={[
            styles.backgroundImage,
            roundedImage && styles.roundedImage,
            imageStyle,
          ]}
        />
      ) : (
        <div style={{ ...styles.initials, fontSize: fontSize || 14 }}>{initials}</div>
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
    fontFamily: 'Nunito', // Update with your desired font
    overflow: 'hidden',
    border: '2px solid black',
  },
  backgroundImage: {
    width: '60%',
    height: '60%',
    objectFit: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: '20%',
    left: '20%',
  },
  roundedImage: {
    borderRadius: '20%', // Adjust the border radius as needed
  },
  initials: {
    textAlign: 'center', // Center the text horizontally
  },
};

export default MiniCard;
