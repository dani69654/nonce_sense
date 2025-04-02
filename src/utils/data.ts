import axios from 'axios';
import { ENV } from '../cfg/env';
import { type MiningData } from '../types';

const SOLO_CK_URL = 'https://eusolo.ckpool.org/users';
const CHAIN_INFO_BASE_URL = 'https://blockchain.info/q';
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
