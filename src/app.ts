import * as dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { hash } from './hash';

/**
 * The following lines intialize dotenv,
 * so that env vars from the .env file are present in process.env
 */
dotenv.config();

// Construct a schema, using GraphQL schema language
const typeDefs = `
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  type Query {
    dogs: [Dog]
		dog(breed: String!): Dog
  }

	type Dog @cacheControl(maxAge: 1000) {
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

// Provide resolver functions for your schema fields
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

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
