import React from "react";
import './MediasfuCSS.css';
import { WelcomePageOptions } from "../miscComponents/WelcomePage";
import { PreJoinPageOptions, SeedData, CreateMediaSFURoomOptions, JoinMediaSFURoomOptions, JoinRoomOnMediaSFUType, CreateRoomOnMediaSFUType, CustomComponentType, CustomVideoCardType, CustomAudioCardType, CustomMiniCardType, MediasfuUICustomOverrides } from "../../@types/types";
export type MediasfuChatOptions = {
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
    customComponent?: CustomComponentType;
    customVideoCard?: CustomVideoCardType;
    customAudioCard?: CustomAudioCardType;
    customMiniCard?: CustomMiniCardType;
    containerStyle?: React.CSSProperties;
    uiOverrides?: MediasfuUICustomOverrides;
};
/**
 * MediasfuChat component optimizes the media experience for chatting events.
 * Only 2 participants can share media (audio, video, *no screen share support*) with each other.
 * Participants can view each other's media and chat with each other.
 * It manages various states and references related to the media session, including
 * user credentials, room details, participants, and recording parameters.
 *
 * @typedef {Object} MediasfuChatOptions
 * @property {function} [PrejoinPage=WelcomePage] - Function to render the prejoin page.
 * @property {string} [localLink=""] - Local link for the media server (if using Community Edition).
 * @property {boolean} [connectMediaSFU=true] - Flag to connect to the MediaSFU server (if using Community Edition and still need to connect to the server)
 * @property {Object} [credentials={ apiUserName: "", apiKey: "" }] - API credentials.
 * @property {boolean} [useLocalUIMode=false] - Flag to use local UI mode.
 * @property {SeedData} [seedData={}] - Seed data for initial state.
 * @property {boolean} [useSeed=false] - Flag to use seed data.
 * @property {string} [imgSrc="https://mediasfu.com/images/logo192.png"] - Image source URL.
 * @property {Object} [sourceParameters={}] - Source parameters.
 * @property {function} [updateSourceParameters] - Function to update source parameters.
 * @property {boolean} [returnUI=true] - Flag to return the UI.
 * @property {CreateMediaSFURoomOptions | JoinMediaSFURoomOptions} [noUIPreJoinOptions] - Options for the prejoin page.
 * @property {JoinRoomOnMediaSFUType} [joinMediaSFURoom] - Function to join a room on MediaSFU.
 * @property {CreateRoomOnMediaSFUType} [createMediaSFURoom] - Function to create a room on MediaSFU.
 * @property {CustomComponentType} [customComponent] - Custom component to replace the entire MediaSFU UI.
 * @property {VideoCardType} [VideoCard] - Custom video card component for rendering video streams.
 * @property {AudioCardType} [AudioCard] - Custom audio card component for rendering audio streams.
 * @property {MiniCardType} [MiniCard] - Custom mini card component for rendering minimized streams.
 *
 * MediasfuGeneric component.
 *
 * @component
 * @param {MediasfuChatOptions} props - Component properties.
 * @returns {React.FC<MediasfuChatOptions>} - React functional component.
 *
 * @example
 * ```tsx
 * <MediasfuChat
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
declare const MediasfuChat: React.FC<MediasfuChatOptions>;
export default MediasfuChat;
//# sourceMappingURL=MediasfuChat.d.ts.map