import React from "react";
import MiniCard from "./MiniCard";
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
    cardProps?: React.HTMLAttributes<HTMLDivElement>;
    infoOverlayProps?: React.HTMLAttributes<HTMLDivElement>;
    nameContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    nameTextProps?: React.HTMLAttributes<HTMLParagraphElement>;
    waveformContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    waveformBarStyle?: React.CSSProperties;
    waveformBarProps?: React.HTMLAttributes<HTMLDivElement>;
    waveformHeights?: {
        silent?: number;
        active?: number;
    };
    waveformDurations?: number[];
    waveformBarCount?: number;
    renderWaveformBar?: (options: {
        index: number;
        isActive: boolean;
        height: number;
        style: React.CSSProperties;
        props: React.HTMLAttributes<HTMLDivElement>;
    }) => React.ReactNode;
    controlsOverlayProps?: React.HTMLAttributes<HTMLDivElement>;
    controlButtonProps?: {
        audio?: React.ButtonHTMLAttributes<HTMLButtonElement>;
        video?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    };
    audioEnabledIcon?: React.ReactNode;
    audioDisabledIcon?: React.ReactNode;
    videoEnabledIcon?: React.ReactNode;
    videoDisabledIcon?: React.ReactNode;
    fallbackMiniCardProps?: Partial<React.ComponentProps<typeof MiniCard>>;
    imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
    showWaveformWhenMuted?: boolean;
    isDarkMode?: boolean;
}
export type AudioCardType = (options: AudioCardOptions) => React.JSX.Element;
declare const AudioCard: React.FC<AudioCardOptions>;
export default AudioCard;
//# sourceMappingURL=AudioCard.d.ts.map