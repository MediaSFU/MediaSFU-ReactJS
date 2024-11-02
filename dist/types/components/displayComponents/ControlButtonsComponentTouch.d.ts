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
 * ControlButtonsComponentTouch is a React functional component that renders a customizable set of control buttons with flexible styling, positioning, and layout options.
 *
 * This component supports various button configurations, including custom icons, background colors, and dynamic display settings. It can be positioned horizontally or vertically with alignment control.
 *
 * @component
 * @param {ControlButtonsComponentTouchOptions} props - The properties for the component.
 * @param {ButtonTouch[]} props.buttons - An array of button configurations to render.
 * @param {string} [props.position="left"] - Horizontal alignment of the button container ("left", "right", "middle").
 * @param {string} [props.location="top"] - Vertical alignment of the button container ("top", "bottom", "center").
 * @param {string} [props.direction="horizontal"] - Layout direction of the buttons ("horizontal" or "vertical").
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Additional CSS styles for the button container.
 * @param {boolean} [props.showAspect=false] - Determines if the button container should be visible.
 *
 * @returns {JSX.Element} The rendered control buttons component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ControlButtonsComponentTouch } from 'mediasfu-reactjs';
 * import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
 *
 * function App() {
 *   const buttons = [
 *     {
 *       name: "Play",
 *       icon: faPlay,
 *       onPress: () => console.log("Play button pressed"),
 *       backgroundColor: { default: "green" },
 *       active: true,
 *     },
 *     {
 *       name: "Pause",
 *       icon: faPause,
 *       onPress: () => console.log("Pause button pressed"),
 *       backgroundColor: { default: "red" },
 *     },
 *   ];
 *
 *   return (
 *     <ControlButtonsComponentTouch
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
declare const ControlButtonsComponentTouch: React.FC<ControlButtonsComponentTouchOptions>;
export default ControlButtonsComponentTouch;
//# sourceMappingURL=ControlButtonsComponentTouch.d.ts.map