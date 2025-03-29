"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV = {
    PORT: '4000',
    WORKERS: '[{"name":"dani","address":"bc1q2eu9qdwk9svda5j7uafuce3nlc9hyfscal0efh"},{"name":"liz","address":"bc1qpymk8m9cefxwpnmcx5rzunq6xqzl6kv0xw6mdp"}]',
    TG_TOKEN: '7424805236:AAFihCO6cS5bYlAGRdKxsP-WINbVG-m5tC4',
    CHAT_ID: '-4729767452',
    SERVER_URL: 'http://localhost:4000'
};
