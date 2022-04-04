import * as ModuleRepo from "../repositories/Training/ModuleRepository";
import { AnswerInput } from "../schemas/trainingSchema";
import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { getUsersFullName } from "./usersResolver";
import { addTrainingModuleAttemptToUser } from "../repositories/Users/UserRepository";
import { MODULE_PASSING_THRESHOLD } from "../constants";

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

        return module;
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
      _parent: any,
      args: { moduleID: number; answerSheet: AnswerInput[] },
      { ifAllowed, user }: ApolloContext
    ) => {
      return ifAllowed(
        [Privilege.ADMIN, Privilege.LABBIE, Privilege.MAKER],
        async (user) => {
          const module: any = await (
            await ModuleRepo.getModuleByID(args.moduleID)
          ).quiz;

          if (module.length === 0)
            throw Error("Provided module has no questions");

          let correct = 0,
            incorrect = 0;

          for (let question of module) {
            if (
              question.type !== "CHECKBOXES" &&
              question.type !== "MULTIPLE_CHOICE"
            )
              continue;

            let correctOptions = question.options.filter(function (
              option: any
            ) {
              return option.correct;
            });

            let correctOptionIds = correctOptions.map(function (option: any) {
              return option.id;
            });

            let submittedItem = args.answerSheet.find((item: any) => {
              return item.itemID === question.id;
            });

            if (submittedItem?.optionIDs === undefined) {
              incorrect++;
              continue;
            }

            const submittedOptionsSet = new Set(submittedItem.optionIDs);
            const correctOptionsSet = new Set(correctOptionIds);

            const areSetsEqual = (a: any, b: any) =>
              a.size === b.size && [...a].every((value) => b.has(value));

            if (areSetsEqual(submittedOptionsSet, correctOptionsSet)) correct++;
            else incorrect++;
          }

          const grade = (correct / (incorrect + correct)) * 100;

          addTrainingModuleAttemptToUser(
            user.id,
            args.moduleID,
            grade >= MODULE_PASSING_THRESHOLD
          );

          return grade;
        }
      );
    },
  },
};

export default TrainingResolvers;
