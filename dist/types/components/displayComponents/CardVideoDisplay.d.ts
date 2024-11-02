import React from 'react';
import { EventType } from '../../@types/types';
export interface CardVideoDisplayOptions {
    remoteProducerId: string;
    eventType: EventType;
    forceFullDisplay: boolean;
    videoStream: MediaStream | null;
    backgroundColor?: string;
    doMirror?: boolean;
}
export type CardVideoDisplayType = (options: CardVideoDisplayOptions) => React.ReactNode;
/**
 * CardVideoDisplay - A React functional component that displays a video stream with configurable display options.
 *
 * This component renders a video element from a provided `MediaStream`, allowing options such as mirroring the video, setting a background color, and controlling whether the video fills the display area.
 *
 * @component
 * @param {CardVideoDisplayOptions} props - The properties object for CardVideoDisplay.
 * @param {string} props.remoteProducerId - The ID of the remote producer for tracking the video stream source.
 * @param {EventType} props.eventType - Type of the event, used for handling different video stream conditions.
 * @param {boolean} props.forceFullDisplay - If true, the video fills the display area.
 * @param {MediaStream | null} props.videoStream - The media stream to be displayed in the video element.
 * @param {string} [props.backgroundColor='transparent'] - Background color for the video container.
 * @param {boolean} [props.doMirror=false] - If true, the video is mirrored horizontally.
 *
 * @returns {JSX.Element} The rendered video display component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { CardVideoDisplay } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const mediaStream = new MediaStream(); // Example media stream
 *
 *   return (
 *     <CardVideoDisplay
 *       remoteProducerId="producer-123"
 *       eventType="live"
 *       forceFullDisplay={true}
 *       videoStream={mediaStream}
 *       backgroundColor="black"
 *       doMirror={true}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const CardVideoDisplay: React.FC<CardVideoDisplayOptions>;
export default CardVideoDisplay;
//# sourceMappingURL=CardVideoDisplay.d.ts.map