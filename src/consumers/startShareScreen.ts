
import { StreamSuccessScreenType, StreamSuccessScreenParameters, ShowAlert } from "../@types/types";
import {
  buildDisplayMediaOptions,
  canCaptureDisplayAudio,
  shouldShareScreenAudio,
  ScreenAudioChoice,
  ScreenAudioMode,
} from "./screenAudio";
import { promptScreenAudioChoice } from "../components/miscComponents/ScreenAudioPrompt";
export interface StartShareScreenParameters extends StreamSuccessScreenParameters {
  shared: boolean;
  showAlert?: ShowAlert;
  updateShared: (shared: boolean) => void;
  mediaDevices: MediaDevices;
  onWeb: boolean;
  targetWidth?: number;
  targetHeight?: number;
  /** Set from the join response: the media server accepts screen audio. */
  supportsScreenAudio?: boolean;
  /** Ask the browser for the screen's audio too (default true; the browser's picker still lets the user decide). */
  screenAudioEnabled?: boolean;
  /** `ask` (default): offer "Screen + audio" / "Screen only" first; `always`: request audio; `never`: video only. */
  screenAudioMode?: ScreenAudioMode;
  /** Replace the default "share audio too?" dialog; resolve `audio`, `video` or `null` (cancel). */
  screenAudioPrompt?: () => Promise<ScreenAudioChoice>;
  /** Override browser detection of display-audio capture (Chromium desktop by default). */
  displayAudioCapable?: boolean;
  isDarkMode?: boolean;

  // mediasfu functions
  streamSuccessScreen: StreamSuccessScreenType;
  [key: string]: any;
}

export interface StartShareScreenOptions {
  parameters: StartShareScreenParameters;
}

// Export the type definition for the function
export type StartShareScreenType = (options: StartShareScreenOptions) => Promise<void>;

/**
 * Starts the screen sharing process.
 *
 * @param {StartShareScreenOptions} options - The options for starting screen sharing.
 * @param {Object} options.parameters - The parameters for screen sharing.
 * @param {boolean} options.parameters.shared - Indicates if the screen is currently being shared.
 * @param {Function} options.parameters.showAlert - Function to show alert messages.
 * @param {Function} options.parameters.updateShared - Function to update the shared state.
 * @param {MediaDevices} options.parameters.mediaDevices - The media devices available for screen sharing.
 * @param {boolean} options.parameters.onWeb - Indicates if the application is running on a web platform.
 * @param {number} [options.parameters.targetWidth] - The target width for screen sharing.
 * @param {number} [options.parameters.targetHeight] - The target height for screen sharing.
 * @param {Function} options.parameters.streamSuccessScreen - Function to handle successful screen sharing.
 * 
 * @returns {Promise<void>} A promise that resolves when the screen sharing process is complete.
 * 
 * @throws Will log an error message if there is an issue starting the screen share.
 *
 * @example
 * const options = {
 *   parameters: {
 *     shared: false,
 *     showAlert: showAlertFunction,
 *     updateShared: updateSharedFunction,
 *     mediaDevices: navigator.mediaDevices,
 *     onWeb: true,
 *     targetWidth: 1280,
 *     targetHeight: 720,
 *     streamSuccessScreen: streamSuccessFunction,
 *   },
 * };
 * 
 * startShareScreen(options)
 *   .then(() => {
 *     console.log('Screen sharing started successfully');
 *   })
 *   .catch(error => {
 *     console.error('Error starting screen share:', error);
 *   });
 */

export async function startShareScreen({ parameters }: StartShareScreenOptions): Promise<void> {
  let {
    shared,
    showAlert,
    updateShared,
    mediaDevices,
    onWeb,
    targetWidth = 1280,
    targetHeight = 720,
    supportsScreenAudio,
    screenAudioEnabled,
    screenAudioMode = "ask",
    screenAudioPrompt,
    displayAudioCapable,
    isDarkMode,

    streamSuccessScreen,
  } = parameters;

  try {
    if (!onWeb) {
      showAlert?.({
        message: "You cannot share screen while on mobile",
        type: "danger",
        duration: 3000,
      });
      return;
    }

    if (mediaDevices && mediaDevices.getDisplayMedia) {
      // Screen audio needs a server that accepts it and a browser that can capture it (Chromium desktop).
      let withAudio =
        shouldShareScreenAudio({ supportsScreenAudio, screenAudioEnabled, screenAudioMode }) &&
        (displayAudioCapable ?? canCaptureDisplayAudio());
      if (withAudio && screenAudioMode === "ask") {
        const choice = await (screenAudioPrompt ? screenAudioPrompt() : promptScreenAudioChoice({ isDarkMode }));
        if (choice === null) {
          updateShared(false);
          return;
        }
        withAudio = choice === "audio";
      }
      shared = true;
      await mediaDevices
        .getDisplayMedia(
          buildDisplayMediaOptions({
            targetWidth,
            targetHeight,
            withAudio,
          })
        )
        .then(async (stream: MediaStream) => {
          await streamSuccessScreen({ stream, parameters });
        })
        .catch(async () => {
          shared = false;
          showAlert?.({
            message: "Could not share screen, check and retry",
            type: "danger",
            duration: 3000,
          });
        });
    } else {
      showAlert?.({
        message: "Could not share screen, check and retry",
        type: "danger",
        duration: 3000,
      });
    }

    // Update the shared variable
    updateShared(shared);
  } catch (error) {
    console.log("Error starting screen share", error);
  }
}

