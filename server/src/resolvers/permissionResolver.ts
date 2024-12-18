/**
 * permissionResolver.ts
 * GraphQL endpoint implmenentations for Permissions
 */

import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { getDataPointByID, incrementDataPointValue, setDataPointValue } from "../repositories/DataPoints/DataPointsRepository.js";

const PermissionResolver = {
  Query: {
    /**
     * Return true if user is MENTOR or higher permission role
     * @returns true if user is MENTOR or higher permission role
     * @throws GraphQLError if not MENTOR or STAFF or is on hold
     */
    isMentorOrHigher: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return true;
      }),
  },
};

export default PermissionResolver;