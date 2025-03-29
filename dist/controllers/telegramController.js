"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenTelegramChat = void 0;
const telegram_1 = require("../cfg/telegram");
const miningController_1 = require("./miningController");
const TRIGGERS = {
    '/stats': miningController_1.getMiningStats,
};
const listenTelegramChat = () => {
    telegram_1.TELEGRAM.on('message', (data) => {
        if (!data.text) {
            return;
        }
        if (TRIGGERS[data.text]) {
            TRIGGERS[data.text]().then((message) => {
                telegram_1.TELEGRAM.sendMessage(data.chat.id, message, { parse_mode: 'Markdown' });
            });
        }
    });
};
exports.listenTelegramChat = listenTelegramChat;
