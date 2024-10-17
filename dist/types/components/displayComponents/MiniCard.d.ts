import React from 'react';
export interface MiniCardOptions {
    initials?: string;
    fontSize?: number;
    customStyle?: React.CSSProperties;
    imageSource?: string;
    roundedImage?: boolean;
    imageStyle?: React.CSSProperties;
}
export type MiniCardType = (options: MiniCardOptions) => JSX.Element;
/**
 * MiniCard component displays a small card with either an image or initials.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.initials - The initials to display if no image is provided.
 * @param {number} [props.fontSize=14] - The font size for the initials.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles to apply to the card.
 * @param {string} [props.imageSource] - The source URL of the image to display.
 * @param {boolean} [props.roundedImage=true] - Whether the image should be displayed with rounded corners.
 * @param {React.CSSProperties} [props.imageStyle] - Custom styles to apply to the image.
 *
 * @returns {JSX.Element} The rendered MiniCard component.
 */
declare const MiniCard: React.FC<MiniCardOptions>;
export default MiniCard;
//# sourceMappingURL=MiniCard.d.ts.map