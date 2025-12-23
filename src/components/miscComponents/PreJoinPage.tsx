import React, { useState, useRef, useEffect, useCallback } from "react";
const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(" ").trim();
  return filtered.length > 0 ? filtered : undefined;
};
import {
  ConnectSocketType,
  ShowAlert,
  ConnectLocalSocketType,
  ResponseLocalConnection,
  ResponseLocalConnectionData,
  RecordingParams,
  MeetingRoomParams,
  CreateMediaSFURoomOptions,
  JoinMediaSFURoomOptions,
  EventType,
} from "../../@types/types";
import { checkLimitsAndMakeRequest } from "../../methods/utils/checkLimitsAndMakeRequest";
import { createRoomOnMediaSFU } from '../../methods/utils/createRoomOnMediaSFU';
import { CreateRoomOnMediaSFUType, JoinRoomOnMediaSFUType, joinRoomOnMediaSFU } from "../../methods/utils/joinRoomOnMediaSFU";
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
  updateAudioPreference?: (deviceId: string) => void;
  updateVideoPreference?: (deviceId: string) => void;
  updateAudioOutputPreference?: (deviceId: string) => void;
  updateIsDarkMode?: (isDarkMode: boolean) => void;
  updateEventType?: (eventType: EventType) => void;
  updateVirtualBackground?: (background: any) => void;
  updateCurrentFacingMode?: (facingMode: string) => void;
  updateKeepBackground?: (keep: boolean) => void;
  updateAppliedBackground?: (applied: boolean) => void;
  updateSelfieSegmentation?: (selfieSegmentation: any) => void;
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
  returnUI?: boolean;
  noUIPreJoinOptions?: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
  createMediaSFURoom?: CreateRoomOnMediaSFUType;
  joinMediaSFURoom?: JoinRoomOnMediaSFUType;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  logoContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  logoImageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  inputContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  orContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  orTextProps?: React.HTMLAttributes<HTMLSpanElement>;
  toggleContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  toggleButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  createButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  joinButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  createNameInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  durationInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  capacityInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  eventTypeSelectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
  joinNameInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  eventIdInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  errorProps?: React.HTMLAttributes<HTMLParagraphElement>;
  renderContainer?: (options: {
    defaultContainer: React.ReactNode;
    isCreateMode: boolean;
    error: string;
  }) => React.ReactNode;
  renderLogo?: (options: { defaultLogo: React.ReactNode }) => React.ReactNode;
  renderCreateForm?: (options: {
    defaultContent: React.ReactNode;
    values: {
      name: string;
      duration: string;
      eventType: string;
      capacity: string;
    };
    submit: () => Promise<void>;
    setValues: {
      onNameChange: React.ChangeEventHandler<HTMLInputElement>;
      onDurationChange: React.ChangeEventHandler<HTMLInputElement>;
      onEventTypeChange: React.ChangeEventHandler<HTMLSelectElement>;
      onCapacityChange: React.ChangeEventHandler<HTMLInputElement>;
    };
  }) => React.ReactNode;
  renderJoinForm?: (options: {
    defaultContent: React.ReactNode;
    values: { name: string; eventID: string };
    submit: () => Promise<void>;
    setValues: {
      onNameChange: React.ChangeEventHandler<HTMLInputElement>;
      onEventIDChange: React.ChangeEventHandler<HTMLInputElement>;
    };
  }) => React.ReactNode;
  renderToggle?: (options: {
    defaultToggle: React.ReactNode;
    isCreateMode: boolean;
    toggle: () => void;
  }) => React.ReactNode;
  renderError?: (options: {
    defaultError: React.ReactNode;
    error: string;
  }) => React.ReactNode;
  renderContent?: (options: {
    defaultContent: React.ReactNode;
    isCreateMode: boolean;
    error: string;
  }) => React.ReactNode;
}

export type PreJoinPageType = (options: PreJoinPageOptions) => React.JSX.Element;

/**
 * PreJoinPage - A comprehensive pre-meeting entry page with dual create/join functionality.
 * 
 * This component provides a complete pre-meeting interface allowing users to either create new
 * meeting rooms or join existing ones. It handles form validation, API integration, socket
 * connections, and supports both UI and headless (no-UI) modes for flexible integration.
 * 
 * **Key Features:**
 * - **Dual Mode Operation**: Seamless toggle between room creation and joining interfaces
 * - **Room Creation**: Configure event type (chat/broadcast/webinar/conference), duration, capacity
 * - **Room Joining**: Enter event ID, username, and optional security code
 * - **API Integration**: Connects to MediaSFU or local server for room management
 * - **Socket Management**: Establishes WebSocket connections for real-time communication
 * - **Form Validation**: Comprehensive validation with user-friendly error messages
 * - **Headless Mode**: Support for no-UI operation with programmatic configuration
 * - **Credential Management**: Handles API authentication and token management
 * - **Loading States**: Integrated loading modal during connection/validation
 * - **Custom Styling**: 20+ HTML attribute props for complete visual customization
 * - **Render Hooks**: Six custom render functions for logo, forms, toggle, errors, and container
 * - **Media Preferences**: Configure video, audio, and audio output settings before joining
 * - **Local/Remote Servers**: Flexible connection to MediaSFU cloud or local instances
 * - **Scheduled Events**: Support for scheduled meeting times with date/time pickers
 * - **Security Features**: Optional secure codes and waiting room functionality
 * - **Recording Configuration**: Pre-configure recording parameters and event room settings
 * - **Responsive Design**: Mobile-friendly interface with touch-optimized controls
 * 
 * @component
 * 
 * @param {PreJoinPageOptions} props - Configuration options for PreJoinPage
 * @param {PreJoinPageParameters} props.parameters - Core parameters for room operations and state management
 * @param {ShowAlert} [props.parameters.showAlert] - Function to display alert messages to users
 * @param {() => void} props.parameters.updateIsLoadingModalVisible - Function to toggle loading modal visibility
 * @param {ConnectSocketType} [props.parameters.connectSocket] - Function to establish MediaSFU socket connection
 * @param {ConnectLocalSocketType} [props.parameters.connectLocalSocket] - Function to establish local server socket connection
 * @param {(socket: Socket) => void} props.parameters.updateSocket - Function to update the active socket instance
 * @param {(socket: Socket) => void} [props.parameters.updateLocalSocket] - Function to update the local socket instance
 * @param {() => void} props.parameters.updateValidated - Function to mark connection as validated
 * @param {(userName: string) => void} props.parameters.updateApiUserName - Function to store API username
 * @param {(token: string) => void} props.parameters.updateApiToken - Function to store API authentication token
 * @param {(link: string) => void} props.parameters.updateLink - Function to store meeting link
 * @param {(roomName: string) => void} props.parameters.updateRoomName - Function to store room name
 * @param {(member: string) => void} props.parameters.updateMember - Function to store member name
 * @param {string} [props.parameters.imgSrc] - Logo image source URL for branding
 * @param {Credentials} [props.credentials=user_credentials] - API credentials (apiUserName and apiKey)
 * @param {boolean} [props.returnUI=false] - Flag to enable UI mode (true) or headless mode (false)
 * @param {CreateMediaSFURoomOptions | JoinMediaSFURoomOptions} [props.noUIPreJoinOptions] - Configuration for headless mode operation
 * @param {string} [props.localLink=""] - URL for local server connection (empty string for MediaSFU cloud)
 * @param {boolean} [props.connectMediaSFU=true] - Flag to enable MediaSFU cloud connection
 * @param {CreateRoomOnMediaSFUType} [props.createMediaSFURoom=createRoomOnMediaSFU] - Function to create room on MediaSFU
 * @param {JoinRoomOnMediaSFUType} [props.joinMediaSFURoom=joinRoomOnMediaSFU] - Function to join room on MediaSFU
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - HTML attributes for main container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.logoContainerProps] - HTML attributes for logo container
 * @param {React.ImgHTMLAttributes<HTMLImageElement>} [props.logoImageProps] - HTML attributes for logo image
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.inputContainerProps] - HTML attributes for input fields container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.orContainerProps] - HTML attributes for "OR" separator container
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props.orTextProps] - HTML attributes for "OR" text element
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.toggleContainerProps] - HTML attributes for mode toggle container
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.toggleButtonProps] - HTML attributes for toggle button
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.createButtonProps] - HTML attributes for create room button
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.joinButtonProps] - HTML attributes for join room button
 * @param {React.InputHTMLAttributes<HTMLInputElement>} [props.createNameInputProps] - HTML attributes for create mode name input
 * @param {React.InputHTMLAttributes<HTMLInputElement>} [props.durationInputProps] - HTML attributes for duration input
 * @param {React.InputHTMLAttributes<HTMLInputElement>} [props.capacityInputProps] - HTML attributes for capacity input
 * @param {React.SelectHTMLAttributes<HTMLSelectElement>} [props.eventTypeSelectProps] - HTML attributes for event type select
 * @param {React.InputHTMLAttributes<HTMLInputElement>} [props.joinNameInputProps] - HTML attributes for join mode name input
 * @param {React.InputHTMLAttributes<HTMLInputElement>} [props.eventIdInputProps] - HTML attributes for event ID input
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.errorProps] - HTML attributes for error message container
 * @param {(options: {defaultContainer: React.ReactNode}) => React.ReactNode} [props.renderContainer] - Custom render function for main container
 * @param {(options: {defaultLogo: React.ReactNode; imgSrc?: string}) => React.ReactNode} [props.renderLogo] - Custom render function for logo
 * @param {(options: {defaultForm: React.ReactNode}) => React.ReactNode} [props.renderCreateForm] - Custom render function for create room form
 * @param {(options: {defaultForm: React.ReactNode}) => React.ReactNode} [props.renderJoinForm] - Custom render function for join room form
 * @param {(options: {defaultToggle: React.ReactNode; isCreateMode: boolean; toggle: () => void}) => React.ReactNode} [props.renderToggle] - Custom render function for mode toggle
 * @param {(options: {defaultError: React.ReactNode; error: string}) => React.ReactNode} [props.renderError] - Custom render function for error display
 * @param {(options: {defaultContent: React.ReactNode; isCreateMode: boolean; error: string}) => React.ReactNode} [props.renderContent] - Custom render function for entire content area
 * 
 * @returns {React.JSX.Element} The rendered pre-join page component
 * 
 * @example
 * // Basic usage with UI mode
 * ```tsx
 * import React from 'react';
 * import { PreJoinPage } from 'mediasfu-reactjs';
 * 
 * const BasicPreJoin = () => {
 *   const handleAlert = (message: string) => {
 *     alert(message);
 *   };
 * 
 *   return (
 *     <PreJoinPage
 *       credentials={{
 *         apiUserName: 'user123',
 *         apiKey: 'your-api-key'
 *       }}
 *       returnUI={true}
 *       parameters={{
 *         showAlert: handleAlert,
 *         updateIsLoadingModalVisible: (visible) => console.log('Loading:', visible),
 *         connectSocket: async ({ socket, apiUserName, apiToken }) => {
 *           // Socket connection logic
 *         },
 *         updateSocket: (socket) => console.log('Socket updated'),
 *         updateValidated: () => console.log('Validated'),
 *         updateApiUserName: (name) => console.log('API User:', name),
 *         updateApiToken: (token) => console.log('Token set'),
 *         updateLink: (link) => console.log('Link:', link),
 *         updateRoomName: (room) => console.log('Room:', room),
 *         updateMember: (member) => console.log('Member:', member),
 *         imgSrc: 'https://example.com/logo.png'
 *       }}
 *       connectMediaSFU={true}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Custom styled with branding and validation
 * ```tsx
 * import React, { useState } from 'react';
 * import { PreJoinPage } from 'mediasfu-reactjs';
 * 
 * const BrandedPreJoin = () => {
 *   const [isLoading, setIsLoading] = useState(false);
 * 
 *   return (
 *     <PreJoinPage
 *       credentials={{
 *         apiUserName: 'company_user',
 *         apiKey: 'company_api_key'
 *       }}
 *       returnUI={true}
 *       parameters={{
 *         showAlert: (message) => {
 *           console.log('Alert:', message);
 *         },
 *         updateIsLoadingModalVisible: setIsLoading,
 *         connectSocket: async (options) => {},
 *         updateSocket: (socket) => {},
 *         updateValidated: () => {},
 *         updateApiUserName: (name) => {},
 *         updateApiToken: (token) => {},
 *         updateLink: (link) => {},
 *         updateRoomName: (room) => {},
 *         updateMember: (member) => {},
 *         imgSrc: 'https://company.com/logo.svg'
 *       }}
 *       containerProps={{
 *         style: {
 *           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 *           minHeight: '100vh',
 *           fontFamily: "'Inter', sans-serif"
 *         }
 *       }}
 *       createButtonProps={{
 *         style: {
 *           backgroundColor: '#10b981',
 *           padding: '14px 28px',
 *           borderRadius: '8px',
 *           fontSize: '16px',
 *           fontWeight: '600',
 *           border: 'none',
 *           cursor: 'pointer',
 *           transition: 'all 0.3s'
 *         }
 *       }}
 *       joinButtonProps={{
 *         style: {
 *           backgroundColor: '#3b82f6',
 *           padding: '14px 28px',
 *           borderRadius: '8px',
 *           fontSize: '16px',
 *           fontWeight: '600',
 *           border: 'none',
 *           cursor: 'pointer'
 *         }
 *       }}
 *       renderLogo={({ imgSrc }) => (
 *         <div style={{ textAlign: 'center', marginBottom: '40px' }}>
 *           <img src={imgSrc} alt="Company Logo" style={{ width: '200px' }} />
 *           <h1 style={{ color: 'white', marginTop: '20px' }}>Welcome to Our Platform</h1>
 *         </div>
 *       )}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Analytics tracking with event monitoring
 * ```tsx
 * import React, { useEffect } from 'react';
 * import { PreJoinPage } from 'mediasfu-reactjs';
 * 
 * const AnalyticsPreJoin = () => {
 *   useEffect(() => {
 *     analytics.page('Pre-Join Page Viewed');
 *   }, []);
 * 
 *   return (
 *     <PreJoinPage
 *       credentials={{
 *         apiUserName: 'analytics_user',
 *         apiKey: 'analytics_key'
 *       }}
 *       returnUI={true}
 *       parameters={{
 *         showAlert: (message) => {
 *           analytics.track('Alert Shown', { message });
 *           alert(message);
 *         },
 *         updateIsLoadingModalVisible: (visible) => {
 *           analytics.track('Loading State Changed', { visible });
 *         },
 *         connectSocket: async (options) => {
 *           analytics.track('Socket Connection Initiated', {
 *             apiUserName: options.apiUserName
 *           });
 *         },
 *         updateValidated: () => {
 *           analytics.track('Connection Validated');
 *         },
 *         updateRoomName: (room) => {
 *           analytics.track('Room Entered', { roomName: room });
 *         },
 *         updateSocket: (socket) => {},
 *         updateApiUserName: (name) => {},
 *         updateApiToken: (token) => {},
 *         updateLink: (link) => {},
 *         updateMember: (member) => {}
 *       }}
 *       renderToggle={({ defaultToggle, isCreateMode, toggle }) => (
 *         <div onClick={() => {
 *           analytics.track('Mode Toggled', {
 *             from: isCreateMode ? 'create' : 'join',
 *             to: isCreateMode ? 'join' : 'create'
 *           });
 *           toggle();
 *         }}>
 *           {defaultToggle}
 *         </div>
 *       )}
 *       createMediaSFURoom={async (options) => {
 *         analytics.track('Room Creation Attempted', {
 *           eventType: options.eventType,
 *           duration: options.duration,
 *           capacity: options.capacity
 *         });
 *         const result = await createRoomOnMediaSFU(options);
 *         analytics.track('Room Created Successfully', {
 *           eventType: options.eventType
 *         });
 *         return result;
 *       }}
 *       joinMediaSFURoom={async (options) => {
 *         analytics.track('Room Join Attempted', {
 *           eventID: options.eventID
 *         });
 *         const result = await joinRoomOnMediaSFU(options);
 *         analytics.track('Room Joined Successfully');
 *         return result;
 *       }}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, PreJoinPage } from 'mediasfu-reactjs';
 * 
 * const CustomPreJoin = (props) => (
 *   <PreJoinPage
 *     {...props}
 *     renderContent={({ defaultContent, isCreateMode, error }) => (
 *       <div className="custom-prejoin-wrapper">
 *         <div className="welcome-banner">
 *           <h2>🎥 {isCreateMode ? 'Start Your Meeting' : 'Join the Meeting'}</h2>
 *           <p>Connect with your team in seconds</p>
 *         </div>
 *         {error && (
 *           <div className="error-banner" style={{
 *             backgroundColor: '#fee',
 *             color: '#c00',
 *             padding: '12px',
 *             borderRadius: '6px',
 *             marginBottom: '20px'
 *           }}>
 *             ⚠️ {error}
 *           </div>
 *         )}
 *         {defaultContent}
 *         <div className="help-section">
 *           <a href="/help">Need help?</a>
 *           <span> | </span>
 *           <a href="/privacy">Privacy Policy</a>
 *         </div>
 *       </div>
 *     )}
 *     renderCreateForm={({ defaultForm }) => (
 *       <div className="enhanced-create-form">
 *         <div className="form-header">
 *           <h3>Create New Room</h3>
 *           <p>Set up your meeting parameters</p>
 *         </div>
 *         {defaultForm}
 *         <div className="form-footer">
 *           <small>🔒 Your meeting will be secure and encrypted</small>
 *         </div>
 *       </div>
 *     )}
 *   />
 * );
 * 
 * const App = () => {
 *   const [credentials] = useState({
 *     apiUserName: 'user123',
 *     apiKey: 'your-api-key'
 *   });
 * 
 *   return (
 *     <MediasfuGeneric
 *       credentials={credentials}
 *       uiOverrides={{
 *         PreJoinPage: CustomPreJoin
 *       }}
 *     />
 *   );
 * };
 * ```
 */

const PreJoinPage: React.FC<PreJoinPageOptions> = ({
  localLink = "",
  connectMediaSFU = true,
  parameters,
  credentials = user_credentials,
  returnUI = false,
  noUIPreJoinOptions,
  createMediaSFURoom = createRoomOnMediaSFU,
  joinMediaSFURoom = joinRoomOnMediaSFU,
  containerProps,
  logoContainerProps,
  logoImageProps,
  inputContainerProps,
  orContainerProps,
  orTextProps,
  toggleContainerProps,
  toggleButtonProps,
  createButtonProps,
  joinButtonProps,
  createNameInputProps,
  durationInputProps,
  capacityInputProps,
  eventTypeSelectProps,
  joinNameInputProps,
  eventIdInputProps,
  errorProps,
  renderContainer,
  renderLogo,
  renderCreateForm,
  renderJoinForm,
  renderToggle,
  renderError,
  renderContent,
}) => {
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [eventID, setEventID] = useState<string>("");
  const [error, setError] = useState<string>("");
  const pending = useRef(false);

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

  const handleCreateRoom = async () => {
    if (pending.current) {
      return;
    }
    pending.current = true;
    let payload = {} as CreateMediaSFURoomOptions;
    if (returnUI) {
      if (!name || !duration || !eventType || !capacity) {
        setError("Please fill all the fields.");
        return;
      }
      payload = {
        action: "create",
        duration: parseInt(duration),
        capacity: parseInt(capacity),
        eventType: eventType as "chat" | "broadcast" | "webinar" | "conference",
        userName: name,
        recordOnly: false,
      };
    } else {
      if (
        noUIPreJoinOptions &&
        "action" in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === "create"
      ) {
        payload = noUIPreJoinOptions as CreateMediaSFURoomOptions;
      } else {
        pending.current = false;
        throw new Error(
          "Invalid options provided for creating a room without UI."
        );
      }
    }

    updateIsLoadingModalVisible(true);

    if (localLink.length > 0) {
      const secureCode =
        Math.random().toString(30).substring(2, 14) +
        Math.random().toString(30).substring(2, 14);
      let eventID =
        new Date().getTime().toString(30) +
        new Date().getUTCMilliseconds() +
        Math.floor(10 + Math.random() * 99).toString();
      eventID = "m" + eventID;
      const eventRoomParams = localData.current?.meetingRoomParams_;
      eventRoomParams!.type = eventType as
        | "chat"
        | "broadcast"
        | "webinar"
        | "conference";

      const createData: CreateLocalRoomParameters = {
        eventID: eventID,
        duration: payload.duration,
        capacity: payload.capacity,
        userName: payload.userName,
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

      if (
        connectMediaSFU &&
        initSocket.current &&
        localData.current &&
        localData.current.apiUserName &&
        localData.current.apiKey
      ) {
        // Store references to prevent race conditions
        const apiUserName = localData.current.apiUserName;
        const apiKey = localData.current.apiKey;
        
        // Build a unique identifier for this create request
        const roomIdentifier = `local_create_${payload.userName}_${payload.duration}_${payload.capacity}`;
        const pendingKey = `prejoin_pending_${roomIdentifier}`;
        const PENDING_TIMEOUT = 30 * 1000; // 30 seconds

        // Check pending status to prevent duplicate requests
        try {
          const pendingRequest = localStorage.getItem(pendingKey);
          if (pendingRequest) {
            const pendingData = JSON.parse(pendingRequest);
            const timeSincePending = Date.now() - (pendingData?.timestamp ?? 0);
            if (timeSincePending < PENDING_TIMEOUT) {
              pending.current = false;
              updateIsLoadingModalVisible(false);
              setError('Room creation already in progress');
              return;
            } else {
              // Stale lock, clear it
              try {
                localStorage.removeItem(pendingKey);
              } catch {
                // Ignore localStorage errors
              }
            }
          }
        } catch {
          // Ignore localStorage read/JSON errors
        }

        // Mark request as pending
        try {
          localStorage.setItem(
            pendingKey,
            JSON.stringify({
              timestamp: Date.now(),
              payload: {
                action: 'create',
                userName: payload.userName,
                duration: payload.duration,
                capacity: payload.capacity,
              },
            })
          );

          // Auto-clear the pending flag after timeout to avoid stale locks
          setTimeout(() => {
            try {
              localStorage.removeItem(pendingKey);
            } catch {
              // Ignore localStorage errors
            }
          }, PENDING_TIMEOUT);
        } catch {
          // Ignore localStorage write errors
        }
        
        payload.recordOnly = true; // allow production to mediasfu only; no consumption
        
        try {
          const response = await roomCreator({
            payload,
            apiUserName: apiUserName,
            apiKey: apiKey,
            validate: false,
          });
          
          // Clear pending status on completion
          try { 
            localStorage.removeItem(pendingKey); 
          } catch { 
            /* ignore */ 
          }
          
          if (
            response &&
            response.success &&
            response.data &&
            "roomName" in response.data
          ) {
            createData.eventID = response.data.roomName;
            createData.secureCode = response.data.secureCode || "";
            createData.mediasfuURL = response.data.publicURL;
            await createLocalRoom({
              createData: createData,
              link: response.data.link,
            });
          } else {
            pending.current = false;
            updateIsLoadingModalVisible(false);
            setError(`Unable to create room on MediaSFU.`);
            try {
              updateSocket(initSocket.current);
              await createLocalRoom({ createData: createData });
              pending.current = false;
            } catch (error) {
              pending.current = false;
              updateIsLoadingModalVisible(false);
              setError(`Unable to create room. ${error}`);
            }
          }
        } catch (error) {
          // Clear pending status on error
          try { 
            localStorage.removeItem(pendingKey); 
          } catch { 
            /* ignore */ 
          }
          pending.current = false;
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room on MediaSFU. ${error}`);
        }
      } else {
        try {
          updateSocket(initSocket.current!);
          await createLocalRoom({ createData: createData });
          pending.current = false;
        } catch (error) {
          pending.current = false;
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room. ${error}`);
        }
      }
    } else {
      // Build a unique identifier for this create request (non-local)
      const roomIdentifier = `mediasfu_create_${payload.userName}_${payload.duration}_${payload.capacity}`;
      const pendingKey = `prejoin_pending_${roomIdentifier}`;
      const PENDING_TIMEOUT = 30 * 1000; // 30 seconds

      // Check pending status to prevent duplicate requests
      try {
        const pendingRequest = localStorage.getItem(pendingKey);
        if (pendingRequest) {
          const pendingData = JSON.parse(pendingRequest);
          const timeSincePending = Date.now() - (pendingData?.timestamp ?? 0);
          if (timeSincePending < PENDING_TIMEOUT) {
            pending.current = false;
            updateIsLoadingModalVisible(false);
            setError('Room creation already in progress');
            return;
          } else {
            // Stale lock, clear it
            try {
              localStorage.removeItem(pendingKey);
            } catch {
              // Ignore localStorage errors
            }
          }
        }
      } catch {
        // Ignore localStorage read/JSON errors
      }

      // Mark request as pending
      try {
        localStorage.setItem(
          pendingKey,
          JSON.stringify({
            timestamp: Date.now(),
            payload: {
              action: 'create',
              userName: payload.userName,
              duration: payload.duration,
              capacity: payload.capacity,
            },
          })
        );

        // Auto-clear the pending flag after timeout to avoid stale locks
        setTimeout(() => {
          try {
            localStorage.removeItem(pendingKey);
          } catch {
            // Ignore localStorage errors
          }
        }, PENDING_TIMEOUT);
      } catch {
        // Ignore localStorage write errors
      }

      try {
        await roomCreator({
          payload,
          apiUserName: credentials.apiUserName,
          apiKey: credentials.apiKey,
          validate: true,
        });
        
        // Clear pending status on completion
        try { 
          localStorage.removeItem(pendingKey); 
        } catch { 
          /* ignore */ 
        }
        
        pending.current = false;
      } catch (error) {
        // Clear pending status on error
        try { 
          localStorage.removeItem(pendingKey); 
        } catch { 
          /* ignore */ 
        }
        pending.current = false;
        updateIsLoadingModalVisible(false);
        setError(`Unable to create room. ${error}`);
      }
    }
  };

  const handleJoinRoom = async () => {
    if (pending.current) {
      return;
    }
    pending.current = true;
    let payload = {} as JoinMediaSFURoomOptions;
    if (returnUI) {
      if (!name || !eventID) {
        setError("Please fill all the fields.");
        return;
      }

      payload = {
        action: "join",
        meetingID: eventID,
        userName: name,
      };
    } else {
      if (
        noUIPreJoinOptions &&
        "action" in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === "join"
      ) {
        payload = noUIPreJoinOptions as JoinMediaSFURoomOptions;
      } else {
        throw new Error(
          "Invalid options provided for joining a room without UI."
        );
      }
    }
  
    if (localLink.length > 0 && !localLink.includes("mediasfu.com")) {
      const joinData: JoinLocalEventRoomParameters = {
        eventID: payload.meetingID,
        userName: payload.userName,
        secureCode: "",
        videoPreference: null,
        audioPreference: null,
        audioOutputPreference: null,
      };

      await joinLocalRoom({ joinData: joinData });
      pending.current = false;
      return;
    }

    updateIsLoadingModalVisible(true);

    const response = await joinMediaSFURoom({
      payload,
      apiUserName: credentials.apiUserName,
      apiKey: credentials.apiKey,
      localLink: localLink,
    });
    if (response.success && response.data && "roomName" in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response.data.link,
        userName: payload.userName,
        parameters: parameters,
      });
      pending.current = false;
    } else {
      pending.current = false;
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

  const joinLocalRoom = async ({
    joinData,
    link = localLink,
  }: JoinLocalEventRoomOptions) => {
    initSocket.current?.emit(
      "joinEventRoom",
      joinData,
      (response: CreateJoinLocalRoomResponse) => {
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
      }
    );
  };

  const createLocalRoom = async ({
    createData,
    link = localLink,
  }: CreateLocalRoomOptions) => {
    initSocket.current?.emit(
      "createRoom",
      createData,
      (response: CreateJoinLocalRoomResponse) => {
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
      }
    );
  };

  const roomCreator = async ({
    payload,
    apiUserName,
    apiKey,
    validate = true,
  }: {
    payload: any;
    apiUserName: string;
    apiKey: string;
    validate?: boolean;
  }) => {
    const response = await createMediaSFURoom({
      payload,
      apiUserName: apiUserName,
      apiKey: apiKey,
      localLink: localLink,
    });
    if (response.success && response.data && "roomName" in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response!.data.link,
        userName: payload.userName,
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

  const checkProceed = async ({
    returnUI,
    noUIPreJoinOptions,
  }: {
    returnUI: boolean;
    noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
  }) => {
    if (!returnUI && noUIPreJoinOptions) {
      if (
        "action" in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === "create"
      ) {
        // update all the required parameters and call
        const createOptions: CreateMediaSFURoomOptions =
          noUIPreJoinOptions as CreateMediaSFURoomOptions;
        if (
          !createOptions.userName ||
          !createOptions.duration ||
          !createOptions.eventType ||
          !createOptions.capacity
        ) {
          throw new Error(
            "Please provide all the required parameters: userName, duration, eventType, capacity"
          );
        }

        await handleCreateRoom();
      } else if (
        "action" in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === "join"
      ) {
        // update all the required parameters and call
        const joinOptions: JoinMediaSFURoomOptions =
          noUIPreJoinOptions as JoinMediaSFURoomOptions;
        if (!joinOptions.userName || !joinOptions.meetingID) {
          throw new Error(
            "Please provide all the required parameters: userName, meetingID"
          );
        }

        await handleJoinRoom();
      } else {
        throw new Error(
          "Invalid options provided for creating/joining a room without UI."
        );
      }
    }
  };

  useEffect(() => {
    if (
      localLink.length > 0 &&
      !localConnected.current &&
      !initSocket.current
    ) {
      try {
        connectLocalSocket?.({ link: localLink })
          .then((response: ResponseLocalConnection | undefined) => {
            localData.current = response!.data;
            initSocket.current = response!.socket;
            localConnected.current = true;

            if (!returnUI && noUIPreJoinOptions) {
              checkProceed({ returnUI, noUIPreJoinOptions });
            }
          })
          .catch((error) => {
            showAlert?.({
              message: `Unable to connect to ${localLink}. ${error}`,
              type: "danger",
              duration: 3000,
            });
          });
      } catch {
        showAlert?.({
          message: `Unable to connect to ${localLink}. Something went wrong.`,
          type: "danger",
          duration: 3000,
        });
      }
    } else if (localLink.length === 0 && !initSocket.current) {
      if (!returnUI && noUIPreJoinOptions) {
        checkProceed({ returnUI, noUIPreJoinOptions });
      }
    }
  }, []);

  const handleToggleMode = useCallback(() => {
    setIsCreateMode((prev) => !prev);
    setError("");
  }, []);

  if (!returnUI) {
    return <></>;
  }

  const {
    className: containerClassName,
    style: containerStyleOverrides,
    ...restContainerProps
  } = containerProps ?? {};

  const {
    className: logoContainerClassName,
    style: logoContainerStyleOverrides,
    ...restLogoContainerProps
  } = logoContainerProps ?? {};

  const {
    className: inputContainerClassName,
    style: inputContainerStyleOverrides,
    ...restInputContainerProps
  } = inputContainerProps ?? {};

  const {
    className: orContainerClassName,
    style: orContainerStyleOverrides,
    ...restOrContainerProps
  } = orContainerProps ?? {};

  const {
    className: orTextClassName,
    style: orTextStyleOverrides,
    ...restOrTextProps
  } = orTextProps ?? {};

  const {
    className: toggleContainerClassName,
    style: toggleContainerStyleOverrides,
    ...restToggleContainerProps
  } = toggleContainerProps ?? {};

  const {
    className: toggleButtonClassName,
    style: toggleButtonStyleOverrides,
    onClick: toggleButtonOnClick,
    ...restToggleButtonProps
  } = toggleButtonProps ?? {};

  const {
    className: errorClassName,
    style: errorStyleOverrides,
    ...restErrorProps
  } = errorProps ?? {};

  const {
    style: logoImageStyleOverrides,
    alt: logoImageAlt,
    src: logoImageSrc,
    ...restLogoImageProps
  } = logoImageProps ?? {};

  const {
    style: createNameInputStyleOverrides,
    onChange: createNameInputOnChange,
    type: createNameInputType,
    placeholder: createNameInputPlaceholder,
    ...restCreateNameInputProps
  } = createNameInputProps ?? {};

  const {
    style: durationInputStyleOverrides,
    onChange: durationInputOnChange,
    type: durationInputType,
    placeholder: durationInputPlaceholder,
    ...restDurationInputProps
  } = durationInputProps ?? {};

  const {
    style: capacityInputStyleOverrides,
    onChange: capacityInputOnChange,
    type: capacityInputType,
    placeholder: capacityInputPlaceholder,
    ...restCapacityInputProps
  } = capacityInputProps ?? {};

  const {
    style: eventTypeSelectStyleOverrides,
    onChange: eventTypeSelectOnChange,
    ...restEventTypeSelectProps
  } = eventTypeSelectProps ?? {};

  const {
    style: joinNameInputStyleOverrides,
    onChange: joinNameInputOnChange,
    type: joinNameInputType,
    placeholder: joinNameInputPlaceholder,
    ...restJoinNameInputProps
  } = joinNameInputProps ?? {};

  const {
    style: eventIdInputStyleOverrides,
    onChange: eventIdInputOnChange,
    type: eventIdInputType,
    placeholder: eventIdInputPlaceholder,
    ...restEventIdInputProps
  } = eventIdInputProps ?? {};

  const {
    style: createButtonStyleOverrides,
    onClick: createButtonOnClick,
    children: createButtonChildren,
    ...restCreateButtonProps
  } = createButtonProps ?? {};

  const {
    style: joinButtonStyleOverrides,
    onClick: joinButtonOnClick,
    children: joinButtonChildren,
    ...restJoinButtonProps
  } = joinButtonProps ?? {};

  const createFormDefault = (
    <>
      <input
        type={createNameInputType ?? "text"}
        placeholder={createNameInputPlaceholder ?? "Display Name"}
        value={name}
        onChange={(event) => {
          createNameInputOnChange?.(event);
          if (!event.defaultPrevented) {
            setName(event.target.value);
          }
        }}
        style={{
          ...styles.inputField,
          ...createNameInputStyleOverrides,
        }}
        {...restCreateNameInputProps}
      />
      <input
        type={durationInputType ?? "text"}
        placeholder={durationInputPlaceholder ?? "Duration (minutes)"}
        value={duration}
        onChange={(event) => {
          durationInputOnChange?.(event);
          if (!event.defaultPrevented) {
            setDuration(event.target.value);
          }
        }}
        style={{
          ...styles.inputField,
          ...durationInputStyleOverrides,
        }}
        {...restDurationInputProps}
      />
      <select
        value={eventType}
        onChange={(event) => {
          eventTypeSelectOnChange?.(event);
          if (!event.defaultPrevented) {
            setEventType(event.target.value);
          }
        }}
        style={{
          ...styles.selectField,
          ...eventTypeSelectStyleOverrides,
        }}
        {...restEventTypeSelectProps}
      >
        <option value="">Select Event Type</option>
        <option value="chat">Chat</option>
        <option value="broadcast">Broadcast</option>
        <option value="webinar">Webinar</option>
        <option value="conference">Conference</option>
      </select>
      <input
        type={capacityInputType ?? "text"}
        placeholder={capacityInputPlaceholder ?? "Room Capacity"}
        value={capacity}
        onChange={(event) => {
          capacityInputOnChange?.(event);
          if (!event.defaultPrevented) {
            setCapacity(event.target.value);
          }
        }}
        style={{
          ...styles.inputField,
          ...capacityInputStyleOverrides,
        }}
        {...restCapacityInputProps}
      />
      <button
        type="button"
        onClick={async (event) => {
          await Promise.resolve(createButtonOnClick?.(event));
          if (!event.defaultPrevented) {
            await handleCreateRoom();
          }
        }}
        style={{
          ...styles.actionButton,
          ...createButtonStyleOverrides,
        }}
        {...restCreateButtonProps}
      >
        {createButtonChildren ?? "Create Room"}
      </button>
    </>
  );

  const createFormNode = renderCreateForm
    ? renderCreateForm({
        defaultContent: createFormDefault,
        values: {
          name,
          duration,
          eventType,
          capacity,
        },
        submit: handleCreateRoom,
        setValues: {
          onNameChange: (event) => {
            createNameInputOnChange?.(event);
            if (!event.defaultPrevented) {
              setName(event.target.value);
            }
          },
          onDurationChange: (event) => {
            durationInputOnChange?.(event);
            if (!event.defaultPrevented) {
              setDuration(event.target.value);
            }
          },
          onEventTypeChange: (event) => {
            eventTypeSelectOnChange?.(event);
            if (!event.defaultPrevented) {
              setEventType(event.target.value);
            }
          },
          onCapacityChange: (event) => {
            capacityInputOnChange?.(event);
            if (!event.defaultPrevented) {
              setCapacity(event.target.value);
            }
          },
        },
      })
    : createFormDefault;

  const joinFormDefault = (
    <>
      <input
        type={joinNameInputType ?? "text"}
        placeholder={joinNameInputPlaceholder ?? "Display Name"}
        value={name}
        onChange={(event) => {
          joinNameInputOnChange?.(event);
          if (!event.defaultPrevented) {
            setName(event.target.value);
          }
        }}
        style={{
          ...styles.inputField,
          ...joinNameInputStyleOverrides,
        }}
        {...restJoinNameInputProps}
      />
      <input
        type={eventIdInputType ?? "text"}
        placeholder={eventIdInputPlaceholder ?? "Event ID"}
        value={eventID}
        onChange={(event) => {
          eventIdInputOnChange?.(event);
          if (!event.defaultPrevented) {
            setEventID(event.target.value);
          }
        }}
        style={{
          ...styles.inputField,
          ...eventIdInputStyleOverrides,
        }}
        {...restEventIdInputProps}
      />
      <button
        type="button"
        onClick={async (event) => {
          await Promise.resolve(joinButtonOnClick?.(event));
          if (!event.defaultPrevented) {
            await handleJoinRoom();
          }
        }}
        style={{
          ...styles.actionButton,
          ...joinButtonStyleOverrides,
        }}
        {...restJoinButtonProps}
      >
        {joinButtonChildren ?? "Join Room"}
      </button>
    </>
  );

  const joinFormNode = renderJoinForm
    ? renderJoinForm({
        defaultContent: joinFormDefault,
        values: { name, eventID },
        submit: handleJoinRoom,
        setValues: {
          onNameChange: (event) => {
            joinNameInputOnChange?.(event);
            if (!event.defaultPrevented) {
              setName(event.target.value);
            }
          },
          onEventIDChange: (event) => {
            eventIdInputOnChange?.(event);
            if (!event.defaultPrevented) {
              setEventID(event.target.value);
            }
          },
        },
      })
    : joinFormDefault;

  const {
    children: orTextChildren,
    ...restOrTextWithoutChildren
  } = restOrTextProps;

  const errorDefault = error ? (
    <p
      className={joinClassNames("prejoin-error", errorClassName)}
      style={{
        ...styles.error,
        ...errorStyleOverrides,
      }}
      {...restErrorProps}
    >
      {error}
    </p>
  ) : null;

  const errorNode = renderError
    ? renderError({ defaultError: errorDefault, error })
    : errorDefault;

  const logoDefault = (
    <div
      className={joinClassNames("prejoin-logo-container", logoContainerClassName)}
      style={{
        ...styles.logoContainer,
        ...logoContainerStyleOverrides,
      }}
      {...restLogoContainerProps}
    >
      <img
        src={
          logoImageSrc ??
          parameters.imgSrc ??
          "https://mediasfu.com/images/logo192.png"
        }
        style={{
          ...styles.logoImage,
          ...logoImageStyleOverrides,
        }}
        alt={logoImageAlt ?? "Logo"}
        {...restLogoImageProps}
      />
    </div>
  );

  const logoNode = renderLogo
    ? renderLogo({ defaultLogo: logoDefault })
    : logoDefault;

  const inputContainerNode = (
    <div
      className={joinClassNames(
        "prejoin-input-container",
        inputContainerClassName
      )}
      style={{
        ...styles.inputContainer,
        ...inputContainerStyleOverrides,
      }}
      {...restInputContainerProps}
    >
      {isCreateMode ? createFormNode : joinFormNode}
      {errorNode}
    </div>
  );

  const orNode = (
    <div
      className={joinClassNames("prejoin-or-container", orContainerClassName)}
      style={{
        ...styles.orContainer,
        ...orContainerStyleOverrides,
      }}
      {...restOrContainerProps}
    >
      <span
        className={joinClassNames("prejoin-or-text", orTextClassName)}
        style={{
          ...styles.orText,
          ...orTextStyleOverrides,
        }}
        {...restOrTextWithoutChildren}
      >
        {orTextChildren ?? "OR"}
      </span>
    </div>
  );

  const toggleButtonNode = (
    <button
      type="button"
      className={joinClassNames("prejoin-toggle-button", toggleButtonClassName)}
      style={{
        ...styles.toggleButton,
        ...toggleButtonStyleOverrides,
      }}
      onClick={async (event) => {
        await Promise.resolve(toggleButtonOnClick?.(event));
        if (!event.defaultPrevented) {
          handleToggleMode();
        }
      }}
      {...restToggleButtonProps}
    >
      {restToggleButtonProps.children ??
        (isCreateMode ? "Switch to Join Mode" : "Switch to Create Mode")}
    </button>
  );

  const toggleDefault = (
    <div
      className={joinClassNames(
        "prejoin-toggle-container",
        toggleContainerClassName
      )}
      style={{
        ...styles.toggleContainer,
        ...toggleContainerStyleOverrides,
      }}
      {...restToggleContainerProps}
    >
      {toggleButtonNode}
    </div>
  );

  const toggleNode = renderToggle
    ? renderToggle({
        defaultToggle: toggleDefault,
        isCreateMode,
        toggle: handleToggleMode,
      })
    : toggleDefault;

  const contentDefault = (
    <>
      {logoNode}
      {inputContainerNode}
      {orNode}
      {toggleNode}
    </>
  );

  const contentNode = renderContent
    ? renderContent({
        defaultContent: contentDefault,
        isCreateMode,
        error,
      })
    : contentDefault;

  const containerNode = (
    <div
      className={joinClassNames("prejoin-container", containerClassName)}
      style={{
        ...styles.container,
        ...containerStyleOverrides,
      }}
      {...restContainerProps}
    >
      {contentNode}
    </div>
  );

  return renderContainer
    ? renderContainer({
        defaultContainer: containerNode,
        isCreateMode,
        error,
      })
    : containerNode;
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
