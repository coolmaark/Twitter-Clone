import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";
import UserService from "../../services/user";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import TweetService, { CreateTweetPayload } from "../../services/tweet";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
  });
  
const queries = {
  getAllTweets: () =>
    TweetService.getAllTweets(),
  getSignedURLForTweet: async (
    parent: any,
    { imageType, imageName }: { imageType: string; imageName: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    const allowedImageTypes = ["image/jpg", "image/png", "image/jpeg", "image/webp"];
    if (!allowedImageTypes.includes(imageType))
      throw new Error("Unsupported Image Type");
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `uploads/${
        ctx.user.id
      }/tweets/${imageName}-${Date.now()}.${imageType}`,
    });
    const signedURL = getSignedUrl(s3Client, putObjectCommand);

    return signedURL;
  },
};

const muatations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");
    const tweet = await TweetService.createTweet({
        ...payload,
        userID: ctx.user.id
    });
    return tweet;
  },
};

const extraResolvers = {
  Tweet: {
    author: (parent: Tweet) => UserService.getUserById(parent.authorID),
  },
};

export const resolvers = { muatations, extraResolvers, queries };
