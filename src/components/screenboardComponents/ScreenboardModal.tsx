import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Producer } from "mediasoup-client/lib/types";
import {
  ConnectSendTransportScreenType,
  CreateSendTransportType,
  DisconnectSendTransportScreenType,
  PrepopulateUserMediaType,
  StopShareScreenType,
  SleepType,
  ConnectSendTransportScreenParameters,
  CreateSendTransportParameters,
  DisconnectSendTransportScreenParameters,
  PrepopulateUserMediaParameters,
  StopShareScreenParameters,
} from "../../@types/types";

// Define the types for the props
export interface ScreenboardModalParameters
  extends ConnectSendTransportScreenParameters,
    CreateSendTransportParameters,
    DisconnectSendTransportScreenParameters,
    PrepopulateUserMediaParameters,
    StopShareScreenParameters {
  localStreamScreen: MediaStream | null;
  shared: boolean;
  hostLabel: string;
  annotateScreenStream: boolean;
  processedScreenStream: MediaStream | null;
  mainScreenCanvas: HTMLCanvasElement | null;
  canvasScreenboard: HTMLCanvasElement | null;
  transportCreated: boolean;
  screenProducer: Producer | null;

  updateLocalStreamScreen: (stream: MediaStream | null) => void;
  updateProcessedScreenStream: (stream: MediaStream | null) => void;
  updateMainScreenCanvas: (canvas: HTMLCanvasElement | null) => void;

  // mediasfu functions
  sleep: SleepType;
  createSendTransport: CreateSendTransportType;
  disconnectSendTransportScreen: DisconnectSendTransportScreenType;
  connectSendTransportScreen: ConnectSendTransportScreenType;
  stopShareScreen: StopShareScreenType;
  prepopulateUserMedia: PrepopulateUserMediaType;

  getUpdatedAllParams: () => ScreenboardModalParameters;
  [key: string]: any;
}

export interface ScreenboardModalOptions {
  parameters: ScreenboardModalParameters;
  isVisible: boolean;
  onClose: () => void;
  position?: string;
  backgroundColor?: string;
}

export type ScreenboardModalType = (
  options: ScreenboardModalOptions
) => React.JSX.Element;

/**
 * ScreenboardModal - A modal component for managing screen annotation and drawing overlays.
 * 
 * This component provides an interactive interface for controlling screen annotation features during
 * screen sharing sessions. It manages the annotation stream lifecycle, canvas handling, transport
 * creation, and synchronization with the screen sharing infrastructure.
 * 
 * **Key Features:**
 * - **Annotation Toggle**: Enable/disable drawing annotations on shared screen with real-time updates
 * - **Stream Management**: Handles local screen stream, processed stream, and annotation canvas streams
 * - **Canvas Integration**: Manages mainScreenCanvas and canvasScreenboard for annotation rendering
 * - **Transport Lifecycle**: Creates, connects, and disconnects WebRTC transport for annotation streams
 * - **Screen Producer Control**: Manages screen producer for annotation stream broadcasting
 * - **Async Operations**: Proper sleep/delay handling for stream transitions
 * - **User Media Sync**: Prepopulates user media when annotation state changes
 * - **Host Indicators**: Displays host label for session context
 * - **Shared State Awareness**: Tracks shared/unshared states for proper annotation behavior
 * - **Modal Controls**: Close button with automatic canvas cleanup and transport disconnection
 * - **Flexible Positioning**: Configurable modal position (topRight, topLeft, bottomRight, bottomLeft)
 * - **Responsive Design**: Auto-sizing based on content with overlay behavior
 * 
 * @component
 * 
 * @param {ScreenboardModalOptions} props - Configuration options for ScreenboardModal
 * @param {ScreenboardModalParameters} props.parameters - Comprehensive parameters object containing:
 *   - **Stream State**: localStreamScreen, processedScreenStream
 *   - **Canvas State**: mainScreenCanvas, canvasScreenboard
 *   - **Session State**: shared, hostLabel, annotateScreenStream, transportCreated, screenProducer
 *   - **Update Functions**: updateLocalStreamScreen, updateProcessedScreenStream, updateMainScreenCanvas
 *   - **MediaSFU Functions**: sleep, createSendTransport, disconnectSendTransportScreen, connectSendTransportScreen, stopShareScreen, prepopulateUserMedia
 *   - **Context**: getUpdatedAllParams (returns current state)
 * @param {boolean} props.isVisible - Controls modal visibility
 * @param {() => void} props.onClose - Callback function invoked when modal is closed
 * @param {string} [props.position="topRight"] - Modal screen position (topRight, topLeft, bottomRight, bottomLeft)
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color for modal content
 * 
 * @returns {React.JSX.Element} The rendered ScreenboardModal component
 * 
 * @example
 * // Basic usage for screen annotation
 * ```tsx
 * import React, { useState } from 'react';
 * import { ScreenboardModal } from 'mediasfu-reactjs';
 * 
 * const BasicScreenAnnotation = () => {
 *   const [showModal, setShowModal] = useState(true);
 *   const [annotateEnabled, setAnnotateEnabled] = useState(false);
 * 
 *   const parameters = {
 *     localStreamScreen: new MediaStream(),
 *     shared: true,
 *     hostLabel: 'John (Host)',
 *     annotateScreenStream: annotateEnabled,
 *     processedScreenStream: null,
 *     mainScreenCanvas: null,
 *     canvasScreenboard: null,
 *     transportCreated: true,
 *     screenProducer: null,
 *     updateLocalStreamScreen: (stream) => console.log('Local stream updated'),
 *     updateProcessedScreenStream: (stream) => console.log('Processed stream updated'),
 *     updateMainScreenCanvas: (canvas) => console.log('Canvas updated'),
 *     sleep: async ({ ms }) => new Promise(resolve => setTimeout(resolve, ms)),
 *     createSendTransport: async (options) => console.log('Transport created'),
 *     disconnectSendTransportScreen: async (options) => console.log('Transport disconnected'),
 *     connectSendTransportScreen: async (options) => console.log('Transport connected'),
 *     stopShareScreen: async (options) => console.log('Screen share stopped'),
 *     prepopulateUserMedia: async (options) => console.log('User media prepopulated'),
 *     getUpdatedAllParams: () => parameters
 *   };
 * 
 *   return (
 *     <ScreenboardModal
 *       parameters={parameters}
 *       isVisible={showModal}
 *       onClose={() => setShowModal(false)}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Custom styled with position control
 * ```tsx
 * import React, { useState, useRef } from 'react';
 * import { ScreenboardModal } from 'mediasfu-reactjs';
 * 
 * const CustomStyledAnnotation = () => {
 *   const [showModal, setShowModal] = useState(true);
 *   const canvasRef = useRef<HTMLCanvasElement>(null);
 * 
 *   const handleAnnotationToggle = async () => {
 *     const canvas = canvasRef.current;
 *     if (!canvas) return;
 * 
 *     // Initialize canvas for annotation
 *     const ctx = canvas.getContext('2d');
 *     if (ctx) {
 *       ctx.strokeStyle = '#ff0000';
 *       ctx.lineWidth = 3;
 *     }
 *   };
 * 
 *   const parameters = {
 *     localStreamScreen: new MediaStream(),
 *     shared: true,
 *     hostLabel: 'Presenter',
 *     annotateScreenStream: false,
 *     processedScreenStream: null,
 *     mainScreenCanvas: null,
 *     canvasScreenboard: canvasRef.current,
 *     transportCreated: true,
 *     screenProducer: null,
 *     updateLocalStreamScreen: (stream) => {},
 *     updateProcessedScreenStream: (stream) => {},
 *     updateMainScreenCanvas: (canvas) => {},
 *     sleep: async ({ ms }) => new Promise(resolve => setTimeout(resolve, ms)),
 *     createSendTransport: async (options) => {},
 *     disconnectSendTransportScreen: async (options) => {},
 *     connectSendTransportScreen: async (options) => {},
 *     stopShareScreen: async (options) => {},
 *     prepopulateUserMedia: async (options) => {},
 *     getUpdatedAllParams: () => parameters
 *   };
 * 
 *   return (
 *     <>
 *       <canvas ref={canvasRef} style={{ display: 'none' }} />
 *       <ScreenboardModal
 *         parameters={parameters}
 *         isVisible={showModal}
 *         onClose={() => setShowModal(false)}
 *         position="bottomLeft"
 *         backgroundColor="#34495e"
 *       />
 *     </>
 *   );
 * };
 * ```
 * 
 * @example
 * // Analytics tracking for annotation usage
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { ScreenboardModal } from 'mediasfu-reactjs';
 * 
 * const AnalyticsScreenAnnotation = () => {
 *   const [showModal, setShowModal] = useState(true);
 *   const [annotateEnabled, setAnnotateEnabled] = useState(false);
 * 
 *   useEffect(() => {
 *     if (annotateEnabled) {
 *       analytics.track('Screen Annotation Enabled', {
 *         timestamp: new Date(),
 *         hostLabel: 'Presenter'
 *       });
 *     } else {
 *       analytics.track('Screen Annotation Disabled');
 *     }
 *   }, [annotateEnabled]);
 * 
 *   const parameters = {
 *     localStreamScreen: new MediaStream(),
 *     shared: true,
 *     hostLabel: 'Presenter',
 *     annotateScreenStream: annotateEnabled,
 *     processedScreenStream: null,
 *     mainScreenCanvas: null,
 *     canvasScreenboard: null,
 *     transportCreated: true,
 *     screenProducer: null,
 *     updateLocalStreamScreen: (stream) => {
 *       analytics.track('Local Stream Updated', { hasStream: !!stream });
 *     },
 *     updateProcessedScreenStream: (stream) => {
 *       analytics.track('Processed Stream Updated', { hasStream: !!stream });
 *     },
 *     updateMainScreenCanvas: (canvas) => {
 *       analytics.track('Canvas Updated', { hasCanvas: !!canvas });
 *     },
 *     sleep: async ({ ms }) => new Promise(resolve => setTimeout(resolve, ms)),
 *     createSendTransport: async (options) => {},
 *     disconnectSendTransportScreen: async (options) => {},
 *     connectSendTransportScreen: async (options) => {},
 *     stopShareScreen: async (options) => {},
 *     prepopulateUserMedia: async (options) => {},
 *     getUpdatedAllParams: () => parameters
 *   };
 * 
 *   return (
 *     <ScreenboardModal
 *       parameters={parameters}
 *       isVisible={showModal}
 *       onClose={() => {
 *         analytics.track('Screenboard Modal Closed');
 *         setShowModal(false);
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
 * import { MediasfuGeneric, ScreenboardModal } from 'mediasfu-reactjs';
 * 
 * const CustomScreenboardComponent = (props) => {
 *   const [annotationColor, setAnnotationColor] = useState('#ff0000');
 * 
 *   return (
 *     <div className="custom-screenboard-wrapper">
 *       <div className="annotation-controls">
 *         <label>Annotation Color:</label>
 *         <input
 *           type="color"
 *           value={annotationColor}
 *           onChange={(e) => setAnnotationColor(e.target.value)}
 *         />
 *         <div className="annotation-status">
 *           {props.parameters.annotateScreenStream ? '🎨 Drawing Active' : '⏸️ Drawing Paused'}
 *         </div>
 *       </div>
 *       <ScreenboardModal
 *         {...props}
 *         position="topLeft"
 *         backgroundColor={annotationColor + '33'} // Add transparency
 *       />
 *     </div>
 *   );
 * };
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
 *         ScreenboardModal: CustomScreenboardComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 */

const ScreenboardModal: React.FC<ScreenboardModalOptions> = ({
  parameters,
  isVisible,
  onClose,
  position = "topRight",
  backgroundColor = "#83c0e9",
}) => {
  parameters = parameters.getUpdatedAllParams();
  let {
    localStreamScreen,
    shared,
    createSendTransport,
    disconnectSendTransportScreen,
    connectSendTransportScreen,
    stopShareScreen,
    prepopulateUserMedia,
    hostLabel,

    annotateScreenStream,
    processedScreenStream,
    mainScreenCanvas,
    canvasScreenboard,
    transportCreated,
    sleep,
    screenProducer,

    updateLocalStreamScreen,
    updateProcessedScreenStream,
    updateMainScreenCanvas,
  } = parameters;

  const annotationInterval = useRef<number | null>(null);
  const clonedStreamScreen = useRef<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const showModal = async () => {
    const annotate = annotateScreenStream;
    const screenVideo = screenVideoRef.current;

    try {
      if (annotate && shared) {
        screenVideo?.classList.remove("d-none");
        annotatationPreview();
        setTimeout(async () => {
          if (!transportCreated) {
            await createSendTransport({ option: "screen", parameters });
          } else {
            try {
              await handleScreenTransport();
              await sleep({ ms: 250 });
            } catch (error) {
              console.error(error);
            }
            await connectSendTransportScreen({
              stream: processedScreenStream!,
              parameters,
            });
          }
          await prepopulateUserMedia({ name: hostLabel, parameters });
        }, 100);
      } else {
        screenVideo?.classList.add("d-none");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const hideModal = async () => {
    const annotate = annotateScreenStream;
    const screenVideo = screenVideoRef.current;

    try {
      if (!annotate) {
        try {
          await stopAnnotation();
        } catch {
          // Handle error
        }

        if (shared) {
          if (!transportCreated) {
            await createSendTransport({ option: "screen", parameters });
          } else {
            try {
              await disconnectSendTransportScreen({ parameters });
              await sleep({ ms: 500 });
            } catch (error) {
              console.error(error);
            }

            if (
              localStreamScreen &&
              localStreamScreen.getVideoTracks().length > 0 &&
              localStreamScreen.getVideoTracks()[0].readyState === "ended"
            ) {
              localStreamScreen.removeTrack(
                localStreamScreen.getVideoTracks()[0]
              );
              localStreamScreen.addTrack(
                clonedStreamScreen.current!.getVideoTracks()[0].clone()
              );
              updateLocalStreamScreen(localStreamScreen);
            }

            clonedStreamScreen.current!.getVideoTracks()[0].onended =
              async () => {
                await disconnectSendTransportScreen({ parameters });
                await stopShareScreen({ parameters });
              };

            await connectSendTransportScreen({
              stream: localStreamScreen!,
              parameters,
            });
          }
        } else {
          await stopAllTracks();
        }

        await prepopulateUserMedia({ name: hostLabel, parameters });
      }

      screenVideo?.classList.add("d-none");
      if (mainScreenCanvas) {
        screenCanvasRef.current?.classList.add("d-none");
      }
    } catch (error) {
      console.error(error, "Error stopping the video stream");
    }
  };

  useEffect(() => {
    if (isVisible) {
      showModal();
    } else {
      hideModal();
    }
  }, [isVisible]);

  const annotatationPreview = () => {
    const screenVideo = screenVideoRef.current;

    if (!mainScreenCanvas) {
      const canvas: HTMLCanvasElement = screenCanvasRef.current!;
      mainScreenCanvas = canvas;
      updateMainScreenCanvas(canvas!);
    }

    const annotate = annotateScreenStream;

    if (
      annotate &&
      (!clonedStreamScreen.current ||
        (clonedStreamScreen.current &&
          clonedStreamScreen.current.getVideoTracks().length > 0 &&
          clonedStreamScreen.current.getVideoTracks()[0].readyState ===
            "ended"))
    ) {
      const originalTrack = localStreamScreen!.getVideoTracks()[0];
      const originalSettings = originalTrack.getSettings();
      const cloned = originalTrack.clone();
      cloned.applyConstraints({
        width: originalSettings.width,
        height: originalSettings.height,
        frameRate: originalSettings.frameRate,
        aspectRatio: originalSettings.aspectRatio,
      });
      clonedStreamScreen.current = new MediaStream([cloned]);
    }

    if (
      clonedStreamScreen.current &&
      localStreamScreen &&
      localStreamScreen.getVideoTracks().length > 0 &&
      localStreamScreen.getVideoTracks()[0].readyState === "ended"
    ) {
      localStreamScreen.removeTrack(localStreamScreen.getVideoTracks()[0]);
      localStreamScreen.addTrack(
        clonedStreamScreen.current.getVideoTracks()[0].clone()
      );
    }

    if (clonedStreamScreen.current) {
      clonedStreamScreen.current.getVideoTracks()[0].onended = async () => {
        await disconnectSendTransportScreen({ parameters });
        await stopShareScreen({ parameters });
      };
    }
    
    const mediaCanvas = mainScreenCanvas!;
    const ctx = mediaCanvas!.getContext("2d")!;
    mediaCanvas!.width = localStreamScreen!
      .getVideoTracks()[0]
      .getSettings().width!;
    mediaCanvas!.height = localStreamScreen!
      .getVideoTracks()[0]
      .getSettings().height!;

    if (!annotate) {
      processedScreenStream = null;
      updateProcessedScreenStream(null);
    }

    const annotateVideo = clonedStreamScreen.current;
    if (annotateVideo && annotate) {
      screenVideo!.style.width = `${
        annotateVideo.getVideoTracks()[0].getSettings().width
      }px`;
      screenVideo!.style.height = `${
        annotateVideo.getVideoTracks()[0].getSettings().height
      }px`;
      screenVideo!.srcObject = annotateVideo;
      annotateImage();
    }

    const canvasElement = canvasScreenboard;
    canvasElement!.width = mediaCanvas!.width;
    canvasElement!.height = mediaCanvas!.height;

    function drawCombined() {
      ctx.clearRect(0, 0, canvasElement!.width, canvasElement!.height);
      ctx.drawImage(
        screenVideo!,
        0,
        0,
        canvasElement!.width,
        canvasElement!.height
      );
      ctx.drawImage(
        canvasElement!,
        0,
        0,
        canvasElement!.width,
        canvasElement!.height
      );
      ctx.restore();
    }

    async function captureStream() {
      const stream = mediaCanvas!.captureStream(30);
      annotationInterval.current = window.setInterval(() => {
        drawCombined();
      }, 30);
      return stream;
    }

    async function annotateImage() {
      processedScreenStream = await captureStream();
      updateProcessedScreenStream(processedScreenStream);
    }
  };

  const handleScreenTransport = async () => {
    if (
      localStreamScreen!.getVideoTracks().length > 0 &&
      localStreamScreen!.getVideoTracks()[0].id === screenProducer?.track!.id
    ) {
      if (
        clonedStreamScreen.current &&
        clonedStreamScreen.current.getVideoTracks().length > 0 &&
        clonedStreamScreen.current.getVideoTracks()[0].readyState === "ended"
      ) {
        clonedStreamScreen.current.removeTrack(
          clonedStreamScreen.current.getVideoTracks()[0]
        );
        clonedStreamScreen.current.addTrack(
          localStreamScreen!.getVideoTracks()[0].clone()
        );
      }

      localStreamScreen!.removeTrack(localStreamScreen!.getVideoTracks()[0]);
      localStreamScreen!.addTrack(
        clonedStreamScreen!.current!.getVideoTracks()[0].clone()
      );
    }

    await disconnectSendTransportScreen({ parameters });
  };

  const stopAnnotation = async () => {
    if (annotationInterval.current) {
      clearInterval(annotationInterval.current);
      annotationInterval.current = null;
    }

    if (processedScreenStream) {
      processedScreenStream.getTracks().forEach((track) => track.stop());
      processedScreenStream = null;
      updateProcessedScreenStream(null);
    }

    if (mainScreenCanvas) {
      mainScreenCanvas
        .getContext("2d")
        ?.clearRect(0, 0, mainScreenCanvas.width, mainScreenCanvas.height);
    }
  };

  const stopAllTracks = async () => {
    try {
      if (localStreamScreen && localStreamScreen.getVideoTracks().length > 0) {
        localStreamScreen.getVideoTracks().forEach((track) => track.stop());
        localStreamScreen = null;
        updateLocalStreamScreen(null);
      }
    } catch (error) {
      console.error(error);
    }

    try {
      if (
        clonedStreamScreen.current &&
        clonedStreamScreen.current.getVideoTracks().length > 0
      ) {
        clonedStreamScreen.current
          .getVideoTracks()
          .forEach((track) => track.stop());
      }
    } catch (error) {
      console.error(error);
    }

    try {
      if (processedScreenStream) {
        processedScreenStream.getTracks().forEach((track) => track.stop());
        processedScreenStream = null;
        updateProcessedScreenStream(null);
      }
    } catch (error) {
      console.error(error);
    }

    clonedStreamScreen.current = null;
  };

  const modalContainerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isVisible ? "block" : "none",
    zIndex: 999,
  };

  const screenWidth = window.innerWidth;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 500) {
    modalWidth = 500;
  }

  const modalContentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxWidth: modalWidth,
    maxHeight: "75%",
    overflowY: "auto",
    overflowX: "hidden",
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
            Screen Annotation
          </div>
          <div onClick={onClose} style={{ padding: 5 }}>
            <FontAwesomeIcon
              icon={faTimes}
              style={{ fontSize: 20, color: "black" }}
            />
          </div>
        </div>
        <hr
          style={{
            height: 1,
            backgroundColor: "black",
            marginTop: 5,
            marginBottom: 5,
          }}
        />
        <div style={{ flex: 1 }}>
          <video ref={screenVideoRef} className="d-none" autoPlay muted />
          <canvas id="screenCanvas" ref={screenCanvasRef} />
        </div>
      </div>
    </div>
  );
};

export default ScreenboardModal;
