import React from "react";
export interface MiniAudioOptions {
    visible?: boolean;
    customStyle?: React.CSSProperties;
    name: string;
    showWaveform?: boolean;
    overlayPosition?: string;
    barColor?: string;
    textColor?: string;
    nameTextStyling?: React.CSSProperties;
    imageSource: string;
    roundedImage?: boolean;
    imageStyle?: React.CSSProperties;
}
export type MiniAudioType = (options: MiniAudioOptions) => JSX.Element;
/**
 * MiniAudio component displays an audio player with optional waveform animation and draggable functionality.
 *
 * @component
 * @param {MiniAudioOptions} props - The properties for the MiniAudio component.
 * @param {boolean} [props.visible=true] - Determines if the component is visible.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles for the component.
 * @param {string} props.name - The name to display on the audio player.
 * @param {boolean} [props.showWaveform=false] - Flag to show or hide the waveform animation.
 * @param {string} [props.barColor='red'] - The color of the waveform bars.
 * @param {string} [props.textColor='white'] - The color of the text.
 * @param {React.CSSProperties} [props.nameTextStyling] - Custom styles for the name text.
 * @param {string} [props.imageSource] - The source URL for the background image.
 * @param {boolean} [props.roundedImage=false] - Flag to determine if the background image should be rounded.
 * @param {React.CSSProperties} [props.imageStyle] - Custom styles for the background image.
 * @param {string} [props.overlayPosition] - The position of the overlay.
 *
 * @returns {JSX.Element} The rendered MiniAudio component.
 *
 * @example
 * <MiniAudio
 *   visible={true}
 *   customStyle={{ backgroundColor: 'blue' }}
 *   name="Sample Audio"
 *   showWaveform={true}
 *   barColor="green"
 *   textColor="black"
 *   nameTextStyling={{ fontSize: '20px' }}
 *   imageSource="path/to/image.jpg"
 *   roundedImage={true}
 *   imageStyle={{ width: '100px' }}
 *   overlayPosition="top"
 * />
 */
declare const MiniAudio: React.FC<MiniAudioOptions>;
export default MiniAudio;
//# sourceMappingURL=MiniAudio.d.ts.map