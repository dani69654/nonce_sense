import dotenv from 'dotenv';
dotenv.config();

const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const ENV = {
  PORT: parseInt(requireEnv('PORT')),
  WORKERS: JSON.parse(requireEnv('WORKERS')),
  TG_TOKEN: requireEnv('TG_TOKEN'),
  CHAT_ID: requireEnv('CHAT_ID'),
  SERVER_URL: requireEnv('SERVER_URL'),
};
