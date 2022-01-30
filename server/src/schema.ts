import { makeExecutableSchema } from "@graphql-tools/schema";
import { TrainingTypeDefs } from "./schemas/trainingSchema";
import ServiceResolvers from "./resolvers/trainingResolver";

export const schema = makeExecutableSchema({
  typeDefs: TrainingTypeDefs,
  resolvers: ServiceResolvers,
});
