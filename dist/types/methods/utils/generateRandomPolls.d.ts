import { Poll } from "../../@types/types";
export interface GenerateRandomPollsOptions {
    numberOfPolls: number;
}
export type GenerateRandomPollsType = (options: GenerateRandomPollsOptions) => Poll[];
/**
 * Generates an array of random poll objects.
 *
 * @param {GenerateRandomPollsOptions} options - An object containing the number of polls to generate.
 * @param {number} options.numberOfPolls - The number of random polls to generate.
 * @returns {Poll[]} An array of random poll objects.
 *
 * @example
 * ```typescript
 * generateRandomPolls({ numberOfPolls: 3 });
 * // Returns an array of Poll objects, e.g., [
 * //   { id: "1", question: "Random Question 1", type: "yesNo", options: ["Yes", "No"], votes: [0, 0], status: "inactive", voters: {} },
 * //   { id: "2", question: "Random Question 2", type: "custom", options: ["Option 1", "Option 2", "Option 3"], votes: [0, 0, 0], status: "inactive", voters: {} },
 * //   { id: "3", question: "Random Question 3", type: "trueFalse", options: ["True", "False"], votes: [0, 0], status: "inactive", voters: {} }
 * // ]
 * ```
 */
declare const generateRandomPolls: ({ numberOfPolls }: GenerateRandomPollsOptions) => Poll[];
export { generateRandomPolls };
//# sourceMappingURL=generateRandomPolls.d.ts.map