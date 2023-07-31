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
  expirationDate: Date;
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
  email: string;
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
}

export interface AnnouncementRow {
  id: number;
  title: string;
  description: string;
}

export interface AvailabilityRow {
  id: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  userID: number;
}

declare module 'knex/types/tables' {
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
    Availability: AvailabilityRow;
  }
}
