"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_1 = require("./cfg/env");
const time_1 = require("./utils/time");
const routes_1 = __importDefault(require("./routes"));
const telegram_1 = require("./cfg/telegram");
const telegramController_1 = require("./controllers/telegramController");
const beat_1 = require("./utils/beat");
const miningController_1 = require("./controllers/miningController");
const app = (0, express_1.default)();
app.use(routes_1.default);
const sendMiningStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield (0, miningController_1.getMiningStats)();
    if (!message) {
        return;
    }
    yield telegram_1.TELEGRAM.sendMessage(env_1.ENV.CHAT_ID, message, { parse_mode: 'Markdown' });
});
const startSendingStats = () => {
    sendMiningStats();
    (0, telegramController_1.listenTelegramChat)();
    (0, beat_1.heartBeat)();
    setInterval(sendMiningStats, time_1.ONE_HOUR);
};
app.listen(env_1.ENV.PORT, () => {
    console.log(`Server is running on port: ${env_1.ENV.PORT}`);
    startSendingStats();
});
