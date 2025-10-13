import React from "react";
export interface MainContainerComponentOptions {
    backgroundColor?: string;
    children: React.ReactNode;
    containerWidthFraction?: number;
    containerHeightFraction?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
    padding?: number;
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
export type MainContainerComponentType = (options: MainContainerComponentOptions) => React.JSX.Element;
/**
 * MainContainerComponent is a React functional component that renders a responsive container
 * with customizable dimensions, margins, and render hooks for advanced composition.
 * The container's dimensions adapt to the window size based on provided width and height fractions,
 * and it updates dynamically on window resize or orientation changes.
 *
 * Supports custom rendering of both the container and its content via `renderContainer` and `renderContent`,
 * enabling complete control over layout, styling, and child composition.
 *
 * @component
 * @param {MainContainerComponentOptions} props - The properties for MainContainerComponent.
 * @param {string} [props.backgroundColor='transparent'] - Background color of the container.
 * @param {React.ReactNode} props.children - Child elements to render inside the container.
 * @param {number} [props.containerWidthFraction=1] - Fraction of window width for container's width (0-1).
 * @param {number} [props.containerHeightFraction=1] - Fraction of window height for container's height (0-1).
 * @param {number} [props.marginLeft=0] - Left margin of the container in pixels.
 * @param {number} [props.marginRight=0] - Right margin of the container in pixels.
 * @param {number} [props.marginTop=0] - Top margin of the container in pixels.
 * @param {number} [props.marginBottom=0] - Bottom margin of the container in pixels.
 * @param {number} [props.padding=0] - Padding inside the container in pixels.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - Additional HTML props for the container div (className, style, etc.).
 * @param {Function} [props.renderContent] - Optional function to customize content rendering. Receives { defaultContent, dimensions }.
 * @param {Function} [props.renderContainer] - Optional function to customize container rendering. Receives { defaultContainer, dimensions }.
 *
 * @returns {React.JSX.Element} The rendered container component.
 *
 * @example
 * **Basic Usage**
 * ```tsx
 * import React from 'react';
 * import { MainContainerComponent } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MainContainerComponent
 *       backgroundColor="black"
 *       containerWidthFraction={0.8}
 *       containerHeightFraction={0.9}
 *       marginLeft={10}
 *       marginTop={10}
 *       padding={20}
 *     >
 *       <h1>Main Content</h1>
 *       <p>This container adapts to window size.</p>
 *     </MainContainerComponent>
 *   );
 * }
 * ```
 *
 * @example
 * **Custom Content Wrapper (renderContent)**
 * ```tsx
 * import React from 'react';
 * import { MainContainerComponent } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MainContainerComponent
 *       backgroundColor="white"
 *       containerWidthFraction={0.9}
 *       containerHeightFraction={0.85}
 *       renderContent={({ defaultContent, dimensions }) => (
 *         <div style={{ padding: 20, border: '2px solid blue' }}>
 *           <div style={{ marginBottom: 10 }}>
 *             Container: {dimensions.width}x{dimensions.height}px
 *           </div>
 *           {defaultContent}
 *         </div>
 *       )}
 *     >
 *       <p>Wrapped content with dimension display</p>
 *     </MainContainerComponent>
 *   );
 * }
 * ```
 *
 * @example
 * **Custom Container Builder (renderContainer)**
 * ```tsx
 * import React from 'react';
 * import { MainContainerComponent } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MainContainerComponent
 *       backgroundColor="black"
 *       containerWidthFraction={0.7}
 *       containerHeightFraction={0.8}
 *       renderContainer={({ defaultContainer, dimensions }) => (
 *         <div style={{
 *           border: '4px solid gold',
 *           boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
 *           borderRadius: 12
 *         }}>
 *           {defaultContainer}
 *           <div style={{
 *             position: 'absolute',
 *             bottom: 5,
 *             right: 5,
 *             color: 'yellow',
 *             fontSize: 10
 *           }}>
 *             {dimensions.width}x{dimensions.height}
 *           </div>
 *         </div>
 *       )}
 *     >
 *       <h2>Custom Container Shell</h2>
 *     </MainContainerComponent>
 *   );
 * }
 * ```
 *
 * @example
 * **Using in uiOverrides (MediasfuGeneric example)**
 * ```tsx
 * import React from 'react';
 * import { MediasfuGeneric, MainContainerComponent } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const CustomMainContainer = (props: any) => (
 *     <MainContainerComponent
 *       {...props}
 *       backgroundColor="darkblue"
 *       renderContainer={({ defaultContainer, dimensions }) => (
 *         <div style={{
 *           border: '3px dashed cyan',
 *           boxShadow: '0 0 20px cyan',
 *           position: 'relative'
 *         }}>
 *           {defaultContainer}
 *           <div style={{
 *             position: 'absolute',
 *             top: 5,
 *             left: 5,
 *             color: 'cyan',
 *             fontSize: 12,
 *             fontWeight: 'bold'
 *           }}>
 *             LIVE: {dimensions.width}x{dimensions.height}
 *           </div>
 *         </div>
 *       )}
 *     />
 *   );
 *
 *   return (
 *     <MediasfuGeneric
 *       useLocalUIMode={true}
 *       useSeed={true}
 *       seedData={mySeedData}
 *       uiOverrides={{
 *         MainContainerComponent: CustomMainContainer
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * **Advanced: Responsive Container with Media Queries**
 * ```tsx
 * import React, { useEffect, useState } from 'react';
 * import { MainContainerComponent } from 'mediasfu-reactjs';
 *
 * function ResponsiveApp() {
 *   const [isMobile, setIsMobile] = useState(false);
 *
 *   useEffect(() => {
 *     const updateMedia = () => setIsMobile(window.innerWidth < 768);
 *     updateMedia();
 *     window.addEventListener('resize', updateMedia);
 *     return () => window.removeEventListener('resize', updateMedia);
 *   }, []);
 *
 *   return (
 *     <MainContainerComponent
 *       backgroundColor={isMobile ? 'navy' : 'black'}
 *       containerWidthFraction={isMobile ? 0.95 : 0.7}
 *       containerHeightFraction={isMobile ? 0.85 : 0.9}
 *       padding={isMobile ? 10 : 20}
 *       renderContent={({ defaultContent, dimensions }) => (
 *         <div>
 *           <div style={{ color: 'white', marginBottom: 10 }}>
 *             {isMobile ? 'Mobile' : 'Desktop'} Mode ({dimensions.width}x{dimensions.height}px)
 *           </div>
 *           {defaultContent}
 *         </div>
 *       )}
 *     >
 *       <h1>Responsive Content</h1>
 *       <p>This container adapts to mobile and desktop layouts.</p>
 *     </MainContainerComponent>
 *   );
 * }
 * ```
 */
declare const MainContainerComponent: React.FC<MainContainerComponentOptions>;
export default MainContainerComponent;
//# sourceMappingURL=MainContainerComponent.d.ts.map