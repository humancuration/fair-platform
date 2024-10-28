import { Express } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { UserService } from '../modules/user/userService';
import { GroupService } from '../modules/group/groupService';

// Define your custom context type
interface Context {
  user: any; // Adjust this type as needed
  services: {
    userService: UserService;
    groupService: GroupService;
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
        services: {
          userService: new UserService(),
          groupService: new GroupService(),
        },
      }),
    })
  );

  console.log(`Apollo Server ready at http://localhost:${process.env.PORT || 5000}/graphql`);
};
