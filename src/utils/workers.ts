import { ENV } from '../cfg/env';
import { type MiningData } from '../types';

const UNITS: Record<string, number> = {
  T: 1e12,
  G: 1e9,
  M: 1e6,
  K: 1e3,
};

/** Unique miner identities (one address = one miner, even if listed on multiple pools). */
export const expectedMiners = (): number => new Set(ENV.WORKERS.map((w) => w.address)).size;

export const EXPECTED_WORKERS = expectedMiners();

/** Addresses with hashrate > 0 on at least one configured pool. */
export const onlineAddresses = (data: MiningData[]): Set<string> => {
  const online = new Set<string>();
  data.forEach((worker, index) => {
    const config = ENV.WORKERS[index];
    if (config && convertHashrate(worker.hashrate1m) > 0) {
      online.add(config.address);
    }
  });
  return online;
};

export const verifyExpectedWorkers = (data: MiningData[]) => onlineAddresses(data).size;

export const convertHashrate = (hashrateStr: string) => {
  const match = hashrateStr.match(/^([\d.]+)([TGMK])$/);
  if (!match) return parseFloat(hashrateStr);
  const [, numStr, unit] = match;
  return parseFloat(numStr) * UNITS[unit];
};

export const computeWorkersData = (data: MiningData[]) => {
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
