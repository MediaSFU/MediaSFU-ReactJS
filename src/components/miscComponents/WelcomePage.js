/**
 * WelcomePage Component
 * 
 * The WelcomePage component provides a user interface for users to enter event details, including display name, event token (secret), event ID, and event link. 
 * Users can manually input the details or scan a QR code to autofill the fields. It also includes functionality to validate the entered data and make API requests 
 * to connect to the event.
 * 
 * Props:
 * - parameters: An object containing parameters such as showAlert, updateIsLoadingModalVisible, onWeb, connectSocket, socket, updateSocket, updateValidated, 
 *               updateApiUserName, updateApiToken, updateLink, updateRoomName, updateMember, and validated.
 * 
 * State:
 * - name: The display name entered by the user.
 * - secret: The event token (secret) entered by the user.
 * - eventID: The event ID entered by the user.
 * - link: The event link entered by the user.
 * - isScannerVisible: A boolean indicating whether the QR scanner is visible or not.
 * - scannedData: The data obtained from scanning a QR code.
 * - hasPermission: A boolean indicating whether the app has permission to access the camera for QR scanning.
 * - scanned: A boolean indicating whether a QR code has been successfully scanned.
 * 
 * Methods:
 * - checkLimitsAndMakeRequest(): Checks API request limits and makes a request to connect to the event.
 * - validateAlphanumeric(): Validates whether a string contains only alphanumeric characters.
 * - handleNameChange(): Handles changes in the display name input field.
 * - handleSecretChange(): Handles changes in the event token (secret) input field.
 * - handleeventIDChange(): Handles changes in the event ID input field.
 * - handleScan(): Handles the data obtained from scanning a QR code.
 * - handleError(): Handles errors that occur during QR code scanning.
 * - handleConfirm(): Handles the confirmation button click event to validate entered data and make API requests.
 * 
 * @param {Object} parameters An object containing parameters such as showAlert, updateIsLoadingModalVisible, onWeb, connectSocket, socket, updateSocket, 
 *                             updateValidated, updateApiUserName, updateApiToken, updateLink, updateRoomName, updateMember, and validated.
 * @returns {JSX.Element} The rendered WelcomePage component.
 */

import React, { useState, useEffect } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const MAX_ATTEMPTS = 10; // Maximum number of unsuccessful attempts before rate limiting
const RATE_LIMIT_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

const WelcomePage = ({ parameters }) => {
    const [name, setName] = useState('');
    const [secret, setSecret] = useState('');
    const [eventID, setEventID] = useState('');
    const [link, setLink] = useState('');
    const [isScannerVisible, setScannerVisible] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);


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




    useEffect(() => {
        // Handle scanned data
        try {
            if (scannedData) {
                // Implement logic to process scanned data
                const data = scannedData.text.trim();
                // Extracting parts based on semicolon delimiter
                const parts = data.split(';');
                let userName, link_, userSecret, passWord, meetingID;


                if (parts.length === 5) {
                    [userName, link_, userSecret, passWord, meetingID] = parts;

                    // Implement logic to check if the data is valid
                    if (userName.length === 0 || link_.length === 0 || userSecret.length === 0 || passWord.length === 0 || meetingID.length === 0) {
                        if (showAlert) {
                            showAlert({
                                message: 'Invalid scanned data.',
                                type: 'danger',
                                duration: 3000,
                            });
                        }
                    }

                    if (!validateAlphanumeric(userName) || !validateAlphanumeric(userSecret) || !validateAlphanumeric(passWord) || !validateAlphanumeric(meetingID)) {
                        if (showAlert) {
                            showAlert({
                                message: 'Invalid scanned data.',
                                type: 'danger',
                                duration: 3000,
                            });
                        }
                    }

                    if (userSecret.length != 64 || userName.length > 12 || userName.length < 2 || meetingID.length > 32 || meetingID.length < 8 || !link_.includes('mediasfu.com') || eventID.toLowerCase().startsWith('d')) {
                        if (showAlert) {
                            showAlert({
                                message: 'Invalid scanned data.',
                                type: 'danger',
                                duration: 3000,
                            });
                        }
                    }

                    // Further processing logic if needed
                } else {
                    // Handle the case where the scanned data doesn't have the expected format
                    if (showAlert) {
                        showAlert({
                            message: 'Invalid scanned data.',
                            type: 'danger',
                            duration: 3000,
                        });
                        setScanned(false);
                    }
                }

                setName(userName);


                setScannerVisible(false);
                setScannedData(null); // Reset scanned data after processing

                async function makeRequest() {
                    await checkLimitsAndMakeRequest({ apiUserName: meetingID, apiToken: userSecret, link: link_, userName: userName });
                }

                makeRequest();
            }
        } catch (error) {

            if (showAlert) {
                showAlert({
                    message: 'Invalid scanned data.',
                    type: 'danger',
                    duration: 3000,
                });
                setScanned(false);
            }

        }


    }, [scannedData]);


    const validateAlphanumeric = (str) => {
        if (str.length === 0) return true; // Allow empty string (for secret
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        return alphanumericRegex.test(str);
    };

    const handleNameChange = (text) => {
        if (text.length <= 12 && validateAlphanumeric(text)) {
            setName(text);
        }
    };

    const handleSecretChange = (text) => {
        if (text.length <= 64 && validateAlphanumeric(text)) {
            setSecret(text);
        }
    };

    const handleeventIDChange = (text) => {
        if (text.length <= 32 && validateAlphanumeric(text)) {
            setEventID(text);
        }
    };

    const handleScan = (data) => {
        if (data) {
            setScannedData(data);
            setScannerVisible(false); // Turn off scanner after successful scan

        }
    };

    const handleError = (error) => {
        console.log(error);
    };

    const handleConfirm = async () => {

        updateIsLoadingModalVisible(true);



        if (name.length === 0 || secret.length === 0 || eventID.length === 0 || link.length === 0) {
            if (showAlert) {
                showAlert({
                    message: 'Please fill all the fields.',
                    type: 'danger',
                    duration: 3000,
                });
            }

            updateIsLoadingModalVisible(false);
            return;
        }

        if (!validateAlphanumeric(name) || !validateAlphanumeric(secret) || !validateAlphanumeric(eventID) || !link.includes('mediasfu.com') || eventID.toLowerCase().startsWith('d')) {
            if (showAlert) {
                showAlert({
                    message: 'Please enter valid details.',
                    type: 'danger',
                    duration: 3000,
                });
            }

            updateIsLoadingModalVisible(false);
            return;

        }

        if (secret.length != 64 || name.length > 12 || name.length < 2 || eventID.length > 32 || eventID.length < 8 || link.length < 12) {
            if (showAlert) {
                showAlert({
                    message: 'Please enter valid details.',
                    type: 'danger',
                    duration: 3000,
                });
            }

            updateIsLoadingModalVisible(false);
            return;
        }

        await checkLimitsAndMakeRequest({ apiUserName: eventID, apiToken: secret, link: link, userName: name });
        updateIsLoadingModalVisible(false);


    };


    return (
        <div style={styles.container}>
            <div style={styles.logoContainer}>
                <img src="https://mediasfu.com/images/logo192.png" style={styles.logoImage} alt="Logo" />
            </div>
            <div style={styles.inputContainer}>
                <input type="text" placeholder="Event Display Name" value={name ? name : ""} onChange={(e) => setName(e.target.value)} style={styles.inputField} />
                <input type="text" placeholder="Event Token (Secret)" value={secret ? secret : ""} onChange={(e) => setSecret(e.target.value)} style={styles.inputField} />
                <input type="text" placeholder="Event ID" value={eventID ? eventID : ""} onChange={(e) => setEventID(e.target.value)} style={styles.inputField} />
                <input type="text" placeholder="Event Link" value={link ? link : ""} onChange={(e) => setLink(e.target.value)} style={styles.inputField} />
            </div>
            <button onClick={handleConfirm} style={styles.confirmButton}>Confirm</button>

            <div style={styles.scannerContainer}>
                <div style={styles.orContainer}>
                    <hr style={styles.horizontalLine} />
                    <span style={styles.orText}>OR</span>
                    <hr style={styles.horizontalLine} />
                </div>
                {isScannerVisible && (
                    <QrScanner
                        onResult={handleScan}
                        onError={handleError}
                        style={{ width: '300px', height: '300px' }}
                    />
                )}
                {!isScannerVisible && (
                    <div style={styles.scanButtonContainer}>
                        <button onClick={() => setScannerVisible(true)} style={styles.scanButton}>
                            <FontAwesomeIcon icon={faQrcode} style={{ marginRight: '5px' }} />
                            Scan QR Code
                        </button>
                    </div>
                )}
            </div>

            <div style={styles.additionalOptionsContainer}>
                <p>Provide the event details either by typing manually or scanning the QR-code to autofill.</p>
                <p>Don't have a secret?</p>
                <a href="https://meeting.mediasfu.com/meeting/start/" target='_blank' style={styles.link}>Get one from mediasfu.com</a>
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
    inputContainer: {
        marginBottom: '10px',
        flexDirection: 'column',
        display: 'flex',
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
    confirmButton: {
        backgroundColor: 'black',
        color: 'white',
        padding: '5px 5px',
        borderRadius: '5px',
        marginBottom: '10px',
    },
    scannerContainer: {
        marginBottom: '10px',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        justifySelf: 'center',
        justifyItems: 'center',
    },
    additionalOptionsContainer: {
        textAlign: 'center',

    },
    link: {
        color: 'blue',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginLeft: '5px',
    },
    scanButton: {
        backgroundColor: 'black',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        marginBottom: '20px',
    },
    scanButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    orContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px 0',
    },
    horizontalLine: {
        width: '40%',
        margin: '0 10px',
    },
    orText: {
        color: 'black',
        fontSize: 'medium',
        fontWeight: 'bold',
    },
};

export default WelcomePage;