import React, { useState } from 'react';
import { EventType } from '../../@types/types';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { ModernTooltip } from '../core/widgets/ModernTooltip';
import {
  recordingAudioOptionItems,
  recordingHlsOptionItems,
  recordingMediaOptionItems,
  recordingVideoOptionItems,
  RecordingOptionItem,
} from '../../components/recordingComponents/StandardPanelComponent';

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
  isDarkMode?: boolean;
}

const labelStyle = (isDarkMode: boolean) => ({
  ...MediasfuTypography.getBodyMedium(isDarkMode),
  fontWeight: 700,
  marginBottom: 6,
});

const selectStyle = (isDarkMode: boolean): React.CSSProperties => ({
  width: '100%',
  padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
  background: isDarkMode ? '#0f172a' : '#f8fafc',
  border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  borderRadius: MediasfuBorders.md,
  color: isDarkMode ? '#f8fafc' : '#0f172a',
  outline: 'none',
  appearance: 'none',
  boxShadow: isDarkMode ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.08)',
  cursor: 'pointer',
});

const optionStyle = (isDarkMode: boolean): React.CSSProperties => ({
  backgroundColor: isDarkMode ? '#0b1221' : '#ffffff',
  color: isDarkMode ? '#f8fafc' : '#0f172a',
});

const getOptionTooltip = (items: RecordingOptionItem[], value: string) =>
  items.find((item) => item.value === value)?.tooltip || items.find((item) => item.value === value)?.label || '';

const sectionStyle = (isDarkMode: boolean): React.CSSProperties => ({
  padding: MediasfuSpacing.md,
  background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
  border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  borderRadius: MediasfuBorders.md,
});

const StandardPanelComponent: React.FC<StandardPanelOptions> = ({ parameters, isDarkMode = true }) => {
  const {
    recordingMediaOptions,
    recordingAudioOptions,
    recordingVideoOptions,
    recordingAddHLS,
    updateRecordingMediaOptions,
    updateRecordingAudioOptions,
    updateRecordingVideoOptions,
    updateRecordingAddHLS,
    eventType,
  } = parameters;

  const [selectedRecordingMediaOptions, setSelectedRecordingMediaOptions] = useState(recordingMediaOptions);
  const [selectedRecordingAudioOptions, setSelectedRecordingAudioOptions] = useState(recordingAudioOptions);
  const [selectedRecordingVideoOptions, setSelectedRecordingVideoOptions] = useState(recordingVideoOptions);
  const [selectedRecordingAddHLS, setSelectedRecordingAddHLS] = useState(recordingAddHLS);

  const handleMediaOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecordingMediaOptions(e.target.value);
    updateRecordingMediaOptions(e.target.value);
  };

  const handleAudioOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecordingAudioOptions(e.target.value);
    updateRecordingAudioOptions(e.target.value);
  };

  const handleVideoOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecordingVideoOptions(e.target.value);
    updateRecordingVideoOptions(e.target.value);
  };

  const handleAddHLSChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'true';
    setSelectedRecordingAddHLS(value);
    updateRecordingAddHLS(value);
  };

  const renderOption = (item: RecordingOptionItem) => (
    <option key={item.value} value={item.value} title={item.tooltip || item.label} style={optionStyle(isDarkMode)}>
      {item.label}
    </option>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: MediasfuSpacing.sm }}>
      <div style={sectionStyle(isDarkMode)}>
        <div style={labelStyle(isDarkMode)}>Media Options</div>
        <ModernTooltip message={getOptionTooltip(recordingMediaOptionItems, selectedRecordingMediaOptions)} isDarkMode={isDarkMode}>
          <div style={{ width: '100%' }}>
            <select
              aria-label="Recording media options"
              value={selectedRecordingMediaOptions}
              onChange={handleMediaOptionsChange}
              style={selectStyle(isDarkMode)}
            >
              {recordingMediaOptionItems.map(renderOption)}
            </select>
          </div>
        </ModernTooltip>
      </div>

      {eventType !== 'broadcast' && (
        <>
          <div style={sectionStyle(isDarkMode)}>
            <div style={labelStyle(isDarkMode)}>Specific Audios</div>
            <ModernTooltip message={getOptionTooltip(recordingAudioOptionItems, selectedRecordingAudioOptions)} isDarkMode={isDarkMode}>
              <div style={{ width: '100%' }}>
                <select
                  aria-label="Recording audio options"
                  value={selectedRecordingAudioOptions}
                  onChange={handleAudioOptionsChange}
                  style={selectStyle(isDarkMode)}
                >
                  {recordingAudioOptionItems.map(renderOption)}
                </select>
              </div>
            </ModernTooltip>
          </div>

          <div style={sectionStyle(isDarkMode)}>
            <div style={labelStyle(isDarkMode)}>Specific Videos</div>
            <ModernTooltip message={getOptionTooltip(recordingVideoOptionItems, selectedRecordingVideoOptions)} isDarkMode={isDarkMode}>
              <div style={{ width: '100%' }}>
                <select
                  aria-label="Recording video options"
                  value={selectedRecordingVideoOptions}
                  onChange={handleVideoOptionsChange}
                  style={selectStyle(isDarkMode)}
                >
                  {recordingVideoOptionItems.map(renderOption)}
                </select>
              </div>
            </ModernTooltip>
          </div>
        </>
      )}

      <div style={sectionStyle(isDarkMode)}>
        <div style={labelStyle(isDarkMode)}>Add HLS</div>
        <ModernTooltip message={getOptionTooltip(recordingHlsOptionItems, selectedRecordingAddHLS.toString())} isDarkMode={isDarkMode}>
          <div style={{ width: '100%' }}>
            <select
              aria-label="Recording HLS option"
              value={selectedRecordingAddHLS.toString()}
              onChange={handleAddHLSChange}
              style={selectStyle(isDarkMode)}
            >
              {recordingHlsOptionItems.map(renderOption)}
            </select>
          </div>
        </ModernTooltip>
      </div>
    </div>
  );
};

export default StandardPanelComponent;
