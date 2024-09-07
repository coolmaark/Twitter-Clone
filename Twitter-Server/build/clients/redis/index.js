"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("@upstash/redis");
exports.redisClient = new redis_1.Redis({
    url: 'https://relaxed-jennet-57375.upstash.io',
    token: 'AeAfAAIjcDFlMzM0OWM5MmZmZjM0M2ExOGU5ZDZlOWI0Njg2ODIwZXAxMA',
});
