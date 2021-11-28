import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers } from '@graphql-tools/merge';
import { TrainingTypeDefs } from "./schemas/trainingSchema";
import { StoreFrontTypeDefs } from "./schemas/storeFrontSchema";
import ServiceResolvers from "./resolvers/trainingResolver";
import { DateResolver } from 'graphql-scalars'

// for custom scalars such as Date
const resolveFunctions = {
  Date: DateResolver
}

const resolvers = [ServiceResolvers, resolveFunctions]

export const schema = makeExecutableSchema({
  typeDefs: [TrainingTypeDefs, StoreFrontTypeDefs],
  resolvers: mergeResolvers(resolvers),
});
