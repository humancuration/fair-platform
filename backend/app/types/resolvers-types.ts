import { GraphQLResolveInfo } from 'graphql';
import { Context } from './context';

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = {
  [key: string]: ResolverFn<TResult, TParent, TContext, TArgs>;
};
