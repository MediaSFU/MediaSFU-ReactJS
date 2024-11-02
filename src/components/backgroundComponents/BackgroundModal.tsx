
 
import React, { useEffect, useRef, FC } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation"; 
import { ConnectSendTransportVideoType, CreateSendTransportType, CreateSendTransportParameters, OnScreenChangesType,
  DisconnectSendTransportVideoType, OnScreenChangesParameters, ShowAlert, SleepType, VidCons, ConnectSendTransportVideoParameters, DisconnectSendTransportVideoParameters, } from "../../@types/types";
import { Producer, ProducerOptions } from "mediasoup-client/lib/types";

export interface BackgroundModalParameters extends CreateSendTransportParameters, ConnectSendTransportVideoParameters, DisconnectSendTransportVideoParameters, OnScreenChangesParameters {

  customImage: string;
  selectedImage: string;
  segmentVideo: MediaStream | null;
  selfieSegmentation: SelfieSegmentation | null;
  pauseSegmentation: boolean;
  processedStream: MediaStream | null;
  keepBackground: boolean;
  backgroundHasChanged: boolean;
  virtualStream: MediaStream | null;
  mainCanvas: HTMLCanvasElement | null;
  prevKeepBackground: boolean;
  appliedBackground: boolean;
  videoAlreadyOn: boolean;
  audioOnlyRoom: boolean;
  islevel: string;
  recordStarted: boolean;
  recordResumed: boolean;
  recordPaused: boolean;
  recordStopped: boolean;
  recordingMediaOptions: string;
  mediaDevices: MediaDevices;
  showAlert?: ShowAlert;
  localStreamVideo: MediaStream | null;
  vidCons: VidCons;
  frameRate: number;
  targetResolution: string;
  updateCustomImage: (image: string) => void;
  updateSelectedImage: (image: string) => void;
  updateSegmentVideo: (stream: MediaStream | null) => void;
  updateSelfieSegmentation: (
    segmentation: SelfieSegmentation | null
  ) => void;
  updatePauseSegmentation: (pause: boolean) => void;
  updateProcessedStream: (stream: MediaStream | null) => void;
  updateKeepBackground: (keep: boolean) => void;
  updateBackgroundHasChanged: (changed: boolean) => void;
  updateVirtualStream: (stream: MediaStream | null) => void;
  updatePrevKeepBackground: (prev: boolean) => void;
  updateAppliedBackground: (applied: boolean) => void;
  videoProducer: Producer | null;
  transportCreated: boolean;
  videoParams: ProducerOptions;
  updateVideoParams: (params: ProducerOptions) => void;
  autoClickBackground: boolean;
  updateAutoClickBackground: (autoClick: boolean) => void;
  
  // mediasfu functions
  createSendTransport: CreateSendTransportType;
  connectSendTransportVideo: ConnectSendTransportVideoType;
  disconnectSendTransportVideo: DisconnectSendTransportVideoType;
  onScreenChanges: OnScreenChangesType;
  sleep: SleepType;
  
  getUpdatedAllParams: () => BackgroundModalParameters;
  [key: string]: any;

}

export interface BackgroundModalOptions {
  isVisible: boolean;
  onClose: () => void;
  parameters: BackgroundModalParameters;
  position?: string;
  backgroundColor?: string;
}

// Export the type definition
export type BackgroundModalType = (props: BackgroundModalOptions) => JSX.Element

/**
 * BackgroundModal component provides a modal interface for managing background settings.
 * It allows users to select, upload, and apply background images or videos.
 *
 * @component
 * @param {BackgroundModalOptions} props - The properties for the BackgroundModal component.
 * @param {boolean} props.isVisible - Determines if the modal is visible.
 * @param {() => void} props.onClose - Function to close the modal.
 * @param {object} props.parameters - Various parameters and state management functions.
 * @param {string} [props.position="topLeft"] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor="#f5f5f5"] - Background color of the modal.
 *
 * @returns {JSX.Element | null} The rendered BackgroundModal component or null if not visible.
 *
 * @example
 * ```tsx
 * <BackgroundModal
 *   isVisible={true}
 *   onClose={handleClose}
 *   parameters={parameters}
 *   position="topRight"
 *   backgroundColor="#ffffff"
 * />
 * ```
 */

const BackgroundModal: React.FC<BackgroundModalOptions> = ({
  isVisible,
  onClose,
  parameters,
  position = "topLeft",
  backgroundColor = "#f5f5f5",
}) => {

  let {
    customImage,
    selectedImage,
    segmentVideo,
    selfieSegmentation,
    pauseSegmentation,
    processedStream,
    keepBackground,
    backgroundHasChanged,
    virtualStream,
    mainCanvas,
    prevKeepBackground,
    appliedBackground,
    videoAlreadyOn,
    audioOnlyRoom,
    islevel,
    recordStarted,
    recordResumed,
    recordPaused,
    recordStopped,
    recordingMediaOptions,
    mediaDevices,
    showAlert,
    localStreamVideo,
    vidCons,
    frameRate,
    targetResolution,
    updateCustomImage,
    updateSelectedImage,
    updateSegmentVideo,
    updateSelfieSegmentation,
    updatePauseSegmentation,
    updateProcessedStream,
    updateKeepBackground,
    updateBackgroundHasChanged,
    updateVirtualStream,

    updatePrevKeepBackground,
    updateAppliedBackground,
    videoProducer,
    transportCreated,
    videoParams,
    updateVideoParams,
    autoClickBackground,
    updateAutoClickBackground,

    createSendTransport,
    connectSendTransportVideo,
    disconnectSendTransportVideo,
    onScreenChanges,
    sleep,
  } = parameters;

  const defaultImagesContainerRef = useRef<HTMLDivElement>(null);
  const uploadImageInputRef = useRef<HTMLInputElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const captureVideoRef = useRef<HTMLVideoElement>(null);
  const loadingOverlayRef = useRef<HTMLDivElement>(null);
  const applyBackgroundButtonRef = useRef<HTMLButtonElement>(null);
  const saveBackgroundButtonRef = useRef<HTMLButtonElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    if (isVisible) {
      if (!selfieSegmentation) {
        preloadModel().catch(() => console.log("Error preloading model:"));
      }
      renderDefaultImages();
      if (selectedImage) {
        loadImageToCanvas(selectedImage, selectedImage);
      } else {
        clearCanvas();
      }
      saveBackgroundButtonRef.current?.classList.add("d-none");
      saveBackgroundButtonRef.current!.disabled = true;
      applyBackgroundButtonRef.current?.classList.remove("d-none");
      applyBackgroundButtonRef.current!.disabled = false;

      if (
        processedStream &&
        prevKeepBackground == keepBackground &&
        keepBackground &&
        appliedBackground
      ) {
        applyBackgroundButtonRef.current!.innerText = "Apply Background";
      } else {
        applyBackgroundButtonRef.current!.innerText = "Preview Background";
      }

      if (autoClickBackground) {
        applyBackground().then(async () => {
          await saveBackground();
          autoClickBackground = false;
          updateAutoClickBackground(autoClickBackground);
        });
      }
    } else {
      try {
        if (
          !appliedBackground ||
          (appliedBackground && !keepBackground) ||
          (appliedBackground && !videoAlreadyOn)
        ) {
          const refVideo = captureVideoRef.current;
          pauseSegmentation = true;
          updatePauseSegmentation(true);
          if (!videoAlreadyOn) {
            try {
              if (refVideo) {
                if (refVideo.srcObject instanceof MediaStream) {
                  refVideo.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
                }
                refVideo.srcObject = null;
              }

              if (segmentVideo) {
                segmentVideo
                  .getTracks()
                  .forEach((track: MediaStreamTrack) => track.stop());
                segmentVideo = null;
              }

              if (virtualStream) {
                virtualStream
                  .getTracks()
                  .forEach((track: MediaStreamTrack) => track.stop());
                virtualStream = null;
              }

              updateSegmentVideo(segmentVideo);
              updateVirtualStream(virtualStream);
            } catch { /* Handle error */}
          }
        }

        videoPreviewRef.current?.classList.add("d-none");
        backgroundCanvasRef.current?.classList.remove("d-none");
      } catch { /* Handle error */}
    }
  }, [isVisible]);

  const clonedStream = useRef<MediaStream | null>(null);
  const clonedTrack = useRef<MediaStreamTrack | null>(null);

  const renderDefaultImages = () => {
    const defaultImages = [
      'wall',
      'wall2',
      'shelf',
      'clock',
      'desert',
      'flower',
    ];

    const defaultImagesContainer = defaultImagesContainerRef.current;
    if (!defaultImagesContainer) return;

    defaultImagesContainer.innerHTML = "";

    defaultImages.forEach((baseName) => {
      const thumb = `https://mediasfu.com/images/backgrounds/${baseName}_thumbnail.jpg`;
      const small = `https://mediasfu.com/images/backgrounds/${baseName}_small.jpg`;
      const large = `https://mediasfu.com/images/backgrounds/${baseName}_large.jpg`;
      const full = `https://mediasfu.com/images/backgrounds/${baseName}.jpg`
      const img = document.createElement("img");
      img.src = thumb;
      img.classList.add("img-thumbnail", "m-1");
      img.style.width = "80px";
      img.style.cursor = "pointer";
      img.addEventListener("click", async () => {
        if (targetResolution == 'fhd' || targetResolution =='qhd') {
             await loadImageToCanvas(small, large);
        } else {
              await loadImageToCanvas(small, full);
        }
      });
      defaultImagesContainer.appendChild(img);
    });

    const noBackgroundImg = document.createElement("div");
    noBackgroundImg.classList.add(
      "img-thumbnail",
      "m-1",
      "d-flex",
      "align-items-center",
      "justify-content-center"
    );
    noBackgroundImg.style.width = "76px";
    noBackgroundImg.style.minHeight = "60px";
    noBackgroundImg.style.cursor = "pointer";
    noBackgroundImg.style.backgroundColor = "#f8f9fa";
    noBackgroundImg.style.border = "1px solid #dee2e6";
    noBackgroundImg.style.position = "relative";
    noBackgroundImg.innerHTML =
      '<span style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:#000;">None</span>';
    noBackgroundImg.addEventListener("click", () => {
      selectedImage = "";
      updateSelectedImage(selectedImage);
      updateCustomImage("");

      showLoading(); // Show loading indicator
      videoPreviewRef.current?.classList.add("d-none");
      backgroundCanvasRef.current?.classList.remove("d-none");
      clearCanvas();
      hideLoading(); // Hide loading indicator after loading
    });
    defaultImagesContainer.appendChild(noBackgroundImg);

    // Load custom image if it exists
    if (customImage) {
      const img = document.createElement("img");
      img.src = customImage;
      img.classList.add("img-thumbnail", "m-1");
      img.style.width = "80px";
      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        if (customImage) {
          loadImageToCanvas(customImage, customImage);
        }
      });
      defaultImagesContainer.appendChild(img);
    }
  };

  async function preloadModel() {
    selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    selfieSegmentation.setOptions({
      modelSelection: 1,
      selfieMode: false,
    });

    await selfieSegmentation.initialize();
    updateSelfieSegmentation(selfieSegmentation);
  }

  const showLoading = () => {
    loadingOverlayRef.current?.classList.remove("d-none");
  };

  const hideLoading = () => {
    loadingOverlayRef.current?.classList.add("d-none");
  };

  const clearCanvas = () => {
    const ctx = backgroundCanvasRef.current?.getContext("2d");
    if (!ctx || !backgroundCanvasRef.current) return;
    ctx.clearRect(
      0,
      0,
      backgroundCanvasRef.current.width,
      backgroundCanvasRef.current.height
    );
    ctx.font = "30px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "No Background",
      backgroundCanvasRef.current.width / 2,
      backgroundCanvasRef.current.height / 2
    );

    saveBackgroundButtonRef.current?.classList.add("d-none");
    applyBackgroundButtonRef.current?.classList.remove("d-none");
    applyBackgroundButtonRef.current!.disabled = false;
    if (
      processedStream &&
      prevKeepBackground == keepBackground &&
      keepBackground &&
      appliedBackground
    ) {
      applyBackgroundButtonRef.current!.innerText = "Apply Background";
    } else {
      applyBackgroundButtonRef.current!.innerText = "Preview Background";
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        // Validate file size
        if (file.size > 2048 * 2048) {
          // 2MB
          showAlert?.({
            message: "File size must be less than 2MB.",
            type: "danger",
          });
          return;
        }

        
        let minWidth = 1280;
        let minHeight = 1280;
        let maxWidth = 2560;
        let maxHeight = 2560;

        if (targetResolution == 'fhd') {
          minWidth = 1920;
          minHeight = 1920;
        } else if (targetResolution == 'qhd') {
          minWidth = 2560;
          minHeight = 2560;
        } // For other resolutions, stick to the default 1280x1280

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Validate image dimensions
          if ((img.width < minWidth || img.height < minHeight) || (img.width > maxWidth || img.height > maxHeight)) {
            showAlert?.({
              message: `Image dimensions must be at least ${minWidth}x${minHeight}.`,
              type: "danger",
            });
            return;
          }

          // Load valid image to canvas and set as custom image
          customImage = img.src;
          updateCustomImage(customImage);
          loadImageToCanvas(img.src, img.src);
        };

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            img.src = e.target.result.toString();
          }
        };
        reader.readAsDataURL(file);
      }
    } catch { /* Handle error */}
  };

  const loadImageToCanvas = async (src: string, fullSrc: string) => {
    showLoading();
    backgroundCanvasRef.current?.classList.remove("d-none");
    videoPreviewRef.current?.classList.add("d-none");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      const ctx = backgroundCanvasRef.current?.getContext("2d");
      if (!ctx || !backgroundCanvasRef.current) return;
      backgroundCanvasRef.current.width = img.width;
      backgroundCanvasRef.current.height = img.height;
      ctx.drawImage(img, 0, 0);
      removeBackground(img);
      hideLoading();
    };
    img.src = src;
    selectedImage = fullSrc;
    updateSelectedImage(selectedImage);

    saveBackgroundButtonRef.current?.classList.add("d-none");
    saveBackgroundButtonRef.current!.disabled = true;
    applyBackgroundButtonRef.current?.classList.remove("d-none");
    applyBackgroundButtonRef.current!.disabled = false;

    if (
      processedStream &&
      prevKeepBackground == keepBackground &&
      keepBackground &&
      appliedBackground
    ) {
      applyBackgroundButtonRef.current!.innerText = "Apply Background";
    } else {
      applyBackgroundButtonRef.current!.innerText = "Preview Background";
    }
  };

  const removeBackground = (img: HTMLImageElement) => {
    const ctx = backgroundCanvasRef.current?.getContext("2d");
    if (!ctx || !backgroundCanvasRef.current) return;
    ctx.clearRect(
      0,
      0,
      backgroundCanvasRef.current.width,
      backgroundCanvasRef.current.height
    );
    ctx.drawImage(img, 0, 0);
  };

  const applyBackground = async () => {
    if (audioOnlyRoom) {
      showAlert?.({
        message: "You cannot use a background in an audio only event.",
        type: "danger",
      });
      return;
    }

    showLoading();

    videoPreviewRef.current?.classList.remove("d-none");
    backgroundCanvasRef.current?.classList.add("d-none");

    const doSegmentation = !!selectedImage;
    pauseSegmentation = false;
    updatePauseSegmentation(false);
    await selfieSegmentationPreview(doSegmentation);
    hideLoading();

    applyBackgroundButtonRef.current?.classList.add("d-none");
    applyBackgroundButtonRef.current!.disabled = true;

    if (
      processedStream &&
      prevKeepBackground == keepBackground &&
      keepBackground &&
      appliedBackground
    ) {
      saveBackgroundButtonRef.current?.classList.add("d-none");
      saveBackgroundButtonRef.current!.disabled = true;
    } else {
      saveBackgroundButtonRef.current?.classList.remove("d-none");
      saveBackgroundButtonRef.current!.disabled = false;
    }
  };

  const selfieSegmentationPreview = async (doSegmentation: boolean) => {
    const refVideo = captureVideoRef.current;
    const previewVideo = videoPreviewRef.current;
    const virtualImage = new Image();
    virtualImage.crossOrigin = "anonymous";
    virtualImage.src = selectedImage || "";

    if (!mainCanvas) {
      mainCanvas = mainCanvasRef.current;
    }

    if (!mainCanvas || !refVideo || !previewVideo) return;

    const mediaCanvas = mainCanvas;
    mediaCanvas.width = refVideo.videoWidth;
    mediaCanvas.height = refVideo.videoHeight;
    let ctx = mediaCanvas.getContext("2d");

    backgroundHasChanged = true;
    updateBackgroundHasChanged(true);
    prevKeepBackground = keepBackground;
    updatePrevKeepBackground(keepBackground);

    if (!doSegmentation) {
      const tracks = processedStream?.getVideoTracks();
      tracks?.forEach((track: MediaStreamTrack) => track.stop());
      processedStream = null;
      keepBackground = false;
      updateProcessedStream(null);
      updateKeepBackground(false);
      previewVideo.classList.remove("d-none");
    }

    const segmentImage = async (videoElement: HTMLVideoElement) => {
      try {
        const processFrame = () => {
          if (
            !selfieSegmentation ||
            pauseSegmentation ||
            !videoElement ||
            videoElement.videoWidth === 0 ||
            videoElement.videoHeight === 0
          ) {
            return;
          }

          selfieSegmentation.send({ image: videoElement });
          requestAnimationFrame(processFrame);
        };

        videoElement.onloadeddata = () => {
          processFrame();
        };

        setTimeout(async () => {
          processedStream = mediaCanvas.captureStream(frameRate || 5);
          previewVideo.srcObject = processedStream;
          updateProcessedStream(processedStream);
          previewVideo.classList.remove("d-none");
          keepBackground = true;
          updateKeepBackground(keepBackground);

          if (previewVideo.paused) {
            try {
              await previewVideo.play();
            } catch { /* Handle error */}
          }
        }, 100);
      } catch { /* Handle error */}
    };

    if (videoAlreadyOn) {
      if (
        clonedTrack.current &&
        clonedTrack.current.readyState === "live" &&
        localStreamVideo!.getVideoTracks()[0]?.label ===
          clonedTrack.current?.label
      ) {
        // Use the cloned track
      } else {
        const localTracks = localStreamVideo!.getVideoTracks()[0];
        clonedTrack.current = localTracks.clone();
        if (clonedTrack.current) {
          clonedStream.current = new MediaStream([clonedTrack.current]);
        }
        segmentVideo = clonedStream.current;
        updateSegmentVideo(segmentVideo);
      }
      refVideo.srcObject = segmentVideo;
      if (refVideo.paused) {
        refVideo.play();
      }
      refVideo.width =
        segmentVideo!.getVideoTracks()[0]?.getSettings().width || 0;
      refVideo.height =
        segmentVideo!.getVideoTracks()[0]?.getSettings().height || 0;
      mediaCanvas.width = refVideo.width;
      mediaCanvas.height = refVideo.height;
      ctx = mediaCanvas.getContext("2d");

      try {
        if (doSegmentation) {
          await segmentImage(refVideo);
        } else {
          previewVideo.srcObject = clonedStream.current || localStreamVideo
        }
      } catch (error) {
        console.log("Error segmenting image:", error);
      }
    } else {
      if (
        segmentVideo &&
        segmentVideo.getVideoTracks()[0]?.readyState === "live"
      ) {
        // Use the existing segment video
      } else {
        try {
          const stream = await mediaDevices.getUserMedia({
            video: { ...vidCons, frameRate: { ideal: frameRate } },
            audio: false,
          });
          segmentVideo = stream;
          updateSegmentVideo(segmentVideo);
          refVideo.srcObject = segmentVideo;
          if (refVideo.paused) {
            refVideo.play();
          }
        } catch (error) {
          console.log("Error getting user media:", error);
        }

        refVideo.width =
          segmentVideo!.getVideoTracks()[0]?.getSettings().width || 0;
        refVideo.height =
          segmentVideo!.getVideoTracks()[0]?.getSettings().height || 0;
        mediaCanvas.width = refVideo.width;
        mediaCanvas.height = refVideo.height;
        ctx = mediaCanvas.getContext("2d");
      }

      try {
        if (doSegmentation) {
          await segmentImage(refVideo);
        } else {
          previewVideo.srcObject = refVideo.srcObject;
        }
      } catch { /* Handle error */}
    }

    let repeatPattern = 'no-repeat';
    try {
      if (virtualImage.width < mediaCanvas.width || virtualImage.height < mediaCanvas.height) {
        repeatPattern = 'repeat'; 
      }
    } catch {
      // Handle error
    }

    const onResults = (results: any) => {
      try {
        if (
          !pauseSegmentation &&
          mediaCanvas &&
          mediaCanvas.width > 0 &&
          mediaCanvas.height > 0 &&
          virtualImage &&
          virtualImage.width > 0 &&
          virtualImage.height > 0
        ) {
          ctx!.save();
          ctx!.clearRect(0, 0, mediaCanvas.width, mediaCanvas.height);
          ctx!.drawImage(
            results.segmentationMask,
            0,
            0,
            mediaCanvas.width,
            mediaCanvas.height
          );

          ctx!.globalCompositeOperation = "source-out";
          const pat = ctx!.createPattern(virtualImage, repeatPattern);
          ctx!.fillStyle = pat || "";
          ctx!.fillRect(0, 0, mediaCanvas.width, mediaCanvas.height);

          ctx!.globalCompositeOperation = "destination-atop";
          ctx!.drawImage(
            results.image,
            0,
            0,
            mediaCanvas.width,
            mediaCanvas.height
          );

          ctx!.restore();
        }
      } catch (error) {
        console.log("Error applying background:", error);
      }
    };

    if (!selfieSegmentation) {
      await preloadModel().catch(() => console.log("Error preloading model: "));
    }

    try {
      selfieSegmentation!.onResults(onResults);
    } catch { /* Handle error */}
  };

  const saveBackground = async () => {
    if (audioOnlyRoom) {
      showAlert?.({
        message: "You cannot use a background in an audio only event.",
        type: "danger",
      });
      return;
    } else if (backgroundHasChanged) {
      if (videoAlreadyOn) {
        if (islevel === "2" && (recordStarted || recordResumed)) {
          if (!(recordPaused || recordStopped)) {
            if (recordingMediaOptions === "video") {
              showAlert?.({
                message:
                  "Please pause the recording before changing the background.",
                type: "danger",
              });
              return;
            }
          }
        }

        if (keepBackground && selectedImage && processedStream) {
          virtualStream = processedStream;
          updateVirtualStream(virtualStream);
          videoParams = { track: virtualStream.getVideoTracks()[0] };
          updateVideoParams(videoParams);
        } else {
          if (
            localStreamVideo &&
            localStreamVideo.getVideoTracks()[0]?.readyState === "live"
          ) {
            videoParams = { track: localStreamVideo.getVideoTracks()[0] };
            updateVideoParams(videoParams);
          } else {
            try {
              if (
                localStreamVideo &&
                localStreamVideo.getVideoTracks()[0]?.readyState !== "live"
              ) {
                localStreamVideo.removeTrack(
                  localStreamVideo.getVideoTracks()[0]
                );
                const clonedTrack = segmentVideo?.getVideoTracks()[0]?.clone();
                if (clonedTrack) {
                  localStreamVideo.addTrack(clonedTrack);
                }
              }
            } catch (error) {
              console.log("Error handling local stream video:", error);
            }

            videoParams = {
              track: clonedStream.current?.getVideoTracks()[0] || undefined,
            };
            updateVideoParams(videoParams);
          }
        }

        if (keepBackground) {
          appliedBackground = true;
          updateAppliedBackground(appliedBackground);
        } else {
          appliedBackground = false;
          updateAppliedBackground(appliedBackground);
        }

        if (!transportCreated) {
          await createSendTransport({
            option: "video",
            parameters: { ...parameters, videoParams },
          });
        } else {
          try {
            if (videoProducer?.id) {
              if (videoProducer.track?.id !== videoParams.track?.id) {
                await disconnectSendTransportVideo({ parameters });
                await sleep({ms: 500});
              }
            }
            await connectSendTransportVideo({ videoParams, parameters });
          } catch { /* Handle error */}
        }
        await onScreenChanges({ changed: true, parameters });
      }
    }

    if (keepBackground) {
      appliedBackground = true;
      updateAppliedBackground(appliedBackground);
    } else {
      appliedBackground = false;
      updateAppliedBackground(appliedBackground);
    }

    saveBackgroundButtonRef.current?.classList.add("d-none");
    saveBackgroundButtonRef.current!.disabled = true;
  };

  const loadingOverlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // make sure it's on top of other elements
  };

  const Spinner: FC = () => {
    // Defining the style object with proper typing
    const spinnerStyle: React.CSSProperties = {
      width: "50px",
      height: "50px",
      border: "5px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      borderTop: "5px solid white",
      animation: "spin 1s linear infinite",
    };

    const keyframesStyle: string = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

    return (
      <>
        <style>{keyframesStyle}</style>
        <div style={spinnerStyle}></div>
      </>
    );
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
          <h2
            style={{ fontSize: "x-large", fontWeight: "bold", color: "black" }}
          >
            Background Settings
          </h2>
          <button
            onClick={onClose}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            <FontAwesomeIcon
              icon={faTimes}
              size="xl"
              style={{ fontSize: 20, color: "black" }}
            />
          </button>
        </div>
        <hr
          style={{
            height: 1,
            backgroundColor: "black",
            marginTop: 5,
            marginBottom: 5,
          }}
        />
        <div style={{ maxWidth: "95%", overflowX: "auto" }}>
          <div id="defaultImages" ref={defaultImagesContainerRef}></div>
          <div
            className="form-group"
            style={{ maxWidth: "70%", overflowX: "auto" }}
          >
            <label htmlFor="uploadImage">Upload Custom Image</label>
            <input
              type="file"
              className="form-control"
              id="uploadImage"
              ref={uploadImageInputRef}
              onChange={handleImageUpload}
            />
          </div>
          <canvas
            id="mainCanvas"
            ref={mainCanvasRef}
            className="d-none"
          ></canvas>
          <canvas
            id="backgroundCanvas"
            ref={backgroundCanvasRef}
            className="d-none"
            style={{
              width: "100%",
              maxWidth: "100%",
              height: "auto",
              backgroundColor: "transparent",
              border: "1px solid black",
            }}
          ></canvas>
          <video
            id="captureVideo"
            muted
            ref={captureVideoRef}
            className="d-none"
            autoPlay
            playsInline
          ></video>
          <video
            id="previewVideo"
            muted
            ref={videoPreviewRef}
            className="d-none"
            autoPlay
            playsInline
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              backgroundColor: "transparent",
              border: "1px solid black",
            }}
          ></video>
          <div
            id="loadingOverlay"
            ref={loadingOverlayRef}
            className="d-none"
            style={loadingOverlayStyle}
          >
            <Spinner />
          </div>
          <br />
          <button
            id="applyBackgroundButton"
            ref={applyBackgroundButtonRef}
            className="btn btn-primary"
            onClick={applyBackground}
          >
            Preview Background
          </button>
          <button
            id="saveBackgroundButton"
            ref={saveBackgroundButtonRef}
            className="btn btn-success d-none"
            onClick={saveBackground}
          >
            Save Background
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundModal;
