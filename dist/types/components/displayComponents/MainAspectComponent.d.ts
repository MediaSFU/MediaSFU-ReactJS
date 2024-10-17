import React from "react";
export interface MainAspectComponentOptions {
    backgroundColor?: string;
    children: React.ReactNode;
    showControls?: boolean;
    containerWidthFraction?: number;
    containerHeightFraction?: number;
    defaultFraction?: number;
    updateIsWideScreen: (isWide: boolean) => void;
    updateIsMediumScreen: (isMedium: boolean) => void;
    updateIsSmallScreen: (isSmall: boolean) => void;
}
export type MainAspectComponentType = (options: MainAspectComponentOptions) => JSX.Element;
/**
 * MainAspectComponent is a React functional component that adjusts its dimensions
 * based on the window size and specified fractions. It also updates screen size
 * states (wide, medium, small) based on the container's width.
 *
 * @param {string} backgroundColor - The background color of the component. Defaults to "transparent".
 * @param {React.ReactNode} children - The child elements to be rendered inside the component.
 * @param {boolean} showControls - Flag to determine if controls are shown, affecting the height calculation. Defaults to true.
 * @param {number} containerWidthFraction - Fraction of the window width to be used for the container's width. Defaults to 1.
 * @param {number} containerHeightFraction - Fraction of the window height to be used for the container's height. Defaults to 1.
 * @param {number} defaultFraction - Default fraction to adjust the height when controls are shown. Defaults to 0.94.
 * @param {Function} updateIsWideScreen - Callback function to update the wide screen state.
 * @param {Function} updateIsMediumScreen - Callback function to update the medium screen state.
 * @param {Function} updateIsSmallScreen - Callback function to update the small screen state.
 *
 * @returns {JSX.Element} The rendered component with adjusted dimensions and background color.
 */
declare const MainAspectComponent: React.FC<MainAspectComponentOptions>;
export default MainAspectComponent;
//# sourceMappingURL=MainAspectComponent.d.ts.map