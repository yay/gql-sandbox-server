import * as dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { hash } from './hash';
import { readFileSync } from 'fs';
import { Resolvers } from './generated/graphql';
import { createFolder } from './folderDb';

/**
 * The following lines initialize `dotenv`,
 * so that env vars from the .env file are present in `process.env`.
 */
dotenv.config();

// Construct a schema, using GraphQL schema language:
// https://www.apollographql.com/docs/apollo-server/schema/schema
// Comments start with `#`. The `#graphql` comment enables syntax highlighting
// (install the `graphql.vscode-graphql` VS Code extension).
// A more common way to define a schema is do it inside a '.graphql' file.
const schema = `#graphql
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "dogs" query returns an array of zero or more Dogs (defined below).
  type Query {
    dogs: [Dog]
		dog(breed: String!): Dog
  }

  # This "Dog" type defines the queryable fields for every dog in our data source.
	type Dog @cacheControl(maxAge: 1000) {
    # By default, it's valid for any field in your schema to return 'null' instead of its specified type.
    # You can require that a particular field doesn't return 'null' with an exclamation mark '!'.
		id: String!
		breed: String!
		displayImage: String
		images: [Image]
		subbreeds: [String]
	}

	type Image @cacheControl(maxAge: 1000) {
    url: String!
		id: String!
	}
`;

// https://www.apollographql.com/docs/apollo-server/performance/caching/

const createDog = (breed: string, subbreeds: string[]) => ({
  breed,
  id: hash(breed),
  subbreeds: subbreeds.length > 0 ? subbreeds : null,
});

const API = 'https://dog.ceo/api';

// Provide resolver functions for your schema fields.
// Resolvers tell Apollo Server how to fetch the data associated with a particular type.
// Here we just wrap the `dog.ceo` REST-based API.
const resolvers: Resolvers = {
  Query: {
    dogs: async (parent, args, context, info) => {
      const response = await fetch(`${API}/breeds/list/all`);
      const { message: breedToSubbreedsMap } = (await response.json()) as {
        message: { [breed: string]: string[] };
      };

      const breeds = Object.keys(breedToSubbreedsMap);
      const dogs = breeds.map((breed) =>
        createDog(breed, breedToSubbreedsMap[breed]),
      );
      return dogs;
    },
    dog: async (parent, { breed }) => {
      const response = await fetch(`${API}/breed/${breed}/list`);
      const { message: subbreeds } = (await response.json()) as {
        message: string[];
      };
      return createDog(breed, subbreeds);
    },
  },
  Dog: {
    displayImage: async ({ breed }, parent, context) => {
      const results = await fetch(`${API}/breed/${breed}/images/random`);
      const { message: image } = (await results.json()) as { message: string };
      return image;
    },
    images: async ({ breed }, parent, context) => {
      const results = await fetch(`${API}/breed/${breed}/images`);
      const { message: images } = (await results.json()) as {
        message: string[];
      };
      return images.map((image) => ({ url: image, id: hash(image) }));
    },
  },
  // In GraphQL, it's recommended for every mutation's response to include the data that the mutation modified.
  // This enables clients to obtain the latest persisted data without needing to send a followup query.
  Mutation: {
    createFolder: async (parent, args) => {
      const { name, fileSystemId, parentId } = args.input;
      return createFolder(name, fileSystemId, parentId);
    },
  },
};

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

// To setup code generation:
//   yarn add -D @graphql-codegen/cli
//               @graphql-codegen/typescript
//               @graphql-codegen/typescript-resolvers
//               @graphql-codegen/introspection
//   npx graphql-code-generator init

// During a GraphQL operation, you can share data throughout your server's resolvers and plugins
// by creating an object named `contextValue`. You can pass useful things through your `contextValue`
// that any resolver might need, like authentication scope, sources for fetching data, database connections,
// and custom fetch functions. If you're using dataloaders to batch requests across resolvers,
// you can also attach them to the shared `contextValue`.
// https://www.apollographql.com/docs/apollo-server/data/context/

// Your server calls the `context` function once for every request,
// enabling you to customize your `contextValue` with each request's details (such as HTTP headers).

// Types for our `contextValue`:
export interface SandboxContext {
  authScope?: string;
}

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
