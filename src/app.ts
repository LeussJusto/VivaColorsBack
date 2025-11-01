import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import type { Request as ExpressRequest } from "express";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { express as voyagerMiddleware } from "graphql-voyager/middleware"; 

import { connectDB } from "./infrastructure/db/connection";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

import { userSchema } from "./interface/graphql/schema/userSchema";
import { userResolvers } from "./interface/graphql/resolvers/userResolver";
import { productSchema } from "./interface/graphql/schema/productSchema";
import { productResolvers } from "./interface/graphql/resolvers/productResolver";
import { orderSchema } from "./interface/graphql/schema/orderSchema";
import { orderResolvers } from "./interface/graphql/resolvers/OrderResolver";
import { quoteSchema } from "./interface/graphql/schema/quoteSchema";
import { quoteResolvers } from "./interface/graphql/resolvers/quoteResolvers";

dotenv.config();

export async function createApp() {
  const app = express();
  const httpServer = http.createServer(app);

  await connectDB();

  // Fusionar schemas y resolvers
  const typeDefs = mergeTypeDefs([userSchema, productSchema, orderSchema, quoteSchema]);
  const resolvers = mergeResolvers([userResolvers, productResolvers, orderResolvers, quoteResolvers]);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, 
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }: { req: ExpressRequest }) => {
        const authHeader = req.headers.authorization as string | undefined;
        const token = authHeader?.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : null;

        if (!token) return {};

        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            role: string;
          };
          return { user: decoded };
        } catch (error) {
          console.error("Token inválido:", error);
          return {};
        }
      },
    })
  );

  //  GraphQL Voyager
  app.use(
    "/voyager",
    voyagerMiddleware({
      endpointUrl: "/graphql",
      displayOptions: {
        sortByAlphabet: true,
        showLeafFields: true,
        skipRelay: false,
        skipDeprecated: false,
      },
    })
  );

  return { app, httpServer };
}