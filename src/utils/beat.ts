import axios from 'axios';
import { ENV } from '../cfg/env';
import { ONE_MIN } from './time';

export const heartBeat = () => setInterval(() => axios.get(`${ENV.SERVER_URL}/heartbeat`).catch(), ONE_MIN);
