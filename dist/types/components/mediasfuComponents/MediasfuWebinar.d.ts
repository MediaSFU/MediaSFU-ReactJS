/**
 * MediasfuWebinar component options type.
 *
 * @typedef {Object} MediasfuWebinarOptions
 * @property {(options: PreJoinPageOptions | WelcomePageOptions) => React.ReactNode} [PrejoinPage] - Component to render for the pre-join page.
 * @property {{ apiUserName: string; apiKey: string }} [credentials] - API credentials for the user.
 * @property {boolean} [useLocalUIMode] - Flag to determine if local UI mode should be used.
 * @property {SeedData} [seedData] - Seed data for initializing the component.
 * @property {boolean} [useSeed] - Flag to determine if seed data should be used.
 * @property {string} [imgSrc] - Source URL for the image.
 */
/**
 * MediasfuWebinar component.
 *
 * @component
 * @param {MediasfuWebinarOptions} props - Component properties.
 * @returns {React.FC<MediasfuWebinarOptions>} The MediasfuWebinar component.
 */
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
declare const MediasfuWebinar: React.FC<MediasfuWebinarOptions>;
export default MediasfuWebinar;
//# sourceMappingURL=MediasfuWebinar.d.ts.map