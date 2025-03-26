export type Worker = {
  workername: string;
  hashrate1m: string;
  hashrate5m: string;
  hashrate1hr: string;
  hashrate1d: string;
  hashrate7d: string;
  lastshare: number;
  shares: number;
  bestshare: number;
  bestever: number;
};

export type MiningData = {
  hashrate1m: string;
  hashrate5m: string;
  hashrate1hr: string;
  hashrate1d: string;
  hashrate7d: string;
  lastshare: number;
  workers: number;
  shares: number;
  bestshare: number;
  bestever: number;
  authorised: number;
  worker: Worker[];
};

export type Workers = {
  name: string;
  address: string;
};

const UNITS: Record<string, number> = {
  T: 1e12,
  G: 1e9,
  M: 1e6,
  K: 1e3,
};

export const convertHashrate = (hashrateStr: string): number => {
  const match = hashrateStr.match(/^([\d.]+)([TGMK])$/);
  if (!match) return parseFloat(hashrateStr);
  const [, numStr, unit] = match;
  return parseFloat(numStr) * UNITS[unit];
};

// Do the opposite of the above function
export const convertHashrateBack = (hashrate: number): string => {
  for (const unit of ['T', 'G', 'M', 'K']) {
    const value = hashrate / UNITS[unit];
    if (value >= 1) return `${value.toFixed(2)}${unit}`;
  }
  return hashrate.toFixed(2);
};

export const computeWorkersData = (data: MiningData[]): MiningData => {
  const aggregated1minHashrate = data.reduce((acc, worker) => {
    return acc + convertHashrate(worker.hashrate1m);
  }, 0);
  const aggregated5minHashrate = data.reduce((acc, worker) => {
    return acc + convertHashrate(worker.hashrate5m);
  }, 0);
  const aggregated1hrHashrate = data.reduce((acc, worker) => {
    return acc + convertHashrate(worker.hashrate1hr);
  }, 0);
  const aggregated1dHashrate = data.reduce((acc, worker) => {
    return acc + convertHashrate(worker.hashrate1d);
  }, 0);
  const aggregated7dHashrate = data.reduce((acc, worker) => {
    return acc + convertHashrate(worker.hashrate7d);
  }, 0);

  const workers = data.length;
  const shares = data.reduce((acc, worker) => acc + worker.shares, 0);
  const bestshare = data.reduce((acc, worker) => Math.max(acc, worker.bestshare), 0);
  const bestever = data.reduce((acc, worker) => Math.max(acc, worker.bestever), 0);
  const lastshare = Math.max(...data.map((worker) => worker.lastshare));
  const authorised = data.reduce((acc, worker) => acc + worker.authorised, 0);
  const flattenedWorkers = data.map((miningData) => miningData.worker).flat();

  return {
    hashrate1m: String(aggregated1minHashrate),
    hashrate5m: String(aggregated5minHashrate),
    hashrate1hr: String(aggregated1hrHashrate),
    hashrate1d: String(aggregated1dHashrate),
    hashrate7d: String(aggregated7dHashrate),
    lastshare,
    workers,
    shares,
    bestshare,
    bestever,
    authorised,
    worker: flattenedWorkers,
  };
};
