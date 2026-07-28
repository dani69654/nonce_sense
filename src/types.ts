export type PoolId = 'ckpool' | 'publicpool';

type Worker = {
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

/** Response from GET https://public-pool.io:40557/api/client/{address} */
export type PublicPoolWorker = {
  sessionId: string;
  name: string;
  bestDifficulty: string | number;
  hashRate: number;
  startTime: string;
  lastSeen: string;
  payoutMode?: string;
};

/** Present on public-pool.io (extended beyond upstream OSS) */
export type PublicPoolAccounting = {
  totalAcceptedShares?: number;
  totalCreditedDifficulty?: number;
  acceptedSharesLast10Minutes?: number;
  creditedDifficultyLast10Minutes?: number;
  acceptedSharesLastHour?: number;
  creditedDifficultyLastHour?: number;
  acceptedSharesLastDay?: number;
  creditedDifficultyLastDay?: number;
  hashRateLast10Minutes?: number;
  hashRateLastHour?: number;
  bestSubmissionDifficulty?: number;
  bestSubmissionDifficultyAt?: string | null;
  latestShareAt?: string | null;
};

export type PublicPoolClientResponse = {
  bestDifficulty?: string | number | null;
  workersCount: number;
  workers: PublicPoolWorker[];
  accounting?: PublicPoolAccounting;
  expectedPayout?: number | null;
};

export type FearAndGreedRes = { value: number; classification: string };
export type EtfDataRes = { date: string; total: number };

export type ConfigWorker = {
  name: string;
  address: string;
  /** Defaults to `ckpool` when omitted */
  pool?: PoolId;
  telegramId?: number;
};
