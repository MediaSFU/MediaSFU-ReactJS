import React from "react";
import './MediasfuCSS.css';
import { WelcomePageOptions } from "../miscComponents/WelcomePage";
import { SeedData, PreJoinPageOptions, CreateMediaSFURoomOptions, JoinMediaSFURoomOptions, JoinRoomOnMediaSFUType, CreateRoomOnMediaSFUType } from "../../@types/types";
export type MediasfuConferenceOptions = {
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
};
/**
 * MediasfuConference component optimizes the media experience for conferences.
 * Participants can share media (audio, video, screen share) with each other.
 * Participants can chat with each other and engage in polls and breakout rooms, share screens, and more during the conference.
 *
 * @typedef {Object} MediasfuConferenceOptions
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
 *
 * MediasfuConferenceOptions component.
 *
 * @component
 * @param {MediasfuConferenceOptions} props - Component properties.
 * @returns {React.FC<MediasfuConferenceOptions>} The MediasfuConference component.
 *
 * @example
 * ```tsx
 * <MediasfuConference
 *   PrejoinPage={CustomPrejoinPage}
 *   localLink="https://localhost:3000"
 *   connectMediaSFU={true}
 *   credentials={{ apiUserName: "user", apiKey: "key" }}
 *   useLocalUIMode={true}
 *   seedData={seedData}
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
 * This component handles the main logic for joining a media conference room using WebRTC and Mediasoup.
 * It manages the state and references for various parameters required for the conference, including
 * user credentials, room details, media settings, and recording options.
 *
 * The component also provides methods for updating state to initial values, joining a room using a socket,
 * and handling various media and room-related functionalities.
 */
declare const MediasfuConference: React.FC<MediasfuConferenceOptions>;
export default MediasfuConference;
//# sourceMappingURL=MediasfuConference.d.ts.map