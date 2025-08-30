import express from 'express';
import { ENV } from './cfg/env';
import routes from './routes';
import { TELEGRAM } from './cfg/telegram';
import { listenTelegramChat } from './controllers/telegramController';
import { heartBeat } from './utils/beat';
import { getMiningStats } from './controllers/miningController';

const app = express();
app.use(routes);

const sendMiningStats = async () => {
  const message = await getMiningStats();
  if (!message) {
    return;
  }
  await TELEGRAM.sendMessage(ENV.CHAT_ID, message, { parse_mode: 'Markdown' });
};

const startSendingStats = () => {
  listenTelegramChat();
  // Heartbeat every 5 minutes (300000 ms)
  setInterval(heartBeat, 5 * 60 * 1000);
  // Mining stats every hour (3600000 ms)
  setInterval(sendMiningStats, 60 * 60 * 1000);
};

app.listen(ENV.PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server is running on port: ${ENV.PORT}`);
  }
  startSendingStats();
});
