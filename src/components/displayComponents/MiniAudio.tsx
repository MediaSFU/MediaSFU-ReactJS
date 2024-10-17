/**
 * MiniAudio Component
 *
 * A customizable React component for displaying a mini audio modal with waveform animations.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} [props.visible=true] - Controls the visibility of the mini audio modal.
 * @param {Object} [props.customStyle] - Custom styles for the mini audio modal.
 * @param {string} props.name - The name to be displayed in the mini audio modal.
 * @param {boolean} [props.showWaveform] - If true, displays waveform animations.
 * @param {Object} [props.overlayPosition] - Position of the overlay within the modal.
 * @param {string} [props.barColor='white'] - Color of the waveform bars.
 * @param {string} [props.textColor='white'] - Color of the displayed text.
 * @param {Object} [props.nameTextStyling] - Additional styling for the displayed name text.
 * @param {string} props.imageSource - Source URI for the image displayed in the background.
 * @param {boolean} [props.roundedImage=false] - If true, applies a border-radius to the image for a rounded effect.
 * @param {Object} [props.imageStyle] - Custom styles for the image.
 * @returns {JSX.Element} - The rendered component.
 */

import React, { useState, useEffect } from 'react';
import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';

const MiniAudio = ({
  visible = true,
  customStyle,
  name,
  showWaveform,
  overlayPosition,
  barColor = 'red',
  textColor = 'white',
  nameTextStyling,
  imageSource,
  roundedImage = false,
  imageStyle,
}) => {
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [waveformAnimations, setWaveformAnimations] = useState(Array.from({ length: 9 }, () => 0));

  useEffect(() => {
    if (showWaveform) {
      animateWaveform();
    } else {
      resetWaveform();
    }

  }, [showWaveform]);

  const animateWaveform = () => {
    const animations = waveformAnimations.map((_, index) => setInterval(() => animateBar(index), getAnimationDuration(index) * 2));

    setWaveformAnimations(animations);
  };

  const animateBar = (index) => {
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

  const getAnimationDuration = (index) => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 0;
  };

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseUpOutside = () => {
      setIsDragging(false);
      document.removeEventListener('mouseup', handleMouseUpOutside);
    };

    document.addEventListener('mouseup', handleMouseUpOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUpOutside);
    };
  }, [isDragging]);

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
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
            <span style={{ ...styles.nameText, color: textColor, ...nameTextStyling }}>{name}</span>
          </div>
          <div style={{ ...getOverlayPosition(overlayPosition), ...styles.overlayWeb }}>
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
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 0,
    margin: 0,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 45, 33, 0.5)',
    zIndex: 8,
    elevation: 8,
  },
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayWeb: {
    position: 'absolute',
    minWidth: '100%',
    height: '100%',
    maxHeight: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 12fr 1fr',
    gridGap: '3px',
  },
  nameText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    display: 'flex',
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    maxHeight: '100%',
    marginLeft: 5,
    maxWidth: '100%',
    marginVertical: '30%'
  },
  bar: {
    flex: 1,
    opacity: 0.35,
    marginRight: '0.5px'
  },
  backgroundImage: {
    position: 'absolute',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: '40%',
    left: '50%',
    transform: 'translate(-35px, -10px)',
  },
  roundedImage: {
    borderRadius: 20,
  },
};

export default MiniAudio;

