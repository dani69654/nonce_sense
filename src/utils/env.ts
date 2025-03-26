import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  WORKERS: JSON.parse(process.env.WORKERS || '[]'),
  TG_TOKEN: process.env.TG_TOKEN,
  CHAT_ID: process.env.CHAT_ID,
  SERVER_URL: process.env.SERVER_URL,
};
