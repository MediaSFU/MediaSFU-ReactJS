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
 * CardVideoDisplay - A React functional component that displays a video stream with configurable display options.
 *
 * This component renders a video element from a provided `MediaStream`, allowing options such as mirroring the video, setting a background color, and controlling whether the video fills the display area.
 *
 * @component
 * @param {CardVideoDisplayOptions} props - The properties object for CardVideoDisplay.
 * @param {string} props.remoteProducerId - The ID of the remote producer for tracking the video stream source.
 * @param {EventType} props.eventType - Type of the event, used for handling different video stream conditions.
 * @param {boolean} props.forceFullDisplay - If true, the video fills the display area.
 * @param {MediaStream | null} props.videoStream - The media stream to be displayed in the video element.
 * @param {string} [props.backgroundColor='transparent'] - Background color for the video container.
 * @param {boolean} [props.doMirror=false] - If true, the video is mirrored horizontally.
 *
 * @returns {React.JSX.Element} The rendered video display component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { CardVideoDisplay } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const mediaStream = new MediaStream(); // Example media stream
 *
 *   return (
 *     <CardVideoDisplay
 *       remoteProducerId="producer-123"
 *       eventType="live"
 *       forceFullDisplay={true}
 *       videoStream={mediaStream}
 *       backgroundColor="black"
 *       doMirror={true}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
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
