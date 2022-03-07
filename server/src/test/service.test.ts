import { TrainingModule } from "../schemas/trainingSchema";
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
    await ModuleRepo.addModule("test");
    let mods = await ModuleRepo.getModules();
    expect(mods.length).toBe(1);
  });
});
