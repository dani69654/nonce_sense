import axios from 'axios';
import { type MiningData } from '../types';
import { WORKERS } from './workers';

const SOLO_CK_URL = 'https://eusolo.ckpool.org/users';
const CHAIN_INFO_BASE_URL = 'https://blockchain.info/q';
const CHAIN_INFO_DIFF_ENDPOINT = 'getdifficulty';
const CHAIN_INFO_BLOCK_HEIGHT_ENDPOINT = 'getblockcount';

export const fetchChainDiff = async (): Promise<number> => {
    const res = await axios.get(`${CHAIN_INFO_BASE_URL}/${CHAIN_INFO_DIFF_ENDPOINT}`);
    return res.data;
};

export const fetchBlockHeight = async (): Promise<number> => {
    const res = await axios.get(`${CHAIN_INFO_BASE_URL}/${CHAIN_INFO_BLOCK_HEIGHT_ENDPOINT}`);
    return res.data;
};

export const fetchWorkers = async (): Promise<MiningData[]> => {
    const promises = WORKERS.map((worker) => {
        return axios
            .get(`${SOLO_CK_URL}/${worker.address}`)
            .then((res) => {
                return res.data;
            })
            .catch((e) => {
                console.log('Failed to fetch worker data', worker);
                return null;
            });
    });
    return await Promise.all(promises);
};
