import TelegramBot from 'node-telegram-bot-api';
import { fetchBlockHeight, fetchChainDiff, fetchWorkers } from '../src/utils/data';
import { computeWorkersData } from '../src/utils/workers';
import dotenv from 'dotenv';

dotenv.config();

const TG_TOKEN = process.env.TG_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!TG_TOKEN || !CHAT_ID) {
    console.error('Missing Telegram Bot token or chat ID');
    process.exit(1);
}

const bot = new TelegramBot(TG_TOKEN, { polling: true });

// Store previous best difficulty
let previousBestDiff = 0;

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 2,
    }).format(Number(num));
};

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
        if (blockHeight) message += `\n*Block Height:* ${blockHeight}`;
        if (difficulty) message += `\n*Network Difficulty:* ${formatNumber(difficulty)}`;

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
    } catch (error) {
        // noop
    }
};

// Periodic sending function
const sendMiningStats = async () => {
    const message = await getMiningStats();
    if (!message) return;
    console.log('Sending periodic message:', message);
    //await bot.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });
};

// Listen for /stats command
bot.onText(/\/stats/, async (msg) => {
    const chatId = msg.chat.id;
    const message = await getMiningStats();
    if (!message) return;
    console.log('Sending stats on command:', message);
    //await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

// Run immediately and then every hour
const startSendingStats = async () => {
    await sendMiningStats();
    setInterval(sendMiningStats, 3600000); // 1 hour in milliseconds
};

startSendingStats();
