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
 * MiniCardAudio component displays an audio card with an optional animated waveform and background image.
 *
 * This component is designed to render an interactive audio card with customizable styling, optional waveform animation, and a background image. The waveform animation is responsive and changes based on the audio levels.
 *
 * @component
 * @param {MiniCardAudioOptions} props - The properties for the MiniCardAudio component.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles to apply to the card container.
 * @param {string} props.name - The name displayed on the card.
 * @param {boolean} props.showWaveform - Determines whether the waveform animation is visible.
 * @param {string} [props.overlayPosition] - Position for the overlay containing the waveform.
 * @param {string} [props.barColor="white"] - Color of the animated waveform bars.
 * @param {string} [props.textColor="white"] - Color of the displayed name text.
 * @param {string} props.imageSource - URL for the background image on the card.
 * @param {boolean} [props.roundedImage=false] - If true, applies rounded corners to the background image.
 * @param {React.CSSProperties} [props.imageStyle] - Additional styles for customizing the background image.
 *
 * @returns {JSX.Element} The rendered MiniCardAudio component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MiniCardAudio } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MiniCardAudio
 *       customStyle={{ backgroundColor: 'black' }}
 *       name="Sample Audio"
 *       showWaveform={true}
 *       overlayPosition="bottom"
 *       barColor="blue"
 *       textColor="yellow"
 *       imageSource="path/to/image.jpg"
 *       roundedImage={true}
 *       imageStyle={{ borderRadius: '10px' }}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const MiniCardAudio: React.FC<MiniCardAudioOptions>;
export default MiniCardAudio;
//# sourceMappingURL=MiniCardAudio.d.ts.map