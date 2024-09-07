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
exports.resolvers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const user_1 = __importDefault(require("../../services/user"));
const db_1 = require("../../clients/db");
const redis_1 = require("../../clients/redis");
const queries = {
    verifyGoogleToken: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { token }) {
        const resultToken = yield user_1.default.verifyGoogleAuthToken(token);
        return resultToken;
    }),
    getCurrentUser: (parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const id = (_a = contextValue.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            return null;
        const user = yield db_1.prismaClient.user.findUnique({ where: { id } });
        return user;
    }),
    getUserById: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { id }, ctx) { return user_1.default.getUserById(id); }),
};
const extraResolvers = {
    User: {
        tweets: (parent) => db_1.prismaClient.tweet.findMany({ where: { author: { id: parent.id } } }),
        follower: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield db_1.prismaClient.follows.findMany({
                where: { following: { id: parent.id } },
                include: {
                    follower: true,
                },
            });
            // console.log(res);
            return res.map((el) => el.follower);
        }),
        following: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield db_1.prismaClient.follows.findMany({
                where: { follower: { id: parent.id } },
                include: {
                    following: true,
                },
            });
            // console.log(res);
            return res.map((el) => el.following);
        }),
        recomendedUsers: (parent, _, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            if (!ctx.user)
                return [];
            const cachedValue = yield redis_1.redisClient.get(`RECOMENDED_USERS:${ctx.user.id}`);
            if (cachedValue)
                return JSON.parse(cachedValue);
            const myFollowing = yield db_1.prismaClient.follows.findMany({
                where: {
                    follower: { id: ctx.user.id },
                },
                include: {
                    following: {
                        include: { followers: { include: { following: true } } },
                    },
                },
            });
            const users = [];
            // console.log(myFollowing[0].following.followers)
            for (const followings of myFollowing) {
                for (const followingOfFollowedUser of followings.following.followers) {
                    if (followingOfFollowedUser.following.id !== ctx.user.id &&
                        myFollowing.findIndex((e) => (e === null || e === void 0 ? void 0 : e.followingId) === followingOfFollowedUser.following.id) < 0) {
                        users.push(followingOfFollowedUser.following);
                    }
                }
            }
            yield redis_1.redisClient.set(`RECOMENDED_USERS:${ctx.user.id}`, JSON.stringify(users));
            return users;
        }),
    },
};
const muatations = {
    followUser: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { to }, ctx) {
        if (!ctx.user || !ctx.user.id)
            throw new Error("Unauthenticated");
        yield user_1.default.followUser(ctx.user.id, to);
        yield redis_1.redisClient.del(`RECOMENDED_USERS:${ctx.user.id}`);
        return true;
    }),
    unfollowUser: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { to }, ctx) {
        if (!ctx.user || !ctx.user.id)
            throw new Error("Unauthenticated");
        yield user_1.default.unfollowUser(ctx.user.id, to);
        yield redis_1.redisClient.del(`RECOMENDED_USERS:${ctx.user.id}`);
        return true;
    }),
};
exports.resolvers = { queries, extraResolvers, muatations };
