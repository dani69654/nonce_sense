import axios from 'axios';
import { ENV } from '../cfg/env';
import cron from 'node-cron';

export const heartBeat = () => {
  cron.schedule('* * * * *', () => {
    axios.get(`${ENV.SERVER_URL}/heartbeat`).catch();
  });
};
