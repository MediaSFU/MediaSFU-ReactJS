import React from "react";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { ConnectSendTransportVideoType, CreateSendTransportType, CreateSendTransportParameters, OnScreenChangesType, DisconnectSendTransportVideoType, OnScreenChangesParameters, ShowAlert, SleepType, VidCons, ConnectSendTransportVideoParameters, DisconnectSendTransportVideoParameters } from "../../@types/types";
import { Producer, ProducerOptions } from "mediasoup-client/lib/types";
export interface BackgroundModalParameters extends CreateSendTransportParameters, ConnectSendTransportVideoParameters, DisconnectSendTransportVideoParameters, OnScreenChangesParameters {
    customImage: string;
    selectedImage: string;
    segmentVideo: MediaStream | null;
    selfieSegmentation: SelfieSegmentation | null;
    pauseSegmentation: boolean;
    processedStream: MediaStream | null;
    keepBackground: boolean;
    backgroundHasChanged: boolean;
    virtualStream: MediaStream | null;
    mainCanvas: HTMLCanvasElement | null;
    prevKeepBackground: boolean;
    appliedBackground: boolean;
    videoAlreadyOn: boolean;
    audioOnlyRoom: boolean;
    islevel: string;
    recordStarted: boolean;
    recordResumed: boolean;
    recordPaused: boolean;
    recordStopped: boolean;
    recordingMediaOptions: string;
    mediaDevices: MediaDevices;
    showAlert?: ShowAlert;
    localStreamVideo: MediaStream | null;
    vidCons: VidCons;
    frameRate: number;
    targetResolution: string;
    updateCustomImage: (image: string) => void;
    updateSelectedImage: (image: string) => void;
    updateSegmentVideo: (stream: MediaStream | null) => void;
    updateSelfieSegmentation: (segmentation: SelfieSegmentation | null) => void;
    updatePauseSegmentation: (pause: boolean) => void;
    updateProcessedStream: (stream: MediaStream | null) => void;
    updateKeepBackground: (keep: boolean) => void;
    updateBackgroundHasChanged: (changed: boolean) => void;
    updateVirtualStream: (stream: MediaStream | null) => void;
    updatePrevKeepBackground: (prev: boolean) => void;
    updateAppliedBackground: (applied: boolean) => void;
    videoProducer: Producer | null;
    transportCreated: boolean;
    videoParams: ProducerOptions;
    updateVideoParams: (params: ProducerOptions) => void;
    autoClickBackground: boolean;
    updateAutoClickBackground: (autoClick: boolean) => void;
    createSendTransport: CreateSendTransportType;
    connectSendTransportVideo: ConnectSendTransportVideoType;
    disconnectSendTransportVideo: DisconnectSendTransportVideoType;
    onScreenChanges: OnScreenChangesType;
    sleep: SleepType;
    getUpdatedAllParams: () => BackgroundModalParameters;
    [key: string]: any;
}
export interface BackgroundModalOptions {
    isVisible: boolean;
    onClose: () => void;
    parameters: BackgroundModalParameters;
    position?: string;
    backgroundColor?: string;
}
export type BackgroundModalType = (props: BackgroundModalOptions) => JSX.Element;
/**
 * BackgroundModal component provides a modal interface for managing background settings.
 * It allows users to select, upload, and apply background images or videos.
 *
 * @component
 * @param {BackgroundModalOptions} props - The properties for the BackgroundModal component.
 * @param {boolean} props.isVisible - Determines if the modal is visible.
 * @param {() => void} props.onClose - Function to close the modal.
 * @param {object} props.parameters - Various parameters and state management functions.
 * @param {string} [props.position="topLeft"] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor="#f5f5f5"] - Background color of the modal.
 *
 * @returns {JSX.Element | null} The rendered BackgroundModal component or null if not visible.
 *
 * @example
 * ```tsx
 * <BackgroundModal
 *   isVisible={true}
 *   onClose={handleClose}
 *   parameters={parameters}
 *   position="topRight"
 *   backgroundColor="#ffffff"
 * />
 * ```
 */
declare const BackgroundModal: React.FC<BackgroundModalOptions>;
export default BackgroundModal;
//# sourceMappingURL=BackgroundModal.d.ts.map