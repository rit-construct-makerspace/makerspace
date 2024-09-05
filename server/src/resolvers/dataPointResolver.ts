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
    dailySiteVisits: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getDataPointByID(1);
      }),
      incrementSiteVisits: async (
        _parent: any,
        _args: any,
        { ifAllowed }: ApolloContext) =>
        ifAllowed([Privilege.MENTOR, Privilege.MAKER, Privilege.STAFF], async () => {
          return (await incrementDataPointValue(1, 1));
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