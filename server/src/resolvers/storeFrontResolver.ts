import { InventoryItemInput } from "../models/store/inventoryItemInput";
import { PurchaseOrder } from "../models/store/purchaseOrder";
import { PurchaseOrderInput } from "../models/store/purchaseOrderInput";
import { InventoryRepo } from "../repositories/Store/inventoryRepository";
import { LabelRepository } from "../repositories/Store/labelRepository";
import { PurchaseOrderRepo } from "../repositories/Store/purchaseOrderRepository";

const inventoryRepo = new InventoryRepo();
const poRepo = new PurchaseOrderRepo();
const labelRepo = new LabelRepository()

const StorefrontResolvers = {

  Query: {
    // InventoryItems: [InventoryItem]
    InventoryItems: async (_: any, args: any, context: any) => {
      return await inventoryRepo.getItems();
    },

    //InventoryItem(Id: ID!): InventoryItem
    InventoryItem: async (_: any, args: { Id: number }, context: any) => {
      return await inventoryRepo.getItemById(args.Id);
    },

    // PurchaseOrders: [PurchaseOrder]
    PurchaseOrders: async (_: any, args: any, context: any) => {
      return await poRepo.getAllPOs();
    },

    // PurchaseOrder(Id: ID!): PurchaseOrder
    PurchaseOrder: async (_: any, args: { Id: number }, context: any) => {
      return await poRepo.getPOById(args.Id);
    },

    Labels: async () => {
      return await labelRepo.getAllLabels();
    }
  },

  PurchaseOrder: {
    creator: () => {
      // no users repo yet so this is fake data
      return {id: 5, name: "Adam Savage"}
    },
    items: async (parent: PurchaseOrder) => {
      return await poRepo.getPOItemsById(parent.id);
    },
    attachments: async (parent: any) => {
      return await poRepo.getAttachmentsById(parent.id);
    }
  },

  PurchaseOrderItem: {
    item: async (parent: any) => {
      return await inventoryRepo.getItemById(parent.item)
    }
  },

  InventoryItem: {
    labels: (parent: any) => {
      return inventoryRepo.getLabels(parent.id);
    }
  },

  Mutation: {
    // createPurchaseOrder(PO: PurchaseOrderInput): PurchaseOrder  
    createPurchaseOrder: async (_: any, args: { PO: PurchaseOrderInput }) => {
      return await poRepo.createNewPO(args.PO.creatorID, args.PO.expectedDeliveryDate, args.PO.items, args.PO.attachments);
    },

    //deletePurchaseOrder(POId: ID!): PurchaseOrder
    deletePurchaseOrder: async (_: any, args: { POId: number }) => {
      return await poRepo.deletePOById(args.POId);
    },

    // addItemToPurchaseOrder(POId: ID!, itemId: ID!, count: Int): PurchaseOrder
    addItemToPurchaseOrder: async (_: any, args: { POId: number, itemId: number, count: number }) => {
      return await poRepo.addItemsToPO(args.POId, [{ itemId: args.itemId, count: args.count }]);
    },

    // removeItemFromPurchaseOrder(POId: ID!, itemId: ID!): PurchaseOrder
    removeItemFromPurchaseOrder: async (_: any, args: { POId: number, itemId: number }) => {
      return await poRepo.removeItemFromPO(args.POId, args.itemId);
    },

    // updateItemAmountInPurchaseOrder(POId: ID!, POItemId: ID!, count: Int!): PurchaseOrder
    updateItemAmountInPurchaseOrder: async (_: any, args: { POId: number, POItemId: number, count: number }) => {
      return await poRepo.updateItemCountInPO(args.POItemId, args.count, args.POId);
    },

    // addAttachmentsToPurchaseOrder(POId: ID!, attachments: [String]): PurchaseOrder
    addAttachmentsToPurchaseOrder: async (_: any, args: { POId: number, attachments: string[] }) => {
      return await poRepo.addAttachmentsToPO(args.attachments, args.POId);
    },

    // removeAttachmentFromPurchaseOrder(POId: ID!, attachment: String): PurchaseOrder      
    removeAttachmentFromPurchaseOrder: async (_: any, args: { POId: number, attachment: string }) => {
      return await poRepo.removeAttachmentFromPO(args.attachment, args.POId);
    },

    // addItemToInventory(item: InventoryItemInput): InventoryItem      
    addItemToInventory: async (_: any, args: { item: InventoryItemInput }) => {
      return await inventoryRepo.addItem(args.item);
    },

    // addItemAmount(itemId: ID!, count: Int!): InventoryItem      
    addItemAmount: async (_: any, args: { itemId: number, count: number }) => {
      return inventoryRepo.addItemAmount(args.itemId, args.count);
    },

    // removeItemAmount(itemId: ID!, count: Int!): InventoryItem      
    removeItemAmount: async (_: any, args: { itemId: number, count: number }) => {
      return inventoryRepo.addItemAmount(args.itemId, args.count * -1);
    },

    //deleteInventoryItem(itemId: ID!): InventoryItem
    deleteInventoryItem: async (_: any, args: { itemId: number }) => {
      return inventoryRepo.deleteItemById(args.itemId);
    },

    createLabel: async (_: any, args: { label: string }) => {
      await labelRepo.addLabel(args.label);
    },

    deleteLabel: async (_: any, args: { label: string }) => {
      await labelRepo.deleteLabel(args.label);
    }

  },
};

export default StorefrontResolvers;