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
  fontWeight: 600,
  marginBottom: 8,
  fontSize: 13,
  letterSpacing: '0.02em',
  color: isDarkMode ? 'rgba(255,255,255,0.75)' : '#334155',
});

const selectStyle = (isDarkMode: boolean): React.CSSProperties => ({
  width: '100%',
  padding: `${MediasfuSpacing.sm + 2}px ${MediasfuSpacing.md}px`,
  background: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
  border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  borderRadius: MediasfuBorders.md,
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
  outline: 'none',
  appearance: 'none',
  boxShadow: isDarkMode ? 'inset 0 1px 3px rgba(0,0,0,0.2)' : 'inset 0 1px 2px rgba(0,0,0,0.06)',
  cursor: 'pointer',
  fontSize: 14,
  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
});

const optionStyle = (isDarkMode: boolean): React.CSSProperties => ({
  backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
  color: isDarkMode ? '#e2e8f0' : '#1e293b',
});

const getOptionTooltip = (items: RecordingOptionItem[], value: string) =>
  items.find((item) => item.value === value)?.tooltip || items.find((item) => item.value === value)?.label || '';

const sectionStyle = (isDarkMode: boolean): React.CSSProperties => ({
  padding: `${MediasfuSpacing.sm + 2}px ${MediasfuSpacing.md}px`,
  background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
  borderRadius: MediasfuBorders.md,
  boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.06)',
  transition: 'background 0.2s ease',
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
