import io from 'socket.io-client';
import { connectSocket } from './SocketManager';

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
    expect(socket.off).toHaveBeenCalledTimes(3);
  });
});
