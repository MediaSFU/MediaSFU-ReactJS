import React from "react";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
export interface MenuItemComponentOptions {
    icon?: IconDefinition;
    name?: string;
    onPress: () => void;
    buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    iconProps?: Partial<FontAwesomeIconProps>;
    textProps?: React.HTMLAttributes<HTMLSpanElement>;
    renderButton?: (options: {
        defaultButton: React.ReactNode;
        iconNode: React.ReactNode;
        textNode: React.ReactNode;
    }) => React.ReactNode;
    renderIcon?: (options: {
        defaultIcon: React.ReactNode;
    }) => React.ReactNode;
    renderText?: (options: {
        defaultText: React.ReactNode;
    }) => React.ReactNode;
    renderContent?: (options: {
        defaultContent: React.ReactNode;
        iconNode: React.ReactNode;
        textNode: React.ReactNode;
    }) => React.ReactNode;
}
export type MenuItemComponentType = (options: MenuItemComponentOptions) => React.JSX.Element;
/**
 * MenuItemComponent renders a button with an optional icon and text.
 *
 * @component
 * @param {MenuItemComponentOptions} options - The options for the menu item component.
 * @param {IconDefinition} [options.icon] - The FontAwesome icon to display.
 * @param {string} [options.name] - The name or text to display.
 * @param {() => void} options.onPress - The function to call when the button is pressed.
 *
 * @returns {React.JSX.Element} A JSX element representing the menu item.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 * import { faCoffee } from '@fortawesome/free-solid-svg-icons';
 * import { MenuItemComponent } from 'mediasfu-reactjs';
 *
 * const App = () => (
 *   <MenuItemComponent
 *     icon={faCoffee}
 *     name="Coffee"
 *     onPress={() => console.log('Coffee selected')}
 *   />
 * );
 *
 * export default App;
 * ```
 */
declare const MenuItemComponent: React.FC<MenuItemComponentOptions>;
export default MenuItemComponent;
//# sourceMappingURL=MenuItemComponent.d.ts.map