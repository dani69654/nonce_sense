import { computeWorkersData, EXPECTED_WORKERS, verifyExpectedWorkers } from '../utils/workers';
import { fetchBlockHeight, fetchBtcPrice, fetchChainDiff, fetchWorkers } from '../utils/data';
import { formatNumber } from '../utils/format';
import { ENV } from '../cfg/env';

let previousBestDiff = 0;

export const getMiningStats = async () => {
  try {
    const [workersRaw, difficulty, blockHeight, btcUsdPrice] = await Promise.all([
      fetchWorkers(),
      fetchChainDiff().catch(() => null),
      fetchBlockHeight().catch(() => null),
      fetchBtcPrice().catch((e) => {
        console.error('Error fetching BTC price:', e);
        return null;
      }),
    ]);

    const activeWorkers = verifyExpectedWorkers(workersRaw);
    const workersData = computeWorkersData(workersRaw);
    const currentTime = new Date().toLocaleString('it-IT');
    const currentBestDiff = Number(workersData.bestever);
    const bestShare = formatNumber(currentBestDiff);
    const oneHourHashrate = formatNumber(Number(workersData.hashrate1hr));
    const diffDisplay = difficulty ? formatNumber(difficulty) : 'N/A';

    let message = '';

    if (difficulty && currentBestDiff >= Number(difficulty)) {
      message =
        `*BLOCK FOUND!!!* 🎉⛏️🚀 (${currentTime})\n\n` +
        `*Network Difficulty:* ${diffDisplay} 🎯\n` +
        `*Best Share:* ${bestShare} 🔥\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}\n` +
        `*Block Height:* ${blockHeight || 'N/A'} 🧱` +
        `\n*BTC Price:* ${btcUsdPrice} 💰`;
    } else if (currentBestDiff > previousBestDiff && previousBestDiff !== 0) {
      message =
        `*NEW BEST SHARE!* 🌟 (${currentTime})\n\n` +
        `*Network Difficulty:* ${diffDisplay}\n` +
        `*New Best Share:* ${bestShare} 🚀\n` +
        `*Previous Best:* ${formatNumber(previousBestDiff)} 📈\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}` +
        `\n*BTC Price:* ${btcUsdPrice} 💰`;
    } else {
      message =
        `*📢 LIVE MINING STATS* (${currentTime})\n\n` +
        `*Network Difficulty:* ${diffDisplay}\n` +
        `*Best Share:* ${bestShare}\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}` +
        `\n*BTC Price:* ${btcUsdPrice} 💰`;
    }

    if (blockHeight && difficulty && currentBestDiff < Number(difficulty)) {
      message += `\n*Block Height:* ${blockHeight}`;
    }

    if (currentBestDiff > previousBestDiff) {
      previousBestDiff = currentBestDiff;
    }

    if (activeWorkers < EXPECTED_WORKERS) {
      const inactive = workersRaw.find((worker) => worker.hashrate1m === '0');
      if (inactive) {
        const inactiveWorkerName = ENV.WORKERS.find((worker: { address: string; name: string }) =>
          inactive.worker[0].workername.includes(worker.address),
        )?.name;
        message += `\n⚠️  ${inactiveWorkerName} seems to be offline!`;
      }
    }

    return message;
  } catch {
    return 'Error fetching mining stats';
  }
};
