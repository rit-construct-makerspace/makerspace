import { Module } from "../models/training/module";
import { knex } from "../db";
import * as ModuleRepo from "../repositories/Training/ModuleRepository";

describe("Example test set", () => {
  beforeAll(() => {
    return knex.migrate.latest();
    // we can here also seed our tables, if we have any seeding files
  });

  afterAll(() => {
    knex.destroy();
  });

  test("example test", async () => {
    let m1 = new Module("test", []);
    await ModuleRepo.addModule(m1);
    let mods = await ModuleRepo.getModules();
    expect(mods.length).toBe(1);
  });
});
