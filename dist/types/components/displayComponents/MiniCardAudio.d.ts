import React from "react";
export interface MiniCardAudioOptions {
    customStyle?: React.CSSProperties;
    name: string;
    showWaveform: boolean;
    overlayPosition?: string;
    barColor?: string;
    textColor?: string;
    imageSource?: string;
    roundedImage?: boolean;
    imageStyle?: React.CSSProperties;
}
export type MiniCardAudioType = (options: MiniCardAudioOptions) => JSX.Element;
/**
 * MiniCardAudio component displays an audio card with optional waveform animation.
 *
 * @component
 * @param {MiniCardAudioOptions} props - The properties for the MiniCardAudio component.
 * @param {React.CSSProperties} props.customStyle - Custom styles to apply to the card.
 * @param {string} props.name - The name to display on the card.
 * @param {boolean} props.showWaveform - Flag to show or hide the waveform animation.
 * @param {string} props.overlayPosition - Position of the overlay on the card.
 * @param {string} [props.barColor="white"] - Color of the waveform bars.
 * @param {string} [props.textColor="white"] - Color of the text.
 * @param {string} props.imageSource - Source URL for the background image.
 * @param {boolean} [props.roundedImage=false] - Flag to apply rounded corners to the image.
 * @param {React.CSSProperties} props.imageStyle - Custom styles to apply to the image.
 *
 * @returns {JSX.Element} The rendered MiniCardAudio component.
 *
 * @example
 * <MiniCardAudio
 *   customStyle={{ backgroundColor: 'black' }}
 *   name="Sample Audio"
 *   showWaveform={true}
 *   overlayPosition="bottom"
 *   barColor="blue"
 *   textColor="yellow"
 *   imageSource="path/to/image.jpg"
 *   roundedImage={true}
 *   imageStyle={{ borderRadius: '10px' }}
 * />
 */
declare const MiniCardAudio: React.FC<MiniCardAudioOptions>;
export default MiniCardAudio;
//# sourceMappingURL=MiniCardAudio.d.ts.map