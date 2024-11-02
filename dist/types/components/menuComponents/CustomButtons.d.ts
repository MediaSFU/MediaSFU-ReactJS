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
 * @param {Function} props.buttons[].action - The function to be called when the button is clicked.
 * @param {boolean} props.buttons[].show - Determines if the button should be displayed.
 * @param {string} props.buttons[].backgroundColor - The background color of the button.
 * @param {boolean} props.buttons[].disabled - Determines if the button should be disabled.
 * @param {IconDefinition} [props.buttons[].icon] - The icon to be displayed on the button.
 * @param {Object} [props.buttons[].iconStyle] - The style to be applied to the icon.
 * @param {string} [props.buttons[].text] - The text to be displayed on the button.
 * @param {Object} [props.buttons[].textStyle] - The style to be applied to the text.
 * @param {React.ReactNode} [props.buttons[].customComponent] - A custom component to be rendered inside the button.
 *
 * @returns {JSX.Element} The rendered CustomButtons component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { CustomButtons } from 'mediasfu-reactjs';
 * import { faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
 *
 * const buttons = [
 *   {
 *     action: () => console.log("Save clicked"),
 *     show: true,
 *     backgroundColor: "green",
 *     disabled: false,
 *     icon: faCheck,
 *     iconStyle: { color: "white" },
 *     text: "Save",
 *     textStyle: { color: "white", fontSize: "16px" },
 *   },
 *   {
 *     action: () => console.log("Loading..."),
 *     show: true,
 *     backgroundColor: "gray",
 *     disabled: true,
 *     icon: faSpinner,
 *     iconStyle: { color: "lightgray" },
 *     text: "Loading",
 *     textStyle: { color: "lightgray", fontSize: "16px" },
 *     customComponent: <CustomSpinner />, // Example custom component
 *   },
 * ];
 *
 * const App = () => (
 *   <CustomButtons buttons={buttons} />
 * );
 *
 * export default App;
 * ```
 */
declare const CustomButtons: React.FC<CustomButtonsOptions>;
export default CustomButtons;
//# sourceMappingURL=CustomButtons.d.ts.map