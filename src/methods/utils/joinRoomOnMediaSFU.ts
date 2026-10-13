
import {
  CreateMediaSFURoomOptions,
  JoinMediaSFURoomOptions
} from '../../@types/types';
import { resolveMediaSFURoomApi } from './resolveMediaSFURoomApi';
import { readRejoinCredential, rememberRejoinCredential } from './rejoinCredentialStore';

export type CreateJoinRoomType = (options: {
  payload: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
  apiUserName: string;
  apiKey: string;
  localLink?: string;
  /** Full Cloud rooms endpoint or compatible backend proxy URL. */
  roomsEndpoint?: string;
}) => Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}>;

export type CreateRoomOnMediaSFUType = (options: {
  payload: CreateMediaSFURoomOptions;
  apiUserName: string;
  apiKey: string;
  localLink?: string;
  /** Full Cloud rooms endpoint or compatible backend proxy URL. */
  roomsEndpoint?: string;
}) => Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}>;


export interface CreateJoinRoomResponse {
  message: string;
  roomName: string;
  secureCode?: string;
  publicURL: string;
  link: string;
  secret: string;
  success: boolean;
}

export interface CreateJoinRoomError {
  error: string;
  success?: boolean;
}

export type JoinRoomOnMediaSFUType = (options: {
  payload: JoinMediaSFURoomOptions;
  apiUserName: string;
  apiKey: string;
  localLink?: string;
  /** Full Cloud rooms endpoint or compatible backend proxy URL. */
  roomsEndpoint?: string;
}) => Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}>;

/**
 * Asynchronously joins a room on MediaSFU.
 *
 * This function sends a POST request to the MediaSFU API to join an existing room. 
 * It validates the provided credentials and constructs the appropriate API endpoint, 
 * including support for the Community Edition via a custom `localLink`.
 *
 * @param {object} options - Configuration options for joining the room.
 * @param {JoinMediaSFURoomOptions | CreateMediaSFURoomOptions} options.payload - The payload containing the room details and action (`join` or `create`).
 * @param {string} options.apiUserName - The API username, used for authentication.
 * @param {string} options.apiKey - The API key, used for authentication.
 * @param {string} [options.localLink=""] - The local link for Community Edition users. If provided, it overrides the default API URL.
 * 
 * @returns {Promise<{ 
*   data: CreateJoinRoomResponse | CreateJoinRoomError | null; 
*   success: boolean; 
* }>} A promise resolving to an object containing the API response:
* - `data`: The response object, either `CreateJoinRoomResponse` or `CreateJoinRoomError`.
* - `success`: Boolean indicating whether the operation was successful.
*
* @throws {Error} Throws an error if the request fails or if the provided credentials are invalid.
*
* @example
* ```ts
* const response = await joinRoomOnMediaSFU({
*   payload: {
*     action: 'join',
*     meetingID: '123456',
*     userName: 'user123',
*   },
*   apiUserName: 'yourAPIUSERNAME',
*   apiKey: 'yourAPIKEY',
*   localLink: 'https://your-mediasfu-server.example.com', // Optional for Community Edition
* });
*
* if (response.success) {
*   console.log('Joined room:', response.data);
* } else {
*   console.error('Failed to join room:', response.data?.error);
* }
* ```
*/


export const joinRoomOnMediaSFU: CreateJoinRoomType = async ({
  payload,
  apiUserName,
  apiKey,
  localLink = "",
  roomsEndpoint = "",
}: {
  payload: JoinMediaSFURoomOptions | CreateMediaSFURoomOptions;
  apiUserName: string;
  apiKey: string;
  localLink?: string;
  roomsEndpoint?: string;
}): Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}> => {
  try {
    if (
      !apiUserName ||
      !apiKey ||
      apiUserName === "yourAPIUSERNAME" ||
      apiKey === "yourAPIKEY" ||
      apiKey.length !== 64 ||
      apiUserName.length < 6
    ) {
      return { data: { error: "Invalid credentials" }, success: false };
    }

    const finalLink = resolveMediaSFURoomApi(localLink, 'joinRoom', roomsEndpoint);

    // Rejoin after a reload: prove this tab is the same participant with the credential it last received.
    const joinPayload = payload as JoinMediaSFURoomOptions & { rejoinSecret?: string };
    const isJoin = (payload as { action?: string })?.action === "join";
    const stored = isJoin ? readRejoinCredential(joinPayload.meetingID, joinPayload.userName) : null;
    const body = stored && !joinPayload.rejoinSecret ? { ...joinPayload, rejoinSecret: stored.secret } : payload;

    const response = await fetch(finalLink,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiUserName}:${apiKey}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      // The server still refuses the name (an older server, or the proof was not accepted): the stored credential
      // stays valid for the same participant, so reuse it. A revoked one (kick, ban) is refused when connecting.
      if (stored) {
        const refusal = await response.json().catch(() => null) as { error?: string } | null;
        if (/already taken/i.test(String(refusal?.error || ""))) {
          return {
            data: {
              message: "Room joined successfully",
              roomName: stored.roomName,
              publicURL: stored.publicURL || stored.link || "",
              link: stored.link || "",
              secret: stored.secret,
              success: true,
            },
            success: true,
          };
        }
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data?.secret && (isJoin || data?.roomName)) {
      rememberRejoinCredential({
        roomName: data.roomName || joinPayload.meetingID,
        userName: data.userName || (payload as { userName?: string }).userName || "",
        secret: data.secret,
        link: data.link,
        publicURL: data.publicURL,
      });
    }
    return { data, success: true };
  } catch (error) {
    const errorMessage = (
      error as { reason?: string; message?: string }
    ).reason || (
      error as { reason?: string; message?: string }
    ).message || 'unknown error';
    return {
      data: { error: `Unable to join room, ${errorMessage}` },
      success: false,
    };
  }
}
