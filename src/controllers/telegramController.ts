import { ENV } from '../cfg/env';
import { TELEGRAM } from '../cfg/telegram';
import { fetchWorker } from '../utils/data';
import { formatNumber, poolLabel, poolShortLabel } from '../utils/format';
import { convertHashrate } from '../utils/workers';
import { getMiningStats } from './miningController';

const isAllowedChat = (chatId: number) => String(chatId) === ENV.CHAT_ID;

const WORKER_CALLBACK_PREFIX = 'worker:';

export const listenTelegramChat = () => {
  TELEGRAM.onText(/\/myid/, (msg) => {
    if (!isAllowedChat(msg.chat.id)) {
      return;
    }
    TELEGRAM.sendMessage(msg.chat.id, `Your Telegram ID: \`${msg.chat.id}\``, { parse_mode: 'Markdown' });
  });

  TELEGRAM.onText(/\/stats/, (msg) => {
    if (!isAllowedChat(msg.chat.id)) {
      return;
    }
    const chatId = msg.chat.id;
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'ALL', callback_data: 'all' },
            ...ENV.WORKERS.map((worker, index) => ({
              text: `${worker.name.toUpperCase()} · ${poolShortLabel(worker.pool)}`,
              callback_data: `${WORKER_CALLBACK_PREFIX}${index}`,
            })),
          ],
        ],
      },
    };
    TELEGRAM.sendMessage(chatId, 'Please choose an option:', options);
  });

  TELEGRAM.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;

    if (!msg || !data || !isAllowedChat(msg.chat.id)) {
      return;
    }

    if (data === 'all') {
      return getMiningStats().then((message) => {
        if (!message) {
          return;
        }
        TELEGRAM.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
      });
    }

    if (!data.startsWith(WORKER_CALLBACK_PREFIX)) {
      return;
    }

    const index = Number(data.slice(WORKER_CALLBACK_PREFIX.length));
    const worker = ENV.WORKERS[index];
    if (!worker) {
      return;
    }

    const pool = worker.pool ?? 'ckpool';

    fetchWorker(worker.address, pool).then((workerData) => {
      if (!workerData) {
        return;
      }
      const hr1m = formatNumber(convertHashrate(workerData.hashrate1m));
      const hr1h = formatNumber(convertHashrate(workerData.hashrate1hr));
      const bestShare = formatNumber(Number(workerData.bestever));
      const message =
        `*${worker.name}* · ${poolLabel(pool)}\n` +
        `\`${worker.address}\`\n\n` +
        `*Hashrate (1m):* ${hr1m}\n` +
        `*Hashrate (1h):* ${hr1h}\n` +
        `*Best Share:* ${bestShare}\n` +
        `*Active sessions:* ${workerData.workers}`;
      TELEGRAM.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
    });
  });
};
