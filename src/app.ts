import * as dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { getYFinanceAuth } from './yahoo';
import { dogQueryResolvers, dogResolvers } from './dogs';
import { Resolvers } from './generated/graphql';

/**
 * The following lines initialize `dotenv`,
 * a module that loads env vars from the .env file into `process.env`.
 */
dotenv.config();

// https://www.apollographql.com/docs/apollo-server/performance/caching/

// During a GraphQL operation, you can share data throughout your server's resolvers and plugins
// by creating an object named `contextValue`. You can pass useful things through your `contextValue`
// that any resolver might need, like authentication scope, sources for fetching data, database connections,
// and custom fetch functions. If you're using data loaders to batch requests across resolvers,
// you can also attach them to the shared `contextValue`.
// https://www.apollographql.com/docs/apollo-server/data/context/

// Your server calls the `context` function once for every request,
// enabling you to customize your `contextValue` with each request's details (such as HTTP headers).

// Types for our `contextValue`:
export interface SandboxContext {
  authScope?: string;
}

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

// Provide resolver functions for your schema fields.
// Resolvers tell Apollo Server how to fetch the data associated with a particular type.
// Here we just wrap the `dog.ceo` REST-based API.
const resolvers: Resolvers = {
  Query: {
    ...dogQueryResolvers,
    finance: async () => {
      return await getYFinanceAuth('AAPL');
    },
  },
  ...dogResolvers,
  // In GraphQL, it's recommended for every mutation's response to include the data that the mutation modified.
  // This enables clients to obtain the latest persisted data without needing to send a followup query.
  Mutation: {
    addMovie: async (bred, parent, context) => {
      return {
        title: 'lol',
        director: {
          name: 'lol',
        },
      };
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer<SandboxContext>({
  typeDefs,
  resolvers,
  introspection: true, // it's recommended to disable this in production environment
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => ({
    authScope: req.headers.authorization,
  }),
});

console.log(`🚀  Server ready at: ${url}`);
