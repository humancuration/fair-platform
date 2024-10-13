import { Express } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { userAPI } from '../datasources/UserAPI'; // Ensure userAPI is imported correctly

// Define your custom context type
interface Context {
  user: any; // Adjust this type as needed
  dataSources: {
    userAPI: InstanceType<typeof UserAPI>; // Use the class type directly
  };
}

export const setupApolloServer = async (app: Express, httpServer: http.Server) => {
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({
        user: (req as any).user, // Adjust context as needed
        dataSources: {
          userAPI: new userAPI(), // Initialize your data source here
        },
      }),
    })
  );

  console.log(`Apollo Server ready at http://localhost:${process.env.PORT || 5000}/graphql`);
};
