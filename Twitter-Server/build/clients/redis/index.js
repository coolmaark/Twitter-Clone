"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("@upstash/redis");
exports.redisClient = new redis_1.Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
});
