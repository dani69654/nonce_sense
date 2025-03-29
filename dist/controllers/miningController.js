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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMiningStats = void 0;
const workers_1 = require("../utils/workers");
const data_1 = require("../utils/data");
const format_1 = require("../utils/format");
let previousBestDiff = 0;
const getMiningStats = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [workersRaw, difficulty, blockHeight] = yield Promise.all([
            (0, data_1.fetchWorkers)(),
            (0, data_1.fetchChainDiff)().catch(() => null),
            (0, data_1.fetchBlockHeight)().catch(() => null),
        ]);
        const workersData = (0, workers_1.computeWorkersData)(workersRaw);
        const currentTime = new Date().toLocaleString('it-IT');
        const nWorkers = workersData.workers;
        const currentBestDiff = Number(workersData.bestever);
        const bestShare = (0, format_1.formatNumber)(currentBestDiff);
        const oneHourHashrate = (0, format_1.formatNumber)(Number(workersData.hashrate1hr));
        let message = '';
        if (currentBestDiff > previousBestDiff && previousBestDiff !== 0) {
            message =
                `*NEW BEST SHARE!* 🌟 (${currentTime})\n\n` +
                    `*Workers:* ${nWorkers}\n` +
                    `*New Best Share:* ${bestShare} 🚀\n` +
                    `*Previous Best:* ${(0, format_1.formatNumber)(previousBestDiff)} 📈\n` +
                    `*1-Hour Hashrate:* ${oneHourHashrate}`;
        }
        else {
            message =
                `*Live Mining Stats* (${currentTime})\n\n` +
                    `*Workers:* ${nWorkers}\n` +
                    `*Best Share:* ${bestShare}\n` +
                    `*1-Hour Hashrate:* ${oneHourHashrate}`;
        }
        if (blockHeight) {
            message += `\n*Block Height:* ${blockHeight}`;
        }
        if (difficulty) {
            message += `\n*Network Difficulty:* ${(0, format_1.formatNumber)(difficulty)}`;
        }
        if (difficulty && currentBestDiff >= Number(difficulty)) {
            message =
                `*BLOCK FOUND!!!* 🎉⛏️🚀 (${currentTime})\n\n` +
                    `*Workers:* ${nWorkers}\n` +
                    `*Best Share:* ${bestShare} 🔥\n` +
                    `*1-Hour Hashrate:* ${oneHourHashrate}\n` +
                    `*Network Difficulty:* ${(0, format_1.formatNumber)(difficulty)} 🎯\n` +
                    `*Block Height:* ${blockHeight || 'N/A'} 🧱`;
        }
        if (currentBestDiff > previousBestDiff) {
            previousBestDiff = currentBestDiff;
        }
        return message;
    }
    catch (_a) {
        return 'Error fetching mining stats';
    }
});
exports.getMiningStats = getMiningStats;
