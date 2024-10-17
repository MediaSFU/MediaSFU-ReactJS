import React from "react";
export interface MainContainerComponentOptions {
    backgroundColor?: string;
    children: React.ReactNode;
    containerWidthFraction?: number;
    containerHeightFraction?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
    padding?: number;
}
export type MainContainerComponentType = (options: MainContainerComponentOptions) => JSX.Element;
/**
 * MainContainerComponent is a React functional component that renders a container
 * with customizable dimensions and margins. The dimensions of the container are
 * calculated based on the window size and the provided fractions for width and height.
 * The component also updates its dimensions dynamically when the window is resized
 * or the orientation changes.
 *
 * @param {string} [backgroundColor='transparent'] - The background color of the container.
 * @param {React.ReactNode} children - The child elements to be rendered inside the container.
 * @param {number} [containerWidthFraction=1] - The fraction of the window width to be used for the container's width.
 * @param {number} [containerHeightFraction=1] - The fraction of the window height to be used for the container's height.
 * @param {number} [marginLeft=0] - The left margin of the container.
 * @param {number} [marginRight=0] - The right margin of the container.
 * @param {number} [marginTop=0] - The top margin of the container.
 * @param {number} [marginBottom=0] - The bottom margin of the container.
 *
 * @returns {JSX.Element} The rendered container component.
 */
declare const MainContainerComponent: React.FC<MainContainerComponentOptions>;
export default MainContainerComponent;
//# sourceMappingURL=MainContainerComponent.d.ts.map