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
export type AudioCardType = (options: AudioCardOptions) => React.JSX.Element;
/**
 * AudioCard component displays an audio card with various controls, participant information, and a visual waveform.
 *
 * This component renders an interactive card with customizable styles, an image, and control buttons for audio and video functionality. The waveform reacts to audio levels, and the component manages real-time states through parameters like `audioDecibels`, `participant` information, and `coHost` responsibilities.
 *
 * @component
 * @param {AudioCardOptions} props - The properties for the AudioCard component.
 * @param {Function} [props.controlUserMedia=controlMedia] - Function to control user media actions.
 * @param {React.CSSProperties} [props.customStyle] - Optional custom styles for the card.
 * @param {string} props.name - The name of the participant displayed on the card.
 * @param {string} [props.barColor="red"] - Color of the waveform bars representing audio levels.
 * @param {string} [props.textColor="white"] - Text color for participant details.
 * @param {string} [props.imageSource] - Source URL for the participant’s image.
 * @param {boolean} [props.roundedImage=false] - Whether to round the participant’s image.
 * @param {React.CSSProperties} [props.imageStyle] - Optional styles for the image.
 * @param {boolean} [props.showControls=true] - Flag to show control buttons for media.
 * @param {boolean} [props.showInfo=true] - Flag to display participant information.
 * @param {React.ReactNode} [props.videoInfoComponent] - Custom component for showing video information.
 * @param {React.ReactNode} [props.videoControlsComponent] - Custom component for media controls.
 * @param {ControlsPosition} [props.controlsPosition="topLeft"] - Position of the control buttons.
 * @param {InfoPosition} [props.infoPosition="topRight"] - Position of participant information.
 * @param {Participant} props.participant - The participant object with relevant details.
 * @param {string} [props.backgroundColor] - Background color of the card.
 * @param {AudioDecibels} [props.audioDecibels] - Audio decibel levels for waveform display.
 * @param {AudioCardParameters} props.parameters - Parameters object with various settings and states for the card.
 *
 * @returns {React.JSX.Element} The rendered AudioCard component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { AudioCard } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const participant = { name: "John Doe", id: "123", muted: false, videoOn: true };
 *   const parameters = {
 *     audioDecibels: [{ name: "John Doe", averageLoudness: 128 }],
 *     participants: [participant],
 *     socket: {}, // Add actual socket instance here
 *     coHostResponsibility: [],
 *     roomName: "Main Room",
 *     coHost: "Host123",
 *     islevel: "1",
 *     member: "member",
 *     eventType: "meeting",
 *     getUpdatedAllParams: () => parameters,
 *   };
 *
 *   return (
 *     <AudioCard
 *       name="John Doe"
 *       participant={participant}
 *       parameters={parameters}
 *       audioDecibels={parameters.audioDecibels[0]}
 *       showControls={true}
 *       showInfo={true}
 *       controlsPosition="topLeft"
 *       infoPosition="topRight"
 *       backgroundColor="black"
 *       barColor="red"
 *       textColor="white"
 *       imageSource="https://example.com/image.jpg"
 *       roundedImage={true}
 *       imageStyle={{ width: "100px", height: "100px" }}
 *       customStyle={{ width: "200px", height: "200px" }}
 *       controlUserMedia={() => console.log("Control media invoked")}
 *       videoInfoComponent={<CustomVideoInfoComponent />}
 *       videoControlsComponent={<CustomVideoControlsComponent />}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const AudioCard: React.FC<AudioCardOptions>;
export default AudioCard;
//# sourceMappingURL=AudioCard.d.ts.map