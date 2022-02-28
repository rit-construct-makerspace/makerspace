import { Module } from "../models/training/module";
import { ModuleRepo } from "../repositories/Training/ModuleRepository";
import { OptionRepo } from "../repositories/Training/optionRepo";
import { QuestionRepo } from "../repositories/Training/questionRepo";

const TrainingResolvers = {
  Query: {
    modules: async (_: any, args: any, context: any) => {
      try {
        const mr = new ModuleRepo();
        return await mr.getModules();
      } catch (e) {
        console.log("Error:", e);
      }
    },

    module: (_: any, args: { id: number }, context: any) =>
      new ModuleRepo().getModuleById(args.id),
  },

  Mutation: {
    createModule: async (_: any, args: any) => {
      try {
        return await Module.create(args.name, []);
      } catch (e) {
        console.log("Error:", e);
      }
    },

    addQuestion: async (_: any, args: any) => {
      try {
        const qr = new QuestionRepo();
        return await qr.addQuestionToModule(args.module_id, {
          text: args.question.text,
          type: args.question.type,
          options: [],
          id: undefined,
        });
      } catch (e) {
        console.log("Error:", e);
      }
    },

    addOption: async (_: any, args: any) => {
      try {
        const or = new OptionRepo();
        return or.addOptionToQuestion(args.question_id, args.option);
      } catch (e) {
        console.log("Error:", e);
      }
    },

    updateModule: async (_: any, args: any) => {
      try {
        const mr = new ModuleRepo();
        const mod = await mr.getModuleById(args.id);
        mod.updateName(args.name);
        await mr.save(mod);
        return mod;
      } catch (e) {
        console.log("Error:", e);
      }
    },

    updateQuestion: async (_: any, args: any) => {
      try {
        const qr = new QuestionRepo();
        return await qr.addQuestionToModule(args.id, args.question);
      } catch (e) {
        console.log("Error:", e);
      }
    },

    updateOption: async (_: any, args: any) => {
      try {
        const or = new OptionRepo();
        let opt = {
          id: args.id,
          text: args.option.text,
          correct: args.option.correct,
        };
        await or.updateOption(opt);
        return opt;
      } catch (e) {
        console.log("Error:", e);
      }
    },

    deleteModule: async (_: any, args: any) => {
      try {
        const mr = new ModuleRepo();
        await mr.deleteModuleById(args.id);
      } catch (e) {
        console.log("Error", e);
      }
    },

    deleteQuestion: async (_: any, args: any) => {
      try {
        const qr = new QuestionRepo();
        await qr.deleteQuestionById(args.id);
      } catch (e) {
        console.log("Error", e);
      }
    },

    deleteOption: async (_: any, args: any) => {
      try {
        const or = new OptionRepo();
        await or.deleteOptionById(args.id);
      } catch (e) {
        console.log("Error", e);
      }
    },
  },
};

export default TrainingResolvers;
