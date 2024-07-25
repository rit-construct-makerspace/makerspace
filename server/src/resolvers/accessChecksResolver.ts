import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository";
import { Privilege } from "../schemas/usersSchema";
import { ApolloContext } from "../context";
import { getAccessCheckByID, getAccessChecks, getAccessChecksByApproved, setAccessCheckApproval } from "../repositories/Equipment/AccessChecksRepository";
const AccessChecksResolver = {

  Query: {
    accessChecks: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getAccessChecks();
      }),

      accessCheck: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getAccessCheckByID(args.id)
      }),

      approvedAccessChecks: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getAccessChecksByApproved(true)
      }),

      unapprovedAccessChecks: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getAccessChecksByApproved(false)
      }),
  },

  Mutation: {
    approveAccessCheck: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await setAccessCheckApproval(args.id, true);
      }),

    unapproveAccessCheck: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await setAccessCheckApproval(args.id, false);
      }),
  }
};

export default AccessChecksResolver;