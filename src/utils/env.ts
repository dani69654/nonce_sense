import dotenv from 'dotenv';
dotenv.config();


export const ENV = {
  PORT: '4000',
  WORKERS:'[{"name":"dani","address":"bc1q2eu9qdwk9svda5j7uafuce3nlc9hyfscal0efh"},{"name":"liz","address":"bc1qpymk8m9cefxwpnmcx5rzunq6xqzl6kv0xw6mdp"}]',
  
  // DEV:
  TG_TOKEN:'7424805236:AAFihCO6cS5bYlAGRdKxsP-WINbVG-m5tC4',
  CHAT_ID:'-4729767452',
  SERVER_URL:'http://localhost:4000'

// PROD:
// TG_TOKEN=7794728303:AAHX7mJk44C9YUbBSxpHorvNETqTz0uSMmU
// CHAT_ID=-1002610729505
// SERVER_URL=https://nonce-sense.onrender.com

};
