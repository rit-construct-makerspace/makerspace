import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers } from '@graphql-tools/merge';
import { TrainingTypeDefs } from "./schemas/trainingSchema";
import { StoreFrontTypeDefs } from "./schemas/storeFrontSchema";
import trainingResolvers from "./resolvers/trainingResolver";
import storefrontResolvers from "./resolvers/storeFrontResolver";
import { DateResolver } from 'graphql-scalars'

// for custom scalars such as Date
const resolveFunctions = { 
  Date: DateResolver
}

const resolvers = [trainingResolvers, storefrontResolvers, resolveFunctions]

export const schema = makeExecutableSchema({
  typeDefs: [TrainingTypeDefs, StoreFrontTypeDefs],
  resolvers: mergeResolvers(resolvers),
});
