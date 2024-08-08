
import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { getAnnouncements, getAnnouncementByID, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "../repositories/Announcements/AnnouncementsRepository.js";

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
            return await updateAnnouncement(args);
          }),

      deleteAnnouncement: async (
        _parent: any,
        args: any,
        { ifAllowed }: ApolloContext) =>
          ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
            return await deleteAnnouncement(args.id);
          }),

    }
  };
  
  export default AnnouncementsResolver;