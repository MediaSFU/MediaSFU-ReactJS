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
 * CardVideoDisplay - A React functional component that displays a video stream.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.forceFullDisplay - If true, the video will take up the full display area.
 * @param {MediaStream} props.videoStream - The media stream to be displayed in the video element.
 * @param {string} [props.backgroundColor='transparent'] - The background color of the video container.
 * @param {boolean} [props.doMirror=false] - If true, the video will be mirrored horizontally.
 *
 * @returns {JSX.Element} - The rendered video display component.
 */
declare const CardVideoDisplay: React.FC<CardVideoDisplayOptions>;
export default CardVideoDisplay;
//# sourceMappingURL=CardVideoDisplay.d.ts.map