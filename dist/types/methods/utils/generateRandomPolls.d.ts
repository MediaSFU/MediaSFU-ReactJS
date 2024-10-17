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
 */
declare const generateRandomPolls: ({ numberOfPolls }: GenerateRandomPollsOptions) => Poll[];
export { generateRandomPolls };
//# sourceMappingURL=generateRandomPolls.d.ts.map