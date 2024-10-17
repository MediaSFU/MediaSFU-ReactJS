/**
 * React component representing a menu item.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.icon - The name of the FontAwesome icon to be displayed.
 * @param {string} props.name - The text to be displayed as the menu item name.
 * @param {Function} props.onPress - The callback function to be invoked when the menu item is pressed.
 * @returns {React.ReactNode} - The rendered MenuItemComponent.
 */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon from @fortawesome/react-fontawesome

const MenuItemComponent = ({ icon, name, onPress }) => {
  return (
    <button style={styles.listItem} onClick={onPress}>
      {icon && <FontAwesomeIcon icon={icon} style={styles.listIcon} />}
      {name && <span style={styles.listText}>{name}</span>}
    </button>
  );
};

const styles = {
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '16px',
    paddingLeft: 0,
    marginLeft: 0,
    marginBottom: '10px',
    cursor: 'pointer',
  },

  listIcon: {
    fontSize: '20px',
    marginRight: '10px',
    color: '#ffffff',
  },

  listText: {
    color: '#ffffff',
    fontSize: '16px',
  },
};

export default MenuItemComponent;

