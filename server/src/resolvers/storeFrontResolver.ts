import { ApolloContext } from "../context";
import * as InventoryRepo from "../repositories/Store/inventoryRepository";
import * as LabelRepo from "../repositories/Store/labelRepository";
import { InventoryItemInput } from "../schemas/storeFrontSchema";
import { Privilege } from "../schemas/usersSchema";

const StorefrontResolvers = {
  Query: {
    InventoryItems: async (_: any, args: any, context: any) => {
      return await InventoryRepo.getItems();
    },

    InventoryItem: async (_: any, args: { id: string }, context: any) => {
      return await InventoryRepo.getItemById(Number(args.id));
    },

    Labels: async () => {
      return await LabelRepo.getAllLabels();
    },
  },

  InventoryItem: {
    labels: (parent: any) => {
      return InventoryRepo.getLabels(parent.id);
    },
  },

  Mutation: {
    createInventoryItem: async (
      _: any,
      args: { item: InventoryItemInput },
      context: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await InventoryRepo.addItem(args.item);
    }),

    updateInventoryItem: async (
      _: any,
      args: { itemId: string; item: InventoryItemInput },
      context: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await InventoryRepo.updateItemById(Number(args.itemId), args.item);
    }),

    addItemAmount: async (
      _: any,
      args: { itemId: string; count: number },
      context: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return InventoryRepo.addItemAmount(Number(args.itemId), args.count);
    }),

    removeItemAmount: async (
      _: any,
      args: { itemID: string; count: number },
      context: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return InventoryRepo.addItemAmount(Number(args.itemID), args.count * -1);
    }),

    deleteInventoryItem: async (
      _: any,
      args: { itemID: string },
      context: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return InventoryRepo.archiveItem(Number(args.itemID));
    }),

    createLabel: async (_: any, args: { label: string }, context: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        await LabelRepo.addLabel(args.label);
    }),

    deleteLabel: async (_: any, args: { label: string }, context: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        await LabelRepo.archiveLabel(args.label);
    }),
  },
};

export default StorefrontResolvers;
