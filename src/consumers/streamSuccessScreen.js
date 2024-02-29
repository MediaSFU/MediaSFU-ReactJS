/**

Handles the success scenario of sharing a screen stream.
@param {object} options - Options object containing function parameters.
@param {MediaStream} options.stream - The local screen stream to be shared.
@param {object} options.parameters - Additional parameters needed for the function.
@param {Socket} options.parameters.socket - The socket used for communication.
@param {Array} options.parameters.participants - Array containing information about participants.
@param {MediaStream} options.parameters.localStream - The local media stream containing video and audio tracks.
@param {boolean} options.parameters.transportCreated - Indicates whether a transport is created.
@param {boolean} options.parameters.transportCreatedVideo - Indicates whether a video transport is created.
@param {boolean} options.parameters.videoAlreadyOn - Indicates if video is already being used.
@param {boolean} options.parameters.videoAction - Indicates if there is an ongoing video action.
@param {object} options.parameters.videoParams - Parameters related to the video stream.
@param {MediaStream} options.parameters.localStreamVideo - The local video stream.
@param {string} options.parameters.defVideoID - The default video input device ID.
@param {string} options.parameters.userDefaultVideoInputDevice - The user's default video input device.
@param {object} options.parameters.params - Additional parameters related to the video stream.
@param {object} options.parameters.videoParamse - Additional parameters related to the video stream.
*/

export const streamSuccessScreen = async ({ stream, parameters }) => {

  let { getUpdatedAllParams } = parameters;
  parameters = await getUpdatedAllParams()

  let {
    socket,
    mediaDevices,
    transportCreated,
    localStreamScreen,
    screenAlreadyOn,
    screenAction,
    transportCreatedScreen,
    HostLabel,
    eventType,
    showAlert,
    shared,
    updateTransportCreatedScreen,
    updateScreenAlreadyOn,
    updateScreenAction,
    updateTransportCreated,
    updateLocalStreamScreen,
    updateShared,

    //mediasoup functions
    rePort,
    reorderStreams,
    prepopulateUserMedia,
    createSendTransport,
    connectSendTransportScreen,
    disconnectSendTransportScreen,
    stopShareScreen,
  


  } = parameters;

  // share screen on success
  localStreamScreen = await stream
  await updateLocalStreamScreen(localStreamScreen)


  try {
    //create transport if not created else connect transport
    if (!transportCreated) {
      await createSendTransport({ option: 'screen', parameters: { ...parameters, localStreamScreen } })
    } else {
      await connectSendTransportScreen({ stream: localStreamScreen, parameters: { ...parameters, localStreamScreen } })
    }

    
    //alert the socket that you are sharing screen
    await socket.emit('startScreenShare')

  } catch (error) {

    if (showAlert) {
      showAlert({
        message: error.message,
        type: 'danger',
        duration: 3000
      })
    }

  }


  //reupdate the screen display 
  try {

    await updateShared(true)
    await prepopulateUserMedia({ name: HostLabel, parameters: { ...parameters, localStreamScreen,shared:true  } })
  } catch (error) {
  }

  //update the participants array to reflect the change
  screenAlreadyOn = true;
  await updateScreenAlreadyOn(screenAlreadyOn)

  //reorder streams if required
  try {


    if (eventType == 'conference') {
      await reorderStreams({ add: false, screenChanged: true, parameters })
      await prepopulateUserMedia({ name: HostLabel, parameters })
    } else {
      await reorderStreams({ parameters })
    }

  } catch (error) {

    try {
      await rePort({ parameters })
    } catch (error) {
    }
  }

  //handle screen share end
  localStreamScreen.getVideoTracks()[0].onended = async function () {
    //supports both manual and automatic screen share end
    await disconnectSendTransportScreen({ parameters })
    await stopShareScreen({ parameters })
  }


  //if user requested to share screen, update the screenAction state
  if (screenAction == true) {
    screenAction = false;
  }
  updateScreenAction(screenAction)

  //update the transport created state
  transportCreatedScreen = true;
  updateTransportCreatedScreen(transportCreatedScreen)

  //update the states
  updateTransportCreated(transportCreated)


}