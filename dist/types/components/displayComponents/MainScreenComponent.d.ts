import React from "react";
import { ComponentSizes } from "../../@types/types";
export interface MainScreenComponentOptions {
    children: React.ReactNode;
    mainSize: number;
    doStack: boolean;
    containerWidthFraction?: number;
    containerHeightFraction?: number;
    updateComponentSizes: (sizes: ComponentSizes) => void;
    defaultFraction?: number;
    showControls: boolean;
    componentSizes: ComponentSizes;
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
    renderChild?: (options: {
        child: React.ReactElement;
        index: number;
        mainSize: number;
        isWideScreen: boolean;
        doStack: boolean;
        computedStyle: React.CSSProperties;
        componentSizes: ComponentSizes;
    }) => React.ReactNode;
    renderChildren?: (options: {
        defaultChildren: React.ReactNode;
        isWideScreen: boolean;
        doStack: boolean;
        componentSizes: ComponentSizes;
    }) => React.ReactNode;
    renderContainer?: (options: {
        defaultContainer: React.ReactNode;
        isWideScreen: boolean;
        dimensions: {
            width: number;
            height: number;
        };
    }) => React.ReactNode;
}
export type MainScreenComponentType = (options: MainScreenComponentOptions) => React.JSX.Element;
/**
 * MainScreenComponent - A responsive container component that dynamically adjusts child layouts.
 *
 * This component provides intelligent layout management for main screen content, automatically
 * calculating and adjusting dimensions based on window size, control visibility, and stacking
 * preferences. It's designed for responsive video/content layouts that adapt to various screen sizes.
 *
 * **Key Features:**
 * - **Responsive Sizing**: Automatically adjusts to window dimensions with configurable fractions
 * - **Stacking Support**: Toggle between stacked and side-by-side layouts for child components
 * - **Control-Aware**: Adjusts available space based on control bar visibility
 * - **Size Callbacks**: Reports calculated dimensions via updateComponentSizes callback
 * - **Orientation Detection**: Detects and responds to wide-screen vs. portrait layouts
 * - **Child Customization**: Granular control over each child's layout and styling
 * - **Render Hooks**: Complete override capability for children rendering and container layout
 * - **Real-time Updates**: Responds to window resize events with debounced updates
 * - **Percentage-Based**: Supports percentage-based sizing for main component when stacking
 * - **Flexible Fractions**: Customizable width/height fractions for precise layout control
 * - **Component Sizes**: Tracks and exposes mainHeight, otherHeight, mainWidth, otherWidth
 * - **Performance Optimized**: Memoized calculations and efficient resize handling
 *
 * @component
 *
 * @param {MainScreenComponentOptions} props - Configuration options for MainScreenComponent
 * @param {React.ReactNode} props.children - Child components to render within main screen container
 * @param {number} props.mainSize - Percentage size (0-100) of main component when doStack is true
 * @param {boolean} props.doStack - Controls whether components are stacked vertically (true) or arranged side-by-side (false)
 * @param {number} [props.containerWidthFraction=1] - Fraction of window width (0-1) used for container
 * @param {number} [props.containerHeightFraction=1] - Fraction of window height (0-1) used for container
 * @param {(sizes: ComponentSizes) => void} props.updateComponentSizes - Callback invoked with calculated dimensions
 * @param {number} [props.defaultFraction=0.94] - Fraction applied to height when showControls is true
 * @param {boolean} props.showControls - Controls whether control bar is visible (affects height calculation)
 * @param {ComponentSizes} props.componentSizes - Current component sizes (mainHeight, otherHeight, mainWidth, otherWidth)
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - HTML attributes for container element
 * @param {(options: {child: React.ReactElement; index: number; mainSize: number; isWideScreen: boolean; doStack: boolean; computedStyle: React.CSSProperties; componentSizes: ComponentSizes}) => React.ReactNode} [props.renderChild] - Custom render function for individual child
 * @param {(options: {defaultChildren: React.ReactNode; isWideScreen: boolean; doStack: boolean; componentSizes: ComponentSizes}) => React.ReactNode} [props.renderChildren] - Custom render function for all children
 * @param {(options: {defaultContainer: React.ReactNode; isWideScreen: boolean; dimensions: {width: number; height: number}}) => React.ReactNode} [props.renderContainer] - Custom render function for entire container
 *
 * @returns {React.JSX.Element} The rendered main screen component with dynamically sized children
 *
 * @example
 * // Basic usage for responsive video layout
 * ```tsx
 * import React, { useState } from 'react';
 * import { MainScreenComponent } from 'mediasfu-reactjs';
 *
 * const ResponsiveVideoLayout = () => {
 *   const [componentSizes, setComponentSizes] = useState({
 *     mainHeight: 0,
 *     otherHeight: 0,
 *     mainWidth: 0,
 *     otherWidth: 0
 *   });
 *
 *   return (
 *     <MainScreenComponent
 *       mainSize={70}
 *       doStack={true}
 *       showControls={true}
 *       updateComponentSizes={setComponentSizes}
 *       componentSizes={componentSizes}
 *     >
 *       <div style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
 *         Main Video Content
 *       </div>
 *       <div style={{ backgroundColor: '#2a2a2a', color: '#fff' }}>
 *         Secondary Content
 *       </div>
 *     </MainScreenComponent>
 *   );
 * };
 * ```
 *
 * @example
 * // Custom styled with fractional sizing
 * ```tsx
 * import React, { useState } from 'react';
 * import { MainScreenComponent } from 'mediasfu-reactjs';
 *
 * const CustomSizedLayout = () => {
 *   const [componentSizes, setComponentSizes] = useState({
 *     mainHeight: 0,
 *     otherHeight: 0,
 *     mainWidth: 0,
 *     otherWidth: 0
 *   });
 *   const [doStack, setDoStack] = useState(window.innerWidth < 768);
 *
 *   React.useEffect(() => {
 *     const handleResize = () => {
 *       setDoStack(window.innerWidth < 768);
 *     };
 *     window.addEventListener('resize', handleResize);
 *     return () => window.removeEventListener('resize', handleResize);
 *   }, []);
 *
 *   return (
 *     <MainScreenComponent
 *       mainSize={75}
 *       doStack={doStack}
 *       containerWidthFraction={0.9}
 *       containerHeightFraction={0.85}
 *       showControls={true}
 *       defaultFraction={0.92}
 *       updateComponentSizes={(sizes) => {
 *         console.log('Updated sizes:', sizes);
 *         setComponentSizes(sizes);
 *       }}
 *       componentSizes={componentSizes}
 *       containerProps={{
 *         style: {
 *           border: '2px solid #3498db',
 *           borderRadius: '8px',
 *           overflow: 'hidden'
 *         }
 *       }}
 *     >
 *       <video src="/main-video.mp4" style={{ width: '100%', height: '100%' }} />
 *       <div style={{ padding: '20px', backgroundColor: '#ecf0f1' }}>
 *         Sidebar Content
 *       </div>
 *     </MainScreenComponent>
 *   );
 * };
 * ```
 *
 * @example
 * // Analytics tracking for layout changes
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { MainScreenComponent } from 'mediasfu-reactjs';
 *
 * const AnalyticsLayout = () => {
 *   const [componentSizes, setComponentSizes] = useState({
 *     mainHeight: 0,
 *     otherHeight: 0,
 *     mainWidth: 0,
 *     otherWidth: 0
 *   });
 *   const [doStack, setDoStack] = useState(true);
 *
 *   useEffect(() => {
 *     analytics.track('Layout Changed', {
 *       doStack,
 *       mainHeight: componentSizes.mainHeight,
 *       mainWidth: componentSizes.mainWidth,
 *       aspectRatio: componentSizes.mainWidth / componentSizes.mainHeight
 *     });
 *   }, [doStack, componentSizes]);
 *
 *   return (
 *     <MainScreenComponent
 *       mainSize={60}
 *       doStack={doStack}
 *       showControls={true}
 *       updateComponentSizes={(sizes) => {
 *         setComponentSizes(sizes);
 *         analytics.track('Component Sizes Updated', {
 *           mainSize: sizes.mainHeight * sizes.mainWidth,
 *           otherSize: sizes.otherHeight * sizes.otherWidth
 *         });
 *       }}
 *       componentSizes={componentSizes}
 *       renderChild={({ child, index, isWideScreen, computedStyle }) => {
 *         useEffect(() => {
 *           analytics.track('Child Rendered', {
 *             index,
 *             isWideScreen,
 *             width: computedStyle.width,
 *             height: computedStyle.height
 *           });
 *         }, [index, isWideScreen]);
 *         return <div style={computedStyle}>{child}</div>;
 *       }}
 *     >
 *       <div>Main Content</div>
 *       <div>Secondary Content</div>
 *     </MainScreenComponent>
 *   );
 * };
 * ```
 *
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, MainScreenComponent } from 'mediasfu-reactjs';
 *
 * const CustomMainScreenComponent = (props) => (
 *   <MainScreenComponent
 *     {...props}
 *     renderContainer={({ defaultContainer, isWideScreen, dimensions }) => (
 *       <div className="custom-main-screen">
 *         <div className="screen-info">
 *           <span>{isWideScreen ? '🖥️ Wide' : '📱 Portrait'}</span>
 *           <span>{dimensions.width} × {dimensions.height}</span>
 *         </div>
 *         <div className="screen-content">
 *           {defaultContainer}
 *         </div>
 *         <div className="screen-footer">
 *           Layout Mode: {props.doStack ? 'Stacked' : 'Side-by-Side'}
 *         </div>
 *       </div>
 *     )}
 *   />
 * );
 *
 * const App = () => {
 *   const [credentials] = useState({
 *     apiUserName: 'user123',
 *     apiKey: 'your-api-key'
 *   });
 *
 *   return (
 *     <MediasfuGeneric
 *       credentials={credentials}
 *       uiOverrides={{
 *         MainScreenComponent: CustomMainScreenComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 */
declare const MainScreenComponent: React.FC<MainScreenComponentOptions>;
export default MainScreenComponent;
//# sourceMappingURL=MainScreenComponent.d.ts.map