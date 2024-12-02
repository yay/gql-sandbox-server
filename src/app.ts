import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';

import { expressMiddleware } from '@apollo/server/express4';
import { createUser, deleteUser, getUsers, updateUser } from './db';
import type { Resolvers } from './generated/graphql';

dotenv.config();

enum EventNames {
	SCORE_CHANGED = 'SCORE_CHANGED',
}

const pubsub = new PubSub<{
	SCORE_CHANGED: number;
}>();

pubsub.publish('SCORE_CHANGED', 42);

const resolvers: Resolvers = {
	Query: {
		users: async () => {
			return getUsers();
		},
	},
	Mutation: {
		createUser: async (parent, args) => {
			const { email, firstName, lastName, score } = args.input;
			return createUser({ email, firstName, lastName, score });
		},
		deleteUser: async (parent, args) => {
			const { id } = args;
			return deleteUser(id);
		},
		updateUser: async (parent, args) => {
			const { input } = args;
			return updateUser(input);
		},
	},
	Subscription: {
		scoreChanged: {
			subscribe: async function* (parent, args) {
				const { userId } = args;
				for (;;) {
					await new Promise((resolve) => setTimeout(resolve, 500));
					const users = getUsers();
					const user =
						(userId && users.find((user) => user.id === userId)) || users[Math.floor(Math.random() * users.length)];
					yield {
						scoreChanged: {
							id: user.id,
							score: Math.floor(Math.random() * 100),
						},
					};
				}
			},
			// subscribe: withFilter(
			// 	() => pubsub.asyncIterableIterator(SCORE_CHANGED),
			// 	(payload, variables) => {
			// 		return payload.somethingChanged.id === variables.relevantId;
			// 	},
			// ),
		},
	},
};

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
	server: httpServer,
	path: '/subscriptions',
});

// https://www.apollographql.com/docs/apollo-server/data/context/
export interface SandboxContext {
	authScope?: string;
}

const serverCleanup = useServer({ schema }, wsServer);
const apolloServer = new ApolloServer<SandboxContext>({
	schema,
	plugins: [
		// Proper shutdown for the HTTP server.
		ApolloServerPluginDrainHttpServer({ httpServer }),

		// Proper shutdown for the WebSocket server.
		{
			async serverWillStart() {
				return {
					async drainServer() {
						await serverCleanup.dispose();
					},
				};
			},
		},
	],
});

await apolloServer.start();
app.use('/graphql', cors(), express.json(), expressMiddleware(apolloServer));

const PORT = 4000;
httpServer.listen(PORT, () => {
	console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});
