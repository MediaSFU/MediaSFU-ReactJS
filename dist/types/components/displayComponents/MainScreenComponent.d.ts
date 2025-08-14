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
}
export type MainScreenComponentType = (options: MainScreenComponentOptions) => React.JSX.Element;
/**
 * MainScreenComponent is a React functional component that dynamically adjusts the layout
 * and dimensions of its child components based on props and the window size.
 *
 * @component
 * @param {MainScreenComponentOptions} props - The properties for MainScreenComponent.
 * @param {React.ReactNode} props.children - The child components to render within the main screen.
 * @param {number} props.mainSize - Percentage size of the main component when stacking.
 * @param {boolean} props.doStack - Flag indicating whether components should be stacked.
 * @param {number} [props.containerWidthFraction=1] - Fraction of window width used for the container.
 * @param {number} [props.containerHeightFraction=1] - Fraction of window height used for the container.
 * @param {Function} props.updateComponentSizes - Callback to update component sizes.
 * @param {number} [props.defaultFraction=0.94] - Default fraction applied to container height when controls are shown.
 * @param {boolean} props.showControls - Flag indicating if controls are shown, affecting container height.
 * @param {ComponentSizes} props.componentSizes - Current sizes of components (main and other dimensions).
 *
 * @returns {React.JSX.Element} The rendered main screen component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MainScreenComponent } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MainScreenComponent
 *       mainSize={70}
 *       doStack={true}
 *       containerWidthFraction={0.5}
 *       containerHeightFraction={0.5}
 *       updateComponentSizes={(sizes) => console.log('Component sizes:', sizes)}
 *       defaultFraction={0.9}
 *       showControls={true}
 *       componentSizes={{ mainHeight: 100, otherHeight: 100, mainWidth: 100, otherWidth: 100 }}
 *     >
 *       <ChildComponent />
 *     </MainScreenComponent>
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const MainScreenComponent: React.FC<MainScreenComponentOptions>;
export default MainScreenComponent;
//# sourceMappingURL=MainScreenComponent.d.ts.map