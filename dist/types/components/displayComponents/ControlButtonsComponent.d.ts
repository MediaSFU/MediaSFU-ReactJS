import React from "react";
import "./ControlButtonsComponent.css";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
export interface Button {
    name?: string;
    icon?: IconDefinition;
    alternateIcon?: IconDefinition;
    onPress?: () => void;
    backgroundColor?: {
        default?: string;
        pressed?: string;
    };
    active?: boolean;
    alternateIconComponent?: JSX.Element;
    iconComponent?: JSX.Element;
    customComponent?: JSX.Element;
    color?: string;
    activeColor?: string;
    inActiveColor?: string;
    disabled?: boolean;
    show?: boolean;
}
export interface ControlButtonsComponentOptions {
    buttons: Button[];
    buttonColor?: string;
    buttonBackgroundColor?: {
        default?: string;
        pressed?: string;
    };
    alignment?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
    vertical?: boolean;
    buttonsContainerStyle?: React.CSSProperties;
    alternateIconComponent?: JSX.Element;
}
export type ControlButtonsComponentType = (options: ControlButtonsComponentOptions) => JSX.Element;
/**
 * ControlButtonsComponent is a React functional component that renders a set of control buttons.
 *
 * @param {ControlButtonsComponentOptions} props - The properties for the component.
 * @param {Array<ButtonOptions>} props.buttons - An array of button options to render.
 * @param {string} [props.buttonBackgroundColor] - The default background color for the buttons.
 * @param {string} [props.alignment='flex-start'] - The alignment of the buttons within the container. Defaults to 'flex-start'.
 * @param {boolean} [props.vertical=false] - Whether the buttons should be arranged vertically. Defaults to false.
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Additional styles for the buttons container.
 *
 * @returns {JSX.Element} The rendered component.
 */
declare const ControlButtonsComponent: React.FC<ControlButtonsComponentOptions>;
export default ControlButtonsComponent;
//# sourceMappingURL=ControlButtonsComponent.d.ts.map