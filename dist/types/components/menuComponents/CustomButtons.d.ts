import React from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import "./CustomButtons.css";
export interface CustomButton {
    action?: () => void | Promise<void>;
    show: boolean;
    backgroundColor?: string;
    disabled?: boolean;
    icon?: IconDefinition;
    iconStyle?: React.CSSProperties;
    text?: string;
    textStyle?: React.CSSProperties;
    /** More descriptive tooltip text shown on hover (defaults to text if not provided) */
    tooltip?: string;
    customComponent?: React.ReactNode;
    buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    iconProps?: Partial<FontAwesomeIconProps>;
    /**
     * When set to false, the wrapper renders as a non-button element so interactive custom components
     * (for example, components that render their own buttons) are not nested inside a native button.
     */
    renderAsButton?: boolean;
}
export interface CustomButtonsOptions {
    buttons: CustomButton[];
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
    fallbackSpinner?: React.ReactNode;
    renderContainer?: (options: {
        defaultContainer: React.ReactNode;
        buttons: CustomButton[];
    }) => React.ReactNode;
    renderButtons?: (options: {
        defaultButtons: React.ReactNode[];
        buttons: CustomButton[];
    }) => React.ReactNode;
    renderButton?: (options: {
        defaultButton: React.ReactNode;
        button: CustomButton;
        index: number;
        isVisible: boolean;
    }) => React.ReactNode;
}
export type CustomButtonsType = (options: CustomButtonsOptions) => React.JSX.Element;
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
 * @returns {React.JSX.Element} The rendered CustomButtons component.
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