import axios from 'axios';
import { ENV } from './env';
import { TEN_MIN } from './time';

export const heartBeat = () => setInterval(() => axios.get(ENV.SERVER_URL!), TEN_MIN);
