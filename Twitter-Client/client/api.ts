import { GraphQLClient } from "graphql-request";
const isClient = typeof window !== "undefined";
console.log(`Bearer ${window.localStorage.getItem("_twitter_token")}`);
export const graphqlClient = new GraphQLClient(
  "http://localhost:8000/graphql",
  {
    headers: () => ({
      Authorization: isClient
        ? `Bearer ${window.localStorage.getItem("_twitter_token")}`
        : "undefined",
    }),
  }
);
