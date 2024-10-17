import React from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
export interface ButtonTouch {
    name?: string;
    icon?: IconDefinition;
    alternateIcon?: IconDefinition;
    onPress?: () => void;
    backgroundColor?: {
        default?: string;
    };
    active?: boolean;
    alternateIconComponent?: JSX.Element;
    iconComponent?: JSX.Element;
    customComponent?: JSX.Element;
    color?: string;
    activeColor?: string;
    inActiveColor?: string;
    show?: boolean;
    disabled?: boolean;
}
export interface ControlButtonsComponentTouchOptions {
    buttons: ButtonTouch[];
    position?: "left" | "right" | "middle";
    location?: "top" | "bottom" | "center";
    direction?: "horizontal" | "vertical";
    buttonsContainerStyle?: React.CSSProperties;
    showAspect?: boolean;
}
export type ControlButtonsComponentTouchType = (options: ControlButtonsComponentTouchOptions) => JSX.Element;
/**
 * ControlButtonsComponentTouch is a React functional component that renders a set of control buttons
 * with customizable styles and alignment options.
 *
 * @param {ControlButtonsComponentTouchOptions} props - The properties for the component.
 * @param {Array<Button>} props.buttons - An array of button objects to be rendered.
 * @param {string} [props.position="left"] - The horizontal position of the button container.
 *                                           Can be "left", "right", or "middle".
 * @param {string} [props.location="top"] - The vertical location of the button container.
 *                                          Can be "top", "bottom", or "center".
 * @param {string} [props.direction="horizontal"] - The direction of the button layout.
 *                                                  Can be "horizontal" or "vertical".
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Additional styles for the button container.
 * @param {boolean} [props.showAspect=false] - Flag to determine if the button container should be displayed.
 *
 * @returns {JSX.Element} The rendered component.
 */
declare const ControlButtonsComponentTouch: React.FC<ControlButtonsComponentTouchOptions>;
export default ControlButtonsComponentTouch;
//# sourceMappingURL=ControlButtonsComponentTouch.d.ts.map