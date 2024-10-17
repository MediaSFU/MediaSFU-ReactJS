import React, { useEffect, useRef } from 'react';
import { EventType } from '../../@types/types';

export interface CardVideoDisplayOptions {
  remoteProducerId: string;
  eventType: EventType;
  forceFullDisplay: boolean;
  videoStream: MediaStream | null;
  backgroundColor?: string;
  doMirror?: boolean;
}

export type CardVideoDisplayType = (options: CardVideoDisplayOptions) => React.ReactNode;

/**
 * CardVideoDisplay - A React functional component that displays a video stream.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.forceFullDisplay - If true, the video will take up the full display area.
 * @param {MediaStream} props.videoStream - The media stream to be displayed in the video element.
 * @param {string} [props.backgroundColor='transparent'] - The background color of the video container.
 * @param {boolean} [props.doMirror=false] - If true, the video will be mirrored horizontally.
 *
 * @returns {JSX.Element} - The rendered video display component.
 */
const CardVideoDisplay: React.FC<CardVideoDisplayOptions> = ({
  forceFullDisplay,
  videoStream,
  backgroundColor = 'transparent',
  doMirror = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  /**
   * getVideoStyle - Get styles for the video element.
   * @returns {React.CSSProperties} - Styles for the video element.
   */
  const getVideoStyle = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      width: forceFullDisplay ? '100%' : 'auto',
      height: '100%',
      objectFit: forceFullDisplay ? 'cover' : 'contain',
      backgroundColor: backgroundColor,
      maxHeight: '100%',
      maxWidth: '100%',
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
  } as React.CSSProperties,
};

export default CardVideoDisplay;
