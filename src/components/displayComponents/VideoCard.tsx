/**
 * VideoCard - A React JS component for displaying a video card with customizable controls, information, and waveform animations.
 * @param {Object} props - The props passed to the VideoCard component.
 * @param {Object} props.customStyle - Custom styles for the VideoCard component.
 * @param {string} props.name - The name of the participant.
 * @param {string} props.barColor - The color of the waveform bar.
 * @param {string} props.textColor - The color of the text.
 * @param {string} props.imageSource - The image source for the participant.
 * @param {boolean} props.roundedImage - Flag to determine if the image should be rounded.
 * @param {Object} props.imageStyle - Custom styles for the participant image.
 * @param {string} props.remoteProducerId - The ID of the remote producer.
 * @param {string} props.eventType - The type of event.
 * @param {boolean} props.forceFullDisplay - Flag to force full display.
 * @param {Object} props.videoStream - The video stream object.
 * @param {boolean} props.showControls - Flag to show or hide controls.
 * @param {boolean} props.showInfo - Flag to show or hide participant information.
 * @param {React.Component} props.videoInfoComponent - Custom component for participant information.
 * @param {React.Component} props.videoControlsComponent - Custom component for video controls.
 * @param {string} props.controlsPosition - The position of controls (topLeft, topRight, bottomLeft, bottomRight).
 * @param {string} props.infoPosition - The position of participant information (topLeft, topRight, bottomLeft, bottomRight).
 * @param {Object} props.participant - The participant object.
 * @param {React.Component} props.RTCView - The RTCView component for Web platform.
 * @param {string} props.backgroundColor - The background color of the VideoCard.
 * @param {Object} props.audioDecibels - The audio decibels object.
 * @param {boolean} props.doMirror - Flag to mirror the video display.
 * @param {Object} props.parameters - Additional parameters for the VideoCard.
 * @returns {React.Component} - The VideoCard component.
 */



import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons'
import { controlMedia } from '../../consumers/controlMedia';
import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';
import CardVideoDisplay from './CardVideoDisplay';
import AudioDecibelCheck from './AudioDecibelCheck';


const VideoCard = ({
  customStyle,
  name,
  barColor = 'red',
  textColor = 'white',
  imageSource,
  roundedImage = false,
  imageStyle,
  remoteProducerId,
  eventType,
  forceFullDisplay,
  videoStream,
  showControls = true,
  showInfo = true,
  videoInfoComponent,
  videoControlsComponent,
  controlsPosition = 'topLeft',
  infoPosition = 'topRight',
  participant,
  RTCView,
  backgroundColor,
  audioDecibels,
  doMirror,
  parameters,
}) => {

  const [waveformAnimations, setWaveformAnimations] = useState(Array.from({ length: 9 }, () => 0));

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

  const [showWaveform, setShowWaveform] = useState(true);

  useEffect(() => {

    //check every 1 second if the name i sin audioDecibels and over 127.5
    const interval = setInterval(() => {

      let { getUpdatedAllParams } = parameters
      parameters = getUpdatedAllParams()

      let {
        audioDecibels,
        participants,
      } = parameters;

      const existingEntry = audioDecibels && audioDecibels.find(entry => entry.name === name);
      participant = participants && participants.find(participant => participant.name === name);

      // Check conditions and animate/reset the waveform accordingly.
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
    }
    else {
      setShowWaveform(true);
    }
  }
    , [participant?.muted]);

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

    const ControlsComponent = videoControlsComponent || (
      <div style={styles.overlayControls}>
        <button style={styles.controlButton} onClick={toggleAudio}>
          <FontAwesomeIcon icon={participant?.muted ? faMicrophoneSlash : faMicrophone} size={'sm'} color={participant?.muted ? "red" : "green"} />
        </button>

        <button style={styles.controlButton} onClick={toggleVideo}>
          <FontAwesomeIcon icon={participant?.videoOn ? faVideo : faVideoSlash} size={'sm'} color={participant?.videoOn ? "green" : "red"} />
        </button>
      </div>
    );

    return ControlsComponent;
  };

  return (
    <div style={{ ...styles.card, ...customStyle, backgroundColor: backgroundColor }}>
      <CardVideoDisplay
        remoteProducerId={remoteProducerId}
        eventType={eventType}
        forceFullDisplay={forceFullDisplay}
        videoStream={videoStream}
        backgroundColor={backgroundColor}
        doMirror={doMirror}
      />

      {videoInfoComponent ? (
        videoInfoComponent
      ) : showInfo ? (
        <div style={{ ...getOverlayPosition(infoPosition), ...(showControls ? styles.overlayWeb : styles.overlayWebAlt) }}>
          <div style={styles.nameColumn}>
            <span style={{ ...styles.nameText, color: textColor }}>{participant?.name}</span>
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
        <div style={{ ...styles.overlayControls, ...getOverlayPosition(controlsPosition) }}>
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
    backgroundColor: '#2c678f',
    border: '2px solid black',
    position: 'relative',
  },
  overlayWeb: {
    position: 'absolute',
    minWidth: '40%',
    minHeight: '5%',
    maxHeight: '100%',
    display: 'grid',
    gridTemplateColumns: '4fr 2fr',
    gridGap: '3px',
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '2px 4px',
    marginRight: '2px',
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
    fontSize: 'small',
    textAlign: 'center',
  },
  nameText: {
    fontSize: 'small',
    fontWeight: 'bolder',
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

export default VideoCard;
