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
