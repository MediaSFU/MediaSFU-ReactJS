export interface FormatNumberOptions {
    number: number;
}
export type FormatNumberType = (options: FormatNumberOptions) => Promise<string | undefined>;
/**
 * Formats a number into a string representation with appropriate suffixes (K, M, B).
 *
 * @param number - The number to format.
 * @returns A promise that resolves to a formatted string or undefined if the input is falsy.
 *
 * @example
 * ```typescript
 * formatNumber(500); // "500"
 * formatNumber(1500); // "1.5K"
 * formatNumber(1500000); // "1.5M"
 * formatNumber(1500000000); // "1.5B"
 * ```
 */
export declare const formatNumber: ({ number }: FormatNumberOptions) => Promise<string | undefined>;
//# sourceMappingURL=formatNumber.d.ts.map