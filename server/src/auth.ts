import passport from "passport";
import { Strategy as SamlStrategy } from "passport-saml";
import session from "express-session";
import { v4 as uuid } from "uuid";
import assert from "assert";
import fs from "fs";
import express from "express";

// for serializeUser, some dude on the defintlyTyped discord told me to override the global Express.User like:
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
    }
  }
}

export default function setupAuth(app: express.Application) {
  const secret = process.env.SESSION_SECRET;
  const issuer = process.env.ISSUER;
  const callback = process.env.CALLBACK_URL;
  const entryPoint = process.env.ENTRY_POINT;

  assert(secret, "SESSION_SECRET env value is null");
  assert(issuer, "ISSUER env value is null");
  assert(callback, "CALLBACK_URL env value is null");
  assert(entryPoint, "ENTRY_POINT env value is null");

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
    path: "/login/callback",
    callbackUrl: callback,
    entryPoint: entryPoint,
    issuer: issuer,
    identifierFormat: null,
    decryptionPvk: fs.readFileSync(process.cwd() + "/cert/key.pem", "utf8"),
    privateCert: fs.readFileSync(process.cwd() + "/cert/key.pem", "utf8"),
    cert: fs.readFileSync(process.cwd() + "/cert/idp_cert.pem", "utf8"),
    validateInResponseTo: false,
    disableRequestedAuthnContext: true,
  };

  const samlStrategy = new SamlStrategy(
    samlConfig,
    (profile: any, done: any) => {
      // your body implementation on success, this is where we get attributes from the idp
      return done(null, profile);
    }
  );

  /* @ts-ignore */
  passport.use(samlStrategy);

  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user);
  });

  passport.deserializeUser((id, done) => {
    const matchingUser = { id: 1, username: "test user" }; // fake user that everyone gets until we have a user repo and user type
    done(null, matchingUser);
  });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

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
          fs.readFileSync(process.cwd() + "/cert/cert.pem", "utf8")
        )
      );
  });
};
