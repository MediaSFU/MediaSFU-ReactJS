import React, { useState, useRef } from "react";
import { ConnectSocketType, ShowAlert, ConnectLocalSocketType, ResponseLocalConnection, ResponseLocalConnectionData, RecordingParams, MeetingRoomParams } from "../../@types/types";
import { checkLimitsAndMakeRequest } from "../../methods/utils/checkLimitsAndMakeRequest";
import { createRoomOnMediaSFU } from "../../methods/utils/createRoomOnMediaSFU";
import { joinRoomOnMediaSFU } from "../../methods/utils/joinRoomOnMediaSFU";
import { Socket } from "socket.io-client";
import { CSSProperties } from "react";

const apiKey = "yourAPIKEY";
const apiUserName = "yourAPIUSERNAME";
const user_credentials = { apiUserName, apiKey };


export interface JoinLocalEventRoomParameters {
  eventID: string;
  userName: string;
  secureCode?: string;
  videoPreference?: string | null;
  audioPreference?: string | null;
  audioOutputPreference?: string | null;
}

export interface JoinLocalEventRoomOptions {
  joinData: JoinLocalEventRoomParameters;
  link?: string;
}

export interface CreateLocalRoomParameters {
  eventID: string;
  duration: number;
  capacity: number;
  userName: string;
  scheduledDate: Date;
  secureCode: string;
  waitRoom?: boolean;
  recordingParams?: RecordingParams;
  eventRoomParams?: MeetingRoomParams;
  videoPreference?: string | null;
  audioPreference?: string | null;
  audioOutputPreference?: string | null;
  mediasfuURL?: string;
}
export interface CreateLocalRoomOptions {
  createData: CreateLocalRoomParameters;
  link?: string;
}

export interface CreateJoinLocalRoomResponse {
  success: boolean;
  secret: string;
  reason?: string;
  url?: string;
}


// Type definitions for parameters and credentials
export interface PreJoinPageParameters {
  imgSrc?: string;
  showAlert?: ShowAlert;
  updateIsLoadingModalVisible: (visible: boolean) => void;
  connectSocket: ConnectSocketType;
  connectLocalSocket?: ConnectLocalSocketType;
  updateSocket: (socket: Socket) => void;
  updateLocalSocket?: (socket: Socket) => void;
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
  localLink?: string;
  connectMediaSFU?: boolean;
  parameters: PreJoinPageParameters;
  credentials?: Credentials;
}

export type PreJoinPageType = (options: PreJoinPageOptions) => JSX.Element;


/**
 * PreJoinPage component allows users to either create a new room or join an existing one.
 * 
 * @component
 * @param {PreJoinPageOptions} props - The properties for the PreJoinPage component.
 * @param {PreJoinPageParameters} props.parameters - Various parameters required for the component.
 * @param {ShowAlert} [props.parameters.showAlert] - Function to show alert messages.
 * @param {() => void} props.parameters.updateIsLoadingModalVisible - Function to update the loading modal visibility.
 * @param {ConnectSocketType} props.parameters.connectSocket - Function to connect to the socket.
 * @param {Socket} props.parameters.updateSocket - Function to update the socket.
 * @param {() => void} props.parameters.updateValidated - Function to update the validation status.
 * @param {string} [props.parameters.imgSrc] - The source URL for the logo image.
 * @param {Credentials} [props.credentials=user_credentials] - The user credentials containing the API username and API key.
 * 
 * @returns {JSX.Element} The rendered PreJoinPage component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { PreJoinPage } from 'mediasfu-reactjs';
 * import { JoinLocalRoomOptions } from 'mediasfu-reactjs';
 * 
 * const App = () => {
 *   const showAlertFunction = (message: string) => console.log(message);
 *   const updateLoadingFunction = (visible: boolean) => console.log(`Loading: ${visible}`);
 *   const connectSocketFunction = () => {}; // Connect socket function
 *   const updateSocketFunction = (socket: Socket) => {}; // Update socket function
 *   const updateValidatedFunction = (validated: boolean) => {}; // Update validated function
 *   const updateApiUserNameFunction = (userName: string) => {}; // Update API username function
 *   const updateApiTokenFunction = (token: string) => {}; // Update API token function
 *   const updateLinkFunction = (link: string) => {}; // Update link function
 *   const updateRoomNameFunction = (roomName: string) => {}; // Update room name function
 *   const updateMemberFunction = (member: string) => {}; // Update member function
 * 
 *   return (
 *     <PreJoinPage
 *       parameters={{
 *         showAlert: showAlertFunction,
 *         updateIsLoadingModalVisible: updateLoadingFunction,
 *         connectSocket: connectSocketFunction,
 *         updateSocket: updateSocketFunction,
 *         updateValidated: updateValidatedFunction,
 *         updateApiUserName: updateApiUserNameFunction,
 *         updateApiToken: updateApiTokenFunction,
 *         updateLink: updateLinkFunction,
 *         updateRoomName: updateRoomNameFunction,
 *         updateMember: updateMemberFunction,
 *         imgSrc: "https://example.com/logo.png"
 *       }}
 *       credentials={{
 *         apiUserName: "user123",
 *         apiKey: "apikey123"
 *       }}
 *     />
 *   );
 * };
 * 
 * 
 * export default App;
 * ```
 */

const PreJoinPage: React.FC<PreJoinPageOptions> = (
  {
    localLink = "",
    connectMediaSFU = true,
    parameters,
    credentials = user_credentials,
  }
) => {
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [eventID, setEventID] = useState<string>("");
  const [error, setError] = useState<string>("");

  const localConnected = useRef(false);
  const localData = useRef<ResponseLocalConnectionData | undefined>(undefined);
  const initSocket = useRef<Socket | undefined>(undefined);

  const {
    showAlert,
    updateIsLoadingModalVisible,
    connectLocalSocket,
    updateSocket,
    updateValidated,
    updateApiUserName,
    updateApiToken,
    updateLink,
    updateRoomName,
    updateMember,
  } = parameters;


  if (localLink.length > 0 && !localConnected.current && !initSocket.current) {

    
    try {
      connectLocalSocket?.({ link: localLink }).then((response: ResponseLocalConnection | undefined) => {
        localData.current = response!.data;
        initSocket.current = response!.socket;
        localConnected.current = true;
      }).catch((error) => {
        showAlert?.({
          message: `Unable to connect to ${localLink}. ${error}`,
          type: "danger",
          duration: 3000,
        });
      }
      );
    } catch {
      showAlert?.({
        message: `Unable to connect to ${localLink}. Something went wrong.`,
        type: "danger",
        duration: 3000,
      });
    }
  }


  const handleToggleMode = () => {
    setIsCreateMode(!isCreateMode);
    setError("");
  };

  const joinLocalRoom = async ({joinData, link=localLink}: JoinLocalEventRoomOptions) => {
    initSocket.current?.emit(
      "joinEventRoom",
      joinData, (response: CreateJoinLocalRoomResponse) => {
        if (response.success) {
          updateSocket(initSocket.current!);
          updateApiUserName(localData.current?.apiUserName || "");
          updateApiToken(response.secret);
          updateLink(link);
          updateRoomName(joinData.eventID);
          updateMember(joinData.userName);
          updateIsLoadingModalVisible(false);
          updateValidated(true);
        } else {
          updateIsLoadingModalVisible(false);
          setError(`Unable to join room. ${response.reason}`);
        }
      });
  }

  const createLocalRoom = async ({createData, link=localLink}: CreateLocalRoomOptions) => {

    initSocket.current?.emit(
      "createRoom",
      createData, (response: CreateJoinLocalRoomResponse) => {

        if (response.success) {
          updateSocket(initSocket.current!);
          updateApiUserName(localData.current?.apiUserName || "");
          updateApiToken(response.secret);
          updateLink(link);
          updateRoomName(createData.eventID);
          // local needs islevel updated from here
          // we update member as `userName` + "_2" and split it in the room
          updateMember(createData.userName + "_2");
          updateIsLoadingModalVisible(false);
          updateValidated(true);
        } else {
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room. ${response.reason}`);
        }
      });
  }

  const roomCreator = async ({payload, apiUserName, apiKey, validate=true}: {payload: any, apiUserName: string, apiKey: string, validate?: boolean}) => {
    const response = await createRoomOnMediaSFU({
      payload,
      apiUserName: apiUserName,
      apiKey: apiKey,
    });
    if (response.success && response.data && "roomName" in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response!.data.link,
        userName: name,
        parameters: parameters,
        validate: validate,
      });
      return response;
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
      recordOnly: false,
    };

    updateIsLoadingModalVisible(true);


    if (localLink.length > 0) {

      const secureCode = Math.random().toString(30).substring(2, 14) +
      Math.random().toString(30).substring(2, 14);
      let eventID = new Date().getTime().toString(30) + new Date().getUTCMilliseconds() + Math.floor(10 + Math.random() * 99).toString();
      eventID = "m" + eventID;
      const eventRoomParams = localData.current?.meetingRoomParams_;
      eventRoomParams!.type = eventType as "chat" | "broadcast" | "webinar" | "conference";

      const createData: CreateLocalRoomParameters = {
        eventID: eventID,
        duration: parseInt(duration),
        capacity: parseInt(capacity),
        userName: name,
        scheduledDate: new Date(),
        secureCode: secureCode,
        waitRoom: false,
        recordingParams: localData.current?.recordingParams_,
        eventRoomParams: eventRoomParams,
        videoPreference: null,
        audioPreference: null,
        audioOutputPreference: null,
        mediasfuURL: "",
      };

      // socket in main window is required and for no local room, no use of initSocket
      // for local room, initSocket becomes the local socket, and localSocket is the connection to MediaSFU (if connectMediaSFU is true)
      // else localSocket is the same as initSocket

      if (connectMediaSFU && initSocket.current && localData.current && localData.current.apiUserName && localData.current.apiKey) {
        payload.recordOnly = true; // allow production to mediasfu only; no consumption
        const response = await roomCreator({payload, apiUserName: localData.current.apiUserName, apiKey: localData.current.apiKey, validate: false});
        if (response && response.success && response.data && "roomName" in response.data) {
          createData.eventID = response.data.roomName;
          createData.secureCode = response.data.secureCode || "";
          createData.mediasfuURL = response.data.publicURL;
          await createLocalRoom({createData: createData, link: response.data.link});
        }else {
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room on MediaSFU.`);
          try{
            updateSocket(initSocket.current);
            await createLocalRoom({createData: createData});
          } catch (error) {
            updateIsLoadingModalVisible(false);
            setError(`Unable to create room. ${error}`);
          }
        }
      } else {
        try{
          updateSocket(initSocket.current!);
          await createLocalRoom({createData: createData});
        } catch (error) {
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room. ${error}`);
        }
      }
    }else{
       await roomCreator({payload, apiUserName: credentials.apiUserName, apiKey: credentials.apiKey, validate: true});
    }

  }

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

    if (localLink.length > 0 && !localLink.includes("mediasfu.com")) {
        const joinData: JoinLocalEventRoomParameters = {
          eventID: eventID,
          userName: name,
          secureCode: "",
          videoPreference: null,
          audioPreference: null,
          audioOutputPreference: null,
        };

        await joinLocalRoom({joinData: joinData});
        return;
    }

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
        parameters: parameters,
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
