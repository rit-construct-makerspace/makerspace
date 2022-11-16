import { Privilege } from "../schemas/usersSchema";



export type RowIDType = string;

export interface AuditLogRow {
  id: string;
  dateTime: Date;
  message: string;
}

export interface EquipmentRow {
  id: string;
  name: string;
  addedAt: Date;
  inUse: boolean;
  roomID: string;
  archived: boolean;
}

export interface HoldRow {
  id: string;
  creatorID: string;
  removerID?: string;
  userID: string;
  description: string;
  createDate: Date;
  removeDate?: Date;
}

export interface InventoryItemRow {
  id: string;
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
  id: string;
  moduleID: string;
  makerID: string;
  submissionDate: Date;
  passed: boolean;
  expirationDate: Date;
}

export interface ModulesForEquipmentRow {
  id: string;
  equipmentID: string;
  moduleID: string;
}

export interface ReservationEventRow {
  id: string;
  reservationID: string;
  eventType: string;
  userID: string;
  dateTime: Date;
  payload: string;
}

export interface ReservationRow {
  id: string;
  makerID: string;
  createDate: Date;
  startTime: Date;
  endTime: Date;
  equipmentID: string;
  status: string;
  lastUpdated: Date;
}

export interface RoomSwipeRow {
  id: string;
  dateTime: number;
  roomID: string;
  userID: string;
}

export interface RoomRow {
  id: string;
  name: string;
  archived: boolean;
}

export interface TrainingModuleRow {
  id: string;
  name: string;
  quiz: TrainingModuleItem[];
  archived: boolean;
}

// not a table but the json structure for a column on the table above
export interface TrainingModuleItem {
  id: string;
  type: string;
  text: string;
  options?: ModuleItemOption[];
}

export interface ModuleItemOption {
  id: string;
  text: string;
  correct?: boolean;
}

export interface UserRow {
  id: string;
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
