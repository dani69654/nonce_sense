import { computeWorkersData, convertHashrate, verifyExpectedWorkers } from '../utils/workers';
import { etfDataFetcher, fearGreedIndexFetcher, fetchBtcPrice, fetchChainDiff, fetchWorkers } from '../utils/data';
import { formatNumber, poolLabel, workerKey } from '../utils/format';
import { ENV } from '../cfg/env';
import { TELEGRAM } from '../cfg/telegram';
import type { ConfigWorker } from '../types';

let previousBestDiff = 0;
const offlineNotified = new Set<string>();

const notifyOfflineWorker = async (worker: ConfigWorker) => {
  if (!worker.telegramId) {
    return;
  }
  try {
    await TELEGRAM.sendMessage(
      worker.telegramId,
      `⚠️ Hey ${worker.name}, your miner on ${poolLabel(worker.pool)} (${worker.address}) seems to be offline!`,
    );
  } catch (e) {
    console.error(`Failed to DM offline worker ${worker.name} (${worker.telegramId}):`, e);
  }
};

export const getMiningStats = async () => {
  try {
    const [workersRaw, difficulty, btcUsdPrice, etfData, fearGreedIndex] = await Promise.all([
      fetchWorkers(),
      fetchChainDiff().catch(() => null),
      fetchBtcPrice().catch((e) => {
        console.error('Error fetching BTC price:', e);
        return null;
      }),
      etfDataFetcher().catch(() => null),
      fearGreedIndexFetcher().catch(() => null),
    ]);

    const activeWorkers = verifyExpectedWorkers(workersRaw);
    const workersData = computeWorkersData(workersRaw);
    const currentTime = new Date().toLocaleString('it-IT');
    const currentBestDiff = Number(workersData.bestever);
    const bestShare = formatNumber(currentBestDiff);
    const oneHourHashrate = formatNumber(Number(workersData.hashrate1hr));
    const oneMinHashrate = formatNumber(Number(workersData.hashrate1m));
    const diffDisplay = typeof difficulty === 'number' ? formatNumber(difficulty) : 'N/A';
    const pools = [...new Set(ENV.WORKERS.map((w) => poolLabel(w.pool)))].join(' + ');

    let message = `*ALL* · ${pools}\n`;

    if (typeof difficulty === 'number' && currentBestDiff >= difficulty) {
      message +=
        `*BLOCK FOUND!!!* 🎉⛏️🚀 (${currentTime})\n\n` +
        `*Network Difficulty:* ${diffDisplay} 🎯\n` +
        `*Best Share:* ${bestShare} 🔥\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}\n` +
        `\n*BTC Price:* ${btcUsdPrice} 💰`;
    } else if (currentBestDiff > previousBestDiff && previousBestDiff !== 0) {
      message +=
        `*NEW BEST SHARE!* 🌟 (${currentTime})\n\n` +
        `*Network Difficulty:* ${diffDisplay}\n` +
        `*New Best Share:* ${bestShare} 🚀\n` +
        `*Previous Best:* ${formatNumber(previousBestDiff)} 📈\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}` +
        `\n*BTC Price:* ${btcUsdPrice} 💰`;
    } else {
      const percentOfBest =
        typeof difficulty === 'number' ? ((currentBestDiff / difficulty) * 100).toFixed(5) : 'N/A';
      message +=
        `🚀*Best Share:* ${bestShare} - ${percentOfBest}%\n` +
        `⛏️*Hashrate (1m):* ${oneMinHashrate}\n` +
        `⛏️*Hashrate (1h):* ${oneHourHashrate}\n` +
        `👷*Active:* ${activeWorkers}/${ENV.WORKERS.length}\n` +
        `💰*BTC Price:* ${btcUsdPrice}`;
      if (etfData) {
        message += `\n📊*ETF Data:* ${formatNumber(etfData.total)}`;
      }
      if (fearGreedIndex) {
        message += `\n😱*Fear and Greed Index:* ${fearGreedIndex.value}/100`;
      }
    }

    message += '\n\n*By pool*';
    workersRaw.forEach((miningData, index) => {
      const configWorker = ENV.WORKERS[index];
      if (!configWorker) {
        return;
      }
      const hr = formatNumber(convertHashrate(miningData.hashrate1m));
      const best = formatNumber(Number(miningData.bestever));
      const status = convertHashrate(miningData.hashrate1m) > 0 ? 'online' : 'offline';
      message += `\n• ${poolLabel(configWorker.pool)} (${configWorker.name}): ${hr} · best ${best} · ${status}`;
    });

    if (currentBestDiff > previousBestDiff) {
      previousBestDiff = currentBestDiff;
    }

    const stillOffline = new Set<string>();
    workersRaw.forEach((miningData, index) => {
      const configWorker = ENV.WORKERS[index];
      if (!configWorker || convertHashrate(miningData.hashrate1m) > 0) {
        return;
      }
      const key = workerKey(configWorker);
      stillOffline.add(key);
      message += `\n⚠️  ${configWorker.name} @ ${poolLabel(configWorker.pool)} seems to be offline!`;
      if (!offlineNotified.has(key)) {
        offlineNotified.add(key);
        void notifyOfflineWorker(configWorker);
      }
    });
    offlineNotified.forEach((key) => {
      if (!stillOffline.has(key)) {
        offlineNotified.delete(key);
      }
    });

    return message;
  } catch (e) {
    console.error('Error fetching mining stats:', e);
    return 'Error fetching mining stats';
  }
};
