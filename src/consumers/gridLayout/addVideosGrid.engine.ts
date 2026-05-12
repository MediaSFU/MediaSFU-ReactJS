export interface GridPlanEntry<T> {
  stream: T;
  index: number;
}

export interface BuildAddVideosGridPlanOptions<T> {
  mainGridStreams: T[];
  altGridStreams: T[];
  numToAdd?: number;
}

export interface AddVideosGridPlan<T> {
  mainEntries: GridPlanEntry<T>[];
  altEntries: GridPlanEntry<T>[];
}

/**
 * ReactJS-local mirror of shared addVideosGrid planning logic.
 * Keep this aligned with mediasfu-shared/src/consumers/gridLayout/addVideosGrid.engine.ts.
 */
export function buildAddVideosGridPlan<T>({
  mainGridStreams,
  altGridStreams,
  numToAdd,
}: BuildAddVideosGridPlanOptions<T>): AddVideosGridPlan<T> {
  const safeMain = Array.isArray(mainGridStreams) ? mainGridStreams : [];
  const safeAlt = Array.isArray(altGridStreams) ? altGridStreams : [];

  const bounded = Math.max(0, Math.min(numToAdd ?? safeMain.length, safeMain.length));

  const mainEntries = safeMain.slice(0, bounded).map((stream, index) => ({
    stream,
    index,
  }));

  const altEntries = safeAlt.map((stream, index) => ({
    stream,
    index,
  }));

  return { mainEntries, altEntries };
}
