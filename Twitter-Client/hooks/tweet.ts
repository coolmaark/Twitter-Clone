import { graphqlClient } from "@/client/api";
import { graphql } from "@/gql";
import { CreateTweetData } from "@/gql/graphql";
import { createTweetMutation } from "../graphql/mutation/tweet";
import { getAllTweetQuery } from "@/graphql/query/tweet";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateTweet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateTweetInput) => {
      if (!createTweetMutation) {
        throw new Error("Invalid mutation document");
      }
      return graphqlClient.request(createTweetMutation, { payload });
    },
    onMutate: (payload) => {
      toast.loading("Uploading Tweet", { id: "1" });
    },
    onSuccess: async (payload) => {
      await queryClient.invalidateQueries(["all-tweets"]);
      toast.success("Tweet uploaded successfully", { id: "1" });
    },
    onError: (error: any) => {
      console.error("Error uploading tweet:", error);
      toast.error("Failed to upload tweet");
    },
  });

  return mutation;
};

export const useGetAllTweets = () => {
  const query = useQuery({
    queryKey: ["all-tweets"],
    queryFn: () => graphqlClient.request(getAllTweetQuery),
  });
  return { ...query, tweets: query.data?.getAllTweets };
};
