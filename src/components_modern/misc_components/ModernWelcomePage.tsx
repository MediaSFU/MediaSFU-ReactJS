/**
 * ModernWelcomePage - Modern glassmorphic welcome/entry page for MediaSFU events.
 *
 * A premium redesigned welcome page with glassmorphism effects, animated gradients,
 * and dark/light mode support. Retains all business logic from the classic WelcomePage.
 *
 * @module ModernWelcomePage
 */

import React, { useState, useEffect, CSSProperties } from 'react';
import Cookies from 'universal-cookie';
import { WelcomePageParameters } from '../../components/miscComponents/WelcomePage';
import { GlassmorphicContainer } from '../core';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';

const cookies = new Cookies();
const MAX_ATTEMPTS = 10;
const RATE_LIMIT_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

export interface ModernWelcomePageOptions {
  parameters: WelcomePageParameters;
  // Modern UI props
  isDarkMode?: boolean;
  enableGlassmorphism?: boolean;
}

export type ModernWelcomePageType = (options: ModernWelcomePageOptions) => React.JSX.Element;

/**
 * ModernWelcomePage component
 *
 * Premium glassmorphic welcome page with smooth animations and modern styling.
 * Allows users to enter event credentials manually to join an event.
 */
const ModernWelcomePage: React.FC<ModernWelcomePageOptions> = ({
  parameters,
  isDarkMode = false,
}) => {
  const {
    imgSrc = 'https://mediasfu.com/images/logo192.png',
    showAlert,
    updateIsLoadingModalVisible,
    connectSocket,
    updateSocket,
    updateValidated,
    updateApiUserName,
    updateApiToken,
    updateLink,
    updateRoomName,
    updateMember,
  } = parameters;

  // Form state
  const [name, setName] = useState('');
  const [secret, setSecret] = useState('');
  const [eventID, setEventID] = useState('');
  const [link, setLink] = useState('');
  const [pending, setPending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const getGradient = (): string => {
    return isDarkMode
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
  };

  const validateAlphanumeric = (value: string): boolean => {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(value);
  };

  const checkLimitsAndMakeRequest = async ({
    apiUserName,
    apiToken = '',
    link: eventLink,
    userName,
  }: {
    apiUserName: string;
    apiToken?: string;
    link: string;
    userName: string;
  }): Promise<void> => {
    const TIMEOUT_DURATION = 20000;

    let unsuccessfulAttempts = parseInt(cookies.get('unsuccessfulAttempts') || '0', 10);
    const lastRequestTimestamp = parseInt(cookies.get('lastRequestTimestamp') || '0', 10);

    if (unsuccessfulAttempts >= MAX_ATTEMPTS) {
      if (Date.now() - lastRequestTimestamp < RATE_LIMIT_DURATION) {
        showAlert?.({
          message: 'Too many unsuccessful attempts. Please try again later.',
          type: 'danger',
          duration: 3000,
        });
        cookies.set('lastRequestTimestamp', Date.now().toString());
        return;
      } else {
        unsuccessfulAttempts = 0;
        cookies.set('unsuccessfulAttempts', '0');
        cookies.set('lastRequestTimestamp', Date.now().toString());
      }
    }

    try {
      updateIsLoadingModalVisible(true);

      const socketPromise = connectSocket({
        apiUserName,
        apiToken,
        apiKey: '',
        link: eventLink,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Socket connection timed out')), TIMEOUT_DURATION)
      );

      const socket = await Promise.race([socketPromise, timeoutPromise]);

      if (socket && socket.id) {
        unsuccessfulAttempts = 0;
        cookies.set('unsuccessfulAttempts', '0');
        cookies.set('lastRequestTimestamp', Date.now().toString());

        updateSocket(socket);
        updateApiUserName(apiUserName);
        updateApiToken(apiToken);
        updateLink(eventLink);
        updateRoomName(apiUserName);
        updateMember(userName);
        updateValidated(true);
      } else {
        unsuccessfulAttempts++;
        cookies.set('unsuccessfulAttempts', unsuccessfulAttempts.toString());
        cookies.set('lastRequestTimestamp', Date.now().toString());
        updateIsLoadingModalVisible(false);

        if (unsuccessfulAttempts >= MAX_ATTEMPTS) {
          showAlert?.({
            message: 'Too many unsuccessful attempts. Please try again later.',
            type: 'danger',
            duration: 3000,
          });
        } else {
          showAlert?.({
            message: 'Invalid credentials.',
            type: 'danger',
            duration: 3000,
          });
        }
      }
    } catch {
      showAlert?.({
        message: 'Unable to connect. Check your credentials and try again.',
        type: 'danger',
        duration: 3000,
      });

      unsuccessfulAttempts++;
      cookies.set('unsuccessfulAttempts', unsuccessfulAttempts.toString());
      cookies.set('lastRequestTimestamp', Date.now().toString());
      updateIsLoadingModalVisible(false);
    }
  };

  const handleConfirm = async () => {
    if (pending) return;
    setPending(true);
    updateIsLoadingModalVisible(true);

    // Basic validation
    if (!name.trim() || !secret.trim() || !eventID.trim() || !link.trim()) {
      showAlert?.({
        message: 'Please fill all the fields.',
        type: 'danger',
        duration: 3000,
      });
      updateIsLoadingModalVisible(false);
      setPending(false);
      return;
    }

    // Validate format
    if (
      !validateAlphanumeric(name) ||
      !validateAlphanumeric(secret) ||
      !validateAlphanumeric(eventID) ||
      !link.includes('mediasfu.com') ||
      eventID.toLowerCase().startsWith('d')
    ) {
      showAlert?.({
        message: 'Please enter valid details.',
        type: 'danger',
        duration: 3000,
      });
      updateIsLoadingModalVisible(false);
      setPending(false);
      return;
    }

    // Length validation
    if (
      secret.length !== 64 ||
      name.length > 12 ||
      name.length < 2 ||
      eventID.length > 32 ||
      eventID.length < 8 ||
      link.length < 12
    ) {
      showAlert?.({
        message: 'Please enter valid details.',
        type: 'danger',
        duration: 3000,
      });
      updateIsLoadingModalVisible(false);
      setPending(false);
      return;
    }

    await checkLimitsAndMakeRequest({
      apiUserName: eventID,
      apiToken: secret,
      link,
      userName: name,
    });

    updateIsLoadingModalVisible(false);
    setPending(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STYLES
  // ─────────────────────────────────────────────────────────────────────────
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    background: getGradient(),
    padding: MediasfuSpacing.lg,
    boxSizing: 'border-box',
    opacity: isMounted ? 1 : 0,
    transition: 'opacity 0.6s ease-out',
  };

  const formContainerStyle: CSSProperties = {
    width: '100%',
    maxWidth: 400,
    padding: MediasfuSpacing.xl,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: MediasfuSpacing.lg,
  };

  const logoStyle: CSSProperties = {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: MediasfuSpacing.md,
    boxShadow: `0 0 30px ${isDarkMode ? MediasfuColors.primary : MediasfuColors.primaryLight}40`,
  };

  const titleStyle: CSSProperties = {
    ...MediasfuTypography.getHeadlineMedium(isDarkMode),
    textAlign: 'center',
    marginBottom: MediasfuSpacing.sm,
  };

  const subtitleStyle: CSSProperties = {
    ...MediasfuTypography.getBodyMedium(isDarkMode),
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: MediasfuSpacing.md,
  };

  const inputContainerStyle: CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: MediasfuSpacing.md,
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    borderRadius: 12,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
    background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
    color: isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary,
    fontSize: 16,
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    boxSizing: 'border-box',
  };

  const inputFocusStyle: CSSProperties = {
    border: `1px solid ${MediasfuColors.primary}`,
    boxShadow: `0 0 0 3px ${MediasfuColors.primary}30`,
  };

  const buttonStyle: CSSProperties = {
    width: '100%',
    padding: `${MediasfuSpacing.md}px ${MediasfuSpacing.lg}px`,
    borderRadius: 12,
    border: 'none',
    background: `linear-gradient(135deg, ${MediasfuColors.primary} 0%, ${MediasfuColors.secondary} 100%)`,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600,
    cursor: pending ? 'not-allowed' : 'pointer',
    opacity: pending ? 0.7 : 1,
    transition: 'transform 0.2s ease, box-shadow 0.3s ease, opacity 0.3s ease',
    boxShadow: `0 4px 20px ${MediasfuColors.primary}40`,
  };

  const footerStyle: CSSProperties = {
    ...MediasfuTypography.getBodySmall(isDarkMode),
    textAlign: 'center',
    marginTop: MediasfuSpacing.lg,
    opacity: 0.6,
  };

  const linkStyle: CSSProperties = {
    color: MediasfuColors.primary,
    textDecoration: 'none',
    fontWeight: 500,
  };

  const getInputStyle = (fieldName: string): CSSProperties => ({
    ...inputStyle,
    ...(focusedField === fieldName ? inputFocusStyle : {}),
  });

  return (
    <div style={containerStyle}>
      <GlassmorphicContainer
        isDarkMode={isDarkMode}
        style={formContainerStyle}
      >
        <img src={imgSrc} alt="MediaSFU Logo" style={logoStyle} />

        <h1 style={titleStyle}>Welcome to MediaSFU</h1>
        <p style={subtitleStyle}>Enter your event details to join</p>

        <div style={inputContainerStyle}>
          <input
            type="text"
            placeholder="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={getInputStyle('name')}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            maxLength={12}
            disabled={pending}
          />

          <input
            type="text"
            placeholder="Event ID"
            value={eventID}
            onChange={(e) => setEventID(e.target.value)}
            style={getInputStyle('eventID')}
            onFocus={() => setFocusedField('eventID')}
            onBlur={() => setFocusedField(null)}
            maxLength={32}
            disabled={pending}
          />

          <input
            type="password"
            placeholder="Event Passcode"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            style={getInputStyle('secret')}
            onFocus={() => setFocusedField('secret')}
            onBlur={() => setFocusedField(null)}
            maxLength={64}
            disabled={pending}
          />

          <input
            type="text"
            placeholder="Event Link (e.g., https://mediasfu.com/...)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            style={getInputStyle('link')}
            onFocus={() => setFocusedField('link')}
            onBlur={() => setFocusedField(null)}
            disabled={pending}
          />
        </div>

        <button
          onClick={handleConfirm}
          disabled={pending}
          style={buttonStyle}
          onMouseEnter={(e) => {
            if (!pending) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 24px ${MediasfuColors.primary}50`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 4px 20px ${MediasfuColors.primary}40`;
          }}
        >
          {pending ? 'Connecting...' : 'Join Event'}
        </button>

        <p style={footerStyle}>
          Powered by{' '}
          <a
            href="https://mediasfu.com"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            MediaSFU
          </a>
        </p>
      </GlassmorphicContainer>
    </div>
  );
};

export default ModernWelcomePage;
export { ModernWelcomePage };
