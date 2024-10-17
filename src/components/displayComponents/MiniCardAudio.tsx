/**
 * MiniCardAudio - A React component for displaying a mini audio card with waveform animation.
 * @param {Object} props - The props passed to the MiniCardAudio.
 * @param {Object} props.customStyle - Custom styles for the MiniCardAudio.
 * @param {string} props.name - The name to be displayed on the card.
 * @param {boolean} props.showWaveform - Flag indicating whether to show the waveform animation.
 * @param {string} props.overlayPosition - Position of the overlay (e.g., 'bottomLeft', 'topRight').
 * @param {string} props.barColor - Color of the waveform bars.
 * @param {string} props.textColor - Color of the text on the card.
 * @param {string} props.imageSource - Image source for the card.
 * @param {boolean} props.roundedImage - Flag indicating whether to display a rounded image.
 * @param {Object} props.imageStyle - Custom styles for the image.
 * @returns {React.Component} - The MiniCardAudio component.
 */


import React, { useState, useEffect } from 'react';
import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';

const MiniCardAudio = ({
  customStyle,
  name,
  showWaveform,
  overlayPosition,
  barColor = 'white',
  textColor = 'white',
  imageSource,
  roundedImage = false,
  imageStyle,
}) => {

  const [waveformAnimations, setWaveformAnimations] = useState(Array.from({ length: 9 }, () => 0));
  useEffect(() => {
    if (showWaveform) {
      animateWaveform();
    } else {
      resetWaveform();
    }
  }, [showWaveform]);

  const animateWaveform = () => {
    const animations = waveformAnimations.map((_, index) => setInterval(() => {
      waveformAnimations[index] = (waveformAnimations[index] + 1) % 2;
    }, getAnimationDuration(index)));
  };

  const resetWaveform = () => {
    waveformAnimations.forEach((_, index) => (waveformAnimations[index] = 0));
  };

  const getAnimationDuration = (index) => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 0;
  };

  return (
    <div style={{ ...styles.card, ...customStyle }}>
      {imageSource && (
        <img
          src={imageSource}
          style={[
            styles.backgroundImage,
            roundedImage && styles.roundedImage,
            imageStyle,
          ]}
          alt="Background"
        />
      )}
      <div style={{ ...getOverlayPosition(overlayPosition), ...('web' === 'web' ? styles.overlayWeb : styles.overlayMobile) }}>
        <div style={styles.nameColumn}>
          <span style={{ ...styles.nameText, color: textColor }}>{name}</span>
        </div>
        <div style={{ ...('web' === 'web' ? styles.waveformWeb : styles.waveformMobile) }}>
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
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: '#2c678f',
  },
  overlayMobile: {
    position: 'absolute',
    width: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlayWeb: {
    position: 'absolute',
    minWidth: '50%',
    minHeight: '5%',
    maxHeight: '100%',
    display: 'grid',
    gridTemplateColumns: '4fr 2fr',
    gridGap: '3px',
  },
  nameColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginEnd: 2,
    fontSize: 14,
  },
  nameText: {
    fontSize: 14,
    color: 'white',
  },
  waveformWeb: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 0,
    flexDirection: 'row',
  },
  waveformMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 5,
    marginLeft: 5,
    maxWidth: '25%',
  },
  bar: {
    flex: 1,
    opacity: 0.35,
    marginHorizontal: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-40px, -40px)',
  },
  roundedImage: {
    borderRadius: 20, // Adjust the border radius as needed
  },
};

export default MiniCardAudio;
