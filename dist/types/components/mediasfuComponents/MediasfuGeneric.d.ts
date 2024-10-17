/**
 * MediasfuGeneric component options type.
 *
 * @typedef {Object} MediasfuGenericOptions
 * @property {function} [PrejoinPage=WelcomePage] - Function to render the prejoin page.
 * @property {Object} [credentials={ apiUserName: "", apiKey: "" }] - API credentials.
 * @property {boolean} [useLocalUIMode=false] - Flag to use local UI mode.
 * @property {SeedData} [seedData={}] - Seed data for initial state.
 * @property {boolean} [useSeed=false] - Flag to use seed data.
 * @property {string} [imgSrc="https://mediasfu.com/images/logo192.png"] - Image source URL.
 */
/**
 * MediasfuGeneric component.
 *
 * @component
 * @param {MediasfuGenericOptions} props - Component properties.
 * @returns {React.FC<MediasfuGenericOptions>} - React functional component.
 *
 * @example
 * <MediasfuGeneric
 *   PrejoinPage={CustomPrejoinPage}
 *   credentials={{ apiUserName: "user", apiKey: "key" }}
 *   useLocalUIMode={true}
 *   seedData={customSeedData}
 *   useSeed={true}
 *   imgSrc="https://example.com/logo.png"
 * />
 *
 * @description
 * This component handles the generic functionalities for MediaSFU, including joining rooms,
 * managing participants, and handling media streams. It uses various hooks and methods to
 * manage state and perform actions such as joining a room, updating initial values, and
 * handling media streams.
 *
 */
import React from "react";
import { WelcomePageOptions } from "../miscComponents/WelcomePage";
import { SeedData, PreJoinPageOptions } from "../../@types/types";
export type MediasfuGenericOptions = {
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
declare const MediasfuGeneric: React.FC<MediasfuGenericOptions>;
export default MediasfuGeneric;
//# sourceMappingURL=MediasfuGeneric.d.ts.map