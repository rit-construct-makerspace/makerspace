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
import { getUserByCardTagID, getUsersFullName } from "./repositories/Users/UserRepository";
import { getRoomByID, hasSwipedToday, swipeIntoRoom } from "./repositories/Rooms/RoomRepository";
import { createLog } from "./repositories/AuditLogs/AuditLogRepository";
import { getEquipmentByID } from "./repositories/Equipment/EquipmentRepository";
var morgan = require("morgan"); //Log provider
var bodyParser = require('body-parser'); //JSON request body parser

const allowed_origins =  [process.env.REACT_APP_ORIGIN, "https://studio.apollographql.com", "https://make.rit.edu"];

/**
 * set up Cross-Origin Request allowances
 */
const CORS_CONFIG = {
  origin: process.env.REACT_APP_ORIGIN,
  credentials: true,
};

/**
 * Initialize the server runner
 */
async function startServer() {
  require("dotenv").config({ path: __dirname + "/./../.env" });

  //Init with Node Express
  const app = express();

  //Configure CORS
  app.use(cors(CORS_CONFIG));

  //Active File compression 
  app.use(compression());

  //Combined logging
  app.use(morgan("combined"));

  //JSON request body parsing
  app.use(bodyParser.json());

  //Prepare client session handler
  setupSessions(app);


  // environment setup
  /**
   * mode: DEVELOPMENT
   * Use local dev login view instead of SAML
   * !! INSECURE !!
   */
  if (process.env.NODE_ENV === "development") {
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    setupDevAuth(app);
  } 
  /**
   * mode: STAGING
   * Use the SAML configuration, but use insecure dev cookie handling
   */
  else if (process.env.NODE_ENV === "staging") {
    console.log("staging active");
    setupStagingAuth(app);
  } 
  /**
   * mode: PRODUCTION
   * Use production SAML settings. Full security
   */
  else if (process.env.NODE_ENV === "production") {
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
    console.log("LOGIN REDIRECT");
    //Redirect to login path
    //In staging/prod, /login will then redirect to the IdP
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



  /** ===============================================================================================
   * ACS Hardware Endpoints
   * --
   * These are the endpoints that the ACS hardware will access to authorize users and perform checks.
   * Note: JSON attributes are all Title case
  ===================================================================================================*/
  const API_NORMAL_LOGGING = true;
  const API_DEBUG_LOGGING = true;

  /**
   * WELCOME----
   * Log a user signing in to a makerspace room. Return whether the user is in the database
   * Request (JSON body):
   * - Type: "Welcome"
   * - Zone: the room id
   * - ID: the uid of the requesting user
   * - Key: a verification token
   * Response:
   * HTTP 202: User in system
   * HTTP 406: User/Zone not exists
   * HTTP 403: Key mismatch
   */
  app.put("/api/welcome", async function(req, res) {
    //If API Keys dont match, fail
    if (req.body.Key != process.env.API_KEY) {
      if (API_DEBUG_LOGGING) createLog("{uid} failed to swipe into a room with error '{error}'", {id: req.body.ID, label: req.body.ID}, {id: 403, label: "Invalid Key"});
      return res.status(403).json({error: "Invalid Key"});
    }

    const uid = req.body.ID;

    const user = await getUserByCardTagID(uid);

    const room = await getRoomByID(req.body.Zone);

    //If user is not found, fail
    if (user == undefined) {
      if (API_DEBUG_LOGGING) createLog("{uid} failed to swipe into a room with error '{error}'", {id: uid, label: req.body.ID}, {id: 406, label: "User does not exist"});
      return res.status(406).json({error: "User does not exist"});
    } 
    //If room is not found, fail
    else if (room == null) {
      if (API_DEBUG_LOGGING) createLog("{user} failed to swipe into a room with error '{error}'", {id: user.id, label: getUsersFullName(user)}, {id: 406, label: "Room does not exist"});
      return res.status(406).json({error: "Room does not exist"});
    }
    //Success. Log and return.
    else {
      swipeIntoRoom(req.body.Zone, user.id);
      if (API_NORMAL_LOGGING) createLog("{user} has signed into {room}", {id: user.id, label: getUsersFullName(user)}, {id: req.body.Zone, label: room.name});
      return res.status(202);
    }
  });


  /**
   * AUTHORIZATION----
   * Check whether a user has authorized access to a machine.
   * Request (Header):
   * - type: string representing the machine type
   * - machine: the ID of the machine according to the database
   * - zone: the room ID according to the database
   * - needswelcome: If true, check if user has signed into the room within the day
   * - id
   * 
   * TODO
   */
  app.get("/api/auth", async function(req, res) {
    if (req.query.id == undefined || req.query.needswelcome == undefined || req.query.zone == undefined || req.query.machine == undefined) {
      if (API_DEBUG_LOGGING) createLog("Request failed to gain equipent access with error '{error}'", {id: 400, label: "Missing paramaters"});
      return res.status(400).json({error: "Missing paramaters"});
    }

    const user = await getUserByCardTagID(req.query.id.toString());

    const room = await getRoomByID(parseInt(req.query.zone.toString()));

    const machine = await getEquipmentByID(parseInt(req.query.machine.toString()));

    //If user is not found, fail
    if (user == undefined) {
      if (API_DEBUG_LOGGING) createLog("{uid} failed to activate a machine with error '{error}'", {id: req.query.id, label: req.query.id.toString()}, {id: 406, label: "User does not exist"});
      return res.status(406).json({
        "Type": "Authorization",
        "Machine": req.query.machine,
        "UID": req.query.id,
        "Allowed": 0,
        "Error": "User does not exist"
      });
    } 
    //If room is not found, fail
    else if (room == null) {
      if (API_DEBUG_LOGGING) createLog("{user} failed to swipe into a machine with error '{error}'", {id: user.id, label: getUsersFullName(user)}, {id: 406, label: "Room " + req.query.zone.toString() + " does not exist"});
      return res.status(406).json({
        "Type": "Authorization",
        "Machine": req.query.machine,
        "UID": req.query.id,
        "Allowed": 0,
        "Error": "Room does not exist"
      });
    }
    //If machine is not found, fail
    else if (machine == null) {
      if (API_DEBUG_LOGGING) createLog("{user} failed to swipe into a machine with error '{error}'", {id: user.id, label: getUsersFullName(user)}, {id: 406, label: "Machine " + req.query.machine.toString() + " does not exist"});
      return res.status(406).json({
        "Type": "Authorization",
        "Machine": req.query.machine,
        "UID": req.query.id,
        "Allowed": 0,
        "Error": "Machine does not exist"
      });
    }

    //If needs welcome, check that room swipe has occured in the zone today
    if (req.query.needswelcome != undefined && req.query.needswelcome.toString() === "1") {
      if (!hasSwipedToday(room.id, user.id)) {
        if (API_DEBUG_LOGGING) createLog("{user} failed to swipe into {machine} with error '{error}'", {id: user.id, label: getUsersFullName(user)}, {id: machine.id, label: machine.name}, {id: 401, label: "User requires Welcome"});
        return res.status(401).json({
          "Type": "Authorization",
          "Machine": machine.id,
          "UID": req.query.id,
          "Allowed": 0,
          "Error": "User requires Welcome"
        });
      }
    }

    //Success
    if (API_NORMAL_LOGGING) createLog("{user} has activated {machine}", {id: user.id, label: getUsersFullName(user)}, {id: machine.id, label: machine.name});
    return res.status(202).json({
      "Type": "Authorization",
      "Machine": machine.id,
      "UID": req.query.id,
      "Allowed": 1
    });
  });


  /**
   * STATUS----
   * Report a card reader's current state to the database
   * Request (JSON body):
   * - Type: "Status"
   * - Machine: the ID of the machine according to the database
   * - MachineType: string representing the machine type
   * - Zone: the room ID according to the database
   * - Temp: Device temperature
   * - State: Device operation state string
   * - UID: If active, the UID of the current user
   * - Time: The length of the last (or current if active) session
   * - Source: Reason for the status message
   * - Frequency: How often scheduled status messages will be sent
   * - Key: API key for authorization
   * 
   * TODO
   */
  app.get("/api/auth/:MachineID", function(req, res) {

  });


  /**
   * HELP----
   * Report to the database that a user has pressed the help button on their machine
   * Request (JSON body):
   * - Type: "Help"
   * - Machine: the ID of the machine according to the database
   * - Zone: the room ID according to the database
   * - Key: API key for authorization
   * 
   * TODO
   */
  app.get("/api/auth/:MachineID", function(req, res) {
    //Slack bot?
  });


  /**
   * MESSAGE----
   * Submit an audit log
   * Request (header):
   * - message: The audit log message
   * 
   * TODO
   */
  app.get("/api/message/:MachineID", function(req, res) {
    if (req.query.message != undefined) {
      createLog(req.query.message.toString());
      return res.status(200);
    }
    return res.status(400);
  });

  /**
   * CHECK----
   * Report a card reader's current state to the database
   * 
   * TODO
   */
  app.get("/api/check/:MachineID", function(req, res) {

  });


    /**
   * STATE----
   * Check a machine's last returned State
   * 
   * TODO
   */
    app.get("/api/state/:MachineID", function(req, res) {

    });


  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });


  await server.start();
  //Enable GraphQL
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(CORS_CONFIG),
    json(),
    expressMiddleware(server, { context: context })
  );

  const httpServer = createServer(app);

  const PORT = process.env.PORT || 3000;

  console.log(process.env.ID_FORMAT);

  httpServer.listen({ port: PORT }, (): void =>
    console.log(
      `🚀 GraphQL-Server is running on https://localhost:${PORT}/graphql`
    )
  );
}

startServer();
