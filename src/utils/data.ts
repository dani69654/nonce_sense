import { ENV } from '../cfg/env';
import { EtfDataRes, FearAndGreedRes, type MiningData } from '../types';
import { formatUsd } from './format';
import fetchEtfData from 'bitcoin-etf-data';

const SOLO_CK_URL = 'https://eusolo.ckpool.org/users';
const CHAIN_INFO_BASE_URL = 'https://blockchain.info/q';
const COINPAPRIKA_BASE_URL = 'https://api.coinpaprika.com/v1';
const CHAIN_INFO_DIFF_ENDPOINT = 'getdifficulty';
const CHAIN_INFO_BLOCK_HEIGHT_ENDPOINT = 'getblockcount';

export const fetchChainDiff = async () => {
  const response = await fetch(`${CHAIN_INFO_BASE_URL}/${CHAIN_INFO_DIFF_ENDPOINT}`);
  return await response.text();
};

export const fetchBlockHeight = async () => {
  const response = await fetch(`${CHAIN_INFO_BASE_URL}/${CHAIN_INFO_BLOCK_HEIGHT_ENDPOINT}`);
  return await response.text();
};

export const fetchWorkers = async (): Promise<MiningData[]> => {
  const promises = ENV.WORKERS.map((worker: { name: string; address: string }) => {
    return fetchWorker(worker.address);
  });
  return await Promise.all(promises);
};

export const fetchWorker = async (address: string): Promise<MiningData> => {
  const response = await fetch(`${SOLO_CK_URL}/${address}`);
  return await response.json();
};

export const fetchBtcPrice = async () => {
  const url = new URL(`${COINPAPRIKA_BASE_URL}/tickers/btc-bitcoin`);
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
