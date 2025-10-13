import React from "react";
export interface MainAspectComponentOptions {
    backgroundColor?: string;
    children: React.ReactNode;
    showControls?: boolean;
    containerWidthFraction?: number;
    containerHeightFraction?: number;
    defaultFraction?: number;
    updateIsWideScreen: (isWide: boolean) => void;
    updateIsMediumScreen: (isMedium: boolean) => void;
    updateIsSmallScreen: (isSmall: boolean) => void;
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
    renderContent?: (options: {
        defaultContent: React.ReactNode;
        dimensions: {
            width: number;
            height: number;
        };
    }) => React.ReactNode;
    renderContainer?: (options: {
        defaultContainer: React.ReactNode;
        dimensions: {
            width: number;
            height: number;
        };
    }) => React.ReactNode;
}
export type MainAspectComponentType = (options: MainAspectComponentOptions) => React.JSX.Element;
/**
 * MainAspectComponent is a React functional component that dynamically adjusts its dimensions based on window size and specified fractions, while updating screen size states (wide, medium, small) based on container width.
 *
 * This component provides an adaptive container that resizes according to the window’s height and width, factoring in control visibility, and offers real-time updates for screen size breakpoints.
 *
 * @component
 * @param {MainAspectComponentOptions} props - The properties for the MainAspectComponent.
 * @param {string} [props.backgroundColor='transparent'] - Background color of the component.
 * @param {React.ReactNode} props.children - The child elements to render inside the component.
 * @param {boolean} [props.showControls=true] - Determines if controls are shown, impacting height calculation.
 * @param {number} [props.containerWidthFraction=1] - Fraction of the window width for container width.
 * @param {number} [props.containerHeightFraction=1] - Fraction of the window height for container height.
 * @param {number} [props.defaultFraction=0.94] - Default height fraction adjustment when controls are visible.
 * @param {Function} props.updateIsWideScreen - Callback to update wide screen state.
 * @param {Function} props.updateIsMediumScreen - Callback to update medium screen state.
 * @param {Function} props.updateIsSmallScreen - Callback to update small screen state.
 *
 * @returns {React.JSX.Element} The rendered MainAspectComponent with adaptive dimensions.
 *
 * @example
 * // Basic responsive container with breakpoint callbacks
 * ```tsx
 * import React, { useState } from 'react';
 * import { MainAspectComponent } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const [isWideScreen, setIsWideScreen] = useState(false);
 *   const [isMediumScreen, setIsMediumScreen] = useState(false);
 *   const [isSmallScreen, setIsSmallScreen] = useState(false);
 *
 *   return (
 *     <MainAspectComponent
 *       backgroundColor="#0f172a"
 *       showControls={true}
 *       updateIsWideScreen={setIsWideScreen}
 *       updateIsMediumScreen={setIsMediumScreen}
 *       updateIsSmallScreen={setIsSmallScreen}
 *     >
 *       <div>
 *         {isWideScreen && <h1>Desktop Layout</h1>}
 *         {isMediumScreen && <h1>Tablet Layout</h1>}
 *         {isSmallScreen && <h1>Mobile Layout</h1>}
 *       </div>
 *     </MainAspectComponent>
 *   );
 * }
 *
 * export default App;
 * ```
 *
 * @example
 * // Custom dimensions with control bar compensation
 * ```tsx
 * import { MainAspectComponent, FlexibleVideo } from 'mediasfu-reactjs';
 *
 * function VideoContainer() {
 *   return (
 *     <MainAspectComponent
 *       backgroundColor="black"
 *       showControls={true}
 *       containerWidthFraction={0.75}
 *       containerHeightFraction={0.8}
 *       defaultFraction={0.94}
 *       updateIsWideScreen={(isWide) => console.log('Wide:', isWide)}
 *       updateIsMediumScreen={(isMed) => console.log('Medium:', isMed)}
 *       updateIsSmallScreen={(isSmall) => console.log('Small:', isSmall)}
 *     >
 *       <FlexibleVideo customWidth={window.innerWidth * 0.75} customHeight={600} />
 *     </MainAspectComponent>
 *   );
 * }
 * ```
 *
 * @example
 * // Custom render with dimension tracking
 * ```tsx
 * import { MainAspectComponent } from 'mediasfu-reactjs';
 *
 * function CustomLayout() {
 *   return (
 *     <MainAspectComponent
 *       backgroundColor="#1e3a8a"
 *       updateIsWideScreen={() => {}}
 *       updateIsMediumScreen={() => {}}
 *       updateIsSmallScreen={() => {}}
 *       renderContent={({ defaultContent, dimensions }) => (
 *         <div style={{
 *           border: '2px solid #3b82f6',
 *           borderRadius: 12,
 *           padding: 16,
 *           width: dimensions.width,
 *           height: dimensions.height
 *         }}>
 *           <p>Container: {dimensions.width}x{dimensions.height}px</p>
 *           {defaultContent}
 *         </div>
 *       )}
 *     >
 *       <div>Dimension-aware content</div>
 *     </MainAspectComponent>
 *   );
 * }
 * ```
 *
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, MainAspectComponent } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   mainAspect: {
 *     render: (props) => (
 *       <MainAspectComponent
 *         {...props}
 *         backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
 *         containerWidthFraction={0.9}
 *         containerHeightFraction={0.85}
 *       />
 *     ),
 *   },
 * };
 *
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
 */
declare const MainAspectComponent: React.FC<MainAspectComponentOptions>;
export default MainAspectComponent;
//# sourceMappingURL=MainAspectComponent.d.ts.map