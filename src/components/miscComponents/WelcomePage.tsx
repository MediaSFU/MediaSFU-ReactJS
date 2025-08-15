import React, { useState, useEffect } from "react";
// import { Scanner } from "@yudiel/react-qr-scanner";
import Cookies from "universal-cookie";
import { CSSProperties } from "react";
import { Socket } from "socket.io-client";
import { ConnectSocketType } from "../../sockets/SocketManager";
import { ShowAlert } from "../../@types/types";

const cookies = new Cookies();
const MAX_ATTEMPTS = 10; // Maximum number of unsuccessful attempts before rate limiting
const RATE_LIMIT_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

// Define the type for the parameters prop
export interface WelcomePageParameters {
  imgSrc?: string;
  showAlert?: ShowAlert;
  updateIsLoadingModalVisible: (visible: boolean) => void;
  connectSocket: ConnectSocketType;
  updateSocket: (socket: Socket) => void;
  updateValidated: (validated: boolean) => void;
  updateApiUserName: (apiUserName: string) => void;
  updateApiToken: (apiToken: string) => void;
  updateLink: (link: string) => void;
  updateRoomName: (roomName: string) => void;
  updateMember: (userName: string) => void;
}

// Define the prop type for the component
export interface WelcomePageOptions {
  parameters: WelcomePageParameters;
}

export type WelcomePageType = (options: WelcomePageOptions) => React.JSX.Element;

/**
 * WelcomePage component allows users to enter event details manually or by scanning a QR code.
 * It validates the input and attempts to connect to a socket with the provided credentials.
 *
 * @component
 * @param {WelcomePageOptions} parameters - The parameters for the WelcomePage component.
 * @param {Function} parameters.showAlert - Function to show alert messages.
 * @param {Function} parameters.updateIsLoadingModalVisible - Function to update loading modal visibility.
 * @param {Function} parameters.connectSocket - Function to connect to a socket.
 * @param {Function} parameters.updateSocket - Function to update the socket state.
 * @param {Function} parameters.updateValidated - Function to update validation state.
 * @param {Function} parameters.updateApiUserName - Function to update API username.
 * @param {Function} parameters.updateApiToken - Function to update API token.
 * @param {Function} parameters.updateLink - Function to update the event link.
 * @param {Function} parameters.updateRoomName - Function to update the room name.
 * @param {Function} parameters.updateMember - Function to update the member name.
 *
 * @returns {React.JSX.Element} The rendered WelcomePage component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { WelcomePage } from 'mediasfu-reactjs';
 * 
 * const parameters = {
 *   showAlert: (message) => console.log(message),
 *   updateIsLoadingModalVisible: (visible) => console.log(visible),
 *   connectSocket: (socket) => console.log(socket),
 *   updateSocket: (socket) => console.log(socket),
 *   updateValidated: (validated) => console.log(validated),
 *   updateApiUserName: (apiUserName) => console.log(apiUserName),
 *   updateApiToken: (apiToken) => console.log(apiToken),
 *   updateLink: (link) => console.log(link),
 *   updateRoomName: (roomName) => console.log(roomName),
 *   updateMember: (userName) => console.log(userName),
 * };
 * 
 * <WelcomePage parameters={parameters} />
 * ```
 */


const WelcomePage: React.FC<WelcomePageOptions> = ({ parameters }) => {
  const [name, setName] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [eventID, setEventID] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [, setScannerVisible] = useState<boolean>(false);
  const [scannedData] = useState<any>(null);

  const {
    showAlert,
    updateIsLoadingModalVisible,
    connectSocket,
    updateSocket,
    updateValidated,
    updateApiUserName,
    updateApiToken,
    updateLink,
    updateRoomName,
    updateMember,
  } = parameters;

  const checkLimitsAndMakeRequest = async ({
    apiUserName,
    apiToken,
    link,
    apiKey = "",
    userName,
  }: {
    apiUserName: string;
    apiToken: string;
    link: string;
    apiKey?: string;
    userName: string;
  }) => {
    const TIMEOUT_DURATION = 10000; // 10 seconds

    let unsuccessfulAttempts = parseInt(
      cookies.get("unsuccessfulAttempts") || "0"
    );
    let lastRequestTimestamp = parseInt(
      cookies.get("lastRequestTimestamp") || "0"
    );

    if (unsuccessfulAttempts >= MAX_ATTEMPTS) {
      if (Date.now() - lastRequestTimestamp < RATE_LIMIT_DURATION) {
        showAlert?.({
          message: "Too many unsuccessful attempts. Please try again later.",
          type: "danger",
          duration: 3000,
        });
        cookies.set("lastRequestTimestamp", Date.now().toString());
        return;
      } else {
        unsuccessfulAttempts = 0;
        cookies.set("unsuccessfulAttempts", unsuccessfulAttempts.toString());
        cookies.set("lastRequestTimestamp", Date.now().toString());
      }
    }

    try {
      updateIsLoadingModalVisible(true);

      const socketPromise = connectSocket({
        apiUserName,
        apiKey,
        apiToken,
        link,
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Request timed out")),
          TIMEOUT_DURATION
        )
      );

      const socket = await Promise.race([socketPromise, timeoutPromise]);

      if (socket && socket instanceof Socket && socket.id) {
        unsuccessfulAttempts = 0;
        cookies.set("unsuccessfulAttempts", unsuccessfulAttempts.toString());
        cookies.set("lastRequestTimestamp", Date.now().toString());
        updateSocket(socket);
        updateApiUserName(apiUserName);
        updateApiToken(apiToken);
        updateLink(link);
        updateRoomName(apiUserName);
        updateMember(userName);
        updateValidated(true);
      } else {
        unsuccessfulAttempts += 1;
        cookies.set("unsuccessfulAttempts", unsuccessfulAttempts.toString());
        cookies.set("lastRequestTimestamp", Date.now().toString());
        updateIsLoadingModalVisible(false);

        if (unsuccessfulAttempts >= MAX_ATTEMPTS) {
          showAlert?.({
            message: "Too many unsuccessful attempts. Please try again later.",
            type: "danger",
            duration: 3000,
          });
        } else {
          showAlert?.({
            message: "Invalid credentials.",
            type: "danger",
            duration: 3000,
          });
        }
      }
    } catch {
      showAlert?.({
        message: "Unable to connect. Check your credentials and try again.",
        type: "danger",
        duration: 3000,
      });

      unsuccessfulAttempts += 1;
      cookies.set("unsuccessfulAttempts", unsuccessfulAttempts.toString());
      cookies.set("lastRequestTimestamp", Date.now().toString());
      updateIsLoadingModalVisible(false);
    }
  };

  useEffect(() => {
    // Handle scanned data
    try {
      if (scannedData && scannedData.length > 0) {
        // Implement logic to process scanned data
        const data = scannedData[0].rawValue.trim();
        // Extracting parts based on semicolon delimiter
        const parts = data.split(";");
        let userName: string,
          link_: string,
          userSecret: string,
          passWord: string,
          meetingID: string;

        if (parts.length === 5) {
          [userName, link_, userSecret, passWord, meetingID] = parts;

          // Implement logic to check if the data is valid
          if (
            userName.length === 0 ||
            link_.length === 0 ||
            userSecret.length === 0 ||
            passWord.length === 0 ||
            meetingID.length === 0
          ) {
            showAlert?.({
              message: "Invalid scanned data.",
              type: "danger",
              duration: 3000,
            });
          }

          if (
            !validateAlphanumeric(userName) ||
            !validateAlphanumeric(userSecret) ||
            !validateAlphanumeric(passWord) ||
            !validateAlphanumeric(meetingID)
          ) {
            showAlert?.({
              message: "Invalid scanned data.",
              type: "danger",
              duration: 3000,
            });
          }

          if (
            userSecret.length != 64 ||
            userName.length > 12 ||
            userName.length < 2 ||
            meetingID.length > 32 ||
            meetingID.length < 8 ||
            !link_.includes("mediasfu.com") ||
            eventID.toLowerCase().startsWith("d")
          ) {
            showAlert?.({
              message: "Invalid scanned data.",
              type: "danger",
              duration: 3000,
            });
          }

          // Further processing logic if needed
        } else {
          // Handle the case where the scanned data doesn't have the expected format
          showAlert?.({
            message: "Invalid scanned data.",
            type: "danger",
            duration: 3000,
          });
        }

        setName(userName!);

        setScannerVisible(false);

        async function makeRequest() {
          await checkLimitsAndMakeRequest({
            apiUserName: meetingID,
            apiToken: userSecret,
            link: link_,
            userName: userName,
          });
        }

        makeRequest();
      }
    } catch {
      showAlert?.({
        message: "Invalid scanned data.",
        type: "danger",
        duration: 3000,
      });
    }
  }, [scannedData]);

  const validateAlphanumeric = (str: string): boolean => {
    if (str.length === 0) return true; // Allow empty string (for secret)
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(str);
  };

  const handleNameChange = (text: string) => {
    if (text.length <= 12 && validateAlphanumeric(text)) {
      setName(text);
    }
  };

  const handleSecretChange = (text: string) => {
    if (text.length <= 64 && validateAlphanumeric(text)) {
      setSecret(text);
    }
  };

  const handleEventIDChange = (text: string) => {
    if (text.length <= 32 && validateAlphanumeric(text)) {
      setEventID(text);
    }
  };

  const handleConfirm = async () => {
    updateIsLoadingModalVisible(true);

    if (
      name.length === 0 ||
      secret.length === 0 ||
      eventID.length === 0 ||
      link.length === 0
    ) {
      showAlert?.({
        message: "Please fill all the fields.",
        type: "danger",
        duration: 3000,
      });

      updateIsLoadingModalVisible(false);
      return;
    }

    if (
      !validateAlphanumeric(name) ||
      !validateAlphanumeric(secret) ||
      !validateAlphanumeric(eventID) ||
      !link.includes("mediasfu.com") ||
      eventID.toLowerCase().startsWith("d")
    ) {
      showAlert?.({
        message: "Please enter valid details.",
        type: "danger",
        duration: 3000,
      });

      updateIsLoadingModalVisible(false);
      return;
    }

    if (
      secret.length != 64 ||
      name.length > 12 ||
      name.length < 2 ||
      eventID.length > 32 ||
      eventID.length < 8 ||
      link.length < 12
    ) {
      showAlert?.({
        message: "Please enter valid details.",
        type: "danger",
        duration: 3000,
      });

      updateIsLoadingModalVisible(false);
      return;
    }

    await checkLimitsAndMakeRequest({
      apiUserName: eventID,
      apiToken: secret,
      link: link,
      userName: name,
    });
    updateIsLoadingModalVisible(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img
          src={parameters.imgSrc || "https://mediasfu.com/images/logo192.png"}
          style={styles.logoImage}
          alt="Logo"
        />
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Event Display Name"
          value={name ? name : ""}
          onChange={(e) => handleNameChange(e.target.value)}
          style={styles.inputField}
        />
        <input
          type="text"
          placeholder="Event Token (Secret)"
          value={secret ? secret : ""}
          onChange={(e) => handleSecretChange(e.target.value)}
          style={styles.inputField}
        />
        <input
          type="text"
          placeholder="Event ID"
          value={eventID ? eventID : ""}
          onChange={(e) => handleEventIDChange(e.target.value)}
          style={styles.inputField}
        />
        <input
          type="text"
          placeholder="Event Link"
          value={link ? link : ""}
          onChange={(e) => setLink(e.target.value)}
          style={styles.inputField}
        />
      </div>
      <button onClick={handleConfirm} style={styles.confirmButton}>
        Confirm
      </button>

      {/* <div style={styles.scannerContainer}>
        <div style={styles.orContainer}>
          <hr style={styles.horizontalLine} />
          <span style={styles.orText}>OR</span>
          <hr style={styles.horizontalLine} />
        </div>
        {isScannerVisible && (
          <div style={styles.scanButtonContainer}>
          <Scanner
            onScan={(data) => setScannedData(data)}
            onError={(error) => console.log(error)}
            styles={{ container: { width: "300px", height: "300px" } }}
          />
          </div>
        )}
        {!isScannerVisible && (
          <div style={styles.scanButtonContainer}>
            <button
              onClick={() => setScannerVisible(true)}
              style={styles.scanButton}
            >
              <FontAwesomeIcon icon={faQrcode} style={{ marginRight: "5px" }} />
              Scan QR Code
            </button>
          </div>
        )}
      </div> */}

      <div style={styles.additionalOptionsContainer}>
        <p>
          Provide the event details either by typing manually or scanning the
          QR-code to autofill.
        </p>
        <p>Do not have a secret?</p>
        <a
          href="https://meeting.mediasfu.com/meeting/start/"
          target="_blank"
          rel="noreferrer"
          style={styles.link}
        >
          Get one from mediasfu.com
        </a>
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#53C6E0",
    overflow: "auto",
  },
  logoContainer: {
    marginTop: "30px",
    paddingTop: "10px",
    marginBottom: "10px",
  },
  logoImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
  },
  inputContainer: {
    marginBottom: "10px",
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    height: "30px",
    borderColor: "gray",
    borderWidth: "1px",
    marginBottom: "10px",
    padding: "0 5px",
    borderRadius: "5px",
  },
  confirmButton: {
    backgroundColor: "black",
    color: "white",
    padding: "5px 5px",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  scannerContainer: {
    marginBottom: "10px",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    justifySelf: "center",
    justifyItems: "center",
  },
  additionalOptionsContainer: {
    textAlign: "center",
  },
  link: {
    color: "blue",
    textDecoration: "none",
    fontWeight: "bold",
    marginLeft: "5px",
  },
  scanButton: {
    backgroundColor: "black",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  scanButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  orContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px 0",
  },
  horizontalLine: {
    width: "40%",
    margin: "0 10px",
  },
  orText: {
    color: "black",
    fontSize: "medium",
    fontWeight: "bold",
  },
};

export default WelcomePage;
