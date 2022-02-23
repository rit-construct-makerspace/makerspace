import { InventoryItemInput } from "../models/store/inventoryItemInput";
import { InventoryRepository } from "../repositories/Store/inventoryRepository";
import { LabelRepository } from "../repositories/Store/labelRepository";

const inventoryRepo = new InventoryRepository();
const labelRepo = new LabelRepository();

const StorefrontResolvers = {
  Query: {
    InventoryItems: async (_: any, args: any, context: any) => {
      return await inventoryRepo.getItems();
    },

    InventoryItem: async (_: any, args: { Id: number }, context: any) => {
      return await inventoryRepo.getItemById(args.Id);
    },

    Labels: async () => {
      return await labelRepo.getAllLabels();
    },
  },

  InventoryItem: {
    labels: (parent: any) => {
      return inventoryRepo.getLabels(parent.id);
    },
  },

  Mutation: {
    createInventoryItem: async (_: any, args: { item: InventoryItemInput }) => {
      return await inventoryRepo.addItem(args.item);
    },

    updateInventoryItem: async (
      _: any,
      args: { itemId: number; item: InventoryItemInput }
    ) => {
      return await inventoryRepo.updateItemById(args.itemId, args.item);
    },

    addItemAmount: async (_: any, args: { itemId: number; count: number }) => {
      return inventoryRepo.addItemAmount(args.itemId, args.count);
    },

    removeItemAmount: async (
      _: any,
      args: { itemId: number; count: number }
    ) => {
      return inventoryRepo.addItemAmount(args.itemId, args.count * -1);
    },

    deleteInventoryItem: async (_: any, args: { itemId: number }) => {
      return inventoryRepo.deleteItemById(args.itemId);
    },

    createLabel: async (_: any, args: { label: string }) => {
      await labelRepo.addLabel(args.label);
    },

    deleteLabel: async (_: any, args: { label: string }) => {
      await labelRepo.deleteLabel(args.label);
    },
  },
};

export default StorefrontResolvers;
