import { ApolloContext, ifAllowed } from "../context.js";
import * as InventoryRepo from "../repositories/Store/InventoryRepository.js";
import * as LabelRepo from "../repositories/Store/LabelRepository.js";
import { InventoryItem, InventoryItemInput } from "../schemas/storeFrontSchema.js";
import { Privilege } from "../schemas/usersSchema.js";
import { deleteInventoryItem } from "../repositories/Store/InventoryRepository.js";
import { createLedger, deleteLedger, getLedgers } from "../repositories/Store/InventoryLedgerRepository.js";
import { GraphQLError } from "graphql";
import { getUserByID, getUserByIDOrUndefined } from "../repositories/Users/UserRepository.js";

const StorefrontResolvers = {
  Query: {
    InventoryItems: async (
      _: any,
      args: { storefrontVisible?: boolean },
      { ifAllowed }: ApolloContext) => {
      if (args.storefrontVisible == null || args.storefrontVisible == undefined)
        return await InventoryRepo.getItems();
      if (args.storefrontVisible)
        ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
          return await InventoryRepo.getItemsWhereStorefront(true);
        })
      return await InventoryRepo.getItemsWhereStorefront(false);
    },

    InventoryItem: async (
      _: any,
      args: { id: string },
      { ifAllowed }: ApolloContext) => {
      const item = await InventoryRepo.getItemById(Number(args.id));
      console.log("InventoryItem")
      console.log(item)
      if (!item?.storefrontVisible) return ifAllowed([Privilege.MENTOR, Privilege.STAFF], () => {
        console.log("Not Visible")
        return item;
      })
      else {
        console.log("Visible")
        return item;
      }
    },

    Labels: async () => {
      return await LabelRepo.getAllLabels();
    },

    Ledgers: async (
      _: any,
      args: {startDate: string, stopDate: string, searchText: string},
      { ifAllowed }: ApolloContext) => {
      return ifAllowed([Privilege.STAFF, Privilege.MENTOR], () => {
        const startDate = args.startDate ?? "2020-01-01";
        const stopDate = args.stopDate ?? "2200-01-01";
        const searchText = args.searchText ?? "";
        return getLedgers(startDate, stopDate, searchText);
      });
    },
  },

  InventoryItem: {
    labels: (parent: any) => {
      return InventoryRepo.getLabels(parent.id);
    },
  },

  InventoryLedger: {
    initiator: (parent: any) => {
      return getUserByID(parent.initiator);
    },
    purchaser: (parent: any) => {
      return getUserByIDOrUndefined(parent.purchaser);
    }
  },

  Mutation: {
    createInventoryItem: async (
      _: any,
      args: { item: InventoryItemInput },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const result = await InventoryRepo.addItem(args.item);
        await createLedger(user.id, "Create", Number(args.item.pricePerUnit) * Number(args.item.count), undefined, "", [{ name: args.item.name, quantity: Number(args.item.count) }]);
        return result;
      }),

    updateInventoryItem: async (
      _: any,
      args: { itemId: string; item: InventoryItemInput },
      { ifAllowed }: ApolloContext) => {
      const orig = await InventoryRepo.getItemById(Number(args.itemId))
      //If item is STAFF ONLY, only allow edits by staff
      if (!(orig)?.staffOnly) {
        return ifAllowed([Privilege.STAFF, Privilege.MENTOR], async (user) => {
          if (!orig) throw new GraphQLError("Item at" + args.itemId + " does not exist");
          const result = await InventoryRepo.updateItemById(Number(args.itemId), args.item);
          const costChange = (Number(args.item.pricePerUnit) * Number(args.item.count)) - (Number(orig.pricePerUnit) * Number(orig.count));
          await createLedger(user.id, "Modify", costChange, undefined, "", [{ name: args.item.name, quantity: Number(args.item.count) - Number(orig.count) }]);
          return result;
        })
      }
      return ifAllowed([Privilege.STAFF], async (user) => {
        const result = await InventoryRepo.updateItemById(Number(args.itemId), args.item);
        const costChange = (Number(args.item.pricePerUnit) * Number(args.item.count)) - (Number(orig.pricePerUnit) * Number(orig.count));
        await createLedger(user.id, "Modify", costChange, undefined, "", [{ name: args.item.name, quantity: Number(args.item.count) - Number(orig.count) }]);
        return result;
      })
    },

    addItemAmount: async (
      _: any,
      args: { itemId: string; count: number },
      { ifAllowed }: ApolloContext) => {
      const orig = await InventoryRepo.getItemById(Number(args.itemId));
      if (!(orig)?.staffOnly) {
        return ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
          if (!orig) throw new GraphQLError("Item at" + args.itemId + " does not exist");
          const result = await InventoryRepo.addItemAmount(Number(args.itemId), args.count);
          await createLedger(user.id, "Modify", orig.pricePerUnit*args.count, undefined, "", [{ name: orig.name, quantity: Number(args.count) }]);
          return result;
        })
      }
      return ifAllowed([Privilege.STAFF], async (user) => {
        if (!orig) throw new GraphQLError("Item at" + args.itemId + " does not exist");
        const result = await InventoryRepo.addItemAmount(Number(args.itemId), args.count);
        await createLedger(user.id, "Modify", orig.pricePerUnit*args.count, undefined, "", [{ name: orig.name, quantity: Number(args.count) }]);
        return result;
      })
    },

    removeItemAmount: async (
      _: any,
      args: { itemID: string; count: number },
      { ifAllowed }: ApolloContext) => {
      const orig = await InventoryRepo.getItemById(Number(args.itemID));
      if (!(orig)?.staffOnly) {
        return ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
          if (!orig) throw new GraphQLError("Item at" + args.itemID + " does not exist");
          const result = await InventoryRepo.addItemAmount(Number(args.itemID), args.count);
          await createLedger(user.id, "Modify", orig.pricePerUnit*args.count, undefined, "", [{ name: orig.name, quantity: Number(args.count)*-1 }]);
          return result;
        })
      }
      return ifAllowed([Privilege.STAFF], async (user) => {
        if (!orig) throw new GraphQLError("Item at" + args.itemID + " does not exist");
        const result = await InventoryRepo.addItemAmount(Number(args.itemID), args.count);
        await createLedger(user.id, "Modify", orig.pricePerUnit*args.count, undefined, "", [{ name: orig.name, quantity: Number(args.count)*-1 }]);
        return result;
      })
    },

    archiveInventoryItem: async (
      _: any,
      args: { itemID: string },
      { ifAllowed }: ApolloContext) => {
      if (!(await InventoryRepo.getItemById(Number(args.itemID)))?.staffOnly) {
        return ifAllowed([Privilege.STAFF], async () => {
          return await InventoryRepo.archiveItem(Number(args.itemID));
        })
      }
      return ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return InventoryRepo.archiveItem(Number(args.itemID));
      })
    },

    createLabel: async (_: any, args: { label: string }, context: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        await LabelRepo.addLabel(args.label);
      }),

    archiveLabel: async (_: any, args: { label: string }, context: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        await LabelRepo.archiveLabel(args.label);
      }),

    deleteInventoryItem: async (
      _parent: any,
      args: any,
      { ifAllowed }: ApolloContext) => {
      const orig = await InventoryRepo.getItemById(Number(args.id));
      if (!(orig)?.staffOnly) {
        return ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
          if (!orig) throw new GraphQLError("Item at" + args.itemID + " does not exist");
          const result = await InventoryRepo.deleteInventoryItem(Number(args.id));
          await createLedger(user.id, "Delete", -orig.pricePerUnit*Number(orig.count), undefined, "", [{ name: orig.name, quantity: Number(orig.count)*-1 }]);
          return result;
        })
      }
      return ifAllowed([Privilege.STAFF], async () => {
        return await deleteInventoryItem(args.id);
      }
      )
    },

    checkoutItems: async (
      _parent: any,
      args: {items: {id: number, count: number}[], notes: string | null, recievingUserID: number | null},
      { ifAllowed }: ApolloContext) => {
        return ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
          const allItems = await InventoryRepo.getItems();
          for (var i = 0; i < args.items.length; i++) {
            if (allItems.find((item) => item.id = args.items[i].id)?.staffOnly && user.privilege != Privilege.STAFF) {
              //Fail if user is trying to checkout a staff item
              throw new GraphQLError("Unauthorized")
            }
          }

          var totalCost = 0;
          var ledgerItems: {name: string, quantity: number}[] = []

          for (var i = 0; i < args.items.length; i++) {
            //Deduct count from each respective item. Fail if item does not exist
            const item = await InventoryRepo.addItemAmount(args.items[i].id, args.items[i].count * -1)
            if (!item) {
              throw new GraphQLError("Item does not exist")
            }
            ledgerItems.push({name: item.name, quantity: args.items[i].count*-1});
            totalCost -= args.items[i].count * item.pricePerUnit
          }

          await createLedger(user.id, (args.recievingUserID ? "Purchase" : "Internal Use"), totalCost, (args.recievingUserID ?? undefined), args.notes ?? "", ledgerItems);
          return true;
        });
    },

    setStorefrontVisible: async (
      _parent: any,
      args: { id: string, storefrontVisible: boolean },
      { ifAllowed }: ApolloContext) => {
      if (!(await InventoryRepo.getItemById(Number(args.id)))?.staffOnly) {
        return ifAllowed([Privilege.STAFF], async () => {
          await InventoryRepo.setStorefrontVisible(Number(args.id), args.storefrontVisible);
          return await InventoryRepo.getItemById(Number(args.id));
        })
      }
      return ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        await InventoryRepo.setStorefrontVisible(Number(args.id), args.storefrontVisible);
        return await InventoryRepo.getItemById(Number(args.id));
      }
      )
    },

    setStaffOnly: async (
      _parent: any,
      args: { id: string, staffOnly: boolean },
      { ifAllowed }: ApolloContext) => {
      return ifAllowed([Privilege.STAFF], async () => {
        await InventoryRepo.setStaffOnly(Number(args.id), args.staffOnly);
        return await InventoryRepo.getItemById(Number(args.id));
      });
    },

    deleteLedger: async (
      _parent: any,
      args: { id: string },
      { ifAllowed }: ApolloContext) => {
      return ifAllowed([Privilege.STAFF], () => deleteLedger(Number(args.id)));
    },
  }
};

export default StorefrontResolvers;
