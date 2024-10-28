import React, { useState } from "react";
import Cookies from "universal-cookie";
import { ConnectSocketType, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";
import { CSSProperties } from "react";

const cookies = new Cookies();
const MAX_ATTEMPTS = 10; // Maximum number of unsuccessful attempts before rate limiting
const RATE_LIMIT_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const apiKey = "yourAPIKEY";
const apiUserName = "yourAPIUSERNAME";
const user_credentials = { apiUserName, apiKey };

// Type definitions for parameters and credentials
export interface PreJoinPageParameters {
  imgSrc?: string;
  showAlert?: ShowAlert;
  updateIsLoadingModalVisible: (visible: boolean) => void;
  connectSocket: ConnectSocketType;
  updateSocket: (socket: Socket) => void;
  updateValidated: (validated: boolean) => void;
  updateApiUserName: (userName: string) => void;
  updateApiToken: (token: string) => void;
  updateLink: (link: string) => void;
  updateRoomName: (roomName: string) => void;
  updateMember: (member: string) => void;
}

export interface Credentials {
  apiUserName: string;
  apiKey: string;
}

export interface PreJoinPageOptions {
  parameters: PreJoinPageParameters;
  credentials?: Credentials;
}

export type PreJoinPageType = (options: PreJoinPageOptions) => JSX.Element;

export interface CreateJoinRoomResponse {
  message: string;
  roomName: string;
  secureCode?: string;
  publicURL: string;
  link: string;
  secret: string;
  success: boolean;
}

export interface CreateJoinRoomError {
  error: string;
  success?: boolean;
}

export type CreateJoinRoomType = (options: {
  payload: any;
  apiUserName: string;
  apiKey: string;
}) => Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}>;

export type CreateRoomOnMediaSFUType = (options: {
  payload: any;
  apiUserName: string;
  apiKey: string;
}) => Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}>;

export async function joinRoomOnMediaSFU({
  payload,
  apiUserName,
  apiKey,
}: {
  payload: any;
  apiUserName: string;
  apiKey: string;
}): Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}> {
  try {
    if (
      !apiUserName ||
      !apiKey ||
      apiUserName === "yourAPIUSERNAME" ||
      apiKey === "yourAPIKEY" ||
      apiKey.length !== 64 ||
      apiUserName.length < 6
    ) {
      return { data: { error: "Invalid credentials" }, success: false };
    }

    const response = await fetch('https://mediasfu.com/v1/rooms/',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiUserName}:${apiKey}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    const errorMessage = (error as any).reason ? (error as any).reason : 'unknown error';
    return {
      data: { error: `Unable to join room, ${errorMessage}` },
      success: false,
    };
  }
}

export async function createRoomOnMediaSFU({
  payload,
  apiUserName,
  apiKey,
}: {
  payload: any;
  apiUserName: string;
  apiKey: string;
}): Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}> {
  try {
    if (
      !apiUserName ||
      !apiKey ||
      apiUserName === "yourAPIUSERNAME" ||
      apiKey === "yourAPIKEY" ||
      apiKey.length !== 64 ||
      apiUserName.length < 6
    ) {
      return { data: { error: "Invalid credentials" }, success: false };
    }
    
    const response = await fetch('https://mediasfu.com/v1/rooms/',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiUserName}:${apiKey}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    const errorMessage = (error as any).reason ? (error as any).reason : 'unknown error';
    return {
      data: { error: `Unable to create room, ${errorMessage}` },
      success: false,
    };
  }
}

/**
 * PreJoinPage component allows users to either create a new room or join an existing one.
 * 
 * @component
 * @param {PreJoinPageOptions} props - The properties for the PreJoinPage component.
 * @param {Object} props.parameters - Various parameters required for the component.
 * @param {Function} props.parameters.showAlert - Function to show alert messages.
 * @param {Function} props.parameters.updateIsLoadingModalVisible - Function to update the loading modal visibility.
 * @param {Function} props.parameters.connectSocket - Function to connect to the socket.
 * @param {Function} props.parameters.updateSocket - Function to update the socket.
 * @param {Function} props.parameters.updateValidated - Function to update the validation status.
 * @param {Function} props.parameters.updateApiUserName - Function to update the API username.
 * @param {Function} props.parameters.updateApiToken - Function to update the API token.
 * @param {Function} props.parameters.updateLink - Function to update the link.
 * @param {Function} props.parameters.updateRoomName - Function to update the room name.
 * @param {Function} props.parameters.updateMember - Function to update the member.
 * @param {string} [props.parameters.imgSrc] - The source URL for the logo image.
 * @param {Object} [props.credentials=user_credentials] - The user credentials.
 * 
 * @returns {JSX.Element} The rendered PreJoinPage component.
 * 
 * @example
 * <PreJoinPage
 *   parameters={{
 *     showAlert: showAlertFunction,
 *     updateIsLoadingModalVisible: updateLoadingFunction,
 *     connectSocket: connectSocketFunction,
 *     updateSocket: updateSocketFunction,
 *     updateValidated: updateValidatedFunction,
 *     updateApiUserName: updateApiUserNameFunction,
 *     updateApiToken: updateApiTokenFunction,
 *     updateLink: updateLinkFunction,
 *     updateRoomName: updateRoomNameFunction,
 *     updateMember: updateMemberFunction,
 *     imgSrc: "https://example.com/logo.png"
 *   }}
 *   credentials={{
 *     apiUserName: "user123",
 *     apiKey: "apikey123"
 *   }}
 * />
 */
const PreJoinPage: React.FC<PreJoinPageOptions> = ({
  parameters,
  credentials = user_credentials,
}) => {
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [eventID, setEventID] = useState<string>("");
  const [error, setError] = useState<string>("");

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
    let unsuccessfulAttempts =
      parseInt(cookies.get("unsuccessfulAttempts")) || 0;
    let lastRequestTimestamp =
      parseInt(cookies.get("lastRequestTimestamp")) || 0;

    if (
      unsuccessfulAttempts >= MAX_ATTEMPTS &&
      Date.now() - lastRequestTimestamp < RATE_LIMIT_DURATION
    ) {
      showAlert?.({
        message: "Too many unsuccessful attempts. Please try again later.",
        type: "danger",
        duration: 3000,
      });
      return;
    } else {
      unsuccessfulAttempts = 0;
      cookies.set("unsuccessfulAttempts", unsuccessfulAttempts.toString());
      cookies.set("lastRequestTimestamp", Date.now().toString());
    }

    try {
      updateIsLoadingModalVisible(true);
      const socketPromise = await connectSocket({
        apiUserName,
        apiKey,
        apiToken,
        link,
      });
      const timeoutPromise = new Promise<null>((_, reject) =>
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
        updateIsLoadingModalVisible(false);
        showAlert?.({
          message: "Invalid credentials.",
          type: "danger",
          duration: 3000,
        });
      }
    } catch {
      showAlert?.({
        message: "Unable to connect. Check your credentials and try again.",
        type: "danger",
        duration: 3000,
      });
      unsuccessfulAttempts += 1;
      cookies.set("unsuccessfulAttempts", unsuccessfulAttempts.toString());
      updateIsLoadingModalVisible(false);
    }
  };

  const handleToggleMode = () => {
    setIsCreateMode(!isCreateMode);
    setError("");
  };

  const handleCreateRoom = async () => {
    if (!name || !duration || !eventType || !capacity) {
      setError("Please fill all the fields.");
      return;
    }

    const payload = {
      action: "create",
      duration: parseInt(duration),
      capacity: parseInt(capacity),
      eventType,
      userName: name,
    };

    updateIsLoadingModalVisible(true);

    const response = await createRoomOnMediaSFU({
      payload,
      apiUserName: credentials.apiUserName,
      apiKey: credentials.apiKey,
    });
    if (response.success && response.data && "roomName" in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response!.data.link,
        userName: name,
      });
    } else {
      updateIsLoadingModalVisible(false);
      setError(
        `Unable to create room. ${
          response.data
            ? "error" in response.data
              ? response.data.error
              : ""
            : ""
        }`
      );
    }
  };

  const handleJoinRoom = async () => {
    if (!name || !eventID) {
      setError("Please fill all the fields.");
      return;
    }

    const payload = {
      action: "join",
      meetingID: eventID,
      userName: name,
    };

    updateIsLoadingModalVisible(true);

    const response = await joinRoomOnMediaSFU({
      payload,
      apiUserName: credentials.apiUserName,
      apiKey: credentials.apiKey,
    });
    if (response.success && response.data && "roomName" in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response.data.link,
        userName: name,
      });
    } else {
      updateIsLoadingModalVisible(false);
      setError(
        `Unable to join room. ${
          response.data
            ? "error" in response.data
              ? response.data.error
              : ""
            : ""
        }`
      );
    }
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
        {isCreateMode ? (
          <>
            <input
              type="text"
              placeholder="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.inputField}
            />
            <input
              type="text"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={styles.inputField}
            />
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              style={styles.selectField}
            >
              <option value="">Select Event Type</option>
              <option value="chat">Chat</option>
              <option value="broadcast">Broadcast</option>
              <option value="webinar">Webinar</option>
              <option value="conference">Conference</option>
            </select>
            <input
              type="text"
              placeholder="Room Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              style={styles.inputField}
            />
            <button onClick={handleCreateRoom} style={styles.actionButton}>
              Create Room
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.inputField}
            />
            <input
              type="text"
              placeholder="Event ID"
              value={eventID}
              onChange={(e) => setEventID(e.target.value)}
              style={styles.inputField}
            />
            <button onClick={handleJoinRoom} style={styles.actionButton}>
              Join Room
            </button>
          </>
        )}
        {error && <p style={styles.error}>{error}</p>}
      </div>
      <div style={styles.orContainer}>
        <span style={styles.orText}>OR</span>
      </div>
      <div style={styles.toggleContainer}>
        <button onClick={handleToggleMode} style={styles.toggleButton}>
          {isCreateMode ? "Switch to Join Mode" : "Switch to Create Mode"}
        </button>
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
    padding: "20px",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#53C6E0",
    overflow: "auto",
  },
  inputContainer: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
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
  selectField: {
    height: "30px",
    borderColor: "gray",
    borderWidth: "1px",
    marginBottom: "10px",
    padding: "0 5px",
    borderRadius: "5px",
  },
  actionButton: {
    backgroundColor: "black",
    color: "white",
    padding: "5px 20px",
    borderRadius: "5px",
    marginBottom: "10px",
    marginTop: "10px",
  },
  toggleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButton: {
    backgroundColor: "black",
    color: "white",
    padding: "5px 20px",
    borderRadius: "5px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
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
  orContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px 0",
  },
  orText: {
    color: "black",
    fontSize: "medium",
    fontWeight: "bold",
  },
};

export default PreJoinPage;
