import React from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
export interface AltButton {
    name?: string;
    icon?: IconDefinition;
    alternateIcon?: IconDefinition;
    onPress?: () => void;
    backgroundColor?: {
        default?: string;
    };
    active?: boolean;
    alternateIconComponent?: React.JSX.Element;
    iconComponent?: React.JSX.Element;
    customComponent?: React.JSX.Element;
    color?: string;
    inActiveColor?: string;
    show?: boolean;
}
export interface ControlButtonsAltComponentOptions {
    buttons: AltButton[];
    position?: "left" | "right" | "middle";
    location?: "top" | "bottom" | "center";
    direction?: "horizontal" | "vertical";
    buttonsContainerStyle?: React.CSSProperties;
    alternateIconComponent?: React.JSX.Element;
    iconComponent?: React.JSX.Element;
    showAspect?: boolean;
}
export type ControlButtonsAltComponentType = (options: ControlButtonsAltComponentOptions) => React.ReactNode;
/**
 * ControlButtonsAltComponent is a React functional component that renders a set of control buttons with customizable alignment, direction, and styling options.
 *
 * This component accepts an array of button configurations, allowing each button to have custom icons, colors, and functionality, displayed in either horizontal or vertical layout.
 *
 * @component
 * @param {ControlButtonsAltComponentOptions} props - The properties object.
 * @param {AltButton[]} props.buttons - Array of button configurations to render within the component.
 * @param {string} [props.position='left'] - Specifies the horizontal alignment of the buttons within the container ('left', 'right', 'middle').
 * @param {string} [props.location='top'] - Specifies the vertical alignment of the buttons within the container ('top', 'bottom', 'center').
 * @param {string} [props.direction='horizontal'] - Determines the layout direction of the buttons, either 'horizontal' or 'vertical'.
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Additional CSS styles for the buttons container.
 * @param {boolean} [props.showAspect=false] - If true, displays the buttons container; if false, the container is hidden.
 *
 * @returns {React.JSX.Element} The rendered component containing control buttons.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ControlButtonsAltComponent } from 'mediasfu-reactjs';
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
 *       backgroundColor: { default: 'blue' },
 *     },
 *   ];
 *
 *   return (
 *     <ControlButtonsAltComponent
 *       buttons={buttons}
 *       position="left"
 *       location="top"
 *       direction="horizontal"
 *       buttonsContainerStyle={{ padding: 10 }}
 *       showAspect={true}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const ControlButtonsAltComponent: React.FC<ControlButtonsAltComponentOptions>;
export default ControlButtonsAltComponent;
//# sourceMappingURL=ControlButtonsAltComponent.d.ts.map