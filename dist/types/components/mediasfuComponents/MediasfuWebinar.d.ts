import React from "react";
import { WelcomePageOptions } from "../miscComponents/WelcomePage";
import { SeedData, PreJoinPageOptions } from "../../@types/types";
export type MediasfuWebinarOptions = {
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
};
/**
 * MediasfuWebinar component optimized for webinars.
 * Main focus is placed on the host with large screen area dedicated to the host.
 * Participants can share media (audio, video, screen share) with each other.
 * Participants can chat with each other and engage in polls and breakout rooms, share screens, and more during the conference.
 *
 * @typedef {Object} MediasfuWebinarOptions
 * @property {function} [PrejoinPage=WelcomePage] - Function to render the prejoin page.
 * @property {string} [localLink=""] - Local link for the media server (if using Community Edition).
 * @property {boolean} [connectMediaSFU=true] - Flag to connect to the MediaSFU server (if using Community Edition and still need to connect to the server)
 * @property {Object} [credentials={ apiUserName: "", apiKey: "" }] - API credentials.
 * @property {boolean} [useLocalUIMode=false] - Flag to use local UI mode.
 * @property {SeedData} [seedData={}] - Seed data for initial state.
 * @property {boolean} [useSeed=false] - Flag to use seed data.
 * @property {string} [imgSrc="https://mediasfu.com/images/logo192.png"] - Image source URL.
 *
 * MediasfuWebinar component.
 *
 * @component
 * @param {MediasfuWebinarOptions} props - Component properties.
 * @returns {React.FC<MediasfuWebinarOptions>} The MediasfuWebinar component.
 *
 * @example
 * ```tsx
 * const PrejoinPage = WelcomePage;
 * const credentials = { apiUserName: '', apiKey: '' };
 * const useLocalUIMode = false;
 * const seedData = {};
 * const useSeed = false;
 * const imgSrc = 'https://mediasfu.com/images/logo192.png';
 *
 * <MediasfuWebinar
 *  PrejoinPage={PrejoinPage}
 *  localLink="https://localhost:3000"
 *  connectMediaSFU={true}
 * credentials={credentials}
 * useLocalUIMode={useLocalUIMode}
 * seedData={seedData}
 * useSeed={useSeed}
 * imgSrc={imgSrc}
 * />
 * ```
 *
 * @description
 * This component handles the webinar functionalities for MediaSFU, including joining rooms,
 * managing participants, and handling media streams. It uses various hooks and methods to
 * manage state and perform actions such as joining a room, updating initial values, and
 * handling media streams.
 *
 */
declare const MediasfuWebinar: React.FC<MediasfuWebinarOptions>;
export default MediasfuWebinar;
//# sourceMappingURL=MediasfuWebinar.d.ts.map