import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers } from '@graphql-tools/merge';
import { TrainingTypeDefs } from "./schemas/trainingSchema";
import { StoreFrontTypeDefs } from "./schemas/storeFrontSchema";
import trainingResolvers from "./resolvers/trainingResolver";
import storefrontResolvers from "./resolvers/storeFrontResolver";
import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars'

// for custom scalars such as Date
const resolveFunctions = { 
  DateTime: DateTimeResolver
}

const resolvers = [trainingResolvers, storefrontResolvers, resolveFunctions]

export const schema = makeExecutableSchema({
  typeDefs: [TrainingTypeDefs, StoreFrontTypeDefs, DateTimeTypeDefinition],
  resolvers: mergeResolvers(resolvers),
});
