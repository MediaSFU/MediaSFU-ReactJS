import React from "react";
import { ReUpdateInterType, UpdateParticipantAudioDecibelsType, ReUpdateInterParameters, BreakoutParticipant } from "../../../@types/types";
export interface MiniAudioPlayerParameters extends ReUpdateInterParameters {
    breakOutRoomStarted: boolean;
    breakOutRoomEnded: boolean;
    limitedBreakRoom: BreakoutParticipant[];
    reUpdateInter: ReUpdateInterType;
    updateParticipantAudioDecibels: UpdateParticipantAudioDecibelsType;
    getUpdatedAllParams: () => MiniAudioPlayerParameters;
    [key: string]: any;
}
export interface MiniAudioPlayerOptions {
    stream: MediaStream | null;
    remoteProducerId: string;
    parameters: MiniAudioPlayerParameters;
    MiniAudioComponent?: React.ComponentType<any>;
    miniAudioProps?: Record<string, any>;
}
export type MiniAudioPlayerType = (options: MiniAudioPlayerOptions) => JSX.Element;
/**
 * MiniAudioPlayer component is a React functional component that renders an audio player
 * and optionally a mini audio component for visualizing audio waveforms.
 *
 * @component
 * @param {MiniAudioPlayerOptions} props - The properties for the MiniAudioPlayer component.
 * @param {MediaStream} props.stream - The media stream to be played by the audio player.
 * @param {string} props.remoteProducerId - The ID of the remote producer.
 * @param {Object} props.parameters - The parameters object containing various settings and methods.
 * @param {Function} props.parameters.getUpdatedAllParams - Function to get updated parameters.
 * @param {Function} props.parameters.reUpdateInter - Function to re-update interaction parameters.
 * @param {Function} props.parameters.updateParticipantAudioDecibels - Function to update participant audio decibels.
 * @param {boolean} props.parameters.breakOutRoomStarted - Flag indicating if the breakout room has started.
 * @param {boolean} props.parameters.breakOutRoomEnded - Flag indicating if the breakout room has ended.
 * @param {Array} props.parameters.limitedBreakRoom - Array of limited breakout room participants.
 * @param {React.ComponentType} props.MiniAudioComponent - The component to render for audio visualization.
 * @param {Object} props.miniAudioProps - Additional properties to pass to the MiniAudioComponent.
 *
 * @returns {JSX.Element} The rendered MiniAudioPlayer component.
 *
 * @example
 * <MiniAudioPlayer
 *   stream={mediaStream}
 *   remoteProducerId="producer123"
 *   parameters={parameters}
 *   MiniAudioComponent={WaveformComponent}
 *   miniAudioProps={{ color: 'blue' }}
 * />
 */
declare const MiniAudioPlayer: React.FC<MiniAudioPlayerOptions>;
export default MiniAudioPlayer;
//# sourceMappingURL=MiniAudioPlayer.d.ts.map