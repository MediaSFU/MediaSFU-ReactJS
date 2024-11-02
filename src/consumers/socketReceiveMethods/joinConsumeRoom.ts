import { joinConRoom } from '../../producers/producerEmits/joinConRoom';
import { Device, RtpCapabilities } from 'mediasoup-client/lib/types';
import { Socket } from 'socket.io-client';
import { ReceiveAllPipedTransportsParameters, ReceiveAllPipedTransportsType, CreateDeviceClientType } from '../../@types/types';


export interface JoinConsumeRoomParameters extends ReceiveAllPipedTransportsParameters {
  roomName: string;
  islevel: string;
  member: string;
  device: Device | null;
  updateDevice: (device: Device | null) => void;

  // Mediasfu functions
  receiveAllPipedTransports: ReceiveAllPipedTransportsType;
  createDeviceClient: CreateDeviceClientType;
  getUpdatedAllParams: () => JoinConsumeRoomParameters;
  [key: string]: any;
}
export interface JoinConsumeRoomOptions {
  remote_sock: Socket;
  apiToken: string;
  apiUserName: string;
  parameters: JoinConsumeRoomParameters;
}

interface JoinConsumeRoomResponse {
  success: boolean;
  rtpCapabilities?: RtpCapabilities | null;
}

// Export the type definition for the function
export type JoinConsumeRoomType = (options: JoinConsumeRoomOptions) => Promise<JoinConsumeRoomResponse>;

/**
 * Joins a consumption room by sending a request to the server, handling device setup, and managing piped transports.
 * 
 * @function
 * @async
 * @param {Object} options - The configuration options.
 * @param {Socket} options.remote_sock - The remote socket for communication.
 * @param {string} options.apiToken - The API token for authentication.
 * @param {string} options.apiUserName - The API username for authentication.
 * @param {JoinConsumeRoomParameters} options.parameters - Additional parameters including room details and Mediasoup configurations.
 * @returns {Promise<JoinConsumeRoomResponse>} - An object indicating the success of joining the room and optional RTP capabilities.
 * @throws {Error} Throws an error if joining the room or setup fails.
 *
 * @example
 * import { joinConsumeRoom } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 * 
 * const apiToken = 'your-api-token';
 * const apiUserName = 'your-api-username';
 * const remote_sock = io("http://localhost:3000");
 * 
 * const parameters = {
 *   roomName: 'room-name',
 *   islevel: '2',
 *   member: 'user-id',
 *   device: null,
 *   updateDevice: (device) => console.log('Device updated:', device),
 *   receiveAllPipedTransports: (params) => console.log('Receiving all piped transports:', params),
 *   createDeviceClient: async (params) => { // Device client setup logic  },
 *   getUpdatedAllParams: () => console.log('Getting updated parameters'),
 * };
 * 
 * async function init() {
 *   try {
 *     const data = await joinConsumeRoom({
 *       remote_sock,
 *       apiToken,
 *       apiUserName,
 *       parameters,
 *     });
 *     console.log('Joined room:', data);
 *   } catch (error) {
 *     console.error('Error joining room:', error);
 *   }
 * }
 * init();
 * // Expected output: { success: true, rtpCapabilities: { ... } }
 */


export const joinConsumeRoom = async ({
  remote_sock,
  apiToken,
  apiUserName,
  parameters,
}: JoinConsumeRoomOptions): Promise<JoinConsumeRoomResponse> => {
  const {
    roomName,
    islevel,
    member,
    device,
    updateDevice,

    // Mediasfu functions
    receiveAllPipedTransports,
    createDeviceClient,
  } = parameters;

  try {
    // Join the consumption room
    const data: JoinConsumeRoomResponse = await joinConRoom({ socket: remote_sock, roomName, islevel, member, sec: apiToken, apiUserName });

    if (data && data.success) {
      // Setup media device if not already set
      if (!device) {
        if (data.rtpCapabilities) {
          const device_: Device | null = await createDeviceClient({
            rtpCapabilities: data.rtpCapabilities,
          });

          if (device_) {
            updateDevice(device_);
          }
        }
      }

      // Receive all piped transports
      await receiveAllPipedTransports({ nsock: remote_sock, parameters });
    }

    return data;
  } catch (error) {
    console.error('Error in joinConsumeRoom:', error);
    throw new Error('Failed to join the consumption room or set up necessary components.');
  }
};
