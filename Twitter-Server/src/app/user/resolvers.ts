import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import axios from "axios";
import JWTService from "../../services/jwt";
import { error } from "console";
import UserService from "../../services/user";
import { GraphqlContext, JWTUser } from "../../interfaces";
import { prismaClient } from "../../clients/db";
import { User } from "@prisma/client";
import { redisClient } from "../../clients/redis";
const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const resultToken = await UserService.verifyGoogleAuthToken(token);
    return resultToken;
  },
  getCurrentUser: async (
    parent: any,
    args: any,
    contextValue: GraphqlContext
  ) => {
    const id = contextValue.user?.id;
    if (!id) return null;
    const user = await prismaClient.user.findUnique({ where: { id } });
    return user;
  },
  getUserById: async (
    parent: any,
    { id }: { id: string },
    ctx: GraphqlContext
  ) => UserService.getUserById(id),
};

const extraResolvers = {
  User: {
    tweets: (parent: User) =>
      prismaClient.tweet.findMany({ where: { author: { id: parent.id } } }),
    follower: async (parent: User) => {
      const res = await prismaClient.follows.findMany({
        where: { following: { id: parent.id } },
        include: {
          follower: true,
        },
      });
      // console.log(res);
      return res.map((el) => el.follower);
    },

    following: async (parent: User) => {
      const res = await prismaClient.follows.findMany({
        where: { follower: { id: parent.id } },
        include: {
          following: true,
        },
      });
      // console.log(res);
      return res.map((el) => el.following);
    },
    recomendedUsers: async (parent: User, _: any, ctx: GraphqlContext) => {
      if (!ctx.user) return [];
      const cachedValue = await redisClient.get(`RECOMENDED_USERS:${ctx.user.id}`) as string | null;
      if(cachedValue) return JSON.parse(cachedValue);
      const myFollowing = await prismaClient.follows.findMany({
        where: {
          follower: { id: ctx.user.id },
        },
        include: {
          following: {
            include: { followers: { include: { following: true } } },
          },
        },
      });
      const users: User[] = [];
      // console.log(myFollowing[0].following.followers)
      for (const followings of myFollowing) {
        for (const followingOfFollowedUser of followings.following.followers) {
          if (
            followingOfFollowedUser.following.id !== ctx.user.id &&
            myFollowing.findIndex(
              (e) => e?.followingId === followingOfFollowedUser.following.id
            ) < 0
          ) {
            users.push(followingOfFollowedUser.following);
          }
        }
      }
      await redisClient.set(`RECOMENDED_USERS:${ctx.user.id}`,JSON.stringify(users))
      return users;
    },
  },
};

const muatations = {
  followUser: async (
    parent: any,
    { to }: { to: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    await UserService.followUser(ctx.user.id, to);
    await redisClient.del(`RECOMENDED_USERS:${ctx.user.id}`)
    return true;
  },
  unfollowUser: async (
    parent: any,
    { to }: { to: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    await UserService.unfollowUser(ctx.user.id, to);
    await redisClient.del(`RECOMENDED_USERS:${ctx.user.id}`)
    return true;
  },
};

export const resolvers = { queries, extraResolvers, muatations };
