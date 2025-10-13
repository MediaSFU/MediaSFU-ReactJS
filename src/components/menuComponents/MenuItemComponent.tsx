import React, { CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(" ").trim();
  return filtered.length > 0 ? filtered : undefined;
};

// Define the props interface
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
  renderIcon?: (options: { defaultIcon: React.ReactNode }) => React.ReactNode;
  renderText?: (options: { defaultText: React.ReactNode }) => React.ReactNode;
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

const MenuItemComponent: React.FC<MenuItemComponentOptions> = ({
  icon,
  name,
  onPress,
  buttonProps,
  iconProps,
  textProps,
  renderButton,
  renderIcon,
  renderText,
  renderContent,
}) => {
  const {
    className: buttonClassName,
    style: buttonStyleOverrides,
    onClick: buttonOnClick,
    type: buttonType,
    ...restButtonProps
  } = buttonProps ?? {};

  const {
    className: iconClassName,
    style: iconStyleOverrides,
    icon: iconOverride,
    ...restIconProps
  } = iconProps ?? {};

  const {
    className: textClassName,
    style: textStyleOverrides,
    children: textChildren,
    ...restTextProps
  } = textProps ?? {};

  const resolvedIcon =
    (iconOverride as IconDefinition | undefined) ?? icon;

  const iconNodeDefault = resolvedIcon ? (
      <FontAwesomeIcon
        icon={resolvedIcon}
        className={joinClassNames(undefined, iconClassName)}
        style={{
          ...styles.listIcon,
          ...iconStyleOverrides,
        }}
        {...restIconProps}
      />
    ) : null;

  const iconNode = renderIcon
    ? renderIcon({ defaultIcon: iconNodeDefault })
    : iconNodeDefault;

  const textNodeDefault =
    name || textChildren ? (
      <span
        className={joinClassNames(undefined, textClassName)}
        style={{
          ...styles.listText,
          ...textStyleOverrides,
        }}
        {...restTextProps}
      >
        {textChildren ?? name}
      </span>
    ) : null;

  const textNode = renderText
    ? renderText({ defaultText: textNodeDefault })
    : textNodeDefault;

  const contentDefault = (
    <>
      {iconNode}
      {textNode}
    </>
  );

  const contentNode = renderContent
    ? renderContent({
        defaultContent: contentDefault,
        iconNode,
        textNode,
      })
    : contentDefault;

  const buttonNodeDefault = (
    <button
      type={buttonType ?? "button"}
      className={joinClassNames(undefined, buttonClassName)}
      style={{
        ...styles.listItem,
        ...buttonStyleOverrides,
      }}
      onClick={async (event) => {
        await Promise.resolve(buttonOnClick?.(event));
        if (!event.defaultPrevented) {
          onPress();
        }
      }}
      {...restButtonProps}
    >
      {contentNode}
    </button>
  );

  return renderButton
    ? renderButton({
        defaultButton: buttonNodeDefault,
        iconNode,
        textNode,
      })
    : buttonNodeDefault;
};

const styles: { [key: string]: CSSProperties } = {
  listItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "16px",
    paddingLeft: 0,
    marginLeft: 0,
    marginBottom: "10px",
    cursor: "pointer",
  },

  listIcon: {
    fontSize: "20px",
    marginRight: "10px",
    color: "#ffffff",
  },

  listText: {
    color: "#ffffff",
    fontSize: "16px",
  },
};

export default MenuItemComponent;
