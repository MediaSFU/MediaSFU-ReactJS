import { ConnectIpsType, ConnectIpsParameters, AltDomains, ConsumeSocket } from "../../@types/types";
import { RtpCapabilities } from 'mediasoup-client/lib/types';
export interface GetDomainsParameters extends ConnectIpsParameters {
    roomRecvIPs: string[];
    rtpCapabilities: RtpCapabilities | null;
    consume_sockets: ConsumeSocket[];
    connectIps: ConnectIpsType;
    getUpdatedAllParams: () => GetDomainsParameters;
    [key: string]: any;
}
export interface GetDomainsOptions {
    domains: string[];
    alt_domains: AltDomains;
    apiUserName: string;
    apiKey: string;
    apiToken: string;
    parameters: GetDomainsParameters;
}
export type GetDomainsType = (options: GetDomainsOptions) => Promise<void>;
/**
 * Asynchronously processes domain information and connects to specified IPs.
 *
 * @param {Object} options - The options for the getDomains function.
 * @param {string[]} options.domains - An array of domain names to process.
 * @param {Record<string, string>} options.alt_domains - A mapping of alternative domain names.
 * @param {string} options.apiUserName - The API username for authentication.
 * @param {string} options.apiKey - The API key for authentication.
 * @param {string} options.apiToken - The API token for authentication.
 * @param {Object} options.parameters - Additional parameters for processing.
 * @param {string[]} options.parameters.roomRecvIPs - An array of IPs that are already receiving.
 * @param {Function} options.parameters.consume_sockets - A function to get the latest consume sockets.
 * @param {Function} options.parameters.connectIps - A function to connect to the specified IPs.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @throws Will throw an error if the operation fails.
 */
export declare const getDomains: ({ domains, alt_domains, apiUserName, apiKey, apiToken, parameters, }: GetDomainsOptions) => Promise<void>;
//# sourceMappingURL=getDomains.d.ts.map