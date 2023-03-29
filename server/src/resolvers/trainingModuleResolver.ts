import * as ModuleRepo from "../repositories/Training/ModuleRepository";
import { AnswerInput } from "../schemas/trainingModuleSchema";
import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { getUsersFullName } from "../repositories/Users/UserRepository";
import * as SubmissionRepo from "../repositories/Training/SubmissionRepository";
import { MODULE_PASSING_THRESHOLD } from "../constants";
import { TrainingModuleItem, TrainingModuleRow } from "../db/tables";
import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository";

const removeAnswersFromQuiz = (quiz: TrainingModuleItem[]) => {
  for (let item of quiz) {
    if (item.options) {
      for (let option of item.options) {
        delete option.correct;
      }
    }
  }
};

function submittedOptionIDsCorrect(
  correct: string[],
  submitted: string[] | undefined
) {
  if (!submitted || correct.length !== submitted.length) return false;

  for (let i = 0; i < correct.length; i++) {
    if (correct[i] !== submitted[i]) return false;
  }

  return true;
}

const TrainingModuleResolvers = {
  Query: {
    modules: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async (user) => {
        let modules = await ModuleRepo.getModulesWhereArchived(false);

        if (user.privilege === "MAKER")
          for (let module of modules) removeAnswersFromQuiz(module.quiz);

        return modules;
      }),

    module: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async (user) => {
        let module = await ModuleRepo.getModuleByIDWhereArchived(args.id, false);

        if (user.privilege === "MAKER") removeAnswersFromQuiz(module.quiz);

        return module;
      }),

    archivedModules: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        let modules = await ModuleRepo.getModulesWhereArchived(true);

        return modules;
      }),

    archivedModule: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        let module = await ModuleRepo.getModuleByIDWhereArchived(args.id, false);

        return module;
      }),
  },

  TrainingModule: {
    equipment: async (
      parent: TrainingModuleRow,
      _: any,
      { ifAuthenticated }: ApolloContext
    ) =>
      ifAuthenticated(async (user) => {
        return EquipmentRepo.getEquipmentForModule(parent.id);
      })
  },

  Mutation: {
    createModule: async (
      _parent: any,
      args: { name: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
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
      args: { id: string; name: string; quiz: object; reservationPrompt: object },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const module = await ModuleRepo.updateModule(
          Number(args.id),
          args.name,
          args.quiz,
          args.reservationPrompt
        );

        await createLog(
          "{user} updated the {module} module.",
          { id: user.id, label: getUsersFullName(user) },
          { id: module.id, label: module.name }
        );
      }),

    archiveModule: async (
      _parent: any,
      args: { id: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const module = await ModuleRepo.setModuleArchived(Number(args.id), true);

        await createLog(
          "{user} archived the {module} module.",
          { id: user.id, label: getUsersFullName(user) },
          { id: module.id, label: module.name }
        );
      }),

    publishModule: async (
      _parent: any,
      args: { id: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const module = await ModuleRepo.setModuleArchived(Number(args.id), false);

        await createLog(
          "{user} archived the {module} module.",
          { id: user.id, label: getUsersFullName(user) },
          { id: module.id, label: module.name }
        );
      }),

    submitModule: async (
      _parent: any,
      args: { moduleID: string; answerSheet: AnswerInput[] },
      { ifAllowed }: ApolloContext
    ) => {
      return ifAllowed(
        [Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF],
        async (user) => {
          const module = await ModuleRepo.getModuleByIDWhereArchived(Number(args.moduleID), false);

          if (!module || module.archived) {
            throw Error(`Cannot access module #${args.moduleID}`);
          }

          if (module.quiz.length === 0) {
              throw Error("Provided module has no questions");
          }

          let correct = 0;
          let incorrect = 0;

          const questions = module.quiz.filter((i) =>
            ["CHECKBOXES", "MULTIPLE_CHOICE"].includes(i.type)
          );

          for (let question of questions) {
            if (!question.options)
              throw Error(
                `Module Item ${question.id} of type ${question.type} has no options`
              );

            const correctOptionIDs = question.options
              .filter((o) => o.correct)
              .map((o) => o.id);

            const submittedOptionIDs = args.answerSheet.find(
              (item) => item.itemID === question.id
            )?.optionIDs;

            submittedOptionIDsCorrect(correctOptionIDs, submittedOptionIDs)
              ? correct++
              : incorrect++;
          }

          const grade = (correct / (incorrect + correct)) * 100;

          SubmissionRepo.addSubmission(
            user.id,
            Number(args.moduleID),
            grade >= MODULE_PASSING_THRESHOLD
          ).then(async (id) => {
            await createLog(
              `{user} submitted attempt of {module} with a grade of ${grade}.`,
              { id: user.id, label: getUsersFullName(user) },
              { id: args.moduleID, label: module.name }
            );

            return id;
          });
        }
      );
    },
  },
};

export default TrainingModuleResolvers;
