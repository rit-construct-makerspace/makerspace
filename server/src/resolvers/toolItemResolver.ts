import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { getDataPointByID, incrementDataPointValue, setDataPointValue } from "../repositories/DataPoints/DataPointsRepository.js";
import { getTerms, setTerms } from "../repositories/TextItems/TermsRepository.js";
import { ToolItemInstancesRow, ToolItemTypesRow } from "../db/tables.js";
import { borrowItem, createToolItemInstance, deleteToolItemInstance, getToolItemInstanceByID, getToolItemInstances, getToolItemInstancesByBorrower, getToolItemInstancesByType, returnItem, updateToolItemInstance } from "../repositories/Store/ToolItemInstancesRepository.js";
import { createToolItemType, deleteToolItemType, getToolItemTypeByID, getToolItemTypes, getToolItemTypesWhereAllowCheckout, updateToolItemType } from "../repositories/Store/ToolItemTypesRepository.js";
import { getUserByID, getUsersFullName } from "../repositories/Users/UserRepository.js";
import { ToolItemInstanceInput, ToolItemTypeInput } from "../schemas/toolItemsSchema.js";
import { getRoomByID } from "../repositories/Rooms/RoomRepository.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { GraphQLError } from "graphql";
import { notifyToolItemMarked } from "../slack/slack.js";

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

    defaultLocationRoom: async (
      parent: ToolItemTypesRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return getRoomByID(parent.defaultLocationRoomID);
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
        if (!parent.borrowerUserID) return null;
        return getUserByID(parent.borrowerUserID);
      }
    ),

    locationRoom: async (
      parent: ToolItemInstancesRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return getRoomByID(parent.locationRoomID);
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
    toolItemInstancesByType: async (
      _parent: any,
      args: {id: number},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return getToolItemInstancesByType(args.id);
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

    toolItemInstancesByBorrower: async (
      _parent: any,
      args: {id: number},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return getToolItemInstancesByBorrower(args.id);
      }
    ),
  },

  Mutation: {
    createToolItemType: async (
      _parent: any,
      args: {toolItemType: ToolItemTypeInput},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        await createLog(`{user} created tool item type '${args.toolItemType.name}'`, 'admin', {id: user.id, label: getUsersFullName(user)});
        return await createToolItemType(args.toolItemType.name, args.toolItemType.defaultLocationRoomID, 
          args.toolItemType.defaultLocationDescription, args.toolItemType.description, args.toolItemType.checkoutNote, 
          args.toolItemType.checkinNote, args.toolItemType.allowCheckout);
      }
    ),
    updateToolItemType: async (
      _parent: any,
      args: {id: number, toolItemType: ToolItemTypeInput},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const orig = await getToolItemTypeByID(args.id);
        if (!orig) throw new GraphQLError("Type does not exist");
        await createLog(`{user} updated tool item type '${orig.name}'`, 'admin', {id: user.id, label: getUsersFullName(user)});
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
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        await createLog(`{user} created tool item instance '${args.toolItemInstance.uniqueIdentifier}'`, 'admin', {id: user.id, label: getUsersFullName(user)});
        return createToolItemInstance(Number(args.toolItemInstance.typeID), args.toolItemInstance.uniqueIdentifier, 
          Number(args.toolItemInstance.locationRoomID), args.toolItemInstance.locationDescription, args.toolItemInstance.condition, 
          args.toolItemInstance.status, args.toolItemInstance.notes);
      }
    ),
    updateToolItemInstance: async (
      _parent: any,
      args: {id: number, toolItemInstance: ToolItemInstanceInput},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const orig = await getToolItemInstanceByID(args.id);
        if (!orig) throw new GraphQLError("Instance does not exist");
        if (!(args.toolItemInstance.status == orig.status)
          && (args.toolItemInstance.status == "MISSING"
          || args.toolItemInstance.status == "DO NOT USE")
        ) {
          await notifyToolItemMarked(args.toolItemInstance.uniqueIdentifier, orig.id, orig.typeID, args.toolItemInstance.status);
        }
        else if (!(args.toolItemInstance.condition == orig.condition)
          && (args.toolItemInstance.condition == "DAMAGED"
          || args.toolItemInstance.condition == "MISSING PARTS")
        ) {
          await notifyToolItemMarked(args.toolItemInstance.uniqueIdentifier, orig.id, orig.typeID, args.toolItemInstance.condition);
        }
        await createLog(`{user} updated tool item instance '${orig.uniqueIdentifier}'`, 'admin', {id: user.id, label: getUsersFullName(user)});
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
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const reciever = await getUserByID(args.userID);
        if (!reciever) throw new GraphQLError("Recieving User does not exist");
        const orig = await getToolItemInstanceByID(args.instanceID);
        if (!orig) throw new GraphQLError("Type does not exist");
        await createLog(`{user} loaned tool item '${orig.uniqueIdentifier}' to {user}`, 'admin', {id: user.id, label: getUsersFullName(user)}, {id: reciever.id, label: getUsersFullName(reciever)});
        return borrowItem(args.userID, args.instanceID);
      }
    ),
    returnInstance: async (
      _parent: any,
      args: {instanceID: number},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const orig = await getToolItemInstanceByID(args.instanceID);
        if (!orig) throw new GraphQLError("Type does not exist");
        const reciever = orig.borrowerUserID ? await getUserByID(orig.borrowerUserID) : undefined;
        if (!reciever) throw new GraphQLError("Returning User does not exist");
        await createLog(`{user} returned tool item '${orig.uniqueIdentifier}' from {user}`, 'admin', {id: user.id, label: getUsersFullName(user)}, {id: reciever.id, label: getUsersFullName(reciever)});
        return returnItem(args.instanceID)
      }
    ),
    deleteToolItemType: async (
      _parent: any,
      args: {id: number},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const orig = await getToolItemTypeByID(args.id);
        if (!orig) throw new GraphQLError("Type does not exist");
        await createLog(`{user} deleted tool item type '${orig.name}'`, 'admin', {id: user.id, label: getUsersFullName(user)});
        return deleteToolItemType(args.id);
      }
    ),
    deleteToolItemInstance: async (
      _parent: any,
      args: {id: number},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const orig = await getToolItemInstanceByID(args.id);
        if (!orig) throw new GraphQLError("Instance does not exist");
        await createLog(`{user} deleted tool item instance '${orig.uniqueIdentifier}'`, 'admin', {id: user.id, label: getUsersFullName(user)});
        return deleteToolItemInstance(args.id);
      }
    ),
  }
};

export default ToolItemResolver;