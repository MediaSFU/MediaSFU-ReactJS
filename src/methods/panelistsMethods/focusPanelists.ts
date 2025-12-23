import { Socket } from "socket.io-client";
import { ShowAlert } from "../../@types/types";

export interface FocusPanelistsOptions {
  socket: Socket;
  roomName: string;
  member: string;
  islevel: string;
  focusEnabled: boolean;
  muteOthersMic?: boolean;
  muteOthersCamera?: boolean;
  showAlert?: ShowAlert;
}

export interface UnfocusPanelistsOptions {
  socket: Socket;
  roomName: string;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
}

// Export type definitions
export type FocusPanelistsType = (options: FocusPanelistsOptions) => Promise<void>;
export type UnfocusPanelistsType = (options: UnfocusPanelistsOptions) => Promise<void>;

/**
 * Focuses the display on panelists only.
 * When enabled, only panelists appear on the grid.
 * Optionally mutes other participants' mic and/or camera.
 *
 * @param {FocusPanelistsOptions} options - Options for focusing panelists.
 *
 * @example
 * ```typescript
 * await focusPanelists({
 *   socket,
 *   roomName: "room123",
 *   member: "currentUser",
 *   islevel: "2",
 *   focusEnabled: true,
 *   muteOthersMic: true,
 *   muteOthersCamera: false,
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const focusPanelists = async ({
  socket,
  roomName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  member: _member,
  islevel,
  focusEnabled,
  muteOthersMic = false,
  muteOthersCamera = false,
  showAlert,
}: FocusPanelistsOptions): Promise<void> => {
  // Only hosts can focus panelists
  if (islevel !== "2") {
    showAlert?.({
      message: "Only the host can focus panelists",
      type: "danger",
      duration: 3000,
    });
    return;
  }

  socket.emit(
    "focusPanelists",
    {
      roomName,
      focusEnabled,
      muteOthersMic,
      muteOthersCamera,
    },
    (response: { success: boolean; reason?: string }) => {
      if (!response?.success) {
        showAlert?.({
          message: response?.reason || "Failed to focus panelists",
          type: "danger",
          duration: 3000,
        });
      } else if (focusEnabled) {
        let message = "Panelist focus enabled";
        if (muteOthersMic && muteOthersCamera) {
          message += " (others' mic & camera muted)";
        } else if (muteOthersMic) {
          message += " (others' mic muted)";
        } else if (muteOthersCamera) {
          message += " (others' camera muted)";
        }
        showAlert?.({
          message,
          type: "success",
          duration: 3000,
        });
      }
    }
  );
};

/**
 * Disables panelist focus mode.
 * All participants will be shown on the grid again.
 *
 * @param {UnfocusPanelistsOptions} options - Options for unfocusing panelists.
 *
 * @example
 * ```typescript
 * await unfocusPanelists({
 *   socket,
 *   roomName: "room123",
 *   member: "currentUser",
 *   islevel: "2",
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const unfocusPanelists = async ({
  socket,
  roomName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  member: _member,
  islevel,
  showAlert,
}: UnfocusPanelistsOptions): Promise<void> => {
  // Only hosts can unfocus panelists
  if (islevel !== "2") {
    showAlert?.({
      message: "Only the host can unfocus panelists",
      type: "danger",
      duration: 3000,
    });
    return;
  }

  socket.emit(
    "focusPanelists",
    {
      roomName,
      focusEnabled: false,
      muteOthersMic: false,
      muteOthersCamera: false,
    },
    (response: { success: boolean; reason?: string }) => {
      if (!response?.success) {
        showAlert?.({
          message: response?.reason || "Failed to unfocus panelists",
          type: "danger",
          duration: 3000,
        });
      } else {
        showAlert?.({
          message: "Panelist focus disabled",
          type: "info",
          duration: 3000,
        });
      }
    }
  );
};
