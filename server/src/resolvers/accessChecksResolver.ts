
import { Privilege } from "../schemas/usersSchema";
import { ApolloContext } from "../context";
import { getAccessCheckByID, getAccessChecks, getAccessChecksByApproved, setAccessCheckApproval } from "../repositories/Equipment/AccessChecksRepository";
const AccessChecksResolver = {
    
    Query: {
      getAllAccessChecks: async (
        _parent: any,
        _args: any,
        {ifAllowed}: ApolloContext) =>
          ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
            return await getAccessChecks();
          }),
      
      getAccessCheck: async (
        _parent: any,
        args: { id: number },
        { ifAllowed }: ApolloContext) => 
          ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
            return await getAccessCheckByID(args.id)
          }),

      getApprovedAccessChecks: async (
        _parent: any,
        _args: any,
        { ifAllowed }: ApolloContext) => 
          ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
            return await getAccessChecksByApproved(true)
          }),

      getUnapprovedAccessChecks: async (
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