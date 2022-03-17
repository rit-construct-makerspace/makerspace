import * as UserRepo from "../repositories/Users/UserRepository";
import { Privilege, StudentUserInput } from "../schemas/usersSchema";
import { createHash } from "crypto";
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
  },

  Mutation: {
    createStudentUser: async (_: any, { user }: { user: StudentUserInput }, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Created new student user " + user.firstName + " " + user.lastName
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      const hashedUniversityID = createHash("sha256")
        .update(user.universityID)
        .digest("hex");

      return await UserRepo.createStudentUser({
        ...user,
        universityID: hashedUniversityID,
      });
    },

    createFacultyUser: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Created new faculty user " + args.user.name
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return UserRepo.createStudentUser(args);
    },

    updateFacultyUser: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Updated faculty user " + args.user.name
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      await UserRepo.updateUser(args);
    },

    updateStudentUser: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Updated student user " + args.user.name
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      await UserRepo.updateUser(args);
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
