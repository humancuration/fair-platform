import { GraphQLResolveInfo } from 'graphql';
import { IContext } from './context';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type Resolvers<TContext = IContext> = {
  Query?: QueryResolvers<TContext>;
  Mutation?: MutationResolvers<TContext>;
  Wishlist?: WishlistResolvers<TContext>;
  WishlistItem?: WishlistItemResolvers<TContext>;
  CommunityWishlist?: CommunityWishlistResolvers<TContext>;
};

// Add other type definitions as needed...
