import axios from 'axios';
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
  return await axios.get(`${CHAIN_INFO_BASE_URL}/${CHAIN_INFO_DIFF_ENDPOINT}`).then((res) => {
    return res.data;
  });
};

export const fetchBlockHeight = async () => {
  return await axios.get(`${CHAIN_INFO_BASE_URL}/${CHAIN_INFO_BLOCK_HEIGHT_ENDPOINT}`).then((res) => {
    return res.data;
  });
};

export const fetchWorkers = async (): Promise<MiningData[]> => {
  const promises = ENV.WORKERS.map((worker: { name: string; address: string }) => {
    return fetchWorker(worker.address);
  });
  return await Promise.all(promises);
};

export const fetchWorker = async (address: string): Promise<MiningData> => {
  return await axios.get(`${SOLO_CK_URL}/${address}`).then((res) => {
    return res.data;
  });
};

export const fetchBtcPrice = async () => {
  return await axios
    .get(`${COINPAPRIKA_BASE_URL}/tickers/btc-bitcoin`, {
      params: {
        quotes: 'USD',
      },
    })
    .then((res) => {
      return formatUsd(res.data.quotes.USD.price);
    });
};

export const fearGreedIndexFetcher = async (): Promise<FearAndGreedRes> => {
  const response = await axios.get('https://api.alternative.me/fng/');

  return {
    value: response.data.data[0].value,
    classification: response.data.data[0].value_classification,
  };
};

export const etfDataFetcher = async (): Promise<EtfDataRes | null> => {
  const etfData = await fetchEtfData();
  if (!etfData) {
    return null;
  }
  return etfData[etfData.length - 1];
};
