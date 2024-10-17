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
export type VideoCardType = (options: VideoCardOptions) => JSX.Element;
/**
 * VideoCard component displays a video stream with optional controls and information.
 * It also includes an animated waveform based on audio decibels.
 *
 * @component
 * @param {object} props - The properties object.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles for the card.
 * @param {string} props.name - The name of the participant.
 * @param {string} [props.barColor="red"] - The color of the waveform bars.
 * @param {string} [props.textColor="white"] - The color of the text.
 * @param {string} props.remoteProducerId - The ID of the remote producer.
 * @param {string} props.eventType - The type of event.
 * @param {boolean} props.forceFullDisplay - Whether to force full display of the video.
 * @param {MediaStream} props.videoStream - The video stream to display.
 * @param {boolean} [props.showControls=true] - Whether to show video controls.
 * @param {boolean} [props.showInfo=true] - Whether to show participant information.
 * @param {React.ReactNode} [props.videoInfoComponent] - Custom component for video information.
 * @param {React.ReactNode} [props.videoControlsComponent] - Custom component for video controls.
 * @param {string} [props.controlsPosition="topLeft"] - Position of the controls overlay.
 * @param {string} [props.infoPosition="topRight"] - Position of the information overlay.
 * @param {object} props.participant - The participant object.
 * @param {string} props.backgroundColor - Background color of the card.
 * @param {Array} props.audioDecibels - Array of audio decibel levels.
 * @param {boolean} props.doMirror - Whether to mirror the video.
 * @param {object} props.parameters - Additional parameters for the component.
 *
 * @returns {JSX.Element} The rendered VideoCard component.
 */
declare const VideoCard: React.FC<VideoCardOptions>;
import { AudioDecibels, CoHostResponsibility, Participant, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";
export default VideoCard;
//# sourceMappingURL=VideoCard.d.ts.map