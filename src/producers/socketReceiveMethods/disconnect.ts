import { ShowAlert } from "../../@types/types";
import { wasSessionReplaced } from "./sessionReplaced";

export interface DisconnectOptions {
  showAlert?: ShowAlert;
  redirectURL?: string;
  onWeb: boolean;
  updateValidated?: (isValidated: boolean) => void;
}

// Export the type definition for the function
export type DisconnectType = (options: DisconnectOptions) => Promise<void>;


/**
 * Disconnects the user from the specified room and bans them.
 *
 * @param {DisconnectUserSelfOptions} options - The options for disconnecting the user.
 * @param {string} options.member - The username of the member to disconnect.
 * @param {string} options.roomName - The name of the room from which the user will be disconnected.
 * @param {Socket} options.socket - The socket instance used to emit the disconnection request.
 * @returns {Promise<void>} A promise that resolves when the disconnection request has been emitted.
 *
 * @example
 * ```typescript
 * await disconnectUserSelf({
 *   member: "user123",
 *   roomName: "main-room",
 *   socket: socketInstance,
 * });
 * ```
 */

export const disconnect = async ({ showAlert, redirectURL, onWeb }: DisconnectOptions): Promise<void> => {
  // The server closed this connection because another tab or device took over: sessionReplaced already explained it,
  // and redirecting or alerting here would hide the "Use this one" choice.
  if (wasSessionReplaced()) return;


  // Redirect to the specified URL on the web
  if (onWeb && redirectURL) {
    window.location.href = redirectURL;
  } else {
    // Display an alert and update the validated state
    showAlert?.({
      message: "You have been disconnected from the session.",
      type: "danger",
      duration: 2000,
    });

    // Optionally update the validation state
    // if (parameters.updateValidated) {
    //   setTimeout(() => {
    //     parameters.updateValidated(false);
    //   }, 2000);
    // }
  }
};
