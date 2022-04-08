import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository";
import * as RoomRepo from "../repositories/Rooms/RoomRepository";
import * as ReservationRepo from "../repositories/Equipment/ReservationRepository";
import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { getUsersFullName } from "./usersResolver";
import { EquipmentRow, ReservationRow } from "../db/tables";
import { EquipmentInput } from "../schemas/equipmentSchema";
import {
  addDays,
  addMinutes,
  eachMinuteOfInterval,
  endOfToday,
  setHours,
  startOfToday,
} from "date-fns";
import {
  LAB_HOURS,
  TIMESLOT_ADVANCE_DAYS,
  TIMESLOT_DURATION,
} from "../constants";

function withinLabHours(timeslot: Date) {
  const labHours = LAB_HOURS[timeslot.getDay()];
  const labOpen = setHours(new Date(timeslot), labHours.open);
  const labClose = setHours(new Date(timeslot), labHours.close);
  return timeslot >= labOpen && timeslot <= labClose;
}

function noConflicts(timeslot: Date, existingReservations: ReservationRow[]) {
  const start = timeslot;
  const end = addMinutes(timeslot, TIMESLOT_DURATION - 1);

  return existingReservations.every((r) => {
    if (start >= r.startTime && start <= r.endTime) return false;
    if (end >= r.startTime && end <= r.endTime) return false;
    return !(r.startTime <= start && r.endTime >= end);
  });
}

const EquipmentResolvers = {
  Query: {
    equipments: async (_: any, args: any, context: any) => {
      return await EquipmentRepo.getEquipments();
    },

    equipment: async (_: any, args: { id: number }, context: any) => {
      return await EquipmentRepo.getEquipmentByID(args.id);
    },
  },

  Equipment: {
    room: (parent: EquipmentRow) => {
      return RoomRepo.getRoomByID(parent.roomID);
    },

    trainingModules: (parent: EquipmentRow) => {
      return EquipmentRepo.getModulesByEquipment(parent.id);
    },

    timeslots: async (parent: EquipmentRow) => {
      const start = startOfToday();
      const end = addDays(endOfToday(), TIMESLOT_ADVANCE_DAYS);

      const existingReservations =
        await ReservationRepo.getReservationsByEquipmentID(
          parent.id,
          start,
          end
        );

      return eachMinuteOfInterval({ start, end }, { step: TIMESLOT_DURATION })
        .filter(withinLabHours)
        .map((ts) => ({
          time: ts,
          available: noConflicts(ts, existingReservations),
        }));
    },
  },

  Mutation: {
    addEquipment: async (
      _parent: any,
      args: { equipment: EquipmentInput },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.ADMIN], async (user) => {
        const equipment = await EquipmentRepo.addEquipment(args.equipment);

        await createLog(
          "{user} created the {equipment} equipment.",
          { id: user.id, label: getUsersFullName(user) },
          { id: equipment.id, label: equipment.name }
        );

        return equipment;
      }),

    updateEquipment: async (
      _: any,
      args: { id: number; equipment: EquipmentInput },
      context: any
    ) => {
      return await EquipmentRepo.updateEquipment(args.id, args.equipment);
    },

    deleteEquipment: async (_: any, args: { id: number }, context: any) => {
      return await EquipmentRepo.archiveEquipment(args.id);
    },
  },
};

export default EquipmentResolvers;
