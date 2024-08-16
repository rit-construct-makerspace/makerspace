import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { createServer } from "http";
import compression from "compression";
import cors from "cors";
import { schema } from "./schema.js";
import { setupSessions, setupDevAuth, setupStagingAuth, setupAuth } from "./auth.js";
import context from "./context.js";
import json from "body-parser";
import path from "path";
import { getUserByCardTagID, getUsersFullName } from "./repositories/Users/UserRepository.js";
import { getRoomByID, hasSwipedToday, swipeIntoRoom } from "./repositories/Rooms/RoomRepository.js";
import { createLog, createLogWithArray } from "./repositories/AuditLogs/AuditLogRepository.js";
import { getEquipmentByID, hasAccess, hasAccessByID } from "./repositories/Equipment/EquipmentRepository.js";
import { Room } from "./models/rooms/room.js";
import { Privilege } from "./schemas/usersSchema.js";
import { createReader, getReaderByID, getReaderByMachineID, getReaderByName, toggleHelpRequested, updateReaderStatus } from "./repositories/Readers/ReaderRepository.js";
import { isApproved } from "./repositories/Equipment/AccessChecksRepository.js";
import morgan from "morgan"; //Log provider
import bodyParser from "body-parser"; //JSON request body parser
import { createRequire } from "module";
import { getHoursByZone, WeekDays } from "./repositories/ZoneHours/ZoneHoursRepository.js";
const require = createRequire(import.meta.url);

const allowed_origins =  [process.env.REACT_APP_ORIGIN, "https://studio.apollographql.com", "https://make.rit.edu", "https://shibboleth.main.ad.rit.edu"];

const __dirname = import.meta.dirname;

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
  app.get("/", function(req , res) {
    res.redirect("/app/home");
  });





  app.get("/app/*", function (req, res) {
    res.header
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
  });

  // app.get('*', (req, res) => {
  //   res.redirect("/app");
  // });



  /** ===============================================================================================
   * ACS Hardware Endpoints
   * --
   * These are the endpoints that the ACS hardware will access to authorize users and perform checks.
   * Note: JSON attributes are all Title case
  ===================================================================================================*/
  const API_NORMAL_LOGGING = process.env.API_NORMAL_LOGGING == "true";
  const API_DEBUG_LOGGING = process.env.API_DEBUG_LOGGING == "true";

  /**
   * WELCOME----
   * Log a user signing in to a makerspace room. Return whether the user is in the database
   * Request (JSON body):
   * - Type: "Welcome"
   * - Zone: the room ids
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
      if (API_DEBUG_LOGGING) createLog("UID {conceal} failed to swipe into a room with error '{error}'", {id: 0, label: req.body.ID}, {id: 403, label: "Invalid Key"});
      return res.status(403).json({error: "Invalid Key"}).send();
    }

    const uid = req.body.ID;

    const user = await getUserByCardTagID(uid);

    var roomIDs = req.body.Zone.toString().split(",");

    var rooms: (Room | null)[] = [];

    // .forEach will not await the interior statements. Unsure why, so we use a normal for loop
    for (var i = 0; i < roomIDs.length; i++) {
      var idString = roomIDs[i];
      //console.log(await getRoomByID(parseInt(idString)));
      rooms.push(await getRoomByID(parseInt(idString)));
    }

    //If user is not found, fail
    if (user == undefined) {
      if (API_DEBUG_LOGGING) createLog("UID {conceal} failed to swipe into a room with error '{error}'", {id: 0, label: req.body.ID}, {id: 406, label: "User does not exist"});
      return res.status(406).json({error: "User does not exist"}).send();
    } 
    //If room is not found, fail
    else if (rooms.some(function(room) {
      return room == null;
    })) {
      if (API_DEBUG_LOGGING) createLog("{user} failed to swipe into a room with error '{error}'", {id: user.id, label: getUsersFullName(user)}, {id: 406, label: "Room does not exist"});
      return res.status(406).json({error: "Room does not exist"}).send();
    }
    //Success. Log and return.
    else {
      var roomNamesArray = [{id: user.id, label: getUsersFullName(user)}];
      var messageString = "{user} has signed into ";
      rooms.forEach(function(room) {
        if (room != null) {
          roomNamesArray.push({id: room.id, label: room.name});
          messageString += "{room}, ";
          swipeIntoRoom(room.id, user.id);
        }
      });
      if (API_NORMAL_LOGGING) createLogWithArray(messageString.substring(0,messageString.length-2), roomNamesArray);
      return res.status(202).send();
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
   * - id: user uid
   */
  app.get("/api/auth", async function(req, res) {
    if (req.query.id == undefined || req.query.needswelcome == undefined || req.query.zone == undefined || req.query.type == undefined) {
      if (API_DEBUG_LOGGING) createLog("Request failed to gain equipent access with error '{error}'", {id: 400, label: "Missing paramaters"});
      return res.status(400).json({error: "Missing paramaters"}).send();
    }

    const user = await getUserByCardTagID(req.query.id.toString());

    const room = await getRoomByID(parseInt(req.query.zone.toString()));

    //If user is not found, fail
    if (user == undefined) {
      if (API_DEBUG_LOGGING) createLog("UID {conceal} failed to activate a machine with error '{error}'", {id: 0, label: req.body.ID}, {id: 406, label: "User does not exist"});
      return res.status(406).json({
        "Type": "Authorization",
        "Machine": req.query.machine,
        "UID": req.query.id,
        "Allowed": 0,
        "Error": "User does not exist"
      }).send();
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
      }).send();
    }

    var machine;
    try {
      machine = await getEquipmentByID(parseInt(req.query.type.toString()));
    } catch (EntityNotFound) {
      if (API_DEBUG_LOGGING) createLog("{user} failed to swipe into a machine with error '{error}'", {id: user.id, label: getUsersFullName(user)}, {id: 406, label: "Machine " + req.query.type.toString() + " does not exist"});
      return res.status(406).json({
        "Type": "Authorization",
        "Machine": req.query.type,
        "UID": req.query.id,
        "Allowed": 0,
        "Error": "Machine does not exist"
      }).send();
    }

    //If machine is not found, fail
    if (machine == null) {
      if (API_DEBUG_LOGGING) createLog("{user} failed to swipe into a machine with error '{error}'", {id: user.id, label: getUsersFullName(user)}, {id: 406, label: "Machine " + req.query.type.toString() + " does not exist"});
      return res.status(406).json({
        "Type": "Authorization",
        "Machine": req.query.type,
        "UID": req.query.id,
        "Allowed": 0,
        "Error": "Machine does not exist"
      }).send();
    }


    //Staff bypass. Skip Welcome and training check.
    if (user.privilege == Privilege.STAFF) {
      if (API_NORMAL_LOGGING) createLog("{user} has activated {machine} with STAFF access", {id: user.id, label: getUsersFullName(user)}, {id: machine.id, label: machine.name});
      return res.status(202).json({
        "Type": "Authorization",
        "Machine": machine.id,
        "UID": req.query.id,
        "Allowed": 1
      }).send();
    }


    //If needs welcome, check that room swipe has occured in the zone today
    if (req.query.needswelcome != undefined && req.query.needswelcome.toString() === "1") {
      //console.log("Checking welcome status");
      const welcomed = await hasSwipedToday(room.id, user.id);
      if (!welcomed) {
        if (API_DEBUG_LOGGING) createLog("{user} failed to swipe into {machine} with error '{error}'", {id: user.id, label: getUsersFullName(user)}, {id: machine.id, label: machine.name}, {id: 401, label: "User requires Welcome"});
        return res.status(401).json({
          "Type": "Authorization",
          "Machine": machine.id,
          "UID": req.query.id,
          "Allowed": 0,
          "Error": "User requires Welcome"
        }).send();
      }
    }

    //Check that all required trainings are passed
    if (!(await hasAccessByID(user.id, machine.id))) {
      if (API_DEBUG_LOGGING) createLog("{user} failed to swipe into {machine} with error '{error}'", {id: user.id, label: getUsersFullName(user)}, {id: machine.id, label: machine.name}, {id: 401, label: "Incomplete trainings"});
      return res.status(401).json({
        "Type": "Authorization",
        "Machine": machine.id,
        "UID": req.query.id,
        "Allowed": 0,
        "Error": "Incomplete trainings"
      }).send();
    }

    //Check that equipment access check is completed
    if (!(await isApproved(user.id, machine.id))) {
      if (API_DEBUG_LOGGING) createLog("{user} failed to swipe into {machine} with error '{error}'", {id: user.id, label: getUsersFullName(user)}, {id: machine.id, label: machine.name}, {id: 401, label: "Missing Staff Approval"});
      return res.status(401).json({
        "Type": "Authorization",
        "Machine": machine.id,
        "UID": req.query.id,
        "Allowed": 0,
        "Error": "Missing Staff Approval"
      }).send();
    }

    //Success
    if (API_NORMAL_LOGGING) createLog("{user} has activated {machine}", {id: user.id, label: getUsersFullName(user)}, {id: machine.id, label: machine.name});
    return res.status(202).json({
      "Type": "Authorization",
      "Machine": machine.id,
      "UID": req.query.id,
      "Allowed": 1
    }).send();
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
   */
  app.put("/api/status", async function(req, res) {
    //If API Keys dont match, fail
    if (req.body.Key != process.env.API_KEY) {
      if (API_DEBUG_LOGGING) createLog("Access Device Status Update failed. Error '{error}'", {id: req.body.ID, label: req.body.ID}, {id: 403, label: "Invalid Key"});
      return res.status(403).json({error: "Invalid Key"}).send();
    }

    //console.log(req.body.Machine);
    var reader = await getReaderByName(req.body.Machine);
    //console.log(reader);
    if (reader == undefined) {
      reader = await createReader({
        name: req.body.Machine,
        machineID: req.body.MachineType,
        machineType: req.body.MachineType,
        zone: req.body.Zone
      });
      if (reader == undefined) {
        if (API_DEBUG_LOGGING) createLog("Access Device Status Update failed. Error '{error}'", {id: req.body.ID, label: req.body.ID}, {id: 400, label: "Reader does not exist"});
        return res.status(400).json({error: "Reader does not exist"}).send();
      }
    }
    updateReaderStatus({
      id: reader.id,
      machineID: parseInt(reader.machineType),
      machineType: reader.machineType,
      zone: reader.zone,
      temp: req.body.Temp,
      state: req.body.State,
      currentUID: req.body.UID,
      recentSessionLength: req.body.Time,
      lastStatusReason: req.body.Source,
      scheduledStatusFreq: req.body.Frequency,
      helpRequested: req.body.Help == null ? reader.helpRequested : (req.body.Help === "1")
    });
    return res.status(200).send();
  });


  /**
   * HELP----
   * Report to the database that a user has pressed the help button on their machine
   * Request (JSON body):
   * - Type: "Help"
   * - Machine: the ID of the machine according to the database
   * - Zone: the room ID according to the database
   * - Key: API key for authorization
   */
  app.put("/api/help", async function(req, res) {
    //If API Keys dont match, fail
    //console.log("HELP: " + JSON.stringify(req.body, null, 4));
    if (req.body.Key != process.env.API_KEY) {
      if (API_DEBUG_LOGGING) createLog("Access Device Help request failed with error '{error}'", {id: 403, label: "Invalid Key"});
      return res.status(403).json({error: "Invalid Key"}).send();
    }

    const reader = await getReaderByName(req.body.Machine);
    if (reader == undefined) {
      if (API_DEBUG_LOGGING) createLog("Access Device Help request failed. Error '{error}'", {id: req.body.ID, label: req.body.ID}, {id: 400, label: "Reader does not exist"});
      return res.status(400).json({error: "Reader does not exist"}).send();
    }
    await toggleHelpRequested(reader?.id);
    if (API_NORMAL_LOGGING) {
      if (!reader.helpRequested) createLog("Help requested at {access_device}!", {id: reader.id, label: reader.name}); //Prev was false, new is true
      else createLog("Help dismissed at {access_device}", {id: reader.id, label: reader.name}); //Prev was true, new is false
    }
    return res.status(200).send();
  });


  /**
   * MESSAGE----
   * Submit an audit log
   * Request (header):
   * - message: The audit log message
   */
  app.get("/api/message/:MachineID", async function(req, res) {
    const machine = await getReaderByName(req.params.MachineID);

    if (req.query.message != undefined && machine != undefined) {
      createLog("{access_device} message: " + req.query.message.toString(), {id: machine.id, label: machine.name});
      return res.status(200).send();
    }
    return res.status(400).send();
  });

  /**
   * CHECK----
   * Return 200
   */
  app.get("/api/check/:MachineID", function(req, res) {
    return res.status(200).send();
  });


  /**
   * STATE----
   * Check a machine's last returned State
   */
  app.get("/api/state/:MachineID", async function(req, res) {
    const reader =  await getReaderByName(req.params.MachineID);

    if (reader == undefined) {
      if (API_DEBUG_LOGGING) createLog("Access Device State fetch failed. Error '{error}'", {id: req.body.ID, label: req.body.ID}, {id: 400, label: "Reader does not exist"});
      return res.status(400).json({error: "Reader does not exist"}).send();
    }

    return res.status(200).json({
      Type: "State",
      MachineID: reader?.name,
      State: reader?.state
    })
  });


  /**
   * HOURS--
   * Fetch the hours associated with a zone string
   */
  app.get("/api/hours/:zone", async function(req, res) {
    const hourRows = await getHoursByZone(req.params.zone);

    var hoursString = "";
    hourRows.forEach(function(hourRow) {
      /**
       * Format:
       * Monday Open: 09:00
       * Monday Close: 22:00
       * Tuesday Open: 09:00
       * etc.
       */

      switch (hourRow.dayOfTheWeek) {
        case WeekDays.SUNDAY: 
          hoursString += "Sunday "; 
          break;
        case WeekDays.MONDAY: 
          hoursString += "Monday "; 
          break;
        case WeekDays.MONDAY: 
          hoursString += "Tuesday "; 
          break;
        case WeekDays.MONDAY: 
          hoursString += "Wednesday "; 
          break;
        case WeekDays.MONDAY: 
          hoursString += "Thursday "; 
          break;
        case WeekDays.MONDAY: 
          hoursString += "Friday "; 
          break;
        case WeekDays.MONDAY: 
          hoursString += "Saturday "; 
          break;
        default:
          hoursString += "Undefined "; 
          break;
      };

      hoursString += hourRow.type + ": ";

      hoursString += hourRow.time + "\n";
    });

    return res.status(200).json({
      text: hoursString,
      obj: hourRows
    }).send();
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
