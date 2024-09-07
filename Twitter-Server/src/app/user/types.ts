export const types = `#graphql
    
type User {
    id : ID!
    firstName : String!
    LastName : String!
    email : String!
    profileImageURL : String
    follower:[User]
    following:[User]

    recomendedUsers:[User]  
    tweets: [Tweet]
}

`;
