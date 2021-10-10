import { ApolloError } from "apollo-server-express";

const TrainingResolvers = {
  Query: {
    getAllUsers: async (_: any, args: any) => {
      try {
        const mockUsers = [{ name: "xyz" }, { name: "abc" }];
        return mockUsers;
      } catch (error) {
        throw new ApolloError("Example Error message :)");
      }
    },
  },
};

export default TrainingResolvers;