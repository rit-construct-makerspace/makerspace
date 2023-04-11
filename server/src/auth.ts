import passport from "passport";
import {
  Strategy as SamlStrategy,
  ValidateInResponseTo,
} from "@node-saml/passport-saml";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";
import assert from "assert";
import fs from "fs";
import express from "express";
import {
  createUser,
  getUserByRitUsername,
} from "./repositories/Users/UserRepository";
import { getHoldsByUser } from "./repositories/Holds/HoldsRepository";
import { CurrentUser } from "./context";

interface RitSsoUser {
  firstName: string;
  lastName: string;
  email: string;
  ritUsername: string;
}

// Map the test users from samltest.id to match
// the format that RIT SSO will give us.
function mapSamlTestToRit(testUser: any): RitSsoUser {
  return {
    firstName: testUser["urn:oid:2.5.4.42"],
    lastName: testUser["urn:oid:2.5.4.4"],
    email: testUser.email,
    ritUsername: testUser.email.split("@")[0], // samltest format
  };
}

export function setupAuth(app: express.Application) {
  const secret = process.env.SESSION_SECRET;
  const issuer = process.env.ISSUER;
  const callbackUrl = process.env.CALLBACK_URL;
  const entryPoint = process.env.ENTRY_POINT;
  const reactAppUrl = process.env.REACT_APP_URL;
  const idpLogoutUrl = process.env.IDP_LOGOUT_URL;

  assert(secret, "SESSION_SECRET env value is null");
  assert(issuer, "ISSUER env value is null");
  assert(entryPoint, "ENTRY_POINT env value is null");
  assert(reactAppUrl, "REACT_APP_URL env value is null");

  app.use(
    session({
      genid: (req) => uuidv4(),
      secret: secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production" ? true : false, // this will make cookies send only over https
        httpOnly: true, // cookies are sent in requests, but not accessible to client-side JS
        maxAge: 900000, // 15 minutes in milliseconds
      },
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1); // trust first proxy
  }

  const samlConfig = {
    issuer: issuer,
    path: "/login/callback",
    callbackUrl: callbackUrl,
    entryPoint: entryPoint,
    identifierFormat: undefined,
    decryptionPvk: process.env.SSL_PVKEY ?? "",
    privateCert: process.env.SSL_PVKEY ?? "",
    cert: process.env.IDP_PUBKEY ?? "",
    validateInResponseTo: ValidateInResponseTo.never,
    disableRequestedAuthnContext: true,

    // TODO production solution
    acceptedClockSkewMs: 1000, // "SAML assertion not yet valid" fix
  };

  const samlStrategy = new SamlStrategy(
    samlConfig,
    (profile: any, done: any) => {
      // your body implementation on success, this is where we get attributes from the idp
      return done(null, profile);
    },
    (profile: any, done: any) => {
      // your body implementation on success, this is where we get attributes from the idp
      return done(null, profile);
    }
  );

  passport.use(samlStrategy);

  passport.serializeUser(async (user: any, done) => {
    const ritUser =
      process.env.SAML_IDP === "TEST" ? mapSamlTestToRit(user) : user;

    // Create user in our database if they don't exist
    const existingUser = await getUserByRitUsername(ritUser.ritUsername);
    if (!existingUser) {
      await createUser(ritUser);
    }

    done(null, ritUser.ritUsername);
  });

  passport.deserializeUser(async (username: string, done) => {
    const user = (await getUserByRitUsername(username)) as CurrentUser;

    if (!user) throw new Error("Tried to deserialize user that doesn't exist");

    // Populate user.hasHolds
    const holds = await getHoldsByUser(user.id);
    user.hasHolds = holds.some((hold) => !hold.removeDate);

    /* @ts-ignore */
    done(null, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const authenticate = passport.authenticate("saml", {
    failureFlash: true,
    failureRedirect: "/login/fail",
    successRedirect: reactAppUrl,
  });

  app.get("/login", authenticate);

  app.post("/login/callback", authenticate);

  app.get("/login/fail", function (req, res) {
    res.status(401).send("Login failed");
  });

  app.post("/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          res.status(400).send("Logout failed");
        } else {
          // res.clearCookie("connect.sid");
          res.redirect(process.env.REACT_APP_LOGGED_OUT_URL ?? "");
        }
      });
    } else {
      res.end();
    }
  });

  app.get("/Shibboleth.sso/Metadata", function (req, res) {
    res.type("application/xml");
    res
      .status(200)
      .send(
        samlStrategy.generateServiceProviderMetadata(
          process.env.SSL_PUBKEY ?? ""
        )
      );
  });

  app.all("/app/*", (req, res, next) => {
    if (req.user) {
      return next();
    }
    console.log("redirect");
    res.redirect("/login");
  });
}
