import { knex } from "../db";
import { InventoryRepo } from "../repositories/Store/inventoryRepository";

describe("InventoryService test set", () => {
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

  test("getAllInventoryItems with not items", async () => {
    let invenRepo = new InventoryRepo();
    let items = await invenRepo.getItems();
    expect(items.length).toBe(0);
  });

  test("getAllInventoryItems with one item", async () => {
    let invenRepo = new InventoryRepo(); 
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
    expect(items[0].labels).toStrictEqual(item.labels);
    expect(items[0].pluralUnit).toBe(item.pluralUnit);
    expect(items[0].pricePerUnit).toBe(item.pricePerUnit);
    expect(items[0].unit).toBe(item.unit);
  });

  test("getAllInventoryItems with three items", async () => {
    let invenRepo = new InventoryRepo(); 
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
    let invenRepo = new InventoryRepo(); 
    let item = await invenRepo.getItemById(0);
    expect(item).toBe(null);
  });
});
