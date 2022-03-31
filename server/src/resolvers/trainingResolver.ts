import * as ModuleRepo from "../repositories/Training/ModuleRepository";
import { ModuleSubmissionInput } from "../schemas/trainingSchema";
import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { getUsersFullName } from "./usersResolver";

const TrainingResolvers = {
  Query: {
    modules: async (_parent: any, args: any, context: any) =>
      await ModuleRepo.getModules(),

    module: async (_parent: any, args: { id: number }, context: any) =>
      await ModuleRepo.getModuleByID(args.id),
  },

  Mutation: {
    createModule: async (
      _parent: any,
      args: { name: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.ADMIN], async (user) => {
        const module = await ModuleRepo.addModule(args.name);

        await createLog(
          "{user} created the {module} module.",
          { id: user.id, label: getUsersFullName(user) },
          { id: module.id, label: module.name }
        );
      }),

    updateModule: async (
      _parent: any,
      args: { id: number; name: string; quiz: object },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.ADMIN], async (user) => {
        const module = await ModuleRepo.updateModule(
          args.id,
          args.name,
          args.quiz
        );

        await createLog(
          "{user} updated the {module} module.",
          { id: user.id, label: getUsersFullName(user) },
          { id: module.id, label: module.name }
        );
      }),

    deleteModule: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.ADMIN], async (user) => {
        const module = await ModuleRepo.archiveModule(args.id);

        await createLog(
          "{user} deleted the {module} module.",
          { id: user.id, label: getUsersFullName(user) },
          { id: module.id, label: module.name }
        );
      }),

    submitModule: async (
      parent: any,
      args: { submission: ModuleSubmissionInput },
      { ifAllowed }: ApolloContext
    ) => {
      return ifAllowed(
        [Privilege.ADMIN, Privilege.LABBIE, Privilege.MAKER],
        async (user) => {
          return null;
        }
      );
    },
  },
};

export default TrainingResolvers;
