import React from "react";
import { WelcomePageOptions } from "../miscComponents/WelcomePage";
import { SeedData, PreJoinPageOptions } from "../../@types/types";
export type MediasfuWebinarOptions = {
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
/**
 * MediasfuWebinar component optimized for webinars.
 * Main focus is placed on the host with large screen area dedicated to the host.
 * Participants can share media (audio, video, screen share) with each other.
 * Participants can chat with each other and engage in polls and breakout rooms, share screens, and more during the conference.
 *
 * @typedef {Object} MediasfuWebinarOptions
 * @property {(options: PreJoinPageOptions | WelcomePageOptions) => React.ReactNode} [PrejoinPage] - Component to render for the pre-join page.
 * @property {{ apiUserName: string; apiKey: string }} [credentials] - API credentials for the user.
 * @property {boolean} [useLocalUIMode] - Flag to determine if local UI mode should be used.
 * @property {SeedData} [seedData] - Seed data for initializing the component.
 * @property {boolean} [useSeed] - Flag to determine if seed data should be used.
 * @property {string} [imgSrc] - Source URL for the image.
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
 * credentials={credentials}
 * useLocalUIMode={useLocalUIMode}
 * seedData={seedData}
 * useSeed={useSeed}
 * imgSrc={imgSrc}
 * />
 * ```
 */
declare const MediasfuWebinar: React.FC<MediasfuWebinarOptions>;
export default MediasfuWebinar;
//# sourceMappingURL=MediasfuWebinar.d.ts.map