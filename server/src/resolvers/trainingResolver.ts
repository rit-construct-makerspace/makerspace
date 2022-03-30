import * as ModuleRepo from "../repositories/Training/ModuleRepository";
import * as OptionRepo from "../repositories/Training/OptionRepository";
import * as ModuleItemRepo from "../repositories/Training/ModuleItemRepository";
import { ModuleSubmissionInput } from "../schemas/trainingSchema";
import { addTrainingModuleAttemptToUser } from "../repositories/Users/UserRepository";
import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";
import { MODULE_PASSING_THRESHOLD } from "../constants";

const TrainingResolvers = {
  Query: {
    modules: async (_: any, args: any, context: any) => {
      return await ModuleRepo.getModules();
    },

    module: (_: any, args: { id: string }, context: any) =>
      ModuleRepo.getModuleById(args.id),
  },

  TrainingModule: {
    items: (parent: any) => {
      return ModuleItemRepo.getModuleItemsByModule(parent.id);
    },
  },

  ModuleItem: {
    options: (parent: any) => {
      return OptionRepo.getOptionsByModuleItem(parent.id);
    },
  },

  Mutation: {
    /*
    Modules
     */

    createModule: async (_: any, args: any) => {
      const mod = await ModuleRepo.addModule(args.name);
      return mod;
    },

    updateModule: async (_: any, args: any) => {
      const mod = await ModuleRepo.updateName(args.id, args.name);
      return mod;
    },

    deleteModule: async (_: any, args: { id: number }, context: any) => {
      await ModuleRepo.archiveModule(args.id);
    },

    addModuleItem: async (_: any, args: any) =>
      await ModuleItemRepo.addModuleItem(args.moduleID, {
        text: args.moduleItem.text,
        type: args.moduleItem.type,
      }),

    updateModuleItem: async (_: any, args: any) => {
      await ModuleItemRepo.updateModuleItem(args.id, args.moduleItem);
      return await ModuleItemRepo.getModuleItem(args.id);
    },

    deleteModuleItem: async (_: any, args: { id: number }) =>
      await ModuleItemRepo.archiveModuleItem(args.id),

    /*
    ModuleItem Options
     */

    addOption: async (_: any, args: any) => {
      return OptionRepo.addOptionToModuleItem(args.moduleItemID, args.option);
    },

    updateOption: async (_: any, args: any) => {
      let opt = {
        id: args.id,
        text: args.option.text,
        correct: args.option.correct,
      };
      await OptionRepo.updateOption(opt);
      return opt;
    },

    deleteOption: async (_: any, args: { id: number }) => {
      await OptionRepo.archiveOption(args.id);
    },

    submitModule: async (
      parent: any,
      args: { submission: ModuleSubmissionInput },
      { ifAllowed }: ApolloContext
    ) => {
      return ifAllowed(
        [Privilege.ADMIN, Privilege.LABBIE, Privilege.MAKER],
        async (user) => {
          const submission = args.submission;
          const answerSheet =
            await OptionRepo.getAnswerSheet(
              submission.moduleID
            );
          if (!answerSheet || answerSheet.length === 0) {
            throw Error(
              "Training module for provided ID has no correct answers"
            );
          }
          let correct = 0,
            incorrect = 0;
          for (let moduleItemAnswer of answerSheet) {
            const submittedAnswers = submission.answers.find(
              (x) => x.moduleItemID == moduleItemAnswer.moduleItemID
            );

            if (!submittedAnswers) {
              incorrect++;
              continue;
            }

            const areEqual =
              moduleItemAnswer.correctOptionIDs.length ===
                submittedAnswers.selectedOptionIDs.length &&
              moduleItemAnswer.correctOptionIDs
                .map(String)
                .every(function (element) {
                  return (
                    submittedAnswers &&
                    submittedAnswers.selectedOptionIDs.includes(element)
                  );
                });

            if (areEqual) {
              correct++;
            } else {
              incorrect++;
            }
          }

          const finalScore = (correct / (correct + incorrect)) * 100;

          await addTrainingModuleAttemptToUser(
            user?.id,
            submission.moduleID,
            finalScore >= MODULE_PASSING_THRESHOLD
          );

          return finalScore;
        }
      );
    },
  },
};

export default TrainingResolvers;
