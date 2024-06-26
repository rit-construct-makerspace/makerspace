import { knex } from "../../db";
import { InventoryItemInput } from "../../schemas/storeFrontSchema";
import * as InventoryRepo from "../../repositories/Store/InventoryRepository";
import * as LabelRepo from "../../repositories/Store/LabelRepository";

const tables = ["InventoryItem", "Label", "InventoryItemLabel"];

describe("InventoryRepository test set", () => {
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

  test("getAllInventoryItems with no items", async () => {
    let items = await InventoryRepo.getItems();
    expect(items.length).toBe(0);
  });

  test("getAllInventoryItems with one item", async () => {
    let item = {
      id: 0,
      count: 10,
      image: "url",
      labels: [],
      name: "test",
      pluralUnit: "feet",
      pricePerUnit: 5.5,
      unit: "foot",
      threshold: 0,
    };
    await InventoryRepo.addItem(item);
    let items = await InventoryRepo.getItems();
    expect(items.length).toBe(1);
    expect(items[0].name).toBe(item.name);
    expect(items[0].count).toBe(item.count);
    expect(items[0].image).toBe(item.image);
    expect(items[0].pluralUnit).toBe(item.pluralUnit);
    expect(items[0].pricePerUnit).toBe(item.pricePerUnit);
    expect(items[0].unit).toBe(item.unit);
    expect(items[0].threshold).toBe(item.threshold);
  });

  test("getAllInventoryItems with three items", async () => {
    let item = {
      id: 0,
      count: 10,
      image: "url",
      labels: [],
      name: "test",
      pluralUnit: "feet",
      pricePerUnit: 5.5,
      unit: "foot",
      threshold: 0,
    };
    await InventoryRepo.addItem(item);
    await InventoryRepo.addItem(item);
    await InventoryRepo.addItem(item);
    let items = await InventoryRepo.getItems();
    expect(items.length).toBe(3);
  });

  test("getInventoryItemsById with no items", async () => {
    let item = await InventoryRepo.getItemById(0);
    expect(item).toBe(null);
  });

  test("updateItemById", async () => {
    let item: InventoryItemInput = {
      count: 10,
      image: "url",
      labels: [],
      name: "test",
      pluralUnit: "feet",
      pricePerUnit: 5.5,
      unit: "foot",
      threshold: 0,
    };
    let itemOutput = await InventoryRepo.addItem(item);
    if (itemOutput !== null) {
      item.count = 50;
      item.image = "test";
      item.name = "testtest";
      let final = await InventoryRepo.updateItemById(itemOutput.id, item);
      expect(final?.count).toBe(50);
      expect(final?.image).toBe("test");
      expect(final?.name).toBe("testtest");
    } else {
      fail("addItem returned null");
    }
  });

  test("archiveItemById", async () => {
    let item1: InventoryItemInput = {
      count: 10,
      image: "url",
      labels: [],
      name: "test",
      pluralUnit: "feet",
      pricePerUnit: 5.5,
      unit: "foot",
      threshold: 0,
    };
    let item2: InventoryItemInput = {
      count: 11,
      image: "url2",
      labels: [],
      name: "test2",
      pluralUnit: "feet2",
      pricePerUnit: 5.52,
      unit: "foot2",
      threshold: 0,
    };
    let item1Output = await InventoryRepo.addItem(item1);
    let item2Output = await InventoryRepo.addItem(item2);
    if (item1Output !== null) {
      let final = await InventoryRepo.archiveItem(item1Output.id);
      let items = await InventoryRepo.getItems();
      expect(items.length).toBe(1);
      expect(items[0].id).toBe(item2Output?.id);
    } else {
      fail("addItem returned null");
    }
  });

  test("addLabels", async () => {
    await LabelRepo.addLabel("Test-label");
    await LabelRepo.addLabel("Test-label2");
    let item1: InventoryItemInput = {
      count: 10,
      image: "url",
      labels: ["Test-label"],
      name: "test",
      pluralUnit: "feet",
      pricePerUnit: 5.5,
      unit: "foot",
      threshold: 0,
    };
    let item1Output = await InventoryRepo.addItem(item1);
    if (item1Output !== null) {
      await InventoryRepo.addLabels(item1Output.id, ["Test-label2"]);
      let labels: string[] | null = await InventoryRepo.getLabels(
        item1Output.id
      );
      expect(labels).toContain("Test-label2");
      expect(labels).toContain("Test-label");
    } else {
      fail("addItem returned null");
    }
  });

  test("removeLabels", async () => {
    await LabelRepo.addLabel("Test-label");
    await LabelRepo.addLabel("Test-label2");
    let item1: InventoryItemInput = {
      count: 10,
      image: "url",
      labels: ["Test-label", "Test-label2"],
      name: "test",
      pluralUnit: "feet",
      pricePerUnit: 5.5,
      unit: "foot",
      threshold: 0,
    };
    let item1Output = await InventoryRepo.addItem(item1);
    if (item1Output !== null) {
      await InventoryRepo.removeLabels(item1Output.id, ["Test-label2"]);
      let labels: string[] | null = await InventoryRepo.getLabels(
        item1Output.id
      );
      expect(labels).not.toContain("Test-label2");
      expect(labels).toContain("Test-label");
    } else {
      fail("addItem returned null");
    }
  });
});
