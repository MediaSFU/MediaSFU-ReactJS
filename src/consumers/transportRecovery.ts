/**
 * Bounded ICE recovery shared by sending and receiving transports.
 * Keeps tracks/producers alive while ICE is restarted on both endpoints.
 */
export function attachTransportRecovery(transport: any, socket: any, onFailure: () => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  let recovering = false;
  let attempts = 0;
  const socketId = socket.id;
  const listeners: Array<() => void> = [];
  const report = (state: string) => {
    transport.appData = { ...transport.appData, recoveryState: state };
    transport.observer?.emit('recoverychange', state);
  };
  const clearTimer = () => { if (timer) clearTimeout(timer); timer = undefined; };
  const current = () => !disposed && !transport.closed && socket.connected !== false && socket.id === socketId;
  const dispose = () => {
    disposed = true;
    clearTimer();
    listeners.splice(0).forEach(cancel => cancel());
    socket.off?.('disconnect', dispose);
    transport.off?.('connectionstatechange', changed);
    transport.observer?.off?.('close', dispose);
  };
  const failed = () => {
    if (disposed) return;
    report('failed');
    try { onFailure(); } catch (_) { /* UI callbacks must not prevent teardown. */ }
    try { transport.close(); } finally { dispose(); }
  };
  const waitConnected = () => new Promise<void>((resolve, reject) => {
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      transport.off?.('connectionstatechange', connected);
      const i = listeners.indexOf(cancel);
      if (i >= 0) listeners.splice(i, 1);
      error ? reject(error) : resolve();
    };
    const connected = (state: string) => { if (state === 'connected') finish(); };
    const cancel = () => finish(new Error('Recovery cancelled'));
    const deadline = setTimeout(() => finish(new Error('ICE recovery timed out')), 10000);
    listeners.push(cancel);
    transport.on('connectionstatechange', connected);
    if (transport.connectionState === 'connected') finish();
  });
  const restart = async () => {
    if (!current() || recovering) return;
    recovering = true;
    report('recovering');
    try {
      while (current() && attempts < 2) {
        attempts++;
        try {
          const iceParameters = await new Promise<any>((resolve, reject) => {
            let settled = false;
            const finish = (error?: Error, value?: any) => {
              if (settled) return;
              settled = true;
              clearTimeout(deadline);
              const i = listeners.indexOf(cancel);
              if (i >= 0) listeners.splice(i, 1);
              error ? reject(error) : resolve(value);
            };
            const cancel = () => finish(new Error('Recovery cancelled'));
            const deadline = setTimeout(() => finish(new Error('ICE restart acknowledgement timed out')), 8000);
            listeners.push(cancel);
            socket.emit('transport-restart-ice', { transportId: transport.id }, (response: any) => {
              if (!response?.iceParameters || response.error) finish(new Error(response?.error || 'Invalid ICE response'));
              else finish(undefined, response.iceParameters);
            });
          });
          if (!current()) return;
          await new Promise<void>((resolve, reject) => {
            let settled = false;
            const finish = (error?: Error) => {
              if (settled) return;
              settled = true;
              clearTimeout(deadline);
              const i = listeners.indexOf(cancel);
              if (i >= 0) listeners.splice(i, 1);
              error ? reject(error) : resolve();
            };
            const cancel = () => finish(new Error('Recovery cancelled'));
            const deadline = setTimeout(() => finish(new Error('Local ICE restart timed out')), 8000);
            listeners.push(cancel);
            Promise.resolve().then(() => {
              if (!current()) throw new Error('Recovery cancelled');
              return transport.restartIce({ iceParameters });
            }).then(() => finish(), error => finish(error));
          });
          if (!current()) return;
          await waitConnected();
          if (!current()) return;
          attempts = 0;
          report('connected');
          return;
        } catch (_) {
          if (!current()) return;
          if (transport.connectionState === 'connected') {
            attempts = 0;
            report('connected');
            return;
          }
          if (attempts < 2) {
            // Respect the server's two-second restart throttle, including
            // immediate acknowledgement failures. Teardown cancels the wait.
            await new Promise<void>(resolve => {
              const cancel = () => {
                clearTimeout(delay);
                const i = listeners.indexOf(cancel);
                if (i >= 0) listeners.splice(i, 1);
                resolve();
              };
              const delay = setTimeout(cancel, 2100);
              listeners.push(cancel);
            });
          }
        }
      }
      if (current()) failed();
    } finally {
      recovering = false;
    }
  };
  const changed = (state: string) => {
    if (disposed) return;
    if (state === 'connected') {
      clearTimer();
      if (!recovering) { attempts = 0; report('connected'); }
    } else if (state === 'disconnected') {
      if (recovering || timer) return;
      report('waiting');
      timer = setTimeout(() => { timer = undefined; void restart(); }, 3000);
    } else if (state === 'failed') {
      clearTimer();
      void restart();
    } else if (state === 'closed') dispose();
  };
  socket.on?.('disconnect', dispose);
  transport.on('connectionstatechange', changed);
  transport.observer?.once('close', dispose);
  return dispose;
}

/** Clear publishing indicators only if this is still the active transport. */
export function clearFailedSendState(parameters: any, transport: any, local = false) {
  const live = parameters.getCurrentParams?.() ?? parameters.getUpdatedAllParams?.() ?? parameters;
  if ((local ? live.localProducerTransport : live.producerTransport) !== transport) return;
  if (local) {
    live.updateLocalProducerTransport?.(null);
    live.updateLocalTransportCreated?.(false);
    return;
  }
  for (const kind of ['Audio', 'Video', 'Screen']) {
    const key = kind.toLowerCase();
    live['update' + kind + 'Producer']?.(null);
    live['updateTransportCreated' + kind]?.(false);
    live['update' + kind + 'AlreadyOn']?.(false);
    // Notify room membership using the existing pause protocol, preserving
    // users' local tracks for an explicit retry.
    live.socket?.emit('pauseProducerMedia', { mediaTag: key, roomName: live.roomName });
  }
  live.updateProducerTransport?.(null);
  live.updateTransportCreated?.(false);
  live.showAlert?.({ message: 'Media connection could not recover. Rejoin the room to restore audio and video.', type: 'danger', duration: 10000 });
}
