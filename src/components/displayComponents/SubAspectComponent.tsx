import React, { useCallback, useEffect, useState } from "react";

export interface SubAspectComponentOptions {
  backgroundColor: string;
  children: React.ReactNode;
  showControls?: boolean;
  containerWidthFraction?: number;
  containerHeightFraction?: number;
  defaultFractionSub?: number;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  renderContainer?: (options: {
    defaultContainer: React.ReactNode;
    styles: React.CSSProperties;
    showControls: boolean;
  }) => React.ReactNode;
  renderContent?: (options: {
    defaultContent: React.ReactNode;
    showControls: boolean;
  }) => React.ReactNode;
}

export type SubAspectComponentType = (
  options: SubAspectComponentOptions
) => React.JSX.Element;

/**
 * SubAspectComponent - A responsive secondary aspect container that scales with viewport dimensions.
 * 
 * This component provides a viewport-aware container for secondary content areas, automatically calculating
 * dimensions based on window size and control visibility. It's designed to complement the main content area
 * with flexible sizing and control-aware height adjustments.
 * 
 * **Key Features:**
 * - **Viewport Scaling**: Automatically scales based on window dimensions with configurable fractions
 * - **Control-Aware Height**: Adjusts height based on control bar visibility
 * - **Responsive Updates**: Listens to window resize events for dynamic dimension updates
 * - **Fractional Sizing**: Width and height calculated as fractions of viewport dimensions
 * - **Default Fraction**: Fallback height fraction when controls are visible
 * - **Background Customization**: Configurable background color for container
 * - **Render Hooks**: Custom rendering for container and content
 * - **HTML Attributes**: Granular control over container element attributes
 * - **SSR Compatible**: Safe handling of server-side rendering scenarios
 * - **Children Support**: Renders any child components within the scaled container
 * - **Flexible Styling**: Custom styles via containerProps and render hooks
 * - **Zero Height Option**: Can render with zero height when controls are hidden
 * 
 * @component
 * 
 * @param {SubAspectComponentOptions} props - Configuration options for SubAspectComponent
 * @param {string} props.backgroundColor - Background color for the container
 * @param {React.ReactNode} props.children - Child components rendered within the container
 * @param {boolean} [props.showControls=true] - Controls visibility affects height calculation
 * @param {number} [props.containerWidthFraction] - Fraction of viewport width (0-1) for container width
 * @param {number} [props.containerHeightFraction] - Fraction of viewport height (0-1) for container height
 * @param {number} [props.defaultFractionSub=0.0] - Default height fraction when controls visible and containerHeightFraction not set
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - HTML attributes for container element
 * @param {(options: {defaultContainer: React.ReactNode; styles: React.CSSProperties; showControls: boolean}) => React.ReactNode} [props.renderContainer] - Custom render function for container
 * @param {(options: {defaultContent: React.ReactNode; showControls: boolean}) => React.ReactNode} [props.renderContent] - Custom render function for content
 * 
 * @returns {React.JSX.Element} The rendered sub-aspect component with responsive dimensions
 * 
 * @example
 * // Basic usage for secondary content area
 * ```tsx
 * import React from 'react';
 * import { SubAspectComponent } from 'mediasfu-reactjs';
 * 
 * const SecondaryVideoPanel = () => {
 *   return (
 *     <SubAspectComponent
 *       backgroundColor="#2c3e50"
 *       showControls={true}
 *       containerWidthFraction={0.3}
 *       containerHeightFraction={0.4}
 *       defaultFractionSub={0.35}
 *     >
 *       <div style={{ padding: '10px', color: '#fff' }}>
 *         <h3>Participant Videos</h3>
 *         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
 *           <video src="/participant1.mp4" style={{ width: '100%' }} />
 *           <video src="/participant2.mp4" style={{ width: '100%' }} />
 *         </div>
 *       </div>
 *     </SubAspectComponent>
 *   );
 * };
 * ```
 * 
 * @example
 * // Custom styled with dynamic control visibility
 * ```tsx
 * import React, { useState } from 'react';
 * import { SubAspectComponent } from 'mediasfu-reactjs';
 * 
 * const DynamicSubPanel = () => {
 *   const [showControls, setShowControls] = useState(true);
 * 
 *   return (
 *     <>
 *       <button onClick={() => setShowControls(!showControls)}>
 *         Toggle Controls
 *       </button>
 *       <SubAspectComponent
 *         backgroundColor="rgba(26, 26, 26, 0.95)"
 *         showControls={showControls}
 *         containerWidthFraction={0.25}
 *         containerHeightFraction={showControls ? 0.3 : 0.4}
 *         defaultFractionSub={0.3}
 *         containerProps={{
 *           style: {
 *             border: '2px solid #3498db',
 *             borderRadius: '8px',
 *             overflow: 'hidden',
 *             transition: 'all 0.3s ease'
 *           }
 *         }}
 *       >
 *         <div style={{ padding: '15px', color: '#ecf0f1' }}>
 *           <p>Secondary content area</p>
 *           <p>Controls: {showControls ? 'Visible' : 'Hidden'}</p>
 *         </div>
 *       </SubAspectComponent>
 *     </>
 *   );
 * };
 * ```
 * 
 * @example
 * // Analytics tracking for resize events
 * ```tsx
 * import React, { useState, useEffect } from 'react';
 * import { SubAspectComponent } from 'mediasfu-reactjs';
 * 
 * const AnalyticsSubPanel = () => {
 *   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
 * 
 *   return (
 *     <SubAspectComponent
 *       backgroundColor="#34495e"
 *       showControls={true}
 *       containerWidthFraction={0.3}
 *       containerHeightFraction={0.5}
 *       renderContainer={({ defaultContainer, styles, showControls }) => {
 *         useEffect(() => {
 *           const width = typeof styles.width === 'number' ? styles.width : 0;
 *           const height = typeof styles.height === 'number' ? styles.height : 0;
 *           
 *           setDimensions({ width, height });
 *           analytics.track('Sub Aspect Resized', {
 *             width,
 *             height,
 *             showControls,
 *             aspectRatio: width / height
 *           });
 *         }, [styles.width, styles.height, showControls]);
 * 
 *         return (
 *           <div>
 *             <div style={{ 
 *               position: 'absolute',
 *               top: 0,
 *               right: 0,
 *               padding: '5px',
 *               backgroundColor: 'rgba(0,0,0,0.7)',
 *               color: '#fff',
 *               fontSize: '12px'
 *             }}>
 *               {dimensions.width}×{dimensions.height}
 *             </div>
 *             {defaultContainer}
 *           </div>
 *         );
 *       }}
 *     >
 *       <div>Tracked sub-content</div>
 *     </SubAspectComponent>
 *   );
 * };
 * ```
 * 
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, SubAspectComponent } from 'mediasfu-reactjs';
 * 
 * const CustomSubAspectComponent = (props) => (
 *   <SubAspectComponent
 *     {...props}
 *     renderContent={({ defaultContent, showControls }) => (
 *       <div className="custom-sub-aspect">
 *         <div className="sub-header">
 *           <h4>Additional Participants</h4>
 *           {showControls && (
 *             <span className="controls-indicator">🎛️</span>
 *           )}
 *         </div>
 *         <div className="sub-content">
 *           {defaultContent}
 *         </div>
 *         <div className="sub-footer">
 *           <span>Responsive Sizing Active</span>
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
 *         SubAspectComponent: CustomSubAspectComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 */

const SubAspectComponent: React.FC<SubAspectComponentOptions> = ({
  backgroundColor,
  children,
  showControls = true,
  containerWidthFraction,
  containerHeightFraction,
  defaultFractionSub = 0.0,
  containerProps,
  renderContainer,
  renderContent,
}) => {
  const isBrowser = typeof window !== "undefined";

  const computeDimensions = useCallback((): { width: number; height: number } => {
    if (!isBrowser) {
      return {
        width:
          containerWidthFraction && containerWidthFraction > 0
            ? containerWidthFraction * 0
            : 0,
        height: showControls ? 40 : 0,
      };
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const width = containerWidthFraction
      ? containerWidthFraction * windowWidth
      : windowWidth;

    let height = 0;

    if (showControls) {
      if (typeof containerHeightFraction === "number") {
        height = containerHeightFraction * windowHeight;
      } else if (defaultFractionSub > 0) {
        height = defaultFractionSub * windowHeight;
      } else {
        height = 40;
      }
    }

    return { width, height };
  }, [
    containerHeightFraction,
    containerWidthFraction,
    defaultFractionSub,
    isBrowser,
    showControls,
  ]);

  const [aspectStyles, setAspectStyles] = useState<React.CSSProperties>(() => {
    const { width, height } = computeDimensions();
    return {
      width,
      height,
    };
  });

  useEffect(() => {
    setAspectStyles(computeDimensions());

    if (!isBrowser) {
      return;
    }

    const updateAspectStyles = () => {
      setAspectStyles(computeDimensions());
    };

    window.addEventListener("resize", updateAspectStyles);
    window.addEventListener("orientationchange", updateAspectStyles);

    return () => {
      window.removeEventListener("resize", updateAspectStyles);
      window.removeEventListener("orientationchange", updateAspectStyles);
    };
  }, [computeDimensions, isBrowser]);

  const {
    className: containerClassName,
    style: containerStyleOverrides,
    ...restContainerProps
  } = containerProps ?? {};

  const containerClassNames = [
    "mediasfu-sub-aspect",
    showControls ? "mediasfu-sub-aspect--visible" : "mediasfu-sub-aspect--hidden",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const combinedStyles: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    margin: 0,
    backgroundColor,
    display: showControls ? "flex" : "none",
    ...aspectStyles,
    ...containerStyleOverrides,
  };

  const defaultContent = renderContent
    ? renderContent({ defaultContent: children, showControls })
    : children;

  const defaultContainer = (
    <div
      className={containerClassNames}
      style={combinedStyles}
      {...restContainerProps}
    >
      {defaultContent}
    </div>
  );

  return renderContainer
    ? renderContainer({
        defaultContainer,
        styles: combinedStyles,
        showControls,
      })
    : defaultContainer;
};

export default SubAspectComponent;
