import io from 'socket.io-client';
import { connectSocket } from './SocketManager';
import { MediaSocketConnectError, describeMediaSocketError, isRetryableMediaSocketError } from './mediaSocketErrors';

jest.mock('socket.io-client', () => jest.fn());

const mockedIo = io as unknown as jest.Mock;

function fakeSocket() {
  const handlers = new Map<string, (...args: any[]) => void>();
  return {
    connected: false,
    on: jest.fn((event: string, handler: (...args: any[]) => void) => {
      handlers.set(event, handler);
    }),
    off: jest.fn((event: string, handler: (...args: any[]) => void) => {
      if (handlers.get(event) === handler) handlers.delete(event);
    }),
    disconnect: jest.fn(),
    trigger: (event: string, ...args: any[]) => handlers.get(event)?.(...args),
  } as any;
}

describe('connectSocket handshake lifecycle', () => {
  beforeEach(() => mockedIo.mockReset());

  it('disconnects and removes handshake listeners after connect_error', async () => {
    const socket = fakeSocket();
    mockedIo.mockReturnValue(socket);

    const connection = connectSocket({
      apiUserName: 'account',
      apiToken: 'a'.repeat(64),
      link: 'https://c00001.mediasfu.com',
    });
    await Promise.resolve();
    socket.trigger('connect_error', new Error('refused'));

    await expect(connection).rejects.toThrow('Error connecting to media socket: refused');
    expect(socket.disconnect).toHaveBeenCalledTimes(1);
    expect(socket.off).toHaveBeenCalledWith('connection-success', expect.any(Function));
    expect(socket.off).toHaveBeenCalledWith('connect_error', expect.any(Function));
    expect(socket.off).toHaveBeenCalledWith('disconnect', expect.any(Function));
  });

  it('removes only handshake listeners after connection succeeds', async () => {
    const socket = fakeSocket();
    mockedIo.mockReturnValue(socket);

    const connection = connectSocket({
      apiUserName: 'account',
      apiToken: 'a'.repeat(64),
      link: 'https://cc00001.mediasfu.com',
    });
    await Promise.resolve();
    socket.trigger('connection-success', { socketId: 'consume-1' });

    await expect(connection).resolves.toBe(socket);
    expect(socket.disconnect).not.toHaveBeenCalled();
    expect(socket.off).toHaveBeenCalledTimes(5);
  });

  const start = () => {
    const socket = fakeSocket();
    mockedIo.mockReturnValue(socket);
    const connection = connectSocket({
      apiUserName: 'account',
      apiToken: 'a'.repeat(64),
      link: 'https://c00001.mediasfu.com',
    });
    return { socket, connection };
  };

  it('reports a server rejection with its reason and stage, and does not mark it retryable', async () => {
    const { socket, connection } = start();
    await Promise.resolve();
    socket.trigger('connect');
    socket.trigger('connection-rejected', { reason: 'invalid-credentials', stage: 'api-check-rejected' });
    socket.trigger('disconnect', 'io server disconnect');

    const error = await connection.catch((e) => e);
    expect(error).toBeInstanceOf(MediaSocketConnectError);
    expect(error.phase).toBe('rejected');
    expect(error.reason).toBe('invalid-credentials');
    expect(error.stage).toBe('api-check-rejected');
    expect(error.retryable).toBe(false);
    expect(isRetryableMediaSocketError(error)).toBe(false);
    expect(error.message).toContain('Media server rejected the connection: invalid-credentials');
    expect(describeMediaSocketError(error)).toMatch(/did not accept these credentials/);
    expect(socket.disconnect).toHaveBeenCalledTimes(1);
  });

  it('keeps transient rejections retryable and maps unknown reasons', async () => {
    const { socket, connection } = start();
    await Promise.resolve();
    socket.trigger('connection-rejected', { reason: 'something-new' });
    const error = await connection.catch((e) => e);
    expect(error.reason).toBe('rejected-before-connection-success');
    expect(error.retryable).toBe(true);
  });

  it('says the transport never opened, with elapsed time and online state', async () => {
    const { socket, connection } = start();
    await Promise.resolve();
    socket.trigger('connect_error', new Error('websocket error'));
    const error = await connection.catch((e) => e);
    expect(error.phase).toBe('before-open');
    expect(error.transportError).toBe('websocket error');
    expect(typeof error.elapsedMs).toBe('number');
    expect(error.message).toMatch(/^Error connecting to media socket: websocket error \(phase: before-open, after \d+ ms/);
    expect(error.retryable).toBe(true);
  });

  it('says the socket closed after opening when the server drops it without a reason', async () => {
    const { socket, connection } = start();
    await Promise.resolve();
    socket.trigger('connect');
    socket.trigger('disconnect', 'io server disconnect');
    const error = await connection.catch((e) => e);
    expect(error.phase).toBe('after-open');
    expect(error.transportError).toBe('io server disconnect');
  });

  it('describes an offline device as a network problem', () => {
    const offline = new MediaSocketConnectError({ phase: 'before-open', elapsedMs: 3, online: false });
    expect(describeMediaSocketError(offline)).toMatch(/offline/);
    expect(offline.message).toContain('online: false');
    expect(describeMediaSocketError(new Error('x'))).toBe('Unable to connect. Check your credentials and try again.');
    expect(describeMediaSocketError(new MediaSocketConnectError({ phase: 'rejected', reason: 'meeting-minutes-unavailable', elapsedMs: 1 })))
      .toMatch(/no meeting minutes/);
  });

  it('closes a connected socket for good when a reconnect is refused permanently', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    try {
      let { socket, connection } = start();
      await Promise.resolve();
      socket.trigger('connection-success', { socketId: 's1' });
      await expect(connection).resolves.toBe(socket);
      // The room ended; Socket.IO reconnected on its own and the node refuses the old credentials.
      socket.trigger('connection-rejected', { reason: 'invalid-credentials', stage: 'api-check-rejected' });
      expect(socket.disconnect).toHaveBeenCalledTimes(1);
      socket.trigger('connection-rejected', { reason: 'invalid-credentials' });
      expect(socket.disconnect).toHaveBeenCalledTimes(1);

      ({ socket, connection } = start());
      await Promise.resolve();
      socket.trigger('connection-success', { socketId: 's2' });
      await connection;
      socket.trigger('connection-rejected', { reason: 'api-check-failed' });
      expect(socket.disconnect).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
      log.mockRestore();
    }
  });
});
