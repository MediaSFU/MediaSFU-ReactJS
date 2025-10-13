import React from "react";
import { CardVideoDisplayOptions } from "./CardVideoDisplay";
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
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
    infoOverlayProps?: React.HTMLAttributes<HTMLDivElement>;
    controlsOverlayProps?: React.HTMLAttributes<HTMLDivElement>;
    waveformContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    waveformBarStyle?: React.CSSProperties;
    waveformBarClassName?: string;
    videoDisplayProps?: Partial<CardVideoDisplayOptions>;
    extraWidgets?: React.ReactNode;
    children?: React.ReactNode;
}
export type VideoCardType = (options: VideoCardOptions) => React.JSX.Element;
/**
 * VideoCard component displays participant video with optional controls, info overlay, and animated waveform.
 *
 * This component is commonly overridden via `uiOverrides.videoCard` or replaced with a custom builder
 * passed to `customVideoCard`. Use this to add host badges, reactions, CRM overlays, or analytics.
 *
 * @component
 * @param {VideoCardOptions} props - The properties for the VideoCard component.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles for the card wrapper.
 * @param {string} props.name - Participant display name.
 * @param {string} [props.barColor="red"] - Waveform bar color (audio activity visualization).
 * @param {string} [props.textColor="white"] - Text color for participant name overlay.
 * @param {string} props.remoteProducerId - Remote producer ID for the video track.
 * @param {EventType} props.eventType - Event context (conference, webinar, broadcast, chat).
 * @param {boolean} props.forceFullDisplay - Force full display mode (no cropping).
 * @param {MediaStream | null} props.videoStream - Video MediaStream to render.
 * @param {boolean} [props.showControls=true] - Display control buttons (mute, stop video).
 * @param {boolean} [props.showInfo=true] - Display participant info overlay.
 * @param {React.ReactNode} [props.videoInfoComponent] - Custom info component (replaces default name badge).
 * @param {React.ReactNode} [props.videoControlsComponent] - Custom controls component (replaces default buttons).
 * @param {"topLeft" | "topRight" | "bottomLeft" | "bottomRight"} [props.controlsPosition="topLeft"] - Control overlay position.
 * @param {"topLeft" | "topRight" | "bottomLeft" | "bottomRight"} [props.infoPosition="topRight"] - Info overlay position.
 * @param {Participant} props.participant - Full participant object (includes mute state, level, etc.).
 * @param {string} [props.backgroundColor] - Background color behind video.
 * @param {AudioDecibels[]} [props.audioDecibels] - Audio level data for waveform animation.
 * @param {boolean} [props.doMirror=false] - Mirror the video horizontally (for self-view).
 * @param {VideoCardParameters} props.parameters - Additional parameters including socket, room context, and callbacks.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - Props for outer container div.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.infoOverlayProps] - Props for info overlay wrapper.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.controlsOverlayProps] - Props for controls overlay wrapper.
 * @param {React.ReactNode} [props.extraWidgets] - Additional UI elements rendered inside the card.
 *
 * @returns {React.JSX.Element} The rendered VideoCard component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <VideoCard
 *   name="John Doe"
 *   remoteProducerId="producer-123"
 *   eventType="conference"
 *   forceFullDisplay={false}
 *   videoStream={mediaStream}
 *   participant={participant}
 *   backgroundColor="#0f172a"
 *   parameters={parameters}
 * />
 * ```
 *
 * @example
 * // Custom styled video card via customVideoCard prop
 * ```tsx
 * const customVideoCard: CustomVideoCardType = (props) => (
 *   <VideoCard
 *     {...props}
 *     customStyle={{
 *       borderRadius: 20,
 *       border: "3px solid #4c1d95",
 *       boxShadow: "0 28px 65px rgba(76,29,149,0.35)",
 *     }}
 *     infoOverlayProps={{
 *       style: {
 *         background: "rgba(79,70,229,0.9)",
 *         color: "#f8fafc",
 *         fontWeight: 600,
 *       },
 *     }}
 *   />
 * );
 *
 * <MediasfuGeneric customVideoCard={customVideoCard} />
 * ```
 *
 * @example
 * // Override via uiOverrides
 * ```tsx
 * const uiOverrides: MediasfuUICustomOverrides = {
 *   videoCard: {
 *     render: (props) => (
 *       <div style={{ position: "relative" }}>
 *         <VideoCard {...props} />
 *         {props.participant.islevel === "2" && (
 *           <div style={{ position: "absolute", top: 8, right: 8, background: "gold", padding: 4, borderRadius: 4 }}>
 *             HOST
 *           </div>
 *         )}
 *       </div>
 *     ),
 *   },
 * };
 * ```
 *
 * @example
 * // Full configuration example
 * ```tsx
 * <VideoCard
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