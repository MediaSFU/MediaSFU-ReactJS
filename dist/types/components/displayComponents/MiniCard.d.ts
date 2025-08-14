import React from 'react';
export interface MiniCardOptions {
    initials?: string;
    fontSize?: number;
    customStyle?: React.CSSProperties;
    imageSource?: string;
    roundedImage?: boolean;
    imageStyle?: React.CSSProperties;
}
export type MiniCardType = (options: MiniCardOptions) => React.JSX.Element;
/**
 * MiniAudio component displays an audio player with an optional waveform animation and draggable functionality.
 *
 * This component provides a customizable audio display card that includes an animated waveform (optional) and a background image. The card can be dragged around the screen.
 *
 * @component
 * @param {MiniAudioOptions} props - The properties for the MiniAudio component.
 * @param {boolean} [props.visible=true] - Flag to control component visibility.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles to apply to the card.
 * @param {string} props.name - The name displayed on the audio player.
 * @param {boolean} [props.showWaveform=false] - Flag to display the animated waveform.
 * @param {string} [props.barColor='red'] - Color of the waveform bars.
 * @param {string} [props.textColor='white'] - Color of the displayed name text.
 * @param {React.CSSProperties} [props.nameTextStyling] - Custom styles for the name text.
 * @param {string} props.imageSource - URL of the background image for the card.
 * @param {boolean} [props.roundedImage=false] - If true, applies rounded styling to the background image.
 * @param {React.CSSProperties} [props.imageStyle] - Additional styles for the background image.
 * @param {string} [props.overlayPosition] - Position of the overlay containing the waveform.
 *
 * @returns {React.JSX.Element} The rendered MiniAudio component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MiniAudio } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MiniAudio
 *       visible={true}
 *       customStyle={{ backgroundColor: 'blue' }}
 *       name="Sample Audio"
 *       showWaveform={true}
 *       barColor="green"
 *       textColor="black"
 *       nameTextStyling={{ fontSize: '20px' }}
 *       imageSource="path/to/image.jpg"
 *       roundedImage={true}
 *       imageStyle={{ width: '100px' }}
 *       overlayPosition="top"
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const MiniCard: React.FC<MiniCardOptions>;
export default MiniCard;
//# sourceMappingURL=MiniCard.d.ts.map