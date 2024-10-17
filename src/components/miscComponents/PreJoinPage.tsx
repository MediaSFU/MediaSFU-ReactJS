/**
 * PreJoinPage Component
 * 
 * The PreJoinPage component provides a user interface for users to either create or join a room for a media session. 
 * It allows users to input their display name, specify the duration, event type, and room capacity. Users can either 
 * create a new room or join an existing room.
 * 
 * Props:
 * - parameters: An object containing parameters such as showAlert, updateIsLoadingModalVisible, onWeb, connectSocket, 
 *               socket, updateSocket, updateValidated, updateApiUserName, updateApiToken, updateLink, updateRoomName, 
 *               updateMember, and validated.
 * 
 * - credentials: An object containing the API username and API key for the user's account.
 * State:
 * - isCreateMode: A boolean indicating whether the component is in create mode (true) or join mode (false).
 * - name: The display name entered by the user.
 * - duration: The duration of the event in minutes entered by the user.
 * - eventType: The type of event selected by the user (broadcast, chat, webinar, conference).
 * - capacity: The room capacity entered by the user.
 * - eventID: The event ID entered by the user.
 * - mediasfuURL: The URL of the media server.
 * - error: Any error message to be displayed to the user.
 * 
 * Methods:
 * - checkLimitsAndMakeRequest(): Checks API request limits and makes a request to connect to the room.
 * - handleToggleMode(): Toggles between create mode and join mode.
 * - handleCreateRoom(): Handles the creation of a new room based on user input.
 * - handleJoinRoom(): Handles joining an existing room based on user input.
 * 
 * @param {Object} parameters An object containing parameters such as showAlert, updateIsLoadingModalVisible, onWeb, 
 *                             connectSocket, socket, updateSocket, updateValidated, updateApiUserName, updateApiToken, 
 *                             updateLink, updateRoomName, updateMember, and validated.
 * @returns {JSX.Element} The rendered PreJoinPage component.
 */


import React, { useState } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const MAX_ATTEMPTS = 10; // Maximum number of unsuccessful attempts before rate limiting
const RATE_LIMIT_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const apiKey = 'yourAPIKEY'
const apiUserName = 'yourAPIUSERNAME'
const user_credentials = { apiUserName, apiKey };

async function joinRoomOnMediaSFU(payload, apiUserName, apiKey) {
    try {
      
        //check if apiUserName and apiKey are valid
        if (!apiUserName || !apiKey) {
            return { data: null, success: false };
        }

        //check if generic apiUserName and apiKey are used
        if (apiUserName === 'yourAPIUSERNAME' || apiKey === 'yourAPIKEY') {
            return { data: null, success: false };
        }

        //apiKey must be 64 characters long
        if (apiKey.length !== 64) {
            return { data: null, success: false };
        }

        if (apiUserName.length < 6) {
            return { data: null, success: false };
        }

        const response = await fetch('https://mediasfu.com/v1/rooms/', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiUserName + ':' + apiKey,
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        return { data, success: true };
    } catch (error) {

        return { data: null, success: false };
    }
}

async function createRoomOnMediaSFU(payload, apiUserName, apiKey) {
    try {

        //check if apiUserName and apiKey are valid
        if (!apiUserName || !apiKey) {
            return { data: null, success: false };
        }

        //check if generic apiUserName and apiKey are used
        if (apiUserName === 'yourAPIUSERNAME' || apiKey === 'yourAPIKEY') {
            return { data: null, success: false };
        }

        //apiKey must be 64 characters long
        if (apiKey.length !== 64) {
            return { data: null, success: false };
        }

        if (apiUserName.length < 6) {
            return { data: null, success: false };
        }


        const response = await fetch('https://mediasfu.com/v1/rooms/', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiUserName + ':' + apiKey,
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        return { data, success: true };
    } catch (error) {

        return { data: null, success: false };
    }
}

const PreJoinPage = ({ parameters, credentials = user_credentials }) => {

    const [isCreateMode, setIsCreateMode] = useState(false);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [eventType, setEventType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [eventID, setEventID] = useState('');
    const [error, setError] = useState('');

    let { showAlert, updateIsLoadingModalVisible, onWeb, connectSocket, socket, updateSocket, updateValidated,
        updateApiUserName, updateApiToken, updateLink, updateRoomName, updateMember, validated } = parameters;


    const checkLimitsAndMakeRequest = async ({ apiUserName, apiToken, link, apiKey = "", userName }) => {
        const TIMEOUT_DURATION = 10000; // 10 seconds

        let unsuccessfulAttempts = parseInt(cookies.get('unsuccessfulAttempts')) || 0;
        let lastRequestTimestamp = parseInt(cookies.get('lastRequestTimestamp')) || 0;

        if (unsuccessfulAttempts >= MAX_ATTEMPTS) {
            if (Date.now() - lastRequestTimestamp < RATE_LIMIT_DURATION) {
                if (showAlert) {
                    showAlert({
                        message: 'Too many unsuccessful attempts. Please try again later.',
                        type: 'danger',
                        duration: 3000,
                    });
                }
                cookies.set('lastRequestTimestamp', Date.now().toString());
                return;
            } else {
                unsuccessfulAttempts = 0;
                cookies.set('unsuccessfulAttempts', unsuccessfulAttempts.toString());
                cookies.set('lastRequestTimestamp', Date.now().toString());
            }
        }

        try {
            updateIsLoadingModalVisible(true);

            const socketPromise = connectSocket(apiUserName, apiKey, apiToken, link);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), TIMEOUT_DURATION)
            );

            const socket = await Promise.race([socketPromise, timeoutPromise]);

            if (socket && socket.id) {
                unsuccessfulAttempts = 0;
                cookies.set('unsuccessfulAttempts', unsuccessfulAttempts.toString());
                cookies.set('lastRequestTimestamp', Date.now().toString());
                await updateSocket(socket);
                await updateApiUserName(apiUserName);
                await updateApiToken(apiToken);
                await updateLink(link);
                await updateRoomName(apiUserName);
                await updateMember(userName);
                await updateValidated(true);
            } else {
                unsuccessfulAttempts += 1;
                cookies.set('unsuccessfulAttempts', unsuccessfulAttempts.toString());
                cookies.set('lastRequestTimestamp', Date.now().toString());
                updateIsLoadingModalVisible(false);

                if (unsuccessfulAttempts >= MAX_ATTEMPTS) {
                    if (showAlert) {
                        showAlert({
                            message: 'Too many unsuccessful attempts. Please try again later.',
                            type: 'danger',
                            duration: 3000,
                        });
                    }
                } else {
                    if (showAlert) {
                        showAlert({
                            message: 'Invalid credentials.',
                            type: 'danger',
                            duration: 3000,
                        });
                    }
                }
            }
        } catch (error) {

            if (showAlert) {
                showAlert({
                    message: 'Unable to connect. Check your credentials and try again.',
                    type: 'danger',
                    duration: 3000,
                });
            }

            unsuccessfulAttempts += 1;
            cookies.set('unsuccessfulAttempts', unsuccessfulAttempts.toString());
            cookies.set('lastRequestTimestamp', Date.now().toString());
            updateIsLoadingModalVisible(false);
        }
    };

    const handleToggleMode = () => {
        setIsCreateMode(prevMode => !prevMode);
        setError('');
    };

    const handleCreateRoom = async () => {

        try {

            setError('');

            if (!name || !duration || !eventType || !capacity) {
                setError('Please fill all the fields.');
                return;
            }

            // Call API to create room
            const payload = {
                action: 'create',
                duration: parseInt(duration),
                capacity: parseInt(capacity),
                eventType,
                userName: name
            };

            updateIsLoadingModalVisible(true);

            const response = await createRoomOnMediaSFU(payload, credentials?.apiUserName, credentials?.apiKey);

            if (response.success) {
                // Handle successful room creation
                await checkLimitsAndMakeRequest({ apiUserName: response.data.roomName, apiToken: response.data.secret, link: response.data.link, userName: name });
                setError('');
            } else {
                // Handle failed room creation
                updateIsLoadingModalVisible(false);

                if (showAlert) {
                    showAlert({
                        message: `Unable to create room. ${response.data ? response.data.message : ''}`,
                        type: 'danger',
                        duration: 3000,
                    });
                } else {
                    setError(`Unable to create room. ${response.data ? response.data.message : ''}`);
                }
            }

        } catch (error) {

            updateIsLoadingModalVisible(false);

            if (showAlert) {
                showAlert({
                    message: `Unable to connect. ${error.message}`,
                    type: 'danger',
                    duration: 3000,
                });
            } else {
                setError(`Unable to connect.  ${error.message}`);
            }

        }

    };

    const handleJoinRoom = async () => {

        try {

            setError('');

            if (!name || !eventID) {
                setError('Please fill all the fields.');
                return;
            }

            // Call API to join room
            const payload = {
                action: 'join',
                meetingID: eventID,
                userName: name
            };

            updateIsLoadingModalVisible(true);

            const response = await joinRoomOnMediaSFU(payload, credentials?.apiUserName, credentials?.apiKey);

            if (response.success) {
                // Handle successful room join
                await checkLimitsAndMakeRequest({ apiUserName: response.data.roomName, apiToken: response.data.secret, link: response.data.link, userName: name });
                setError('');
            } else {
                // Handle failed room join
                updateIsLoadingModalVisible(false);

                if (showAlert) {
                    showAlert({
                        message: `Unable to connect to room. ${response.data ? response.data.message : ''}`,
                        type: 'danger',
                        duration: 3000,
                    });
                } else {
                    setError(`Unable to connect to room. ${response.data ? response.data.message : ''}`);
                }
            }

        } catch (error) {
            updateIsLoadingModalVisible(false);

            if (showAlert) {
                showAlert({
                    message: `Unable to connect. ${error.message}`,
                    type: 'danger',
                    duration: 3000,
                });
            } else {
                setError(`Unable to connect.  ${error.message}`);
            }

        }



    };

    return (
        <div style={styles.container}>
            <div style={styles.logoContainer}>
                <img src="https://mediasfu.com/images/logo192.png" style={styles.logoImage} alt="Logo" />
            </div>
            <div style={styles.inputContainer}>
                {isCreateMode ? (
                    <>
                        <input type="text" placeholder="Display Name" value={name} onChange={(e) => setName(e.target.value)} style={styles.inputField} />
                        <input type="text" placeholder="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} style={styles.inputField} />
                        <select value={eventType} onChange={(e) => setEventType(e.target.value)} style={styles.selectField}>
                            <option value="">Select Event Type</option>
                            <option value="chat">Chat</option>
                            <option value="broadcast">Broadcast</option>
                            <option value="webinar">Webinar</option>
                            <option value="conference">Conference</option>
                        </select>
                        <input type="text" placeholder="Room Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} style={styles.inputField} />
                        <button onClick={handleCreateRoom} style={styles.actionButton}>Create Room</button>
                    </>
                ) : (
                    <>
                        <input type="text" placeholder="Display Name" value={name} onChange={(e) => setName(e.target.value)} style={styles.inputField} />
                        <input type="text" placeholder="Event ID" value={eventID} onChange={(e) => setEventID(e.target.value)} style={styles.inputField} />
                        <button onClick={handleJoinRoom} style={styles.actionButton}>Join Room</button>
                    </>
                )}
                {error && <p style={styles.error}>{error}</p>}
            </div>
            <div style={styles.orContainer}>
                <span style={styles.orText}>OR</span>
            </div>
            <div style={styles.toggleContainer}>
                <button onClick={handleToggleMode} style={styles.toggleButton}>
                    {isCreateMode ? 'Switch to Join Mode' : 'Switch to Create Mode'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        height: '100vh',
        backgroundColor: '#53C6E0',
        overflow: 'auto',
    },
    inputContainer: {
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputField: {
        height: '30px',
        borderColor: 'gray',
        borderWidth: '1px',
        marginBottom: '10px',
        padding: '0 5px',
        borderRadius: '5px',
    },
    selectField: {
        height: '30px',
        borderColor: 'gray',
        borderWidth: '1px',
        marginBottom: '10px',
        padding: '0 5px',
        borderRadius: '5px',
    },
    actionButton: {
        backgroundColor: 'black',
        color: 'white',
        padding: '5px 20px',
        borderRadius: '5px',
        marginBottom: '10px',
        marginTop: '10px',
    },
    toggleContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButton: {
        backgroundColor: 'black',
        color: 'white',
        padding: '5px 20px',
        borderRadius: '5px',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
    logoContainer: {
        marginTop: '30px',
        paddingTop: '10px',
        marginBottom: '10px',
    },
    logoImage: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
    },
    orContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px 0',
    },
    orText: {
        color: 'black',
        fontSize: 'medium',
        fontWeight: 'bold',
    },
};


export default PreJoinPage;