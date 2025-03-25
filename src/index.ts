import { printAggregatedStats, printWorkerStats } from './utils/chalk';
import { fetchChainDiff, fetchBlockHeight, fetchWorkers } from './utils/data';
import { computeWorkersData } from './utils/workers';

const main = async () => {
    console.clear();

    const [difficulty, blockHeight, miningData] = await Promise.all([
        fetchChainDiff().catch(() => null),
        fetchBlockHeight().catch(() => null),
        fetchWorkers().then(computeWorkersData),
    ]);

    printAggregatedStats({
        networkData: {
            difficulty,
            blockHeight,
        },
        miningData,
    });

    printWorkerStats(miningData);
};

main();
setInterval(main, 60 * 1000);
