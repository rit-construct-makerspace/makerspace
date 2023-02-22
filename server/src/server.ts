import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { createServer } from "https";
import compression from "compression";
import cors from "cors";
import { schema } from "./schema";
import fs from "fs";
import { setupAuth } from "./auth";
import context from "./context";
import { json } from "body-parser";
import path from "path";
var morgan = require('morgan');

const CORS_CONFIG = {
  origin: process.env.REACT_APP_ORIGIN,
  credentials: true,
};

async function startServer() {
  require('dotenv').config({ path: __dirname + "/./../.env" });

  const app = express();

  app.use(cors(CORS_CONFIG));

  // app.all('*', (req, res, next) => {
  //   res.header("Access-Control-Allow-Origin", CORS_CONFIG.origin);
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });

  app.use(compression());

  app.use(morgan('combined'));

  setupAuth(app);

  app.use("/app", express.static(path.join(__dirname, "../../client/build")));

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await server.start();
  app.use('/graphql', cors<cors.CorsRequest>(CORS_CONFIG), json(),
    expressMiddleware(server, {context: context})
  );

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
