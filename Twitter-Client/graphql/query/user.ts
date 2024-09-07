import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
  #graphql
  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      profileImageURL
      email
      firstName
      LastName
      tweets {
        id
        content
        author {
          id
          firstName
          LastName
          profileImageURL
        }
      }
    }
  }
`);

export const getUserByIdQuery = graphql(`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      LastName
      email
      firstName
      id
      profileImageURL
      tweets {
        content
        id
        imageURL
        author {
          LastName
          email
          firstName
          id
          profileImageURL
        }
      }
    }
  }
`);
