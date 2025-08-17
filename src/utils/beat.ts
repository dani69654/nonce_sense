import axios from 'axios';
import { ENV } from '../cfg/env';

export const heartBeat = () =>
  axios
    .get(`${ENV.SERVER_URL}/heartbeat`)
    .then(() => {
      console.log('Beat successful 💖');
    })
    .catch(() => {
      console.error('Beat failed 💔');
    });
