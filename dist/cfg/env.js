"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requireEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};
exports.ENV = {
    PORT: parseInt(requireEnv('PORT')),
    WORKERS: JSON.parse(requireEnv('WORKERS')),
    TG_TOKEN: requireEnv('TG_TOKEN'),
    CHAT_ID: requireEnv('CHAT_ID'),
    SERVER_URL: requireEnv('SERVER_URL'),
};
