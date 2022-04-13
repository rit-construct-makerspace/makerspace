import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createServer } from "http";
import compression from "compression";
import cors from "cors";
import { schema } from "./schema";
import dotenv from "dotenv";
import { setupAuth } from "./auth";
import context from "./context";

const CORS_CONFIG = {
  origin: "https://localhost:3001",
  credentials: true,
};

async function startServer() {
  dotenv.config({ path: __dirname + "/./../.env" });

  const app = express();

  app.use(cors(CORS_CONFIG));

  app.use(compression());

  setupAuth(app);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context,
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: CORS_CONFIG,
  });

  const httpServer = createServer(
    app
  );

  const PORT = process.env.PORT || 3000;

  httpServer.listen({ port: PORT }, (): void =>
    console.log(
      `🚀 GraphQL-Server is running on http://localhost:${PORT}/graphql`
    )
  );
}

startServer();
