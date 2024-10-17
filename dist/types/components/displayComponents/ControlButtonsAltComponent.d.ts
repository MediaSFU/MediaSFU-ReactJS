import React from 'react';
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
    alternateIconComponent?: JSX.Element;
    iconComponent?: JSX.Element;
    customComponent?: JSX.Element;
    color?: string;
    inActiveColor?: string;
    show?: boolean;
}
export interface ControlButtonsAltComponentOptions {
    buttons: AltButton[];
    position?: 'left' | 'right' | 'middle';
    location?: 'top' | 'bottom' | 'center';
    direction?: 'horizontal' | 'vertical';
    buttonsContainerStyle?: React.CSSProperties;
    alternateIconComponent?: JSX.Element;
    iconComponent?: JSX.Element;
    showAspect?: boolean;
}
export type ControlButtonsAltComponentType = (options: ControlButtonsAltComponentOptions) => React.ReactNode;
/**
 * ControlButtonsAltComponent is a React functional component that renders a set of control buttons
 * with customizable alignment, direction, and styles.
 *
 * @param {ControlButtonsAltComponentOptions} props - The properties object.
 * @param {Array<ButtonOptions>} props.buttons - An array of button options to be rendered.
 * @param {string} [props.position='left'] - The horizontal alignment of the buttons ('left', 'right', 'middle').
 * @param {string} [props.location='top'] - The vertical alignment of the buttons ('top', 'bottom', 'center').
 * @param {string} [props.direction='horizontal'] - The direction of the button layout ('horizontal', 'vertical').
 * @param {React.CSSProperties} [props.buttonsContainerStyle] - Additional styles for the buttons container.
 * @param {boolean} [props.showAspect=false] - Whether to display the buttons container.
 *
 * @returns {JSX.Element} The rendered component.
 */
declare const ControlButtonsAltComponent: React.FC<ControlButtonsAltComponentOptions>;
export default ControlButtonsAltComponent;
//# sourceMappingURL=ControlButtonsAltComponent.d.ts.map