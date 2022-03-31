import { Privilege } from "../schemas/usersSchema";

export interface AuditLogRow {
  id: number;
  dateTime: Date;
  message: string;
}

export interface EquipmentRow {
  id: number;
  name: string;
  addedAt: Date;
  inUse: boolean;
  roomID: number;
  archived: boolean;
}

export interface HoldRow {
  id: number;
  creatorID: number;
  removerID?: number;
  userID: number;
  description: string;
  createDate: Date;
  removeDate?: Date;
}

export interface InventoryItemRow {
  id: number;
  image?: string;
  name: string;
  unit: string;
  pluralUnit: string;
  count: number;
  pricePerUnit: number;
  threshold: number;
  archived: boolean;
}

export interface ModuleSubmissionRow {
  id: number;
  moduleID: number;
  makerID: number;
  submissionDate: Date;
  passed: boolean;
}

export interface ModulesForEquipmentRow {
  id: number;
  equipmentID: number;
  moduleID: number;
}

export interface ReservationEventRow {
  id: number;
  reservationId: number; // TODO: rename to reservationID
  eventType: string;
  user: number; // TODO: rename to userID
  dateTime: Date;
  payload: string;
}

export interface ReservationRow {
  id: number;
  creator: number; // TODO: rename to creatorID
  maker: number; // TODO: rename to makerID
  labbie: number; // TODO: remove
  createDate: Date;
  startTime: Date;
  endTime: Date;
  equipment: number; // TODO: rename to equipmentID;
  status: string;
  lastUpdated: Date;
  archived: boolean;
}

export interface RoomSwipeRow {
  id: number;
  dateTime: number;
  roomID: number;
  userID: number;
}

export interface RoomRow {
  id: number;
  name: string;
  archived: boolean;
}

export interface TrainingModuleRow {
  id: number;
  name: string;
  quiz: object;
  archived: boolean;
}

export interface UserRow {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isStudent: boolean;
  privilege: Privilege;
  registrationDate: Date;
  expectedGraduation: string;
  college: string;
  universityID: string;
  setupComplete: boolean;
  ritUsername: string;
  pronouns: string;
  isArchived: boolean; // TODO: rename to archived
}

declare module "knex/types/tables" {
  interface Tables {
    AuditLogs: AuditLogRow;
    Equipment: EquipmentRow;
    Holds: HoldRow;
    InventoryItem: InventoryItemRow;
    ModuleSubmissions: ModuleSubmissionRow;
    ModulesForEquipment: ModulesForEquipmentRow;
    ReservationEvents: ReservationEventRow;
    Reservations: ReservationRow;
    RoomSwipes: RoomSwipeRow;
    Rooms: RoomRow;
    TrainingModule: TrainingModuleRow;
    Users: UserRow;
  }
}
