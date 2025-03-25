import chalk from 'chalk';
import { MiningData } from '../types';
import { convertHashrateBack, formatPercentage, WORKERS } from './workers';

export const COLORS = {
    title: chalk.hex('#00FF00').bold,
    key: chalk.hex('#4DC7E0').bold,
    value: chalk.hex('#E0E0E0'),
    workerTitle: chalk.hex('#FFA500').bold,
    workerKey: chalk.hex('#4DC7E0'),
    error: chalk.red.bold,
    percentage: chalk.hex('#FF69B4'),
};

function formatLargeNumber(num: number) {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    return num.toLocaleString('en-US');
}

export const printAggregatedStats = ({
    networkData,
    miningData,
}: {
    networkData: {
        difficulty: number | null;
        blockHeight: number | null;
    };
    miningData: MiningData;
}) => {
    console.log(COLORS.title(`=== AGGREGATED STATISTICS === \n`));
    console.log(
        `${COLORS.key('Network Diff'.padEnd(12))}: ${COLORS.value(
            networkData.difficulty ? formatLargeNumber(networkData.difficulty) : 'N/A'
        )}`
    );
    console.log(
        `${COLORS.key('Block Height'.padEnd(12))}: ${COLORS.value(networkData.blockHeight?.toLocaleString() || 'N/A')}`
    );

    const mainStats: (keyof MiningData)[] = [
        'hashrate1m',
        'hashrate5m',
        'hashrate1hr',
        'hashrate1d',
        'hashrate7d',
        'lastshare',
        'workers',
        'shares',
        'bestshare',
        'bestever',
    ];

    mainStats.forEach((stat) => {
        let value = miningData[stat];

        if (stat === 'lastshare') {
            value = typeof value === 'number' ? new Date(value * 1000).toLocaleString() : 'N/A';
        }

        if (['bestshare', 'bestever'].includes(stat) && typeof value === 'number') {
            if (networkData.difficulty) {
                const percentage = formatPercentage({ value: Number(value), difficulty: networkData.difficulty });
                const largeNum = formatLargeNumber(value);
                value = `${largeNum}${percentage}`;
            } else {
                value = formatLargeNumber(value);
            }
        } else if (stat === 'shares' && typeof value === 'number') {
            value = formatLargeNumber(value);
        }

        if (['hashrate1m', 'hashrate5m', 'hashrate1hr', 'hashrate1d', 'hashrate7d'].includes(stat)) {
            value = convertHashrateBack(value as number);
        }

        if (stat === 'bestshare') {
            return;
        }
        console.log(`${COLORS.key(stat.padEnd(12))}: ${COLORS.value(value)}`);
    });
};

export const printWorkerStats = (miningData: MiningData) => {
    const workers = miningData.worker.map((worker) => worker);

    console.log(COLORS.workerTitle(`\n === WORKERS STATISTICS === \n`));

    workers.map((worker) => {
        const a = WORKERS.map((w) => (worker.workername.includes(w.address) ? w.name : null)).filter(
            (w) => w !== null
        )[0];
        console.log(`${COLORS.workerKey(a.toUpperCase())}:`);
        Object.entries(worker).map(([key, value]) => {
            console.log(`\t${COLORS.key(key.padEnd(12))}: ${COLORS.value(value)}`);
        });
    });
};
