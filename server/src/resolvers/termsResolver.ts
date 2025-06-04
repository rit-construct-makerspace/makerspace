/**
 * termsResolver.ts
 * GraphQL Endpoint Implementations for the Terms value of the TextFields table
 */

import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { getDataPointByID, incrementDataPointValue, setDataPointValue } from "../repositories/DataPoints/DataPointsRepository.js";
import { getTerms, setTerms } from "../repositories/TextItems/TermsRepository.js";

const TermsResolver = {
  Query: {
    getTerms: async (
      _parent: any,
      _args: any) =>
        (await getTerms())?.value
  },

  Mutation: {
    setTerms: async (
      _parent: any,
      args: { value: string },
      { isManager }: ApolloContext) =>
      isManager(async () => {
        return (await setTerms(args.value));
      }),
  }
};

export default TermsResolver;