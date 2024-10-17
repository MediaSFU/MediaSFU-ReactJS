import React from 'react';
import { EventType } from '../../@types/types';
export interface StandardPanelParameters {
    recordingMediaOptions: string;
    recordingAudioOptions: string;
    recordingVideoOptions: string;
    recordingAddHLS: boolean;
    updateRecordingMediaOptions: (value: string) => void;
    updateRecordingAudioOptions: (value: string) => void;
    updateRecordingVideoOptions: (value: string) => void;
    updateRecordingAddHLS: (value: boolean) => void;
    eventType: EventType;
}
export interface StandardPanelOptions {
    parameters: StandardPanelParameters;
}
export type StandardPanelType = (options: StandardPanelOptions) => JSX.Element;
declare const StandardPanelComponent: React.FC<StandardPanelOptions>;
export default StandardPanelComponent;
//# sourceMappingURL=StandardPanelComponent.d.ts.map