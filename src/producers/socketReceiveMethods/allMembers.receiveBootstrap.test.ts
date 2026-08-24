import { allMembers } from './allMembers';
import { allMembersRest } from './allMembersRest';

function parametersFor(roomRecvIPs: string[] = []) {
  const updateMembersReceived = jest.fn();
  const connectLocalIps = jest.fn(async () => undefined);
  const connectIps = jest.fn(async () => [[], []]);
  const base: any = {
    participantsAll: [], participants: [], dispActiveNames: [], requestList: [],
    coHost: '', coHostResponsibility: [], lock_screen: true, firstAll: true,
    membersReceived: false, roomRecvIPs, deferScreenReceived: false,
    screenId: '', shareScreenStarted: false, meetingDisplayType: 'media',
    hostFirstSwitch: true, waitingRoomList: [], islevel: '1', member: 'participant',
    socket: { id: 'primary' }, consume_sockets: [],
    audioSetting: 'allow', videoSetting: 'allow', screenshareSetting: 'allow', chatSetting: 'allow',
    updateParticipantsAll: jest.fn(), updateParticipants: jest.fn(), updateRequestList: jest.fn(),
    updateCoHost: jest.fn(), updateCoHostResponsibility: jest.fn(), updateFirstAll: jest.fn(),
    updateMembersReceived, updateDeferScreenReceived: jest.fn(), updateShareScreenStarted: jest.fn(),
    updateHostFirstSwitch: jest.fn(), updateIslevel: jest.fn(), updateConsume_sockets: jest.fn(),
    updateRoomRecvIPs: jest.fn(), updateIsLoadingModalVisible: jest.fn(), updateTotalReqWait: jest.fn(),
    updateAudioSetting: jest.fn(), updateVideoSetting: jest.fn(),
    updateScreenshareSetting: jest.fn(), updateChatSetting: jest.fn(),
    onScreenChanges: jest.fn(async () => undefined), connectIps, connectLocalIps,
    sleep: jest.fn(async () => undefined), reorderStreams: jest.fn(async () => undefined),
  };
  base.getUpdatedAllParams = () => base;
  return { base, updateMembersReceived, connectLocalIps, connectIps };
}

const member = { id: 'participant-id', name: 'participant', islevel: '1', isBanned: false, isSuspended: false } as any;

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

const flushTimers = async () => {
  jest.advanceTimersByTime(11);
  await Promise.resolve();
  await Promise.resolve();
};

test('allMembers re-reads a late local receive target and attaches the primary consume listener', async () => {
  const testState = parametersFor([]);
  await allMembers({
    members: [member], requestss: [], coHoste: '', coHostRes: [],
    parameters: testState.base, consume_sockets: [], apiUserName: 'account', apiKey: '', apiToken: 'token',
  });

  testState.base.roomRecvIPs = ['none'];
  await flushTimers();

  expect(testState.connectLocalIps).toHaveBeenCalledWith({ socket: testState.base.socket, parameters: testState.base });
  expect(testState.connectIps).not.toHaveBeenCalled();
  expect(testState.updateMembersReceived).toHaveBeenCalledWith(true);
});

test('allMembersRest re-reads a late local receive target instead of polling a stale empty array forever', async () => {
  const testState = parametersFor([]);
  await allMembersRest({
    members: [member], settings: ['allow', 'allow', 'allow', 'allow'] as any,
    coHoste: '', coHostRes: [], parameters: testState.base, consume_sockets: [],
    apiUserName: 'account', apiKey: '', apiToken: 'token',
  });

  testState.base.roomRecvIPs = ['none'];
  await flushTimers();

  expect(testState.connectLocalIps).toHaveBeenCalledWith({ socket: testState.base.socket, parameters: testState.base });
  expect(testState.connectIps).not.toHaveBeenCalled();
  expect(testState.updateMembersReceived).toHaveBeenCalledWith(true);
});

test('an immediately local allMembers target is marked connected exactly once', async () => {
  const testState = parametersFor(['none']);
  await allMembers({
    members: [member], requestss: [], coHoste: '', coHostRes: [],
    parameters: testState.base, consume_sockets: [], apiUserName: 'account', apiKey: '', apiToken: 'token',
  });

  expect(testState.connectLocalIps).toHaveBeenCalledTimes(1);
  expect(testState.updateMembersReceived).toHaveBeenCalledWith(true);
});

