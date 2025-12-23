import React, { useEffect, useState } from 'react';
import { EventType } from '../../@types/types';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { ModernTooltip } from '../core/widgets/ModernTooltip';
import {
  AdvancedOptionItem,
  recordingDisplayTypeItems,
  recordingNameTagToggleItems,
  recordingOrientationItems,
  recordingTextPositionItems,
  recordingVideoTypeItems,
} from '../../components/recordingComponents/AdvancedPanelComponent';

export interface AdvancedPanelParameters {
  recordingVideoType: string;
  recordingDisplayType: 'video' | 'media' | 'all';
  recordingBackgroundColor: string;
  recordingNameTagsColor: string;
  recordingOrientationVideo: string;
  recordingNameTags: boolean;
  recordingAddText: boolean;
  recordingCustomText: string;
  recordingCustomTextPosition: string;
  recordingCustomTextColor: string;
  updateRecordingVideoType: (value: string) => void;
  updateRecordingDisplayType: (value: 'video' | 'media' | 'all') => void;
  updateRecordingBackgroundColor: (value: string) => void;
  updateRecordingNameTagsColor: (value: string) => void;
  updateRecordingOrientationVideo: (value: string) => void;
  updateRecordingNameTags: (value: boolean) => void;
  updateRecordingAddText: (value: boolean) => void;
  updateRecordingCustomText: (value: string) => void;
  updateRecordingCustomTextPosition: (value: string) => void;
  updateRecordingCustomTextColor: (value: string) => void;
  eventType: EventType;
}

export interface AdvancedPanelOptions {
  parameters: AdvancedPanelParameters;
  isDarkMode?: boolean;
}

const sectionStyle = (isDarkMode: boolean): React.CSSProperties => ({
  padding: MediasfuSpacing.md,
  background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
  border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  borderRadius: MediasfuBorders.md,
});

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

const inputStyle = (isDarkMode: boolean): React.CSSProperties => ({
  ...selectStyle(isDarkMode),
});

const helperTextStyle = (isDarkMode: boolean): React.CSSProperties => ({
  fontSize: 12,
  opacity: 0.7,
  marginTop: 4,
  color: isDarkMode ? 'rgba(255,255,255,0.75)' : 'rgba(15,23,42,0.75)',
});

const optionStyle = (isDarkMode: boolean): React.CSSProperties => ({
  backgroundColor: isDarkMode ? '#0b1221' : '#ffffff',
  color: isDarkMode ? '#f8fafc' : '#0f172a',
});

const getOptionTooltip = (items: AdvancedOptionItem[], value: string) =>
  items.find((item) => item.value === value)?.tooltip || items.find((item) => item.value === value)?.label || '';

const AdvancedPanelComponent: React.FC<AdvancedPanelOptions> = ({ parameters, isDarkMode = true }) => {
  const {
    recordingVideoType,
    recordingDisplayType,
    recordingBackgroundColor,
    recordingNameTagsColor,
    recordingOrientationVideo,
    recordingNameTags,
    recordingAddText,
    recordingCustomText,
    recordingCustomTextPosition,
    recordingCustomTextColor,
    updateRecordingVideoType,
    updateRecordingDisplayType,
    updateRecordingBackgroundColor,
    updateRecordingNameTagsColor,
    updateRecordingOrientationVideo,
    updateRecordingNameTags,
    updateRecordingAddText,
    updateRecordingCustomText,
    updateRecordingCustomTextPosition,
    updateRecordingCustomTextColor,
    eventType,
  } = parameters;

  const [selectedOrientationVideo, setSelectedOrientationVideo] = useState(recordingOrientationVideo);
  const [selectedRecordingNameTags, setSelectedRecordingNameTags] = useState(recordingNameTags);
  const [selectedRecordingVideoType, setSelectedRecordingVideoType] = useState(recordingVideoType);
  const [selectedRecordingDisplayType, setSelectedRecordingDisplayType] = useState(recordingDisplayType);
  const [recordingText, setRecordingText] = useState(recordingAddText);
  const [customText, setCustomText] = useState(recordingCustomText);
  const [recordingPosition, setRecordingPosition] = useState(recordingCustomTextPosition);

  const validateTextInput = (input: string) => {
    const regex = /^[a-zA-Z0-9\s]{1,40}$/;
    return regex.test(input);
  };

  const handleTextChange = (value: string | boolean) => {
    const isTrue = value === 'true' || value === true;
    setRecordingText(isTrue);
    updateRecordingAddText(isTrue);
  };

  const onChangeTextHandler = (text: string) => {
    if (text.length === 0 || validateTextInput(text)) {
      updateRecordingCustomText(text);
      setCustomText(text);
    }
  };

  useEffect(() => {
    setSelectedOrientationVideo(recordingOrientationVideo);
  }, [recordingOrientationVideo]);

  const handleColorChange = (selectedColor: string, color: string) => {
    switch (selectedColor) {
      case 'backgroundColor':
        updateRecordingBackgroundColor(color);
        break;
      case 'customTextColor':
        updateRecordingCustomTextColor(color);
        break;
      case 'nameTagsColor':
        updateRecordingNameTagsColor(color);
        break;
      default:
        break;
    }
  };

  const renderOption = (item: AdvancedOptionItem) => (
    <option key={item.value} value={item.value} title={item.tooltip || item.label} style={optionStyle(isDarkMode)}>
      {item.label}
    </option>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: MediasfuSpacing.sm }}>
      <div style={sectionStyle(isDarkMode)}>
        <div style={labelStyle(isDarkMode)}>Video Type</div>
        <ModernTooltip message={getOptionTooltip(recordingVideoTypeItems, selectedRecordingVideoType)} isDarkMode={isDarkMode}>
          <div style={{ width: '100%' }}>
            <select
              aria-label="Recording video type"
              value={selectedRecordingVideoType}
              onChange={(e) => {
                updateRecordingVideoType(e.target.value);
                setSelectedRecordingVideoType(e.target.value);
              }}
              style={selectStyle(isDarkMode)}
            >
              {recordingVideoTypeItems.map(renderOption)}
            </select>
          </div>
        </ModernTooltip>
      </div>

      {eventType !== 'broadcast' && (
        <div style={sectionStyle(isDarkMode)}>
          <div style={labelStyle(isDarkMode)}>Display Type</div>
          <ModernTooltip message={getOptionTooltip(recordingDisplayTypeItems, selectedRecordingDisplayType)} isDarkMode={isDarkMode}>
            <div style={{ width: '100%' }}>
              <select
                aria-label="Recording display type"
                value={selectedRecordingDisplayType}
                onChange={(e) => {
                  const value = e.target.value as 'video' | 'media' | 'all';
                  updateRecordingDisplayType(value);
                  setSelectedRecordingDisplayType(value);
                }}
                style={selectStyle(isDarkMode)}
              >
                {recordingDisplayTypeItems.map(renderOption)}
              </select>
            </div>
          </ModernTooltip>
        </div>
      )}

      <div style={sectionStyle(isDarkMode)}>
        <div style={labelStyle(isDarkMode)}>Background Color</div>
        <div
          style={{
            backgroundColor: recordingBackgroundColor,
            padding: '6px 10px',
            borderRadius: MediasfuBorders.sm,
            border: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
            marginBottom: MediasfuSpacing.xs,
          }}
        >
          {recordingBackgroundColor}
        </div>
        <input
          type="color"
          value={recordingBackgroundColor}
          onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
          style={{ width: 50, height: 32, cursor: 'pointer', border: 'none' }}
        />
      </div>

      <div style={sectionStyle(isDarkMode)}>
        <div style={labelStyle(isDarkMode)}>Add Text</div>
        <ModernTooltip
          message={recordingText ? 'Disable custom overlay text' : 'Enable custom overlay text'}
          isDarkMode={isDarkMode}
        >
          <div style={{ width: '100%' }}>
            <select
              aria-label="Toggle custom text"
              value={recordingText.toString()}
              onChange={(e) => handleTextChange(e.target.value)}
              style={selectStyle(isDarkMode)}
            >
              {['true', 'false'].map((value) => (
                <option
                  key={value}
                  value={value}
                  style={optionStyle(isDarkMode)}
                >
                  {value === 'true' ? 'True' : 'False'}
                </option>
              ))}
            </select>
          </div>
        </ModernTooltip>
      </div>

      {recordingText && (
        <>
          <div style={sectionStyle(isDarkMode)}>
            <div style={labelStyle(isDarkMode)}>Custom Text</div>
            <input
              type="text"
              value={customText}
              onChange={(e) => onChangeTextHandler(e.target.value)}
              style={inputStyle(isDarkMode)}
              maxLength={40}
            />
            <div style={helperTextStyle(isDarkMode)}>
              Alphanumeric, max 40 chars
            </div>
          </div>

          <div style={sectionStyle(isDarkMode)}>
            <div style={labelStyle(isDarkMode)}>Text Position</div>
            <ModernTooltip message={getOptionTooltip(recordingTextPositionItems, recordingPosition)} isDarkMode={isDarkMode}>
              <div style={{ width: '100%' }}>
                <select
                  aria-label="Custom text position"
                  value={recordingPosition}
                  onChange={(e) => {
                    setRecordingPosition(e.target.value);
                    updateRecordingCustomTextPosition(e.target.value);
                  }}
                  style={selectStyle(isDarkMode)}
                >
                  {recordingTextPositionItems.map(renderOption)}
                </select>
              </div>
            </ModernTooltip>
          </div>

          <div style={sectionStyle(isDarkMode)}>
            <div style={labelStyle(isDarkMode)}>Text Color</div>
            <input
              type="color"
              value={recordingCustomTextColor}
              onChange={(e) => handleColorChange('customTextColor', e.target.value)}
              style={{ width: 50, height: 32, cursor: 'pointer', border: 'none' }}
            />
          </div>
        </>
      )}

      <div style={sectionStyle(isDarkMode)}>
        <div style={labelStyle(isDarkMode)}>Name Tags</div>
        <ModernTooltip message={getOptionTooltip(recordingNameTagToggleItems, selectedRecordingNameTags.toString())} isDarkMode={isDarkMode}>
          <div style={{ width: '100%' }}>
            <select
              aria-label="Name tags toggle"
              value={selectedRecordingNameTags.toString()}
              onChange={(e) => {
                const val = e.target.value === 'true';
                setSelectedRecordingNameTags(val);
                updateRecordingNameTags(val);
              }}
              style={selectStyle(isDarkMode)}
            >
              {recordingNameTagToggleItems.map(renderOption)}
            </select>
          </div>
        </ModernTooltip>
      </div>

      <div style={sectionStyle(isDarkMode)}>
        <div style={labelStyle(isDarkMode)}>Name Tags Color</div>
        <input
          type="color"
          value={recordingNameTagsColor}
          onChange={(e) => handleColorChange('nameTagsColor', e.target.value)}
          style={{ width: 50, height: 32, cursor: 'pointer', border: 'none' }}
        />
      </div>

      <div style={sectionStyle(isDarkMode)}>
        <div style={labelStyle(isDarkMode)}>Orientation</div>
        <ModernTooltip message={getOptionTooltip(recordingOrientationItems, selectedOrientationVideo)} isDarkMode={isDarkMode}>
          <div style={{ width: '100%' }}>
            <select
              aria-label="Recording orientation"
              value={selectedOrientationVideo}
              onChange={(e) => {
                setSelectedOrientationVideo(e.target.value);
                updateRecordingOrientationVideo(e.target.value);
              }}
              style={selectStyle(isDarkMode)}
            >
              {recordingOrientationItems.map(renderOption)}
            </select>
          </div>
        </ModernTooltip>
      </div>
    </div>
  );
};

export default AdvancedPanelComponent;
