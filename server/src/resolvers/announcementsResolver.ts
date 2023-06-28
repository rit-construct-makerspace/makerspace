import * as AnnouncementsRepo from "../repositories/Announcements/AnnouncementsRepository";
import * as ModuleRepo from "../repositories/Training/ModuleRepository";
import * as HoldsRepo from "../repositories/Holds/HoldsRepository";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { ApolloContext } from "../context";
import { getUsersFullName } from "../repositories/Users/UserRepository";
import { getAnnouncements, getAnnouncementByID, createAnnouncement, updateAnnouncement } from "../repositories/Announcements/AnnouncementsRepository";

const AnnouncementsResolver = {
    
    Query: {
      getAllAnnouncements: async (
        _parent: any,
        _args: any,
        {ifAllowed}: ApolloContext) =>
          ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async () => {
            return await getAnnouncements();
          }),
      
      getAnnouncement: async (
        _parent: any,
        args: { id: number },
        { ifAllowed }: ApolloContext) => 
          ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
            return await getAnnouncementByID(args.id)
          })
    },
  
    Mutation: {
      createAnnouncement: async (
        _parent: any,
        args: any,
        { ifAllowed }: ApolloContext) =>
          ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
            return await createAnnouncement(args);
          }),

      updateAnnouncement: async (
        _parent: any,
        args: any,
        { ifAllowed }: ApolloContext) =>
          ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
            console.log("LLLLLLLLL" + args.id)
            return await updateAnnouncement(args);
          })
    }

  };
  
  export default AnnouncementsResolver;