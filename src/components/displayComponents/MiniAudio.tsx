import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getOverlayPosition } from "../../methods/utils/getOverlayPosition";

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(" ").trim();
  return filtered.length > 0 ? filtered : undefined;
};

const WAVEFORM_DURATIONS = [474, 433, 407, 458, 400, 427, 441, 419, 487];

export interface MiniAudioOptions {
  visible?: boolean;
  customStyle?: React.CSSProperties;
  name: string;
  showWaveform?: boolean;
  overlayPosition?: string;
  barColor?: string;
  textColor?: string;
  nameTextStyling?: React.CSSProperties;
  imageSource: string;
  roundedImage?: boolean;
  imageStyle?: React.CSSProperties;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  draggableContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  cardProps?: React.HTMLAttributes<HTMLDivElement>;
  overlayProps?: React.HTMLAttributes<HTMLDivElement>;
  waveformContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  barProps?: React.HTMLAttributes<HTMLDivElement>;
  nameContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  nameTextProps?: React.HTMLAttributes<HTMLSpanElement>;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  renderWrapper?: (options: {
    defaultWrapper: React.ReactNode;
    isVisible: boolean;
  }) => React.ReactNode;
  renderContainer?: (options: {
    defaultContainer: React.ReactNode;
    isDragging: boolean;
    position: { x: number; y: number };
  }) => React.ReactNode;
  renderCard?: (options: {
    defaultCard: React.ReactNode;
    hasImage: boolean;
  }) => React.ReactNode;
  renderWaveform?: (options: {
    defaultWaveform: React.ReactNode;
    showWaveform: boolean;
    animations: number[];
  }) => React.ReactNode;
}

export type MiniAudioType = (options: MiniAudioOptions) => React.JSX.Element;

/**
 * MiniAudio - A compact, draggable audio participant card with animated waveform visualization.
 * 
 * This component provides a feature-rich mini audio card for displaying audio participants with
 * visual feedback. It includes animated waveform visualization, drag-and-drop positioning, and
 * extensive customization options for styling and layout.
 * 
 * **Key Features:**
 * - **Animated Waveform**: Nine-bar waveform animation with configurable colors and timing
 * - **Drag-and-Drop**: Fully draggable with mouse interaction for repositioning
 * - **Visibility Control**: Toggle visibility without unmounting component
 * - **Image Display**: Participant avatar/image with rounded or square styling
 * - **Overlay Positioning**: Pre-configured overlay positions via getOverlayPosition utility
 * - **Custom Styling**: Comprehensive style customization for all elements
 * - **Name Display**: Participant name with customizable text styling
 * - **Waveform Toggle**: Show/hide waveform animation based on speaking state
 * - **Color Customization**: Configurable bar and text colors
 * - **HTML Attributes**: Granular control over wrapper, container, card, and element attributes
 * - **Render Hooks**: Complete override capability for wrapper, container, card, and waveform
 * - **Animation Management**: Automatic cleanup of intervals and timeouts
 * - **SSR Compatible**: Safe handling of browser-only APIs
 * 
 * @component
 * 
 * @param {MiniAudioOptions} props - Configuration options for MiniAudio
 * @param {boolean} [props.visible=true] - Controls visibility of the mini audio card
 * @param {React.CSSProperties} [props.customStyle] - Custom inline styles for wrapper element
 * @param {string} props.name - Participant name displayed on the card
 * @param {boolean} [props.showWaveform=false] - Controls visibility of animated waveform (typically based on speaking state)
 * @param {string} [props.overlayPosition] - Pre-configured overlay position ("topLeft", "topRight", "bottomLeft", "bottomRight", etc.)
 * @param {string} [props.barColor="red"] - Color for waveform bars
 * @param {string} [props.textColor="white"] - Color for participant name text
 * @param {React.CSSProperties} [props.nameTextStyling] - Custom styles for name text element
 * @param {string} props.imageSource - URL/path to participant avatar image
 * @param {boolean} [props.roundedImage=false] - Controls whether image has rounded corners
 * @param {React.CSSProperties} [props.imageStyle] - Custom styles for image element
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.wrapperProps] - HTML attributes for outermost wrapper
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.draggableContainerProps] - HTML attributes for draggable container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.cardProps] - HTML attributes for card element
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.overlayProps] - HTML attributes for overlay container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.waveformContainerProps] - HTML attributes for waveform container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.barProps] - HTML attributes for individual waveform bars
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.nameContainerProps] - HTML attributes for name container
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props.nameTextProps] - HTML attributes for name text
 * @param {React.ImgHTMLAttributes<HTMLImageElement>} [props.imageProps] - HTML attributes for image element
 * @param {(options: {defaultWrapper: React.ReactNode; isVisible: boolean}) => React.ReactNode} [props.renderWrapper] - Custom render function for wrapper
 * @param {(options: {defaultContainer: React.ReactNode; isDragging: boolean; position: {x: number; y: number}}) => React.ReactNode} [props.renderContainer] - Custom render function for draggable container
 * @param {(options: {defaultCard: React.ReactNode; hasImage: boolean}) => React.ReactNode} [props.renderCard] - Custom render function for card
 * @param {(options: {defaultWaveform: React.ReactNode; showWaveform: boolean; animations: number[]}) => React.ReactNode} [props.renderWaveform] - Custom render function for waveform
 * 
 * @returns {React.JSX.Element} The rendered mini audio component with waveform and drag support
 * 
 * @example
 * // Basic usage for audio participant
 * ```tsx
 * import React, { useState } from 'react';
 * import { MiniAudio } from 'mediasfu-reactjs';
 * 
 * const AudioParticipantCard = () => {
 *   const [isSpeaking, setIsSpeaking] = useState(false);
 * 
 *   return (
 *     <MiniAudio
 *       visible={true}
 *       name="Alice Johnson"
 *       showWaveform={isSpeaking}
 *       imageSource="/avatars/alice.jpg"
 *       barColor="#2ecc71"
 *       textColor="#ffffff"
 *       overlayPosition="topRight"
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Custom styled with rounded image
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { MiniAudio } from 'mediasfu-reactjs';
 * 
 * const CustomStyledMiniAudio = () => {
 *   const [isSpeaking, setIsSpeaking] = useState(false);
 * 
 *   useEffect(() => {
 *     // Simulate speaking detection
 *     const interval = setInterval(() => {
 *       setIsSpeaking(prev => !prev);
 *     }, 3000);
 *     return () => clearInterval(interval);
 *   }, []);
 * 
 *   return (
 *     <MiniAudio
 *       visible={true}
 *       name="Bob Smith"
 *       showWaveform={isSpeaking}
 *       imageSource="/avatars/bob.jpg"
 *       roundedImage={true}
 *       barColor={isSpeaking ? '#e74c3c' : '#95a5a6'}
 *       textColor="#ecf0f1"
 *       overlayPosition="bottomLeft"
 *       customStyle={{
 *         border: '2px solid #3498db',
 *         borderRadius: '12px',
 *         boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
 *       }}
 *       nameTextStyling={{
 *         fontSize: '14px',
 *         fontWeight: 'bold',
 *         textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
 *       }}
 *       imageStyle={{
 *         borderRadius: '50%',
 *         border: '3px solid #2ecc71'
 *       }}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Analytics tracking with drag monitoring
 * ```tsx
 * import React, { useState } from 'react';
 * import { MiniAudio } from 'mediasfu-reactjs';
 * 
 * const AnalyticsMiniAudio = () => {
 *   const [isSpeaking, setIsSpeaking] = useState(false);
 *   const [dragCount, setDragCount] = useState(0);
 * 
 *   return (
 *     <MiniAudio
 *       visible={true}
 *       name="Charlie Davis"
 *       showWaveform={isSpeaking}
 *       imageSource="/avatars/charlie.jpg"
 *       barColor="#f39c12"
 *       renderContainer={({ defaultContainer, isDragging, position }) => {
 *         React.useEffect(() => {
 *           if (isDragging) {
 *             setDragCount(prev => prev + 1);
 *             analytics.track('Mini Audio Dragged', {
 *               participantName: 'Charlie Davis',
 *               position,
 *               totalDrags: dragCount
 *             });
 *           }
 *         }, [isDragging]);
 * 
 *         return (
 *           <div style={{ position: 'relative' }}>
 *             {defaultContainer}
 *             {isDragging && (
 *               <div style={{
 *                 position: 'absolute',
 *                 top: -20,
 *                 left: 0,
 *                 fontSize: '12px',
 *                 color: '#fff',
 *                 backgroundColor: 'rgba(0,0,0,0.7)',
 *                 padding: '2px 6px',
 *                 borderRadius: '3px'
 *               }}>
 *                 Dragging...
 *               </div>
 *             )}
 *           </div>
 *         );
 *       }}
 *       renderWaveform={({ defaultWaveform, showWaveform, animations }) => {
 *         React.useEffect(() => {
 *           if (showWaveform) {
 *             analytics.track('Waveform Displayed', {
 *               participantName: 'Charlie Davis',
 *               activeAnimations: animations.filter(a => a > 0).length
 *             });
 *           }
 *         }, [showWaveform, animations]);
 * 
 *         return defaultWaveform;
 *       }}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, MiniAudio } from 'mediasfu-reactjs';
 * 
 * const CustomMiniAudioComponent = (props) => (
 *   <MiniAudio
 *     {...props}
 *     roundedImage={true}
 *     renderCard={({ defaultCard, hasImage }) => (
 *       <div className="custom-mini-audio-card">
 *         <div className="card-header">
 *           <span className="status-indicator" style={{
 *             width: '8px',
 *             height: '8px',
 *             borderRadius: '50%',
 *             backgroundColor: props.showWaveform ? '#2ecc71' : '#95a5a6',
 *             display: 'inline-block',
 *             marginRight: '8px'
 *           }} />
 *           <span className="participant-status">
 *             {props.showWaveform ? 'Speaking' : 'Listening'}
 *           </span>
 *         </div>
 *         <div className="card-content">
 *           {defaultCard}
 *         </div>
 *         {hasImage && (
 *           <div className="card-footer">
 *             <span style={{ fontSize: '12px', color: '#95a5a6' }}>
 *               🎤 Audio Only
 *             </span>
 *           </div>
 *         )}
 *       </div>
 *     )}
 *   />
 * );
 * 
 * const App = () => {
 *   const [credentials] = useState({
 *     apiUserName: 'user123',
 *     apiKey: 'your-api-key'
 *   });
 * 
 *   return (
 *     <MediasfuGeneric
 *       credentials={credentials}
 *       uiOverrides={{
 *         MiniAudio: CustomMiniAudioComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 */

const MiniAudio: React.FC<MiniAudioOptions> = ({
  visible = true,
  customStyle,
  name,
  showWaveform = false,
  overlayPosition,
  barColor = "red",
  textColor = "white",
  nameTextStyling,
  imageSource,
  roundedImage = false,
  imageStyle,
  wrapperProps,
  draggableContainerProps,
  cardProps,
  overlayProps,
  waveformContainerProps,
  // barProps,
  nameContainerProps,
  nameTextProps,
  imageProps,
  renderWrapper,
  renderContainer,
  renderCard,
  renderWaveform,
}) => {
  const [waveformAnimations, setWaveformAnimations] = useState<number[]>(() =>
    Array.from({ length: WAVEFORM_DURATIONS.length }, () => 0)
  );
  const intervalRefs = useRef<number[]>([]);
  const timeoutRefs = useRef<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const clearIntervals = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    intervalRefs.current.forEach((intervalId) => {
      window.clearInterval(intervalId);
    });
    intervalRefs.current = [];
  }, []);

  const clearTimeouts = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    timeoutRefs.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    timeoutRefs.current = [];
  }, []);

  const resetWaveform = useCallback(() => {
    setWaveformAnimations(
      Array.from({ length: WAVEFORM_DURATIONS.length }, () => 0)
    );
    clearIntervals();
    clearTimeouts();
  }, [clearIntervals, clearTimeouts]);

  const getAnimationDuration = useCallback((index: number) => {
    return WAVEFORM_DURATIONS[index] ?? 0;
  }, []);

  const animateBar = useCallback(
    (index: number) => {
      setWaveformAnimations((prevAnimations) => {
        const newAnimations = [...prevAnimations];
        newAnimations[index] = 1;
        return newAnimations;
      });

      if (typeof window === "undefined") {
        return;
      }

      const timeoutId = window.setTimeout(() => {
        setWaveformAnimations((prevAnimations) => {
          const newAnimations = [...prevAnimations];
          newAnimations[index] = 0;
          return newAnimations;
        });
      }, getAnimationDuration(index));

      timeoutRefs.current.push(timeoutId);
    },
    [getAnimationDuration]
  );

  useEffect(() => {
    if (!showWaveform) {
      resetWaveform();
      return undefined;
    }

    if (typeof window === "undefined") {
      return undefined;
    }

    clearIntervals();
    clearTimeouts();
    intervalRefs.current = Array.from(
      { length: WAVEFORM_DURATIONS.length },
      (_, index) =>
        window.setInterval(
          () => animateBar(index),
          getAnimationDuration(index) * 2
        )
    );

    return () => {
      clearIntervals();
      clearTimeouts();
    };
  }, [animateBar, clearIntervals, clearTimeouts, getAnimationDuration, showWaveform]);

  useEffect(() => () => {
    clearIntervals();
    clearTimeouts();
  }, [clearIntervals, clearTimeouts]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position.x, position.y]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) {
        return;
      }

      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    },
    [dragOffset.x, dragOffset.y, isDragging]
  );

  useEffect(() => {
    if (!isDragging) {
      return undefined;
    }

    if (typeof document === "undefined") {
      return undefined;
    }

    const handleMouseUpOutside = () => {
      setIsDragging(false);
      document.removeEventListener("mouseup", handleMouseUpOutside);
    };

    document.addEventListener("mouseup", handleMouseUpOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUpOutside);
    };
  }, [isDragging]);

  const overlayPositionStyles = useMemo(() => {
    if (!overlayPosition) {
      return undefined;
    }

    return getOverlayPosition({ position: overlayPosition });
  }, [overlayPosition]);

  const {
    className: wrapperClassName,
    style: wrapperStyleOverrides,
    ...restWrapperProps
  } = wrapperProps ?? {};

  const wrapperClassNames = joinClassNames(
    "mediasfu-mini-audio__wrapper",
    wrapperClassName
  );

  const {
    className: draggableClassName,
    style: draggableStyleOverrides,
    ...restDraggableProps
  } = draggableContainerProps ?? {};

  const draggableClassNames = joinClassNames(
    "mediasfu-mini-audio__draggable",
    draggableClassName
  );

  const draggableStyle: React.CSSProperties = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    ...styles.modalContainer,
    ...draggableStyleOverrides,
  };

  const {
    className: cardClassName,
    style: cardStyleOverrides,
    ...restCardProps
  } = cardProps ?? {};

  const cardClassNames = joinClassNames(
    "mediasfu-mini-audio__card",
    cardClassName
  );

  const cardStyle: React.CSSProperties = {
    ...styles.card,
    ...customStyle,
    ...cardStyleOverrides,
  };

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = joinClassNames(
    "mediasfu-mini-audio__overlay",
    overlayClassName
  );

  const overlayStyle: React.CSSProperties = {
    ...styles.overlayWeb,
    ...overlayPositionStyles,
    ...overlayStyleOverrides,
    display: showWaveform ? "grid" : "none",
  };

  const {
    className: waveformClassName,
    style: waveformStyleOverrides,
    ...restWaveformProps
  } = waveformContainerProps ?? {};

  const waveformClassNames = joinClassNames(
    "mediasfu-mini-audio__waveform",
    waveformClassName
  );

  const waveformStyle: React.CSSProperties = {
    ...styles.waveformWeb,
    ...waveformStyleOverrides,
  };

  // const {
  //   className: barClassName,
  //   // style: barStyleOverrides,
  //   // ...restBarProps
  // } = barProps ?? {};

  // const barClassNames = joinClassNames(
  //   "mediasfu-mini-audio__bar",
  //   barClassName
  // );

  const {
    className: nameContainerClassName,
    style: nameContainerStyleOverrides,
    ...restNameContainerProps
  } = nameContainerProps ?? {};

  const nameContainerClassNames = joinClassNames(
    "mediasfu-mini-audio__name-container",
    nameContainerClassName
  );

  const nameContainerStyle: React.CSSProperties = {
    ...styles.nameText,
    color: textColor,
    ...nameTextStyling,
    ...nameContainerStyleOverrides,
  };

  const {
    className: nameTextClassName,
    style: nameTextStyleOverrides,
    ...restNameTextProps
  } = nameTextProps ?? {};

  const nameTextClassNames = joinClassNames(
    "mediasfu-mini-audio__name-text",
    nameTextClassName
  );

  const nameTextStyle: React.CSSProperties = {
    ...nameTextStyleOverrides,
  };

  const hasImage = Boolean(imageSource);

  // Pulsing ring animation for voice activity
  const pulsingRings = showWaveform ? (
    <>
      <div
        style={{
          ...styles.bar,
          borderColor: barColor,
          animationDelay: "0s",
        }}
      />
      <div
        style={{
          ...styles.bar,
          borderColor: barColor,
          animationDelay: "0.5s",
        }}
      />
    </>
  ) : null;

  const imageElement = hasImage ? (
    <img
      src={imageSource}
      style={{
        ...styles.backgroundImage,
        ...(roundedImage ? styles.roundedImage : undefined),
        ...imageStyle,
        ...(imageProps?.style ?? {}),
      }}
      alt={imageProps?.alt ?? "Background"}
      {...imageProps}
    />
  ) : null;

  const nameContent = (
    <div
      className={nameContainerClassNames}
      style={nameContainerStyle}
      {...restNameContainerProps}
    >
      <span
        className={nameTextClassNames}
        style={nameTextStyle}
        {...restNameTextProps}
      >
        {name}
      </span>
    </div>
  );

  const defaultWaveform = (
    <div
      className={waveformClassNames}
      style={waveformStyle}
      {...restWaveformProps}
    >
      {pulsingRings}
      {imageElement}
    </div>
  );

  const waveformNode = renderWaveform
    ? renderWaveform({
        defaultWaveform,
        showWaveform,
        animations: waveformAnimations,
      })
    : defaultWaveform;

  const defaultCard = (
    <div
      className={cardClassNames}
      style={cardStyle}
      {...restCardProps}
    >
      {/* Avatar with pulsing voice activity ring */}
      <div
        className={overlayClassNames}
        style={overlayStyle}
        {...restOverlayProps}
      >
        {waveformNode}
      </div>
      {/* Name at bottom */}
      {nameContent}
      
      {/* CSS Animation for pulsing rings */}
      <style>
        {`
          @keyframes miniAudioPulse {
            0% {
              transform: scale(1);
              opacity: 0.6;
            }
            50% {
              transform: scale(1.15);
              opacity: 0.3;
            }
            100% {
              transform: scale(1.3);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );

  const cardNode = renderCard
    ? renderCard({ defaultCard, hasImage })
    : defaultCard;

  const defaultContainer = (
    <div
      className={draggableClassNames}
      style={draggableStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      {...restDraggableProps}
    >
      {cardNode}
    </div>
  );

  const containerNode = renderContainer
    ? renderContainer({ defaultContainer, isDragging, position })
    : defaultContainer;

  const wrapperStyle: React.CSSProperties = {
    display: visible ? "block" : "none",
    ...wrapperStyleOverrides,
  };

  const defaultWrapper = (
    <div
      className={wrapperClassNames}
      style={wrapperStyle}
      {...restWrapperProps}
    >
      {containerNode}
    </div>
  );

  const wrapperNode = renderWrapper
    ? renderWrapper({ defaultWrapper, isVisible: visible })
    : defaultWrapper;

  return <>{wrapperNode}</>;
};

const styles = {
  modalContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 0,
    margin: 0,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 8,
    elevation: 8,
  } as React.CSSProperties,
  card: {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    background: "linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: 12,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  overlayWeb: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  nameText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.95)",
    fontWeight: 600,
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4))",
    backdropFilter: "blur(4px)",
    width: "100%",
    display: "flex",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
    letterSpacing: "0.2px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
  waveformWeb: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderRadius: "50%",
    position: "relative",
  } as React.CSSProperties,
  bar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "50%",
    border: "2px solid",
    opacity: 0.6,
    animation: "miniAudioPulse 1.5s ease-in-out infinite",
  } as React.CSSProperties,
  backgroundImage: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    position: "relative",
    zIndex: 1,
  } as React.CSSProperties,
  roundedImage: {
    borderRadius: "50%",
  } as React.CSSProperties,
};

export default MiniAudio;
