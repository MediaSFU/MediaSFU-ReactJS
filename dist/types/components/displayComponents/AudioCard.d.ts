import React from "react";
import { ControlsPosition, InfoPosition, Participant, ControlMediaOptions, AudioDecibels, CoHostResponsibility, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";
export interface AudioCardParameters {
    audioDecibels: AudioDecibels[];
    participants: Participant[];
    socket: Socket;
    coHostResponsibility: CoHostResponsibility[];
    roomName: string;
    showAlert?: ShowAlert;
    coHost: string;
    islevel: string;
    member: string;
    eventType: string;
    getUpdatedAllParams(): AudioCardParameters;
}
export interface AudioCardOptions {
    controlUserMedia?: (options: ControlMediaOptions) => Promise<void>;
    customStyle?: React.CSSProperties;
    name: string;
    barColor?: string;
    textColor?: string;
    imageSource?: string;
    roundedImage?: boolean;
    imageStyle?: React.CSSProperties;
    showControls?: boolean;
    showInfo?: boolean;
    videoInfoComponent?: React.ReactNode;
    videoControlsComponent?: React.ReactNode;
    controlsPosition?: ControlsPosition;
    infoPosition?: InfoPosition;
    participant: Participant;
    backgroundColor?: string;
    audioDecibels?: AudioDecibels;
    parameters: AudioCardParameters;
}
export type AudioCardType = (options: AudioCardOptions) => JSX.Element;
/**
 * AudioCard component displays an audio card with various controls and information.
 *
 * @param {AudioCardOptions} props - The properties for the AudioCard component.
 * @param {Function} [props.controlUserMedia=controlMedia] - Function to control user media.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles for the card.
 * @param {string} props.name - Name of the participant.
 * @param {string} [props.barColor="red"] - Color of the waveform bars.
 * @param {string} [props.textColor="white"] - Color of the text.
 * @param {string} [props.imageSource] - Source URL for the participant's image.
 * @param {boolean} [props.roundedImage=false] - Whether the participant's image should be rounded.
 * @param {React.CSSProperties} [props.imageStyle] - Custom styles for the image.
 * @param {boolean} [props.showControls=true] - Whether to show control buttons.
 * @param {boolean} [props.showInfo=true] - Whether to show participant information.
 * @param {React.ReactNode} [props.videoInfoComponent] - Custom component for displaying video information.
 * @param {React.ReactNode} [props.videoControlsComponent] - Custom component for displaying video controls.
 * @param {string} [props.controlsPosition="topLeft"] - Position of the control buttons.
 * @param {string} [props.infoPosition="topRight"] - Position of the participant information.
 * @param {Object} props.participant - Participant object containing details about the participant.
 * @param {string} [props.backgroundColor] - Background color of the card.
 * @param {Array} [props.audioDecibels] - Array of audio decibel levels.
 * @param {Object} props.parameters - Parameters object containing various settings and states.
 *
 * @returns {JSX.Element} The rendered AudioCard component.
 */
declare const AudioCard: React.FC<AudioCardOptions>;
export default AudioCard;
//# sourceMappingURL=AudioCard.d.ts.map