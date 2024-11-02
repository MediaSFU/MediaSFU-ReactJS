export interface ValidateAlphanumericOptions {
    str: string;
}
export type ValidateAlphanumericType = (options: ValidateAlphanumericOptions) => Promise<boolean>;
/**
 * Validates if the given string contains only alphanumeric characters.
 *
 * @param {ValidateAlphanumericOptions} options - The options containing the string to validate.
 * @param {string} options.str - The string to be validated.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the string is alphanumeric, otherwise `false`.
 *
 * @example
 * ```typescript
 * const isValid = await validateAlphanumeric({ str: "abc123" });
 * console.log(isValid);
 * // Output: true
 * ```
 */
declare const validateAlphanumeric: ({ str }: ValidateAlphanumericOptions) => Promise<boolean>;
export { validateAlphanumeric };
//# sourceMappingURL=validateAlphanumeric.d.ts.map