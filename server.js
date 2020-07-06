import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { addUser } from './middleware/userMiddleware';

import models from './models';

dotenv.config({});

const { SECRET } = process.env;
const { refreshSECRET } = process.env;

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './graphql/schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './graphql/resolvers')));

const app = express();
app.use(express.json());
app.use(addUser);

// eslint-disable-next-line import/prefer-default-export
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
const server = new ApolloServer({
  schema,
  context: async ({ req }) => ({
    models,
    user: req.user,
    SECRET,
    refreshSECRET,
  }),
});

server.applyMiddleware({ app });

models.sequelize.sync({}).then(() => {
  app.listen({ port: 5001 });
});
//  "husky": {
//    "hooks": {
//      "pre-commit": "npm run lint"
//    }
//  },
