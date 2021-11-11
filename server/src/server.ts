import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import { schema } from "./schema";
import dotenv from 'dotenv'

dotenv.config({path:__dirname+'/./../.env'})

const PORT = process.env.PORT || 3000;
const app = express();
const corstOpts = cors({ origin: true });

app.use(corstOpts);
app.use(helmet());
app.use(compression());

const server = new ApolloServer({
  schema,
  introspection: true,
  debug: process.env.NODE_DEV === 'development',
});

(async function startServer () {
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });
})();

const httpServer = createServer(app);
httpServer.listen({ port: PORT }, (): void =>
  console.log(`🚀GraphQL-Server is running on http://localhost:${PORT}/graphql`)
);
