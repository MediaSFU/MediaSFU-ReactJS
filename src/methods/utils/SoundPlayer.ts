export interface SoundPlayerOptions {
  soundUrl: string;
}

// Export the type definition for the function
export type SoundPlayerType = (options: SoundPlayerOptions) => void;

/**
 * Plays a sound from a given URL.
 * 
 * @param {SoundPlayerOptions} options - The options for the sound player.
 * @param {string} options.soundUrl - The URL of the sound to play.
 * 
 * @returns {void}
 * 
 * @example
 * ```typescript
 * SoundPlayer({ soundUrl: 'https://example.com/sound.mp3' });
 * ```
 */
export const SoundPlayer = ({ soundUrl }: SoundPlayerOptions): void => {
  /**
   * Plays a sound from the specified URL.
   * @function
   * @param {string} url - The URL of the sound to play.
   */
  const playSound = (url: string): void => {
    const audio = new Audio(url);
    audio.play().catch((error) => console.error('Error playing sound:', error));
  };

  if (soundUrl) {
    playSound(soundUrl);
  }
};
