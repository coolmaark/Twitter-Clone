import { json } from "body-parser";
import { prismaClient } from "../clients/db";
import { redisClient } from "../clients/redis";

export interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  userID: string;
}
class TweetService {
  public static async createTweet(data: CreateTweetPayload) {
    const rateLimitFlag = await redisClient.get(`RATE_LIMIT:TWEET:${data.userID}`)
    if(rateLimitFlag) throw new Error('Please wait ...')
    const tweet = await prismaClient.tweet.create({
      data: {
        content: data.content,
        imageURL: data.imageURL,
        author: { connect: { id: data.userID } },
      },
    });
    await redisClient.setex(`RATE_LIMIT:TWEET:${data.userID}`,10, 1)
    await redisClient.del("ALL_TWEETS");
    return tweet;
  }
  public static async getAllTweets() {
    const cachedTweets = (await redisClient.get("ALL_TWEETS")) as JSON | undefined;
    console.log((cachedTweets));
    if (cachedTweets) return (cachedTweets);
    const tweets = await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
    });
    // console.log("________________");
    // console.log(tweets)
    await redisClient.set("ALL_TWEETS", JSON.stringify(tweets));
    return tweets;
  }
}

export default TweetService;
