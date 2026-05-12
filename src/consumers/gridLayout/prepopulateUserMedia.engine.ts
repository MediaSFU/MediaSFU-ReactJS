export interface PrepopulateParticipantLike {
  name?: string;
  islevel?: string;
  ScreenID?: string;
  ScreenOn?: boolean;
  [key: string]: any;
}

export interface PrepopulateStreamLike {
  producerId?: string;
  stream?: any;
  [key: string]: any;
}

export interface BuildPrepopulateUserMediaPlanOptions<
  P extends PrepopulateParticipantLike,
  S extends PrepopulateStreamLike,
> {
  participants: P[];
  allVideoStreams: S[];
  member: string;
  islevel: string;
  shared: boolean;
  shareScreenStarted: boolean;
  eventType: string;
  screenId?: string;
  whiteboardStarted: boolean;
  whiteboardEnded: boolean;
  remoteScreenStream: S[];
  localStreamScreen: any;
  checkOrientation: () => string;
  isWideScreen: boolean;
  forceFullDisplay: boolean;
  includeWhiteboardAsScreenFlow?: boolean;
}

export interface PrepopulateUserMediaPlan<P extends PrepopulateParticipantLike> {
  screenFlowActive: boolean;
  shouldReturnEarly: boolean;
  shouldUpdateAdminOnMainScreen: boolean;
  screenForceFullDisplay: boolean;
  host: P | null;
  hostStream: any;
  adminOnMainScreen: boolean;
  mainScreenPerson: string;
}

export interface ResolveMainHostRenderModeOptions {
  islevel: string;
  localUIMode: boolean;
  videoAlreadyOn: boolean;
  audioAlreadyOn: boolean;
  hostVideoOn: boolean;
  hostMuted?: boolean;
}

export type MainHostRenderMode = 'adminVideo' | 'audio' | 'mini' | 'video';

export interface ResolveHostVideoStreamOptions<TStreamLike = PrepopulateStreamLike> {
  islevel: string;
  keepBackground: boolean;
  virtualStream: any;
  localStreamVideo: any;
  oldAllStreams: TStreamLike[];
  hostVideoID?: string;
}

export interface BuildMainScreenStateOptions {
  filled: boolean;
  adminOnMainScreen: boolean;
  mainScreenPerson: string;
}

export interface MainScreenState {
  filled: boolean;
  adminOnMainScreen: boolean;
  mainScreenPerson: string;
}

export interface BuildMainHostCardPlanOptions<TStreamLike = PrepopulateStreamLike> {
  islevel: string;
  localUIMode: boolean;
  videoAlreadyOn: boolean;
  audioAlreadyOn: boolean;
  hostVideoOn: boolean;
  hostMuted?: boolean;
  hostIsAdmin: boolean;
  hostName: string;
  hostVideoID?: string;
  fallbackName: string;
  member: string;
  keepBackground: boolean;
  virtualStream: any;
  localStreamVideo: any;
  oldAllStreams: TStreamLike[];
}

export interface MainHostCardPlan {
  kind: 'video' | 'audio' | 'mini';
  key: string;
  name: string;
  initials?: string;
  remoteProducerId?: string;
  videoStream?: any;
  doMirror?: boolean;
  state: MainScreenState;
}

export interface BuildScreenShareHostCardPlanOptions {
  hostName: string;
  hostScreenID?: string;
  hostIsAdmin: boolean;
  shared: boolean;
  hostStream: any;
  screenForceFullDisplay: boolean;
  annotateScreenStream: boolean;
}

export interface ScreenShareHostCardPlan {
  key: string;
  name: string;
  remoteProducerId: string;
  videoStream: any;
  forceFullDisplay: boolean;
  doMirror: false;
  state: MainScreenState;
}

/**
 * ReactJS-local mirror helper for resolving host render mode in non-screen-share flow.
 */
export function resolveMainHostRenderMode({
  islevel,
  localUIMode,
  videoAlreadyOn,
  audioAlreadyOn,
  hostVideoOn,
  hostMuted,
}: ResolveMainHostRenderModeOptions): MainHostRenderMode {
  const hostVideoOffPath =
    (islevel !== '2' && !hostVideoOn)
    || (islevel === '2' && (!hostVideoOn || !videoAlreadyOn))
    || localUIMode === true;

  if (!hostVideoOffPath) {
    return 'video';
  }

  if (islevel === '2' && videoAlreadyOn) {
    return 'adminVideo';
  }

  const audOn =
    (islevel === '2' && audioAlreadyOn)
    || (islevel !== '2' && hostMuted === false);

  return audOn ? 'audio' : 'mini';
}

/**
 * ReactJS-local mirror for resolving host video stream source in non-screen-share flow.
 */
export function resolveHostVideoStream<TStreamLike extends PrepopulateStreamLike = PrepopulateStreamLike>({
  islevel,
  keepBackground,
  virtualStream,
  localStreamVideo,
  oldAllStreams,
  hostVideoID,
}: ResolveHostVideoStreamOptions<TStreamLike>): any {
  if (islevel === '2') {
    return keepBackground && virtualStream ? virtualStream : localStreamVideo;
  }

  const safeOldStreams = Array.isArray(oldAllStreams) ? oldAllStreams : [];
  const matched = safeOldStreams.find((stream) => stream.producerId === hostVideoID);
  return matched?.stream ?? null;
}

/**
 * ReactJS-local mirror for normalizing main-screen state updates.
 */
export function buildMainScreenState({
  filled,
  adminOnMainScreen,
  mainScreenPerson,
}: BuildMainScreenStateOptions): MainScreenState {
  return {
    filled,
    adminOnMainScreen,
    mainScreenPerson,
  };
}

/**
 * ReactJS-local mirror for resolving the non-screen-share host card plan.
 */
export function buildMainHostCardPlan<TStreamLike extends PrepopulateStreamLike = PrepopulateStreamLike>({
  islevel,
  localUIMode,
  videoAlreadyOn,
  audioAlreadyOn,
  hostVideoOn,
  hostMuted,
  hostIsAdmin,
  hostName,
  hostVideoID,
  fallbackName,
  member,
  keepBackground,
  virtualStream,
  localStreamVideo,
  oldAllStreams,
}: BuildMainHostCardPlanOptions<TStreamLike>): MainHostCardPlan {
  const mode = resolveMainHostRenderMode({
    islevel,
    localUIMode,
    videoAlreadyOn,
    audioAlreadyOn,
    hostVideoOn,
    hostMuted,
  });

  if (mode === 'adminVideo') {
    return {
      kind: 'video',
      key: hostVideoID || hostName || 'host-video',
      name: hostName,
      remoteProducerId: hostVideoID || '',
      videoStream: keepBackground && virtualStream ? virtualStream : localStreamVideo,
      doMirror: true,
      state: buildMainScreenState({
        filled: true,
        adminOnMainScreen: true,
        mainScreenPerson: hostName,
      }),
    };
  }

  if (mode === 'audio') {
    return {
      kind: 'audio',
      key: hostName || fallbackName,
      name: hostName,
      state: buildMainScreenState({
        filled: true,
        adminOnMainScreen: islevel === '2',
        mainScreenPerson: hostName,
      }),
    };
  }

  if (mode === 'mini') {
    return {
      kind: 'mini',
      key: fallbackName,
      name: hostName,
      initials: fallbackName,
      state: buildMainScreenState({
        filled: false,
        adminOnMainScreen: islevel === '2',
        mainScreenPerson: hostName,
      }),
    };
  }

  const hostStream = resolveHostVideoStream({
    islevel,
    keepBackground,
    virtualStream,
    localStreamVideo,
    oldAllStreams,
    hostVideoID,
  });

  if (!hostStream) {
    return {
      kind: 'mini',
      key: fallbackName,
      name: hostName,
      initials: fallbackName,
      state: buildMainScreenState({
        filled: false,
        adminOnMainScreen: islevel === '2',
        mainScreenPerson: hostName,
      }),
    };
  }

  return {
    kind: 'video',
    key: hostVideoID || hostName || 'host-video',
    name: hostName,
    remoteProducerId: hostVideoID || '',
    videoStream: hostStream,
    doMirror: member === hostName,
    state: buildMainScreenState({
      filled: true,
      adminOnMainScreen: hostIsAdmin,
      mainScreenPerson: hostName,
    }),
  };
}

/**
 * ReactJS-local mirror for resolving the screen-share host card plan.
 */
export function buildScreenShareHostCardPlan({
  hostName,
  hostScreenID,
  hostIsAdmin,
  shared,
  hostStream,
  screenForceFullDisplay,
  annotateScreenStream,
}: BuildScreenShareHostCardPlanOptions): ScreenShareHostCardPlan {
  return {
    key: hostScreenID || hostName || 'host-screen',
    name: hostName,
    remoteProducerId: hostScreenID || '',
    videoStream: shared ? hostStream : hostStream?.stream ?? null,
    forceFullDisplay: annotateScreenStream && shared ? false : screenForceFullDisplay,
    doMirror: false,
    state: buildMainScreenState({
      filled: true,
      adminOnMainScreen: hostIsAdmin,
      mainScreenPerson: hostName,
    }),
  };
}

/**
 * ReactJS-local mirror of shared prepopulateUserMedia planning logic.
 * Keep this aligned with mediasfu-shared/src/consumers/gridLayout/prepopulateUserMedia.engine.ts.
 */
export function buildPrepopulateUserMediaPlan<
  P extends PrepopulateParticipantLike,
  S extends PrepopulateStreamLike,
>({
  participants,
  allVideoStreams,
  member,
  shared,
  shareScreenStarted,
  eventType,
  screenId,
  whiteboardStarted,
  whiteboardEnded,
  remoteScreenStream,
  localStreamScreen,
  checkOrientation,
  isWideScreen,
  forceFullDisplay,
  includeWhiteboardAsScreenFlow = false,
}: BuildPrepopulateUserMediaPlanOptions<P, S>): PrepopulateUserMediaPlan<P> {
  const safeParticipants = Array.isArray(participants) ? participants : [];
  const safeVideoStreams = Array.isArray(allVideoStreams) ? allVideoStreams : [];
  const safeRemoteScreenStreams = Array.isArray(remoteScreenStream) ? remoteScreenStream : [];

  const whiteboardActive = whiteboardStarted && !whiteboardEnded;
  const screenFlowActive =
    shareScreenStarted || shared || (includeWhiteboardAsScreenFlow && whiteboardActive);

  let screenForceFullDisplay = forceFullDisplay;
  const orientation = checkOrientation();
  if ((orientation === 'portrait' || !isWideScreen) && (shareScreenStarted || shared)) {
    screenForceFullDisplay = false;
  }

  if (!screenFlowActive) {
    if (eventType === 'conference') {
      return {
        screenFlowActive,
        shouldReturnEarly: true,
        shouldUpdateAdminOnMainScreen: false,
        screenForceFullDisplay,
        host: null,
        hostStream: null,
        adminOnMainScreen: false,
        mainScreenPerson: '',
      };
    }

    const host = safeParticipants.find((participant) => participant.islevel === '2') ?? null;

    return {
      screenFlowActive,
      shouldReturnEarly: false,
      shouldUpdateAdminOnMainScreen: false,
      screenForceFullDisplay,
      host,
      hostStream: null,
      adminOnMainScreen: false,
      mainScreenPerson: host?.name ?? '',
    };
  }

  let host: P | null = null;
  let hostStream: any = null;

  if (shared) {
    host = { name: member, audioID: '', videoID: '' } as unknown as P;
    hostStream = localStreamScreen;
  } else {
    host =
      safeParticipants.find(
        (participant) => participant.ScreenID === screenId && participant.ScreenOn === true,
      ) ?? null;

    if (whiteboardActive) {
      host = {
        name: 'WhiteboardActive',
        islevel: '2',
        audioID: '',
        videoID: '',
      } as unknown as P;
      hostStream = { producerId: 'WhiteboardActive' };
    }

    if (host === null) {
      host = safeParticipants.find((participant) => participant.ScreenOn === true) ?? null;
    }

    if (host && !String(host.name ?? '').includes('WhiteboardActive')) {
      if (safeRemoteScreenStreams.length === 0) {
        hostStream =
          safeVideoStreams.find((stream) => stream.producerId === host?.ScreenID) ?? null;
      } else {
        hostStream = safeRemoteScreenStreams[0];
      }
    }
  }

  return {
    screenFlowActive,
    shouldReturnEarly: false,
    shouldUpdateAdminOnMainScreen: true,
    screenForceFullDisplay,
    host,
    hostStream,
    adminOnMainScreen: (host && host.islevel === '2') ?? false,
    mainScreenPerson: host?.name ?? '',
  };
}
