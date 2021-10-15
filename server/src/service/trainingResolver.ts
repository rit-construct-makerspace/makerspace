import { ApolloError } from "apollo-server-express";
import { ModuleRepo } from "../repositories/Training/ModuleRepository";


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

      } catch (e) {
        console.log("Error:", e);
      }
    },
  },
};

export default TrainingResolvers;
