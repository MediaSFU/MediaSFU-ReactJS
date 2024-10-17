import { Settings } from "../../@types/types";
export interface UpdateMediaSettingsOptions {
    settings: Settings;
    updateAudioSetting: (value: string) => void;
    updateVideoSetting: (value: string) => void;
    updateScreenshareSetting: (value: string) => void;
    updateChatSetting: (value: string) => void;
}
export type UpdateMediaSettingsType = (options: UpdateMediaSettingsOptions) => void;
/**
 * Updates the media settings by invoking the provided update functions for each setting.
 *
 * @param {UpdateMediaSettingsOptions} options - The options for updating media settings.
 * @param {Array} options.settings - An array containing the settings for audio, video, screenshare, and chat.
 * @param {Function} options.updateAudioSetting - Function to update the audio setting.
 * @param {Function} options.updateVideoSetting - Function to update the video setting.
 * @param {Function} options.updateScreenshareSetting - Function to update the screenshare setting.
 * @param {Function} options.updateChatSetting - Function to update the chat setting.
 *
 * @returns {void}
 */
export declare const updateMediaSettings: ({ settings, updateAudioSetting, updateVideoSetting, updateScreenshareSetting, updateChatSetting, }: UpdateMediaSettingsOptions) => void;
//# sourceMappingURL=updateMediaSettings.d.ts.map