import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import axios from "axios";
import JWTService from "../../services/jwt";
import { error } from "console";
import UserService from "../../services/user";
import { GraphqlContext, JWTUser } from "../../interfaces";
import { prismaClient } from "../../clients/db";
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
    console.log(contextValue);
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
export const resolvers = { queries };
