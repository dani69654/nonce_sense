import { computeWorkersData, EXPECTED_WORKERS, verifyExpectedWorkers } from '../utils/workers';
import { fetchBlockHeight, fetchChainDiff, fetchWorkers } from '../utils/data';
import { formatNumber } from '../utils/format';
import { ENV } from '../cfg/env';

let previousBestDiff = 0;

export const getMiningStats = async () => {
  try {
    const [workersRaw, difficulty, blockHeight] = await Promise.all([
      fetchWorkers(),
      fetchChainDiff().catch(() => null),
      fetchBlockHeight().catch(() => null),
    ]);
<<<<<<< Updated upstream

    const activeWorkers = verifyExpectedWorkers(workersRaw);
=======
    console.log('diff', difficulty);
>>>>>>> Stashed changes
    const workersData = computeWorkersData(workersRaw);
    const currentTime = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' });
    const nWorkers = workersData.workers;
    const currentBestDiff = Number(workersData.bestever);
    const bestShare = formatNumber(currentBestDiff);
    const oneHourHashrate = formatNumber(Number(workersData.hashrate1hr));

    let message = '';

    if (difficulty) {
      message = `*Live Mining Stats* (${currentTime})\n\n*Network Difficulty:* ${formatNumber(difficulty)}\n`;
    }
    if (currentBestDiff > previousBestDiff && previousBestDiff !== 0) {
      message +=
        `*NEW BEST SHARE!* 🌟 (${currentTime})\n\n` +
        `*Workers:* ${nWorkers}\n` +
        `*New Best Share:* ${bestShare} 🚀\n` +
        `*Previous Best:* ${formatNumber(previousBestDiff)} 📈\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}`;
    } else {
      message += `*Best Share:* ${bestShare}\n` + `*Workers:* ${nWorkers}\n` + `*1-Hour Hashrate:* ${oneHourHashrate}`;
    }

    if (blockHeight) {
      message += `\n*Block Height:* ${blockHeight}`;
    }

    if (difficulty && currentBestDiff >= Number(difficulty)) {
      message +=
        `*BLOCK FOUND!!!* 🎉⛏️🚀 (${currentTime})\n\n` +
        `*Best Share:* ${bestShare} 🔥\n` +
        `*Workers:* ${nWorkers}\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}\n` +
        `*Network Difficulty:* ${formatNumber(difficulty)} 🎯\n` +
        `*Block Height:* ${blockHeight || 'N/A'} 🧱`;
    }

    if (currentBestDiff > previousBestDiff) {
      previousBestDiff = currentBestDiff;
    }

<<<<<<< Updated upstream
    if (activeWorkers < EXPECTED_WORKERS) {
      const inactive = workersRaw.find((worker) => worker.hashrate1m === '0');

      if (inactive) {
        const inactiveWorkerName = ENV.WORKERS.find((worker: { name: string; address: string }) =>
          inactive.worker[0].workername.includes(worker.address),
        )?.name;

        message += `\n⚠️: ${inactiveWorkerName} offline!`;
      }
=======
    const offlineWorkers = workersData.worker.filter((worker) => worker.offline);

    if (offlineWorkers.length > 0) {
      let tempMessage = `\n\n 🚨 !!!WARNING!!! 🚨 `;
      const workersNames = offlineWorkers.map((worker) => worker.username).join(', ');
      tempMessage += `${workersNames} OFFLINE!`;
      message += tempMessage;
>>>>>>> Stashed changes
    }

    return message;
  } catch {
    return 'Error fetching mining stats';
  }
};
