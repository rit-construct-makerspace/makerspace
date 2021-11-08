import { makeExecutableSchema } from "@graphql-tools/schema";
import { TrainingTypeDefs } from "./service/trainingSchema";
import ServiceResolvers from "./service/trainingResolver";

export const schema = makeExecutableSchema({
  typeDefs: TrainingTypeDefs,
  resolvers: ServiceResolvers,
});
