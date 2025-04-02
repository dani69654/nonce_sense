import { ENV } from '../cfg/env';
import { TELEGRAM } from '../cfg/telegram';
import { fetchWorker } from '../utils/data';
import { formatNumber } from '../utils/format';
import { convertHashrate } from '../utils/workers';
import { getMiningStats } from './miningController';

export const listenTelegramChat = () => {
  TELEGRAM.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'ALL', callback_data: 'all' },
            ...ENV.WORKERS.map((worker: { name: string; address: string }) => ({
              text: worker.name.toUpperCase(),
              callback_data: worker.address,
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

    if (!msg || !data) {
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

    const worker = ENV.WORKERS.find((worker: { address: string }) => worker.address === data);

    fetchWorker(data).then((workerData) => {
      if (!workerData) {
        return;
      }
      const message =
        `*${worker?.name}* (${worker?.address})\n\n` +
        `*Hashrate:* ${formatNumber(convertHashrate(workerData.hashrate1m))}\n` +
        `*Best Share:* ${formatNumber(Number(workerData.bestever))}\n`;
      TELEGRAM.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
    });
  });
};
