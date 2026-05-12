export interface SoundPlayerOptions {
  soundUrl: string;
}

// Export the type definition for the function
export type SoundPlayerType = (options: SoundPlayerOptions) => void | Promise<void>;

/**
 * Plays a sound from a given URL.
 * 
 * @param {SoundPlayerOptions} options - The options for the sound player.
 * @param {string} options.soundUrl - The URL of the sound to play.
 * 
 * @returns {void | Promise<void>}
 * 
 * @example
 * ```typescript
 * SoundPlayer({ soundUrl: 'https://example.com/sound.mp3' });
 * ```
 */

export const SoundPlayer = async ({ soundUrl }: SoundPlayerOptions): Promise<void> => {
  if (!soundUrl || typeof Audio === 'undefined') {
    return;
  }

  try {
    const audio = new Audio(soundUrl);
    await audio.play();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};
