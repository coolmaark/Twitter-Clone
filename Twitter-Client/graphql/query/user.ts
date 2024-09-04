import { gql } from "graphql-tag";

export const VERIFY_USER_GOOGLE_TOKEN_QUERY = gql`
  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`;
