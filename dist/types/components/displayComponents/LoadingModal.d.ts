import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
export interface LoadingModalOptions {
    isVisible: boolean;
    backgroundColor?: string;
    displayColor?: string;
    loadingText?: React.ReactNode;
    showSpinner?: boolean;
    spinnerIcon?: IconDefinition;
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    spinnerWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    spinnerProps?: React.ComponentProps<typeof FontAwesomeIcon>;
    textProps?: React.HTMLAttributes<HTMLDivElement>;
    renderSpinner?: (options: {
        defaultSpinner: React.ReactNode;
        isVisible: boolean;
        displayColor: string;
    }) => React.ReactNode;
    renderContent?: (options: {
        defaultContent: React.ReactNode;
        isVisible: boolean;
        displayColor: string;
        loadingText: React.ReactNode;
    }) => React.ReactNode;
}
export type LoadingModalType = (options: LoadingModalOptions) => React.JSX.Element;
/**
 * LoadingModal - Full-screen loading overlay with spinner and message
 *
 * A simple but essential component that displays a loading state during async operations
 * like connecting to a room, processing recordings, or loading resources. Provides a
 * semi-transparent overlay with a centered spinner and customizable loading message.
 *
 * Features:
 * - Full-screen overlay blocking user interaction
 * - Animated FontAwesome spinner (customizable icon)
 * - Customizable loading text/message
 * - Adjustable overlay opacity and colors
 * - Optional spinner visibility toggle
 * - Custom render hooks for complete flexibility
 * - Supports custom spinner components
 *
 * @component
 * @param {LoadingModalOptions} options - Configuration options
 * @param {boolean} options.isVisible - Controls modal visibility
 * @param {string} [options.backgroundColor='rgba(0, 0, 0, 0.5)'] - Overlay background color
 * @param {string} [options.displayColor='black'] - Spinner and text color
 * @param {React.ReactNode} [options.loadingText='Loading...'] - Loading message content
 * @param {boolean} [options.showSpinner=true] - Whether to show spinner
 * @param {IconDefinition} [options.spinnerIcon=faSpinner] - FontAwesome icon for spinner
 * @param {object} [options.containerProps] - HTML attributes for outer container
 * @param {object} [options.contentProps] - HTML attributes for content wrapper
 * @param {object} [options.spinnerWrapperProps] - HTML attributes for spinner wrapper
 * @param {object} [options.spinnerProps] - FontAwesomeIcon component props
 * @param {object} [options.textProps] - HTML attributes for text wrapper
 * @param {Function} [options.renderSpinner] - Custom spinner renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 *
 * @returns {React.JSX.Element} Rendered loading modal
 *
 * @example
 * // Basic loading modal
 * ```tsx
 * import React, { useState } from 'react';
 * import { LoadingModal } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const [isLoading, setIsLoading] = useState(false);
 *
 *   const handleConnect = async () => {
 *     setIsLoading(true);
 *     await connectToRoom();
 *     setIsLoading(false);
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleConnect}>Connect</button>
 *       <LoadingModal
 *         isVisible={isLoading}
 *         backgroundColor="rgba(0, 0, 0, 0.7)"
 *         displayColor="#3b82f6"
 *         loadingText="Connecting to room..."
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * // Custom branded loading with no spinner
 * ```tsx
 * import { LoadingModal } from 'mediasfu-reactjs';
 *
 * function BrandedLoading({ isVisible, message }) {
 *   return (
 *     <LoadingModal
 *       isVisible={isVisible}
 *       backgroundColor="rgba(15, 23, 42, 0.95)"
 *       displayColor="#22c55e"
 *       showSpinner={false}
 *       loadingText={
 *         <div style={{ textAlign: 'center' }}>
 *           <div style={{
 *             width: 60,
 *             height: 60,
 *             margin: '0 auto 20px',
 *             borderRadius: '50%',
 *             border: '4px solid #22c55e',
 *             borderTopColor: 'transparent',
 *             animation: 'spin 1s linear infinite',
 *           }} />
 *           <p style={{ fontSize: 18, fontWeight: 600 }}>{message}</p>
 *         </div>
 *       }
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Custom content with progress indicator
 * ```tsx
 * import { LoadingModal } from 'mediasfu-reactjs';
 *
 * function ProgressLoading({ isVisible, progress, message }) {
 *   return (
 *     <LoadingModal
 *       isVisible={isVisible}
 *       backgroundColor="rgba(0, 0, 0, 0.8)"
 *       displayColor="#3b82f6"
 *       renderContent={({ defaultContent }) => (
 *         <div style={{
 *           background: 'white',
 *           padding: 40,
 *           borderRadius: 16,
 *           boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
 *           textAlign: 'center',
 *           minWidth: 300,
 *         }}>
 *           <div style={{
 *             width: 80,
 *             height: 80,
 *             margin: '0 auto 20px',
 *             borderRadius: '50%',
 *             border: '6px solid #e2e8f0',
 *             borderTopColor: '#3b82f6',
 *             animation: 'spin 1s linear infinite',
 *           }} />
 *           <h3 style={{ marginBottom: 16, color: '#1e3a8a' }}>{message}</h3>
 *           <div style={{
 *             width: '100%',
 *             height: 8,
 *             background: '#e2e8f0',
 *             borderRadius: 4,
 *             overflow: 'hidden',
 *           }}>
 *             <div style={{
 *               width: `${progress}%`,
 *               height: '100%',
 *               background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
 *               transition: 'width 0.3s ease',
 *             }} />
 *           </div>
 *           <p style={{ marginTop: 12, color: '#64748b', fontSize: 14 }}>
 *             {progress}% complete
 *           </p>
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
 * import { MediasfuGeneric, LoadingModal } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   loadingModal: {
 *     render: (props) => (
 *       <LoadingModal
 *         {...props}
 *         backgroundColor="rgba(15, 23, 42, 0.9)"
 *         displayColor="#22c55e"
 *         loadingText={
 *           <div style={{ textAlign: 'center' }}>
 *             <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
 *               Please wait
 *             </p>
 *             <p style={{ fontSize: 14, opacity: 0.8 }}>
 *               Setting up your experience...
 *             </p>
 *           </div>
 *         }
 *         spinnerProps={{ size: '3x', spin: true }}
 *       />
 *     ),
 *   },
 * };
 *
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
 */
declare const LoadingModal: React.FC<LoadingModalOptions>;
export default LoadingModal;
//# sourceMappingURL=LoadingModal.d.ts.map