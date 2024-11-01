import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { getDataPointByID, incrementDataPointValue, setDataPointValue } from "../repositories/DataPoints/DataPointsRepository.js";
import { getTerms, setTerms } from "../repositories/TextItems/TermsRepository.js";
import { ToolItemInstancesRow, ToolItemTypesRow } from "../db/tables.js";
import { borrowItem, createToolItemInstance, getToolItemInstanceByID, getToolItemInstances, getToolItemInstancesByType, returnItem, updateToolItemInstance } from "../repositories/Store/ToolItemInstancesRepository.js";
import { createToolItemType, getToolItemTypeByID, getToolItemTypes, getToolItemTypesWhereAllowCheckout, updateToolItemType } from "../repositories/Store/ToolItemTypesRepository.js";
import { getUserByID } from "../repositories/Users/UserRepository.js";
import { ToolItemInstanceInput, ToolItemTypeInput } from "../schemas/toolItemsSchema.js";

const ToolItemResolver = {
  ToolItemType: {
    instances: async (
      parent: ToolItemTypesRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return getToolItemInstancesByType(parent.id);
      }
    ),
  },

  ToolItemInstance: {
    type: async (
      parent: ToolItemInstancesRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return getToolItemTypeByID(parent.typeID);
      }
    ),

    borrower: async (
      parent: ToolItemInstancesRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return getUserByID(parent.borrowerUserID);
      }
    ),
  },

  Query: {
    toolItemTypes: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return getToolItemTypes();
      }
    ),
    toolItemTypesAllowCheckout: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return getToolItemTypesWhereAllowCheckout();
      }
    ),
    toolItemType: async (
      _parent: any,
      args: {id: number},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return getToolItemTypeByID(args.id);
      }
    ),
    toolItemInstances: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return getToolItemInstances();
      }
    ),
    toolItemInstance: async (
      _parent: any,
      args: {id: number},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return getToolItemInstanceByID(args.id);
      }
    ),
  },

  Mutation: {
    createToolItemType: async (
      _parent: any,
      args: {toolItemType: ToolItemTypeInput},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return createToolItemType(args.toolItemType.name, args.toolItemType.defaultLocationRoomID, 
          args.toolItemType.defaultLocationDescription, args.toolItemType.description, args.toolItemType.checkoutNote, 
          args.toolItemType.checkinNote, args.toolItemType.allowCheckout);
      }
    ),
    updateToolItemType: async (
      _parent: any,
      args: {id: number, toolItemType: ToolItemTypeInput},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return updateToolItemType(args.id, args.toolItemType.name, args.toolItemType.defaultLocationRoomID, 
          args.toolItemType.defaultLocationDescription, args.toolItemType.description, args.toolItemType.checkoutNote, 
          args.toolItemType.checkinNote, args.toolItemType.allowCheckout);
      }
    ),
    createToolItemInstance: async (
      _parent: any,
      args: {toolItemInstance: ToolItemInstanceInput},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return createToolItemInstance(args.toolItemInstance.typeID, args.toolItemInstance.uniqueIdentifier, 
          args.toolItemInstance.locationRoomID, args.toolItemInstance.locationDescription, args.toolItemInstance.condition, 
          args.toolItemInstance.status, args.toolItemInstance.notes);
      }
    ),
    updateToolItemInstance: async (
      _parent: any,
      args: {id: number, toolItemInstance: ToolItemInstanceInput},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return updateToolItemInstance(args.id, args.toolItemInstance.typeID, args.toolItemInstance.uniqueIdentifier, 
          args.toolItemInstance.locationRoomID, args.toolItemInstance.locationDescription, args.toolItemInstance.condition, 
          args.toolItemInstance.status, args.toolItemInstance.notes);
      }
    ),
    borrowInstance: async (
      _parent: any,
      args: {userID: number, instanceID: number},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return borrowItem(args.userID, args.instanceID)
      }
    ),
    returnInstance: async (
      _parent: any,
      args: {instanceID: number},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return returnItem(args.instanceID)
      }
    ),
  }
};

export default ToolItemResolver;