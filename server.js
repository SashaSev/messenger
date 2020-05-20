import express from "express";
import dotenv from "dotenv";
dotenv.config({});
import {ApolloServer} from "apollo-server-express";
import {makeExecutableSchema} from "graphql-tools";
import path from "path";
import {addUser} from "./middleware/userMiddleware"
import {fileLoader, mergeTypes, mergeResolvers} from "merge-graphql-schemas";

import models from "./models";

const SECRET = process.env.SECRET;
const refreshSECRET = process.env.refreshSECRET;

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./graphql/schema")));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, "./graphql/resolvers")))

const app = express();
app.use(express.json());
app.use(addUser)

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})
const server = new ApolloServer({
    schema, context: async ({req}) => ({
        models,
        user: req.user,
        SECRET,
        refreshSECRET
    })
})

server.applyMiddleware({app});

models.sequelize.sync({}).then(x => {
    app.listen({port: 5001});
})

