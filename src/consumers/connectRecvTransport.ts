import { Socket } from "socket.io-client";
import { ConsumerResumeType, ConsumerResumeParameters, Transport as TransportType, Participant } from "../@types/types";
import { Consumer, Device, Transport } from "mediasoup-client/lib/types";

// Type for speaker translation state tracking
interface SpeakerTranslationState {
  speakerId: string;
  speakerName: string;
  inputLanguage: string;
  outputLanguage: string;
  originalProducerId: string;
  enabled: boolean;
}
interface Params {
  id: string;
  producerId: string;
  kind: string;
  rtpParameters: any;
  serverConsumerId: string;
  error?: string;
}

export interface ConnectRecvTransportParameters extends ConsumerResumeParameters {
  device: Device | null;
  consumerTransports: TransportType[];
  updateConsumerTransports: (transports: TransportType[]) => void;
  speakerTranslationStates?: Map<string, SpeakerTranslationState>;

  // mediasfu functions
  consumerResume: ConsumerResumeType;
  getUpdatedAllParams: () => ConnectRecvTransportParameters;
  [key: string]: any; // Extendable for additional parameters
}
export interface ConnectRecvTransportOptions {
  consumerTransport: Transport;
  remoteProducerId: string;
  serverConsumerTransportId: string;
  nsock: Socket;
  parameters: ConnectRecvTransportParameters;
}

// Export the type definition for the function
export type ConnectRecvTransportType = (options: ConnectRecvTransportOptions) => Promise<void>;

/**
 * Connects the receiving transport to consume media from a remote producer.
 *
 * @param {ConnectRecvTransportOptions} options - The options for connecting the receiving transport.
 * @param {Transport} options.consumerTransport - The transport used for consuming media.
 * @param {string} options.remoteProducerId - The ID of the remote producer.
 * @param {string} options.serverConsumerTransportId - The ID of the server consumer transport.
 * @param {Socket} options.nsock - The socket used for communication.
 * @param {ConnectRecvTransportParameters} options.parameters - The parameters for the connection.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 *
 * @throws Will throw an error if the connection or consumption fails.
 *
 * @example
 * ```typescript
 * const options = {
 *   consumerTransport,
 *   remoteProducerId: 'producer-id',
 *   serverConsumerTransportId: 'transport-id',
 *   nsock: socket,
 *   parameters: connectRecvTransportOptions,
 * };
 * 
 * connectRecvTransport(options)
 *   .then(() => {
 *     console.log('Transport connected and consuming media');
 *   })
 *   .catch((error) => {
 *     console.error('Error connecting transport:', error);
 *   });
 * ```
 */

export const connectRecvTransport = async ({
  consumerTransport,
  remoteProducerId,
  serverConsumerTransportId,
  nsock,
  parameters,
}: ConnectRecvTransportOptions): Promise<void> => {
  parameters = parameters.getUpdatedAllParams();

  const {
    device,
    consumerTransports,
    updateConsumerTransports,
    consumerResume,
  } = parameters;

  try {
    // Emit 'consume' event to signal consumption initiation
    nsock.emit(
      "consume",
      {
        rtpCapabilities: device!.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }: { params: Params }) => {
        if (params.error) {
          // Handle error
          console.log("consume error", params.error);
          return;
        }

        try {
          // Consume media using received parameters
          const consumer: Consumer = await consumerTransport.consume({
            id: params.id,
            producerId: params.producerId,
            kind: params.kind as "audio" | "video",
            rtpParameters: params.rtpParameters,
          });

          // Update consumerTransports array with the new consumer
          consumerTransports.push({
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
            socket_: nsock,
          });

          updateConsumerTransports(consumerTransports);

          // Extract track from the consumer
          const { track } = consumer;

          // Emit 'consumer-resume' event to signal consumer resumption
          nsock.emit(
            "consumer-resume",
            { serverConsumerId: params.serverConsumerId },
            async ({ resumed }: { resumed: boolean }) => {
              if (resumed) {
                // Consumer resumed and ready to be used
                try {
                  await consumerResume({
                    track,
                    kind: params.kind,
                    remoteProducerId,
                    params,
                    parameters,
                    nsock,
                    consumer,
                  });

                  // For audio consumers, check if the speaker has active translation
                  // If so, immediately pause this original audio consumer
                  // Wrap in try-catch to ensure translation issues don't break main consumer flow
                  if (params.kind === 'audio') {
                    try {
                      const updatedParams = parameters.getUpdatedAllParams();
                      const speakerTranslationStates = updatedParams.speakerTranslationStates as Map<string, SpeakerTranslationState> | undefined;
                      const participants = updatedParams.participants as Participant[] | undefined;

                      if (speakerTranslationStates && speakerTranslationStates.size > 0 && participants && participants.length > 0) {
                        // Find which participant this audio producer belongs to
                        const participant = participants.find(p => p.audioID === remoteProducerId);
                        
                        if (participant && participant.name) {
                          // Check if this speaker has active translation
                          const speakerState = speakerTranslationStates.get(participant.name);
                          
                          if (speakerState?.enabled && speakerState.originalProducerId === remoteProducerId) {
                            // Pause the consumer locally
                            consumer.pause();
                            
                            // Notify server to pause
                            nsock.emit(
                              'consumer-pause',
                              { serverConsumerId: params.serverConsumerId },
                              () => { /* Paused for translation */ }
                            );
                          }
                        }
                      }
                    } catch {
                      // Don't let translation check break the main consumer flow
                    }
                  }
                } catch (error) {
                  // Handle error
                  console.log("consumerResume error", error);
                }
              }
            }
          );
        } catch (error) {
          // Handle error
          console.log("consume error", error);
          return;
        }
      }
    );
  } catch (error) {
    // Handle error
    console.log("connectRecvTransport error", error);
  }
};
