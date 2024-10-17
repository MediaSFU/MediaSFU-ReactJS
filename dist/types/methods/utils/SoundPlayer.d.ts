export interface SoundPlayerOptions {
    soundUrl: string;
}
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
export declare const SoundPlayer: ({ soundUrl }: SoundPlayerOptions) => void;
//# sourceMappingURL=SoundPlayer.d.ts.map