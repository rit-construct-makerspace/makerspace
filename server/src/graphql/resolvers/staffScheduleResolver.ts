import { ApolloContext } from "../../context.js";
import { GraphQLError } from "graphql";
import * as StaffShiftRepo from "../../database/repositories/Makerspaces/StaffShiftRepository.js";
import * as UserRepo from "../../database/repositories/Users/UserRepository.js";
import { UserRow } from "../../database/knex/tables.js";

const StaffScheduleResolver = {
  StaffShift: {
    user: async (parent: { userID: number; user?: UserRow }) =>
      parent.user ?? UserRepo.getUserByID(parent.userID)
  },

  Query: {
    makerspaceStaff: async (
      _parent: unknown,
      args: { makerspaceID: number },
      { isStaffFor }: ApolloContext
    ) => isStaffFor(args.makerspaceID, async () => StaffShiftRepo.getMakerspaceStaff(args.makerspaceID)),

    staffShifts: async (
      _parent: unknown,
      args: { makerspaceID: number; start: string; end: string },
      { isStaffFor }: ApolloContext
    ) => isStaffFor(args.makerspaceID, async () =>
      StaffShiftRepo.getStaffShifts(args.makerspaceID, args.start, args.end)
    )
  },

  Mutation: {
    createStaffShifts: async (
      _parent: unknown,
      args: {
        makerspaceID: number;
        shifts: StaffShiftRepo.StaffShiftInput[];
      },
      { isManagerFor }: ApolloContext
    ) => isManagerFor(args.makerspaceID, async () =>
      StaffShiftRepo.createStaffShifts(args.makerspaceID, args.shifts)
    ),

    updateStaffShift: async (
      _parent: unknown,
      args: { id: number; start: string; end: string },
      { isManagerFor }: ApolloContext
    ) => {
      const shift = await StaffShiftRepo.getStaffShiftByID(args.id);
      if (!shift) {
        throw new GraphQLError(`Shift ${args.id} does not exist`);
      }
      return isManagerFor(shift.makerspaceID, async () =>
        StaffShiftRepo.updateStaffShift(args.id, args.start, args.end)
      );
    },

    deleteStaffShift: async (
      _parent: unknown,
      args: { id: number },
      { isManagerFor }: ApolloContext
    ) => {
      const shift = await StaffShiftRepo.getStaffShiftByID(args.id);
      if (!shift) {
        throw new GraphQLError(`Shift ${args.id} does not exist`);
      }
      return isManagerFor(shift.makerspaceID, async () =>
        StaffShiftRepo.deleteStaffShift(args.id)
      );
    }
  }
};

export default StaffScheduleResolver;
