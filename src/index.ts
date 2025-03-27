import express from 'express';
import { ENV } from './cfg/env';
import { ONE_HOUR } from './utils/time';
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
  sendMiningStats();
  listenTelegramChat();
  heartBeat();
  setInterval(sendMiningStats, ONE_HOUR);
};

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port: ${ENV.PORT}`);
  startSendingStats();
});
