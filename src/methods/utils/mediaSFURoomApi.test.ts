import { createRoomOnMediaSFU } from './createRoomOnMediaSFU';
import {
  joinRoomOnMediaSFU,
  type CreateJoinRoomResponse,
} from './joinRoomOnMediaSFU';
import type {
  CreateMediaSFURoomOptions,
  JoinMediaSFURoomOptions,
} from '../../@types/types';

const validApiUserName = 'abcdefgh';
const validApiKey = 'a'.repeat(64);

const createPayload: CreateMediaSFURoomOptions = {
  action: 'create',
  duration: 60,
  capacity: 12,
  userName: 'host01',
};

const joinPayload: JoinMediaSFURoomOptions = {
  action: 'join',
  meetingID: 'room123',
  userName: 'guest01',
};

const createPendingKey = (payload: CreateMediaSFURoomOptions) =>
  `mediasfu_pending_create_${payload.userName}_${payload.duration}_${payload.capacity}`;

const mockSuccessResponse = (
  overrides: Partial<CreateJoinRoomResponse> = {}
) => ({
  ok: true,
  json: async () => ({
    message: 'Room ready',
    roomName: 'room123',
    publicURL: 'https://sp00008.mediasfu.com/meet/room123/secret',
    link: 'https://sp00008.mediasfu.com',
    secret: 'secret',
    success: true,
    ...overrides,
  }),
});

describe('MediaSFU room helpers', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    localStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    localStorage.clear();
  });

  it('rejects invalid create credentials before issuing a request', async () => {
    const result = await createRoomOnMediaSFU({
      payload: createPayload,
      apiUserName: 'short',
      apiKey: 'invalid',
    });

    expect(result).toEqual({
      data: { error: 'Invalid credentials' },
      success: false,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('creates rooms against production by default and clears the pending marker on success', async () => {
    fetchMock.mockResolvedValue(mockSuccessResponse());

    const result = await createRoomOnMediaSFU({
      payload: createPayload,
      apiUserName: validApiUserName,
      apiKey: validApiKey,
    });

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://mediasfu.com/v1/rooms/',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer ${validApiUserName}:${validApiKey}`,
        }),
        body: JSON.stringify(createPayload),
      })
    );
    expect(localStorage.getItem(createPendingKey(createPayload))).toBeNull();
  });

  it('blocks duplicate in-flight create requests', async () => {
    localStorage.setItem(
      createPendingKey(createPayload),
      JSON.stringify({ timestamp: Date.now() })
    );

    const result = await createRoomOnMediaSFU({
      payload: createPayload,
      apiUserName: validApiUserName,
      apiKey: validApiKey,
    });

    expect(result).toEqual({
      data: { error: 'Room creation already in progress' },
      success: false,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('routes create requests to Community Edition when a non-MediaSFU localLink is provided', async () => {
    fetchMock.mockResolvedValue(mockSuccessResponse({ roomName: 'ce-room' }));

    await createRoomOnMediaSFU({
      payload: createPayload,
      apiUserName: validApiUserName,
      apiKey: validApiKey,
      localLink: 'http://localhost:3000/',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/createRoom',
      expect.any(Object)
    );
  });

  it('joins rooms against production by default', async () => {
    fetchMock.mockResolvedValue(mockSuccessResponse());

    const result = await joinRoomOnMediaSFU({
      payload: joinPayload,
      apiUserName: validApiUserName,
      apiKey: validApiKey,
    });

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://mediasfu.com/v1/rooms/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(joinPayload),
      })
    );
  });

  it('routes join requests to Community Edition when a non-MediaSFU localLink is provided', async () => {
    fetchMock.mockResolvedValue(mockSuccessResponse());

    await joinRoomOnMediaSFU({
      payload: joinPayload,
      apiUserName: validApiUserName,
      apiKey: validApiKey,
      localLink: 'http://localhost:3000/',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/joinRoom',
      expect.any(Object)
    );
  });

  it('keeps HTTP error details when join fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
    });

    const result = await joinRoomOnMediaSFU({
      payload: joinPayload,
      apiUserName: validApiUserName,
      apiKey: validApiKey,
    });

    expect(result).toEqual({
      data: { error: 'Unable to join room, HTTP error! Status: 503' },
      success: false,
    });
  });
});