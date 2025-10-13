import React from "react";
import { Socket } from "socket.io-client";
import { ConnectSocketType } from "../../sockets/SocketManager";
import { ShowAlert } from "../../@types/types";
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
export interface WelcomePageOptions {
    parameters: WelcomePageParameters;
}
export type WelcomePageType = (options: WelcomePageOptions) => React.JSX.Element;
/**
 * WelcomePage - Event entry interface with manual input and QR code scanning
 *
 * The default pre-join page that allows users to enter event credentials manually
 * or scan a QR code. Handles validation, rate limiting, and socket connection
 * establishment before entering the main event room.
 *
 * Features:
 * - Manual event detail entry (name, event ID, secret/passcode)
 * - QR code scanning support (optional)
 * - Rate limiting (max 10 failed attempts, 3-hour cooldown)
 * - Socket connection establishment
 * - Credential validation and error handling
 * - Persistent attempt tracking via cookies
 * - MediaSFU logo branding
 * - Responsive form layout
 *
 * @component
 * @param {WelcomePageOptions} options - Configuration options
 * @param {WelcomePageParameters} options.parameters - MediaSFU parameters object
 * @param {string} [options.parameters.imgSrc] - Custom logo image source
 * @param {ShowAlert} [options.parameters.showAlert] - Alert display function
 * @param {Function} options.parameters.updateIsLoadingModalVisible - Loading state updater
 * @param {ConnectSocketType} options.parameters.connectSocket - Socket connection function
 * @param {Function} options.parameters.updateSocket - Socket instance updater
 * @param {Function} options.parameters.updateValidated - Validation state updater
 * @param {Function} options.parameters.updateApiUserName - API username updater
 * @param {Function} options.parameters.updateApiToken - API token updater
 * @param {Function} options.parameters.updateLink - Event link updater
 * @param {Function} options.parameters.updateRoomName - Room name updater
 * @param {Function} options.parameters.updateMember - Member name updater
 *
 * @returns {React.JSX.Element} Rendered welcome page
 *
 * @example
 * // Basic usage as default pre-join page
 * ```tsx
 * import React from 'react';
 * import { MediasfuGeneric, WelcomePage } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MediasfuGeneric
 *       PrejoinPage={WelcomePage}
 *       credentials={{ apiUserName: '', apiKey: '' }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Custom branded welcome page
 * ```tsx
 * import { MediasfuGeneric, WelcomePage } from 'mediasfu-reactjs';
 * import brandLogo from './assets/brand-logo.png';
 *
 * function App() {
 *   const customParameters = {
 *     imgSrc: brandLogo,
 *     showAlert: ({ message, type }) => {
 *       // Custom alert implementation
 *       toast[type](message);
 *     },
 *     updateIsLoadingModalVisible: (visible) => setLoading(visible),
 *     connectSocket: connectSocket,
 *     updateSocket: setSocket,
 *     updateValidated: setValidated,
 *     updateApiUserName: setApiUserName,
 *     updateApiToken: setApiToken,
 *     updateLink: setLink,
 *     updateRoomName: setRoomName,
 *     updateMember: setMember,
 *   };
 *
 *   return (
 *     <MediasfuGeneric
 *       PrejoinPage={(props) => <WelcomePage parameters={customParameters} />}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Completely custom pre-join page replacing WelcomePage
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric } from 'mediasfu-reactjs';
 *
 * function CustomWelcome({ parameters }) {
 *   const [eventCode, setEventCode] = useState('');
 *   const [userName, setUserName] = useState('');
 *
 *   const handleJoin = async () => {
 *     // Parse event code format: username_eventid_secret
 *     const [apiUserName, eventID, apiToken] = eventCode.split('_');
 *
 *     parameters.updateIsLoadingModalVisible(true);
 *
 *     try {
 *       const socket = await parameters.connectSocket({
 *         apiUserName,
 *         apiKey: apiToken,
 *         apiToken,
 *         link: 'https://mediasfu.com',
 *       });
 *
 *       parameters.updateSocket(socket);
 *       parameters.updateApiUserName(apiUserName);
 *       parameters.updateApiToken(apiToken);
 *       parameters.updateRoomName(eventID);
 *       parameters.updateMember(userName);
 *       parameters.updateValidated(true);
 *     } catch (error) {
 *       parameters.showAlert?.({
 *         message: 'Failed to join event',
 *         type: 'danger',
 *         duration: 3000,
 *       });
 *     } finally {
 *       parameters.updateIsLoadingModalVisible(false);
 *     }
 *   };
 *
 *   return (
 *     <div style={{
 *       display: 'flex',
 *       flexDirection: 'column',
 *       alignItems: 'center',
 *       justifyContent: 'center',
 *       minHeight: '100vh',
 *       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 *       padding: 20,
 *     }}>
 *       <div style={{
 *         background: 'white',
 *         padding: 40,
 *         borderRadius: 20,
 *         boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
 *         maxWidth: 400,
 *         width: '100%',
 *       }}>
 *         <h1 style={{ marginBottom: 24, textAlign: 'center' }}>Join Event</h1>
 *         <input
 *           type="text"
 *           placeholder="Your Name"
 *           value={userName}
 *           onChange={(e) => setUserName(e.target.value)}
 *           style={{
 *             width: '100%',
 *             padding: 12,
 *             marginBottom: 16,
 *             borderRadius: 8,
 *             border: '1px solid #e2e8f0',
 *           }}
 *         />
 *         <input
 *           type="text"
 *           placeholder="Event Code (username_eventid_secret)"
 *           value={eventCode}
 *           onChange={(e) => setEventCode(e.target.value)}
 *           style={{
 *             width: '100%',
 *             padding: 12,
 *             marginBottom: 20,
 *             borderRadius: 8,
 *             border: '1px solid #e2e8f0',
 *           }}
 *         />
 *         <button
 *           onClick={handleJoin}
 *           disabled={!userName || !eventCode}
 *           style={{
 *             width: '100%',
 *             padding: 14,
 *             background: '#667eea',
 *             color: 'white',
 *             border: 'none',
 *             borderRadius: 8,
 *             fontWeight: 600,
 *             cursor: userName && eventCode ? 'pointer' : 'not-allowed',
 *             opacity: userName && eventCode ? 1 : 0.5,
 *           }}
 *         >
 *           Join Now
 *         </button>
 *       </div>
 *     </div>
 *   );
 * }
 *
 * function App() {
 *   return <MediasfuGeneric PrejoinPage={CustomWelcome} />;
 * }
 * ```
 *
 * @example
 * // Override via uiOverrides
 * ```tsx
 * import { MediasfuGeneric, WelcomePage } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   welcomePage: {
 *     component: (props) => (
 *       <div style={{ background: '#0f172a' }}>
 *         <WelcomePage {...props} />
 *       </div>
 *     ),
 *   },
 * };
 *
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
 */
declare const WelcomePage: React.FC<WelcomePageOptions>;
export default WelcomePage;
//# sourceMappingURL=WelcomePage.d.ts.map