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
}
export type MainContainerComponentType = (options: MainContainerComponentOptions) => JSX.Element;
/**
 * MainContainerComponent is a React functional component that renders a container
 * with customizable dimensions and margins. The container's dimensions adapt to the window size
 * based on provided width and height fractions, and it updates dynamically on window resize
 * or orientation changes.
 *
 * @component
 * @param {MainContainerComponentOptions} props - The properties for MainContainerComponent.
 * @param {string} [props.backgroundColor='transparent'] - Background color of the container.
 * @param {React.ReactNode} props.children - Child elements to render inside the container.
 * @param {number} [props.containerWidthFraction=1] - Fraction of window width for container's width.
 * @param {number} [props.containerHeightFraction=1] - Fraction of window height for container's height.
 * @param {number} [props.marginLeft=0] - Left margin of the container.
 * @param {number} [props.marginRight=0] - Right margin of the container.
 * @param {number} [props.marginTop=0] - Top margin of the container.
 * @param {number} [props.marginBottom=0] - Bottom margin of the container.
 * @param {number} [props.padding=0] - Padding inside the container.
 *
 * @returns {JSX.Element} The rendered container component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MainContainerComponent } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MainContainerComponent
 *       backgroundColor="black"
 *       containerWidthFraction={0.5}
 *       containerHeightFraction={0.5}
 *       marginLeft={10}
 *       marginRight={10}
 *       marginTop={10}
 *       marginBottom={10}
 *       padding={10}
 *     >
 *       <ChildComponent />
 *     </MainContainerComponent>
 *   );
 * }
 *
 * export default App;
 * ```
 */
declare const MainContainerComponent: React.FC<MainContainerComponentOptions>;
export default MainContainerComponent;
//# sourceMappingURL=MainContainerComponent.d.ts.map