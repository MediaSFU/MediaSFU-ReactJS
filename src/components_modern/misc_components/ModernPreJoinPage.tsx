/**
 * ModernPreJoinPage - Modern glassmorphic pre-join page for MediaSFU events.
 *
 * A premium redesigned pre-join page with glassmorphism effects
 * and dark/light mode support. Allows users to create or join events.
 * 
 * IMPORTANT: This component has identical business logic to PreJoinPage.
 * Only the UI layer is modernized; all callbacks and socket logic remain unchanged.
 *
 * @module ModernPreJoinPage
 */

import React, { useState, useEffect, useRef, useCallback, CSSProperties } from 'react';
import {
  CreateMediaSFURoomOptions,
  JoinMediaSFURoomOptions,
  ResponseLocalConnection,
  ResponseLocalConnectionData,
} from '../../@types/types';
import { 
  PreJoinPageParameters, 
  Credentials,
  CreateLocalRoomParameters,
  JoinLocalEventRoomParameters,
  CreateJoinLocalRoomResponse,
  CreateLocalRoomOptions,
  JoinLocalEventRoomOptions,
} from '../../components/miscComponents/PreJoinPage';
import { checkLimitsAndMakeRequest } from '../../methods/utils/checkLimitsAndMakeRequest';
import { createRoomOnMediaSFU } from '../../methods/utils/createRoomOnMediaSFU';
import { CreateRoomOnMediaSFUType, JoinRoomOnMediaSFUType, joinRoomOnMediaSFU } from '../../methods/utils/joinRoomOnMediaSFU';
import { Socket } from 'socket.io-client';
import { GlassmorphicContainer } from '../core';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';

export interface ModernPreJoinPageOptions {
  localLink?: string;
  connectMediaSFU?: boolean;
  parameters: PreJoinPageParameters;
  credentials?: Credentials;
  returnUI?: boolean;
  noUIPreJoinOptions?: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
  createMediaSFURoom?: CreateRoomOnMediaSFUType;
  joinMediaSFURoom?: JoinRoomOnMediaSFUType;
  // Modern UI props
  isDarkMode?: boolean;
}

export type ModernPreJoinPageType = (options: ModernPreJoinPageOptions) => React.JSX.Element;

/**
 * ModernPreJoinPage component
 *
 * Premium glassmorphic pre-join page with smooth animations and modern styling.
 * Allows users to create a new event or join an existing one.
 * 
 * This component maintains 100% business logic parity with the original PreJoinPage.
 */
const ModernPreJoinPage: React.FC<ModernPreJoinPageOptions> = ({
  localLink = '',
  connectMediaSFU = true,
  parameters,
  credentials = { apiUserName: '', apiKey: '' },
  returnUI = true,
  noUIPreJoinOptions,
  createMediaSFURoom = createRoomOnMediaSFU,
  joinMediaSFURoom = joinRoomOnMediaSFU,
  isDarkMode: initialDarkMode = true,
}) => {
  // Internal theme state (can be toggled by user)
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  const {
    imgSrc = 'https://mediasfu.com/images/logo192.png',
    showAlert,
    updateIsLoadingModalVisible,
    connectLocalSocket,
    updateSocket,
    updateLocalSocket,
    updateValidated,
    updateApiUserName,
    updateApiToken,
    updateLink,
    updateRoomName,
    updateMember,
  } = parameters;

  // Form state
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [eventType, setEventType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [eventID, setEventID] = useState('');
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const pending = useRef(false);

  // Local connection state (using refs like original)
  const localConnected = useRef(false);
  const localData = useRef<ResponseLocalConnectionData | undefined>(undefined);
  const initSocket = useRef<Socket | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // BUSINESS LOGIC (copied from original PreJoinPage)
  // ─────────────────────────────────────────────────────────────────────────

  const joinLocalRoom = async ({
    joinData,
    link = localLink,
  }: JoinLocalEventRoomOptions) => {
    initSocket.current?.emit(
      'joinEventRoom',
      joinData,
      (response: CreateJoinLocalRoomResponse) => {
        if (response.success) {
          updateSocket(initSocket.current!);
          updateApiUserName(localData.current?.apiUserName || '');
          updateApiToken(response.secret);
          updateLink(link);
          updateRoomName(joinData.eventID);
          updateMember(joinData.userName);
          updateIsLoadingModalVisible(false);
          updateValidated(true);
        } else {
          updateIsLoadingModalVisible(false);
          setError(`Unable to join room. ${response.reason}`);
        }
      }
    );
  };

  const createLocalRoom = async ({
    createData,
    link = localLink,
  }: CreateLocalRoomOptions) => {
    initSocket.current?.emit(
      'createRoom',
      createData,
      (response: CreateJoinLocalRoomResponse) => {
        if (response.success) {
          updateSocket(initSocket.current!);
          updateApiUserName(localData.current?.apiUserName || '');
          updateApiToken(response.secret);
          updateLink(link);
          updateRoomName(createData.eventID);
          updateMember(createData.userName + '_2');
          updateIsLoadingModalVisible(false);
          updateValidated(true);
        } else {
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room. ${response.reason}`);
        }
      }
    );
  };

  const roomCreator = async ({
    payload,
    apiUserName,
    apiKey,
    validate = true,
  }: {
    payload: CreateMediaSFURoomOptions;
    apiUserName: string;
    apiKey: string;
    validate?: boolean;
  }) => {
    const response = await createMediaSFURoom({
      payload,
      apiUserName: apiUserName,
      apiKey: apiKey,
      localLink: localLink,
    });
    if (response.success && response.data && 'roomName' in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response.data.link,
        userName: payload.userName,
        parameters: parameters,
        validate: validate,
      });
      return response;
    } else {
      updateIsLoadingModalVisible(false);
      setError(
        `Unable to create room. ${
          response.data
            ? 'error' in response.data
              ? response.data.error
              : ''
            : ''
        }`
      );
    }
  };

  const handleCreateRoom = async () => {
    if (pending.current) {
      return;
    }
    pending.current = true;
    setError('');
    
    let payload = {} as CreateMediaSFURoomOptions;
    if (returnUI) {
      if (!name || !duration || !eventType || !capacity) {
        setError('Please fill all the fields.');
        pending.current = false;
        return;
      }
      
      if (!['chat', 'broadcast', 'webinar', 'conference'].includes(eventType.toLowerCase())) {
        setError('Invalid event type. Please select from Chat, Broadcast, Webinar, or Conference.');
        pending.current = false;
        return;
      }

      const capacityInt = parseInt(capacity, 10);
      const durationInt = parseInt(duration, 10);

      if (isNaN(capacityInt) || capacityInt <= 0) {
        setError('Room capacity must be a positive integer.');
        pending.current = false;
        return;
      }

      if (isNaN(durationInt) || durationInt <= 0) {
        setError('Duration must be a positive integer.');
        pending.current = false;
        return;
      }

      if (name.length < 2 || name.length > 10) {
        setError('Display Name must be between 2 and 10 characters.');
        pending.current = false;
        return;
      }

      payload = {
        action: 'create',
        duration: durationInt,
        capacity: capacityInt,
        eventType: eventType as 'chat' | 'broadcast' | 'webinar' | 'conference',
        userName: name,
        recordOnly: false,
      };
    } else {
      if (
        noUIPreJoinOptions &&
        'action' in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === 'create'
      ) {
        payload = noUIPreJoinOptions as CreateMediaSFURoomOptions;
      } else {
        pending.current = false;
        throw new Error('Invalid options provided for creating a room without UI.');
      }
    }

    updateIsLoadingModalVisible(true);

    if (localLink.length > 0) {
      const secureCode =
        Math.random().toString(30).substring(2, 14) +
        Math.random().toString(30).substring(2, 14);
      let generatedEventID =
        new Date().getTime().toString(30) +
        new Date().getUTCMilliseconds() +
        Math.floor(10 + Math.random() * 99).toString();
      generatedEventID = 'm' + generatedEventID;
      const eventRoomParams = localData.current?.meetingRoomParams_;
      if (eventRoomParams) {
        eventRoomParams.type = eventType as 'chat' | 'broadcast' | 'webinar' | 'conference';
      }

      const createData: CreateLocalRoomParameters = {
        eventID: generatedEventID,
        duration: payload.duration,
        capacity: payload.capacity,
        userName: payload.userName,
        scheduledDate: new Date(),
        secureCode: secureCode,
        waitRoom: false,
        recordingParams: localData.current?.recordingParams_,
        eventRoomParams: eventRoomParams,
        videoPreference: null,
        audioPreference: null,
        audioOutputPreference: null,
        mediasfuURL: '',
      };

      if (
        connectMediaSFU &&
        initSocket.current &&
        localData.current &&
        localData.current.apiUserName &&
        localData.current.apiKey
      ) {
        const apiUserName = localData.current.apiUserName;
        const apiKey = localData.current.apiKey;

        const roomIdentifier = `local_create_${payload.userName}_${payload.duration}_${payload.capacity}`;
        const pendingKey = `prejoin_pending_${roomIdentifier}`;
        const PENDING_TIMEOUT = 30 * 1000;

        try {
          const pendingRequest = localStorage.getItem(pendingKey);
          if (pendingRequest) {
            const pendingData = JSON.parse(pendingRequest);
            const timeSincePending = Date.now() - (pendingData?.timestamp ?? 0);
            if (timeSincePending < PENDING_TIMEOUT) {
              pending.current = false;
              updateIsLoadingModalVisible(false);
              setError('Room creation already in progress');
              return;
            } else {
              try {
                localStorage.removeItem(pendingKey);
              } catch {
                // Ignore localStorage errors
              }
            }
          }
        } catch {
          // Ignore localStorage read/JSON errors
        }

        try {
          localStorage.setItem(
            pendingKey,
            JSON.stringify({
              timestamp: Date.now(),
              payload: {
                action: 'create',
                userName: payload.userName,
                duration: payload.duration,
                capacity: payload.capacity,
              },
            })
          );

          setTimeout(() => {
            try {
              localStorage.removeItem(pendingKey);
            } catch {
              // Ignore localStorage errors
            }
          }, PENDING_TIMEOUT);
        } catch {
          // Ignore localStorage write errors
        }

        payload.recordOnly = true;

        try {
          const response = await roomCreator({
            payload,
            apiUserName: apiUserName,
            apiKey: apiKey,
            validate: false,
          });

          try {
            localStorage.removeItem(pendingKey);
          } catch {
            /* ignore */
          }

          if (response && response.success && response.data && 'roomName' in response.data) {
            createData.eventID = response.data.roomName;
            createData.secureCode = response.data.secureCode || '';
            createData.mediasfuURL = response.data.publicURL;
            await createLocalRoom({
              createData: createData,
              link: response.data.link,
            });
          } else {
            pending.current = false;
            updateIsLoadingModalVisible(false);
            setError('Unable to create room on MediaSFU.');
            try {
              updateSocket(initSocket.current!);
              await createLocalRoom({ createData: createData });
              pending.current = false;
            } catch (error) {
              pending.current = false;
              updateIsLoadingModalVisible(false);
              setError(`Unable to create room. ${error}`);
            }
          }
        } catch (error) {
          try {
            localStorage.removeItem(pendingKey);
          } catch {
            /* ignore */
          }
          pending.current = false;
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room on MediaSFU. ${error}`);
        }
      } else {
        try {
          updateSocket(initSocket.current!);
          await createLocalRoom({ createData: createData });
          pending.current = false;
        } catch (error) {
          pending.current = false;
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room. ${error}`);
        }
      }
    } else {
      // Non-local room creation
      const roomIdentifier = `mediasfu_create_${payload.userName}_${payload.duration}_${payload.capacity}`;
      const pendingKey = `prejoin_pending_${roomIdentifier}`;
      const PENDING_TIMEOUT = 30 * 1000;

      try {
        const pendingRequest = localStorage.getItem(pendingKey);
        if (pendingRequest) {
          const pendingData = JSON.parse(pendingRequest);
          const timeSincePending = Date.now() - (pendingData?.timestamp ?? 0);
          if (timeSincePending < PENDING_TIMEOUT) {
            pending.current = false;
            updateIsLoadingModalVisible(false);
            setError('Room creation already in progress');
            return;
          } else {
            try {
              localStorage.removeItem(pendingKey);
            } catch {
              // Ignore localStorage errors
            }
          }
        }
      } catch {
        // Ignore localStorage read/JSON errors
      }

      try {
        localStorage.setItem(
          pendingKey,
          JSON.stringify({
            timestamp: Date.now(),
            payload: {
              action: 'create',
              userName: payload.userName,
              duration: payload.duration,
              capacity: payload.capacity,
            },
          })
        );

        setTimeout(() => {
          try {
            localStorage.removeItem(pendingKey);
          } catch {
            // Ignore localStorage errors
          }
        }, PENDING_TIMEOUT);
      } catch {
        // Ignore localStorage write errors
      }

      try {
        await roomCreator({
          payload,
          apiUserName: credentials.apiUserName,
          apiKey: credentials.apiKey,
          validate: true,
        });

        try {
          localStorage.removeItem(pendingKey);
        } catch {
          /* ignore */
        }

        pending.current = false;
      } catch (error) {
        try {
          localStorage.removeItem(pendingKey);
        } catch {
          /* ignore */
        }
        pending.current = false;
        updateIsLoadingModalVisible(false);
        setError(`Unable to create room. ${error}`);
      }
    }
  };

  const handleJoinRoom = async () => {
    if (pending.current) {
      return;
    }
    pending.current = true;
    setError('');
    
    let payload = {} as JoinMediaSFURoomOptions;
    if (returnUI) {
      if (!name || !eventID) {
        setError('Please fill all the fields.');
        pending.current = false;
        return;
      }

      if (name.length < 2 || name.length > 10) {
        setError('Display Name must be between 2 and 10 characters.');
        pending.current = false;
        return;
      }

      payload = {
        action: 'join',
        meetingID: eventID,
        userName: name,
      };
    } else {
      if (
        noUIPreJoinOptions &&
        'action' in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === 'join'
      ) {
        payload = noUIPreJoinOptions as JoinMediaSFURoomOptions;
      } else {
        pending.current = false;
        throw new Error('Invalid options provided for joining a room without UI.');
      }
    }

    if (localLink.length > 0 && !localLink.includes('mediasfu.com')) {
      const joinData: JoinLocalEventRoomParameters = {
        eventID: payload.meetingID,
        userName: payload.userName,
        secureCode: '',
        videoPreference: null,
        audioPreference: null,
        audioOutputPreference: null,
      };

      await joinLocalRoom({ joinData: joinData });
      pending.current = false;
      return;
    }

    updateIsLoadingModalVisible(true);

    const response = await joinMediaSFURoom({
      payload,
      apiUserName: credentials.apiUserName,
      apiKey: credentials.apiKey,
      localLink: localLink,
    });
    
    if (response.success && response.data && 'roomName' in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response.data.link,
        userName: payload.userName,
        parameters: parameters,
      });
      pending.current = false;
    } else {
      pending.current = false;
      updateIsLoadingModalVisible(false);
      setError(
        `Unable to join room. ${
          response.data
            ? 'error' in response.data
              ? response.data.error
              : ''
            : ''
        }`
      );
    }
  };

  const checkProceed = useCallback(async ({
    returnUI: proceedReturnUI,
    noUIPreJoinOptions: proceedOptions,
  }: {
    returnUI: boolean;
    noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
  }) => {
    if (!proceedReturnUI && proceedOptions) {
      if ('action' in proceedOptions && proceedOptions.action === 'create') {
        const createOptions = proceedOptions as CreateMediaSFURoomOptions;
        if (
          !createOptions.userName ||
          !createOptions.duration ||
          !createOptions.eventType ||
          !createOptions.capacity
        ) {
          throw new Error(
            'Please provide all the required parameters: userName, duration, eventType, capacity'
          );
        }
        await handleCreateRoom();
      } else if ('action' in proceedOptions && proceedOptions.action === 'join') {
        const joinOptions = proceedOptions as JoinMediaSFURoomOptions;
        if (!joinOptions.userName || !joinOptions.meetingID) {
          throw new Error(
            'Please provide all the required parameters: userName, meetingID'
          );
        }
        await handleJoinRoom();
      } else {
        throw new Error('Invalid options provided for creating/joining a room without UI.');
      }
    }
  }, []);

  // Connect to local socket if localLink is provided
  useEffect(() => {
    if (localLink.length > 0 && !localConnected.current && !initSocket.current) {
      try {
        connectLocalSocket?.({ link: localLink })
          .then((response: ResponseLocalConnection | undefined) => {
            if (response && response.socket) {
              localData.current = response.data;
              initSocket.current = response.socket;
              localConnected.current = true;
              updateSocket(response.socket);
              updateLocalSocket?.(response.socket);

              if (!returnUI && noUIPreJoinOptions) {
                checkProceed({ returnUI, noUIPreJoinOptions });
              }
            }
          })
          .catch((error) => {
            showAlert?.({
              message: `Unable to connect to ${localLink}. ${error}`,
              type: 'danger',
              duration: 3000,
            });
          });
      } catch {
        showAlert?.({
          message: `Unable to connect to ${localLink}. Something went wrong.`,
          type: 'danger',
          duration: 3000,
        });
      }
    } else if (localLink.length === 0 && !initSocket.current) {
      if (!returnUI && noUIPreJoinOptions) {
        checkProceed({ returnUI, noUIPreJoinOptions });
      }
    }
  }, []);

  const handleToggleMode = useCallback(() => {
    setIsCreateMode((prev) => !prev);
    setError('');
  }, []);

  // Don't render UI if returnUI is false
  if (!returnUI) {
    return <></>;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MODERN UI - STYLES (matching Flutter's color scheme)
  // ─────────────────────────────────────────────────────────────────────────

  // Background gradient matching Flutter:
  // Dark: [Color(0xFF0F172A), Color(0xFF1E1B4B)] - dark slate/indigo
  // Light: [Color(0xFFE0E7FF), Color(0xFFF8FAFC)] - light indigo/white
  const getGradient = (): string => {
    return isDarkMode
      ? 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)'
      : 'linear-gradient(135deg, #E0E7FF 0%, #F8FAFC 100%)';
  };

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
    maxWidth: 420,
    padding: MediasfuSpacing.xl,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: MediasfuSpacing.md,
  };

  const logoContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: MediasfuSpacing.sm,
    padding: 3,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary} 0%, ${isDarkMode ? MediasfuColors.secondaryDarkMode : MediasfuColors.secondary} 50%, ${isDarkMode ? MediasfuColors.accentDark : MediasfuColors.accent} 100%)`,
    boxShadow: `0 0 20px ${MediasfuColors.primary}66, 0 0 40px ${MediasfuColors.primary}33`,
  };

  const logoStyle: CSSProperties = {
    width: 90,
    height: 90,
    borderRadius: '50%',
    objectFit: 'cover',
  };

  const titleStyle: CSSProperties = {
    ...MediasfuTypography.getHeadlineMedium(isDarkMode),
    textAlign: 'center',
    marginBottom: MediasfuSpacing.xs,
  };

  const subtitleStyle: CSSProperties = {
    ...MediasfuTypography.getBodyMedium(isDarkMode),
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: MediasfuSpacing.md,
  };

  const inputContainerStyle: CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: MediasfuSpacing.sm,
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

  const selectStyle: CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${isDarkMode ? '%23ffffff' : '%23333333'}' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px',
    paddingRight: 36,
  };

  // Style for select options (injected via style tag)
  const selectOptionStyle = `
    select option {
      background: ${isDarkMode ? '#1a1a2e' : '#ffffff'};
      color: ${isDarkMode ? '#ffffff' : '#1a1a2e'};
      padding: 12px;
      font-size: 14px;
    }
    select option:hover,
    select option:focus,
    select option:checked {
      background: ${isDarkMode ? '#2d2d44' : '#f0f0f5'};
      color: ${MediasfuColors.primary};
    }
  `;

  const buttonStyle: CSSProperties = {
    width: '100%',
    padding: `${MediasfuSpacing.md}px ${MediasfuSpacing.lg}px`,
    borderRadius: 12,
    border: 'none',
    background: `linear-gradient(135deg, ${MediasfuColors.primary} 0%, ${MediasfuColors.secondary} 100%)`,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600,
    cursor: pending.current ? 'not-allowed' : 'pointer',
    opacity: pending.current ? 0.7 : 1,
    transition: 'transform 0.2s ease, box-shadow 0.3s ease, opacity 0.3s ease',
    boxShadow: `0 4px 20px ${MediasfuColors.primary}40`,
    marginTop: MediasfuSpacing.sm,
  };

  const errorStyle: CSSProperties = {
    ...MediasfuTypography.getBodyMedium(isDarkMode),
    color: MediasfuColors.danger,
    textAlign: 'center',
    marginTop: MediasfuSpacing.sm,
  };

  const orStyle: CSSProperties = {
    ...MediasfuTypography.getLabelLarge(isDarkMode),
    textAlign: 'center',
    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
    margin: `${MediasfuSpacing.sm}px 0`,
  };

  const switchButtonContainerStyle: CSSProperties = {
    borderRadius: 12,
    border: `1px solid ${isDarkMode ? `${MediasfuColors.primaryDark}80` : `${MediasfuColors.primary}4D`}`,
    overflow: 'hidden',
  };

  const switchButtonStyle: CSSProperties = {
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: 'transparent',
    border: 'none',
    cursor: pending.current ? 'not-allowed' : 'pointer',
    fontSize: 14,
    fontWeight: 600,
    backgroundImage: `linear-gradient(135deg, ${isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary} 0%, ${isDarkMode ? MediasfuColors.secondaryDarkMode : MediasfuColors.secondary} 50%, ${isDarkMode ? MediasfuColors.accentDark : MediasfuColors.accent} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    transition: 'opacity 0.3s ease',
  };

  const getInputStyle = (fieldName: string): CSSProperties => ({
    ...inputStyle,
    ...(focusedField === fieldName
      ? {
          border: `1px solid ${MediasfuColors.primary}`,
          boxShadow: `0 0 0 3px ${MediasfuColors.primary}30`,
        }
      : {}),
  });

  return (
    <div style={containerStyle}>
      {/* Inject custom option styles */}
      <style>{selectOptionStyle}</style>
      
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 48,
          height: 48,
          borderRadius: 12,
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
          background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          transition: 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(0,0,0,0.3)' 
            : '0 4px 20px rgba(0,0,0,0.1)',
          zIndex: 100,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)';
          e.currentTarget.style.boxShadow = isDarkMode 
            ? '0 6px 24px rgba(102, 126, 234, 0.4)' 
            : '0 6px 24px rgba(102, 126, 234, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          e.currentTarget.style.boxShadow = isDarkMode 
            ? '0 4px 20px rgba(0,0,0,0.3)' 
            : '0 4px 20px rgba(0,0,0,0.1)';
        }}
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <GlassmorphicContainer
        isDarkMode={isDarkMode}
        style={formContainerStyle}
      >
        {/* Logo with gradient ring */}
        <div style={logoContainerStyle}>
          <img src={imgSrc} alt="MediaSFU Logo" style={logoStyle} />
        </div>

        <h1 style={titleStyle}>
          {isCreateMode ? 'Create a Room' : 'Join a Room'}
        </h1>
        <p style={subtitleStyle}>
          {isCreateMode
            ? 'Start a new session with your audience.'
            : 'Enter the meeting ID to connect.'}
        </p>

        {/* Form Container */}
        <div style={inputContainerStyle}>
          <input
            type="text"
            placeholder="Display Name (2-10 characters)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={getInputStyle('name')}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            maxLength={10}
            disabled={pending.current}
          />

          {isCreateMode ? (
            <>
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={getInputStyle('duration')}
                onFocus={() => setFocusedField('duration')}
                onBlur={() => setFocusedField(null)}
                min={1}
                disabled={pending.current}
              />

              <input
                type="number"
                placeholder="Capacity (max participants)"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                style={getInputStyle('capacity')}
                onFocus={() => setFocusedField('capacity')}
                onBlur={() => setFocusedField(null)}
                min={1}
                disabled={pending.current}
              />

              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                style={{ ...selectStyle, ...(focusedField === 'eventType' ? { border: `1px solid ${MediasfuColors.primary}` } : {}) }}
                onFocus={() => setFocusedField('eventType')}
                onBlur={() => setFocusedField(null)}
                disabled={pending.current}
              >
                <option value="">Select Event Type</option>
                <option value="chat">Chat</option>
                <option value="broadcast">Broadcast</option>
                <option value="webinar">Webinar</option>
                <option value="conference">Conference</option>
              </select>
            </>
          ) : (
            <input
              type="text"
              placeholder="Meeting ID"
              value={eventID}
              onChange={(e) => setEventID(e.target.value)}
              style={getInputStyle('eventID')}
              onFocus={() => setFocusedField('eventID')}
              onBlur={() => setFocusedField(null)}
              disabled={pending.current}
            />
          )}
        </div>

        {error && <p style={errorStyle}>{error}</p>}

        <button
          onClick={isCreateMode ? handleCreateRoom : handleJoinRoom}
          disabled={pending.current}
          style={buttonStyle}
          onMouseEnter={(e) => {
            if (!pending.current) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 24px ${MediasfuColors.primary}50`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 4px 20px ${MediasfuColors.primary}40`;
          }}
        >
          {pending.current
            ? 'Please wait...'
            : isCreateMode
              ? 'Create Room'
              : 'Join Room'}
        </button>

        <p style={orStyle}>OR</p>

        <div style={switchButtonContainerStyle}>
          <button
            onClick={handleToggleMode}
            disabled={pending.current}
            style={switchButtonStyle}
          >
            {isCreateMode ? 'Switch to Join Mode' : 'Switch to Create Mode'}
          </button>
        </div>
      </GlassmorphicContainer>
    </div>
  );
};

export default ModernPreJoinPage;
export { ModernPreJoinPage };
