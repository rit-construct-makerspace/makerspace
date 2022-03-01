import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createServer } from "https";
import compression from "compression";
import cors from "cors";
import { schema } from "./schema";
import dotenv from "dotenv";
import fs from "fs";
import { setupMockAuth, setupAuth } from "./auth"


dotenv.config({ path: __dirname + "/./../.env" });

const PORT = process.env.PORT || 3000;
const app = express();
const corstOpts = cors();

const MOCK_AUTH = process.env.MOCK_AUTH
if (MOCK_AUTH === 'TRUE') {
  setupMockAuth(app)
} else {
  setupAuth(app)
}


app.use(corstOpts);
app.use(compression());

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: ({ req }) => ({
    getUser: () => req.user,
    logout: () => req.logout(),
  }),
});

(async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
})();

let options = {};

// attempt to start with https, switch to http on failure
try {
  options = {
    key: fs.readFileSync(process.cwd() + "/cert/key.pem", "utf8"),
    cert: fs.readFileSync(process.cwd() + "/cert/cert.pem", "utf8"),
  };
  const httpsServer = createServer(options, app);
  httpsServer.listen({ port: PORT }, (): void =>
    console.log(
      `🚀GraphQL-Server is running on https://localhost:${PORT}/graphql`
    )
  );
} catch (e) {
  const httpServer = createServer(app);
  httpServer.listen({ port: PORT }, (): void =>
    console.log(
      `🚀GraphQL-Server is running on http://localhost:${PORT}/graphql`
    )
  );
}
