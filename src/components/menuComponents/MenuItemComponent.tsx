import React, { CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon from @fortawesome/react-fontawesome
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

// Define the props interface
export interface MenuItemComponentOptions {
  icon?: IconDefinition;
  name?: string;
  onPress: () => void;
}

export type MenuItemComponentType = (options: MenuItemComponentOptions) => JSX.Element;

const MenuItemComponent: React.FC<MenuItemComponentOptions> = ({ icon, name, onPress }) => {
  return (
    <button style={styles.listItem} onClick={onPress}>
      {icon && <FontAwesomeIcon icon={icon} style={styles.listIcon} />}
      {name && <span style={styles.listText}>{name}</span>}
    </button>
  );
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
