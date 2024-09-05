import { Privilege } from "../schemas/usersSchema.js";

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
  imageUrl: string;
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
  expirationDate: Date;
  summary: string;
}

export interface ModulesForEquipmentRow {
  id: number;
  equipmentID: number;
  moduleID: number;
}

export interface ReservationEventRow {
  id: number;
  reservationID: number;
  eventType: string;
  userID: number;
  dateTime: Date;
  payload: string;
}

export interface ReservationRow {
  id: number;
  makerID: number;
  createDate: Date;
  startTime: Date;
  endTime: Date;
  equipmentID: number;
  status: string;
  lastUpdated: Date;
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
  zoneID: number | null;
}

export interface DataPointsRow {
  id: number;
  label: string;
  value: number;
}

export interface TrainingModuleRow {
  id: number;
  name: string;
  quiz: TrainingModuleItem[];
  archived: boolean;
  reservationPrompt: ReservationPrompt;
}

// not a table but the json structure for a column on the table above
export interface TrainingModuleItem {
  id: string;
  type: string;
  text: string;
  options?: ModuleItemOption[];
}

export interface ReservationPrompt {
  promptText: string;
}

export interface ModuleItemOption {
  id: string;
  text: string;
  correct?: boolean;
}

export interface UserRow {
  id: number;
  firstName: string;
  lastName: string;
  pronouns: string;
  isStudent: boolean;
  privilege: Privilege;
  registrationDate: Date;
  expectedGraduation: string;
  college: string;
  universityID: string;
  setupComplete: boolean;
  ritUsername: string;
  archived: boolean;
  balance: string;
  cardTagID: string;
}

export interface ReaderRow {
  id: number;
  machineID: number;
  machineType: string;
  name: string;
  zone: string;
  temp: number;
  state: string;
  currentUID: string;
  recentSessionLength: number;
  lastStatusReason: string;
  scheduledStatusFreq: number;
  lastStatusTime: Date;
  helpRequested: boolean;
}

export interface AnnouncementRow {
  id: number;
  title: string;
  description: string;
}

export interface AccessCheckRow {
  id: number;
  userID: number;
  equipmentID: number;
  readyDate: Date;
  approved: boolean;
}

export interface ZoneHoursRow {
  id: number;
  zoneID: number | null;
  type: string;
  dayOfTheWeek: number;
  time: string;
}

export interface ZoneRow {
  id: number;
  name: string;
}

export interface RoomsForZonesRow {
  zoneID: number;
  roomID: number;
}

export interface EquipmentSessionRow {
  id: number;
  start: Date;
  equipmentID: number;
  userID: number;
  sessionLength: number;
}

declare module "knex/types/tables.js" {
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
    Readers: ReaderRow;
    AccessChecks: AccessCheckRow;
    Zones: ZoneRow;
    RoomsForZones: RoomsForZonesRow
    ZoneHours: ZoneHoursRow;
    DataPoints: DataPointsRow;
    EquipmentSessions: EquipmentSessionRow
  }
}
