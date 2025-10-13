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
declare const App: () => import("react/jsx-runtime").JSX.Element;
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
//# sourceMappingURL=AppGeneric.d.ts.map