import { knex } from "../db";
import * as UserRepo from "../repositories/Users/UserRepository";

const tables = ["Users"];

describe("UserRepository tests", () => {
  beforeAll(() => {
    return knex.migrate.latest();
    // we can here also seed our tables, if we have any seeding files
  });

  beforeEach(() => {
    try {
      // reset tables...
      tables.forEach(async (t) => {
        await knex(t).del();
      });
    } catch (error) {
      fail("Failed setup");
    }
  });

  afterAll(() => {
    try {
      // reset tables...
      tables.forEach(async (t) => {
          knex(t).del();
      });
      knex.destroy();
    } catch (error) {
      fail("Failed teardown");
    }
  });

  test("getUsers with no rows", async () => {
    let userRows = await UserRepo.getUsers();
    expect(userRows.length).toBe(0);
  });

  test("addUser and get", async () => {
    // Add user
    UserRepo.createUser({
        firstName: "John",
        lastName: "Doe",
        ritUsername: "jd0000",
        email: "jd0000@example.com"
    });

    let userRows = await UserRepo.getUsers();
    expect(userRows.length).toBe(1);
  });

  test("addUser and get", async () => {
    // Add user
    UserRepo.createUser({
        firstName: "John",
        lastName: "Doe",
        ritUsername: "jd0000",
        email: "jd0000@example.com"
    });

    let userRows = await UserRepo.getUsers();
    expect(userRows.length).toBe(1);
  });

  test("getUserByID", async () => {
    // Add user
    const userID = (await UserRepo.createUser({
        firstName: "John",
        lastName: "Doe",
        ritUsername: "jd0000",
        email: "jd0000@example.com"
    })).id;

    // Get by ID
    let user = await UserRepo.getUserByID(userID);
    expect(user).toBeDefined();
  });

});
