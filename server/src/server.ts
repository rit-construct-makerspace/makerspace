import express from "express";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import { createServer } from "http";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import { schema } from "./schema";
import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/./../.env' })

const PORT = process.env.PORT || 3000;
const app = express();
const corstOpts = cors();

app.use(corstOpts);
app.use(compression());

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});

(async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
})();

const httpServer = createServer(app);
httpServer.listen({ port: PORT }, (): void =>
  console.log(`🚀GraphQL-Server is running on http://localhost:${PORT}/graphql`)
);
