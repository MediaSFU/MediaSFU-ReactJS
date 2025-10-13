import React from "react";
import { ConnectSocketType, ShowAlert, ConnectLocalSocketType, RecordingParams, MeetingRoomParams, CreateMediaSFURoomOptions, JoinMediaSFURoomOptions } from "../../@types/types";
import { CreateRoomOnMediaSFUType, JoinRoomOnMediaSFUType } from "../../methods/utils/joinRoomOnMediaSFU";
import { Socket } from "socket.io-client";
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
    renderLogo?: (options: {
        defaultLogo: React.ReactNode;
    }) => React.ReactNode;
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
        values: {
            name: string;
            eventID: string;
        };
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
declare const PreJoinPage: React.FC<PreJoinPageOptions>;
export default PreJoinPage;
//# sourceMappingURL=PreJoinPage.d.ts.map