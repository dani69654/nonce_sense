import express from 'express';
import { ENV } from './cfg/env';
import { ONE_HOUR, ONE_MIN } from './utils/time';
import routes from './routes';
import { fetchWorkers, fetchChainDiff, fetchBlockHeight } from './utils/data';
import { computeWorkersData } from './utils/workers';
import { formatNumber } from './utils/format';
import { TELEGRAM } from './cfg/telegram';
import { listenTelegramChat } from './controllers/telegramController';
import { heartBeat } from './utils/beat';

const app = express();
app.use(routes);

let previousBestDiff = 0;

const getMiningStats = async () => {
  try {
    // Fetch all data in parallel
    const [workersRaw, difficulty, blockHeight] = await Promise.all([
      fetchWorkers(),
      fetchChainDiff().catch(() => null),
      fetchBlockHeight().catch(() => null),
    ]);

    // Compute workers data
    const workersData = computeWorkersData(workersRaw);

    const currentTime = new Date().toLocaleString('it-IT');
    const nWorkers = workersData.workers;
    const currentBestDiff = Number(workersData.bestever);
    const bestShare = formatNumber(currentBestDiff);
    const oneHourHashrate = formatNumber(Number(workersData.hashrate1hr));

    let message = '';

    // Check for new best difficulty
    if (currentBestDiff > previousBestDiff && previousBestDiff !== 0) {
      message =
        `*NEW BEST SHARE!* 🌟 (${currentTime})\n\n` +
        `*Workers:* ${nWorkers}\n` +
        `*New Best Share:* ${bestShare} 🚀\n` +
        `*Previous Best:* ${formatNumber(previousBestDiff)} 📈\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}`;
    } else {
      // Base message
      message =
        `*Live Mining Stats* (${currentTime})\n\n` +
        `*Workers:* ${nWorkers}\n` +
        `*Best Share:* ${bestShare}\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}`;
    }

    // Add block height and difficulty if available
    if (blockHeight) {
      message += `\n*Block Height:* ${blockHeight}`;
    }
    if (difficulty) {
      message += `\n*Network Difficulty:* ${formatNumber(difficulty)}`;
    }

    // Check if best share meets or exceeds network difficulty
    if (difficulty && currentBestDiff >= Number(difficulty)) {
      message =
        `*BLOCK FOUND!!!* 🎉⛏️🚀 (${currentTime})\n\n` +
        `*Workers:* ${nWorkers}\n` +
        `*Best Share:* ${bestShare} 🔥\n` +
        `*1-Hour Hashrate:* ${oneHourHashrate}\n` +
        `*Network Difficulty:* ${formatNumber(difficulty)} 🎯\n` +
        `*Block Height:* ${blockHeight || 'N/A'} 🧱`;
    }

    // Update previous best difficulty
    if (currentBestDiff > previousBestDiff) {
      previousBestDiff = currentBestDiff;
    }

    return message;
  } catch {
    return 'Error fetching mining stats';
  }
};

const sendMiningStats = async () => {
  const message = await getMiningStats();
  if (!message) {
    return;
  }
  await TELEGRAM.sendMessage(ENV.CHAT_ID, message, { parse_mode: 'Markdown' });
};

const startSendingStats = () => {
  sendMiningStats();
  listenTelegramChat();
  heartBeat();
  setInterval(sendMiningStats, ONE_HOUR);
};

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port: ${ENV.PORT}`);
  startSendingStats();
});
