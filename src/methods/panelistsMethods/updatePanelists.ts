import { Socket } from "socket.io-client";
import { Participant, ShowAlert } from "../../@types/types";

export interface UpdatePanelistsOptions {
  socket: Socket;
  panelists: Participant[];
  roomName: string;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
}

export interface AddPanelistOptions {
  socket: Socket;
  participant: Participant;
  currentPanelists: Participant[];
  maxPanelists: number;
  roomName: string;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
}

export interface RemovePanelistOptions {
  socket: Socket;
  participant: Participant;
  roomName: string;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
}

// Export type definitions
export type UpdatePanelistsType = (options: UpdatePanelistsOptions) => Promise<void>;
export type AddPanelistType = (options: AddPanelistOptions) => Promise<boolean>;
export type RemovePanelistType = (options: RemovePanelistOptions) => Promise<void>;

/**
 * Updates the entire panelist list.
 * Only hosts (islevel === "2") can update panelists.
 *
 * @param {UpdatePanelistsOptions} options - Options for updating panelists.
 *
 * @example
 * ```typescript
 * await updatePanelists({
 *   socket,
 *   panelists: [participant1, participant2],
 *   roomName: "room123",
 *   member: "currentUser",
 *   islevel: "2",
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const updatePanelists = async ({
  socket,
  panelists,
  roomName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  member: _member,
  islevel,
  showAlert,
}: UpdatePanelistsOptions): Promise<void> => {
  // Only hosts can update panelists
  if (islevel !== "2") {
    showAlert?.({
      message: "Only the host can update panelists",
      type: "danger",
      duration: 3000,
    });
    return;
  }

  socket.emit(
    "updatePanelists",
    {
      panelists: panelists.map((p) => ({
        id: p.id,
        name: p.name,
      })),
      roomName,
    },
    (response: { success: boolean; reason?: string }) => {
      if (!response?.success) {
        showAlert?.({
          message: response?.reason || "Failed to update panelists",
          type: "danger",
          duration: 3000,
        });
      }
    }
  );
};

/**
 * Adds a participant to the panelist list.
 * Respects the maximum panelist limit.
 *
 * @param {AddPanelistOptions} options - Options for adding a panelist.
 * @returns {Promise<boolean>} True if added successfully, false otherwise.
 *
 * @example
 * ```typescript
 * const success = await addPanelist({
 *   socket,
 *   participant: { id: "123", name: "John" },
 *   currentPanelists: [],
 *   maxPanelists: 10,
 *   roomName: "room123",
 *   member: "currentUser",
 *   islevel: "2",
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const addPanelist = async ({
  socket,
  participant,
  currentPanelists,
  maxPanelists,
  roomName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  member: _member,
  islevel,
  showAlert,
}: AddPanelistOptions): Promise<boolean> => {
  // Only hosts can add panelists
  if (islevel !== "2") {
    showAlert?.({
      message: "Only the host can add panelists",
      type: "danger",
      duration: 3000,
    });
    return false;
  }

  // Check if already a panelist
  if (currentPanelists.some((p) => p.id === participant.id)) {
    showAlert?.({
      message: `${participant.name} is already a panelist`,
      type: "info",
      duration: 3000,
    });
    return false;
  }

  // Check max limit
  if (currentPanelists.length >= maxPanelists) {
    showAlert?.({
      message: `Maximum panelist limit (${maxPanelists}) reached`,
      type: "danger",
      duration: 3000,
    });
    return false;
  }

  return new Promise((resolve) => {
    socket.emit(
      "addPanelist",
      {
        participantId: participant.id,
        participantName: participant.name,
        roomName,
      },
      (response: { success: boolean; reason?: string }) => {
        if (!response?.success) {
          showAlert?.({
            message: response?.reason || "Failed to add panelist",
            type: "danger",
            duration: 3000,
          });
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

/**
 * Removes a participant from the panelist list.
 *
 * @param {RemovePanelistOptions} options - Options for removing a panelist.
 *
 * @example
 * ```typescript
 * await removePanelist({
 *   socket,
 *   participant: { id: "123", name: "John" },
 *   roomName: "room123",
 *   member: "currentUser",
 *   islevel: "2",
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const removePanelist = async ({
  socket,
  participant,
  roomName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  member: _member,
  islevel,
  showAlert,
}: RemovePanelistOptions): Promise<void> => {
  // Only hosts can remove panelists
  if (islevel !== "2") {
    showAlert?.({
      message: "Only the host can remove panelists",
      type: "danger",
      duration: 3000,
    });
    return;
  }

  socket.emit(
    "removePanelist",
    {
      participantId: participant.id,
      participantName: participant.name,
      roomName,
    },
    (response: { success: boolean; reason?: string }) => {
      if (!response?.success) {
        showAlert?.({
          message: response?.reason || "Failed to remove panelist",
          type: "danger",
          duration: 3000,
        });
      }
    }
  );
};
