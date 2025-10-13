import React from "react";
import "./Screenboard.css";
import { ShowAlert, SleepType } from "../../@types/types";
export interface ScreenboardParameters {
    updateCanvasScreenboard: (canvas: HTMLCanvasElement | null) => void;
    annotateScreenStream: boolean;
    updateIsScreenboardModalVisible: (visible: boolean) => void;
    showAlert?: ShowAlert;
    sleep: SleepType;
    updateAnnotateScreenStream: (annotate: boolean) => void;
    [key: string]: any;
}
export interface ScreenboardOptions {
    customWidth: number;
    customHeight: number;
    parameters: ScreenboardParameters;
    showAspect: boolean;
}
export type ScreenboardType = (options: ScreenboardOptions) => React.JSX.Element;
/**
 * Screenboard - Lightweight annotation overlay for screen sharing
 *
 * A streamlined drawing canvas designed specifically for annotating shared screens during presentations.
 * Provides essential drawing tools (pen, shapes, eraser) with minimal UI footprint to avoid obscuring
 * shared content. Perfect for highlighting key points, circling important areas, and adding visual
 * emphasis during screen shares.
 *
 * Features:
 * - Freehand drawing with customizable brush
 * - Shape tools (rectangle, circle, line)
 * - Eraser with adjustable size
 * - Color selection palette
 * - Line type options (solid, dashed, dotted, dash-dot)
 * - Thickness controls for brush and eraser
 * - Minimal toolbar design
 * - Transparent canvas overlay
 * - Real-time drawing synchronization
 * - Touch and mouse input support
 * - Collapsible toolbar
 * - Clear canvas functionality
 *
 * @component
 * @param {ScreenboardOptions} options - Configuration options
 * @param {number} options.customWidth - Canvas width in pixels
 * @param {number} options.customHeight - Canvas height in pixels
 * @param {ScreenboardParameters} options.parameters - Screenboard state parameters
 * @param {Function} options.parameters.updateCanvasScreenboard - Update canvas reference
 * @param {boolean} options.parameters.annotateScreenStream - Screen annotation enabled state
 * @param {Function} options.parameters.updateIsScreenboardModalVisible - Update modal visibility
 * @param {ShowAlert} [options.parameters.showAlert] - Alert display function
 * @param {Function} options.parameters.sleep - Async delay utility
 * @param {Function} options.parameters.updateAnnotateScreenStream - Update annotation state
 * @param {boolean} options.showAspect - Show aspect ratio indicator
 *
 * @returns {React.JSX.Element} Rendered annotation canvas overlay
 *
 * @example
 * // Basic screen annotation overlay
 * ```tsx
 * import React from 'react';
 * import { Screenboard } from 'mediasfu-reactjs';
 *
 * function ScreenAnnotation({ parameters }) {
 *   return (
 *     <Screenboard
 *       customWidth={1920}
 *       customHeight={1080}
 *       parameters={parameters}
 *       showAspect={false}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Screenboard with analytics tracking
 * ```tsx
 * import { Screenboard } from 'mediasfu-reactjs';
 *
 * function AnalyticsScreenboard({ parameters }) {
 *   return (
 *     <Screenboard
 *       customWidth={1920}
 *       customHeight={1080}
 *       parameters={{
 *         ...parameters,
 *         updateAnnotateScreenStream: (annotate) => {
 *           analytics.track('screen_annotation_toggled', {
 *             enabled: annotate,
 *             timestamp: Date.now(),
 *           });
 *           parameters.updateAnnotateScreenStream(annotate);
 *         },
 *       }}
 *       showAspect={true}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Screenboard with custom dimensions for presentation
 * ```tsx
 * import { Screenboard } from 'mediasfu-reactjs';
 *
 * function PresentationAnnotation({ parameters }) {
 *   return (
 *     <div style={{ position: 'relative' }}>
 *       {parameters.annotateScreenStream && (
 *         <div style={{
 *           position: 'absolute',
 *           top: 16,
 *           left: 16,
 *           padding: '8px 16px',
 *           background: 'rgba(0, 0, 0, 0.7)',
 *           color: 'white',
 *           borderRadius: 8,
 *           fontSize: 14,
 *           zIndex: 1000,
 *         }}>
 *           Annotation Mode Active
 *         </div>
 *       )}
 *       <Screenboard
 *         customWidth={1600}
 *         customHeight={900}
 *         parameters={parameters}
 *         showAspect={false}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, Screenboard } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   screenboard: {
 *     component: (props) => (
 *       <Screenboard
 *         {...props}
 *         customWidth={1920}
 *         customHeight={1080}
 *         showAspect={false}
 *       />
 *     ),
 *   },
 * };
 *
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
 */
declare const Screenboard: React.FC<ScreenboardOptions>;
export default Screenboard;
//# sourceMappingURL=Screenboard.d.ts.map