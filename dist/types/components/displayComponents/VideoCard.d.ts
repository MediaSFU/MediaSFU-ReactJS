import React from "react";
import { EventType } from '../../@types/types';
export interface VideoCardParameters {
    socket: Socket;
    roomName: string;
    coHostResponsibility: CoHostResponsibility[];
    showAlert?: ShowAlert;
    coHost: string;
    participants: Participant[];
    member: string;
    islevel: string;
    audioDecibels: AudioDecibels[];
    getUpdatedAllParams: () => VideoCardParameters;
    [key: string]: any;
}
export interface VideoCardOptions {
    customStyle?: React.CSSProperties;
    name: string;
    barColor?: string;
    textColor?: string;
    imageSource?: string;
    roundedImage?: boolean;
    imageStyle?: React.CSSProperties;
    remoteProducerId: string;
    eventType: EventType;
    forceFullDisplay: boolean;
    videoStream: MediaStream | null;
    showControls?: boolean;
    showInfo?: boolean;
    videoInfoComponent?: React.ReactNode;
    videoControlsComponent?: React.ReactNode;
    controlsPosition?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
    infoPosition?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
    participant: Participant;
    backgroundColor?: string;
    audioDecibels?: AudioDecibels[];
    doMirror?: boolean;
    parameters: VideoCardParameters;
}
export type VideoCardType = (options: VideoCardOptions) => React.JSX.Element;
/**
 * VideoCard component displays a video with optional control buttons, participant information, and an animated waveform.
 *
 * @component
 * @param {VideoCardOptions} props - The properties for the VideoCard component.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles for the card.
 * @param {string} props.name - Name of the participant.
 * @param {string} [props.barColor="red"] - Waveform bar color.
 * @param {string} [props.textColor="white"] - Text color for participant name.
 * @param {string} props.remoteProducerId - ID for the remote video producer.
 * @param {EventType} props.eventType - Event type for the video.
 * @param {boolean} props.forceFullDisplay - Flag to force full display of the video.
 * @param {MediaStream} props.videoStream - Video stream for display.
 * @param {boolean} [props.showControls=true] - Flag to display control buttons.
 * @param {boolean} [props.showInfo=true] - Flag to display participant information.
 * @param {React.ReactNode} [props.videoInfoComponent] - Custom video information component.
 * @param {React.ReactNode} [props.videoControlsComponent] - Custom video controls component.
 * @param {string} [props.controlsPosition="topLeft"] - Position of the control buttons overlay.
 * @param {string} [props.infoPosition="topRight"] - Position of the information overlay.
 * @param {Participant} props.participant - Participant details.
 * @param {string} props.backgroundColor - Background color of the video card.
 * @param {Array<AudioDecibels>} props.audioDecibels - Audio decibel data for the waveform.
 * @param {boolean} [props.doMirror=false] - Flag to mirror the video.
 * @param {VideoCardParameters} props.parameters - Additional parameters for video card settings.
 *
 * @returns {React.JSX.Element} The rendered VideoCard component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { VideoCard } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <VideoCard
 *       customStyle={{ border: '1px solid black' }}
 *       name="John Doe"
 *       barColor="blue"
 *       textColor="yellow"
 *       remoteProducerId="12345"
 *       eventType="video"
 *       forceFullDisplay={true}
 *       videoStream={mediaStream}
 *       showControls={true}
 *       showInfo={true}
 *       controlsPosition="topLeft"
 *       infoPosition="topRight"
 *       participant={participant}
 *       backgroundColor="black"
 *       audioDecibels={audioDecibels}
 *       doMirror={true}
 *       parameters={parameters}
 *     />
 *   );
 * }
 *
 *
 * export default App;
 * ```
 */
declare const VideoCard: React.FC<VideoCardOptions>;
import { AudioDecibels, CoHostResponsibility, Participant, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";
export default VideoCard;
//# sourceMappingURL=VideoCard.d.ts.map