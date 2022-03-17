import * as InventoryRepo from "../repositories/Store/inventoryRepository";
import * as LabelRepo from "../repositories/Store/labelRepository";
import { InventoryItemInput } from "../schemas/storeFrontSchema";
import {AuditLogsInput} from "../models/auditLogs/auditLogsInput";
import {EventType} from "../models/auditLogs/eventTypes";
import AuditLogResolvers from "./auditLogsResolver";

const StorefrontResolvers = {
  Query: {
    InventoryItems: async (_: any, args: any, context: any) => {
      return await InventoryRepo.getItems();
    },

    InventoryItem: async (_: any, args: { Id: number }, context: any) => {
      return await InventoryRepo.getItemById(args.Id);
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
    createInventoryItem: async (_: any, args: { item: InventoryItemInput }, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.INVENTORY_MANAGEMENT,
        description: "Created new inventory item " + args.item.name
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await InventoryRepo.addItem(args.item);
    },

    updateInventoryItem: async (
      _: any,
      args: { itemId: number; item: InventoryItemInput }, context: any
    ) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.INVENTORY_MANAGEMENT,
        description: "Updated inventory item " + args.item.name
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await InventoryRepo.updateItemById(args.itemId, args.item);
    },

    addItemAmount: async (_: any, args: { itemId: number; count: number }, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.INVENTORY_MANAGEMENT,
        description: "Added " + args.count + " units of item #" + args.itemId
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return InventoryRepo.addItemAmount(args.itemId, args.count);
    },

    removeItemAmount: async (
      _: any,
      args: { itemId: number; count: number }, context: any
    ) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.INVENTORY_MANAGEMENT,
        description: "Removed " + args.count + " units of item #" + args.itemId
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return InventoryRepo.addItemAmount(args.itemId, args.count * -1);
    },

    deleteInventoryItem: async (_: any, args: { itemId: number }, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.INVENTORY_MANAGEMENT,
        description: "Removed inventory item #" + args.itemId
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return InventoryRepo.deleteItemById(args.itemId);
    },

    createLabel: async (_: any, args: { label: string }, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.INVENTORY_MANAGEMENT,
        description: "Created item label " + args.label
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      await LabelRepo.addLabel(args.label);
    },

    deleteLabel: async (_: any, args: { label: string }, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.INVENTORY_MANAGEMENT,
        description: "Removed item label " + args.label
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      await LabelRepo.deleteLabel(args.label);
    },
  },
};

export default StorefrontResolvers;
