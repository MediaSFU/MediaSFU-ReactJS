import React from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import "./CustomButtons.css";
export interface CustomButton {
    action: () => void;
    show: boolean;
    backgroundColor?: string;
    disabled?: boolean;
    icon?: IconDefinition;
    iconStyle?: React.CSSProperties;
    text?: string;
    textStyle?: React.CSSProperties;
    customComponent?: React.ReactNode;
}
export interface CustomButtonsOptions {
    buttons: CustomButton[];
}
export type CustomButtonsType = (options: CustomButtonsOptions) => JSX.Element;
/**
 * CustomButtons component renders a list of customizable buttons.
 *
 * @component
 * @param {CustomButtonsOptions} props - The properties for the CustomButtons component.
 * @param {Array} props.buttons - An array of button configurations.
 * @param {Object} props.buttons[].action - The function to be called when the button is clicked.
 * @param {boolean} props.buttons[].show - Determines if the button should be displayed.
 * @param {string} props.buttons[].backgroundColor - The background color of the button.
 * @param {boolean} props.buttons[].disabled - Determines if the button should be disabled.
 * @param {Object} [props.buttons[].icon] - The icon to be displayed on the button.
 * @param {Object} [props.buttons[].iconStyle] - The style to be applied to the icon.
 * @param {string} [props.buttons[].text] - The text to be displayed on the button.
 * @param {Object} [props.buttons[].textStyle] - The style to be applied to the text.
 * @param {React.ReactNode} [props.buttons[].customComponent] - A custom component to be rendered inside the button.
 *
 * @returns {JSX.Element} The rendered CustomButtons component.
 */
declare const CustomButtons: React.FC<CustomButtonsOptions>;
export default CustomButtons;
//# sourceMappingURL=CustomButtons.d.ts.map