import { Socket } from "socket.io-client";
import { SignalNewConsumerTransportParameters, SignalNewConsumerTransportType } from "../@types/types";
export interface GetProducersPipedParameters extends SignalNewConsumerTransportParameters {
  member: string;

  // mediasfu functions
  signalNewConsumerTransport: SignalNewConsumerTransportType,
  [key: string]: any;
}

export interface GetProducersPipedOptions {
  nsock: Socket;
  islevel: string;
  parameters: GetProducersPipedParameters;
}

// Export the type definition for the function
export type GetProducersPipedType = (options: GetProducersPipedOptions) => Promise<void>;

/**
 * Retrieves piped producers and signals new consumer transport for each retrieved producer.
 *
 * @param {Object} options - The options for getting piped producers.
 * @param {WebSocket} options.nsock - The WebSocket instance used for communication.
 * @param {boolean} options.islevel - A flag indicating the level of the operation.
 * @param {Object} options.parameters - Additional parameters for the operation.
 * @param {string} options.parameters.member - The member identifier.
 * @param {Function} options.parameters.signalNewConsumerTransport - The function to signal new consumer transport.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @throws {Error} If an error occurs during the process of retrieving producers.
 */
export const getProducersPiped = async ({
  nsock,
  islevel,
  parameters,
}: GetProducersPipedOptions): Promise<void> => {
  try {
    // Destructure parameters
    const { member, signalNewConsumerTransport } = parameters;

    // Emit request to get piped producers using WebSocket
    await nsock.emit(
      "getProducersPipedAlt",
      { islevel, member },
      async (producerIds: string[]) => {
        // Check if producers are retrieved
        if (producerIds.length > 0) {
          // Signal new consumer transport for each retrieved producer
          await Promise.all(
            producerIds.map((id) =>
              signalNewConsumerTransport({
                remoteProducerId: id,
                islevel,
                nsock,
                parameters,
              })
            )
          );
        }
      }
    );
  } catch (error) {
    // Handle errors during the process of retrieving producers
    console.log("Error getting piped producers:", (error as Error).message);
  }
};