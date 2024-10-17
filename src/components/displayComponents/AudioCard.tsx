
/**
 * AudioCard - A React JS component for displaying an audio card with customizable controls, information, and waveform animations.
 * @param {Object} props - The props passed to the AudioCard component.
 * @param {Object} props.customStyle - Custom styles for the AudioCard component.
 * @param {string} props.name - The name of the participant.
 * @param {string} props.barColor - The color of the waveform bar.
 * @param {string} props.textColor - The color of the text.
 * @param {string} props.imageSource - The image source for the participant.
 * @param {boolean} props.roundedImage - Flag to determine if the image should be rounded.
 * @param {Object} props.imageStyle - Custom styles for the participant image.
 * @param {boolean} props.showControls - Flag to show or hide controls.
 * @param {boolean} props.showInfo - Flag to show or hide participant information.
 * @param {React.Component} props.videoInfoComponent - Custom component for participant information.
 * @param {React.Component} props.videoControlsComponent - Custom component for video controls.
 * @param {string} props.controlsPosition - The position of controls (topLeft, topRight, bottomLeft, bottomRight).
 * @param {string} props.infoPosition - The position of participant information (topLeft, topRight, bottomLeft, bottomRight).
 * @param {Object} props.participant - The participant object.
 * @param {string} props.backgroundColor - The background color of the AudioCard.
 * @param {Object} props.audioDecibels - The audio decibels object.
 * @param {Object} props.parameters - Additional parameters for the AudioCard.
 * @returns {React.Component} - The AudioCard component.
 */


import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';
import MiniCard from './MiniCard';
import { controlMedia } from '../../consumers/controlMedia';
import './AudioCard.css'; // Import CSS for styling

const AudioCard = ({
  customStyle,
  name,
  barColor = 'red',
  textColor = 'white',
  imageSource,
  roundedImage = false,
  imageStyle,
  showControls = true,
  showInfo = true,
  videoInfoComponent,
  videoControlsComponent,
  controlsPosition = 'topLeft',
  infoPosition = 'topRight',
  participant,
  backgroundColor,
  audioDecibels,
  parameters,
}) => {
  const [waveformAnimations, setWaveformAnimations] = useState(Array.from({ length: 9 }, () => 0));
  const [showWaveform, setShowWaveform] = useState(true);
  let { getUpdatedAllParams } = parameters;
  parameters = getUpdatedAllParams();

  useEffect(() => {
    const interval = setInterval(() => {
      let { audioDecibels, participants } = parameters;
      const existingEntry = audioDecibels && audioDecibels.find(entry => entry.name === name);
      participant = participants && participants.find(participant => participant.name === name);

      if (existingEntry && existingEntry.averageLoudness > 127.5 && participant && !participant.muted) {
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
    // Start animation when showWaveform is true
    if (showWaveform) {
      const animationInterval = setInterval(animateWaveform, 1000);
      return () => clearInterval(animationInterval);
    }
  }, [showWaveform]);


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

  const animateWaveform = () => {
    const animations = waveformAnimations.map((_, index) => setInterval(() => animateBar(index), getAnimationDuration(index) * 2));

    setWaveformAnimations(animations);
  };


  const resetWaveform = () => {
    setWaveformAnimations(Array.from({ length: 9 }, () => 0));
  };

  /**
 * getAnimationDuration - Get the duration for waveform animation.
 * @param {number} index - The index of the waveform animation.
 * @returns {number} - The duration for the waveform animation.
 */
  const getAnimationDuration = (index) => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 0;
  };


  /**
   * toggleAudio - Toggle audio for the participant.
   */
  const toggleAudio = async () => {
    // Toggle audio logic based on participant's state
    if (participant?.muted) {

    } else {
      // Participant is not muted, handle accordingly (mute, hide waveform, etc.)
      let { getUpdatedAllParams } = parameters
      parameters = getUpdatedAllParams()
      await controlMedia({ participantId: participant.id, participantName: participant.name, type: 'audio', parameters: parameters });
    }
  };

  /**
   * toggleVideo - Toggle video for the participant.
   */
  const toggleVideo = async () => {
    // Toggle video logic based on participant's state
    if (participant?.videoOn) {
      // Participant's video is on, handle accordingly (turn off video, etc.)
      let { getUpdatedAllParams } = parameters
      parameters = getUpdatedAllParams()
      await controlMedia({ participantId: participant.id, participantName: participant.name, type: 'video', parameters: parameters });
    } else {
      // Participant's video is off, handle accordingly (turn on video, etc.)
      //   console.log('Turning on video');
    }
  };
  /**
 * renderControls - Render video controls based on conditions.
 * @returns {React.Component} - Rendered video controls.
 */
  const renderControls = () => {
    if (!showControls) {
      return null;

    }

    // Use custom videoControlsComponent if provided, else use default controls
    const ControlsComponent = videoControlsComponent || (
      <div className="overlayControls">
        <button className="controlButton" onClick={toggleAudio}>
          <FontAwesomeIcon icon={participant?.muted ? faMicrophoneSlash : faMicrophone} size="lg" color={participant?.muted ? 'red' : 'green'} />
        </button>

        <button className="controlButton" onClick={toggleVideo}>
          <FontAwesomeIcon icon={participant?.videoOn ? faVideo : faVideoSlash} size="lg" color={participant?.videoOn ? 'green' : 'red'} />
        </button>
      </div>
    );

    return ControlsComponent;
  };

  return (
    <div className="card" style={{ ...customStyle, backgroundColor }}>
      {imageSource ? (
        <img src={imageSource} alt="Participant" style={{ ...imageStyle, borderRadius: roundedImage ? '20%' : '0', ...styles.backgroundImage }} />
      ) : (
        <MiniCard initials={name} fontSize={20} />
      )}


      {videoInfoComponent ? (
        videoInfoComponent
      ) : showInfo ? (
        <div className="overlay" style={{ ...getOverlayPosition(infoPosition), ...(showControls ? styles.overlayWeb : styles.overlayWebAlt) }}>
          <div style={styles.nameColumn}>
            <p style={{ color: textColor, ...styles.nameText }}>{name}</p>
          </div>
          {showWaveform && (
            <div style={{ ...styles.waveformWeb }}>
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

          )}
        </div>

      ) : null}

      {videoControlsComponent ? (
        videoControlsComponent
      ) : showControls ? (
        <div className="overlayControls" style={{ ...getOverlayPosition(controlsPosition), ...styles.overlayControls }}>
          {renderControls()}
        </div>
      ) : null}
    </div>
  );
};

const styles = {
  card: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
    border: '2px solid black',
    position: 'relative',
  },
  backgroundImage: {
    width: '80px',
    height: '80px',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: '50%',
    left: '50%',
    transform: [
      { translateY: -40 }, // Half of the height
      { translateX: -40 }, // Half of the width
    ],
  },
  overlayWeb: {
    position: 'absolute',
    minWidth: '50%',
    minHeight: '5%',
    maxHeight: '100%',
    display: 'grid',
    gridTemplateColumns: '4fr 2fr',
    gridGap: '3px',
    top: 0,
    right: 0,
  },
  overlayWebAlt: {
    position: 'absolute',
    minWidth: '50%',
    minHeight: '5%',
    maxHeight: '100%',
    display: 'grid',
    gridTemplateColumns: '4fr',
    gridGap: '0px',
    top: 0,
    right: 0,
  },
  overlayControls: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  controlButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '5px 10px',
    marginRight: '5px',
    fontSize: 'medium',
    border: 'none',
    cursor: 'pointer',
  },
  nameColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '5px',
    marginRight: '2px',
    fontSize: 'medium',
    textAlign: 'center',
  },
  nameText: {
    fontSize: 'medium',
    fontWeight: 'bold',
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
    padding: '5px',
    marginLeft: '5px',
    maxWidth: '25%',
  },
  bar: {
    flex: 1,
    opacity: 0.35,
    margin: '0 1px',
    transition: 'height 0.5s ease',
  },
};

export default AudioCard;

