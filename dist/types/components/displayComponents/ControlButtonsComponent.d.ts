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
    alternateIconComponent?: React.JSX.Element;
    iconComponent?: React.JSX.Element;
    customComponent?: React.JSX.Element;
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
    alternateIconComponent?: React.JSX.Element;
}
export type ControlButtonsComponentType = (options: ControlButtonsComponentOptions) => React.JSX.Element;
/**
 * ControlButtonsComponent is a React functional component that renders a set of customizable control buttons.
 *
 * This component organizes an array of buttons, each with options for icons, background color, and custom behavior. It supports horizontal or vertical layout and flexible alignment within the container.
 *
 * @component
 * @param {ControlButtonsComponentOptions} props - The properties object.
 * @param {Button[]} props.buttons - Array of button configurations for rendering.
 * @param {string} [props.buttonColor] - Default color for button icons.
 * @param {Object} [props.buttonBackgroundColor] - Background color options for the buttons.
 * @param {string} [props.buttonBackgroundColor.default] - Default background color for buttons.
 * @param {string} [props.buttonBackgroundColor.pressed] - Background color when the button is pressed.
 * @param {string} [props.alignment='flex-start'] - Horizontal alignment within the container ('flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly').
 * @param {boolean} [props.vertical=false] - If true, arranges buttons vertically; otherwise, horizontally.
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Additional CSS styles for the button container.
 *
 * @returns {React.JSX.Element} The rendered control buttons component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ControlButtonsComponent } from 'mediasfu-reactjs';
 * import { faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons';
 *
 * function App() {
 *   const buttons = [
 *     {
 *       name: 'Play',
 *       icon: faPlay,
 *       onPress: () => console.log('Play button pressed'),
 *       backgroundColor: { default: 'green' },
 *       active: true,
 *     },
 *     {
 *       name: 'Pause',
 *       icon: faPause,
 *       onPress: () => console.log('Pause button pressed'),
 *       backgroundColor: { default: 'red' },
 *     },
 *     {
 *       name: 'Stop',
 *       icon: faStop,
 *       onPress: () => console.log('Stop button pressed'),
 *     },
 *   ];
 *
 *   return (
 *     <ControlButtonsComponent
 *       buttons={buttons}
 *       buttonBackgroundColor={{ default: 'transparent', pressed: 'gray' }}
 *       alignment="flex-start"
 *       vertical={false}
 *       buttonsContainerStyle={{ padding: 10 }}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const ControlButtonsComponent: React.FC<ControlButtonsComponentOptions>;
export default ControlButtonsComponent;
//# sourceMappingURL=ControlButtonsComponent.d.ts.map