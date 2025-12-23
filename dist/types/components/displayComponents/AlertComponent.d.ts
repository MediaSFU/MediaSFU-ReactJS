import React from 'react';
export interface AlertComponentOptions {
    visible: boolean;
    message: string;
    type?: 'success' | 'danger' | 'info' | 'warning';
    duration?: number;
    onHide?: () => void;
    textColor?: string;
    position?: 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
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
declare const AlertComponent: React.FC<AlertComponentOptions>;
export default AlertComponent;
//# sourceMappingURL=AlertComponent.d.ts.map