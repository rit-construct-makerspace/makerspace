import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { getDataPointByID, incrementDataPointValue, setDataPointValue } from "../repositories/DataPoints/DataPointsRepository.js";

const DataPointsResolver = {
  Query: {
    dataPoint: async (
      _parent: any,
      args: {id: number},
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getDataPointByID(args.id);
      }),
  },

  Mutation: {
    setDataPointValue: async (
      _parent: any,
      args: { id: number, value: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.STAFF], async () => {
        return (await setDataPointValue(args.id, args.value));
      }),

  }
};

export default DataPointsResolver;