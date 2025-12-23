import { PermissionConfig } from "../methods/permissionsMethods/updatePermissionConfig";
export interface CheckPermissionOptions {
    audioSetting: string;
    videoSetting: string;
    screenshareSetting: string;
    chatSetting: string;
    permissionType: 'audioSetting' | 'videoSetting' | 'screenshareSetting' | 'chatSetting';
    permissionConfig?: PermissionConfig | null;
    participantLevel?: string;
}
export type CheckPermissionType = (options: CheckPermissionOptions) => Promise<number>;
/**
 * Checks the permission based on the provided settings.
 *
 * If permissionConfig and participantLevel are provided, uses the per-level
 * configuration to determine permissions. Otherwise falls back to room-wide
 * eventSettings (audioSetting, videoSetting, etc.).
 *
 * @param {CheckPermissionOptions} options - The options for checking permissions.
 * @param {string} options.permissionType - The type of permission to check. Can be "audioSetting", "videoSetting", "screenshareSetting", or "chatSetting".
 * @param {string} options.audioSetting - The setting for audio permission. Can be "allow", "approval", or other.
 * @param {string} options.videoSetting - The setting for video permission. Can be "allow", "approval", or other.
 * @param {string} options.screenshareSetting - The setting for screenshare permission. Can be "allow", "approval", or other.
 * @param {string} options.chatSetting - The setting for chat permission. Can be "allow", "approval", or other.
 * @param {PermissionConfig} [options.permissionConfig] - Optional per-level permission configuration.
 * @param {string} [options.participantLevel] - The participant's level ("0", "1", or "2").
 * @returns {Promise<number>} - Returns 0 if the setting is "allow", 1 if the setting is "approval", and 2 for other settings or invalid permission types.
 * @throws Will throw an error if an unexpected error occurs during the permission check.
 *
 * @example
 * const options = {
 *   permissionType: 'audioSetting',
 *   audioSetting: 'allow',
 *   videoSetting: 'approval',
 *   screenshareSetting: 'approval',
 *   chatSetting: 'allow',
 *   // Optional: per-level config override
 *   permissionConfig: { level0: {...}, level1: {...} },
 *   participantLevel: "0",
 * };
 *
 * checkPermission(options)
 *   .then(result => {
 *     console.log('Permission result:', result);
 *   })
 *   .catch(error => {
 *     console.error('Error checking permission:', error);
 *   });
 */
export declare function checkPermission({ permissionType, audioSetting, videoSetting, screenshareSetting, chatSetting, permissionConfig, participantLevel, }: CheckPermissionOptions): Promise<1 | 0 | 2>;
//# sourceMappingURL=checkPermission.d.ts.map