/**
 * ParticipantsCounterBadge Component
 *
 * A badge component that displays the current participants count,
 * positioned at a corner of the screen with glassmorphic styling.
 *
 * @example
 * ```tsx
 * <ParticipantsCounterBadge
 *   participantsCount={10}
 *   position="bottomLeft"
 *   showBadge={true}
 *   isDarkMode={true}
 * />
 * ```
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

export type BadgePosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface ParticipantsCounterBadgeOptions {
  /** Number of participants to display */
  participantsCount: number;
  /** Position of the badge */
  position?: BadgePosition;
  /** Whether to show the badge */
  showBadge?: boolean;
  /** Background color of the badge */
  backgroundColor?: string;
  /** Text/icon color */
  textColor?: string;
  /** Whether in dark mode */
  isDarkMode?: boolean;
  /** Custom style overrides */
  customStyle?: React.CSSProperties;
}

export interface ParticipantsCounterBadgeProps extends ParticipantsCounterBadgeOptions {
  options?: ParticipantsCounterBadgeOptions;
}

/**
 * Gets position styles based on the position prop
 */
const getPositionStyle = (position: BadgePosition): React.CSSProperties => {
  const offset = 16;
  const positions: Record<BadgePosition, React.CSSProperties> = {
    topLeft: { top: offset, left: offset },
    topRight: { top: offset, right: offset },
    bottomLeft: { bottom: offset, left: offset },
    bottomRight: { bottom: offset, right: offset },
  };
  return positions[position];
};

export const ParticipantsCounterBadge: React.FC<ParticipantsCounterBadgeProps> = ({
  options,
  participantsCount: countProp,
  position: positionProp,
  showBadge: showBadgeProp,
  backgroundColor: bgProp,
  textColor: textColorProp,
  isDarkMode: darkModeProp,
  customStyle,
}) => {
  // Merge options with props
  const participantsCount = options?.participantsCount ?? countProp ?? 0;
  const position = options?.position ?? positionProp ?? 'bottomLeft';
  const showBadge = options?.showBadge ?? showBadgeProp ?? true;
  const isDarkMode = options?.isDarkMode ?? darkModeProp ?? true;
  const backgroundColor = options?.backgroundColor ?? bgProp ?? (isDarkMode ? 'rgba(45, 52, 54, 0.85)' : 'rgba(255, 255, 255, 0.9)');
  const textColor = options?.textColor ?? textColorProp ?? (isDarkMode ? '#FFFFFF' : '#1F2937');

  if (!showBadge) return null;

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 100,
    ...getPositionStyle(position),
    ...customStyle,
  };

  const badgeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    backgroundColor,
    borderRadius: 20,
    boxShadow: isDarkMode 
      ? '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: isDarkMode 
      ? '1px solid rgba(255, 255, 255, 0.15)'
      : '1px solid rgba(0, 0, 0, 0.1)',
  };

  const iconStyle: React.CSSProperties = {
    color: textColor,
    fontSize: 14,
    opacity: 0.9,
  };

  const countStyle: React.CSSProperties = {
    color: textColor,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.5px',
  };

  return (
    <div style={containerStyle}>
      <div style={badgeStyle}>
        <FontAwesomeIcon icon={faUsers} style={iconStyle} />
        <span style={countStyle}>{participantsCount}</span>
      </div>
    </div>
  );
};

export default ParticipantsCounterBadge;
