import { TELEGRAM } from '../cfg/telegram';
import { getMiningStats } from './miningController';

const TRIGGERS: Record<string, () => Promise<string>> = {
  '/stats': getMiningStats,
};

export const listenTelegramChat = () => {
  TELEGRAM.on('message', (data) => {
    if (!data.text) {
      return;
    }

    if (TRIGGERS[data.text]) {
      TRIGGERS[data.text]().then((message) => {
        TELEGRAM.sendMessage(data.chat.id, message, { parse_mode: 'Markdown' });
      });
    }
  });
};
