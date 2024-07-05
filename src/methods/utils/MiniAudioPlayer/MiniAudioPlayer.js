import React, { useEffect, useRef, useState } from 'react';

/**
 * MiniAudioPlayer component for displaying and managing audio streams in a video conference.
 *
 * @component
 *
 * @param {Object} props - The properties of the MiniAudioPlayer component.
 * @param {MediaStream} props.stream - The audio stream to be displayed.
 * @param {string} props.remoteProducerId - The ID of the remote producer associated with the audio stream.
 * @param {Object} props.parameters - Object containing various parameters and functions.
 * @param {React.Component} props.MiniAudioComponent - Custom component for rendering additional audio controls.
 * @param {Object} props.miniAudioProps - Separate props for the MiniAudioComponent.
 *
 * @returns {React.Component} Returns the MiniAudioPlayer component.
 */
const MiniAudioPlayer = ({
    stream,
    remoteProducerId,
    parameters,
    MiniAudioComponent,
    miniAudioProps,
}) => {

    const { getUpdatedAllParams } = parameters;
    let updatedParams = getUpdatedAllParams();
    let {
        meetingDisplayType,
        shared,
        shareScreenStarted,
        dispActiveNames,
        adminNameStream,
        participants,
        activeSounds,
        eventType,
        autoWave,
        updateActiveSounds,
        reUpdateInter,
        updateParticipantAudioDecibels,
        paginatedStreams,
        currentUserPage,

        breakOutRoomStarted,
        breakOutRoomEnded,
        limitedBreakRoom,
        
    } = updatedParams;

    const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)());

    const [showWaveModal, setShowWaveModal] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const autoWaveCheck = useRef(false);

    useEffect(() => {
        if (stream) {
            const analyser = audioContext.current.createAnalyser();
            analyser.fftSize = 32;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const source = audioContext.current.createMediaStreamSource(stream);
            source.connect(analyser);

            const intervalId = setInterval(() => {
                analyser.getByteTimeDomainData(dataArray);
                let averageLoudness = Array.from(dataArray).reduce((sum, value) => sum + value, 0) / bufferLength;

                let updatedParams = getUpdatedAllParams();
                let {
                    meetingDisplayType,
                    shared,
                    shareScreenStarted,
                    dispActiveNames,
                    adminNameStream,
                    participants,
                    activeSounds,
                    eventType,
                    autoWave,
                    updateActiveSounds,
                    paginatedStreams,
                    currentUserPage,
                } = updatedParams;

                let participant = participants.find(obj => obj.audioID === remoteProducerId);

                let audioActiveInRoom = true;
                if (participant) {
                  if (breakOutRoomStarted && !breakOutRoomEnded) {
                    //participant name must be in limitedBreakRoom
                    if (!limitedBreakRoom.map(obj => obj.name).includes(participant.name)) {
                      audioActiveInRoom = false;
                      averageLoudness = 127;
                    }
                  }
                }

                if (meetingDisplayType != 'video') {
                    autoWaveCheck.current = true;
                }
                if (shared || shareScreenStarted) {
                    autoWaveCheck.current = false;
                }

                if (participant) {

                    if (!participant.muted) {
                        setIsMuted(false)
                    } else {
                        setIsMuted(true)
                    }

                    updateParticipantAudioDecibels({
                        name: participant.name,
                        averageLoudness: averageLoudness,
                        parameters: updatedParams
                    })

                    const inPage = paginatedStreams[currentUserPage].findIndex(obj => obj.name == participant.name)

                    if (!dispActiveNames.includes(participant.name) && inPage == -1) {
                        autoWaveCheck.current = false
                        if (!adminNameStream) {
                            adminNameStream = participants.find(obj => obj.islevel == '2').name
                        }

                        if (participant.name == adminNameStream) {
                            autoWaveCheck.current = true
                        }

                    } else {
                        autoWaveCheck.current = true
                    }

                    if (participant.videoID || autoWaveCheck.current || audioActiveInRoom) {
                        setShowWaveModal(false)

                        if (averageLoudness > 127.5) {

                            if (!activeSounds.includes(participant.name)) {
                                activeSounds.push(participant.name);
                            }

                            if ((shareScreenStarted || shared) && !participant.videoID) {
                            } else {
                                reUpdateInter({
                                    name: participant.name,
                                    add: true,
                                    average: averageLoudness,
                                    parameters: updatedParams
                                })

                            }

                        } else {

                            if (activeSounds.includes(participant.name)) {
                                activeSounds.splice(activeSounds.indexOf(participant.name), 1);
                            }
                            if ((shareScreenStarted || shared) && !participant.videoID) {
                            } else {
                                reUpdateInter({
                                    name: participant.name,
                                    average: averageLoudness,
                                    parameters: updatedParams
                                })

                            }
                        }

                    } else {

                        if (averageLoudness > 127.5) {

                            if (!autoWave) {
                                setShowWaveModal(false)
                            } else {
                                setShowWaveModal(true)
                            }

                            if (!activeSounds.includes(participant.name)) {
                                activeSounds.push(participant.name);
                            }
                            if ((shareScreenStarted || shared) && !participant.videoID) {
                            } else {
                                reUpdateInter({
                                    name: participant.name,
                                    add: true,
                                    average: averageLoudness,
                                    parameters: updatedParams
                                })

                            }
                        } else {
                            setShowWaveModal(false)
                            if (activeSounds.includes(participant.name)) {
                                activeSounds.splice(activeSounds.indexOf(participant.name), 1);
                            }
                            if ((shareScreenStarted || shared) && !participant.videoID) {
                            } else {
                                reUpdateInter({
                                    name: participant.name,
                                    average: averageLoudness,
                                    parameters: updatedParams
                                })

                            }
                        }

                    }

                    updateActiveSounds(activeSounds)

                } else {


                    setShowWaveModal(false)
                    setIsMuted(true)

                }

            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [stream]);

    const renderMiniAudioComponent = () => {
        if (MiniAudioComponent) {
            return (
                <MiniAudioComponent
                    showWaveform={showWaveModal}
                    visible={showWaveModal && !isMuted}
                    {...miniAudioProps}
                />
            );
        }
        return null;
    };

    return (
        <div style={styles.container}>
            {stream && (
                <audio autoPlay={true} ref={(ref) => ref && (ref.srcObject = stream)} autoPlay playsInline />
            )}
            {renderMiniAudioComponent()}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9,
    },
};

export default MiniAudioPlayer;
