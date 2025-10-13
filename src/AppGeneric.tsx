/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
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
import {
  CustomVideoCardType,
  CustomAudioCardType,
  CustomMiniCardType,
  CreateMediaSFURoomOptions,
  JoinMediaSFURoomOptions,
} from './@types/types';
import VideoCard from './components/displayComponents/VideoCard';
import AudioCard from './components/displayComponents/AudioCard';
import MiniCard from './components/displayComponents/MiniCard';

// Pre-Join Page component (if you choose to use it)
import PreJoinPage from './components/miscComponents/PreJoinPage';

// Utilities for seed data (deprecated - do not use in new code)
import { generateRandomParticipants } from './methods/utils/generateRandomParticipants';
import { generateRandomMessages } from './methods/utils/generateRandomMessages';
import { generateRandomRequestList } from './methods/utils/generateRandomRequestList';
import { generateRandomWaitingRoomList } from './methods/utils/generateRandomWaitingRoomList';
import { createRoomOnMediaSFU } from './methods/utils/createRoomOnMediaSFU';
import { joinRoomOnMediaSFU } from './methods/utils/joinRoomOnMediaSFU';

const App = () => {
  // =========================================================
  //              CONNECTION & CREDENTIAL SETUP
  // =========================================================
  // Adjust the following values based on the scenario you're prototyping.

  // Scenario A: Using MediaSFU CE only (no MediaSFU Cloud)
  // const credentials = {} as const;
  // const localLink = 'http://localhost:3000';
  // const connectMediaSFU = false;

  // Scenario B: Using MediaSFU CE + MediaSFU Cloud for egress only
  // const credentials = {
  //   apiUserName: 'dummyUsr',
  //   apiKey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  // } as const;
  // const localLink = 'http://your-ce-server.com';
  // const connectMediaSFU = localLink.trim() !== '';

  // Scenario C: Using MediaSFU Cloud without your own server (default)
  const credentials = {
    apiUserName: 'yourDevUser',
    apiKey: 'yourDevApiKey1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  } as const;
  const localLink = '';
  const connectMediaSFU = true;

  // =========================================================
  //                    UI RENDERING OPTIONS
  // =========================================================
  const returnUI = true;
  const noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions = {
    action: 'create',
    capacity: 10,
    duration: 30,
    eventType: 'conference',
    userName: 'naim',
  };

  const [sourceParameters, setSourceParameters] = useState<Record<string, unknown>>({});
  const updateSourceParameters = (data: Record<string, unknown>) => {
    setSourceParameters(data);
  };

  // =========================================================
  //              DEPRECATED SEED DATA EXAMPLE (OPTIONAL)
  // =========================================================
  const eventType: 'conference' | 'webinar' | 'chat' = 'conference';
  const useSeed = false;
  let seedData: Record<string, unknown> | undefined;

  if (useSeed) {
    const memberName = 'Guest';
    const hostName = 'Host';

    const participants_ = generateRandomParticipants({
      member: memberName,
      coHost: '',
      host: hostName,
      forChatBroadcast: false,
    });

    const messages_ = generateRandomMessages({
      participants: participants_,
      member: memberName,
      host: hostName,
      forChatBroadcast: false,
    });

    const requests_ = generateRandomRequestList({
      participants: participants_,
      hostName,
      coHostName: '',
      numberOfRequests: 3,
    });

    const waitingList_ = generateRandomWaitingRoomList();

    seedData = {
      participants: participants_,
      messages: messages_,
      requests: requests_,
      waitingList: waitingList_,
      eventType,
    };
  }
  // Custom Video Card Component
  const CustomVideoCard: CustomVideoCardType = ({
    customStyle,
    containerProps,
    infoOverlayProps,
    controlsOverlayProps,
    backgroundColor,
    name,
    participant,
    videoStream,
    ...rest
  }) => (
    <VideoCard
      {...rest}
      participant={participant}
      name={name}
      videoStream={videoStream}
      backgroundColor={backgroundColor}
      customStyle={{
        borderRadius: 18,
        border: '3px solid #22c55e',
        overflow: 'hidden',
        backgroundColor: backgroundColor ?? '#0f172a',
        position: 'relative',
        ...customStyle,
      }}
      containerProps={{
        ...(containerProps ?? {}),
        style: {
          boxShadow: '0 18px 42px rgba(6, 95, 70, 0.35)',
          ...(containerProps?.style ?? {}),
        },
      }}
      infoOverlayProps={{
        ...(infoOverlayProps ?? {}),
        style: {
          backgroundColor: 'rgba(34, 197, 94, 0.85)',
          borderRadius: 999,
          padding: '4px 12px',
          color: '#052e16',
          letterSpacing: 0.3,
          ...(infoOverlayProps?.style ?? {}),
        },
      }}
      controlsOverlayProps={{
        ...(controlsOverlayProps ?? {}),
        style: {
          backgroundColor: 'rgba(4, 47, 46, 0.5)',
          borderRadius: 10,
          ...(controlsOverlayProps?.style ?? {}),
        },
      }}
    />
  );

  // Custom Audio Card Component
  const CustomAudioCard: CustomAudioCardType = ({
    customStyle,
    cardProps,
    nameContainerProps,
    nameTextProps,
    barColor,
    ...rest
  }) => {
    const accent = barColor ?? '#22c55e';

    return (
      <AudioCard
        {...rest}
        barColor={accent}
        customStyle={{
          borderRadius: 24,
          border: `2px solid ${accent}`,
          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
          ...customStyle,
        }}
        cardProps={{
          ...(cardProps ?? {}),
          style: {
            boxShadow: '0 12px 28px rgba(22, 163, 74, 0.25)',
            ...(cardProps?.style ?? {}),
          },
        }}
        nameContainerProps={{
          ...(nameContainerProps ?? {}),
          style: {
            fontWeight: 600,
            ...(nameContainerProps?.style ?? {}),
          },
        }}
        nameTextProps={{
          ...(nameTextProps ?? {}),
          style: {
            fontSize: 16,
            ...(nameTextProps?.style ?? {}),
          },
        }}
      />
    );
  };

  // Custom Mini Card Component
  const CustomMiniCard: CustomMiniCardType = ({ customStyle, initials, fontSize, ...rest }) => {
    const displayName = typeof initials === 'string' ? initials : '';

    return (
      <MiniCard
        {...rest}
        initials={initials}
        fontSize={fontSize ?? 16}
        customStyle={{
          borderRadius: 14,
          border: '2px dashed #f59e0b',
          background: '#fff7ed',
          color: '#b45309',
          padding: 10,
          textAlign: 'center',
          ...customStyle,
        }}
        renderContainer={({ defaultContainer }) => (
          <div
            style={{
              display: 'grid',
              gap: 6,
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            {defaultContainer}
            {displayName && (
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
                {displayName}
              </span>
            )}
          </div>
        )}
      />
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






