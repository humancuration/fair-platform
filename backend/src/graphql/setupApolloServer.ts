import { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import http from 'http';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

export const setupApolloServer = async (app: Express, httpServer: http.Server) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: (req as any).user }), // Adjust context as needed
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  console.log(`Apollo Server ready at http://localhost:${process.env.PORT || 5000}${server.graphqlPath}`);
};
