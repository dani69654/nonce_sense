import express from 'express';
import { ENV } from './cfg/env';
import routes from './routes';
import { TELEGRAM } from './cfg/telegram';
import { listenTelegramChat } from './controllers/telegramController';
import { heartBeat } from './utils/beat';
import { getMiningStats } from './controllers/miningController';
import cron from 'node-cron';

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
  heartBeat();
  cron.schedule('0 0 */1 * * *', sendMiningStats);
};

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port: ${ENV.PORT}`);
  startSendingStats();
});
