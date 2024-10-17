import React from "react";
import { ComponentSizes } from "../../@types/types";
export interface MainScreenComponentOptions {
    children: React.ReactNode;
    mainSize: number;
    doStack: boolean;
    containerWidthFraction?: number;
    containerHeightFraction?: number;
    updateComponentSizes: (sizes: ComponentSizes) => void;
    defaultFraction?: number;
    showControls: boolean;
    componentSizes: ComponentSizes;
}
export type MainScreenComponentType = (options: MainScreenComponentOptions) => JSX.Element;
/**
 * MainScreenComponent is a React functional component that dynamically adjusts the layout
 * and dimensions of its child components based on the provided props and the window size.
 *
 * @param {React.ReactNode} children - The child components to be rendered within the main screen.
 * @param {number} mainSize - The size percentage of the main component when stacking is enabled.
 * @param {boolean} doStack - A flag indicating whether the components should be stacked.
 * @param {number} [containerWidthFraction=1] - The fraction of the window width to be used for the container.
 * @param {number} [containerHeightFraction=1] - The fraction of the window height to be used for the container.
 * @param {Function} updateComponentSizes - A callback function to update the sizes of the components.
 * @param {number} [defaultFraction=0.94] - The default fraction to be applied to the container height when controls are shown.
 * @param {boolean} showControls - A flag indicating whether controls are shown, affecting the container height.
 * @param {Object} componentSizes - An object containing the current sizes of the components.
 *
 * @returns {JSX.Element} The rendered main screen component with its children.
 */
declare const MainScreenComponent: React.FC<MainScreenComponentOptions>;
export default MainScreenComponent;
//# sourceMappingURL=MainScreenComponent.d.ts.map