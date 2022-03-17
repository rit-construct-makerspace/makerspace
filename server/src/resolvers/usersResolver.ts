import * as UserRepo from "../repositories/Users/UserRepository";
import { Privilege } from "../schemas/usersSchema";
import { ApolloContext } from "../server";
import {AuditLogsInput} from "../models/auditLogs/auditLogsInput";
import {EventType} from "../models/auditLogs/eventTypes";
import AuditLogResolvers from "./auditLogsResolver";

//TODO: Update all "args" parameters upon implementation
const UsersResolvers = {
  Query: {
    users: async () => {
      return await UserRepo.getUsers();
    },

    user: async (_: any, args: { id: number }) => {
      return await UserRepo.getUserByID(args.id);
    },
    currentUser: async (parent: any, args: any, context: ApolloContext) => {
      return context.getUser();
    },
  },

  Mutation: {
    updateStudentProfile: async (
        parent: any,
        args: {
          userID: number;
          pronouns: string;
          college: string;
          expectedGraduation: string;
        }, context: any
    ) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Updated Student Profile ID:" + args.userID
      }
      return await UserRepo.updateStudentProfile(args);
    },

    setPrivilege: async (
        _: any,
        { userID, privilege }: { userID: number; privilege: Privilege}, context: any
    ) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Set privilege level of user #" + userID + " to " + privilege
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await UserRepo.setPrivilege(userID, privilege);
    },

    addTraining: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Added training to user #" + args.userID
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      await UserRepo.addTrainingToUser(args.userID, args.trainingModuleID);
    },

    removeTraining: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Removed training from user #" + args.userID
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      await UserRepo.removeTrainingFromUser(args.userID, args.trainingModuleID);
    },

    addHold: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Added a hold to user #" + args.userID
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      await UserRepo.addHoldToUser(args.userID, args.holdID);
    },

    removeHold: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Removed hold from user #" + args.userID
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      await UserRepo.removeHoldFromUser(args.userID, args.holdID);
    },
  },
};

export default UsersResolvers;
