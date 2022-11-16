import { knex } from "../db";
import * as UserRepo from "../repositories/Users/UserRepository";
import { Privilege } from "../schemas/usersSchema";
import { ApolloContext, ifAllowed, ifAuthenticated } from "../context";
import { UserRow } from "../db/tables";
import { ApolloServer } from "apollo-server-express";
import { schema } from "../schema";
const request = require('request');

const url = process.env.GRAPHQL_ENDPOINT ?? "https://localhost:3000";
const tables = ["Users"];
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
    mutation CreateUser($firstName: String, $lastName: String, $ritUsername: String, $email: String) {
        createUser(
            firstName: $firstName
            lastName: $lastName
            ritUsername: $ritUsername
            email: $email
          ) {
            id
            firstName
            lastName
            privilege
        }
    }
`;

export const UPDATE_STUDENT_PROFILE = `
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

export const CREATE_HOLD = `
  mutation CreateHold($userID: ID!, $description: String!) {
    createHold(userID: $userID, description: $description) {
      id
    }
  }
`;

export const DELETE_USER = `
  mutation DeleteUser($userID: ID!) {
    deleteUser(userID: $userID) {
      id
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
            email: "jd0000@example.com"
        })).id;

        // Get by ID
        userZero = await UserRepo.getUserByID(userID);
        expect(userZero).toBeDefined();

        // Make user staff
        userZero  = await UserRepo.setPrivilege(userZero.id, Privilege.ADMIN);
        expect(userZero.privilege).toBe(Privilege.ADMIN);

        userZeroContext = () => ({
          user: {...userZero, hasHolds: false},
          logout: () => {},
          ifAllowed: ifAllowed(userZero),
          ifAuthenticated: ifAuthenticated(userZero)
        });
    } catch (error) {
        fail("Failed setup");
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

  test("getUsers with no rows", async () => {
    let server = new ApolloServer({
        schema,
        context: userZeroContext
    });

    let res = (await server.executeOperation(
        {
            query: GET_USERS
        }
    ));
    expect(res.errors).toBeUndefined();
  });

  test("STAFF addUser", async () => {
    let server = new ApolloServer({
        schema,
        context: userZeroContext
    });

    let res = (await server.executeOperation(
        {
            query: CREATE_USER,
            variables: {
                firstName: "Jane",
                lastName: "Doe",
                ritUsername: "jd1111",
                email: "jd1111@example.com"
            }
        }
    ));
    expect(res.errors).toBeUndefined();
    expect(res.data?.createUser).toBeDefined();

    res = (await server.executeOperation(
        {
            query: GET_USERS
        }
    ));
    expect(res.errors).toBeUndefined();

    const userRows = res.data?.users;
    expect(userRows).toBeDefined();
    expect(userRows.length).toBe(2);
  });

  test("STAFF getUserByID", async () => {
    let server = new ApolloServer({
        schema,
        context: userZeroContext
    });

    let res = (await server.executeOperation(
        {
            query: CREATE_USER,
            variables: {
                firstName: "Jane",
                lastName: "Doe",
                ritUsername: "jd1111",
                email: "jd1111@example.com"
            }
        }
    ));
    expect(res.errors).toBeUndefined();

    const userID = res.data?.createUser?.id;

    res = (await server.executeOperation(
        {
            query: GET_USER_BY_ID,
            variables: {
                userID: userID
            }
        },
    ));
    expect(res.errors).toBeUndefined();

    expect(res.data?.user).toBeDefined();
  });

  test("MAKER update self", async () => {
    let server = new ApolloServer({
        schema,
        context: userZeroContext
    });

    let res = (await server.executeOperation(
        {
            query: CREATE_USER,
            variables: {
                firstName: "Jane",
                lastName: "Doe",
                ritUsername: "jd1111",
                email: "jd1111@example.com"
            }
        }
    ));
    expect(res.errors).toBeUndefined();

    const userID = res.data?.createUser?.id;

    res = (await server.executeOperation(
        {
            query: GET_USER_BY_ID,
            variables: {
                userID: userID
            }
        },
    ));
    expect(res.errors).toBeUndefined();

    let user: UserRow = res.data?.user;

    const context = () => ({
        user: {...user, hasHolds: false},
        logout: () => {},
        ifAllowed: ifAllowed(user),
        ifAuthenticated: ifAuthenticated(user)
    });

    server = new ApolloServer({
        schema,
        context : context
    });

    res = (await server.executeOperation(
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
    ));
    expect(res.errors).toBeUndefined();

    res = (await server.executeOperation(
      {
          query: GET_USER_BY_ID,
          variables: {
              userID: userID
          }
      },
    ));
    expect(res.errors).toBeUndefined();

    let updatedUser = res.data?.user;

    expect(updatedUser).toBeDefined();
    expect(updatedUser.pronouns).toBe("she/her");
    expect(updatedUser.college).toBe("CAD");
    expect(updatedUser.expectedGraduation).toBe("2027");
    expect(updatedUser.universityID).toBe(UserRepo.hashUniversityID("000000000"));
  });

  test("MENTOR update user", async () => {
    // Make user mentor
    userZero  = await UserRepo.setPrivilege(userZero.id, Privilege.LABBIE);
    expect(userZero.privilege).toBe(Privilege.LABBIE);

    let server = new ApolloServer({
        schema,
        context: userZeroContext
    });

    let res = (await server.executeOperation(
        {
            query: CREATE_USER,
            variables: {
                firstName: "Jane",
                lastName: "Doe",
                ritUsername: "jd1111",
                email: "jd1111@example.com"
            }
        }
    ));
    expect(res.errors).toBeUndefined();

    const userID = res.data?.createUser?.id;

    res = (await server.executeOperation(
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
    ));
    expect(res.errors).toBeUndefined();

    res = (await server.executeOperation(
      {
          query: GET_USER_BY_ID,
          variables: {
              userID: userID
          }
      },
    ));
    expect(res.errors).toBeUndefined();

    let updatedUser = res.data?.user;

    expect(updatedUser).toBeDefined();
    expect(updatedUser.pronouns).toBe("she/her");
    expect(updatedUser.college).toBe("CAD");
    expect(updatedUser.expectedGraduation).toBe("2027");
    expect(updatedUser.universityID).toBe(UserRepo.hashUniversityID("000000000"));
  });

  test("STAFF update user", async () => {
    // User Zero starts as staff (see before each)

    let server = new ApolloServer({
        schema,
        context: userZeroContext
    });

    let res = (await server.executeOperation(
        {
            query: CREATE_USER,
            variables: {
                firstName: "Jane",
                lastName: "Doe",
                ritUsername: "jd1111",
                email: "jd1111@example.com"
            }
        }
    ));
    expect(res.errors).toBeUndefined();

    const userID = res.data?.createUser?.id;

    res = (await server.executeOperation(
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
    ));
    expect(res.errors).toBeUndefined();

    res = (await server.executeOperation(
      {
          query: GET_USER_BY_ID,
          variables: {
              userID: userID
          }
      },
    ));
    expect(res.errors).toBeUndefined();

    let updatedUser = res.data?.user;

    expect(updatedUser).toBeDefined();
    expect(updatedUser.pronouns).toBe("she/her");
    expect(updatedUser.college).toBe("CAD");
    expect(updatedUser.expectedGraduation).toBe("2027");
    expect(updatedUser.universityID).toBe(UserRepo.hashUniversityID("000000000"));
  });

  // test("MENTOR place hold", async () => {
  //   // Make user mentor
  //   userZero  = await UserRepo.setPrivilege(userZero.id, Privilege.LABBIE);
  //   expect(userZero.privilege).toBe(Privilege.LABBIE);

  //   let server = new ApolloServer({
  //       schema,
  //       context: userZeroContext
  //   });

  //   let res = (await server.executeOperation(
  //       {
  //           query: CREATE_USER,
  //           variables: {
  //               firstName: "Jane",
  //               lastName: "Doe",
  //               ritUsername: "jd1111",
  //               email: "jd1111@example.com"
  //           }
  //       }
  //   ));
  //   expect(res.errors).toBeUndefined();

  //   const userID = res.data?.createUser?.id;

  //   res = (await server.executeOperation(
  //       {
  //           query: UPDATE_STUDENT_PROFILE,
  //           variables: {
  //               userID: userID,
  //               pronouns: "she/her",
  //               college: "CAD",
  //               expectedGraduation: "2027",
  //               universityID: "000000000"
  //           }
  //       },
  //   ));
  //   expect(res.errors).toBeUndefined();

  //   res = (await server.executeOperation(
  //     {
  //         query: GET_USER_BY_ID,
  //         variables: {
  //             userID: userID
  //         }
  //     },
  //   ));
  //   expect(res.errors).toBeUndefined();

  //   let updatedUser = res.data?.user;

  //   expect(updatedUser).toBeDefined();
  //   expect(updatedUser.pronouns).toBe("she/her");
  //   expect(updatedUser.college).toBe("CAD");
  //   expect(updatedUser.expectedGraduation).toBe("2027");
  //   expect(updatedUser.universityID).toBe(UserRepo.hashUniversityID("000000000"));
  // });
});
