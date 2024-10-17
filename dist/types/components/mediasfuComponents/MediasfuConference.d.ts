/**
 * MediasfuConference component options type definition.
 *
 * @typedef {Object} MediasfuConferenceOptions
 * @property {(options: PreJoinPageOptions | WelcomePageOptions) => React.ReactNode} [PrejoinPage] - Component to render for the pre-join page.
 * @property {{ apiUserName: string; apiKey: string }} [credentials] - API credentials for the user.
 * @property {boolean} [useLocalUIMode] - Flag to determine if local UI mode should be used.
 * @property {SeedData} [seedData] - Seed data for initializing the conference.
 * @property {boolean} [useSeed] - Flag to determine if seed data should be used.
 * @property {string} [imgSrc] - Source URL for the image.
 */
/**
 * MediasfuConference component.
 *
 * @component
 * @param {MediasfuConferenceOptions} props - Component properties.
 * @returns {React.FC<MediasfuConferenceOptions>} The MediasfuConference component.
 *
 * @example
 * <MediasfuConference
 *   PrejoinPage={CustomPrejoinPage}
 *   credentials={{ apiUserName: "user", apiKey: "key" }}
 *   useLocalUIMode={true}
 *   seedData={seedData}
 *   useSeed={true}
 *   imgSrc="https://example.com/logo.png"
 * />
 *
 * @description
 * This component handles the main logic for joining a media conference room using WebRTC and Mediasoup.
 * It manages the state and references for various parameters required for the conference, including
 * user credentials, room details, media settings, and recording options.
 *
 * The component also provides methods for updating state to initial values, joining a room using a socket,
 * and handling various media and room-related functionalities.
 */
import React from "react";
import { WelcomePageOptions } from "../miscComponents/WelcomePage";
import { SeedData, PreJoinPageOptions } from "../../@types/types";
export type MediasfuConferenceOptions = {
    PrejoinPage?: (options: PreJoinPageOptions | WelcomePageOptions) => React.ReactNode;
    credentials?: {
        apiUserName: string;
        apiKey: string;
    };
    useLocalUIMode?: boolean;
    seedData?: SeedData;
    useSeed?: boolean;
    imgSrc?: string;
};
declare const MediasfuConference: React.FC<MediasfuConferenceOptions>;
export default MediasfuConference;
//# sourceMappingURL=MediasfuConference.d.ts.map