import { EventEmitter } from 'events';
import { attachTransportRecovery, clearFailedSendState } from './transportRecovery';

const fixture = () => {
  const transport: any = new EventEmitter();
  transport.id = 't';
  transport.appData = {};
  transport.observer = new EventEmitter();
  transport.closed = false;
  transport.close = jest.fn(() => { transport.closed = true; transport.observer.emit('close'); });
  transport.restartIce = jest.fn(async () => { transport.connectionState = 'connected'; transport.emit('connectionstatechange', 'connected'); });
  const socket: any = new EventEmitter();
  socket.id = 's';
  socket.connected = true;
  return { transport, socket };
};

describe('transport recovery', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());
  it('allows a transient disconnect to recover without an ICE request', () => {
    const { transport, socket } = fixture();
    const request = jest.fn();
    socket.on('transport-restart-ice', request);
    attachTransportRecovery(transport, socket, jest.fn());
    transport.emit('connectionstatechange', 'disconnected');
    jest.advanceTimersByTime(2000);
    transport.emit('connectionstatechange', 'connected');
    jest.advanceTimersByTime(5000);
    expect(request).not.toHaveBeenCalled();
    expect(transport.closed).toBe(false);
  });
  it('coalesces failures, restarts ICE, and preserves the transport', async () => {
    const { transport, socket } = fixture();
    const failed = jest.fn();
    const request = jest.fn((_payload, ack) => ack({ iceParameters: { usernameFragment: 'new' } }));
    socket.on('transport-restart-ice', request);
    attachTransportRecovery(transport, socket, failed);
    transport.emit('connectionstatechange', 'failed');
    transport.emit('connectionstatechange', 'failed');
    for (let i = 0; i < 8; i++) await Promise.resolve();
    expect(request).toHaveBeenCalledTimes(1);
    expect(transport.restartIce).toHaveBeenCalledTimes(1);
    expect(transport.appData.recoveryState).toBe('connected');
    expect(failed).not.toHaveBeenCalled();
    expect(transport.closed).toBe(false);
  });
  it('ignores a late acknowledgement after socket teardown', async () => {
    const { transport, socket } = fixture();
    let ack: any;
    socket.on('transport-restart-ice', (_payload: unknown, callback: any) => { ack = callback; });
    attachTransportRecovery(transport, socket, jest.fn());
    transport.emit('connectionstatechange', 'failed');
    socket.emit('disconnect');
    ack({ iceParameters: {} });
    for (let i = 0; i < 5; i++) await Promise.resolve();
    expect(transport.restartIce).not.toHaveBeenCalled();
  });
  it('does not clear a replacement transport state', () => {
    const updateAudioAlreadyOn = jest.fn();
    clearFailedSendState({ producerTransport: {}, updateAudioAlreadyOn }, {});
    expect(updateAudioAlreadyOn).not.toHaveBeenCalled();
  });
  it('bounds rejected restarts and clears state exactly once', async () => {
    const { transport, socket } = fixture();
    const failed = jest.fn();
    const request = jest.fn((_payload, ack) => ack({ error: 'Transport unavailable' }));
    socket.on('transport-restart-ice', request);
    attachTransportRecovery(transport, socket, failed);
    transport.emit('connectionstatechange', 'failed');
    for (let i = 0; i < 10; i++) await Promise.resolve();
    expect(request).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(2100);
    for (let i = 0; i < 10; i++) await Promise.resolve();
    expect(request).toHaveBeenCalledTimes(2);
    expect(failed).toHaveBeenCalledTimes(1);
    expect(transport.closed).toBe(true);
    expect(transport.appData.recoveryState).toBe('failed');
    transport.emit('connectionstatechange', 'failed');
    expect(request).toHaveBeenCalledTimes(2);
  });
});
