import { ApolloError } from "apollo-server-express";
import { ModuleRepo } from "../repositories/Training/ModuleRepository";
import { OptionRepo } from "../repositories/Training/optionRepo";
import { QuestionRepo } from "../repositories/Training/questionRepo";


const TrainingResolvers = {
  Query: {
    modules: async (_: any, args: any, context: any) => {
      try {
        const mr = new ModuleRepo()   //using the new keyword feels wrong
        return mr.getModules()
      } catch (e) {
        console.log("Error:", e);
      }
    },
  },

  Mutation: {
    createModule: async (_: any, args: any) => {
      try {
        const mr = new ModuleRepo()
        return mr.addModule({id: 0, name: args.name, items: []})  //id field is ignored :/
      } catch (e) {
        console.log("Error:", e);
      }
    },

    addQuestion: async (_: any, args: any) => {
      try {
        const qr = new QuestionRepo()
        return qr.addQuestionToModule(args.module_id, args.question)
      } catch (e) {
        console.log("Error:", e);
      }
    },

    addOption: async (_: any, args: any) => {
      try {
        const or = new OptionRepo()
        return or.addOptionToQuestion(args.question_id, args.option)
      } catch (e) {
        console.log("Error:", e);
      }
    }

  },
};

export default TrainingResolvers;
// updateModule(id: ID!, name: String): TrainingModule
// updateQuestion(id: ID!, question: QuestionInput): Question
// updateOption(id: ID!, option: QuestionOptionInput): QuestionOption
// deleteModule(id: ID!): TrainingModule
// deleteQuestion(id: ID!): Question
// deleteOption(id: ID!): QuestionOption
