/**
 * Styled text field supporting filled, outlined, underline, glass,
 * and neumorphic variants with animated focus and error states.
 *
 * A premium text field component that provides multiple visual variants,
 * validation states, icon support, and smooth focus animations.
 *
 * @example
 * ```tsx
 * <PremiumTextField
 *   variant="glass"
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChangeText={setEmail}
 *   prefixIcon={<MailIcon />}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MediasfuColors } from '../theme/MediasfuColors';
import { MediasfuSpacing } from '../theme/MediasfuSpacing';
import { MediasfuTypography } from '../theme/MediasfuTypography';
import { MediasfuAnimations } from '../theme/MediasfuAnimations';
import { MediasfuBorders } from '../theme/MediasfuBorders';
import { injectModernAnimations } from '../../utils/injectAnimations';

/** Text field variant styles */
export type PremiumTextFieldVariant = 
  | 'filled'
  | 'outlined'
  | 'underline'
  | 'glass'
  | 'neumorphic';

export interface PremiumTextFieldProps {
  /** Current value */
  value?: string;
  /** Change handler */
  onChangeText?: (value: string) => void;
  /** Submit handler (on Enter key) */
  onSubmit?: () => void;
  /** Focus handler */
  onFocus?: () => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Text field variant */
  variant?: PremiumTextFieldVariant;
  /** Label text */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Helper text below the field */
  helperText?: string;
  /** Error message (overrides helperText) */
  errorText?: string;
  /** Whether field is in error state */
  hasError?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Whether field is read-only */
  readOnly?: boolean;
  /** Input type */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  /** Icon to display at start */
  prefixIcon?: React.ReactNode;
  /** Icon to display at end */
  suffixIcon?: React.ReactNode;
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Input container styles */
  containerStyle?: React.CSSProperties;
  /** Border radius override */
  borderRadius?: number;
  /** Full width field */
  fullWidth?: boolean;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Max length */
  maxLength?: number;
  /** Minimum value (for number type) */
  min?: number;
  /** Maximum value (for number type) */
  max?: number;
  /** Name attribute */
  name?: string;
  /** ID attribute */
  id?: string;
  /** Autocomplete attribute */
  autoComplete?: string;
  /** Required field */
  required?: boolean;
  /** Animation on mount */
  animateOnMount?: boolean;
}

export const PremiumTextField: React.FC<PremiumTextFieldProps> = ({
  value = '',
  onChangeText,
  onSubmit,
  onFocus,
  onBlur,
  variant = 'outlined',
  label,
  placeholder,
  helperText,
  errorText,
  hasError = false,
  disabled = false,
  readOnly = false,
  type = 'text',
  prefixIcon,
  suffixIcon,
  isDarkMode = true,
  className,
  style,
  containerStyle,
  borderRadius,
  fullWidth = false,
  autoFocus = false,
  maxLength,
  min,
  max,
  name,
  id,
  autoComplete,
  required = false,
  animateOnMount = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isMounted, setIsMounted] = useState(!animateOnMount);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isError = hasError || !!errorText;
  const displayHelper = errorText || helperText;
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Inject animations on mount
  useEffect(() => {
    injectModernAnimations();
    if (animateOnMount) {
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    }
  }, [animateOnMount]);

  // Get variant-specific styles
  const getVariantStyles = (): {
    container: React.CSSProperties;
    input: React.CSSProperties;
  } => {
    const baseRadius = borderRadius ?? MediasfuBorders.md;
    const focusColor = isError
      ? MediasfuColors.danger
      : MediasfuColors.primary;
    const borderColorBase = isError
      ? MediasfuColors.danger
      : isFocused
        ? focusColor
        : isDarkMode
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(0, 0, 0, 0.2)';

    switch (variant) {
      case 'filled': {
        const bgColor = isDarkMode
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.06)';
        return {
          container: {
            background: bgColor,
            borderRadius: `${baseRadius}px`,
            border: 'none',
            borderBottom: `2px solid ${borderColorBase}`,
          },
          input: {},
        };
      }

      case 'outlined':
        return {
          container: {
            background: 'transparent',
            borderRadius: `${baseRadius}px`,
            border: `2px solid ${borderColorBase}`,
          },
          input: {},
        };

      case 'underline':
        return {
          container: {
            background: 'transparent',
            borderRadius: 0,
            border: 'none',
            borderBottom: `2px solid ${borderColorBase}`,
          },
          input: {},
        };

      case 'glass':
        return {
          container: {
            background: MediasfuColors.glassBackground(isDarkMode),
            borderRadius: `${baseRadius}px`,
            border: `1px solid ${isFocused ? focusColor : MediasfuColors.glassBorder(isDarkMode)}`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: isFocused
              ? `0 0 0 3px ${MediasfuColors.hexToRgba(focusColor, 0.2)}`
              : 'none',
          },
          input: {},
        };

      case 'neumorphic': {
        const bgColor = isDarkMode ? '#1E1E2E' : '#E0E5EC';
        const lightShadow = isDarkMode
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(255, 255, 255, 0.8)';
        const darkShadow = isDarkMode
          ? 'rgba(0, 0, 0, 0.5)'
          : 'rgba(163, 177, 198, 0.6)';
        
        return {
          container: {
            background: bgColor,
            borderRadius: `${baseRadius}px`,
            border: 'none',
            boxShadow: isFocused
              ? `inset 3px 3px 6px ${darkShadow}, inset -3px -3px 6px ${lightShadow}, 0 0 0 3px ${MediasfuColors.hexToRgba(focusColor, 0.3)}`
              : `inset 3px 3px 6px ${darkShadow}, inset -3px -3px 6px ${lightShadow}`,
          },
          input: {},
        };
      }

      default:
        return { container: {}, input: {} };
    }
  };

  const variantStyles = getVariantStyles();

  // Container styles
  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: fullWidth ? '100%' : 'auto',
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? 'translateY(0)' : 'translateY(8px)',
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    ...style,
  };

  // Label styles
  const labelStyle: React.CSSProperties = {
    ...MediasfuTypography.getLabelMedium(isDarkMode),
    marginBottom: `${MediasfuSpacing.xs}px`,
    color: isError
      ? MediasfuColors.danger
      : isDarkMode
        ? 'rgba(255, 255, 255, 0.8)'
        : 'rgba(0, 0, 0, 0.7)',
    transition: `color ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  };

  // Input container styles
  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    ...variantStyles.container,
    ...containerStyle,
  };

  // Input styles
  const inputStyle: React.CSSProperties = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontFamily: MediasfuTypography.fontFamily,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    cursor: disabled ? 'not-allowed' : 'text',
    ...variantStyles.input,
  };

  // Icon styles
  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isError
      ? MediasfuColors.danger
      : isFocused
        ? MediasfuColors.primary
        : isDarkMode
          ? 'rgba(255, 255, 255, 0.5)'
          : 'rgba(0, 0, 0, 0.5)',
    transition: `color ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    width: '20px',
    height: '20px',
  };

  // Helper text styles
  const helperStyle: React.CSSProperties = {
    ...MediasfuTypography.getBodySmall(isDarkMode),
    marginTop: `${MediasfuSpacing.xs}px`,
    color: isError
      ? MediasfuColors.danger
      : isDarkMode
        ? 'rgba(255, 255, 255, 0.6)'
        : 'rgba(0, 0, 0, 0.6)',
  };

  // Toggle password visibility button
  const togglePasswordStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
  };

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeText?.(e.target.value);
  }, [onChangeText]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  }, [onSubmit]);

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Password toggle icon (simple text-based)
  const PasswordToggleIcon = () => (
    <button
      type="button"
      style={togglePasswordStyle}
      onClick={togglePasswordVisibility}
      tabIndex={-1}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? '👁️' : '👁️‍🗨️'}
    </button>
  );

  return (
    <div className={className} style={wrapperStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: MediasfuColors.danger }}> *</span>}
        </label>
      )}
      
      <div 
        style={inputContainerStyle}
        onClick={handleContainerClick}
        role="presentation"
      >
        {prefixIcon && <span style={iconStyle}>{prefixIcon}</span>}
        
        <input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          min={min}
          max={max}
          name={name}
          id={id}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required={required}
          aria-invalid={isError}
          aria-describedby={displayHelper ? `${id || name}-helper` : undefined}
          style={inputStyle}
        />
        
        {type === 'password' && <PasswordToggleIcon />}
        {suffixIcon && type !== 'password' && (
          <span style={iconStyle}>{suffixIcon}</span>
        )}
      </div>
      
      {displayHelper && (
        <span 
          id={`${id || name}-helper`}
          style={helperStyle}
          role={isError ? 'alert' : undefined}
        >
          {displayHelper}
        </span>
      )}
    </div>
  );
};

export default PremiumTextField;
