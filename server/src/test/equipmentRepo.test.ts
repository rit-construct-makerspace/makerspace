import { knex } from "../db";
import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository";
import { EquipmentInput } from "../schemas/equipmentSchema";
import * as RoomRepo from "../repositories/Rooms/RoomRepository";
import * as ModuleRepo from "../repositories/Training/ModuleRepository";

const tables = ["Equipment", "TrainingModule", "ModulesForEquipment", "Rooms"];

describe("EquipmentRepository tests", () => {
  beforeAll(() => {
    return knex.migrate.latest();
    // we can here also seed our tables, if we have any seeding files
  });

  beforeEach(() => {
    // reset tables...
    tables.forEach(async (t) => {
      await knex(t).del();
    });
  });

  afterAll(() => {
    // reset tables...
    tables.forEach(async (t) => {
        knex(t).del();
    });
    knex.destroy();
  });

  test("getEquipments with no rows", async () => {
    let equipmentRows = await EquipmentRepo.getEquipments();
    expect(equipmentRows.length).toBe(0);
  });

  test("addEquipment and get", async () => {
    // Add a room
    let roomID = (await RoomRepo.addRoom({
        id: 0,
        name: "Test Room"
    })).id;

    // Add equipment to the room
    let equipment: EquipmentInput = {
        name: "Test Equipment",
        roomID: roomID,
        moduleIDs: <number[]>[]
    };

    // Add equipment
    await EquipmentRepo.addEquipment(equipment);

    let equipmentRows = await EquipmentRepo.getEquipments();
    expect(equipmentRows.length).toBe(1);
  });

  test("getEquipmentByID", async () => {
    // Add a room
    let roomID = (await RoomRepo.addRoom({
        id: 0,
        name: "Test Room"
    })).id;

    // Add equipment to the room
    let equipment: EquipmentInput = {
        name: "Test Equipment",
        roomID: roomID,
        moduleIDs: <number[]>[]
    };

    // Add and get ID
    let equipmentID = (await EquipmentRepo.addEquipment(equipment)).id;

    // Get by ID
    let equipmentRow = await EquipmentRepo.getEquipmentByID(equipmentID);

  });

  test("updateEquipment", async () => {
    // Add a room
    let roomID = (await RoomRepo.addRoom({
        id: 0,
        name: "Test Room"
    })).id;

    // Add equipment to the room
    let equipmentID = (await EquipmentRepo.addEquipment({
        name: "Test Equipment",
        roomID: roomID,
        moduleIDs: <number[]>[]
    })).id;

    // Check added
    expect(await EquipmentRepo.getEquipmentByID(equipmentID)).toBeDefined();

    // Update name
    await EquipmentRepo.updateEquipment(equipmentID, {
        name: "Test Equipment Updated",
        roomID: roomID,
        moduleIDs: <number[]>[]
    });

    // Check name updated
    expect((await EquipmentRepo.getEquipmentByID(equipmentID)).name).toBe("Test Equipment Updated");
  });

  test("archiveEquipment", async () => {
    // Add a room
    let roomID = (await RoomRepo.addRoom({
        id: 0,
        name: "Test Room"
    })).id;

    // Add equipment to the room
    let equipmentID = (await EquipmentRepo.addEquipment({
        name: "Test Equipment",
        roomID: roomID,
        moduleIDs: <number[]>[]
    })).id;

    // Check added
    expect(await EquipmentRepo.getEquipmentByID(equipmentID)).toBeDefined();

    // Update name
    await EquipmentRepo.archiveEquipment(equipmentID);

    // Check archived
    expect((await EquipmentRepo.getEquipmentByID(equipmentID)).archived).toBe(true);
  });

  test("addModulesToEquipment and get", async () => {
    // Add a room
    let roomID = (await RoomRepo.addRoom({
        id: 0,
        name: "Test Room"
    })).id;

    // Add equipment to the room
    let equipmentID = (await EquipmentRepo.addEquipment({
        name: "Test Equipment",
        roomID: roomID,
        moduleIDs: <number[]>[]
    })).id;

    let moduleID = (await ModuleRepo.addModule("Test Module")).id;

    // Check added
    expect(await EquipmentRepo.getEquipmentByID(equipmentID)).toBeDefined();

    // Add module to equipment
    await EquipmentRepo.addModulesToEquipment(equipmentID, [moduleID]);

    let modules = await EquipmentRepo.getModulesByEquipment(equipmentID);
    expect(modules.length).toBe(1);
    expect(modules[0].name).toBe("Test Module");
  });

  test("updateModules", async () => {
    // Add a room
    let roomID = (await RoomRepo.addRoom({
        id: 0,
        name: "Test Room"
    })).id;

    // Add equipment to the room
    let equipmentID = (await EquipmentRepo.addEquipment({
        name: "Test Equipment",
        roomID: roomID,
        moduleIDs: <number[]>[]
    })).id;

    let moduleOneID = (await ModuleRepo.addModule("Test Module I")).id;
    let moduleTwoID = (await ModuleRepo.addModule("Test Module II")).id;

    // Check added
    expect(await EquipmentRepo.getEquipmentByID(equipmentID)).toBeDefined();

    // Add module to equipment
    await EquipmentRepo.addModulesToEquipment(equipmentID, [moduleOneID]);

    let modulesPreUpdate = await EquipmentRepo.getModulesByEquipment(equipmentID);
    expect(modulesPreUpdate.length).toBe(1);
    expect(modulesPreUpdate[0].name).toBe("Test Module I");

    // Update to use module II
    await EquipmentRepo.updateModules(equipmentID, [moduleTwoID]);

    let modulesPostUpdate = await EquipmentRepo.getModulesByEquipment(equipmentID);
    expect(modulesPostUpdate.length).toBe(1);
    expect(modulesPostUpdate[0].name).toBe("Test Module II");
  });
});
