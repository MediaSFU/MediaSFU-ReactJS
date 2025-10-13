import React from "react";
import './MediasfuCSS.css';
import { WelcomePageOptions } from "../miscComponents/WelcomePage";
import { SeedData, PreJoinPageOptions, CreateMediaSFURoomOptions, JoinMediaSFURoomOptions, JoinRoomOnMediaSFUType, CreateRoomOnMediaSFUType } from "../../@types/types";
import { CustomVideoCardType, CustomAudioCardType, CustomMiniCardType, CustomPreJoinPageType, CustomComponentType, MediasfuUICustomOverrides } from "../../@types/types";
export type MediasfuGenericOptions = {
    PrejoinPage?: (options: PreJoinPageOptions | WelcomePageOptions) => React.ReactNode;
    localLink?: string;
    connectMediaSFU?: boolean;
    credentials?: {
        apiUserName: string;
        apiKey: string;
    };
    useLocalUIMode?: boolean;
    seedData?: SeedData;
    useSeed?: boolean;
    imgSrc?: string;
    sourceParameters?: {
        [key: string]: any;
    };
    updateSourceParameters?: (data: {
        [key: string]: any;
    }) => void;
    returnUI?: boolean;
    noUIPreJoinOptions?: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
    joinMediaSFURoom?: JoinRoomOnMediaSFUType;
    createMediaSFURoom?: CreateRoomOnMediaSFUType;
    customVideoCard?: CustomVideoCardType;
    customAudioCard?: CustomAudioCardType;
    customMiniCard?: CustomMiniCardType;
    customPreJoinPage?: CustomPreJoinPageType;
    customComponent?: CustomComponentType;
    containerStyle?: React.CSSProperties;
    uiOverrides?: MediasfuUICustomOverrides;
};
/**
 * MediasfuGeneric component provides and combines the generic functionalities for MediaSFU.
 * It supports webinar, broadcast, chat, conference views with full UI override capabilities.
 * Participants can share media (audio, video, screen share) with each other, engage in polls,
 * breakout rooms, chat, and more—all while maintaining the ability to customize every UI surface
 * through component overrides, function wrapping, and custom participant cards.
 *
 * @typedef {Object} MediasfuGenericOptions
 * @property {function} [PrejoinPage=WelcomePage] - Custom pre-join page renderer. Receives unified pre-join options for adding branding or extra forms.
 * @property {string} [localLink=""] - Local MediaSFU server URL (Community Edition). Leave empty for MediaSFU Cloud.
 * @property {boolean} [connectMediaSFU=true] - Toggle automatic socket/WebRTC connections. Set false for UI-only mode.
 * @property {Object} [credentials={ apiUserName: "", apiKey: "" }] - MediaSFU Cloud API credentials. Not required for self-hosting.
 * @property {boolean} [useLocalUIMode=false] - Run interface in local/demo mode with no remote signaling.
 * @property {SeedData} [seedData={}] - Pre-populate UI state for demos, tests, or onboarding.
 * @property {boolean} [useSeed=false] - Enable seed data injection.
 * @property {string} [imgSrc="https://mediasfu.com/images/logo192.png"] - Default artwork for pre-join and modals.
 * @property {Object} [sourceParameters={}] - Shared helper bag (devices, participants, layout handlers). Pair with updateSourceParameters.
 * @property {function} [updateSourceParameters] - Callback receiving latest helper bundle for bridging MediaSFU logic into custom components.
 * @property {boolean} [returnUI=true] - When false, mounts logic only (headless mode).
 * @property {CreateMediaSFURoomOptions | JoinMediaSFURoomOptions} [noUIPreJoinOptions] - Pre-join data for headless mode (bypass wizard).
 * @property {JoinRoomOnMediaSFUType} [joinMediaSFURoom] - Custom room-join function (replace default networking).
 * @property {CreateRoomOnMediaSFUType} [createMediaSFURoom] - Custom room-create function (replace default networking).
 * @property {CustomVideoCardType} [customVideoCard] - Override participant video card renders. Add badges, CTAs, or metadata.
 * @property {CustomAudioCardType} [customAudioCard] - Override participant audio-only card renders.
 * @property {CustomMiniCardType} [customMiniCard] - Override participant mini-card thumbnails (PiP modes).
 * @property {CustomPreJoinPageType} [customPreJoinPage] - Full replacement for the interactive pre-join wizard.
 * @property {CustomComponentType} [customComponent] - Replace entire UI while retaining transports, sockets, and helpers.
 * @property {React.CSSProperties} [containerStyle] - Inline styles for root wrapper (dashboards, split views).
 * @property {MediasfuUICustomOverrides} [uiOverrides] - Targeted component/function overrides (layout, modals, helper wraps). See full map in docs.
 *
 * MediasfuGeneric component.
 *
 * @component
 * @param {MediasfuGenericOptions} props - Component properties.
 * @returns {React.FC<MediasfuGenericOptions>} - React functional component.
 *
 * @example
 * // Basic usage with MediaSFU Cloud
 * ```tsx
 * <MediasfuGeneric
 *   credentials={{ apiUserName: "user", apiKey: "key" }}
 * />
 * ```
 *
 * @example
 * // Custom cards and UI overrides
 * ```tsx
 * const videoCard: CustomVideoCardType = (props) => (
 *   <VideoCard {...props} customStyle={{ borderRadius: 20, border: "3px solid purple" }} />
 * );
 *
 * const uiOverrides = useMemo<MediasfuUICustomOverrides>(() => ({
 *   mainContainer: {
 *     render: (props) => <div style={{ border: "4px dashed purple" }}><MainContainerComponent {...props} /></div>,
 *   },
 *   consumerResume: {
 *     wrap: (original) => async (params) => {
 *       analytics.track("consumer_resume");
 *       return await original(params);
 *     },
 *   },
 * }), []);
 *
 * <MediasfuGeneric
 *   credentials={{ apiUserName: "user", apiKey: "key" }}
 *   customVideoCard={videoCard}
 *   uiOverrides={uiOverrides}
 *   containerStyle={{ background: "#0f172a", borderRadius: 32 }}
 * />
 * ```
 *
 * @example
 * // Headless mode with custom component
 * ```tsx
 * const CustomWorkspace: CustomComponentType = ({ parameters }) => (
 *   <div>
 *     <h1>Room: {parameters.roomName}</h1>
 *     <button onClick={() => parameters.showAlert?.({ message: "Hello!", type: "success" })}>
 *       Trigger Alert
 *     </button>
 *   </div>
 * );
 *
 * <MediasfuGeneric
 *   PrejoinPage={CustomPrejoinPage}
 *   localLink="https://localhost:3000"
 *   connectMediaSFU={true}
 *   credentials={{ apiUserName: "user", apiKey: "key" }}
 *   useLocalUIMode={true}
 *   seedData={customSeedData}
 *   useSeed={true}
 *   imgSrc="https://example.com/logo.png"
 *   sourceParameters={{ key: value }}
 *   updateSourceParameters={updateSourceParameters}
 *   returnUI={true}
 *   noUIPreJoinOptions={customPreJoinOptions}
 *   joinMediaSFURoom={joinRoomOnMediaSFU}
 *   createMediaSFURoom={createRoomOnMediaSFU}
 * />
 * ```
 *
 * @description
 * This component handles the generic functionalities for MediaSFU, including joining rooms,
 * managing participants, and handling media streams. It uses various hooks and methods to
 * manage state and perform actions such as joining a room, updating initial values, and
 * handling media streams.
 *
 */
declare const MediasfuGeneric: React.FC<MediasfuGenericOptions>;
export default MediasfuGeneric;
//# sourceMappingURL=MediasfuGeneric.d.ts.map