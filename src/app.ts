import * as dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { hash } from './hash';
import { readFileSync } from 'fs';

/**
 * The following lines intialize dotenv,
 * so that env vars from the .env file are present in process.env
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
    # Every object type in your schema automatically has a field named '__typename' (you don't need to define it).
    # The '__typename' field returns the object type's name as a String (e.g., 'Image').
    # GraphQL clients use an object's '__typename' for many purposes,
    # such as to determine which type was returned by a field that can return multiple types (i.e., a union or interface).
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
const resolvers = {
  Query: {
    dogs: async () => {
      const results = await fetch(`${API}/breeds/list/all`);
      const { message: dogs } = (await results.json()) as {
        message: { [key: string]: string[] };
      };

      const breeds = Object.keys(dogs);
      const result = breeds.map((breed) => createDog(breed, dogs[breed]));
      return result;
    },
    dog: async (root: any, { breed }: any) => {
      const results = await fetch(`${API}/breed/${breed}/list`);
      const { message: subbreeds } = (await results.json()) as {
        message: any[];
      };

      return createDog(breed, subbreeds);
    },
  },
  Dog: {
    displayImage: async ({ breed }: any) => {
      const results = await fetch(`${API}/breed/${breed}/images/random`);
      const { message: image } = (await results.json()) as { message: string };
      return image;
    },
    images: async ({ breed }: any) => {
      const results = await fetch(`${API}/breed/${breed}/images`);
      const { message: images } = (await results.json()) as {
        message: string[];
      };
      return images.map((image) => ({ url: image, id: hash(image) }));
    },
  },
};

const typeDefs = String(readFileSync('./schema.graphql'));

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
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
});

console.log(`🚀  Server ready at: ${url}`);
