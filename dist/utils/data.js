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
exports.fetchWorkers = exports.fetchBlockHeight = exports.fetchChainDiff = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../cfg/env");
const SOLO_CK_URL = 'https://eusolo.ckpool.org/users';
const CHAIN_INFO_BASE_URL = 'https://blockchain.info/q';
const CHAIN_INFO_DIFF_ENDPOINT = 'getdifficulty';
const CHAIN_INFO_BLOCK_HEIGHT_ENDPOINT = 'getblockcount';
const fetchChainDiff = () => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.get(`${CHAIN_INFO_BASE_URL}/${CHAIN_INFO_DIFF_ENDPOINT}`).then((res) => {
        return res.data;
    });
});
exports.fetchChainDiff = fetchChainDiff;
const fetchBlockHeight = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.get(`${CHAIN_INFO_BASE_URL}/${CHAIN_INFO_BLOCK_HEIGHT_ENDPOINT}`).then((res) => {
        return res.data;
    });
});
exports.fetchBlockHeight = fetchBlockHeight;
const fetchWorkers = () => __awaiter(void 0, void 0, void 0, function* () {
    const promises = env_1.ENV.WORKERS.map((worker) => {
        return axios_1.default.get(`${SOLO_CK_URL}/${worker.address}`).then((res) => {
            return res.data;
        });
    });
    return yield Promise.all(promises);
});
exports.fetchWorkers = fetchWorkers;
