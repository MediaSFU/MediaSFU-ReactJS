 
import { connectSocket } from "../sockets/SocketManager";
import { newPipeProducer } from "./socketReceiveMethods/newPipeProducer";
import { producerClosed } from "./socketReceiveMethods/producerClosed";
import { joinConsumeRoom } from "./socketReceiveMethods/joinConsumeRoom";
import { Device } from 'mediasoup-client/lib/types';
import {
  ReorderStreamsParameters, ReorderStreamsType, NewPipeProducerParameters, NewPipeProducerType, ProducerClosedType,
  ProducerClosedParameters, JoinConsumeRoomType, JoinConsumeRoomParameters, ConsumeSocket
} from '../@types/types';

export interface ConnectIpsParameters extends ReorderStreamsParameters, JoinConsumeRoomParameters, ProducerClosedParameters, NewPipeProducerParameters {
  audioOnlyStreams: NewPipeProducerParameters['audioOnlyStreams'];
  updateAudioOnlyStreams: NewPipeProducerParameters['updateAudioOnlyStreams'];
  device: Device | null;
  roomRecvIPs: string[];
  updateRoomRecvIPs: (roomRecvIPs: string[]) => void;
  updateConsume_sockets: (consume_sockets: ConsumeSocket[]) => void;

  // mediasfu functions
  reorderStreams: ReorderStreamsType;
  getUpdatedAllParams: () => ConnectIpsParameters;
  [key: string]: any;
}

export interface ConnectIpsOptions {
  consume_sockets: ConsumeSocket[];
  remIP: string[];
  apiUserName: string;
  apiKey?: string;
  apiToken: string;
  newProducerMethod?: NewPipeProducerType;
  closedProducerMethod?: ProducerClosedType;
  joinConsumeRoomMethod?: JoinConsumeRoomType;
  parameters: ConnectIpsParameters;
}

// Export the type definition for the function
export type ConnectIpsType = (options: ConnectIpsOptions) => Promise<[Record<string, any>[], string[]]>;

// Scope pending connections to the caller's socket collection. This prevents
// overlapping room/domain updates from opening the same consume endpoint more
// than once without sharing sockets between independent room engines.
const pendingConsumeConnections = new WeakMap<
  object,
  Map<string, Promise<boolean>>
>();

const normalizeConsumeEndpoint = (ip: string): string =>
  ip.trim().toLowerCase().replace(/\.$/, "");

const hasConsumeEndpoint = (
  consumeSockets: ConsumeSocket[],
  endpoint: string
): boolean => consumeSockets.some((socketObj) => {
  const ip = Object.keys(socketObj)[0];
  return Boolean(ip) && normalizeConsumeEndpoint(ip) === endpoint;
});

async function reserveConsumeEndpoint(
  consumeSockets: ConsumeSocket[],
  ip: string,
  reservationOwner: object = consumeSockets
): Promise<((connected?: boolean) => void) | null> {
  const endpoint = normalizeConsumeEndpoint(ip);
  if (!endpoint || endpoint === "none") return null;

  let pendingForSockets = pendingConsumeConnections.get(reservationOwner);
  if (!pendingForSockets) {
    pendingForSockets = new Map<string, Promise<boolean>>();
    pendingConsumeConnections.set(reservationOwner, pendingForSockets);
  }

  while (true) {
    if (hasConsumeEndpoint(consumeSockets, endpoint)) return null;

    const pending = pendingForSockets.get(endpoint);
    if (pending) {
      if (await pending) return null;
      continue;
    }

    let resolvePending!: (connected: boolean) => void;
    const reservation = new Promise<boolean>((resolve) => {
      resolvePending = resolve;
    });
    pendingForSockets.set(endpoint, reservation);

    return (didConnect = false) => {
      if (pendingForSockets?.get(endpoint) === reservation) {
        pendingForSockets.delete(endpoint);
        if (pendingForSockets.size === 0) {
          pendingConsumeConnections.delete(reservationOwner);
        }
      }
      resolvePending(didConnect === true);
    };
  }
}

/**
 * Connects to remote IPs and manages socket connections.
 *
 * @param {ConnectIpsOptions} options - The options for connecting IPs.
 * @param {Record<string, any>[]} options.consume_sockets - The array of current socket connections.
 * @param {string[]} options.remIP - The list of remote IPs to connect to.
 * @param {string} options.apiUserName - The API username for authentication.
 * @param {string} [options.apiKey] - The API key for authentication.
 * @param {string} [options.apiToken] - The API token for authentication.
 * @param {Function} [options.newProducerMethod=newPipeProducer] - The method to handle new pipe producer events.
 * @param {Function} [options.closedProducerMethod=producerClosed] - The method to handle producer closed events.
 * @param {Function} [options.joinConsumeRoomMethod=joinConsumeRoom] - The method to handle joining a consuming room.
 * @param {ConnectIpsParameters} options.parameters - Additional parameters.
 * @param {string[]} options.parameters.roomRecvIPs - The list of IPs that have been received in the room.
 * @param {Function} options.parameters.updateRoomRecvIPs - The function to update the room received IPs.
 * @param {Function} options.parameters.updateConsume_sockets - The function to update the consume sockets.
 *
 * @returns {Promise<[Record<string, any>[], string[]]>} A promise that resolves to an array containing the updated consume sockets and room received IPs.
 *
 * @throws Will throw an error if required parameters are missing or if there is an issue connecting to a remote IP.
 * 
 * @example
 * const options = {
 *   consume_sockets: [],
 *   remIP: ['ip1', 'ip2'],
 *   apiUserName: 'username',
 *   apiKey: 'apikey',
 *   apiToken: 'token',
 *   parameters: {
 *     roomRecvIPs: [],
 *     updateRoomRecvIPs: updateRoomRecvIPsFunction,
 *     updateConsume_sockets: updateConsumeSocketsFunction,
 *   },
 * };
 * 
 * connectIps(options)
 *   .then(([consume_sockets, roomRecvIPs]) => {
 *     console.log('Connected IPs:', consume_sockets);
 *     console.log('Room received IPs:', roomRecvIPs);
 *   });
 */

export const connectIps = async ({
  consume_sockets,
  remIP,
  apiUserName,
  apiKey,
  apiToken,

  // mediasfu methods
  newProducerMethod = newPipeProducer,
  closedProducerMethod = producerClosed,
  joinConsumeRoomMethod = joinConsumeRoom,
  parameters,
}: ConnectIpsOptions): Promise<[Record<string, any>[], string[]]> => {
  try {
    const { roomRecvIPs, updateRoomRecvIPs, updateConsume_sockets } = parameters;

    if (!consume_sockets || !remIP || !apiUserName || (!apiKey && !apiToken)) {
      console.log("Missing required parameters", {
        consume_sockets,
        remIP,
        apiUserName,
        apiToken,
      });
      return [consume_sockets, roomRecvIPs];
    }

    for (const ip of remIP) {
      const releaseReservation = await reserveConsumeEndpoint(
        consume_sockets,
        ip,
        parameters?.socket || consume_sockets
      );
      if (!releaseReservation) continue;

      let connected = false;
      try {
        // Connect to the remote socket using socket.io-client
        const remote_sock = await connectSocket({ apiUserName, apiKey, apiToken, link: `https://${ip}.mediasfu.com` });

        if (remote_sock.id) {
          let consumeRoomReady = false;
          const pendingProducers: Array<{
            producerId: string;
            islevel: string;
            isTranslation?: boolean;
            translationMeta?: {
              speakerId: string;
              speakerName: string;
              language: string;
              originalProducerId?: string;
              isSpeakerControlled?: boolean;
            };
          }> = [];

          // Check if the IP is in the roomRecvIPs, if not, add it
          if (!roomRecvIPs.includes(ip)) {
            roomRecvIPs.push(ip);
            updateRoomRecvIPs(roomRecvIPs);
          }

          // Handle new pipe producer event
          const consumeProducer = async ({ producerId, islevel, isTranslation, translationMeta }: { producerId: string; islevel: string; isTranslation?: boolean; translationMeta?: { speakerId: string; speakerName: string; language: string; originalProducerId?: string; isSpeakerControlled?: boolean } }) => {
            if (!consumeRoomReady) {
              pendingProducers.push({ producerId, islevel, isTranslation, translationMeta });
              return;
            }
            if (newProducerMethod) {
              await newProducerMethod({
                producerId,
                islevel,
                nsock: remote_sock,
                parameters,
                isTranslation,
                translationMeta,
              });
            }
          };
          remote_sock.on("new-pipe-producer", consumeProducer);

          // Handle producer closed event
          remote_sock.on("producer-closed", async ({ remoteProducerId }: { remoteProducerId: string }) => {
            if (closedProducerMethod) {
              await closedProducerMethod({ remoteProducerId, parameters });
            }
          });

          // Handle new consuming room by joining the room
          if (joinConsumeRoomMethod) {
            let data = await joinConsumeRoomMethod({
              remote_sock,
              apiToken,
              apiUserName,
              parameters,
            });
            if (!data.rtpCapabilities) {
              return [consume_sockets, roomRecvIPs];
            }
          }

          // Events can arrive after the socket connects but before it has
          // joined the consuming room. Emitting transport requests during that
          // window receives no acknowledgement and poisons global de-duplication.
          // The join's producer sweep covers current producers; flushing the
          // queue closes the event/sweep gap, and signal-level de-duplication
          // makes overlap harmless.
          const queuedProducers = pendingProducers.splice(0);
          consumeRoomReady = true;
          for (const producer of queuedProducers) {
            await consumeProducer(producer);
          }

          // Add the remote socket to the consume_sockets array
          consume_sockets.push({ [ip]: remote_sock });
          updateConsume_sockets(consume_sockets);
          connected = true;
        }
      } catch (error) {
        // Handle the error
        console.log("connectIps error", error);
      } finally {
        releaseReservation(connected);
      }
    }

    return [consume_sockets, roomRecvIPs];
  } catch (error) {
    // Handle the error
    console.log("connectIps error", error);
    return [consume_sockets, parameters.roomRecvIPs];
  }
};
