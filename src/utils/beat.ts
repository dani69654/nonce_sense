import { ENV } from '../cfg/env';

export const heartBeat = () =>
  fetch(`${ENV.SERVER_URL}/heartbeat`)
    .then(() => {
      console.log('Beat successful 💖');
    })
    .catch(() => {
      console.error('Beat failed 💔');
    });
