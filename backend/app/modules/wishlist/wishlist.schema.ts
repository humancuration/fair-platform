import { GraphQLSchema } from 'graphql';
import gql from 'graphql-tag';

export const typeDefs = gql`
  type WishlistItem {
    id: Int!
    name: String!
    description: String
    price: Float
    url: String
    image: String
    wishlistId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Wishlist {
    id: Int!
    name: String!
    description: String
    isPublic: Boolean!
    userId: Int!
    items: [WishlistItem!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CommunityWishlist {
    id: Int!
    name: String!
    description: String
    image: String
    price: Float!
    communityName: String!
    userId: Int!
    user: User!
    highlighted: Boolean!
    contributors: [Int!]!
    totalContributions: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input WishlistItemInput {
    name: String!
    description: String
    price: Float
    url: String
    image: String
  }

  input UpsertWishlistInput {
    name: String!
    description: String
    isPublic: Boolean!
    items: [WishlistItemInput!]
  }

  input CommunityWishlistItemInput {
    name: String!
    description: String
    image: String
    price: Float!
    communityName: String!
  }

  type Query {
    wishlist(name: String!): Wishlist!
    publicWishlist(username: String!): Wishlist!
    communityWishlist: [CommunityWishlist!]!
  }

  type Mutation {
    upsertWishlist(input: UpsertWishlistInput!): Wishlist!
    addCommunityWishlistItem(input: CommunityWishlistItemInput!): CommunityWishlist!
    highlightCommunityItem(productId: Int!): CommunityWishlist!
    contributeToCommunityItem(itemId: Int!, amount: Float!): CommunityWishlist!
  }

  scalar DateTime
`;
