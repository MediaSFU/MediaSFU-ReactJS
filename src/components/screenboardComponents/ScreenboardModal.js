import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
// import './ScreenAnnotateModal.css';

const ScreenAnnotateModal = ({ 
  parameters, 
  isVisible, 
  onClose,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
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
    updateAnnotateScreenStream,
    updateProcessedScreenStream,
    updateMainScreenCanvas,


  } = parameters;


  const annotationInterval = useRef(null);
  const clonedStreamScreen = useRef(null);

  const screenVideoRef = useRef(null);
  const screenCanvasRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      showModal();
    } else {
      hideModal();
    }
  }, [isVisible]);

  const showModal = async () => {
    // console.log('showModal', annotateScreenStream);
    // annotateScreenStream = true;
    // shared = true;


    const annotate = annotateScreenStream;
    const screenVideo = screenVideoRef.current;
    try {
      if (annotate && shared) {
        screenVideo.classList.remove('d-none');
        await annotatationPreview();
        if (!transportCreated) {
          await createSendTransport({'option': 'screen',parameters});
        } else {
          try {
            await handleScreenTransport();
            await connectSendTransportScreen({stream: processedScreenStream,parameters});
          } catch (error) {
            console.error(error);
          }
        }
        await prepopulateUserMedia({name: hostLabel,parameters});
      } else {
        screenVideo.classList.add('d-none');
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
          } catch (error) {
          }
        if (shared) {
          if (!transportCreated) {
            await createSendTransport({'option': 'screen',parameters});
          } else {
            try {
              await disconnectSendTransportScreen({parameters});
              await sleep(500);
            } catch (error) {
              console.error(error);
            }
            if (localStreamScreen && localStreamScreen.getVideoTracks().length > 0 && localStreamScreen.getVideoTracks()[0].readyState === 'ended') {
              localStreamScreen.removeTrack(localStreamScreen.getVideoTracks()[0]);
              localStreamScreen.addTrack(clonedStreamScreen.current.getVideoTracks()[0].clone());
              updateLocalStreamScreen(localStreamScreen);
            }
            clonedStreamScreen.current.getVideoTracks()[0].onended = async function () {
              await disconnectSendTransportScreen({parameters});
              await stopShareScreen({parameters});
            };
            await connectSendTransportScreen({stream: localStreamScreen,parameters});
          }
        } else {
          await stopAllTracks();
        }
        await prepopulateUserMedia({name: hostLabel,parameters});
      }
      screenVideo.classList.add('d-none');
      if (mainScreenCanvas) {
        screenCanvasRef.current.classList.add('d-none');
      }
    } catch (error) {
      console.error(error, 'Error stopping the video stream');
    }
  };

  const annotatationPreview = async () => {
    const screenVideo = screenVideoRef.current;
    if (!mainScreenCanvas) {
        mainScreenCanvas = screenCanvasRef.current;
        updateMainScreenCanvas(mainScreenCanvas);
    }
    const annotate = annotateScreenStream;

    if (annotate && (!clonedStreamScreen.current || (clonedStreamScreen.current && clonedStreamScreen.current.getVideoTracks().length > 0 && clonedStreamScreen.current.getVideoTracks()[0].readyState === 'ended'))) {
      const originalTrack = localStreamScreen.getVideoTracks()[0];
      const originalSettings = originalTrack.getSettings();
      const cloned = await originalTrack.clone();
      cloned.applyConstraints({
        width: originalSettings.width,
        height: originalSettings.height,
        frameRate: originalSettings.frameRate,
        aspectRatio: originalSettings.aspectRatio,
      });
      clonedStreamScreen.current = new MediaStream([cloned]);
    }

    if (clonedStreamScreen.current && localStreamScreen && localStreamScreen.getVideoTracks().length > 0 && localStreamScreen.getVideoTracks()[0].readyState === 'ended') {
      localStreamScreen.removeTrack(localStreamScreen.getVideoTracks()[0]);
      localStreamScreen.addTrack(clonedStreamScreen.current.getVideoTracks()[0].clone());
    }

    const mediaCanvas = mainScreenCanvas;
    const ctx = mediaCanvas.getContext('2d');
    mediaCanvas.width = localStreamScreen.getVideoTracks()[0].getSettings().width;
    mediaCanvas.height = localStreamScreen.getVideoTracks()[0].getSettings().height;

    if (!annotate) {
      processedScreenStream = null;
      updateProcessedScreenStream(null);
    }

    const annotateVideo = clonedStreamScreen.current;
    if (annotateVideo && annotate) {
      screenVideo.style.width = `${annotateVideo.getVideoTracks()[0].getSettings().width}px`;
      screenVideo.style.height = `${annotateVideo.getVideoTracks()[0].getSettings().height}px`;
      screenVideo.srcObject = annotateVideo;
      await annotateImage(annotateVideo.getVideoTracks()[0]);
    }

    let canvasElement = canvasScreenboard;
    canvasElement.width = mediaCanvas.width;
    canvasElement.height = mediaCanvas.height;

    function drawCombined() {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      ctx.drawImage(screenVideo, 0, 0, canvasElement.width, canvasElement.height);
      ctx.drawImage(canvasElement, 0, 0, canvasElement.width, canvasElement.height);
      ctx.restore();
    }

    function captureStream(videoTrack) {
      const stream = mediaCanvas.captureStream(30);
      annotationInterval.current = setInterval(() => {
        drawCombined(videoTrack);
      }, 30);
      return stream;
    }

    async function annotateImage(videoTrack) {
      processedScreenStream = await captureStream(videoTrack);
      updateProcessedScreenStream(processedScreenStream);
    }
  };

  const handleScreenTransport = async () => {
    if (localStreamScreen.getVideoTracks().length > 0 && localStreamScreen.getVideoTracks()[0].id === screenProducer.track.id) {
      if (clonedStreamScreen.current && clonedStreamScreen.current.getVideoTracks().length > 0 && clonedStreamScreen.current.getVideoTracks()[0].readyState === 'ended') {
        clonedStreamScreen.current.removeTrack(clonedStreamScreen.current.getVideoTracks()[0]);
        clonedStreamScreen.current.addTrack(localStreamScreen.getVideoTracks()[0].clone());
      }
      localStreamScreen.removeTrack(localStreamScreen.getVideoTracks()[0]);
      localStreamScreen.addTrack(clonedStreamScreen.current.getVideoTracks()[0].clone());
    }
    await disconnectSendTransportScreen({parameters});
    await sleep(250);
  };

  const stopAnnotation = async () => {
    if (annotationInterval.current) {
      clearInterval(annotationInterval.current);
      annotationInterval.current = null;
    }

    if (processedScreenStream) {
      processedScreenStream.getTracks().forEach(track => track.stop());
      processedScreenStream = null;
      updateProcessedScreenStream(null)

    }

    if (mainScreenCanvas) {
        mainScreenCanvas.getContext('2d').clearRect(0, 0, mainScreenCanvas.width, mainScreenCanvas.height);
    }
  };

  const stopAllTracks = async () => {
    try {
      if (localStreamScreen && localStreamScreen.getVideoTracks().length > 0) {
        localStreamScreen.getVideoTracks().forEach(track => track.stop());
      }
    } catch (error) {
      console.error(error);
    }

    try {
      if (clonedStreamScreen.current && clonedStreamScreen.current.getVideoTracks().length > 0) {
        clonedStreamScreen.current.getVideoTracks().forEach(track => track.stop());
      }
    } catch (error) {
      console.error(error);
    }

    try {
      if (processedScreenStream) {
        processedScreenStream.getTracks().forEach(track => track.stop());
        updateProcessedScreenStream(null);
      }
    } catch (error) {
      console.error(error);
    }

    clonedStreamScreen.current = null;
  };
  const modalContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isVisible ? 'block' : 'none',
    zIndex: 999,
};

const screenWidth = window.innerWidth;
let modalWidth = 0.8 * screenWidth;
if (modalWidth > 500) {
    modalWidth = 500;
}

const modalContentStyle = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxWidth: modalWidth,
    maxHeight: '75%',
    overflowY: 'auto',
    overflowX: 'hidden',
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto',
};

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
            Screen Annotation
          </div>
          <div onClick={onClose} style={{ padding: 5 }}>
            <FontAwesomeIcon icon={faTimes} style={{ fontSize: 20, color: 'black' }} />
          </div>
        </div>
        <hr style={{ height: 1, backgroundColor: 'black', marginVertical: 5 }} />
        <div style={{ flex: 1 }}>
          <video ref={screenVideoRef} className="d-none" autoPlay />
          <canvas id="screenCanvas" ref={screenCanvasRef} />
        </div>
      </div>
    </div>
  );
};

export default ScreenAnnotateModal;
