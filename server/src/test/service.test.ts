import { Module } from "../models/training/module";
import { knex } from "../db";
import { ModuleRepo } from "../repositories/Training/ModuleRepository";


describe("Example test set", () => {

  beforeAll(() => {
    return knex.migrate.latest();
    // we can here also seed our tables, if we have any seeding files
  });

  afterAll(() => {
    knex.destroy();
  });

  test("example test", async () => {
    let mr = new ModuleRepo();
    let m1 = new Module("test", []);
    await mr.addModule(m1);
    let mods = await mr.getModules();
    expect(mods.length).toBe(1);
  });


});
