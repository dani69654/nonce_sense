"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.heartBeat = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../cfg/env");
const time_1 = require("./time");
const heartBeat = () => setInterval(() => axios_1.default.get(`${env_1.ENV.SERVER_URL}/heartbeat`).catch(), time_1.ONE_MIN);
exports.heartBeat = heartBeat;
