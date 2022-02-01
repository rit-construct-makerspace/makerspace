import { InventoryRepo } from "../repositories/Store/inventoryRepository";
import { PurchaseOrderRepo } from "../repositories/Store/poRepository";
import { InventoryService } from "../service/InventoryService";
import { PurchaseOrderService } from "../service/PurchaseOrderService";

const inventoryService = new InventoryService(new InventoryRepo());
const purchaseOrderService = new PurchaseOrderService(new PurchaseOrderRepo());

const StorefrontResolvers = {
    Query: {
      // InventoryItems: [InventoryItem]
      InventoryItems: async (_: any, args: any, context: any) => {
        return inventoryService.getAllInventoryItems();
      },

      // PurchaseOrders: [PurchaseOrder]
      PurchaseOrders: async (_: any, args: any, context: any) => {
        return purchaseOrderService.getAllPurchaseOrders();
      },      
    },
  
    Mutation: {
      // createPurchaseOrder(PO: PurchaseOrderInput): PurchaseOrder  
      createPurchaseOrder: async (_: any, args: any) => {
        return purchaseOrderService.createNewPurchaseOrder(args.PO.creatorID, args.PO.expectedDeliveryDate, args.PO.items, args.PO.attachments);
      },

      // addItemToPurchaseOrder(POId: ID!, itemId: ID!, count: Int): PurchaseOrder
      addItemToPurchaseOrder: async (_: any, args: any) => {
        return purchaseOrderService.addItemsToPurchaseOrder(args.POId, [{itemId: args.itemId, count: args.count}]);
      },

      // removeItemFromPurchaseOrder(POId: ID!, itemId: ID!): PurchaseOrder
      removeItemFromPurchaseOrder: async (_: any, args: any) => {
        return purchaseOrderService.removeItemFromPurchaseOrder(args.POId, args.itemId);
      },

      // updateItemAmountInPurchaseOrder(POId: ID!, POItemId: ID!, count: Int!): PurchaseOrder
      updateItemAmountInPurchaseOrder: async (_: any, args: any) => {
        return purchaseOrderService.setItemCountInPurchaseOrder(args.POId, args.POItemId, args.count);
      },

      // addAttachmentsToPurchaseOrder(POId: ID!, attachments: [String]): PurchaseOrder
      addAttachmentsToPurchaseOrder: async (_: any, args: any) => {
        return purchaseOrderService.addAttachments(args.POId, args.attachments);
      },

      // removeAttachmentFromPurchaseOrder(POId: ID!, attachment: String): PurchaseOrder      
      removeAttachmentFromPurchaseOrder: async (_: any, args: any) => {

      },

      // addItemToInventory(item: InventoryItemInput): InventoryItem      
      addItemToInventory: async (_: any, args: any) => {
        console.log('resolver: adding item to inventory')
        return await inventoryService.addItemToInventory(args.item); 
      },

      // addItemAmount(itemId: ID!, count: Int!): InventoryItem      
      addItemAmount: async (_: any, args: any) => {
        return inventoryService.addAmountToItem(args.itemId, args.count); 
      },

      // removeItemAmount(itemId: ID!, count: Int!): InventoryItem      
      removeItemAmount: async (_: any, args: any) => {
        return inventoryService.removeAmountFromItem(args.itemId, args.count); 
      },
  
    },
  };
  
  export default StorefrontResolvers;