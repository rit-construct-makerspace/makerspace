import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { createServer } from "http";
import compression from "compression";
import cors from "cors";
import { schema } from "./schema";
import { setupSessions, setupDevAuth, setupStagingAuth, setupAuth } from "./auth";
import context from "./context";
import { json } from "body-parser";
import path from "path";
var morgan = require("morgan");

const allowed_origins =  [process.env.REACT_APP_ORIGIN, "https://studio.apollographql.com", "https://make.rit.edu"];

const CORS_CONFIG = {
  origin: function (origin: any, callback: any) {
    if (allowed_origins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
};

async function startServer() {
  require("dotenv").config({ path: __dirname + "/./../.env" });

  const app = express();

  app.use(cors(CORS_CONFIG));

  app.use(compression());

  app.use(morgan("combined"));

  setupSessions(app);


  // environment setup
  if (process.env.NODE_ENV === "development") {
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    setupDevAuth(app);
  } else if (process.env.NODE_ENV === "staging") {
    setupStagingAuth(app);
  } else if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1); // trust first proxy
    setupAuth(app);
  } else {
    process.exit(-1);
  }

  app.use("/app", express.static(path.join(__dirname, "../../client/npx browserslist@latest --update-db\n")));

  //serves built react app files under make.rit.edu/app
  app.use("/app/", express.static(path.join(__dirname, '../../client/build')));

  //verifies user logged in under all front-end urls and if not send to login
  app.all("/app/*", (req, res, next) => {
    if (req.user) {
      return next();
    }
    res.redirect("/login");
  });


  //it might seem like you should be able to redirect straight to /app/ from / but for some reason it infitely refreshes
  // and this solves the issue
  app.get("/app/home", function(req, res) {
    res.redirect("/app/")
  })


  //redirects first landing make.rit.edu/ -> make.rit.edu/home
  app.get("/*", function(req , res) {
    res.redirect("/app/home");
  });



  // app.get("/app/", function (req, res) {
  //   res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
  // });

  // app.get('*', (req, res) => {
  //   res.redirect("/app");
  // });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });


  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(CORS_CONFIG),
    json(),
    expressMiddleware(server, { context: context })
  );

  const httpServer = createServer(app);

  const PORT = process.env.PORT || 3000;

  httpServer.listen({ port: PORT }, (): void =>
    console.log(
      `🚀 GraphQL-Server is running on https://localhost:${PORT}/graphql`
    )
  );
}

startServer();
