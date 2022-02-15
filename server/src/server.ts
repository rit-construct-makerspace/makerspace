import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createServer } from "http";
import compression from "compression";
import cors from "cors";
import { schema } from "./schema";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as SamlStrategy } from "passport-saml";
import session from "express-session";
import { v4 as uuid } from "uuid";
import assert from "assert";
import fs from "fs";

dotenv.config({ path: __dirname + "/./../.env" });

const PORT = process.env.PORT || 3000;
const app = express();
const corstOpts = cors();

app.use(corstOpts);
app.use(compression());

const secret = process.env.SESSION_SECRECT;

assert(secret, "SESSION_SECRET env value is null");

app.use(
  session({
    genid: (req) => uuid(),
    secret: secret,
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }  // this will make cookies send only over https
  })
);

const samlConfig = {
  callbackUrl: process.env.CALLBACK_URL,
  entryPoint: process.env.ENTRY_POINT,
  issuer: process.env.ISSUER,
  identifierFormat: null,
  decryptionPvk: fs.readFileSync(process.cwd() + "/cert/key.pem", "utf8"),
  privateCert: fs.readFileSync(process.cwd() + "/cert/key.pem", "utf8"),
  cert: fs.readFileSync(process.cwd() + "/cert/idp_cert.pem", "utf8"),
  validateInResponseTo: false,
  disableRequestedAuthnContext: true,
};

const samlStrategy = new SamlStrategy(samlConfig, (profile: any, done: any) => {
  // your body implementation on success
  return done(null, profile);
});

/* @ts-ignore */
passport.use(samlStrategy);

// the types for this function do not seem correct, this will not build without modifying the type definition
// some dude on the defintlyTyped discord told me to override the global Express.User like:
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
    }
  }
}

passport.serializeUser((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  const matchingUser = { id: 1, username: "test user" }; // fake user that everyone gets until we have a user repo and user type
  done(null, matchingUser);
});

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

(async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
})();

app.get(
  "/login",
  passport.authenticate("saml", { failureRedirect: "/login/fail" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.post(
  "/login/callback",
  passport.authenticate("saml", { failureRedirect: "/login/fail" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/login/fail", function (req, res) {
  res.status(401).send("Login failed");
});

app.get("/Shibboleth.sso/Metadata", function (req, res) {
  res.type("application/xml");
  res
    .status(200)
    .send(
      samlStrategy.generateServiceProviderMetadata(
        fs.readFileSync(process.cwd() + "/cert/cert.pem", "utf8"),
        fs.readFileSync(process.cwd() + "/cert/key.pem", "utf8")
      )
    );
});

const httpServer = createServer(app);
httpServer.listen({ port: PORT }, (): void =>
  console.log(`🚀GraphQL-Server is running on http://localhost:${PORT}/graphql`)
);
