import { joinRoomOnMediaSFU } from './joinRoomOnMediaSFU';
import { createRoomOnMediaSFU } from './createRoomOnMediaSFU';
import { readRejoinCredential, rememberRejoinCredential, forgetRejoinCredential } from './rejoinCredentialStore';
import {
  sessionReplaced,
  wasSessionReplaced,
  SESSION_REPLACED_EVENT,
  SESSION_REPLACED_MESSAGE,
} from '../../producers/socketReceiveMethods/sessionReplaced';
import { disconnect } from '../../producers/socketReceiveMethods/disconnect';

const apiUserName = 'sampleusr';
const apiKey = 'a'.repeat(64);
const secretA = 'b'.repeat(64);
const secretB = 'c'.repeat(64);

// Both readers are mocked: the public copy reads json(), the private copy text().
const ok = (body: Record<string, unknown>) => ({ ok: true, status: 200, json: async () => body, text: async () => JSON.stringify(body) });
const refused = (error: string) => ({ ok: false, status: 400, json: async () => ({ error }), text: async () => JSON.stringify({ error }) });

describe('participant rejoin (participant-rejoin-v1)', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    document.body.innerHTML = '';
    (global as unknown as { fetch: jest.Mock }).fetch = jest.fn();
  });

  test('credentials are kept per room and name, only for valid secrets', () => {
    rememberRejoinCredential({ roomName: 'Room123', userName: 'Guest01', secret: secretA, link: 'https://sp1.mediasfu.com' });
    rememberRejoinCredential({ roomName: 'room999', userName: 'guest01', secret: 'not-a-secret' });
    expect(readRejoinCredential('room123', 'guest01')?.secret).toBe(secretA);
    expect(readRejoinCredential('room123', 'other')).toBeNull();
    expect(readRejoinCredential('room999', 'guest01')).toBeNull();
    forgetRejoinCredential('room123', 'guest01');
    expect(readRejoinCredential('room123', 'guest01')).toBeNull();
  });

  test('credentials expire after 24 hours', () => {
    rememberRejoinCredential({ roomName: 'room123', userName: 'guest01', secret: secretA });
    const key = 'mediasfu:rejoin:room123:guest01';
    const stored = JSON.parse(window.sessionStorage.getItem(key) as string);
    window.sessionStorage.setItem(key, JSON.stringify({ ...stored, storedAt: Date.now() - 25 * 60 * 60 * 1000 }));
    expect(readRejoinCredential('room123', 'guest01')).toBeNull();
  });

  test('a join remembers the credential and the next join proves it with rejoinSecret', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce(ok({ roomName: 'room123', userName: 'guest01', secret: secretA, link: 'https://sp1.mediasfu.com', success: true }));
    await joinRoomOnMediaSFU({ payload: { action: 'join', meetingID: 'room123', userName: 'guest01' }, apiUserName, apiKey });
    fetchMock.mockResolvedValueOnce(ok({ roomName: 'room123', userName: 'guest01', secret: secretB, link: 'https://sp1.mediasfu.com', success: true }));
    await joinRoomOnMediaSFU({ payload: { action: 'join', meetingID: 'room123', userName: 'guest01' }, apiUserName, apiKey });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).rejoinSecret).toBeUndefined();
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).rejoinSecret).toBe(secretA);
    expect(readRejoinCredential('room123', 'guest01')?.secret).toBe(secretB);
  });

  test('"Name is already taken" falls back to the stored credential; other refusals do not', async () => {
    rememberRejoinCredential({ roomName: 'room123', userName: 'guest01', secret: secretA, link: 'https://sp1.mediasfu.com' });
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce(refused('Name is already taken.'));
    const reused = await joinRoomOnMediaSFU({ payload: { action: 'join', meetingID: 'room123', userName: 'guest01' }, apiUserName, apiKey });
    expect(reused.success).toBe(true);
    expect((reused.data as { secret: string }).secret).toBe(secretA);
    fetchMock.mockResolvedValueOnce(refused('You are banned from this meeting.'));
    const banned = await joinRoomOnMediaSFU({ payload: { action: 'join', meetingID: 'room123', userName: 'guest01' }, apiUserName, apiKey });
    expect(banned.success).toBe(false);
  });

  test('a created room remembers the host credential', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(ok({ roomName: 'room777', secret: secretA, link: 'https://sp1.mediasfu.com', success: true }));
    await createRoomOnMediaSFU({ payload: { action: 'create', duration: 30, capacity: 4, userName: 'host01' }, apiUserName, apiKey });
    expect(readRejoinCredential('room777', 'host01')?.secret).toBe(secretA);
  });

  test('session-replaced shows the message with "Use this one", and the following disconnect stays quiet', async () => {
    const useThisOne = jest.fn();
    const showAlert = jest.fn();
    await sessionReplaced({ data: { reason: 'joined-elsewhere' }, showAlert, useThisOne });
    expect(wasSessionReplaced()).toBe(true);
    expect(document.body.textContent).toContain(SESSION_REPLACED_MESSAGE);
    await disconnect({ showAlert, onWeb: true, redirectURL: '' });
    expect(showAlert).not.toHaveBeenCalled();
    const button = Array.from(document.querySelectorAll('button')).find((b) => b.textContent === 'Use this one') as HTMLButtonElement;
    button.click();
    expect(useThisOne).toHaveBeenCalledTimes(1);
    expect(document.getElementById('mediasfu-session-replaced')).toBeNull();
  });

  test('apps can replace the UI by cancelling the window event', async () => {
    const handler = (event: Event) => event.preventDefault();
    window.addEventListener(SESSION_REPLACED_EVENT, handler);
    await sessionReplaced({ data: { reason: 'joined-elsewhere' } });
    window.removeEventListener(SESSION_REPLACED_EVENT, handler);
    expect(document.getElementById('mediasfu-session-replaced')).toBeNull();
  });
});
