/**
 * CardVideoDisplay - A React JS component for displaying video streams in a card layout.
 * @param {Object} props - The props passed to the CardVideoDisplay component.
 * @param {string} props.remoteProducerId - The ID of the remote producer.
 * @param {string} props.eventType - The type of event.
 * @param {boolean} props.forceFullDisplay - Flag to force full display.
 * @param {Object} props.videoStream - The video stream object.
 * @param {string} props.backgroundColor - The background color of the video container.
 * @param {boolean} props.doMirror - Flag to mirror the video display.
 * @returns {React.Component} - The CardVideoDisplay component.
 */

import React, { useEffect, useRef } from 'react';

const CardVideoDisplay = ({
  remoteProducerId,
  eventType,
  forceFullDisplay,
  videoStream,
  backgroundColor = 'transparent',
  doMirror

}) => {

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  /**
   * getReactPlayerStyle - Get styles for the ReactPlayer component.
   * @returns {Object} - Styles for video element.
   */
   
  const getVideoStyle = () => {
    const baseStyles = {
      width: forceFullDisplay ? '100%' : 'auto',
      height: '100%',
      objectFit: forceFullDisplay ? 'cover' : 'contain',
      backgroundColor: backgroundColor
    };

    if (doMirror) {
      baseStyles.transform = 'rotateY(180deg)';
    }

    return baseStyles;
  };


  return (
    <div style={{ ...styles.videoContainer, backgroundColor }}>
     <video ref={videoRef} autoPlay muted playsInline style={getVideoStyle()} />
    </div>
  );
};

const styles = {
  videoContainer: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  }
};

export default CardVideoDisplay;
