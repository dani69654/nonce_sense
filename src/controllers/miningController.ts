import { computeWorkersData } from '../utils/workers';
import { fetchBlockHeight, fetchChainDiff, fetchWorkers } from '../utils/data';
import { formatNumber } from '../utils/format';

let previousBestDiff = 0;

export const getMiningStats = async () => {
  try {
    const [workersRaw, difficulty, blockHeight] = await Promise.all([
      fetchWorkers(),
      fetchChainDiff().catch(() => null),
      fetchBlockHeight().catch(() => null),
    ]);

    const workersData = computeWorkersData(workersRaw);
    const currentTime = new Date().toLocaleString('it-IT');
    const nWorkers = workersData.workers;
    const currentBestDiff = Number(workersData.bestever);
    const bestShare = formatNumber(currentBestDiff);
    const oneHourHashrate = formatNumber(Number(workersData.hashrate1hr));

    let message = '';

    if (currentBestDiff > previousBestDiff && previousBestDiff !== 0) {
      message =
        `*NEW BEST SHARE!* 🌟 (${currentTime})\n\n` +
        `*Workers:* ${nWorkers}\n` +
        `*New Best Share:* ${bestShare} 🚀\n` +
        `*Previous Best:* ${formatNumber(previousBestDiff)} 📈\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}`;
    } else {
      message =
        `*Live Mining Stats* (${currentTime})\n\n` +
        `*Workers:* ${nWorkers}\n` +
        `*Best Share:* ${bestShare}\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}`;
    }

    if (blockHeight) message += `\n*Block Height:* ${blockHeight}`;
    if (difficulty) message += `\n*Network Difficulty:* ${formatNumber(difficulty)}`;

    if (difficulty && currentBestDiff >= Number(difficulty)) {
      message =
        `*BLOCK FOUND!!!* 🎉⛏️🚀 (${currentTime})\n\n` +
        `*Workers:* ${nWorkers}\n` +
        `*Best Share:* ${bestShare} 🔥\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}\n` +
        `*Network Difficulty:* ${formatNumber(difficulty)} 🎯\n` +
        `*Block Height:* ${blockHeight || 'N/A'} 🧱`;
    }

    if (currentBestDiff > previousBestDiff) {
      previousBestDiff = currentBestDiff;
    }

    return message;
  } catch {
    return 'Error fetching mining stats';
  }
};
