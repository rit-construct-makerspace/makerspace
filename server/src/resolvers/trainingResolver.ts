import * as ModuleRepo from "../repositories/Training/ModuleRepository";
import * as OptionRepo from "../repositories/Training/optionRepo";
import * as QuestionRepo from "../repositories/Training/questionRepo";

const TrainingResolvers = {
  Query: {
    modules: async (_: any, args: any, context: any) => {
      return await ModuleRepo.getModules();
    },

    module: (_: any, args: { id: number }, context: any) =>
      ModuleRepo.getModuleById(args.id),
  },

  TrainingModule: {
    items: (parent: any) => {
      return QuestionRepo.getQuestionsByModule(parent.id);
    },
  },

  Question: {
    options: (parent: any) => {
      return OptionRepo.getOptionsByQuestion(parent.id);
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

    deleteModule: async (_: any, args: { id: number }) => {
      await ModuleRepo.deleteModuleById(args.id);
    },

    /*
    Questions
    TODO: Rename these to Module Items, since they don't always have to be
      questions. They can be also be text, YouTube embeds, or image URLs.
     */

    addQuestion: (_: any, args: any) =>
      QuestionRepo.addQuestion(args.module_id, {
        text: args.question.text,
        type: args.question.type,
        id: undefined,
      }),

    updateQuestion: (_: any, args: any) =>
      QuestionRepo.updateQuestion(args.id, args.question),

    deleteQuestion: async (_: any, args: { id: number }) => {
      await QuestionRepo.deleteQuestion(args.id);
    },

    /*
    Question Options
     */

    addOption: async (_: any, args: any) => {
      return OptionRepo.addOptionToQuestion(args.question_id, args.option);
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
  },
};

export default TrainingResolvers;
