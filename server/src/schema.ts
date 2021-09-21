import { makeExecutableSchema } from "@graphql-tools/schema";
import { ServiceTypeDefs } from "./service/serviceSchema";
import ServiceResolvers from "./service/serviceResolver";

export const schema = makeExecutableSchema({
  typeDefs: ServiceTypeDefs,
  resolvers: ServiceResolvers,
});
