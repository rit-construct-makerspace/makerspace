import { knex } from "../../db/index.js";
import * as UserRepo from "../../repositories/Users/UserRepository.js";

const tables = ["Users"];

describe("UserRepository tests", () => {
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
    let userRows = await UserRepo.getUsers();
    expect(userRows.length).toBe(0);
  });

  test("addUser and get", async () => {
    // Add user
    await UserRepo.createUser({
        firstName: "John",
        lastName: "Doe",
        ritUsername: "jd0000",
        universityID: "123456789"
    });

    let userRows = await UserRepo.getUsers();
    expect(userRows.length).toBe(1);
  });

  test("addUser and get", async () => {
    // Add user
    await UserRepo.createUser({
        firstName: "John",
        lastName: "Doe",
        ritUsername: "jd0000",
        universityID: "123456789"
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
        universityID: "123456789"
    })).id;

    // Get by ID
    let user = await UserRepo.getUserByID(userID);
    expect(user).toBeDefined();
  });

});
