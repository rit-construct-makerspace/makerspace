import { knex } from "../../db/index.js";
import * as UserRepo from "../../repositories/Users/UserRepository.js";
import * as ModuleRepo from "../../repositories/Training/ModuleRepository.js";
import * as SubmissionRepo from "../../repositories/Training/SubmissionRepository.js";
import { PassedModule, Privilege, User } from "../../schemas/usersSchema.js";
import { ifAllowed, ifAllowedOrSelf, ifAuthenticated } from "../../context.js";
import { TrainingModuleItem, UserRow } from "../../db/tables.js";
import { ApolloServer, GraphQLResponse } from "@apollo/server";
import { schema } from "../../schema.js";
import assert from "assert";

const url = process.env.GRAPHQL_ENDPOINT ?? "https://localhost:3000";
const tables = ["ModuleSubmissions", "TrainingModule", "Users", "AuditLogs"];
let userZero: UserRow;
let userZeroContext: any;

const GET_USERS = `
    query GetUsers {
        users {
            id
            firstName
            lastName
            privilege
            pronouns
            college
            expectedGraduation
            universityID
        }
    }
`;

const GET_USER_BY_ID = `
    query GetUserByID($userID: ID!) {
        user(id: $userID) {
            id
            firstName
            lastName
            privilege
            pronouns
            college
            expectedGraduation
            universityID
        }
    }
`;

const CREATE_USER = `
    mutation CreateUser($firstName: String, $lastName: String, $ritUsername: String, $universityID: String) {
        createUser(
            firstName: $firstName
            lastName: $lastName
            ritUsername: $ritUsername
            universityID: $universityID
          ) {
            id
            firstName
            lastName
            privilege
        }
    }
`;

const UPDATE_STUDENT_PROFILE = `
  mutation UpdateStudentProfile(
    $userID: ID!
    $pronouns: String
    $college: String
    $expectedGraduation: String
    $universityID: String
  ) {
    updateStudentProfile(
      userID: $userID
      pronouns: $pronouns
      college: $college
      expectedGraduation: $expectedGraduation
      universityID: $universityID
    ) {
      id
    }
  }
`;

const CREATE_HOLD = `
  mutation CreateHold($userID: ID!, $description: String!) {
    createHold(userID: $userID, description: $description) {
      id
    }
  }
`;

const ARCHIVE_USER = `
  mutation ArchiveUser($userID: ID!) {
    archiveUser(userID: $userID) {
      id
    }
  }
`;

const SET_PRIVILEGE = `
  mutation SetPrivilege($userID: ID!, $privilege: Privilege) {
    setPrivilege(userID: $userID, privilege: $privilege)
  }
`;

const GET_PASSED_MODULES = `
  query GetPassedModules($userID: ID!) {
    user(id: $userID) {
        passedModules {
          moduleName
        }
    }
  }
`;

describe("User tests", () => {
  beforeAll(() => {
    return knex.migrate.latest();
    // we can here also seed our tables, if we have any seeding files
  });

  beforeEach(async () => {
    try {
        // reset tables...
        for(const t of tables) {
          await knex(t).del();
        }

        // Add user
        const userID = (await UserRepo.createUser({
            firstName: "John",
            lastName: "Doe",
            ritUsername: "jd0000",
            universityID: "123456789"
        })).id;

        // Get by ID
        userZero = await UserRepo.getUserByID(userID);
        expect(userZero).toBeDefined();

        // Make user staff
        userZero = await UserRepo.setPrivilege(userZero.id, Privilege.STAFF);
        expect(userZero.privilege).toBe(Privilege.STAFF);

        userZeroContext = {
            user: {...userZero, hasHolds: false},
            logout: () => {},
            ifAllowed: ifAllowed(userZero),
            ifAllowedOrSelf: ifAllowedOrSelf(userZero),
            ifAuthenticated: ifAuthenticated(userZero)
        };
    } catch (error) {
        console.error("Failed setup: " + error);
        fail();
    }
  });

  afterAll(async () => {
    try {
      // reset tables...
      for(const t of tables) {
        await knex(t).del();
      }
      await knex.destroy();
    } catch (error) {
      fail("Failed teardown");
    }
  });

  test("STAFF getUsers", async () => {
    let server = new ApolloServer({
        schema
    });

    const res: GraphQLResponse = (await server.executeOperation(
        {
            query: GET_USERS
        },
        {
            contextValue: userZeroContext
        }
    ));

    assert(res.body.kind === 'single');
    expect(res.body.singleResult.errors).toBeUndefined();
    assert(res.body.singleResult.data);

    assert(Array.isArray(res.body.singleResult.data.users)); // type narrowing
    expect(res.body.singleResult.data.users.length).toBe(1); // just one test user (from setup)
  });

  test("STAFF addUser", async () => {
    let server = new ApolloServer({
        schema
    });

    let userRequestData = {
        firstName: "Jane",
        lastName: "Doe",
        ritUsername: "jd1111",
        universityID: "123456789"
    }

    let createRes: GraphQLResponse = (await server.executeOperation(
        {
            query: CREATE_USER,
            variables: {
                firstName: userRequestData.firstName,
                lastName: userRequestData.lastName,
                ritUsername: userRequestData.ritUsername,
                universityID: userRequestData.universityID
            }
        },
        {
            contextValue: userZeroContext
        }
    ));


    assert(createRes.body.kind === 'single');
    expect(createRes.body.singleResult.errors).toBeUndefined();
    assert(createRes.body.singleResult.data);

    let userResponseData = <UserRow> createRes.body.singleResult.data.createUser; // type assertion

    expect(userResponseData.firstName).toBe(userRequestData.firstName);
    expect(userResponseData.lastName).toBe(userRequestData.lastName);

    const users = await UserRepo.getUsers();
    expect(users.length).toBe(2); // a user was added
  });

  test("STAFF getUserByID", async () => {
    let server = new ApolloServer({
        schema
    });

    // Create user via repo
    const userID: number = (await UserRepo.createUser({
        firstName: "Jane",
        lastName: "Doe",
        ritUsername: "jd1111",
        universityID: "123456789"
    })).id;

    const getUserRes = (await server.executeOperation(
        {
            query: GET_USER_BY_ID,
            variables: {
                userID: userID
            }
        },
        {
            contextValue: userZeroContext
        }
    ));

    assert(getUserRes.body.kind === 'single');
    expect(getUserRes.body.singleResult.errors).toBeUndefined();
    assert(getUserRes.body.singleResult.data);

    assert(getUserRes.body.singleResult.data.user);
    expect(Number((<UserRow> getUserRes.body.singleResult.data.user).id)).toBe(userID); // type assertion
  });

  test("MAKER update self", async () => {
    let server = new ApolloServer({
        schema
    });

    // Create user via repo
    const userID = (await UserRepo.createUser({
        firstName: "Jane",
        lastName: "Doe",
        ritUsername: "jd1111",
        universityID: "123456789"
    })).id;

    let user = await UserRepo.getUserByID(userID);

    expect(user).toBeDefined();
    expect(user).not.toBeNull();

    const newUserContext = {
        user: {...user, hasHolds: false},
        logout: () => {},
        ifAllowed: ifAllowed(user),
        ifAllowedOrSelf: ifAllowedOrSelf(user),
        ifAuthenticated: ifAuthenticated(user)
    };

    const updateRes = (await server.executeOperation(
        {
            query: UPDATE_STUDENT_PROFILE,
            variables: {
                userID: userID,
                pronouns: "she/her",
                college: "CAD",
                expectedGraduation: "2027",
                universityID: "000000000"
            }
        },
        {
            contextValue: newUserContext
        }
    ));

    assert(updateRes.body.kind === 'single');
    expect(updateRes.body.singleResult.errors).toBeUndefined();
    assert(updateRes.body.singleResult.data);

    let updatedUser = await UserRepo.getUserByID(userID);

    expect(updatedUser).toBeDefined();
    expect(updatedUser).not.toBeNull();
    expect(updatedUser.pronouns).toBe("she/her");
    expect(updatedUser.college).toBe("CAD");
    expect(updatedUser.expectedGraduation).toBe("2027");
    //expect(updatedUser.universityID).toBe(UserRepo.hashUniversityID("000000000"));
  });

  test("MAKER cannot update others", async () => {
    let server = new ApolloServer({
        schema
    });

    // Create user via repo
    const userID = (await UserRepo.createUser({
        firstName: "Jane",
        lastName: "Doe",
        ritUsername: "jd1111",
        universityID: "123456789"
    })).id;

    let user = await UserRepo.getUserByID(userID);
    expect(user).toBeDefined();
    expect(user).not.toBeNull();

    const newUserContext = {
        user: {...user, hasHolds: false},
        logout: () => {},
        ifAllowed: ifAllowed(user),
        ifAllowedOrSelf: ifAllowedOrSelf(user),
        ifAuthenticated: ifAuthenticated(user)
    };

    const updateRes = (await server.executeOperation(
        {
            query: UPDATE_STUDENT_PROFILE,
            variables: {
                userID: userZero.id, // tries to update a different user
                pronouns: "she/her",
                college: "CAD",
                expectedGraduation: "2027",
                universityID: "222222222"
            }
        },
        {
            contextValue: newUserContext
        }
    ));

    assert(updateRes.body.kind === 'single');
    expect(updateRes.body.singleResult.errors).toBeDefined();

    const errors = updateRes.body.singleResult.errors;
    assert(Array.isArray(errors));
    expect(errors[0].message).toBe('Insufficient privilege');

    const updatedUser = await UserRepo.getUserByID(userID);

    expect(updatedUser).toBeDefined();
    expect(updatedUser).not.toBeNull();
    expect(updatedUser.pronouns).toBe(userZero.pronouns);
    expect(updatedUser.college).toBe(userZero.college);
    expect(updatedUser.expectedGraduation).toBe(userZero.expectedGraduation);
  });

  test("MENTOR update user", async () => {
    // Make user mentor
    userZero  = await UserRepo.setPrivilege(userZero.id, Privilege.MENTOR);
    expect(userZero.privilege).toBe(Privilege.MENTOR);

    userZeroContext = {
        user: {...userZero, hasHolds: false},
        logout: () => {},
        ifAllowed: ifAllowed(userZero),
        ifAllowedOrSelf: ifAllowedOrSelf(userZero),
        ifAuthenticated: ifAuthenticated(userZero)
    };

    let server = new ApolloServer({
        schema
    });

    // Create user via repo
    const userID = (await UserRepo.createUser({
        firstName: "Jane",
        lastName: "Doe",
        ritUsername: "jd1111",
        universityID: "123456789"
    })).id;

    const user = await UserRepo.getUserByID(userID);
    expect(user).toBeDefined();
    expect(user).not.toBeNull();

    const updateRes = (await server.executeOperation(
        {
            query: UPDATE_STUDENT_PROFILE,
            variables: {
                userID: userID,
                pronouns: "she/her",
                college: "CAD",
                expectedGraduation: "2027",
                universityID: "000000000"
            }
        },
        {
            contextValue: userZeroContext // Mentor performs update
        }
    ));

    assert(updateRes.body.kind === 'single');
    expect(updateRes.body.singleResult.errors).toBeUndefined();
    assert(updateRes.body.singleResult.data);

    const updatedUser = await UserRepo.getUserByID(userID);

    expect(updatedUser).toBeDefined();
    expect(updatedUser).not.toBeNull();
    expect(updatedUser.pronouns).toBe("she/her");
    expect(updatedUser.college).toBe("CAD");
    expect(updatedUser.expectedGraduation).toBe("2027");
    //expect(updatedUser.universityID).toBe(UserRepo.hashUniversityID("000000000"));
  });

  test("STAFF update user", async () => {
    // User Zero starts as staff (see setup)

    let server = new ApolloServer({
        schema
    });

    // Create user via repo
    const userID = (await UserRepo.createUser({
        firstName: "Jane",
        lastName: "Doe",
        ritUsername: "jd1111",
        universityID: "123456789"
    })).id;

    let user = await UserRepo.getUserByID(userID);

    expect(user).toBeDefined();
    expect(user).not.toBeNull();

    const updateRes = (await server.executeOperation(
        {
            query: UPDATE_STUDENT_PROFILE,
            variables: {
                userID: userID,
                pronouns: "she/her",
                college: "CAD",
                expectedGraduation: "2027",
                universityID: "000000000"
            }
        },
        {
            contextValue: userZeroContext // Staff member performs update
        }
    ));

    assert(updateRes.body.kind === 'single');
    expect(updateRes.body.singleResult.errors).toBeUndefined();
    assert(updateRes.body.singleResult.data);

    let updatedUser = await UserRepo.getUserByID(userID);

    expect(updatedUser).toBeDefined();
    expect(updatedUser).not.toBeNull();
    expect(updatedUser.pronouns).toBe("she/her");
    expect(updatedUser.college).toBe("CAD");
    expect(updatedUser.expectedGraduation).toBe("2027");
    //expect(updatedUser.universityID).toBe(UserRepo.hashUniversityID("000000000"));
  });

  test("STAFF archive user", async () => {
    // User Zero starts as staff (see setup)

    let server = new ApolloServer({
      schema
    });

    // Create user via repo
    const userID = (await UserRepo.createUser({
        firstName: "Jane",
        lastName: "Doe",
        ritUsername: "jd1111",
        universityID: "123456789"
    })).id;

    let user = await UserRepo.getUserByID(userID);

    expect(user).toBeDefined();
    expect(user).not.toBeNull();

    const archiveRes = (await server.executeOperation(
      {
          query: ARCHIVE_USER,
          variables: {
              userID: userID
          }
      },
      {
          contextValue: userZeroContext // Staff member performs archive
      }
    ));

    assert(archiveRes.body.kind === 'single');
    expect(archiveRes.body.singleResult.errors).toBeUndefined();
    assert(archiveRes.body.singleResult.data);

    let updatedUser = await UserRepo.getUserByID(userID);

    expect(updatedUser).toBeDefined();
    expect(updatedUser).not.toBeNull();
    expect(updatedUser.id).toBe(userID);
  });

  test("MAKER get own passed modules", async () => {
    // make test user a Maker
    await UserRepo.setPrivilege(userZero.id, Privilege.MAKER);

    userZeroContext = {
        user: {...userZero, hasHolds: false},
        logout: () => {},
        ifAllowed: ifAllowed(userZero),
        ifAllowedOrSelf: ifAllowedOrSelf(userZero),
        ifAuthenticated: ifAuthenticated(userZero)
    };
    
    const exampleQuiz: TrainingModuleItem[] = [{
      id: '6784b67f-10d0-4476-8a81-e30c5f537e4e',
      type: 'TEXT',
      text: 'example'
    }]

    const moduleID = (await ModuleRepo.addModule('Test Module', exampleQuiz)).id;
    const submissionID = (await SubmissionRepo.addSubmission(userZero.id, moduleID, true))[0];

    let server = new ApolloServer({
        schema
    });

    let res = (await server.executeOperation({
            query: GET_PASSED_MODULES,
            variables: {
                userID: userZero.id
            }
        },
        {
            contextValue: userZeroContext
        }
    ));

    assert(res.body.kind === 'single');
    expect(res.body.singleResult.errors).toBeUndefined();
    assert(res.body.singleResult.data);

    const passedModules = (<User> res.body.singleResult.data.user).passedModules;
    assert(Array.isArray(passedModules));
    expect(passedModules.length).toBe(1);
    expect(passedModules[0].moduleName).toBe('Test Module');
  });
});
