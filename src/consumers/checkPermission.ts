import { PermissionConfig } from "../methods/permissionsMethods/updatePermissionConfig";

export interface CheckPermissionOptions {
  audioSetting: string;
  videoSetting: string;
  screenshareSetting: string;
  chatSetting: string;
  permissionType: 'audioSetting' | 'videoSetting' | 'screenshareSetting' | 'chatSetting';
  // New optional fields for per-level permission overrides
  permissionConfig?: PermissionConfig | null;
  participantLevel?: string; // "0", "1", or "2" - the participant's level
}

// Export the type definition for the function
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

export async function checkPermission({ 
  permissionType, 
  audioSetting, 
  videoSetting, 
  screenshareSetting, 
  chatSetting,
  permissionConfig,
  participantLevel,
}: CheckPermissionOptions) {
  try {
    // Map permission types to permissionConfig capability names
    const permissionTypeToCapability: Record<string, keyof import("../methods/permissionsMethods/updatePermissionConfig").PermissionCapabilities> = {
      audioSetting: "useMic",
      videoSetting: "useCamera",
      screenshareSetting: "useScreen",
      chatSetting: "useChat",
    };

    // If permissionConfig is provided and participant has a valid level (not host)
    if (permissionConfig && participantLevel && participantLevel !== "2") {
      const levelKey = `level${participantLevel}` as "level0" | "level1";
      const levelConfig = permissionConfig[levelKey];
      
      if (levelConfig) {
        const capability = permissionTypeToCapability[permissionType];
        if (capability) {
          const configValue = levelConfig[capability];
          if (configValue === "allow") return 0;
          if (configValue === "approval") return 1;
          return 2; // "disallow"
        }
      }
    }

    // Fallback to room-wide eventSettings
    switch (permissionType) {
      case "audioSetting":
        if (audioSetting === "allow") {
          return 0;
        } else if (audioSetting === "approval") {
          return 1;
        } else {
          return 2;
        }
      case "videoSetting":
        if (videoSetting === "allow") {
          return 0;
        } else if (videoSetting === "approval") {
          return 1;
        } else {
          return 2;
        }
      case "screenshareSetting":
        if (screenshareSetting === "allow") {
          return 0;
        } else if (screenshareSetting === "approval") {
          return 1;
        } else {
          return 2;
        }
      case "chatSetting":
        if (chatSetting === "allow") {
          return 0;
        } else if (chatSetting === "approval") {
          return 1;
        } else {
          return 2;
        }
      default:
        return 2;
    }
  } catch {
    return 2;
  }
}
