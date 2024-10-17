import React from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
export interface MenuItemComponentOptions {
    icon?: IconDefinition;
    name?: string;
    onPress: () => void;
}
export type MenuItemComponentType = (options: MenuItemComponentOptions) => JSX.Element;
declare const MenuItemComponent: React.FC<MenuItemComponentOptions>;
export default MenuItemComponent;
//# sourceMappingURL=MenuItemComponent.d.ts.map