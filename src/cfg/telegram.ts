import TelegramBot from 'node-telegram-bot-api';
import { ENV } from './env';

export const TELEGRAM = new TelegramBot(ENV.TG_TOKEN, { polling: true });
