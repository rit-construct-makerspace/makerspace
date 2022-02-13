import { knex } from "../db";
import { InventoryItemInput } from "../models/store/inventoryItemInput";
import { InventoryRepository } from "../repositories/Store/inventoryRepository";
import { LabelRepository } from "../repositories/Store/labelRepository";

describe("InventoryRepository test set", () => {

  beforeAll(() => {
    return knex.migrate.latest();
    // we can here also seed our tables, if we have any seeding files
  });

  beforeEach(() => {
    // reset tables...
    const tables = [
      "InventoryItem",
      "Label",
      "InventoryItemLabel",
      "PurchaseOrder",
      "PurchaseOrderItem",
      "PurchaseOrderAttachment",
    ];
    tables.forEach(async (t) => {
      await knex(t).del().where("id", "!=", "null");
    });
  });

  afterAll(() => {
    knex.destroy();
  });

  test("getAllInventoryItems with no items", async () => {
    let invenRepo = new InventoryRepository();
    let items = await invenRepo.getItems();
    expect(items.length).toBe(0);
  });

  test("getAllInventoryItems with one item", async () => {
    let invenRepo = new InventoryRepository();
    let item = {
      id: 0,
      count: 10,
      image: "url",
      labels: [],
      name: "test",
      pluralUnit: "feet",
      pricePerUnit: 5.5,
      unit: "foot",
    };
    await invenRepo.addItem(item);
    let items = await invenRepo.getItems();
    expect(items.length).toBe(1);
    expect(items[0].name).toBe(item.name);
    expect(items[0].count).toBe(item.count);
    expect(items[0].image).toBe(item.image);
    expect(items[0].pluralUnit).toBe(item.pluralUnit);
    expect(items[0].pricePerUnit).toBe(item.pricePerUnit);
    expect(items[0].unit).toBe(item.unit);
  });

  test("getAllInventoryItems with three items", async () => {
    let invenRepo = new InventoryRepository();
    let item = {
      id: 0,
      count: 10,
      image: "url",
      labels: [],
      name: "test",
      pluralUnit: "feet",
      pricePerUnit: 5.5,
      unit: "foot",
    };
    await invenRepo.addItem(item);
    await invenRepo.addItem(item);
    await invenRepo.addItem(item);
    let items = await invenRepo.getItems();
    expect(items.length).toBe(3);
  });

  test("getInventoryItemsById with no items", async () => {
    let invenRepo = new InventoryRepository();
    let item = await invenRepo.getItemById(0);
    expect(item).toBe(null);
  });

  test("updateItemById", async () => {
    let invenRepo = new InventoryRepository();
    let item: InventoryItemInput = {
      count: 10,
      image: "url",
      labels: [],
      name: "test",
      pluralUnit: "feet",
      pricePerUnit: 5.5,
      unit: "foot",
    };
    let itemOutput = await invenRepo.addItem(item);
    if (itemOutput !== null) {
      item.count = 50;
      item.image = "test";
      item.name = "testtest";
      let final = await invenRepo.updateItemById(itemOutput.id, item);
      expect(final?.count).toBe(50);
      expect(final?.image).toBe("test");
      expect(final?.name).toBe("testtest");
    } else {
      fail("addItem returned null");
    }
  });

  test("deleteItemById", async () => {
    let invenRepo = new InventoryRepository();
    let item1: InventoryItemInput = {
      count: 10,
      image: "url",
      labels: [],
      name: "test",
      pluralUnit: "feet",
      pricePerUnit: 5.5,
      unit: "foot",
    };
    let item2: InventoryItemInput = {
      count: 11,
      image: "url2",
      labels: [],
      name: "test2",
      pluralUnit: "feet2",
      pricePerUnit: 5.52,
      unit: "foot2",
    };
    let item1Output = await invenRepo.addItem(item1);
    let item2Output = await invenRepo.addItem(item2);
    if (item1Output !== null) {
      let final = await invenRepo.deleteItemById(item1Output.id);
      let items = await invenRepo.getItems();
      expect(items.length).toBe(1);
      expect(items[0].id).toBe(item2Output?.id);
    } else {
      fail("addItem returned null");
    }
  });

  test("addLabels", async () => {
    let invenRepo = new InventoryRepository();
    let labelRepo = new LabelRepository();
    await labelRepo.addLabel("Test-label");
    await labelRepo.addLabel("Test-label2");
    let item1: InventoryItemInput = {
      count: 10,
      image: "url",
      labels: ["Test-label"],
      name: "test",
      pluralUnit: "feet",
      pricePerUnit: 5.5,
      unit: "foot",
    };
    let item1Output = await invenRepo.addItem(item1);
    if (item1Output !== null) {
      await invenRepo.addLabels(item1Output.id, ["Test-label2"]);
      let labels : string[] | null = await invenRepo.getLabels(item1Output.id);
      expect(labels).toContain('Test-label2');
      expect(labels).toContain('Test-label'); 
    } else {
      fail("addItem returned null");
    }
  });

  test("removeLabels", async () => {
    let invenRepo = new InventoryRepository();
    let labelRepo = new LabelRepository();
    await labelRepo.addLabel("Test-label");
    await labelRepo.addLabel("Test-label2");
    let item1: InventoryItemInput = {
      count: 10,
      image: "url",
      labels: ["Test-label","Test-label2"],
      name: "test",
      pluralUnit: "feet",
      pricePerUnit: 5.5,
      unit: "foot",
    };
    let item1Output = await invenRepo.addItem(item1);
    if (item1Output !== null) {
      await invenRepo.removeLabels(item1Output.id, ["Test-label2"]);
      let labels : string[] | null = await invenRepo.getLabels(item1Output.id);
      expect(labels).not.toContain('Test-label2');
      expect(labels).toContain('Test-label'); 
    } else {
      fail("addItem returned null");
    }
  })

});
