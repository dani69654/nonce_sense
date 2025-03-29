"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TELEGRAM = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const env_1 = require("./env");
exports.TELEGRAM = new node_telegram_bot_api_1.default(env_1.ENV.TG_TOKEN, { polling: true });
