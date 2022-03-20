import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createServer } from "https";
import compression from "compression";
import cors from "cors";
import { schema } from "./schema";
import dotenv from "dotenv";
import fs from "fs";
import { setupAuth } from "./auth";
import { Privilege, User } from "./schemas/usersSchema";

export interface ApolloContext {
  user: User | undefined;
  userHasPrivilege: (...allowedPrivileges: Privilege[]) => boolean;
  logout: () => void;
}

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
    context: ({ req }) => ({
      user: req.user,
      userHasPrivilege: (...allowedPrivileges: Privilege[]) =>
        allowedPrivileges.includes((req.user as User)?.privilege),
      logout: () => req.logout(),
    }),
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: CORS_CONFIG,
  });

  const httpsServer = createServer(
    {
      key: fs.readFileSync(process.cwd() + "/cert/key.pem", "utf8"),
      cert: fs.readFileSync(process.cwd() + "/cert/cert.pem", "utf8"),
    },
    app
  );

  const PORT = process.env.PORT || 3000;

  httpsServer.listen({ port: PORT }, (): void =>
    console.log(
      `🚀 GraphQL-Server is running on https://localhost:${PORT}/graphql`
    )
  );
}

startServer();
