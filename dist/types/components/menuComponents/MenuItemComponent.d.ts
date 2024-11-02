import React from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
export interface MenuItemComponentOptions {
    icon?: IconDefinition;
    name?: string;
    onPress: () => void;
}
export type MenuItemComponentType = (options: MenuItemComponentOptions) => JSX.Element;
/**
 * MenuItemComponent renders a button with an optional icon and text.
 *
 * @component
 * @param {MenuItemComponentOptions} options - The options for the menu item component.
 * @param {IconDefinition} [options.icon] - The FontAwesome icon to display.
 * @param {string} [options.name] - The name or text to display.
 * @param {() => void} options.onPress - The function to call when the button is pressed.
 *
 * @returns {JSX.Element} A JSX element representing the menu item.
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