import React from "react";
export interface SubAspectComponentOptions {
    backgroundColor: string;
    children: React.ReactNode;
    showControls?: boolean;
    containerWidthFraction?: number;
    containerHeightFraction?: number;
    defaultFractionSub?: number;
}
export type SubAspectComponentType = (options: SubAspectComponentOptions) => JSX.Element;
/**
 * SubAspectComponent is a React functional component that renders a sub-aspect
 * of a media display with optional controls. The component adjusts its width
 * based on the window size and provided fractions.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.backgroundColor - The background color of the component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the component.
 * @param {boolean} [props.showControls=true] - Flag to show or hide the controls.
 * @param {number} props.containerWidthFraction - The fraction of the window width to be used for the component's width.
 * @param {number} props.containerHeightFraction - The fraction of the window height to be used for the component's height.
 * @param {number} [props.defaultFractionSub=0.0] - The default sub-aspect fraction to be used if controls are shown.
 *
 * @returns {JSX.Element} The rendered sub-aspect component.
 */
declare const SubAspectComponent: React.FC<SubAspectComponentOptions>;
export default SubAspectComponent;
//# sourceMappingURL=SubAspectComponent.d.ts.map