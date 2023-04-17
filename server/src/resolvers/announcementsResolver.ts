import * as AnnouncementsRepo from "../repositories/Announcements/AnnouncementsRepository";
import * as ModuleRepo from "../repositories/Training/ModuleRepository";
import * as HoldsRepo from "../repositories/Holds/HoldsRepository";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { ApolloContext } from "../context";
import { getUsersFullName } from "../repositories/Users/UserRepository";
import { getAnnouncements } from "../repositories/Announcements/AnnouncementsRepository";

const AnnouncementsResolver = {
    
    Query: {
      announcements: async (
        _parent: any,
        _args: any,
        {ifAllowed}: ApolloContext) =>
          ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async () => {
            return await getAnnouncements();
          }),
    },
  
    Mutation: {
      createAnnouncement: async (
        _parent: any,
        args: any,
        { ifAllowed }: ApolloContext) =>
          ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
            return await AnnouncementsRepo.createAnnouncement(args);
        })
      }
        //,
  
    //   updateStudentProfile: async (
    //     _: any,
    //     args: {
    //       userID: string;
    //       pronouns: string;
    //       college: string;
    //       expectedGraduation: string;
    //       universityID: string;
    //     },
    //     { ifAllowedOrSelf }: ApolloContext) =>
    //     ifAllowedOrSelf(Number(args.userID), [Privilege.MENTOR, Privilege.STAFF], async (user) => {
    //         return await UserRepo.updateStudentProfile({
    //           userID: Number(args.userID),
    //           pronouns: args.pronouns,
    //           college: args.college,
    //           expectedGraduation: args.expectedGraduation,
    //           universityID: args.universityID
    //         });
    //     }),
  
    //   setPrivilege: async (
    //     _parent: any,
    //     args: { userID: string; privilege: Privilege },
    //     { ifAllowed }: ApolloContext
    //   ) =>
    //       ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (executingUser) => {
    //         const userSubject = await UserRepo.setPrivilege(Number(args.userID), args.privilege);
  
    //         await createLog(
    //           `{user} set {user}'s access level to ${args.privilege}.`,
    //           { id: executingUser.id, label: getUsersFullName(executingUser) },
    //           { id: userSubject.id, label: getUsersFullName(userSubject) }
    //         );
    //       }),
  
    //   deleteUser: async (
    //     _parent: any,
    //     args: { userID: string },
    //     { ifAllowed }: ApolloContext
    //   ) =>
    //     ifAllowed(
    //       [Privilege.STAFF],
    //       async (user) => {
  
    //         const userSubject = await UserRepo.getUserByID(Number(args.userID));
  
    //         await createLog(
    //           `{user} deleted {user}'s profile.`,
    //           { id: user.id, label: getUsersFullName(user) },
    //           { id: args.userID, label: getUsersFullName(userSubject) }
    //         );
  
    //         return await UserRepo.archiveUser(Number(args.userID));
    //       }
    //     ),
    // }
  };
  
  export default AnnouncementsResolver;