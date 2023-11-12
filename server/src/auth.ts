import fs from 'fs';
import passport from "passport";
import {
  Strategy as SamlStrategy,
  ValidateInResponseTo,
} from "@node-saml/passport-saml";

import { Strategy as LocalStrategy } from 'passport-local';
import session from "express-session";
import { v4 as uuidv4 } from "uuid";
import assert from "assert";
import express from "express";
import {
  createUser,
  getUserByRitUsername
} from "./repositories/Users/UserRepository";
import { getHoldsByUser } from "./repositories/Holds/HoldsRepository";
import { CurrentUser } from "./context";
import { createLog } from "./repositories/AuditLogs/AuditLogRepository";
import path from "path";

interface RitSsoUser {
  firstName: string;
  lastName: string;
  email: string;
  ritUsername: string;
}

function mapToDevUser(userID: string, password: string) {
  var obj = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/devUsers.json"), 'utf8'));
  const devUser = obj[userID];
  if (devUser === undefined || devUser["password"] !== password) {
    return undefined;
  }
  else {
    return {
      firstName: devUser.firstName,
      lastName: devUser.lastName,
      email: devUser.email,
      ritUsername: devUser.ritUsername
    };
  }
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

export function setupSessions(app: express.Application) {
  const secret = process.env.SESSION_SECRET;
  assert(secret, "SESSION_SECRET env value is null");

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
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict" // allow cookies to send between local ports in development
      },
    })
  );
}

// Unsafe auth -- local development only
export function setupDevAuth(app: express.Application) {
  const reactAppUrl = process.env.REACT_APP_URL;

  assert(reactAppUrl, "REACT_APP_URL env value is null");

  const authStrategy = new LocalStrategy(
    async function (username: string, password: string, done: any) {
      try {
        const devUser = mapToDevUser(username, password);

        if (devUser === undefined) {
          console.log("failed")
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        else {
          console.log("valid login");
          return done(null, devUser);
        }  
      }
      catch (err) {
        console.log(err)
        done(null, false, {message: 'some error'});
      }
    }
  );

  passport.serializeUser(async (user: any, done) => {
    // Create user in our database if they don't exist
    const existingUser = await getUserByRitUsername(user.ritUsername);
    if (!existingUser) {
      await createUser(user);
    }

    done(null, user.ritUsername);
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

  passport.use(authStrategy);

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get('/login', function(req, res, next) {
    res.render('login');
  });

  app.post('/login/password', passport.authenticate('local', {
    successRedirect: reactAppUrl,
    failureRedirect: '/login'
  }));
  
  app.post("/logout", (req, res) => {

    // for development purposes just nuking the session whenever it is requested
    passport.session().destroy

    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          res.status(400).send("Logout failed");
        } else {
          res.clearCookie("connect.sid");

          window.location.reload();
          // res.redirect(process.env.REACT_APP_LOGGED_OUT_URL ?? "");
        }
      });
    } else {
      res.end();
    }
  });
}

export function setupStagingAuth(app: express.Application) {
  const issuer = process.env.ISSUER;
  const callbackUrl = process.env.CALLBACK_URL;
  const entryPoint = process.env.ENTRY_POINT;
  const reactAppUrl = process.env.REACT_APP_URL;

  assert(issuer, "ISSUER env value is null");
  assert(callbackUrl, "CALLBACK_URL env value is null");
  assert(entryPoint, "ENTRY_POINT env value is null");
  assert(reactAppUrl, "REACT_APP_URL env value is null");

  const samlConfig = {
    issuer: issuer,
    path: "/login/callback",
    callbackUrl: callbackUrl,
    entryPoint: entryPoint,
    identifierFormat: "urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified",
    decryptionPvk: process.env.SSL_PVKEY ?? "",
    privateCert: process.env.SSL_PVKEY ?? "",
    cert: process.env.IDP_PUBKEY ?? "",
    validateInResponseTo: ValidateInResponseTo.never,
    disableRequestedAuthnContext: true,

    // TODO production solution
    acceptedClockSkewMs: 1000, // "SAML assertion not yet valid" fix
  };

  const authStrategy = new SamlStrategy(
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

  app.get("/Shibboleth.sso/Metadata", function (req, res) {
    res.type("application/xml");
    res
      .status(200)
      .send(
        authStrategy.generateServiceProviderMetadata(
          process.env.SSL_PUBKEY ?? ""
        )
      );
  });

  passport.use(authStrategy);

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

  app.post("/login/callback", authenticate, async (req, res) => {
    console.log("Logged in")
    if (req.user && 'id' in req.user && 'firstName' in req.user && 'lastName' in req.user) {
      await createLog(
        `{user} logged in.`,
        { id: req.user.id, label: `${req.user.firstName} ${req.user.lastName}` }
      );
    }
  });

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

}

export function setupAuth(app: express.Application) {
  // production authentication
  const issuer = process.env.ISSUER;
  const callbackUrl = process.env.CALLBACK_URL;
  const entryPoint = process.env.ENTRY_POINT;
  const reactAppUrl = process.env.REACT_APP_URL;

  assert(issuer, "ISSUER env value is null");
  assert(callbackUrl, "CALLBACK_URL env value is null");
  assert(entryPoint, "ENTRY_POINT env value is null");
  assert(reactAppUrl, "REACT_APP_URL env value is null");

  const samlConfig = {
    issuer: issuer,
    path: "/login/callback",
    callbackUrl: callbackUrl,
    entryPoint: entryPoint,
    identifierFormat: "urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified",
    decryptionPvk: process.env.SSL_PVKEY ?? "",
    privateCert: process.env.SSL_PVKEY ?? "",
    cert: process.env.IDP_PUBKEY ?? "",
    validateInResponseTo: ValidateInResponseTo.never,
    disableRequestedAuthnContext: true,

    // TODO production solution
    acceptedClockSkewMs: 1000, // "SAML assertion not yet valid" fix
  };

  const authStrategy = new SamlStrategy(
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

  passport.serializeUser(async (user: any, done) => {
    assert(process.env.SAML_IDP !== "TEST", "SAML_IDP Cannot be test for production")
    const ritUser =  mapSamlTestToRit(user);

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

  app.get("/Shibboleth.sso/Metadata", function (req, res) {
    res.type("application/xml");
    res
        .status(200)
        .send(
            authStrategy.generateServiceProviderMetadata(
                process.env.SSL_PUBKEY ?? ""
            )
        );
  });

  passport.use(authStrategy);

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

  app.post("/login/callback", authenticate, async (req, res) => {
    console.log("Logged in")
    if (req.user && 'id' in req.user && 'firstName' in req.user && 'lastName' in req.user) {
      await createLog(
          `{user} logged in.`,
          { id: req.user.id, label: `${req.user.firstName} ${req.user.lastName}` }
      );
    }
  });

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
}
