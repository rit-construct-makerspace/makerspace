import { InventoryRepo } from "../repositories/Store/inventoryRepository";
import { InventoryService } from "../service/InventoryService";

const StorefrontResolvers = {
    Query: {
      // InventoryItems: [InventoryItem]
      InventoryItems: async (_: any, args: any, context: any) => {
        let inventoryService = new InventoryService(new InventoryRepo());
        return inventoryService.getAllInventoryItems();
      },

      // PurchaseOrders: [PurchaseOrder]
      PurchaseOrders: async (_: any, args: any, context: any) => {

      },      
    },
  
    Mutation: {
      // createPurchaseOrder(PO: PurchaseOrderInput): PurchaseOrder  
      createPurchaseOrder: async (_: any, args: any) => {

      },

      // addItemToPurchaseOrder(POId: ID!, itemId: ID!, count: Int): PurchaseOrder
      addItemToPurchaseOrder: async (_: any, args: any) => {

      },

      // removeItemFromPurchaseOrder(POId: ID!, itemId: ID!, count: Int): PurchaseOrder
      removeItemFromPurchaseOrder: async (_: any, args: any) => {

      },

      // updateItemAmountInPurchaseOrder(POId: ID!, POItemId: ID!, count: Int!): PurchaseOrder
      updateItemAmountInPurchaseOrder: async (_: any, args: any) => {

      },

      // addAttachmentsToPurchaseOrder(POId: ID!, attachments: [String]): PurchaseOrder
      addAttachmentsToPurchaseOrder: async (_: any, args: any) => {

      },

      // removeAttachmentFromPurchaseOrder(POId: ID!, attachment: String): PurchaseOrder      
      removeAttachmentFromPurchaseOrder: async (_: any, args: any) => {

      },

      // addItemToInventory(item: InventoryItemInput): InventoryItem      
      addItemToInventory: async (_: any, args: any) => {
        let inventoryService = new InventoryService(new InventoryRepo());
        return inventoryService.addItemToInventory(args.item); 
      },

      // addItemAmount(itemId: ID!, count: Int!): InventoryItem      
      addItemAmount: async (_: any, args: any) => {
        let inventoryService = new InventoryService(new InventoryRepo());
        return inventoryService.addAmountToItem(args.itemId, args.count); 
      },

      // removeItemAmount(itemId: ID!, count: Int!): InventoryItem      
      removeItemAmount: async (_: any, args: any) => {

      },
  
    },
  };
  
  export default StorefrontResolvers;