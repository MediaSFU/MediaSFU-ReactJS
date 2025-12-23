import React from 'react';

const joinClassNames = (
  ...classes: Array<string | undefined | null | false>
): string | undefined => {
  const filtered = classes.filter(Boolean).join(' ').trim();
  return filtered.length > 0 ? filtered : undefined;
};

export interface AudioGridOptions {
  componentsToRender: React.ReactNode[]; // Array of React components or elements
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  itemWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  renderItem?: (options: {
    component: React.ReactNode;
    index: number;
    defaultItem: React.ReactNode;
  }) => React.ReactNode;
  renderContainer?: (options: {
    defaultContainer: React.ReactNode;
    items: React.ReactNode[];
  }) => React.ReactNode;
}

export type AudioGridType = (options: AudioGridOptions) => React.ReactNode;

/**
 * AudioGrid - A grid layout component for organizing audio participant components.
 * 
 * This component provides a flexible CSS Grid-based layout system for displaying multiple audio participant
 * components. It offers granular customization of both the grid container and individual items, with support
 * for custom rendering of each element.
 * 
 * **Key Features:**
 * - **CSS Grid Layout**: Modern grid-based layout with configurable gap spacing
 * - **Array-Based Rendering**: Accepts array of React components/elements for grid population
 * - **High Z-Index**: Positioned above other content (z-index: 9) for visibility
 * - **Item Customization**: Individual control over each grid item's appearance
 * - **Container Customization**: Full control over grid container styling and attributes
 * - **Render Hooks**: Custom rendering for both individual items and entire container
 * - **Display Contents**: Items use display: contents to maintain grid flow
 * - **Automatic Keys**: Handles React keys automatically for array items
 * - **HTML Attributes**: Granular HTML attributes for container and item wrappers
 * - **Class Management**: Smart className joining utility for clean class composition
 * - **Flexible Styling**: Support for inline styles and CSS classes
 * - **React Element Validation**: Proper handling of rendered items with key preservation
 * 
 * @component
 * 
 * @param {AudioGridOptions} props - Configuration options for AudioGrid
 * @param {React.ReactNode[]} props.componentsToRender - Array of audio components to render in grid layout
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.containerProps] - HTML attributes for grid container element
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.itemWrapperProps] - HTML attributes for individual item wrappers
 * @param {(options: {component: React.ReactNode; index: number; defaultItem: React.ReactNode}) => React.ReactNode} [props.renderItem] - Custom render function for individual grid items
 * @param {(options: {defaultContainer: React.ReactNode; items: React.ReactNode[]}) => React.ReactNode} [props.renderContainer] - Custom render function for grid container
 * 
 * @returns {React.ReactNode} The rendered audio grid with all components
 * 
 * @example
 * // Basic usage with audio participant components
 * ```tsx
 * import React from 'react';
 * import { AudioGrid, AudioCard } from 'mediasfu-reactjs';
 * 
 * const AudioParticipantGrid = () => {
 *   const participants = [
 *     { id: '1', name: 'Alice', audioLevel: 0.8 },
 *     { id: '2', name: 'Bob', audioLevel: 0.5 },
 *     { id: '3', name: 'Charlie', audioLevel: 0.3 }
 *   ];
 * 
 *   const audioComponents = participants.map(p => (
 *     <AudioCard
 *       key={p.id}
 *       name={p.name}
 *       barColor={p.audioLevel > 0.5 ? 'green' : 'gray'}
 *       imageSource={`/avatars/${p.id}.jpg`}
 *     />
 *   ));
 * 
 *   return (
 *     <AudioGrid componentsToRender={audioComponents} />
 *   );
 * };
 * ```
 * 
 * @example
 * // Custom styled grid with explicit layout
 * ```tsx
 * import React from 'react';
 * import { AudioGrid, AudioCard } from 'mediasfu-reactjs';
 * 
 * const CustomStyledAudioGrid = () => {
 *   const participants = Array.from({ length: 6 }, (_, i) => ({
 *     id: `participant-${i}`,
 *     name: `User ${i + 1}`,
 *     muted: i % 2 === 0
 *   }));
 * 
 *   const audioComponents = participants.map(p => (
 *     <AudioCard
 *       key={p.id}
 *       name={p.name}
 *       showWaveform={!p.muted}
 *       imageSource={`/avatar-${p.id}.png`}
 *       barColor={p.muted ? '#95a5a6' : '#2ecc71'}
 *     />
 *   ));
 * 
 *   return (
 *     <AudioGrid
 *       componentsToRender={audioComponents}
 *       containerProps={{
 *         style: {
 *           gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
 *           gap: '20px',
 *           padding: '20px',
 *           backgroundColor: '#2c3e50',
 *           borderRadius: '8px'
 *         }
 *       }}
 *       itemWrapperProps={{
 *         style: {
 *           transition: 'transform 0.2s ease',
 *         },
 *         className: 'audio-grid-item'
 *       }}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Analytics tracking with custom item rendering
 * ```tsx
 * import React, { useEffect } from 'react';
 * import { AudioGrid, AudioCard } from 'mediasfu-reactjs';
 * 
 * const AnalyticsAudioGrid = () => {
 *   const participants = [
 *     { id: '1', name: 'Alice', speaking: true },
 *     { id: '2', name: 'Bob', speaking: false },
 *     { id: '3', name: 'Charlie', speaking: true }
 *   ];
 * 
 *   const audioComponents = participants.map(p => (
 *     <AudioCard
 *       key={p.id}
 *       name={p.name}
 *       showWaveform={p.speaking}
 *       imageSource={`/avatar-${p.id}.jpg`}
 *     />
 *   ));
 * 
 *   return (
 *     <AudioGrid
 *       componentsToRender={audioComponents}
 *       renderItem={({ component, index, defaultItem }) => {
 *         useEffect(() => {
 *           analytics.track('Audio Grid Item Rendered', {
 *             index,
 *             participantId: participants[index].id,
 *             speaking: participants[index].speaking
 *           });
 *         }, [index]);
 * 
 *         return (
 *           <div 
 *             className="tracked-audio-item"
 *             data-participant-id={participants[index].id}
 *           >
 *             {defaultItem}
 *           </div>
 *         );
 *       }}
 *       renderContainer={({ defaultContainer, items }) => {
 *         useEffect(() => {
 *           analytics.track('Audio Grid Rendered', {
 *             participantCount: items.length,
 *             speakingCount: participants.filter(p => p.speaking).length
 *           });
 *         }, [items.length]);
 * 
 *         return (
 *           <div className="analytics-audio-grid">
 *             <div className="grid-header">
 *               <span>{items.length} participants</span>
 *             </div>
 *             {defaultContainer}
 *           </div>
 *         );
 *       }}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, AudioGrid } from 'mediasfu-reactjs';
 * 
 * const CustomAudioGridComponent = (props) => (
 *   <AudioGrid
 *     {...props}
 *     containerProps={{
 *       ...props.containerProps,
 *       className: 'custom-audio-grid',
 *       style: {
 *         ...props.containerProps?.style,
 *         gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
 *         gap: '16px',
 *         padding: '16px',
 *         backgroundColor: '#1a1a1a',
 *         borderRadius: '12px'
 *       }
 *     }}
 *     renderContainer={({ defaultContainer, items }) => (
 *       <div className="enhanced-audio-grid-wrapper">
 *         <div className="audio-grid-stats">
 *           <span className="participant-count">
 *             🎤 {items.length} {items.length === 1 ? 'participant' : 'participants'}
 *           </span>
 *         </div>
 *         <div className="audio-grid-content">
 *           {defaultContainer}
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
 *         AudioGrid: CustomAudioGridComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 */


const AudioGrid: React.FC<AudioGridOptions> = ({
  componentsToRender,
  containerProps,
  itemWrapperProps,
  renderItem,
  renderContainer,
}) => {

  const {
    className: containerClassName,
    style: containerStyleOverrides,
    ...restContainerProps
  } = containerProps ?? {};

  const containerClassNames = joinClassNames('mediasfu-audio-grid', containerClassName);

  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gap: 1, // Removed gap to prevent unwanted spacing in conference layout
    zIndex: 9,
    ...containerStyleOverrides,
  };

  const {
    className: itemClassName,
    style: itemStyleOverrides,
    ...restItemProps
  } = itemWrapperProps ?? {};

  const itemClassNames = joinClassNames(
    'mediasfu-audio-grid__item',
    itemClassName
  );

  const itemStyle: React.CSSProperties = {
    zIndex: 9,
    display: 'contents',
    ...itemStyleOverrides,
  };

  const items = componentsToRender.map((component, index) => {
    const defaultItem = (
      <div
        key={index}
        className={itemClassNames}
        style={itemStyle}
        {...restItemProps}
      >
        {component}
      </div>
    );

    const renderedItem = renderItem
      ? renderItem({ component, index, defaultItem })
      : defaultItem;

    if (React.isValidElement(renderedItem)) {
      return React.cloneElement(renderedItem, {
        key: renderedItem.key ?? index,
      });
    }

    return (
      <React.Fragment key={index}>{renderedItem}</React.Fragment>
    );
  });

  const defaultContainer = (
    <div
      className={containerClassNames}
      style={containerStyle}
      {...restContainerProps}
    >
      {items}
    </div>
  );

  const containerNode = renderContainer
    ? renderContainer({ defaultContainer, items })
    : defaultContainer;

  return <>{containerNode}</>;
};

export default AudioGrid;
