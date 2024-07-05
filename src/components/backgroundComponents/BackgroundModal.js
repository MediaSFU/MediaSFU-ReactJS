import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation'; // Ensure correct import path

/**
 * Represents a background modal component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isVisible - Indicates whether the modal is visible or not.
 * @param {Function} props.onClose - The function to be called when the modal is closed.
 * @param {Object} props.parameters - The parameters object containing various properties and functions.
 * @param {string} [props.position='topLeft'] - The position of the modal.
 * @param {string} [props.backgroundColor='#f5f5f5'] - The background color of the modal.
 * @returns {JSX.Element} The background modal component.
 */
const BackgroundModal = ({
    isVisible,
    onClose,
    parameters,
    position = 'topLeft',
    backgroundColor = '#f5f5f5',
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
        updateCustomImage,
        updateSelectedImage,
        updateSegmentVideo,
        updateSelfieSegmentation,
        updatePauseSegmentation,
        updateProcessedStream,
        updateKeepBackground,
        updateBackgroundHasChanged,
        updateVirtualStream,
        updateMainCanvas,
        updatePrevKeepBackground,
        updateAppliedBackground,
        videoProducer,
        transportCreated,
        videoParams,
        updateVideoParams,
        autoClickBackground,
        updateAutoClickBackground,
       
        //mediasfu functions
        createSendTransport,
        connectSendTransportVideo,
        disconnectSendTransportVideo,
        onScreenChanges,
        sleep,
    } = parameters;

    const defaultImagesContainerRef = useRef(null);
    const uploadImageInputRef = useRef(null);
    const backgroundCanvasRef = useRef(null);
    const videoPreviewRef = useRef(null);
    const captureVideoRef = useRef(null);
    const loadingOverlayRef = useRef(null);
    const applyBackgroundButtonRef = useRef(null);
    const saveBackgroundButtonRef = useRef(null);
    const mainCanvasRef = useRef(null);


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

    useEffect(() => {

        if (isVisible) {
            if (!selfieSegmentation) {
                preloadModel().catch(err => console.log('Error preloading model:'));
            }
            renderDefaultImages();
            if (selectedImage) {
                loadImageToCanvas(selectedImage, selectedImage);
            } else {
                clearCanvas();
            }
            saveBackgroundButtonRef.current.classList.add('d-none');
            saveBackgroundButtonRef.current.disabled = true;
            applyBackgroundButtonRef.current.classList.remove('d-none');
            applyBackgroundButtonRef.current.disabled = false;

            if (processedStream && (prevKeepBackground == keepBackground) && keepBackground && appliedBackground) {
                applyBackgroundButtonRef.current.innerText = 'Apply Background';
            } else {
                applyBackgroundButtonRef.current.innerText = 'Preview Background';
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

                if (!appliedBackground || (appliedBackground && !keepBackground) || (appliedBackground && !videoAlreadyOn)) {
                    const refVideo = captureVideoRef.current;
                    // stopSegmentation();
                    pauseSegmentation = true;
                    updatePauseSegmentation(true);
                    if (!videoAlreadyOn) {
                        try {
                            if (refVideo) {
                                refVideo.srcObject.getTracks().forEach(track => track.stop());
                                refVideo.srcObject = null;
                            }

                            if (segmentVideo) {
                                segmentVideo.getTracks().forEach(track => track.stop());
                                segmentVideo = null;
                            }

                            if (virtualStream) {
                                virtualStream.getTracks().forEach(track => track.stop());
                                virtualStream = null;
                            }

                            updateSegmentVideo(segmentVideo);
                            updateVirtualStream(virtualStream);
                        } catch (error) {

                        }
                    }

                }

                videoPreviewRef.current.classList.add('d-none');
                backgroundCanvasRef.current.classList.remove('d-none');
            } catch (error) {
            }
        }
    }, [isVisible]);

    const clonedStream = useRef(null);
    const clonedTrack = useRef(null);

    const renderDefaultImages = () => {
        const defaultImages = [
            { full: 'https://mediasfu.com/images/backgrounds/wall.png', thumb: 'https://mediasfu.com/images/backgrounds/wall_thumbnail.png', small: 'https://mediasfu.com/images/backgrounds/wall_small.png' },
            { full: 'https://mediasfu.com/images/backgrounds/shelf.png', thumb: 'https://mediasfu.com/images/backgrounds/shelf_thumbnail.png', small: 'https://mediasfu.com/images/backgrounds/shelf_small.png' },
            { full: 'https://mediasfu.com/images/backgrounds/clock.png', thumb: 'https://mediasfu.com/images/backgrounds/clock_thumbnail.png', small: 'https://mediasfu.com/images/backgrounds/clock_small.png' },
            { full: 'https://mediasfu.com/images/backgrounds/desert.jpg', thumb: 'https://mediasfu.com/images/backgrounds/desert_thumbnail.jpg', small: 'https://mediasfu.com/images/backgrounds/desert_small.jpg' },
            { full: 'https://mediasfu.com/images/backgrounds/flower.jpg', thumb: 'https://mediasfu.com/images/backgrounds/flower_thumbnail.jpg', small: 'https://mediasfu.com/images/backgrounds/flower_small.jpg' },
        ];
        
        const defaultImagesContainer = defaultImagesContainerRef.current;
        defaultImagesContainer.innerHTML = '';

        defaultImages.forEach(({ full, small, thumb }) => {
            const img = document.createElement('img');
            img.src = thumb;
            img.classList.add('img-thumbnail', 'm-1');
            img.style.width = '80px';
            img.style.cursor = 'pointer';
            img.addEventListener('click', async () => {
                await loadImageToCanvas(small, full);
            });
            defaultImagesContainer.appendChild(img);
        });

        const noBackgroundImg = document.createElement('div');
        noBackgroundImg.classList.add('img-thumbnail', 'm-1', 'd-flex', 'align-items-center', 'justify-content-center');
        noBackgroundImg.style.width = '76px';
        noBackgroundImg.style.minHeight = '60px';
        noBackgroundImg.style.cursor = 'pointer';
        noBackgroundImg.style.backgroundColor = '#f8f9fa';
        noBackgroundImg.style.border = '1px solid #dee2e6';
        noBackgroundImg.style.position = 'relative';
        noBackgroundImg.innerHTML = '<span style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:#000;">None</span>';
        noBackgroundImg.addEventListener('click', () => {
            selectedImage = null;
            updateSelectedImage(selectedImage);
            updateCustomImage(null);

            showLoading(); // Show loading indicator
            videoPreviewRef.current.classList.add('d-none');
            backgroundCanvasRef.current.classList.remove('d-none');
            clearCanvas();
            hideLoading(); // Hide loading indicator after loading
        });
        defaultImagesContainer.appendChild(noBackgroundImg);

        // Load custom image if it exists
        if (customImage) {
            const img = document.createElement('img');
            img.src = customImage;
            img.classList.add('img-thumbnail', 'm-1');
            img.style.width = '80px';
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                loadImageToCanvas(customImage, customImage);
            });
            defaultImagesContainer.appendChild(img);
        }
    };

    async function preloadModel() {
        selfieSegmentation = new SelfieSegmentation({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
        });

        selfieSegmentation.setOptions({
            modelSelection: 1,
            selfieMode: false,
        });


        await selfieSegmentation.initialize();
        updateSelfieSegmentation(selfieSegmentation);
    };

    // Show loading indicator
    const showLoading = () => {
        loadingOverlayRef.current.classList.remove('d-none');
    };

    // Hide loading indicator
    const hideLoading = () => {
        loadingOverlayRef.current.classList.add('d-none');
    };

    // Clear canvas and write "No Background" text
    const clearCanvas = () => {
        const ctx = backgroundCanvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, backgroundCanvasRef.current.width, backgroundCanvasRef.current.height);
        ctx.font = '30px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('No Background', backgroundCanvasRef.current.width / 2, backgroundCanvasRef.current.height / 2);

        saveBackgroundButtonRef.current.classList.add('d-none');
        applyBackgroundButtonRef.current.classList.remove('d-none');
        applyBackgroundButtonRef.current.disabled = false;
        if (processedStream && (prevKeepBackground === keepBackground) && keepBackground && appliedBackground) {
            applyBackgroundButtonRef.current.innerText = 'Apply Background';
        } else {
            applyBackgroundButtonRef.current.innerText = 'Preview Background';
        }
    };

    // Handle image upload
    const handleImageUpload = (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                // Validate file size
                if (file.size > 2048 * 2048) { // 2MB
                    showAlert({ message: 'File size must be less than 2MB.', type: 'danger' });
                    return;
                }

                const img = new Image();
                img.onload = () => {
                    // Validate image dimensions
                    if (img.width !== 1280 || img.height !== 1280) {
                        showAlert({ message: 'Image dimensions must be 1280x1280.', type: 'danger' });
                        return;
                    }

                    // Load valid image to canvas and set as custom image
                    customImage = img.src;
                    updateCustomImage(customImage);
                    loadImageToCanvas(img.src, img.src);
                };

                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        } catch (error) {
        }
    };

    // Load image to canvas
    const loadImageToCanvas = async (src, fullSrc) => {
        showLoading(); // Show loading indicator
        // Remove the d-none class from the backgroundCanvas and apply it to the videoPreview
        backgroundCanvasRef.current.classList.remove('d-none');
        videoPreviewRef.current.classList.add('d-none');

        const img = await new Image();
        img.onload = async () => {
            const ctx = await backgroundCanvasRef.current.getContext('2d');
            backgroundCanvasRef.current.width = img.width;
            backgroundCanvasRef.current.height = img.height;
            await ctx.drawImage(img, 0, 0);
            // Perform background removal
            await removeBackground(img);
            hideLoading(); // Hide loading indicator after loading
        };
        img.src = await src;
        selectedImage = await fullSrc;
        updateSelectedImage(selectedImage);

        saveBackgroundButtonRef.current.classList.add('d-none');
        saveBackgroundButtonRef.current.disabled = true;
        applyBackgroundButtonRef.current.classList.remove('d-none');
        applyBackgroundButtonRef.current.disabled = false;

        if (processedStream && (prevKeepBackground === keepBackground) && keepBackground && appliedBackground) {
            applyBackgroundButtonRef.current.innerText = 'Apply Background';
        } else {
            applyBackgroundButtonRef.current.innerText = 'Preview Background';
        }
    };

    // Background removal logic
    const removeBackground = (img) => {
        const ctx = backgroundCanvasRef.current.getContext('2d');
        // Just add the image to the canvas for now
        ctx.clearRect(0, 0, backgroundCanvasRef.current.width, backgroundCanvasRef.current.height);
        ctx.drawImage(img, 0, 0);
    };

    async function stopSegmentation() {

        if (processedStream) {
            const tracks = await processedStream.getVideoTracks();
            await tracks.forEach(track => track.stop());
            processedStream.srcObject = null;
            processedStream = null;
            updateProcessedStream(null);
        }

        // if (selfieSegmentation) {
        //     await selfieSegmentation.close();
        //     selfieSegmentation = null;
        //     updateSelfieSegmentation(selfieSegmentation);
        // }
    }

    // Apply background button handler
    const applyBackground = async () => {
        // Apply the background and preview it

        try {

            if (audioOnlyRoom) {
                showAlert({ message: 'You cannot use a background in an audio only event.', type: 'danger' });
                return;
            }

            showLoading(); // Show loading indicator

            videoPreviewRef.current.classList.remove('d-none'); // Show the preview video
            backgroundCanvasRef.current.classList.add('d-none');

            const doSegmentation = selectedImage ? true : false;
            pauseSegmentation = false;
            updatePauseSegmentation(false);
            await selfieSegmentationPreview(doSegmentation);
            hideLoading(); // Hide loading indicator after background applied

            applyBackgroundButtonRef.current.classList.add('d-none');
            applyBackgroundButtonRef.current.disabled = true;

            if (processedStream && (prevKeepBackground === keepBackground) && keepBackground && appliedBackground) {
                saveBackgroundButtonRef.current.classList.add('d-none');
                saveBackgroundButtonRef.current.disabled = true;
            } else {
                saveBackgroundButtonRef.current.classList.remove('d-none');
                saveBackgroundButtonRef.current.disabled = false;
            }
        } catch (error) {
        }

    };

    const selfieSegmentationPreview = async (doSegmentation) => {
        const refVideo = captureVideoRef.current;
        const previewVideo = videoPreviewRef.current;
        const virtualImage = await new Image();
        virtualImage.src = selectedImage;

        if (!mainCanvas) {
            mainCanvas = mainCanvasRef.current;
        }

        let mediaCanvas = mainCanvas;
        mediaCanvas.width = refVideo.videoWidth;
        mediaCanvas.height = refVideo.videoHeight;
        let ctx = mediaCanvas.getContext("2d");

        backgroundHasChanged = true;
        updateBackgroundHasChanged(true);
        prevKeepBackground = keepBackground;
        updatePrevKeepBackground(keepBackground);
        if (!doSegmentation) {
            // Just show the video
            const tracks = await processedStream.getVideoTracks();
            await tracks.forEach(track => track.stop());
            processedStream = null;
            keepBackground = false;
            updateProcessedStream(null);
            updateKeepBackground(false);
            previewVideo.classList.remove('d-none');

        }

        const segmentImage = (videoElement) => {

            try {
                const processFrame = () => {
                    if (!selfieSegmentation || pauseSegmentation || !videoElement || videoElement.videoWidth == 0 || videoElement.videoHeight == 0) {
                        return;
                    }


                    selfieSegmentation.send({ image: videoElement });

                    requestAnimationFrame(processFrame);
                };

                videoElement.onloadeddata = () => {
                    processFrame();
                };


                processedStream = mediaCanvas.captureStream(frameRate || 5);
                updateProcessedStream(processedStream);
                previewVideo.srcObject = processedStream;
                previewVideo.classList.remove('d-none');
                keepBackground = true;
                updateKeepBackground(keepBackground);
            } catch (error) {
            }

        };

        if (videoAlreadyOn) {
            if (clonedTrack.current && clonedTrack.current.readyState === 'live' && localStreamVideo.getVideoTracks()[0].label === clonedTrack.current.label) {
            } else {
                const localTracks = await localStreamVideo.getVideoTracks()[0];
                clonedTrack.current = await localTracks.clone();
                clonedStream.current = new MediaStream([clonedTrack.current]);
                segmentVideo = await clonedStream.current;
            }
            updateSegmentVideo(segmentVideo);
            refVideo.srcObject = await segmentVideo;
            refVideo.width = await segmentVideo.getVideoTracks()[0].getSettings().width;
            refVideo.height = await segmentVideo.getVideoTracks()[0].getSettings().height;
            mediaCanvas.width = refVideo.width;
            mediaCanvas.height = refVideo.height;
            ctx = mediaCanvas.getContext("2d");

            try {
                doSegmentation ? await segmentImage(refVideo) : previewVideo.srcObject = clonedStream.current ? clonedStream.current : localStreamVideo;
            } catch (error) {
                console.log('Error segmenting image:', error);
            }
        } else {
            if (segmentVideo && segmentVideo.getVideoTracks()[0].readyState === 'live') {
            } else {
                await mediaDevices.getUserMedia(
                    { video: { ...vidCons, frameRate: { ideal: frameRate } }, audio: false }
                ).then(async (stream) => {
                    segmentVideo = await stream;
                    updateSegmentVideo(segmentVideo);
                    refVideo.srcObject = await segmentVideo;
                }).catch((error) => {
                    console.log('Error getting user media:', error);
                });

                refVideo.width = await segmentVideo.getVideoTracks()[0].getSettings().width;
                refVideo.height = await segmentVideo.getVideoTracks()[0].getSettings().height;
                mediaCanvas.width = await refVideo.width;
                mediaCanvas.height = await refVideo.height;
                ctx = await mediaCanvas.getContext("2d");
            }


            try {
                doSegmentation ? await segmentImage(refVideo) : previewVideo.srcObject = refVideo.srcObject;
            } catch (error) {
            }
        }

        const onResults = (results) => {
            try {
                if (!pauseSegmentation && mediaCanvas && mediaCanvas.width > 0 && mediaCanvas.height > 0 && virtualImage && virtualImage.width > 0 && virtualImage.height > 0) {
                    ctx.save();
                    ctx.clearRect(0, 0, mediaCanvas.width, mediaCanvas.height);
                    ctx.drawImage(results.segmentationMask, 0, 0, mediaCanvas.width, mediaCanvas.height);

                    ctx.globalCompositeOperation = "source-out";
                    const pat = ctx.createPattern(virtualImage, 'no-repeat');
                    ctx.fillStyle = pat;
                    ctx.fillRect(0, 0, mediaCanvas.width, mediaCanvas.height);

                    // Only overwrite missing pixels.
                    ctx.globalCompositeOperation = "destination-atop";
                    ctx.drawImage(results.image, 0, 0, mediaCanvas.width, mediaCanvas.height);

                    ctx.restore();
                }
            } catch (error) {
            }
        };

        if (!selfieSegmentation) {
            await preloadModel().catch(err => console.log('Error preloading model: ' ));
        }

        try {
            selfieSegmentation.onResults(onResults);
        } catch (error) {
         
        }


    };

    // Save background button handler
    const saveBackground = async () => {
        // Save the selected changes and hide the modal

        if (audioOnlyRoom) {
            showAlert({ message: 'You cannot use a background in an audio only event.', type: 'danger' });
            return;
        } else if (backgroundHasChanged) {
            if (videoAlreadyOn) {
                // Replace the video stream with the processed stream
                if (islevel === '2' && ((recordStarted || recordResumed))) {
                    if (!(recordPaused || recordStopped)) {
                        if (recordingMediaOptions === 'video') {
                            showAlert({ message: 'Please pause the recording before changing the background.', type: 'danger' });
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
                    if (localStreamVideo && localStreamVideo.getVideoTracks()[0] && localStreamVideo.getVideoTracks()[0].readyState === 'live') {
                        videoParams = { track: localStreamVideo.getVideoTracks()[0] };
                        updateVideoParams(videoParams);
                    } else {
                        try {
                            if (localStreamVideo && localStreamVideo.getVideoTracks()[0] && localStreamVideo.getVideoTracks()[0].readyState !== 'live') {
                                // Replace the track with the cloned track
                                localStreamVideo.removeTrack(localStreamVideo.getVideoTracks()[0]);
                                localStreamVideo.addTrack(segmentVideo.getVideoTracks()[0].clone());
                            }
                        } catch (error) {
                            console.log('Error handling local stream video:', error);
                        }

                        videoParams = { track: clonedStream.current.getVideoTracks()[0] };
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
                    await createSendTransport({ option: 'video', parameters: { ...parameters, videoParams } });
                } else {
                    try {
                        if (videoProducer && videoProducer.id) {
                            if (videoProducer.track.id != videoParams.track.id) {
                                await disconnectSendTransportVideo({ parameters });
                                await sleep(500);
                            }
                        }
                        await connectSendTransportVideo({ videoParams, parameters });
                    } catch (error) {
                    }
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



        saveBackgroundButtonRef.current.classList.add('d-none');
        saveBackgroundButtonRef.current.disabled = true;
    };

    const loadingOverlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // make sure it's on top of other elements
    };


    const Spinner = () => {
        const spinnerStyle = {
            width: '50px',
            height: '50px',
            border: '5px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            borderTop: '5px solid white',
            animation: 'spin 1s linear infinite',
        };

        const keyframesStyle = `
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <h2 style={{ fontSize: 'x-large', fontWeight: 'bold', color: 'black' }}>Background Settings</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faTimes} size='xl' style={{ fontSize: 20, color: 'black' }} />
                    </button>
                </div>
                <hr style={{ height: 1, backgroundColor: 'black', marginVertical: 5 }} />
                <div style={{ maxWidth: '95%', overflowX: 'auto' }}>
                    <div id="defaultImages" ref={defaultImagesContainerRef}></div>
                    <div className="form-group" style={{ maxWidth: '70%', overflowX: 'auto' }}>
                        <label htmlFor="uploadImage">Upload Custom Image</label>
                        <input type="file" className="form-control" id="uploadImage" ref={uploadImageInputRef} onChange={handleImageUpload} />
                    </div>
                    <canvas id="mainCanvas" ref={mainCanvasRef} className="d-none"></canvas>
                    <canvas id="backgroundCanvas" ref={backgroundCanvasRef} className="d-none" style={{ width: '100%', maxWidth: '400px', height: 'auto', backgroundColor: 'transparent', border: '1px solid black' }}></canvas>
                    <video id="captureVideo" ref={captureVideoRef} className="d-none" autoPlay playsInline></video>
                    <video id="previewVideo" ref={videoPreviewRef} className="d-none" autoPlay playsInline style={{ width: '100%', maxWidth: '400px', height: 'auto', backgroundColor: 'transparent', border: '1px solid black' }}></video>
                    <div id="loadingOverlay" ref={loadingOverlayRef} className="d-none" style={loadingOverlayStyle}>
                        <Spinner />
                    </div>
                    <br />
                    <button id="applyBackgroundButton" ref={applyBackgroundButtonRef} className="btn btn-primary" onClick={applyBackground}>Preview Background</button>
                    <button id="saveBackgroundButton" ref={saveBackgroundButtonRef} className="btn btn-success d-none" onClick={saveBackground}>Save Background</button>
                </div>
            </div>
        </div>
    );
};

export default BackgroundModal;
