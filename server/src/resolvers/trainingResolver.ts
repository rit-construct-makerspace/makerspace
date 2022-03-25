import * as ModuleRepo from "../repositories/Training/ModuleRepository";
import * as OptionRepo from "../repositories/Training/OptionRepository";
import * as ModuleItemRepo from "../repositories/Training/ModuleItemRepository";
import { ModuleSubmissionInput } from "../schemas/trainingSchema";

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
      await ModuleRepo.deleteModuleById(args.id);
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
      await ModuleItemRepo.deleteModuleItem(args.id),

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
      await OptionRepo.deleteOptionById(args.id);
    },

    submitModule: async (
      parent: any,
      args: { submission: ModuleSubmissionInput },
      context: any
    ) => {
      const submission = args.submission;
      const answers = await OptionRepo.getCorrectOptionsWithModuleItemByModule(
        submission.moduleID
      );
      if (!answers || answers.length === 0) {
        throw Error("Training module for provided ID has no correct answers");
      }
      let correct = 0,
        incorrect = 0;
      for (let correctAnswers of answers) {
        let submittedAnswers = submission.answers.find(
          (x) => x.moduleItemID == correctAnswers.moduleItemID
        );

        if (!submittedAnswers) {
          incorrect++;
          continue;
        }

        let areEqual =
          correctAnswers.correctOptionIDs.length ===
            submittedAnswers.selectedOptionIDs.length &&
          correctAnswers.correctOptionIDs.every(function (element) {
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
      console.log(correct);
      console.log(incorrect);
      return (correct / (correct + incorrect)) * 100;
    },
  },
};

export default TrainingResolvers;
