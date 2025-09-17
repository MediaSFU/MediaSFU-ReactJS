/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * MediaSFU Component Configuration and Usage Guide
 *
 * The following code and comments will guide you through:
 * 1. Configuring the MediaSFU component with different server and credential setups.
 * 2. Handling API credentials securely depending on whether you use MediaSFU Cloud or your own MediaSFU CE server.
 * 3. Rendering custom UIs by disabling the default MediaSFU UI.
 * 4. Using custom "create room" and "join room" functions for secure, flexible integration.
 *
 * Note: All guide instructions are provided as code comments. They will not render to the user directly.
 */

import React, { useState } from 'react';
// MediaSFU view components (if you choose to use them)
import MediasfuGeneric from './components/mediasfuComponents/MediasfuGeneric';
import MediasfuBroadcast from './components/mediasfuComponents/MediasfuBroadcast';
import MediasfuChat from './components/mediasfuComponents/MediasfuChat';
import MediasfuWebinar from './components/mediasfuComponents/MediasfuWebinar';
import MediasfuConference from './components/mediasfuComponents/MediasfuConference';

// Import custom card types for advanced UI customization
import { CustomVideoCardType, CustomAudioCardType, CustomMiniCardType } from './@types/types';

// Pre-Join Page component (if you choose to use it)
import PreJoinPage from './components/miscComponents/PreJoinPage';

// Utilities for seed data (deprecated - do not use in new code)
import { generateRandomParticipants } from './methods/utils/generateRandomParticipants';
import { generateRandomMessages } from './methods/utils/generateRandomMessages';
import { generateRandomRequestList } from './methods/utils/generateRandomRequestList';
import { generateRandomWaitingRoomList } from './methods/utils/generateRandomWaitingRoomList';

// Import custom "create" and "join" room functions
import { createRoomOnMediaSFU } from './methods/utils/createRoomOnMediaSFU';
import { joinRoomOnMediaSFU } from './methods/utils/joinRoomOnMediaSFU';
import { CreateMediaSFURoomOptions, JoinMediaSFURoomOptions } from './@types/types';

/**
 * App Component
 *
 * This component demonstrates how to:
 * - Configure credentials for MediaSFU Cloud and/or Community Edition (CE).
 * - Use MediaSFU with or without a custom server.
 * - Integrate a pre-join page.
 * - Return no UI and manage state through sourceParameters, allowing a fully custom frontend.
 *
 * Basic instructions:
 * 1. Set `localLink` to your CE server if you have one, or leave it blank to use MediaSFU Cloud.
 * 2. Set `connectMediaSFU` to determine whether you're connecting to MediaSFU Cloud services.
 * 3. Provide credentials if using MediaSFU Cloud (dummy credentials are acceptable in certain scenarios).
 * 4. If you prefer a custom UI, set `returnUI` to false and handle all interactions via `sourceParameters` and `updateSourceParameters`.
 * 5. For secure production usage, consider using custom `createMediaSFURoom` and `joinMediaSFURoom` functions to forward requests through your backend.
 */

const App = () => {
  // =========================================================
  //                API CREDENTIALS CONFIGURATION
  // =========================================================
  //
  // Scenario A: Not using MediaSFU Cloud at all.
  // - No credentials needed. Just set localLink to your CE server.
  // Example:
  /*
  const credentials = {};
  const localLink = 'http://your-ce-server.com'; //http://localhost:3000
  const connectMediaSFU = localLink.trim() !== '';
  */

  // Scenario B: Using MediaSFU CE + MediaSFU Cloud for Egress only.
  // - Use dummy credentials (8 chars for userName, 64 chars for apiKey).
  // - Your CE backend will forward requests with your real credentials.
  /*
  const credentials = {
    apiUserName: 'dummyUsr',
    apiKey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  };
  const localLink = 'http://your-ce-server.com'; //http://localhost:3000
  const connectMediaSFU = localLink.trim() !== '';
  */

  // Scenario C: Using MediaSFU Cloud without your own server.
  // - For development, use your actual or dummy credentials.
  // - In production, securely handle credentials server-side and use custom room functions.
  const credentials = {
    apiUserName: 'yourDevUser', // 8 chars recommended for dummy
    apiKey: 'yourDevApiKey1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // 64 chars
  };
  const localLink = ''; // Leave empty if not using your own server
  const connectMediaSFU = true; // Set to true if using MediaSFU Cloud since localLink is empty

  // =========================================================
  //                    UI RENDERING OPTIONS
  // =========================================================
  //
  // If you want a fully custom UI (e.g., a custom layout inspired by WhatsApp):
  // 1. Set `returnUI = false` to prevent the default MediaSFU UI from rendering.
  // 2. Provide `noUIPreJoinOptions` to simulate what would have been entered on a pre-join page.
  // 3. Use `sourceParameters` and `updateSourceParameters` to access and update state/actions.
  // 4. No need for any of the above if you're using the default MediaSFU UI.
  //
  // Example noUIPreJoinOptions:
  const noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions = {
    action: 'create',
    capacity: 10,
    duration: 15,
    eventType: 'broadcast',
    userName: 'Prince',
  };

  // Example for joining a room:
  // const noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions = {
  //   action: 'join',
  //   userName: 'Prince',
  //   meetingID: 'yourMeetingID'
  // };

  const returnUI = true; // Set to false for custom UI, true for default MediaSFU UI

  const [sourceParameters, setSourceParameters] = useState<{ [key: string]: any }>({});
  const updateSourceParameters = (data: { [key: string]: any }) => {
    setSourceParameters(data);
  };

  // =========================================================
  //                CUSTOM ROOM FUNCTIONS (OPTIONAL)
  // =========================================================
  //
  // To securely forward requests to MediaSFU:
  // - Implement custom `createMediaSFURoom` and `joinMediaSFURoom` functions.
  // - These functions send requests to your server, which then communicates with MediaSFU Cloud.
  //
  // Already imported `createRoomOnMediaSFU` and `joinRoomOnMediaSFU` are examples.
  //
  // If using MediaSFU CE backend, ensure your server endpoints:
  // - Validate dummy credentials.
  // - Forward requests to mediasfu.com with real credentials.

  // =========================================================
  //              CUSTOM CARD COMPONENTS (OPTIONAL)
  // =========================================================
  //
  // You can customize how individual video cards, audio cards, and mini cards
  // are displayed by providing custom components. This is perfect for 
  // implementing your own card layouts while keeping MediaSFU's core functionality.

  // Custom Video Card Component
  const CustomVideoCard: CustomVideoCardType = (options) => {
    const {
      participant,
      stream,
      width,
      height,
      doMirror,
      showControls = true,
      showInfo = true,
      name,
      backgroundColor = '#2a2a2a'
    } = options;

    return (
      <div 
        style={{
          backgroundColor,
          borderRadius: '12px',
          border: '2px solid #4CAF50',
          padding: '10px',
          margin: '5px',
          position: 'relative',
          width: width || 200,
          height: height || 150,
        }}
      >
        {/* Video container */}
        <div style={{
          width: '100%',
          height: '80%',
          backgroundColor: '#000',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {stream && (
            <video
              ref={(video) => {
                if (video && stream) {
                  video.srcObject = stream;
                  video.play().catch(() => {});
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: doMirror === 'true' ? 'scaleX(-1)' : 'none'
              }}
              autoPlay
              muted={participant?.muted || false}
              playsInline
            />
          )}
          
          {/* User info overlay */}
          {showInfo && name && (
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {name}
            </div>
          )}
        </div>

        {/* Controls (if needed) */}
        {showControls && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '8px',
            gap: '8px'
          }}>
            <button style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '10px',
              cursor: 'pointer'
            }}>
              Custom Action
            </button>
          </div>
        )}
      </div>
    );
  };

  // Custom Audio Card Component
  const CustomAudioCard: CustomAudioCardType = (options) => {
    const {
      name,
      barColor,
      textColor,
      imageSource,
      roundedImage,
      imageStyle,
    } = options;

    return (
      <div 
        style={{
          backgroundColor: '#1e1e1e',
          borderRadius: '25px',
          border: `2px solid ${barColor ? '#4CAF50' : '#ccc'}`,
          padding: '15px',
          margin: '5px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minHeight: '60px',
        }}
      >
        {/* Avatar or Image */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: roundedImage ? '50%' : '8px',
          backgroundColor: '#4CAF50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          ...imageStyle
        }}>
          {imageSource ? (
            <img 
              src={imageSource} 
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: roundedImage ? '50%' : '8px',
                objectFit: 'cover'
              }}
            />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Info section */}
        <div style={{ flex: 1 }}>
          <div style={{
            color: textColor,
            fontWeight: 'bold',
            fontSize: '14px',
            marginBottom: '4px'
          }}>
            {name}
          </div>
          
          {/* Audio level visualization */}
          <div style={{
            display: 'flex',
            gap: '2px',
            alignItems: 'end',
            height: '20px'
          }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '3px',
                  height: `${Math.random() * 15 + 5}px`,
                  backgroundColor: barColor ? '#4CAF50' : '#ccc',
                  borderRadius: '1px',
                  opacity: 0.7
                }}
              />
            ))}
          </div>
        </div>

        {/* Status indicator */}
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: barColor ? '#4CAF50' : '#ccc',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px'
        }}>
          🎤
        </div>
      </div>
    );
  };

  // Custom Mini Card Component
  const CustomMiniCard: CustomMiniCardType = (options) => {
    const {
      initials,
      fontSize,
      customStyle,
      name,
      showVideoIcon,
      showAudioIcon,
      imageSource,
      roundedImage,
      imageStyle,
    } = options;

    return (
      <div 
        style={{
          width: '50px',
          height: '50px',
          borderRadius: roundedImage ? '50%' : '12px',
          background: customStyle ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#4CAF50',
          border: '2px solid #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: fontSize || '14px',
          margin: '2px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative',
          ...imageStyle
        }}
        title={name}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        }}
      >
        {imageSource ? (
          <img 
            src={imageSource} 
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: roundedImage ? '50%' : '8px',
              objectFit: 'cover'
            }}
          />
        ) : (
          initials
        )}
        
        {/* Video/Audio status icons */}
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          display: 'flex',
          gap: '2px'
        }}>
          {showVideoIcon && (
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              fontSize: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              📹
            </div>
          )}
          {showAudioIcon && (
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#2196F3',
              fontSize: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🎤
            </div>
          )}
        </div>
      </div>
    );
  };

  // =========================================================
  //              CHOOSE A USE CASE / COMPONENT
  // =========================================================
  //
  // Multiple components are available depending on your event type:
  // MediasfuBroadcast, MediasfuChat, MediasfuWebinar, MediasfuConference
  //
  // By default, we'll use MediasfuGeneric with custom settings.



  // =========================================================
  //                    RENDER COMPONENT
  // =========================================================
  //
  // The MediasfuGeneric component is used by default.
  // You can replace it with any other component based on your event type.
  // Example: <MediasfuBroadcast ... />
  // Example: <MediasfuChat ... />
  // Example: <MediasfuWebinar ... />
  // Example: <MediasfuConference ... />
  //
  // The PreJoinPage component is displayed if `returnUI` is true.
  // If `returnUI` is false, `noUIPreJoinOptions` is used as a substitute.
  // You can also use `sourceParameters` to interact with MediaSFU functionalities directly.
  // Avoid using `useLocalUIMode` or `useSeed` in new implementations.
  // Ensure that real credentials are not exposed in the frontend.
  // Use HTTPS and secure backend endpoints for production.

  // Example of MediaSFU CE with no MediaSFU Cloud
  // return (
  //   <MediasfuGeneric
  //     PrejoinPage={PreJoinPage}
  //     localLink={localLink}
  //     />
  // );

  // Example of MediaSFU CE + MediaSFU Cloud for Egress only
  // return (
  //   <MediasfuGeneric
  //     PrejoinPage={PreJoinPage}
  //     credentials={credentials}
  //     localLink={localLink}
  //     connectMediaSFU={connectMediaSFU}
  //     />
  // );

  // Example of MediaSFU Cloud only
  // return (
  //   <MediasfuGeneric
  //     PrejoinPage={PreJoinPage}
  //     credentials={credentials}
  //     connectMediaSFU={connectMediaSFU}
  //     />
  // );

  // Example of MediaSFU CE + MediaSFU Cloud for Egress only with custom UI
  // return (
  //   <MediasfuGeneric
  //     PrejoinPage={PreJoinPage}
  //     credentials={credentials}
  //     localLink={localLink}
  //     connectMediaSFU={connectMediaSFU}
  //     returnUI={false}
  //     noUIPreJoinOptions={noUIPreJoinOptions}
  //     sourceParameters={sourceParameters}
  //     updateSourceParameters={updateSourceParameters}
  //     createMediaSFURoom={createRoomOnMediaSFU}
  //     joinMediaSFURoom={joinRoomOnMediaSFU}
  //   />

  // Example of MediaSFU Cloud only with custom UI
  // return (
  //   <MediasfuGeneric
  //     PrejoinPage={PreJoinPage}
  //     credentials={credentials}
  //     connectMediaSFU={connectMediaSFU}
  //     returnUI={false}
  //     noUIPreJoinOptions={noUIPreJoinOptions}
  //     sourceParameters={sourceParameters}
  //     updateSourceParameters={updateSourceParameters}
  //     createMediaSFURoom={createRoomOnMediaSFU}
  //     joinMediaSFURoom={joinRoomOnMediaSFU}
  //   />

  // Example of using MediaSFU CE only with custom UI
  // return (
  //   <MediasfuGeneric
  //     PrejoinPage={PreJoinPage}
  //     localLink={localLink}
  //     connectMediaSFU={false}
  //     returnUI={false}
  //     noUIPreJoinOptions={noUIPreJoinOptions}
  //     sourceParameters={sourceParameters}
  //     updateSourceParameters={updateSourceParameters}
  //   />


  return (
    <MediasfuGeneric
      // This pre-join page can be displayed if `returnUI` is true.
      // If `returnUI` is false, `noUIPreJoinOptions` is used as a substitute.
      PrejoinPage={(options) => <PreJoinPage {...options} />}
      credentials={credentials}
      localLink={localLink}
      connectMediaSFU={connectMediaSFU}
      returnUI={returnUI}
      noUIPreJoinOptions={!returnUI ? noUIPreJoinOptions : undefined}
      sourceParameters={!returnUI ? sourceParameters : undefined}
      updateSourceParameters={!returnUI ? updateSourceParameters : undefined}
      createMediaSFURoom={createRoomOnMediaSFU} // no need to specify if not using custom functions
      joinMediaSFURoom={joinRoomOnMediaSFU} // no need to specify if not using custom functions
      
      // Custom card components - uncomment to use
      customVideoCard={CustomVideoCard}
      customAudioCard={CustomAudioCard}
      customMiniCard={CustomMiniCard}
    />
  );
};

export default App;

/**
 * =========================================================
 *                     ADDITIONAL NOTES
 * =========================================================
 *
 * Handling Core Methods:
 * Once `sourceParameters` is populated, you can call core methods like `clickVideo` or `clickAudio` directly:
 * Example:
 * sourceParameters.clickVideo({ ...sourceParameters });
 * sourceParameters.clickAudio({ ...sourceParameters });
 *
 * This allows your custom UI to directly interact with MediaSFU functionalities.
 *
 * Deprecated Features (Seed Data):
 * The seed data generation feature is deprecated. Avoid using `useLocalUIMode` or `useSeed` in new implementations.
 *
 * Security Considerations:
 * - Do not expose real credentials in your frontend code in production.
 * - Use HTTPS and secure backend endpoints.
 * - Validate inputs and handle errors gracefully.
 *
 * Example CE Backend Setup:
 * If using MediaSFU CE + MediaSFU Cloud, your backend might look like this:
 *
 * app.post("/createRoom", async (req, res) => {
 *   // Validate incoming dummy credentials
 *   // Forward request to mediasfu.com with real credentials
 * });
 *
 * app.post("/joinRoom", async (req, res) => {
 *   // Validate incoming dummy credentials
 *   // Forward request to mediasfu.com with real credentials
 * });
 *
 * By doing so, you keep real credentials secure on your server.
 *
 * End of Guide.
 */



/**
 * =======================
 * ====== EXTRA NOTES ======
 * =======================
 *
 * ### Handling Core Methods
 * With `sourceParameters`, you can access core methods such as `clickVideo` and `clickAudio`:
 *
 * ```typescript
 * sourceParameters.clickVideo({ ...sourceParameters });
 * sourceParameters.clickAudio({ ...sourceParameters });
 * ```
 *
 * This allows your custom UI to interact with MediaSFU's functionalities seamlessly.
 *
 * ### Seed Data (Deprecated)
 * The seed data functionality is deprecated and maintained only for legacy purposes.
 * It is recommended to avoid using it in new implementations.
 *
 * ### Security Considerations
 * - **Protect API Credentials:** Ensure that API credentials are not exposed in the frontend. Use environment variables and secure backend services to handle sensitive information.
 * - **Use HTTPS:** Always use HTTPS to secure data transmission between the client and server.
 * - **Validate Inputs:** Implement proper validation and error handling on both client and server sides to prevent malicious inputs.
 *
 * ### Custom Backend Example for MediaSFU CE
 * Below is an example of how to set up custom backend endpoints for creating and joining rooms using MediaSFU CE:
 *
 * ```javascript
 * // Endpoint for `createRoom`
 * app.post("/createRoom", async (req, res) => {
 *   try {
 *     const payload = req.body;
 *     const [apiUserName, apiKey] = req.headers.authorization
 *       .replace("Bearer ", "")
 *       .split(":");
 *
 *     // Verify temporary credentials
 *     if (!apiUserName || !apiKey || !verifyCredentials(apiUserName, apiKey)) {
 *       return res.status(401).json({ error: "Invalid or expired credentials" });
 *     }
 *
 *     const response = await fetch("https://mediasfu.com/v1/rooms/", {
 *       method: "POST",
 *       headers: {
 *         "Content-Type": "application/json",
 *         Authorization: `Bearer ${actualApiUserName}:${actualApiKey}`,
 *       },
 *       body: JSON.stringify(payload),
 *     });
 *
 *     const result = await response.json();
 *     res.status(response.status).json(result);
 *   } catch (error) {
 *     console.error("Error creating room:", error);
 *     res.status(500).json({ error: "Internal server error" });
 *   }
 * });
 *
 * // Endpoint for `joinRoom`
 * app.post("/joinRoom", async (req, res) => {
 *   try {
 *     const payload = req.body;
 *     const [apiUserName, apiKey] = req.headers.authorization
 *       .replace("Bearer ", "")
 *       .split(":");
 *
 *     // Verify temporary credentials
 *     if (!apiUserName || !apiKey || !verifyCredentials(apiUserName, apiKey)) {
 *       return res.status(401).json({ error: "Invalid or expired credentials" });
 *     }
 *
 *     const response = await fetch("https://mediasfu.com/v1/rooms", {
 *       method: "POST",
 *       headers: {
 *         "Content-Type": "application/json",
 *         Authorization: `Bearer ${actualApiUserName}:${actualApiKey}`,
 *       },
 *       body: JSON.stringify(payload),
 *     });
 *
 *     const result = await response.json();
 *     res.status(response.status).json(result);
 *   } catch (error) {
 *     console.error("Error joining room:", error);
 *     res.status(500).json({ error: "Internal server error" });
 *   }
 * });
 * ```
 *
 * ### Custom Room Function Implementation
 * Below are examples of how to implement custom functions for creating and joining rooms securely:
 *
 * ```typescript
 * import { CreateJoinRoomError, CreateJoinRoomResponse, CreateJoinRoomType, CreateMediaSFURoomOptions, JoinMediaSFURoomOptions } from '../../@types/types';
 *
 *
 * Async function to create a room on MediaSFU.
 *
 * @param {object} options - The options for creating a room.
 * @param {CreateMediaSFURoomOptions} options.payload - The payload for the API request.
 * @param {string} options.apiUserName - The API username.
 * @param {string} options.apiKey - The API key.
 * @param {string} options.localLink - The local link.
 * @returns {Promise<{ data: CreateJoinRoomResponse | CreateJoinRoomError | null; success: boolean; }>} The response from the API.
 * export const createRoomOnMediaSFU: CreateJoinRoomType = async ({
 *     payload,
 *     apiUserName,
 *     apiKey,
 *     localLink = '',
 * }) => {
 *     try {
 *         let finalLink = 'https://mediasfu.com/v1/rooms/';
 *
 *         // Update finalLink if using a local server
 *         if (localLink) {
 *             finalLink = `${localLink}/createRoom`;
 *         }
 *
 *         const response = await fetch(finalLink, {
 *             method: 'POST',
 *             headers: {
 *                 'Content-Type': 'application/json',
 *                 Authorization: `Bearer ${apiUserName}:${apiKey}`,
 *             },
 *             body: JSON.stringify(payload),
 *         });
 *
 *         if (!response.ok) {
 *             throw new Error(`HTTP error! Status: ${response.status}`);
 *         }
 *
 *         const data: CreateJoinRoomResponse = await response.json();
 *         return { data, success: true };
 *     } catch (error) {
 *         const errorMessage = (error as Error).message || 'unknown error';
 *         return {
 *             data: { error: `Unable to create room, ${errorMessage}` },
 *             success: false,
 *         };
 *     }
 * };
 *
*
*  Async function to join a room on MediaSFU.
*
*  @param {object} options - The options for joining a room.
*  @param {JoinMediaSFURoomOptions} options.payload - The payload for the API request.
*  @param {string} options.apiUserName - The API username.
*  @param {string} options.apiKey - The API key.
*  @param {string} options.localLink - The local link.
*  @returns {Promise<{ data: CreateJoinRoomResponse | CreateJoinRoomError | null; success: boolean; }>} The response from the API.
*
* export const joinRoomOnMediaSFU: JoinRoomOnMediaSFUType = async ({
*     payload,
*     apiUserName,
*     apiKey,
*     localLink = '',
* }) => {
*     try {
*         let finalLink = 'https://mediasfu.com/v1/rooms/join';
*
*         // Update finalLink if using a local server
*         if (localLink) {
*             finalLink = `${localLink}/joinRoom`;
*         }
*
*         const response = await fetch(finalLink, {
*             method: 'POST',
*             headers: {
*                 'Content-Type': 'application/json',
*                 Authorization: `Bearer ${apiUserName}:${apiKey}`,
*             },
*             body: JSON.stringify(payload),
*         });
*
*         if (!response.ok) {
*             throw new Error(`HTTP error! Status: ${response.status}`);
*         }
*
*         const data: CreateJoinRoomResponse = await response.json();
*         return { data, success: true };
*     } catch (error) {
*         const errorMessage = (error as Error).message || 'unknown error';
*         return {
*             data: { error: `Unable to join room, ${errorMessage}` },
*             success: false,
*         };
*     }
* };
* ```
*
* ### Example Usage of Core Methods
* Core methods like `clickVideo` and `clickAudio` can now be accessed through `sourceParameters`:
*
* ```typescript
* // Example of toggling video
* sourceParameters.clickVideo({ ...sourceParameters });
*
* // Example of toggling audio
* sourceParameters.clickAudio({ ...sourceParameters });
* ```
*
* These methods allow your custom UI to interact with MediaSFU's functionalities seamlessly.
*
* ### Custom Card Components
* You can customize how individual video cards, audio cards, and mini cards are displayed:
*
* ```typescript
* // Custom Video Card - displays video streams with custom styling
* const CustomVideoCard: CustomVideoCardType = (options) => {
*   const { participant, stream, width, height, name, showControls } = options;
*   return <div>Your custom video card layout</div>;
* };
*
* // Custom Audio Card - displays audio participants with custom styling
* const CustomAudioCard: CustomAudioCardType = (options) => {
*   const { name, barColor, textColor, imageSource } = options;
*   return <div>Your custom audio card layout</div>;
* };
*
* // Custom Mini Card - displays small participant cards
* const CustomMiniCard: CustomMiniCardType = (options) => {
*   const { initials, name, showVideoIcon, showAudioIcon } = options;
*   return <div>Your custom mini card layout</div>;
* };
*
* // Use in MediasfuGeneric component
* <MediasfuGeneric
*   customVideoCard={CustomVideoCard}
*   customAudioCard={CustomAudioCard}
*   customMiniCard={CustomMiniCard}
*   // ... other props
* />
* ```
*
* ### Complete UI Replacement
* For complete UI replacement, set returnUI to false and use sourceParameters:
*
* ```
* const [sourceParameters, setSourceParameters] = useState({});
* const updateSourceParameters = (data) => setSourceParameters(data);
*
* return (
*   <div>
*     <MediasfuGeneric
*       returnUI={false}
*       noUIPreJoinOptions={noUIPreJoinOptions}
*       sourceParameters={sourceParameters}
*       updateSourceParameters={updateSourceParameters}
*     />
*     // Your custom UI here
*     <button onClick={() => sourceParameters.clickVideo?.(sourceParameters)}>
*       Toggle Video
*     </button>
*   </div>
* );
* ```
*
* ### Container Styling
* Customize the main container appearance:
*
* ```
* <MediasfuGeneric
*   containerStyle={{
*     backgroundColor: '#1a1a1a',
*     borderRadius: '10px',
*     border: '2px solid #333'
*   }}
* />
* ```
*
* ========================
* ====== END OF GUIDE ======
* ========================
*/






