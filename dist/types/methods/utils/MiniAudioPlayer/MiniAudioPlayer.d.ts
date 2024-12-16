import React from "react";
import { ReUpdateInterType, UpdateParticipantAudioDecibelsType, ReUpdateInterParameters, BreakoutParticipant } from "../../../@types/types";
import { Consumer } from "mediasoup-client/lib/types";
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
    consumer: Consumer;
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
 * @param {MediaStream | null} props.stream - The media stream to be played by the audio player.
 * @param {Consumer} props.consumer - The consumer object for the remote audio producer.
 * @param {string} props.remoteProducerId - The ID of the remote producer.
 * @param {MiniAudioPlayerParameters} props.parameters - The parameters object containing various settings and methods.
 * @param {Function} props.parameters.getUpdatedAllParams - Function to get updated parameters.
 * @param {Function} props.parameters.reUpdateInter - Function to re-update interaction parameters.
 * @param {Function} props.parameters.updateParticipantAudioDecibels - Function to update participant audio decibels.
 * @param {boolean} props.parameters.breakOutRoomStarted - Flag indicating if the breakout room has started.
 * @param {boolean} props.parameters.breakOutRoomEnded - Flag indicating if the breakout room has ended.
 * @param {Array<BreakoutParticipant>} props.parameters.limitedBreakRoom - Array of limited breakout room participants.
 * @param {React.ComponentType} [props.MiniAudioComponent] - An optional component to render for audio visualization.
 * @param {Object} [props.miniAudioProps] - Additional properties to pass to the MiniAudioComponent.
 *
 * @returns {JSX.Element} The rendered MiniAudioPlayer component.
 *
 * @example
 * ```tsx
 * // Import and use MiniAudioPlayer in a React component
 * import { MiniAudioPlayer } from 'mediasfu-reactjs';
 *
 * const WaveformVisualizer = ({ stream }: { stream: MediaStream }) => (
 *   <canvas width="300" height="50" />
 * );
 *
 * const App = () => {
 *   const stream = useMediaStream(); // Custom hook to get MediaStream
 *   const parameters = {
 *     // Mocked parameters with required functions
 *     getUpdatedAllParams: () => updatedParameters,
 *     reUpdateInter: () => {},
 *     updateParticipantAudioDecibels: () => {},
 *     breakOutRoomStarted: false,
 *     breakOutRoomEnded: false,
 *     limitedBreakRoom: [],
 *   };
 *
 *   return (
 *     <MiniAudioPlayer
 *       stream={stream}
 *       consumer={consumer}
 *       remoteProducerId="producer123"
 *       parameters={parameters}
 *       MiniAudioComponent={WaveformVisualizer}
 *       miniAudioProps={{ color: 'blue' }}
 *     />
 *   );
 * };
 * ```
 */
declare const MiniAudioPlayer: React.FC<MiniAudioPlayerOptions>;
export default MiniAudioPlayer;
//# sourceMappingURL=MiniAudioPlayer.d.ts.map