import React from "react";
export interface MiniCardOptions {
    initials?: string;
    fontSize?: number;
    customStyle?: React.CSSProperties;
    imageSource?: string;
    roundedImage?: boolean;
    imageStyle?: React.CSSProperties;
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
    imageContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
    initialsContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    initialsTextProps?: React.HTMLAttributes<HTMLSpanElement>;
    renderContainer?: (options: {
        defaultContainer: React.ReactNode;
        isImage: boolean;
    }) => React.ReactNode;
    renderImage?: (options: {
        defaultImage: React.ReactNode;
        imageSource?: string;
    }) => React.ReactNode;
    renderInitials?: (options: {
        defaultInitials: React.ReactNode;
        initials?: string;
    }) => React.ReactNode;
}
export type MiniCardType = (options: MiniCardOptions) => React.JSX.Element;
/**
 * MiniCard displays either participant initials or a profile image inside a small, reusable card.
 *
 * This lightweight component is commonly used as a fallback for participant avatars when no full image
 * is available. It supports:
 * - Initials display with customizable font size and styling
 * - Profile image display with rounded or square corners
 * - Custom render hooks for container, image, and initials
 * - Extensive styling via props and HTML attributes
 * - Override patterns for use in MediaSFU UI components
 *
 * @component
 * @param {MiniCardOptions} props - The properties for the MiniCard component.
 * @param {string} [props.initials] - The participant's initials to display (e.g., "JD" for John Doe). Shown when no imageSource is provided.
 * @param {number} [props.fontSize=14] - Font size for the initials text.
 * @param {React.CSSProperties} [props.customStyle] - Custom styles for the card container.
 * @param {string} [props.imageSource] - Source URL for the participant's profile image. Takes precedence over initials.
 * @param {boolean} [props.roundedImage=true] - Whether to apply rounded corners to the image.
 * @param {React.CSSProperties} [props.imageStyle] - Custom styles for the image element.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - HTML props for the main container (className, style, etc.).
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.imageContainerProps] - HTML props for the image container.
 * @param {React.ImgHTMLAttributes<HTMLImageElement>} [props.imageProps] - HTML props for the image element.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.initialsContainerProps] - HTML props for the initials container.
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props.initialsTextProps] - HTML props for the initials text element.
 * @param {Function} [props.renderContainer] - Custom render function for the container. Receives { defaultContainer, isImage }.
 * @param {Function} [props.renderImage] - Custom render function for the image. Receives { defaultImage, imageSource }.
 * @param {Function} [props.renderInitials] - Custom render function for the initials. Receives { defaultInitials, initials }.
 *
 * @returns {React.JSX.Element} The rendered MiniCard component.
 *
 * @example
 * **Basic Usage (Initials)**
 * ```tsx
 * import React from 'react';
 * import { MiniCard } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MiniCard
 *       initials="JD"
 *       fontSize={16}
 *       customStyle={{ backgroundColor: 'blue', color: 'white' }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * **Basic Usage (Profile Image)**
 * ```tsx
 * import React from 'react';
 * import { MiniCard } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MiniCard
 *       imageSource="https://example.com/avatar.jpg"
 *       roundedImage={true}
 *       imageStyle={{ border: '2px solid gold' }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * **Custom Initials Renderer**
 * ```tsx
 * import React from 'react';
 * import { MiniCard } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MiniCard
 *       initials="AB"
 *       renderInitials={({ defaultInitials, initials }) => (
 *         <div style={{
 *           background: 'linear-gradient(45deg, purple, pink)',
 *           borderRadius: '50%',
 *           padding: 10,
 *           color: 'white',
 *           fontWeight: 'bold'
 *         }}>
 *           {initials}
 *         </div>
 *       )}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * **Using in uiOverrides (MediasfuGeneric example)**
 * ```tsx
 * import React from 'react';
 * import { MediasfuGeneric, MiniCard } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const CustomMiniCard = (props: any) => (
 *     <MiniCard
 *       {...props}
 *       fontSize={18}
 *       roundedImage={false}
 *       renderContainer={({ defaultContainer, isImage }) => (
 *         <div style={{
 *           border: '3px solid cyan',
 *           boxShadow: '0 0 10px cyan',
 *           padding: 5,
 *           borderRadius: isImage ? 0 : '50%'
 *         }}>
 *           {defaultContainer}
 *         </div>
 *       )}
 *     />
 *   );
 *
 *   return (
 *     <MediasfuGeneric
 *       useLocalUIMode={true}
 *       useSeed={true}
 *       seedData={mySeedData}
 *       uiOverrides={{
 *         MiniCard: CustomMiniCard
 *       }}
 *     />
 *   );
 * }
 * ```
 */
declare const MiniCard: React.FC<MiniCardOptions>;
export default MiniCard;
//# sourceMappingURL=MiniCard.d.ts.map