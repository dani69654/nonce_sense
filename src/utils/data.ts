import { ENV } from '../cfg/env';
import {
  EtfDataRes,
  FearAndGreedRes,
  type MiningData,
  type PoolId,
  type PublicPoolClientResponse,
} from '../types';
import { formatUsd } from './format';
import fetchEtfData from 'bitcoin-etf-data';

const SOLO_CK_URL = 'https://eusolo.ckpool.org/users';
const PUBLIC_POOL_URL = 'https://public-pool.io:40557/api/client';
const CHAIN_INFO_BASE_URL = 'https://blockchain.info/q';
const COINOBRIKA_BASE_URL = 'https://api.coinpaprika.com/v1';
const CHAIN_INFO_DIFF_ENDPOINT = 'getdifficulty';
const CHAIN_INFO_BLOCK_HEIGHT_ENDPOINT = 'getblockcount';

const hashrateToString = (hashRate: number | undefined): string => {
  if (hashRate === undefined || !Number.isFinite(hashRate) || hashRate <= 0) {
    return '0';
  }
  return String(hashRate);
};

const toUnixSeconds = (value: string | null | undefined): number => {
  if (!value) {
    return 0;
  }
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : 0;
};

const mapPublicPoolToMiningData = (data: PublicPoolClientResponse): MiningData => {
  const workers = data.workers ?? [];
  const accounting = data.accounting;
  const liveHashrate = workers.reduce((acc, worker) => acc + (worker.hashRate || 0), 0);
  const workerBest = workers.reduce((max, worker) => Math.max(max, Number(worker.bestDifficulty) || 0), 0);
  const bestever =
    Number(data.bestDifficulty) || Number(accounting?.bestSubmissionDifficulty) || workerBest;
  const lastshare = Math.max(
    toUnixSeconds(accounting?.latestShareAt),
    ...workers.map((worker) => toUnixSeconds(worker.lastSeen)),
  );

  // public-pool.io exposes 10m / 1h windows; map 10m onto 1m+5m slots
  const hashrate10m = accounting?.hashRateLast10Minutes ?? liveHashrate;
  const hashrate1hr = accounting?.hashRateLastHour ?? liveHashrate;

  return {
    hashrate1m: hashrateToString(hashrate10m),
    hashrate5m: hashrateToString(hashrate10m),
    hashrate1hr: hashrateToString(hashrate1hr),
    hashrate1d: '0',
    hashrate7d: '0',
    lastshare,
    workers: data.workersCount ?? workers.length,
    shares: accounting?.totalAcceptedShares ?? 0,
    bestshare: bestever,
    bestever,
    authorised: 0,
    worker: workers.map((worker) => {
      const best = Number(worker.bestDifficulty) || 0;
      return {
        workername: worker.name,
        hashrate1m: hashrateToString(worker.hashRate),
        hashrate5m: hashrateToString(worker.hashRate),
        hashrate1hr: hashrateToString(worker.hashRate),
        hashrate1d: '0',
        hashrate7d: '0',
        lastshare: toUnixSeconds(worker.lastSeen),
        shares: 0,
        bestshare: best,
        bestever: best,
      };
    }),
  };
};

const fetchCkPoolWorker = async (address: string): Promise<MiningData> => {
  const response = await fetch(`${SOLO_CK_URL}/${address}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch CKPool worker: ${response.status}`);
  }
  return (await response.json()) as MiningData;
};

const fetchPublicPoolWorker = async (address: string): Promise<MiningData> => {
  const response = await fetch(`${PUBLIC_POOL_URL}/${address}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Public Pool worker: ${response.status}`);
  }
  const data = (await response.json()) as PublicPoolClientResponse;
  return mapPublicPoolToMiningData(data);
};

export const fetchChainDiff = async (): Promise<number> => {
  const response = await fetch(`${CHAIN_INFO_BASE_URL}/${CHAIN_INFO_DIFF_ENDPOINT}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch chain difficulty: ${response.status}`);
  }
  const difficulty = Number(await response.text());
  if (!Number.isFinite(difficulty)) {
    throw new Error('Invalid chain difficulty response');
  }
  return difficulty;
};

export const fetchBlockHeight = async () => {
  const response = await fetch(`${CHAIN_INFO_BASE_URL}/${CHAIN_INFO_BLOCK_HEIGHT_ENDPOINT}`);
  return await response.text();
};

export const fetchWorkers = async (): Promise<MiningData[]> => {
  return Promise.all(ENV.WORKERS.map((worker) => fetchWorker(worker.address, worker.pool ?? 'ckpool')));
};

export const fetchWorker = async (address: string, pool: PoolId = 'ckpool'): Promise<MiningData> => {
  if (pool === 'publicpool') {
    return fetchPublicPoolWorker(address);
  }
  return fetchCkPoolWorker(address);
};

export const fetchBtcPrice = async () => {
  const url = new URL(`${COINOBRIKA_BASE_URL}/tickers/btc-bitcoin`);
  url.searchParams.append('quotes', 'USD');

  const response = await fetch(url.toString());
  const data = await response.json();
  return formatUsd(data.quotes.USD.price);
};

export const fearGreedIndexFetcher = async (): Promise<FearAndGreedRes> => {
  const response = await fetch('https://api.alternative.me/fng/');
  const data = await response.json();

  return {
    value: data.data[0].value,
    classification: data.data[0].value_classification,
  };
};

export const etfDataFetcher = async (): Promise<EtfDataRes | null> => {
  const etfData = await fetchEtfData();
  if (!etfData) {
    return null;
  }
  return etfData[etfData.length - 1];
};
