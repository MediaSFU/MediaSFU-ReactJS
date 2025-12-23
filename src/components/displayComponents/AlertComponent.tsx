
import React, { useEffect, useState } from 'react';

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(' ').trim();
  return filtered.length > 0 ? filtered : undefined;
};

export interface AlertComponentOptions {
  visible: boolean;
  message: string;
  type?: 'success' | 'danger' | 'info' | 'warning';
  duration?: number;
  onHide?: () => void;
  textColor?: string;
  position?: 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'; // Position for modern alert
  overlayProps?: React.HTMLAttributes<HTMLDivElement>;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  messageProps?: React.HTMLAttributes<HTMLParagraphElement>;
  renderMessage?: (options: {
    defaultMessage: React.ReactNode;
  }) => React.ReactNode;
  renderContent?: (options: {
    defaultContent: React.ReactNode;
  }) => React.ReactNode;
}

export type AlertComponentType = (options: AlertComponentOptions) => React.JSX.Element;

/**
 * AlertComponent - Toast-style notification system
 * 
 * A lightweight, auto-dismissing alert component for displaying success/error messages
 * to users. Supports custom durations, click-to-dismiss, and automatic fade-out animations.
 * 
 * Features:
 * - Success (green) and danger (red) alert types
 * - Auto-dismiss after configurable duration
 * - Click-to-dismiss functionality
 * - Smooth fade-in/fade-out transitions
 * - Fixed top-center positioning
 * - Custom render hooks for complete flexibility
 * - onHide callback for cleanup logic
 * 
 * @component
 * @param {AlertComponentOptions} options - Configuration options
 * @param {boolean} options.visible - Controls alert visibility
 * @param {string} options.message - Alert message text
 * @param {'success'|'danger'} [options.type='success'] - Alert type (success=green, danger=red)
 * @param {number} [options.duration=4000] - Auto-dismiss duration in milliseconds
 * @param {Function} [options.onHide] - Callback when alert is hidden
 * @param {string} [options.textColor='black'] - Message text color
 * @param {object} [options.overlayProps] - HTML attributes for overlay div
 * @param {object} [options.containerProps] - HTML attributes for alert container
 * @param {object} [options.messageProps] - HTML attributes for message paragraph
 * @param {Function} [options.renderMessage] - Custom message renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 * 
 * @returns {React.JSX.Element} Rendered alert component
 * 
 * @example
 * // Basic success alert
 * ```tsx
 * import React, { useState } from 'react';
 * import { AlertComponent } from 'mediasfu-reactjs';
 * 
 * function App() {
 *   const [showAlert, setShowAlert] = useState(false);
 * 
 *   const handleAction = async () => {
 *     await saveData();
 *     setShowAlert(true);
 *   };
 * 
 *   return (
 *     <>
 *       <button onClick={handleAction}>Save</button>
 *       <AlertComponent
 *         visible={showAlert}
 *         message="Data saved successfully!"
 *         type="success"
 *         duration={3000}
 *         onHide={() => setShowAlert(false)}
 *         textColor="white"
 *       />
 *     </>
 *   );
 * }
 * ```
 * 
 * @example
 * // Error alert with custom styling
 * ```tsx
 * import { AlertComponent } from 'mediasfu-reactjs';
 * 
 * function ErrorNotification({ visible, message, onHide }) {
 *   return (
 *     <AlertComponent
 *       visible={visible}
 *       message={message}
 *       type="danger"
 *       duration={5000}
 *       onHide={onHide}
 *       textColor="#ffffff"
 *       containerProps={{
 *         style: {
 *           borderRadius: 12,
 *           padding: '16px 24px',
 *           boxShadow: '0 10px 40px rgba(220,38,38,0.4)',
 *           border: '2px solid #dc2626',
 *         },
 *       }}
 *       messageProps={{
 *         style: {
 *           fontSize: 16,
 *           fontWeight: 600,
 *         },
 *       }}
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Custom alert with icon and action button
 * ```tsx
 * import { AlertComponent } from 'mediasfu-reactjs';
 * 
 * function CustomAlert({ visible, message, type, onHide, onAction }) {
 *   return (
 *     <AlertComponent
 *       visible={visible}
 *       message={message}
 *       type={type}
 *       duration={6000}
 *       onHide={onHide}
 *       renderContent={({ defaultContent }) => (
 *         <div style={{
 *           background: type === 'success' ? '#22c55e' : '#dc2626',
 *           padding: '16px 24px',
 *           borderRadius: 12,
 *           boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
 *           display: 'flex',
 *           alignItems: 'center',
 *           gap: 12,
 *           maxWidth: 500,
 *         }}>
 *           <span style={{ fontSize: 24 }}>
 *             {type === 'success' ? '✅' : '❌'}
 *           </span>
 *           <p style={{ flex: 1, color: 'white', margin: 0, fontWeight: 500 }}>
 *             {message}
 *           </p>
 *           {onAction && (
 *             <button
 *               onClick={(e) => {
 *                 e.stopPropagation();
 *                 onAction();
 *               }}
 *               style={{
 *                 background: 'rgba(255,255,255,0.2)',
 *                 color: 'white',
 *                 border: '1px solid white',
 *                 padding: '6px 12px',
 *                 borderRadius: 6,
 *                 cursor: 'pointer',
 *                 fontWeight: 600,
 *               }}
 *             >
 *               Undo
 *             </button>
 *           )}
 *         </div>
 *       )}
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, AlertComponent } from 'mediasfu-reactjs';
 * 
 * const uiOverrides = {
 *   alert: {
 *     render: (props) => (
 *       <AlertComponent
 *         {...props}
 *         duration={5000}
 *         containerProps={{
 *           style: {
 *             borderRadius: 16,
 *             padding: '18px 28px',
 *             boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
 *             border: props.type === 'success'
 *               ? '2px solid #22c55e'
 *               : '2px solid #dc2626',
 *           },
 *         }}
 *         textColor="#ffffff"
 *       />
 *     ),
 *   },
 * };
 * 
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
 */
const AlertComponent: React.FC<AlertComponentOptions> = ({
  visible,
  message,
  type = 'success',
  duration = 4000,
  onHide,
  textColor = 'black',
  overlayProps,
  containerProps,
  messageProps,
  renderMessage,
  renderContent,
}) => {
  const [alertType, setAlertType] = useState<'success' | 'danger' | 'info' | 'warning'>(type);

  useEffect(() => {
    if (type) {
      setAlertType(type);
    }
  }, [type]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (visible && duration > 0) {
      timer = setTimeout(() => {
        onHide?.();
      }, duration);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [visible, duration, onHide]);

  const handleDismiss: React.MouseEventHandler<HTMLDivElement> = (event) => {
    containerProps?.onClick?.(event);
    if (!event.defaultPrevented) {
      onHide?.();
    }
  };

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    onClick: overlayOnClick,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = joinClassNames('mediasfu-alert__overlay', overlayClassName);

  const overlayStyle: React.CSSProperties = {
    display: visible ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    padding: 16,
    ...overlayStyleOverrides,
  };

  const {
    className: containerClassName,
    style: containerStyleOverrides,
    ...restContainerProps
  } = containerProps ?? {};

  const containerClassNames = joinClassNames(
    'mediasfu-alert__container',
    'modalView',
    containerClassName
  );

  const containerStyle: React.CSSProperties = {
    backgroundColor: alertType === 'success' ? '#16a34a' : '#dc2626',
    borderRadius: 12,
    padding: '20px 24px',
    maxWidth: 420,
    width: '100%',
    boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
    color: textColor,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    ...containerStyleOverrides,
  };

  const {
    className: messageClassName,
    style: messageStyleOverrides,
    ...restMessageProps
  } = messageProps ?? {};

  const messageClassNames = joinClassNames('mediasfu-alert__message', 'modalText', messageClassName);

  const messageStyle: React.CSSProperties = {
    margin: 0,
    color: textColor,
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.4,
    ...messageStyleOverrides,
  };

  const defaultMessage = (
    <p className={messageClassNames} style={messageStyle} {...restMessageProps}>
      {message}
    </p>
  );

  const messageNode = renderMessage ? renderMessage({ defaultMessage }) : defaultMessage;

  const defaultContent = (
    <div
      role="alert"
      aria-live={alertType === 'danger' ? 'assertive' : 'polite'}
      className={containerClassNames}
      style={containerStyle}
      onClick={handleDismiss}
      {...restContainerProps}
    >
      {messageNode}
    </div>
  );

  const contentNode = renderContent
    ? renderContent({ defaultContent })
    : defaultContent;

  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    overlayOnClick?.(event);
    if (!event.defaultPrevented && event.target === event.currentTarget) {
      onHide?.();
    }
  };

  return (
    <div
      className={overlayClassNames}
      style={overlayStyle}
      onClick={handleOverlayClick}
      {...restOverlayProps}
    >
      {contentNode}
    </div>
  );
};

export default AlertComponent;
