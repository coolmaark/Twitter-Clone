import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";
import UserService from "../../services/user";

interface CreateTweetPayload {
    content : string
    imageURL?: string
}
const queries = {
    getAllTweets: () => prismaClient.tweet.findMany({orderBy:{ createdAt:"desc"}}),
}

const muatations = {
    createTweet:async(parent:any,{payload}:{payload: CreateTweetPayload},ctx: GraphqlContext)=>{
        if(!ctx.user) throw new Error("You are not authenticated");
        const tweet = await prismaClient.tweet.create({
            data:{
                content:payload.content,
                imageURL:payload.imageURL,
                author:{connect:{id:ctx.user.id}},
            },
        });
        return tweet;
    },
};

const extraResolvers = {
    Tweet: {
      author: (parent: Tweet) => UserService.getUserById(parent.authorID),
    },
  };

export const resolvers = {muatations, extraResolvers, queries}