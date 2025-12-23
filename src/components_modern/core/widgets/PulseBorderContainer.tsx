/**
 * A container with an animated pulsing border effect.
 *
 * Supports:
 * - Single color pulse
 * - Gradient border pulse
 * - Multiple pulse waves
 * - Customizable pulse speed and intensity
 *
 * @example
 * ```tsx
 * <PulseBorderContainer
 *   pulseColor="#6366F1"
 *   isPulsing={true}
 *   borderWidth={2}
 *   isDarkMode={true}
 * >
 *   <p>Content with pulsing border</p>
 * </PulseBorderContainer>
 * ```
 */

import React, { useEffect, useRef, useState } from 'react';
import { MediasfuColors } from '../theme/MediasfuColors';
import { MediasfuSpacing } from '../theme/MediasfuSpacing';
import { MediasfuAnimations } from '../theme/MediasfuAnimations';
import { injectModernAnimations } from '../../utils/injectAnimations';

export interface PulseBorderContainerProps {
  /** Child content */
  children: React.ReactNode;
  /** Pulse color */
  pulseColor?: string;
  /** List of colors for gradient pulse effect */
  gradientColors?: string[];
  /** Background color */
  backgroundColor?: string;
  /** Border radius */
  borderRadius?: number;
  /** Border width */
  borderWidth?: number;
  /** Padding */
  padding?: string | number | React.CSSProperties;
  /** Margin */
  margin?: string | number;
  /** Duration of one pulse cycle in ms */
  pulseDuration?: number;
  /** Whether the pulse animation is running */
  isPulsing?: boolean;
  /** Number of concurrent pulse waves */
  pulseWaves?: number;
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** Click handler */
  onTap?: () => void;
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export const PulseBorderContainer: React.FC<PulseBorderContainerProps> = ({
  children,
  pulseColor,
  gradientColors,
  backgroundColor,
  borderRadius = 16,
  borderWidth = 2,
  padding,
  margin,
  pulseDuration = 1500,
  isPulsing = true,
  pulseWaves = 1,
  width,
  height,
  onTap,
  isDarkMode = true,
  className,
  style,
}) => {
  const [animationValue, setAnimationValue] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Inject animations on mount
  useEffect(() => {
    injectModernAnimations();
  }, []);

  // Calculate colors
  const color = pulseColor || (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary);
  const bgColor = backgroundColor || (isDarkMode ? MediasfuColors.surfaceDark : MediasfuColors.surface);

  // Animation loop
  useEffect(() => {
    if (!isPulsing) {
      setAnimationValue(0);
      return;
    }

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % pulseDuration) / pulseDuration;
      setAnimationValue(progress);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPulsing, pulseDuration]);

  // Calculate padding
  const getPadding = (): React.CSSProperties => {
    if (!padding) {
      return { padding: `${MediasfuSpacing.md}px` };
    }
    if (typeof padding === 'number') {
      return { padding: `${padding}px` };
    }
    if (typeof padding === 'string') {
      return { padding };
    }
    return padding as React.CSSProperties;
  };

  // Build pulsing border style
  const buildPulseBorder = (): React.CSSProperties => {
    if (!isPulsing) {
      return {
        border: `${borderWidth}px solid ${MediasfuColors.hexToRgba(color, 0.5)}`,
      };
    }

    // Create animated border using box-shadow for pulse effect
    const pulseIntensity = Math.sin(animationValue * Math.PI * 2) * 0.5 + 0.5;
    
    const shadows: string[] = [];
    
    for (let i = 0; i < pulseWaves; i++) {
      const waveProgress = (animationValue + i / pulseWaves) % 1;
      const waveIntensity = Math.sin(waveProgress * Math.PI * 2) * 0.5 + 0.5;
      const waveGlow = 3 + waveIntensity * 8;
      
      if (gradientColors && gradientColors.length > 0) {
        // Use first gradient color for pulse
        const pulseColorForWave = gradientColors[i % gradientColors.length];
        shadows.push(`0 0 ${waveGlow}px ${MediasfuColors.hexToRgba(pulseColorForWave, waveIntensity * 0.6)}`);
      } else {
        shadows.push(`0 0 ${waveGlow}px ${MediasfuColors.hexToRgba(color, waveIntensity * 0.6)}`);
      }
    }

    // Border with gradient if specified
    if (gradientColors && gradientColors.length >= 2) {
      return {
        border: `${borderWidth}px solid transparent`,
        backgroundImage: `linear-gradient(${bgColor}, ${bgColor}), linear-gradient(135deg, ${gradientColors.join(', ')})`,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        boxShadow: shadows.join(', '),
      };
    }

    return {
      border: `${borderWidth}px solid ${MediasfuColors.hexToRgba(color, 0.3 + pulseIntensity * 0.5)}`,
      boxShadow: shadows.join(', '),
    };
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    ...getPadding(),
    width,
    height,
    margin: typeof margin === 'number' ? `${margin}px` : margin,
    background: bgColor,
    borderRadius: `${borderRadius}px`,
    cursor: onTap ? 'pointer' : 'default',
    transition: `background ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    ...buildPulseBorder(),
    ...style,
  };

  const handleClick = () => {
    if (onTap) onTap();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onTap && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onTap();
    }
  };

  return (
    <div
      className={className}
      style={containerStyle}
      onClick={handleClick}
      onKeyDown={onTap ? handleKeyDown : undefined}
      role={onTap ? 'button' : undefined}
      tabIndex={onTap ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default PulseBorderContainer;
